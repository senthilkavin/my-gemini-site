import { SalesBill } from '../types';

/**
 * Formats a clean, professional WhatsApp text receipt for GokulaKrishnan Agencies.
 */
export const formatBillWhatsAppText = (bill: SalesBill): string => {
  const formattedDate = new Date(bill.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const lines = [
    `*🧾 GOKULAKRISHNAN AGENCIES*`,
    `*Wholesale Stockist & Commodity Merchant*`,
    `----------------------------------------`,
    `*Tax Invoice / Cash Bill:* #${bill.billNumber}`,
    `*Date:* ${formattedDate}`,
    `*Customer:* ${bill.customerName}${bill.customerPhone ? ` (${bill.customerPhone})` : ''}`,
    bill.customerAddress ? `*Location:* ${bill.customerAddress}` : '',
    `----------------------------------------`,
    `*ITEMS ORDERED:*`,
    ...bill.items.map(
      (item, i) =>
        `${i + 1}. *${item.productName}* (${item.packagingUnit})\n   Qty: ${item.quantity} x ₹${item.unitPriceINR.toLocaleString('en-IN')} = *₹${item.totalINR.toLocaleString('en-IN')}*`
    ),
    `----------------------------------------`,
    `Subtotal: ₹${bill.subtotalINR.toLocaleString('en-IN')}`,
    bill.discountINR > 0 ? `Discount: - ₹${bill.discountINR.toLocaleString('en-IN')}` : '',
    bill.taxGSTPercent > 0 ? `GST (${bill.taxGSTPercent}%): + ₹${bill.taxINR.toLocaleString('en-IN')}` : '',
    `*GRAND TOTAL:* ₹${bill.grandTotalINR.toLocaleString('en-IN')} (INR)`,
    `*Amount Received:* ₹${bill.amountPaidINR.toLocaleString('en-IN')} (INR)`,
    bill.balanceDueINR > 0
      ? `*Balance Due:* ₹${bill.balanceDueINR.toLocaleString('en-IN')} (INR)`
      : `*Payment Status:* FULLY PAID`,
    `Payment Mode: ${bill.paymentMode.replace('_', ' ').toUpperCase()}`,
    bill.paymentReference ? `Reference: ${bill.paymentReference}` : '',
    `----------------------------------------`,
    `*Billed By:* ${bill.billedBy}`,
    `*Proprietors Contact:*`,
    `Sahadevan: +91 94864 26294`,
    `Arun Kavinaya: +91 97909 74822`,
    `Thank you for your business!`,
  ]
    .filter(Boolean)
    .join('\n');

  return lines;
};

/**
 * Normalizes phone numbers for WhatsApp API (e.g. 10-digit Indian numbers -> 91XXXXXXXXXX).
 */
export const normalizeWhatsAppPhone = (phone?: string): string => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
};

/**
 * Generates direct WhatsApp click-to-chat URL with pre-filled bill message.
 * If customer phone is present, opens directly in chat with customer.
 * If phone is absent, opens WhatsApp with message ready to select any contact.
 */
export const getBillWhatsAppUrl = (bill: SalesBill): string => {
  const text = formatBillWhatsAppText(bill);
  const encodedText = encodeURIComponent(text);
  const phone = normalizeWhatsAppPhone(bill.customerPhone);

  if (phone) {
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
};

/**
 * Copies cleanly formatted WhatsApp receipt text to clipboard.
 */
export const copyBillWhatsAppText = async (bill: SalesBill): Promise<boolean> => {
  const lines = formatBillWhatsAppText(bill);

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(lines);
      return true;
    }
    throw new Error('Clipboard API not available');
  } catch {
    // Fallback for older browsers / iframe contexts
    try {
      const textArea = document.createElement('textarea');
      textArea.value = lines;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  }
};

/**
 * Opens WhatsApp directly with the preloaded bill and copies text to clipboard as backup.
 */
export const openBillInWhatsApp = (bill: SalesBill): void => {
  const url = getBillWhatsAppUrl(bill);
  copyBillWhatsAppText(bill).catch(() => {});

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates a complete, self-contained, standalone printable HTML invoice for GokulaKrishnan Agencies.
 * Includes embedded CSS, clean table styling, signature blocks, and auto-print triggers.
 */
export const generatePrintableInvoiceHtml = (bill: SalesBill): string => {
  const formattedDate = new Date(bill.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const itemsRows = bill.items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; font-family: monospace; color: #78716c;">${idx + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; font-weight: bold; color: #1c1917;">
          ${item.productName}
          <span style="display: block; font-size: 10px; color: #78716c; font-weight: normal; text-transform: uppercase;">[${item.category.replace('_', ' ')}]</span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; color: #57534e; font-family: monospace;">${item.packagingUnit}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; text-align: center; font-family: monospace; font-weight: bold; color: #1c1917;">${item.quantity}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace;">₹${item.unitPriceINR.toLocaleString('en-IN')}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace; font-weight: bold; color: #1c1917;">₹${item.totalINR.toLocaleString('en-IN')}</td>
      </tr>
    `
    )
    .join('');

  const whatsAppUrl = getBillWhatsAppUrl(bill);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${bill.billNumber} - GokulaKrishnan Agencies</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #1c1917;
      background: #f5f5f4;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e7e5e4;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .print-toolbar {
      background: #1c1917;
      color: #ffffff;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
    .print-btn {
      background: #059669;
      color: #ffffff;
      border: none;
      padding: 9px 18px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(5,150,105,0.4);
      transition: background 0.2s;
      text-decoration: none;
    }
    .print-btn:hover {
      background: #10b981;
    }
    .whatsapp-btn {
      background: #16a34a;
      box-shadow: 0 4px 12px rgba(22,163,74,0.4);
    }
    .whatsapp-btn:hover {
      background: #22c55e;
    }
    .invoice-body {
      padding: 36px 40px;
    }
    .badge {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 900;
      letter-spacing: 1px;
      color: #065f46;
      background: #d1fae5;
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-block;
    }
    .title {
      font-size: 26px;
      font-weight: 900;
      font-family: Georgia, serif;
      margin: 6px 0 2px 0;
      color: #1c1917;
    }
    .subtitle {
      font-size: 11px;
      color: #57534e;
      margin: 0;
      font-weight: 500;
    }
    .contacts {
      font-family: monospace;
      font-size: 12px;
      font-weight: 600;
      color: #44403c;
      margin-top: 8px;
    }
    .bill-meta {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 12px 16px;
      text-align: right;
      font-family: monospace;
      font-size: 12px;
    }
    .customer-box {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 14px;
      padding: 16px;
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin: 20px 0;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      overflow: hidden;
    }
    th {
      background: #1c1917;
      color: #ffffff;
      padding: 10px 12px;
      text-align: left;
      font-weight: bold;
    }
    .summary-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-top: 16px;
      font-size: 12px;
    }
    .summary-box {
      width: 260px;
      font-family: monospace;
      font-size: 12px;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      color: #57534e;
    }
    .grand-total {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-top: 2px solid #1c1917;
      font-size: 16px;
      font-weight: 900;
      color: #1c1917;
      margin-top: 4px;
    }
    .amount-paid {
      display: flex;
      justify-content: space-between;
      background: #d1fae5;
      color: #065f46;
      padding: 6px 10px;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 6px;
    }
    .balance-due {
      display: flex;
      justify-content: space-between;
      background: #fee2e2;
      color: #991b1b;
      padding: 6px 10px;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 4px;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e7e5e4;
      font-size: 11px;
      color: #57534e;
    }
    .sig-line {
      width: 180px;
      border-bottom: 1px dashed #a8a29e;
      height: 36px;
      margin-bottom: 6px;
    }
    @media print {
      .print-toolbar, .no-print {
        display: none !important;
      }
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .invoice-wrapper {
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
      }
      .invoice-body {
        padding: 0 !important;
      }
    }
  </style>
  <script>
    window.addEventListener('load', function() {
      // Auto-trigger print when file is opened directly
      setTimeout(function() {
        try {
          window.print();
        } catch (e) {
          console.warn('Auto print deferred');
        }
      }, 500);
    });
  </script>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="print-toolbar no-print">
      <div>
        <strong>Official Sales Invoice • #${bill.billNumber}</strong>
        <span style="opacity: 0.7; margin-left: 8px;">GokulaKrishnan Agencies</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <a class="print-btn whatsapp-btn" href="${whatsAppUrl}" target="_blank" rel="noopener noreferrer">
          💬 WhatsApp Bill
        </a>
        <button class="print-btn" onclick="window.print()">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>

    <div class="invoice-body">
      <!-- Header -->
      <div style="border-bottom: 2px solid #1c1917; padding-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
        <div>
          <span class="badge">Authorized Merchant &amp; Wholesale Stockist</span>
          <h1 class="title">GokulaKrishnan Agencies</h1>
          <p class="subtitle">Ordinary Building Cements (OPC 53/43/PPC) • Insecticides • Pesticides • Weedicides • Ant &amp; Rat Poison</p>
          <div class="contacts">
            <span>Sahadevan: +91 94864 26294</span> &nbsp;•&nbsp; <span>Arun Kavinaya: +91 97909 74822</span>
          </div>
        </div>

        <div class="bill-meta">
          <div style="color: #78716c; font-size: 10px; text-transform: uppercase; font-weight: bold;">Tax Invoice / Cash Bill</div>
          <div style="font-weight: 900; font-size: 15px; color: #1c1917;">${bill.billNumber}</div>
          <div style="color: #57534e;">Date: ${formattedDate}</div>
          <div style="color: #57534e;">Billed By: <strong style="color: #1c1917;">${bill.billedBy}</strong></div>
        </div>
      </div>

      <!-- Customer Box -->
      <div class="customer-box">
        <div>
          <span style="font-size: 10px; text-transform: uppercase; font-weight: 900; color: #a8a29e; display: block;">Bill To Customer:</span>
          <div style="font-size: 15px; font-weight: 800; color: #1c1917; margin-top: 2px;">${bill.customerName}</div>
          <div style="font-family: monospace; font-weight: 600; color: #44403c;">${bill.customerPhone}</div>
          ${bill.customerAddress ? `<div style="color: #57534e; margin-top: 3px;">${bill.customerAddress}</div>` : ''}
        </div>

        <div style="text-align: right;">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: 900; color: #a8a29e; display: block;">Payment Mode &amp; Status:</span>
          <div style="font-weight: 800; text-transform: uppercase; margin-top: 2px; color: #1c1917;">${bill.paymentMode.replace('_', ' ')}</div>
          <div style="margin-top: 4px;">
            <span style="font-size: 11px; font-weight: 700; background: ${bill.paymentStatus === 'paid' ? '#d1fae5' : '#fee2e2'}; color: ${bill.paymentStatus === 'paid' ? '#065f46' : '#991b1b'}; padding: 2px 8px; border-radius: 9999px;">
              ${bill.paymentStatus === 'paid' ? '✓ Fully Paid (INR)' : bill.paymentStatus === 'partial' ? '⚠ Partial Payment' : '✕ Credit / Balance Due'}
            </span>
          </div>
          ${bill.paymentReference ? `<div style="font-size: 11px; font-family: monospace; color: #78716c; margin-top: 3px;">Ref: ${bill.paymentReference}</div>` : ''}
        </div>
      </div>

      <!-- Line Items Table -->
      <table>
        <thead>
          <tr>
            <th style="width: 40px;">#</th>
            <th>Item Description</th>
            <th style="width: 120px;">Packaging</th>
            <th style="width: 60px; text-align: center;">Qty</th>
            <th style="width: 100px; text-align: right;">Rate (₹)</th>
            <th style="width: 110px; text-align: right;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Calculations Summary -->
      <div class="summary-grid">
        <div style="max-w: 380px; color: #78716c;">
          <p style="margin: 0 0 6px 0;"><strong>Declaration:</strong> Goods once sold are genuine and dispatched in factory sealed conditions from GokulaKrishnan Agencies warehouse.</p>
          ${bill.notes ? `<p style="background: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 6px 10px; border-radius: 8px; margin: 4px 0;"><strong>Notes:</strong> ${bill.notes}</p>` : ''}
        </div>

        <div class="summary-box">
          <div class="summary-line">
            <span>Subtotal:</span>
            <span>₹${bill.subtotalINR.toLocaleString('en-IN')}</span>
          </div>
          ${bill.discountINR > 0 ? `<div class="summary-line" style="color: #047857;"><span>Discount:</span><span>- ₹${bill.discountINR.toLocaleString('en-IN')}</span></div>` : ''}
          ${bill.taxGSTPercent > 0 ? `<div class="summary-line"><span>GST (${bill.taxGSTPercent}%):</span><span>+ ₹${bill.taxINR.toLocaleString('en-IN')}</span></div>` : ''}
          <div class="grand-total">
            <span>Grand Total:</span>
            <span>₹${bill.grandTotalINR.toLocaleString('en-IN')}</span>
          </div>
          <div class="amount-paid">
            <span>Amount Received:</span>
            <span>₹${bill.amountPaidINR.toLocaleString('en-IN')}</span>
          </div>
          ${bill.balanceDueINR > 0 ? `<div class="balance-due"><span>Balance Due:</span><span>₹${bill.balanceDueINR.toLocaleString('en-IN')}</span></div>` : ''}
        </div>
      </div>

      <!-- Signatures -->
      <div class="signatures">
        <div>
          <div class="sig-line"></div>
          <strong>Customer Signature</strong>
        </div>
        <div style="text-align: right;">
          <div class="sig-line" style="display: flex; align-items: flex-end; justify-content: flex-end; font-family: serif; font-style: italic; font-weight: bold; color: #292524;">
            ${bill.billedBy}
          </div>
          <strong style="color: #1c1917;">For GokulaKrishnan Agencies</strong>
          <div style="font-size: 10px; color: #78716c;">Authorized Signatory</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Downloads a standalone, self-printing invoice HTML file.
 */
export const downloadPrintableInvoice = (bill: SalesBill): void => {
  try {
    const html = generatePrintableInvoiceHtml(bill);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GokulaKrishnan_Bill_${bill.billNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('Failed to download invoice', err);
  }
};

/**
 * Opens a dedicated hidden print frame containing ONLY the Bill and triggers printing.
 * This guarantees that only the bill is printed and never any page chrome, dashboard, or background.
 */
export const printBillDocument = (bill: SalesBill): void => {
  const existingFrame = document.getElementById('gka-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'gka-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const html = generatePrintableInvoiceHtml(bill);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Iframe print deferred, calling window.print', e);
        window.print();
      }
    }, 350);
  } else {
    window.print();
  }
};
