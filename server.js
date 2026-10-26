import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

// Health check endpoints for Cloud Run, GCP load balancers, and container liveness probes
app.get(['/healthz', '/_health', '/api/health', '/health'], (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

const distPath = path.resolve(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  // Serve static files from Vite build output directory
  app.use(express.static(distPath, {
    maxAge: '1h',
    etag: true,
    index: false
  }));

  // Fallback to index.html for Single Page Application client-side routing
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback message if dist has not yet been built
  app.get('*', (req, res) => {
    res.status(200).send('Application starting up. Please reload in a moment.');
  });
}

const server = app.listen(PORT, HOST, () => {
  console.log(`Production server running on http://${HOST}:${PORT}`);
});

// Graceful shutdown on SIGTERM/SIGINT
const shutdown = (signal) => {
  console.log(`Received ${signal}, closing server gracefully...`);
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
