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
import { downloadPrintableInvoice, copyBillWhatsAppText, printBillDocument } from '../utils/printInvoice';

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

  const handleCopyWhatsApp = async () => {
    const success = await copyBillWhatsAppText(bill);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
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

            {/* Copy for WhatsApp */}
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy bill summary to clipboard for WhatsApp"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </>
              )}
            </button>

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
                    <Phone className="w-3 h-3 text-emerald-700" /> Arun Kavinaya: +91 97909 74822
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
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="py-2.5 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'WhatsApp Bill'}</span>
              </button>

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
