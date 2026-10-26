import React from 'react';
import {
  Building2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Warehouse,
  CheckCircle2,
  Bug,
  Sprout,
  PlusCircle,
  Truck,
  Sparkles,
  Lock,
  PhoneCall,
  LayoutDashboard,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';

export const HomeSection: React.FC = () => {
  const { setActiveTab, setSelectedCategory, products, isAdminLoggedIn, setIsLoginModalOpen, currentAdmin } = useStore();

  const categories: {
    id: ProductCategory;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    stockCount: number;
    userProductNames: string;
  }[] = [
    {
      id: 'insecticide',
      title: 'Insecticides',
      description: 'Broad-spectrum soil & foliar pest killers for termites, stem borers, aphids, thrips, and caterpillars.',
      icon: Bug,
      accentColor: 'from-amber-600 to-amber-700',
      stockCount: products
        .filter((p) => p.category === 'insecticide')
        .reduce((sum, p) => sum + p.currentStock, 0),
      userProductNames:
        products.filter((p) => p.category === 'insecticide').length > 0
          ? products
              .filter((p) => p.category === 'insecticide')
              .map((p) => `${p.name} (${p.currentStock})`)
              .slice(0, 2)
              .join(', ')
          : 'Demo: Chlorpyrifos 20% EC Termiticide (120 units)',
    },
    {
      id: 'pesticide',
      title: 'Pesticides & Fungicides',
      description: 'Protective & systemic crop disease cures for early/late blight, blast, powdery mildew, and rusts.',
      icon: ShieldCheck,
      accentColor: 'from-purple-600 to-purple-700',
      stockCount: products
        .filter((p) => p.category === 'pesticide')
        .reduce((sum, p) => sum + p.currentStock, 0),
      userProductNames:
        products.filter((p) => p.category === 'pesticide').length > 0
          ? products
              .filter((p) => p.category === 'pesticide')
              .map((p) => `${p.name} (${p.currentStock})`)
              .slice(0, 2)
              .join(', ')
          : 'Demo: Mancozeb 75% WP Crop Fungicide (95 units)',
    },
    {
      id: 'weedicide',
      title: 'Weedicides / Herbicides',
      description: 'Selective & non-selective total vegetation eradication for farm bunds, vacant plots, and crops.',
      icon: Sprout,
      accentColor: 'from-emerald-600 to-green-700',
      stockCount: products
        .filter((p) => p.category === 'weedicide')
        .reduce((sum, p) => sum + p.currentStock, 0),
      userProductNames:
        products.filter((p) => p.category === 'weedicide').length > 0
          ? products
              .filter((p) => p.category === 'weedicide')
              .map((p) => `${p.name} (${p.currentStock})`)
              .slice(0, 2)
              .join(', ')
          : 'Demo: Glyphosate 41% SL Systemic (85 units)',
    },
    {
      id: 'cement',
      title: 'Ordinary Cements (Commercial & Civil)',
      description: 'Ordinary Portland Cement (OPC 53, OPC 43) and commercial PPC for slabs, columns, masonry, plaster, and building construction.',
      icon: Building2,
      accentColor: 'from-slate-700 to-slate-900',
      stockCount: products
        .filter((p) => p.category === 'cement')
        .reduce((sum, p) => sum + p.currentStock, 0),
      userProductNames:
        products.filter((p) => p.category === 'cement').length > 0
          ? products
              .filter((p) => p.category === 'cement')
              .map((p) => `${p.name} (${p.currentStock})`)
              .slice(0, 2)
              .join(', ')
          : 'Demo: UltraTech OPC 53 & Super PPC (770 bags)',
    },
    {
      id: 'ant_poison',
      title: 'Ant Poison (Household & Godown)',
      description: 'Domino-effect queen kill gel syringes, Chlorpyrifos 1.5% perimeter barrier dusting powders, and Boric acid.',
      icon: Bug,
      accentColor: 'from-rose-600 to-rose-700',
      stockCount: products
        .filter((p) => p.category === 'ant_poison')
        .reduce((sum, p) => sum + p.currentStock, 0),
      userProductNames:
        products.filter((p) => p.category === 'ant_poison').length > 0
          ? products
              .filter((p) => p.category === 'ant_poison')
              .map((p) => `${p.name} (${p.currentStock})`)
              .slice(0, 2)
              .join(', ')
          : 'Demo: Fipronil 0.05% Bait Gel Syringes (110 units)',
    },
    {
      id: 'rat_poison',
      title: 'Rat Poison (Rodenticides)',
      description: 'Single-feed weatherproof Bromadiolone cakes, Zinc Phosphide 80% acute bait, and tracking blocks.',
      icon: Warehouse,
      accentColor: 'from-orange-600 to-amber-700',
      stockCount: products
        .filter((p) => p.category === 'rat_poison')
        .reduce((sum, p) => sum + p.currentStock, 0),
      userProductNames:
        products.filter((p) => p.category === 'rat_poison').length > 0
          ? products
              .filter((p) => p.category === 'rat_poison')
              .map((p) => `${p.name} (${p.currentStock})`)
              .slice(0, 2)
              .join(', ')
          : 'Demo: Bromadiolone 0.005% RB Wax Cakes (140 units)',
    },
  ];

  const totalCementBags = products
    .filter((p) => p.category === 'cement')
    .reduce((sum, p) => sum + p.currentStock, 0);

  const totalInsecticideUnits = products
    .filter((p) => p.category === 'insecticide')
    .reduce((sum, p) => sum + p.currentStock, 0);

  const totalPesticideUnits = products
    .filter((p) => p.category === 'pesticide')
    .reduce((sum, p) => sum + p.currentStock, 0);

  const totalAgroChemicals = products
    .filter((p) => ['insecticide', 'pesticide', 'weedicide'].includes(p.category))
    .reduce((sum, p) => sum + p.currentStock, 0);

  const totalPoisonUnits = products
    .filter((p) => ['ant_poison', 'rat_poison'].includes(p.category))
    .reduce((sum, p) => sum + p.currentStock, 0);

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveTab('products');
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* FRONT DASHBOARD: FILLED WITH ONLY IMAGES OF CEMENTS,      */}
      {/* INSECTICIDES, AND PESTICIDES                              */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Brand Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800/80 pb-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Wholesale Agency &amp; Authorized Godown Stockists
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-serif">
                Gokula<span className="text-emerald-400">Krishnan</span> Agencies
              </h1>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Direct authorized warehouse stockists for genuine <strong>Ordinary Building Cements (UltraTech Cement)</strong>, high-performance <strong>Insecticides</strong>, and crop-protecting <strong>Pesticides</strong>. All sales settled strictly in <strong className="text-emerald-400">Indian Rupee (INR / ₹)</strong>.
              </p>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveTab('products');
                }}
                className="py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
              >
                <Package className="w-4 h-4" /> View Stocks &amp; ₹ INR Rates
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" /> Owner Dashboard ({currentAdmin?.name})
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="py-3 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Owner Access: Sahadevan & Arun Kavinaya only"
                >
                  <Lock className="w-4 h-4 text-amber-400" /> Owner Login
                </button>
              )}
            </div>
          </div>

          {/* FRONT DASHBOARD FILLED WITH ONLY IMAGES OF CEMENTS, INSECTICIDES, AND PESTICIDES */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-extrabold text-white uppercase tracking-widest flex items-center gap-2 text-sm sm:text-base font-serif">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Featured Commodities: Cements • Insecticides • Pesticides
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">
                100% Genuine Factory-Sealed Godown Consignments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* IMAGE CARD 1: CEMENTS (UltraTech Cement) */}
              <div
                onClick={() => handleCategoryClick('cement')}
                className="group relative rounded-3xl overflow-hidden border-2 border-stone-700/80 hover:border-amber-400 transition-all duration-300 shadow-2xl cursor-pointer bg-stone-900 flex flex-col justify-end min-h-[380px] sm:min-h-[440px]"
              >
                <img
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80"
                  alt="Ordinary Construction Cement and UltraTech Cement Godown Bags"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-black/20" />

                <div className="relative p-6 sm:p-7 space-y-3 z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-amber-500 text-stone-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      UltraTech &amp; Ordinary Cement
                    </span>
                    <span className="bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {totalCementBags} Bags in Stock
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors font-serif">
                    Ordinary Building Cements
                  </h3>

                  <p className="text-stone-300 text-xs leading-relaxed line-clamp-2">
                    OPC 53 Grade, OPC 43 &amp; Commercial PPC (Ordinary civil construction cement, not agricultural). Fresh dry stocks for slabs, masonry, and plastering.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span className="flex items-center gap-1.5">
                      Explore Cement Stocks &amp; INR Rates
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">50 kg Bags</span>
                  </div>
                </div>
              </div>

              {/* IMAGE CARD 2: INSECTICIDES */}
              <div
                onClick={() => handleCategoryClick('insecticide')}
                className="group relative rounded-3xl overflow-hidden border-2 border-stone-700/80 hover:border-emerald-400 transition-all duration-300 shadow-2xl cursor-pointer bg-stone-900 flex flex-col justify-end min-h-[380px] sm:min-h-[440px]"
              >
                <img
                  src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1200&q=80"
                  alt="Insecticides and Termite Chemical Spray Canisters"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-black/20" />

                <div className="relative p-6 sm:p-7 space-y-3 z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-emerald-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      Insecticides
                    </span>
                    <span className="bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {totalInsecticideUnits} Units in Stock
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors font-serif">
                    Soil &amp; Foliar Insecticides
                  </h3>

                  <p className="text-stone-300 text-xs leading-relaxed line-clamp-2">
                    Chlorpyrifos 20% EC, soil termite barrier chemicals, and potent insecticides for agricultural crops, stem borers, and building foundation pest treatment.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span className="flex items-center gap-1.5">
                      Explore Insecticides &amp; INR Rates
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">1L &amp; 5L Packs</span>
                  </div>
                </div>
              </div>

              {/* IMAGE CARD 3: PESTICIDES */}
              <div
                onClick={() => handleCategoryClick('pesticide')}
                className="group relative rounded-3xl overflow-hidden border-2 border-stone-700/80 hover:border-purple-400 transition-all duration-300 shadow-2xl cursor-pointer bg-stone-900 flex flex-col justify-end min-h-[380px] sm:min-h-[440px]"
              >
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80"
                  alt="Pesticides and Agricultural Crop Disease Control"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-black/20" />

                <div className="relative p-6 sm:p-7 space-y-3 z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-purple-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      Pesticides &amp; Fungicides
                    </span>
                    <span className="bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {totalPesticideUnits} Units in Stock
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors font-serif">
                    Pesticides &amp; Crop Disease
                  </h3>

                  <p className="text-stone-300 text-xs leading-relaxed line-clamp-2">
                    Systemic and contact formulations for blast, powdery mildew, early/late blight, and devastating agricultural pests.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                    <span className="flex items-center gap-1.5">
                      Explore Pesticides &amp; INR Rates
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">Factory Sealed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BOTTOM CONTENT (OK'D BY USER): METRICS & CATEGORIES &     */}
      {/* PARTNER CONTACT DETAILS                                  */}
      {/* ========================================================= */}

      {/* Live Godown Stock Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                GokulaKrishnan Agencies Godown Inventory
              </span>
              <h3 className="text-lg font-black text-stone-900">
                Live Stock Status Across 6 Product Lines
              </h3>
            </div>

            {/* Note: No person other than owner can get inside for entry of incoming stocks */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Enter Incoming Stocks (Owner Dashboard)
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200"
                title="Only owners Sahadevan & Arun Kavinaya can enter incoming stocks"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" /> Owner Login to Enter Stock
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 block font-medium">
                Ordinary Construction Cement (OPC 53 / 43 / PPC):
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-stone-900">
                  {totalCementBags}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Bags Ready for Loading
                </span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 block font-medium">
                Crop Protection (Insecticides, Pesticides, Weedicides):
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-stone-900">
                  {totalAgroChemicals}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Units in Stock
                </span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 block font-medium">
                Pest Eradication (Ant Poison &amp; Rat Poison):
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-stone-900">
                  {totalPoisonUnits}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Bait Packs Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Product Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              Stock Availability &amp; Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Available Product Lines
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-md">
            Click any category to view individual products, chemical compositions, and available godown stock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.accentColor} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                      In Stock: {cat.stockCount} Units
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400 block mb-2">
                    Current Stocks: <strong className="text-stone-700">{cat.userProductNames}</strong>
                  </span>
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>View Stocks &amp; Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Contact Cards for Sahadevan & Arun Kavinaya */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Direct Merchant Desks
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif mt-0.5">
                Contact Sahadevan &amp; Arun Kavinaya for Orders &amp; Dispatch
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              Direct Phone &amp; WhatsApp Available 7 Days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sahadevan */}
            <div className="bg-stone-800/90 p-5 rounded-2xl border border-stone-700 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">Managing Partner</span>
                  <h4 className="text-xl font-black text-white">Sahadevan</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Wholesale Building Cement &amp; Agricultural Chemical Supplies
                  </p>
                </div>
                <span className="font-mono font-black text-emerald-300 text-base">
                  +91 94864 26294
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+919486426294"
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Phone className="w-4 h-4" /> Call Sahadevan
                </a>
                <a
                  href="https://wa.me/919486426294?text=Hello%20Sahadevan%20sir%2C%20inquiring%20about%20GokulaKrishnan%20Agencies%20stocks"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Arun Kavinaya */}
            <div className="bg-stone-800/90 p-5 rounded-2xl border border-stone-700 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">Partner</span>
                  <h4 className="text-xl font-black text-white">Arun Kavinaya</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Operations, Ant &amp; Rat Poison &amp; Delivery Logistics
                  </p>
                </div>
                <span className="font-mono font-black text-emerald-300 text-base">
                  +91 97909 74822
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+919790974822"
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Phone className="w-4 h-4" /> Call Arun
                </a>
                <a
                  href="https://wa.me/919790974822?text=Hello%20Arun%20sir%2C%20inquiring%20about%20GokulaKrishnan%20Agencies%20stocks"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GokulaKrishnan Agencies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              Authorized Dealerships &amp; Quality Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Why Customers Rely on GokulaKrishnan Agencies
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2">
              Serving agricultural farmers, building contractors, home builders, and commercial establishments with genuine quality and prompt dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-sm">100% Genuine Factory Sealed</h4>
              <p className="text-stone-600 leading-relaxed">
                Direct consignments from authorized manufacturers. Tamper-proof batch codes on all cement bags and chemical canisters.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
              <Warehouse className="w-6 h-6 text-amber-600" />
              <h4 className="font-bold text-stone-900 text-sm">Moisture-Proof Storage</h4>
              <p className="text-stone-600 leading-relaxed">
                Elevated wooden skids for Ordinary Cement to prevent lump formation. Dedicated ventilated lockers for insecticides and weedicides.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
              <Truck className="w-6 h-6 text-sky-600" />
              <h4 className="font-bold text-stone-900 text-sm">Fast Local &amp; Regional Dispatch</h4>
              <p className="text-stone-600 leading-relaxed">
                Forklift loading for tractor-trolleys and mini-trucks. Daily scheduled deliveries for building contractors and farm co-ops.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
              <Phone className="w-6 h-6 text-purple-600" />
              <h4 className="font-bold text-stone-900 text-sm">Direct Owner Support</h4>
              <p className="text-stone-600 leading-relaxed">
                Direct mobile access to Sahadevan (+91 94864 26294) and Arun Kavinaya (+91 97909 74822) for daily rates, dosage advice, and bulk booking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
