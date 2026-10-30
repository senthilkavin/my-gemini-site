import React from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  FileCheck,
  Phone,
  MessageSquare,
  Building2,
  Package,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, isAdminLoggedIn, setIsLoginModalOpen } = useStore();

  const handleCategoryNav = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveTab('products');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs">
      {/* Top Value Strip */}
      <div className="border-b border-stone-800/80 bg-stone-900/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GokulaKrishnan Agencies</h4>
              <p className="text-stone-400 text-xs mt-0.5">
                Authorized stockists for genuine Insecticides, Pesticides, Weedicides, Ordinary Building Cements, Ant Poison, and Rat Poison.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Ordinary Building Cement</h4>
              <p className="text-stone-400 text-xs mt-0.5">
                Fresh godown stocks of standard civil construction cement (OPC 53, OPC 43 & PPC) for slabs, masonry, and plastering.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Live Stock Transparency</h4>
              <p className="text-stone-400 text-xs mt-0.5">
                Real-time stock quantities displayed for all agricultural and household pest control items with instant godown replenishment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Managing Partners</h4>
              <p className="text-stone-400 text-xs mt-0.5">
                Direct phone and WhatsApp access to Sahadevan (+91 9486426294) and Arun Kavinaya (+91 9790924822).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand Description */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/40 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl text-white tracking-tight font-serif block">
                GokulaKrishnan Agencies
              </span>
              <p className="text-[11px] text-emerald-400 font-medium">
                Authorized Chemical, Pest Control & Construction Cement Stockists
              </p>
            </div>
          </div>

          <p className="text-stone-400 leading-relaxed text-xs">
            <strong>GokulaKrishnan Agencies</strong> supplies genuine factory-sealed Insecticides,
            crop-protecting Pesticides, total & selective Weedicides, Ordinary Cements (OPC 53/43/PPC)
            for construction, and specialized Ant Poison and Rat Poison.
          </p>
        </div>

        {/* Categories */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-white text-sm tracking-wide uppercase">
            Stocked Products
          </h4>
          <ul className="space-y-2 text-stone-400 text-xs">
            <li>
              <button
                onClick={() => handleCategoryNav('insecticide')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Insecticides (Soil & Foliar Pests)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryNav('pesticide')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Pesticides & Fungicides (Blight/Rust)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryNav('weedicide')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Weedicides / Herbicides (Land Clearing)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryNav('cement')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Ordinary Cements (OPC 53, 43 & PPC Building)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryNav('ant_poison')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Ant Poison (Fipronil Gels & Powders)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryNav('rat_poison')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Rat Poison (Bromadiolone & Zinc Phosphide)
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Pages */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-bold text-white text-sm tracking-wide uppercase">
            Navigation
          </h4>
          <ul className="space-y-2 text-stone-400 text-xs">
            <li>
              <button
                onClick={() => setActiveTab('home')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('about')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                About Us & Leadership
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('products')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Products & Live Stocks
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('contact')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Contact & Godown Location
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setActiveTab('admin');
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors text-left"
              >
                Owner / Merchant Portal (Login)
              </button>
            </li>
          </ul>
        </div>

        {/* Agency Partners Contact Cards */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-white text-sm tracking-wide uppercase">
            Agency Partners
          </h4>

          <div className="space-y-2.5 text-stone-300 text-xs">
            {/* Sahadevan */}
            <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Sahadevan</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-medium">
                  Managing Partner
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <a
                  href="tel:+919486426294"
                  className="font-mono text-emerald-300 hover:text-white font-bold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  +91 94864 26294
                </a>
                <a
                  href="https://wa.me/919486426294"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] bg-green-600 hover:bg-green-500 text-white font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Arun Kavinaya */}
            <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Arun Kavinaya</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-medium">
                  Partner
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <a
                  href="tel:+919790924822"
                  className="font-mono text-emerald-300 hover:text-white font-bold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  +91 97909 24822
                </a>
                <a
                  href="https://wa.me/919790924822"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] bg-green-600 hover:bg-green-500 text-white font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-900 py-4 px-4 text-center text-stone-500 text-[11px] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
        <span>
          &copy; {new Date().getFullYear()} <strong>GokulaKrishnan Agencies</strong>. All rights reserved.
        </span>
        <span className="text-stone-400">
          Insecticides • Pesticides • Weedicides • Ordinary Building Cements • Ant Poison • Rat Poison
        </span>
      </div>
    </footer>
  );
};
