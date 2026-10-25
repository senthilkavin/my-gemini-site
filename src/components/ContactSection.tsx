import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Building2,
  Clock,
  MapPin,
  Mail,
  Send,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactSection: React.FC = () => {
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [productInterested, setProductInterested] = useState('Ordinary Construction Cement (OPC 53 / 43)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your inquiry has been sent to Sahadevan & Arun Kavinaya!');
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Phone className="w-4 h-4 text-emerald-400" />
            Direct Trade & Customer Desk
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-serif">
            Contact Gokula<span className="text-emerald-400">Krishnan</span> Agencies
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Connect directly with our managing partners for current wholesale prices on Ordinary Cement (OPC 53/43),
            Insecticides, Pesticides, Weedicides, Ant Poison, and Rat Poison.
          </p>
        </div>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sahadevan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:border-emerald-500 transition-all space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Managing Partner
              </span>
              <h3 className="text-2xl font-black text-stone-900 font-serif">
                Sahadevan
              </h3>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Wholesale cement truckload pricing, direct factory dispatch, and bulk agricultural chemical allocations.
          </p>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Direct Contact:</span>
              <a
                href="tel:+919486426294"
                className="font-mono font-bold text-emerald-700 hover:underline text-sm"
              >
                +91 94864 26294
              </a>
            </div>
            <div className="flex items-center justify-between text-stone-500">
              <span>Availability:</span>
              <strong className="text-stone-800">06:00 AM – 09:30 PM (Mon - Sun)</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="tel:+919486426294"
              className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <Phone className="w-4 h-4" /> Call Sahadevan
            </a>
            <a
              href="https://wa.me/919486426294?text=Hello%20Sahadevan%20sir%2C%20inquiring%20about%20GokulaKrishnan%20Agencies%20stocks"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Arun Kavinaya */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:border-emerald-500 transition-all space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Partner & Operations
              </span>
              <h3 className="text-2xl font-black text-stone-900 font-serif">
                Arun Kavinaya
              </h3>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Ant & Rat poison stock availability, household pest eradication advisory, and vehicle dispatch coordination.
          </p>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Direct Contact:</span>
              <a
                href="tel:+919790974822"
                className="font-mono font-bold text-emerald-700 hover:underline text-sm"
              >
                +91 97909 74822
              </a>
            </div>
            <div className="flex items-center justify-between text-stone-500">
              <span>Availability:</span>
              <strong className="text-stone-800">06:00 AM – 09:30 PM (Mon - Sun)</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="tel:+919790974822"
              className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <Phone className="w-4 h-4" /> Call Arun
            </a>
            <a
              href="https://wa.me/919790974822?text=Hello%20Arun%20sir%2C%20inquiring%20about%20GokulaKrishnan%20Agencies%20stocks"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Godown Location & Direct Callback Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Godown Details */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5 text-xs">
          <div className="border-b border-stone-200 pb-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
              Agency Depots & Loading
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-0.5">
              Godown Address & Operations
            </h3>
          </div>

          <div className="space-y-4 text-stone-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-sm">GokulaKrishnan Agencies Godown</strong>
                <p className="mt-0.5">
                  Main Commercial Road, Near Market Yard Complex, Warehouse Shed #4.
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Spacious entrance allowing easy turning for tractors, tippers, and multi-axle freight trucks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-sm">Godown Working Hours</strong>
                <p className="mt-0.5">
                  Monday to Sunday: <strong>06:00 AM – 09:30 PM</strong>
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Early morning truckload dispatches available upon prior telephone booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-sm">Currency & Billing (INR / ₹)</strong>
                <p className="mt-0.5">
                  All transactions settled strictly in <strong>Indian Rupee (INR / ₹)</strong>. Full GST tax invoices provided for contractors, farms, and trade resellers with RTGS, NEFT & UPI support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Callback / Quick Booking Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5 text-xs">
          <div className="border-b border-stone-200 pb-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
              Send Quick Message
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-0.5">
              Request Price Quote or Stock Allocation
            </h3>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-extrabold text-emerald-950 text-base">Inquiry Dispatched!</h4>
              <p className="text-emerald-800 text-xs">
                Sahadevan or Arun Kavinaya will call you directly at <strong>{phone}</strong> to confirm available stocks and rates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Your Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Product Interested In *</label>
                <select
                  value={productInterested}
                  onChange={(e) => setProductInterested(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Ordinary Construction Cement (OPC 53 / 43)">Ordinary Construction Cement (OPC 53 / 43 / PPC)</option>
                  <option value="Insecticides (Termite / Crop)">Insecticides (Chlorpyrifos, Imidacloprid, etc.)</option>
                  <option value="Pesticides / Fungicides">Pesticides & Fungicides (Mancozeb, Bavistin, etc.)</option>
                  <option value="Weedicides / Herbicides">Weedicides / Herbicides (Glyphosate, 2,4-D Amine)</option>
                  <option value="Ant Poison (Gel / Powder)">Ant Poison (Fipronil Gel, Chlorpyrifos Dust)</option>
                  <option value="Rat Poison (Rodenticide Cakes)">Rat Poison (Bromadiolone Cakes, Zinc Phosphide)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Required Quantity or Delivery Requirements:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need 200 bags OPC 53 Cement delivered by Friday, or 10 cans Glyphosate 41% SL"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Send Inquiry to GokulaKrishnan Agencies
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
