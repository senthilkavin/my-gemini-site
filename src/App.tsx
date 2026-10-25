import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { ProductsSection } from './components/ProductsSection';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { BillPrintModal } from './components/BillPrintModal';
import { Footer } from './components/Footer';
import { CheckCircle2, Phone, Building2, LayoutDashboard, Lock, Receipt } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toast,
    isAdminLoggedIn,
    setIsLoginModalOpen,
    selectedBillForPrint,
    setSelectedBillForPrint,
  } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-emerald-600 selection:text-white pb-16 sm:pb-0">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-medium leading-snug">{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeSection />}
        {activeTab === 'about' && <AboutSection />}
        {activeTab === 'products' && <ProductsSection />}
        {activeTab === 'contact' && <ContactSection />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Direct Call & Owner Action Bar for All Devices */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 p-2 flex items-center justify-between gap-2 shadow-2xl">
        <a
          href="tel:+919486426294"
          className="flex-1 py-2 px-2 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow"
        >
          <Phone className="w-3.5 h-3.5" /> Sahadevan
        </a>

        <a
          href="tel:+919790974822"
          className="flex-1 py-2 px-2 rounded-xl bg-stone-800 active:bg-stone-700 text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1 border border-stone-700 shadow"
        >
          <Phone className="w-3.5 h-3.5" /> Arun
        </a>

        {isAdminLoggedIn ? (
          <button
            onClick={() => setActiveTab('admin')}
            className="p-2 rounded-xl bg-amber-500 text-stone-950 font-bold"
            title="Owner Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300"
            title="Owner Login"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Admin Login Modal for Owners */}
      <AdminLoginModal />

      {/* Global Bill Print Modal (Accessible anywhere across the app) */}
      <BillPrintModal
        bill={selectedBillForPrint}
        onClose={() => setSelectedBillForPrint(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
