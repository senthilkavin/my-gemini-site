import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  CheckCircle2,
  Phone,
  Building2,
  MapPin,
  CreditCard,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMode } from '../types';
import {
  getProductPackagingType,
  getPackagingUnitName,
  getPackagingUnitSingular,
} from '../utils/productUtils';

export const ConsumerPurchaseModal: React.FC = () => {
  const { consumerPurchaseProduct, setConsumerPurchaseProduct, consumerPurchase } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (consumerPurchaseProduct) {
      setQuantity(1);
      setPaymentMode('cash');
      setIsSubmitting(false);
    }
  }, [consumerPurchaseProduct]);

  if (!consumerPurchaseProduct) return null;

  const product = consumerPurchaseProduct;
  const packagingType = getProductPackagingType(product);
  const unitLabel = getPackagingUnitName(product);
  const unitSingular = getPackagingUnitSingular(product);
  const availableStock = product.currentStock;
  const unitPrice = product.unitPriceINR > 0 ? product.unitPriceINR : 380;
  const totalPayableINR = quantity * unitPrice;
  const remainingAfterPurchase = Math.max(0, availableStock - quantity);

  const handleQuickAdd = (amount: number) => {
    setQuantity((prev) => Math.min(availableStock, Math.max(1, prev + amount)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    if (!customerPhone.trim()) return;
    if (quantity <= 0 || quantity > availableStock) return;

    setIsSubmitting(true);

    try {
      consumerPurchase({
        productId: product.id,
        quantity,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim() || 'Direct Godown Counter Pickup',
        paymentMode,
        amountPaidINR: totalPayableINR,
        notes: `Consumer Purchase: ${quantity} ${unitLabel} (${product.name})`,
      });
      setConsumerPurchaseProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-auto space-y-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] tracking-wide uppercase flex items-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5" /> Consumer Direct Purchase
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  packagingType === 'bags'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : packagingType === 'litres'
                    ? 'bg-sky-50 text-sky-900 border-sky-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                Auto-Deducts: {unitLabel}
              </span>
            </div>
            <h2 className="text-xl font-black text-stone-900 font-serif leading-tight">
              {product.name}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              {product.brand} • Packaging: <strong>{product.packagingUnit || unitLabel}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setConsumerPurchaseProduct(null)}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Stock & Unit Deduction Badge Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white p-4 rounded-2xl border border-stone-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-300 font-bold flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Live Godown Inventory:
            </span>
            <span className="text-emerald-400 font-mono font-black text-sm bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
              {availableStock} {unitLabel} Available
            </span>
          </div>

          <div className="pt-2 border-t border-stone-700/80 flex items-center justify-between text-[11px]">
            <span className="text-stone-300">
              Purchasing: <strong className="text-amber-300">{quantity} {quantity === 1 ? unitSingular : unitLabel}</strong>
            </span>
            <span className="text-stone-300">
              Godown Stock Remaining After Sale:{' '}
              <strong className="text-emerald-300 font-mono font-bold">
                {remainingAfterPurchase} {unitLabel}
              </strong>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Quantity Selector */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-stone-800 text-xs">
                Select Purchase Quantity ({unitLabel}) *
              </label>
              <span className="text-[11px] font-bold text-stone-500">
                Rate: ₹{unitPrice.toLocaleString('en-IN')} / {unitSingular} (INR)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="px-3.5 py-2 hover:bg-stone-100 disabled:opacity-40 text-stone-800 font-black text-sm cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(availableStock, Math.max(1, val)));
                  }}
                  className="w-16 py-2 text-center font-mono font-black text-stone-900 border-x border-stone-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(availableStock, prev + 1))}
                  disabled={quantity >= availableStock}
                  className="px-3.5 py-2 hover:bg-stone-100 disabled:opacity-40 text-stone-800 font-black text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Quick add pill buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {availableStock >= 5 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(5)}
                    className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-emerald-50 text-stone-700 font-bold border border-stone-300 hover:border-emerald-500 transition-colors cursor-pointer"
                  >
                    +5
                  </button>
                )}
                {availableStock >= 10 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(10)}
                    className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-emerald-50 text-stone-700 font-bold border border-stone-300 hover:border-emerald-500 transition-colors cursor-pointer"
                  >
                    +10
                  </button>
                )}
                {availableStock >= 25 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(25)}
                    className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-emerald-50 text-stone-700 font-bold border border-stone-300 hover:border-emerald-500 transition-colors cursor-pointer"
                  >
                    +25
                  </button>
                )}
                {availableStock >= 50 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(50)}
                    className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-emerald-50 text-stone-700 font-bold border border-stone-300 hover:border-emerald-500 transition-colors cursor-pointer"
                  >
                    +50
                  </button>
                )}
              </div>
            </div>

            {/* Calculated Total Bar */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-600 font-semibold">Total Amount in Indian Rupees:</span>
              <span className="text-base font-black text-emerald-800 font-mono">
                ₹{totalPayableINR.toLocaleString('en-IN')} (INR)
              </span>
            </div>
          </div>

          {/* Consumer Contact Details */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-stone-800 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Consumer &amp; Billing Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Consumer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Murugan / Farmer / Contractor"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Mobile Number (For WhatsApp Bill) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98421 55670"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Site / Village / Delivery Address
              </label>
              <input
                type="text"
                placeholder="e.g. Main Road, Paramathi Velur, Namakkal"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="font-extrabold text-stone-800 block text-xs uppercase tracking-wide">
              Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('cash')}
                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  paymentMode === 'cash'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Cash / COD
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  paymentMode === 'upi'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                UPI Payment
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('bank_transfer')}
                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  paymentMode === 'bank_transfer'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Bank Transfer
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setConsumerPurchaseProduct(null)}
              className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || quantity <= 0 || availableStock <= 0}
              className="py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Purchase &amp; Deduct {quantity} {unitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
