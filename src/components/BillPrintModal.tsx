import React, { useEffect, useState } from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Share2,
  Copy,
} from 'lucide-react';
import { SalesBill } from '../types';
import {
  downloadPrintableInvoice,
  copyBillWhatsAppText,
  printBillDocument,
  getBillWhatsAppUrl,
  openBillInWhatsApp,
} from '../utils/printInvoice';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.12 13.27 14.9 13.19C14.67 13.11 14.51 13.07 14.35 13.31C14.19 13.56 13.72 14.11 13.58 14.27C13.43 14.44 13.29 14.46 13.05 14.34C12.8 14.21 11.99 13.95 11.04 13.1C10.3 12.44 9.8 11.62 9.65 11.38C9.51 11.14 9.64 11 9.76 10.88C9.87 10.77 10.01 10.59 10.14 10.44C10.26 10.29 10.3 10.18 10.38 10.02C10.46 9.85 10.42 9.71 10.36 9.59C10.3 9.47 9.83 8.31 9.63 7.84C9.43 7.38 9.24 7.44 9.09 7.43C8.95 7.43 8.78 7.33 8.53 7.33Z" />
  </svg>
);

interface BillPrintModalProps {
  bill: SalesBill | null;
  onClose: () => void;
}

export const BillPrintModal: React.FC<BillPrintModalProps> = ({ bill, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [printTip, setPrintTip] = useState<string | null>(null);

  // Keyboard shortcut listener: Ctrl+P or Cmd+P triggers print, Esc closes modal
  useEffect(() => {
    if (!bill) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handlePrint();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bill, onClose]);

  if (!bill) return null;

  const handlePrint = () => {
    setPrintTip('Sending official bill to printer...');
    printBillDocument(bill);
    setPrintTip('Print preview opened! ONLY the Official Bill is being printed.');
    setTimeout(() => setPrintTip(null), 4000);
  };

  const handleDownload = () => {
    downloadPrintableInvoice(bill);
    setPrintTip('Downloaded standalone print-ready invoice! Double-click to open and print.');
    setTimeout(() => setPrintTip(null), 4000);
  };

  const handleOpenWhatsApp = (e?: React.MouseEvent) => {
    // Also copy bill text to clipboard so it's always available
    copyBillWhatsAppText(bill);
    setCopied(true);
    setPrintTip(
      bill.customerPhone
        ? `Opening WhatsApp with bill for ${bill.customerName} (${bill.customerPhone}). Message is loaded, ready to send!`
        : 'Opening WhatsApp with bill summary preloaded, ready to send!'
    );
    setTimeout(() => {
      setCopied(false);
      setPrintTip(null);
    }, 5000);
  };

  return (
    <div
      id="bill-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 print:p-0 print:bg-white"
    >
      <div
        id="bill-modal-card"
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in zoom-in-95 print:shadow-none print:border-none print:rounded-none"
      >
        {/* Modal Controls Toolbar (Hidden during print) */}
        <div className="bg-stone-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block">
                Official Sales Bill • #{bill.billNumber}
              </span>
              <span className="text-[10px] text-stone-400">
                GokulaKrishnan Agencies Tax Receipt (INR)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Print Button in Toolbar */}
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              title="Print bill or save as PDF (Ctrl + P)"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print Bill</span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-800/80 px-1 py-0.5 rounded font-mono text-emerald-200">
                Ctrl+P
              </span>
            </button>

            {/* Guaranteed Download Invoice Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download standalone self-printing invoice file (HTML / PDF)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download File</span>
            </button>

            {/* Direct Open WhatsApp Button */}
            <a
              href={getBillWhatsAppUrl(bill)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenWhatsApp}
              className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title={
                bill.customerPhone
                  ? `Open WhatsApp with bill for ${bill.customerName} (${bill.customerPhone})`
                  : 'Open WhatsApp with preloaded bill summary'
              }
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Opened!</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </>
              )}
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Feedback Notification Strip */}
        {printTip && (
          <div className="bg-emerald-50 text-emerald-950 border-b border-emerald-200 px-4 py-2.5 text-xs flex items-center justify-between gap-2 print:hidden animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{printTip}</span>
            </div>
            <button
              type="button"
              onClick={() => setPrintTip(null)}
              className="text-stone-400 hover:text-stone-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-900 bg-white" id="printable-bill">
          {/* Quick Print & Download Action Strip on Bill (Hidden on Print) */}
          <div className="print:hidden bg-stone-50 border border-stone-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Printer className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Sales receipt for customer <strong className="text-stone-900">{bill.customerName}</strong> ready for print.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="py-1.5 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" /> Print Bill Now
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Download printable invoice HTML file"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Save Offline
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="border-b-2 border-stone-900 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Authorized Merchant &amp; Wholesale Stockist
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif mt-1">
                  GokulaKrishnan Agencies
                </h1>
                <p className="text-xs text-stone-600 font-medium mt-0.5">
                  Ordinary Building Cements (OPC 53/43/PPC) • Insecticides • Pesticides • Weedicides • Ant &amp; Rat Poison
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700 mt-2 font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-700" /> Sahadevan: +91 94864 26294
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-700" /> Arun Kavinaya: +91 97909 24822
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono text-xs space-y-1 bg-stone-50 p-3 rounded-2xl border border-stone-200 shrink-0">
                <div className="text-stone-500 uppercase text-[10px] font-bold">Tax Invoice / Cash Bill</div>
                <div className="font-extrabold text-sm text-stone-900">{bill.billNumber}</div>
                <div className="text-stone-600">
                  Date: {new Date(bill.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-stone-600">
                  Billed By: <strong className="text-stone-900">{bill.billedBy}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-black block">Bill To Customer:</span>
              <div className="font-extrabold text-stone-900 text-sm mt-0.5">{bill.customerName}</div>
              <div className="font-mono text-stone-700 font-semibold">{bill.customerPhone}</div>
              {bill.customerAddress && (
                <div className="text-stone-600 mt-1">{bill.customerAddress}</div>
              )}
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-stone-400 uppercase font-black block">Payment Mode &amp; Status:</span>
              <div className="font-extrabold text-stone-900 uppercase mt-0.5">
                {bill.paymentMode.replace('_', ' ')}
              </div>
              <div className="mt-1">
                {bill.paymentStatus === 'paid' ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> Fully Paid (INR)
                  </span>
                ) : bill.paymentStatus === 'partial' ? (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold text-[11px]">
                    <AlertCircle className="w-3 h-3" /> Partial Payment (Balance Due)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold text-[11px]">
                    Credit / Balance Due (INR)
                  </span>
                )}
              </div>
              {bill.paymentReference && (
                <div className="text-[11px] font-mono text-stone-500 mt-1">
                  Ref: {bill.paymentReference}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-900 text-white font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Packaging</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate (INR / ₹)</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR / ₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {bill.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono text-stone-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">
                      {item.productName}
                      <span className="block text-[10px] text-stone-500 font-normal uppercase">
                        [{item.category.replace('_', ' ')}]
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 font-mono">{item.packagingUnit}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-stone-900">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      ₹{item.unitPriceINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                      ₹{item.totalINR.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-stone-500 max-w-sm space-y-1">
              <p>
                <strong>Declaration:</strong> Goods once sold are genuine and dispatched in factory sealed conditions from GokulaKrishnan Agencies warehouse.
              </p>
              {bill.notes && (
                <p className="bg-amber-50 p-2 rounded-xl text-amber-900 border border-amber-200 text-[11px]">
                  <strong>Notes:</strong> {bill.notes}
                </p>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>₹{bill.subtotalINR.toLocaleString('en-IN')}</span>
              </div>
              {bill.discountINR > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>- ₹{bill.discountINR.toLocaleString('en-IN')}</span>
                </div>
              )}
              {bill.taxGSTPercent > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>GST ({bill.taxGSTPercent}%):</span>
                  <span>+ ₹{bill.taxINR.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base text-stone-900 pt-2 border-t border-stone-900">
                <span>Grand Total:</span>
                <span>₹{bill.grandTotalINR.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                <span>Amount Received:</span>
                <span>₹{bill.amountPaidINR.toLocaleString('en-IN')}</span>
              </div>

              {bill.balanceDueINR > 0 && (
                <div className="flex justify-between text-rose-700 font-bold bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                  <span>Balance Due:</span>
                  <span>₹{bill.balanceDueINR.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs text-stone-600">
            <div>
              <div className="h-10 border-b border-dashed border-stone-300"></div>
              <div className="mt-1 font-bold">Customer Signature</div>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-dashed border-stone-300 flex items-end justify-end">
                <span className="font-serif italic font-bold text-stone-800">{bill.billedBy}</span>
              </div>
              <div className="mt-1 font-bold text-stone-900">For GokulaKrishnan Agencies</div>
              <div className="text-[10px] text-stone-500">Authorized Signatory</div>
            </div>
          </div>

          {/* Bottom Action Footer on Bill Paper (Hidden on Print) */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="text-xs text-stone-500 font-medium">
              Standard A4 Receipt • Select <strong className="text-stone-700">"Save as PDF"</strong> or download offline file
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <a
                href={getBillWhatsAppUrl(bill)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpenWhatsApp}
                className="py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title={
                  bill.customerPhone
                    ? `Open WhatsApp with bill for ${bill.customerName} (${bill.customerPhone})`
                    : 'Open WhatsApp with preloaded bill summary ready to send'
                }
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                <span>{copied ? 'WhatsApp Opened!' : 'WhatsApp Bill'}</span>
              </a>

              <button
                type="button"
                onClick={handleDownload}
                className="py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                title="Download printable invoice HTML file"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Bill</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Print Bill (INR)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-3.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
