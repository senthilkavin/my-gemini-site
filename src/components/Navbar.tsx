import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Package,
  Menu,
  X,
  ShieldCheck,
  PhoneCall,
  Info,
  Lock,
  LayoutDashboard,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsLoginModalOpen,
    isAdminLoggedIn,
    currentAdmin,
    adminLogout,
    products,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);

  const navItems: {
    id: 'home' | 'about' | 'products' | 'contact' | 'admin';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    adminOnly?: boolean;
  }[] = [
    { id: 'home', label: 'Home', icon: Building2 },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'products', label: 'Products & Stocks', icon: Package },
    { id: 'contact', label: 'Contact Us', icon: PhoneCall },
  ];

  if (isAdminLoggedIn) {
    navItems.push({
      id: 'admin',
      label: 'Owner Dashboard',
      icon: LayoutDashboard,
      adminOnly: true,
    });
  }

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 shadow-xl border-b border-stone-800">
      {/* Top Direct Contact Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-3 sm:px-6 py-2 border-b border-emerald-800/60 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white">
            GokulaKrishnan Agencies
          </span>
          <span className="text-emerald-400/60 hidden md:inline">|</span>
          <span className="text-emerald-200 hidden md:inline">
            Authorized Stockists for UltraTech Ordinary Cement, Insecticides, Weedicides, Ant &amp; Rat Poison
          </span>
        </div>

        {/* Click-to-Call direct numbers */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <a
            href="tel:+919486426294"
            className="flex items-center gap-1.5 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white px-2.5 py-1 rounded-lg border border-emerald-700/50 transition-colors font-mono font-medium"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            Sahadevan: <strong className="text-white">+91 94864 26294</strong>
          </a>
          <a
            href="tel:+919790924822"
            className="flex items-center gap-1.5 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white px-2.5 py-1 rounded-lg border border-emerald-700/50 transition-colors font-mono font-medium"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            Arun Kavinaya: <strong className="text-white">+91 97909 24822</strong>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform border border-emerald-400/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-2xl tracking-tight text-white font-serif">
                  Gokula<span className="text-emerald-400">Krishnan</span> Agencies
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 font-medium">
                UltraTech Cement • Insecticides • Weedicides • Ant &amp; Rat Poison
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? item.adminOnly
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40'
                        : 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                      : item.adminOnly
                      ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Owner Login / Logout Button */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-800">
                <span className="text-xs text-emerald-400 font-bold hidden xl:inline">
                  {currentAdmin?.name}
                </span>
                <button
                  onClick={adminLogout}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="ml-2 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Admin login for owners Sahadevan & Arun Kavinaya"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Owner Login
              </button>
            )}
          </nav>

          {/* Mobile Right Action Bar */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAdminLoggedIn ? (
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="py-1.5 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Owner login"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Owner Login
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-800 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 ${
                    isActive
                      ? item.adminOnly
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-emerald-600 text-white'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            <div className="pt-2 border-t border-stone-800 space-y-2">
              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    adminLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs text-left cursor-pointer"
                >
                  Log Out ({currentAdmin?.name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center justify-between shadow cursor-pointer transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Owner Login
                  </span>
                  <span className="text-[10px] bg-stone-900/20 px-2 py-0.5 rounded font-mono font-bold">
                    Sahadevan / Arun
                  </span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <a
                  href="tel:+919486426294"
                  className="p-2 rounded-xl bg-emerald-900/60 text-white font-mono flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <span className="text-[9px] text-emerald-300 block">Sahadevan</span>
                    <span className="font-bold text-[11px]">+91 94864 26294</span>
                  </div>
                </a>
                <a
                  href="tel:+919790924822"
                  className="p-2 rounded-xl bg-emerald-900/60 text-white font-mono flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <span className="text-[9px] text-emerald-300 block">Arun Kavinaya</span>
                    <span className="font-bold text-[11px]">+91 97909 24822</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
