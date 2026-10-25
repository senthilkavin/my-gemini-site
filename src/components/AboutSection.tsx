import React from 'react';
import {
  Building2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Award,
  Users,
  Warehouse,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutSection: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Authorized Agency Profile
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-serif">
            About Gokula<span className="text-emerald-400">Krishnan</span> Agencies
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Founded on integrity, direct manufacturer sourcing, and customer dedication,{' '}
            <strong>GokulaKrishnan Agencies</strong> is a premier regional stockist providing
            high-potency agricultural chemicals, ordinary civil construction cements, and household pest control products.
          </p>
        </div>
      </div>

      {/* Leadership & Partners Profile Cards */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
            Agency Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Meet the Managing Partners
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Reach out directly for commercial supply contracts, factory delivery bookings, or technical product usage inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partner 1: Sahadevan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-lg transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  S
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  Managing Partner
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 font-serif">
                  Sahadevan
                </h3>
                <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                  Senior Managing Partner • Bulk Procurement & Wholesale Lead
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                With extensive industry expertise in bulk cement consignments and agricultural inputs,{' '}
                <strong>Sahadevan</strong> oversees corporate relationships, daily factory price quotes for Ordinary Portland Cement (OPC 53 / 43),
                and bulk allocations of insecticides and weedicides for large farms and building projects.
              </p>

              <div className="space-y-1.5 text-xs text-stone-500 pt-2 border-t border-stone-100">
                <div>Specialization: <strong>Ordinary Construction Cement, Bulk Agrochemicals, Truckload Orders</strong></div>
                <div>Availability: <strong>06:00 AM – 09:30 PM (All 7 Days)</strong></div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="tel:+919486426294"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
              >
                <Phone className="w-4 h-4" /> Call +91 94864 26294
              </a>
              <a
                href="https://wa.me/919486426294?text=Hello%20Sahadevan%20sir%2C%20inquiring%20about%20GokulaKrishnan%20Agencies%20products"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Partner 2: Arun Kavinaya */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-lg transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-stone-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  A
                </div>
                <span className="bg-stone-100 text-stone-800 text-xs font-bold px-3 py-1 rounded-full border border-stone-200">
                  Partner
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 font-serif">
                  Arun Kavinaya
                </h3>
                <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                  Partner • Logistics, Household Pest Control & Operations
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>Arun Kavinaya</strong> directs day-to-day depot operations, retail distribution,
                and technical advisory on ant & rat eradication for godowns, commercial properties, and residential premises.
                He coordinates timely dispatch, vehicle loading, and inventory tracking.
              </p>

              <div className="space-y-1.5 text-xs text-stone-500 pt-2 border-t border-stone-100">
                <div>Specialization: <strong>Ant Poison, Rat Poison (Rodenticides), Pest Control, Dispatch Coordination</strong></div>
                <div>Availability: <strong>06:00 AM – 09:30 PM (All 7 Days)</strong></div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="tel:+919790974822"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
              >
                <Phone className="w-4 h-4" /> Call +91 97909 74822
              </a>
              <a
                href="https://wa.me/919790974822?text=Hello%20Arun%20sir%2C%20inquiring%20about%20GokulaKrishnan%20Agencies%20products"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Portfolios Handled */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
            What We Supply
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
            Comprehensive Product Portfolios
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            All items are procured directly from certified manufacturers and stored under controlled conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Insecticides
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Formulations for severe termite control, soil stem borers, sucking pests (aphids, thrips, jassids), and foliar chewing caterpillars. Both EC and SL formulations available in retail and bulk volumes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Pesticides & Fungicides
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Protective dithiocarbamates and systemic triazoles for fungal diseases such as blight, downy mildew, leaf spots, blast, and powdery mildew.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Weedicides / Herbicides
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Non-selective total weed knock-down for perimeter fence bunds and vacant plots, as well as selective hormonal broadleaf weedicides for crops and lawns.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              Ordinary Cements (Construction)
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Standard civil construction cement (OPC 53 Grade, OPC 43 Grade, and PPC) for building contractors, home owners, slabs, pillars, brickwork, and plastering. Note: We stock standard building cements, not agricultural cement.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Ant Poison
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Targeted ant control solutions including queen-eradicating Fipronil bait gels, foundation perimeter dusting powders, and pure Boric acid.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              Rat Poison (Rodenticides)
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Single-feed Bromadiolone wax cakes for grain storage and residential spaces, along with acute Zinc Phosphide for severe infestations in open godowns.
            </p>
          </div>
        </div>
      </section>

      {/* Godown & Infrastructure */}
      <section className="bg-stone-900 text-white rounded-3xl p-8 border border-stone-800 space-y-6">
        <div className="flex items-center gap-3">
          <Warehouse className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-xl font-bold text-white">
              Warehousing & Logistics Facility
            </h3>
            <p className="text-xs text-stone-400">
              Clean, weather-proof godown storage designed for optimal cement curing and safe chemical segregation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-stone-800 p-4 rounded-2xl border border-stone-700">
            <span className="font-bold text-emerald-400 block mb-1">Cement Storage Shed:</span>
            <p className="text-stone-300">
              Raised wooden pallets and moisture-proof plastic underlays ensure our OPC 53 and OPC 43 bags remain 100% fresh with zero lump formation.
            </p>
          </div>

          <div className="bg-stone-800 p-4 rounded-2xl border border-stone-700">
            <span className="font-bold text-emerald-400 block mb-1">Chemical Safety Bay:</span>
            <p className="text-stone-300">
              Ventilated, lockable containment bays for weedicides, insecticides, and rodenticides with emergency spill protocols.
            </p>
          </div>

          <div className="bg-stone-800 p-4 rounded-2xl border border-stone-700">
            <span className="font-bold text-emerald-400 block mb-1">Quick Vehicle Loading:</span>
            <p className="text-stone-300">
              Dedicated loading bay for tractors, tempos, trolleys, and multi-axle freight trucks with trained godown loading personnel.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveTab('contact')}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Visit Our Agency / Get in Touch &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
