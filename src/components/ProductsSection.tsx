import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  Bug,
  Sprout,
  PlusCircle,
  Warehouse,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  X,
  Plus,
  Minus,
  Sparkles,
  Receipt,
  Lock,
  Wheat,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';
import { INITIAL_PRODUCTS, DEMO_COMMODITY_IMAGES } from '../data/productsData';
import { getPackagingUnitName } from '../utils/productUtils';

export const ProductsSection: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    addNewProduct,
    updateProduct,
    deleteProduct,
    addStock,
    setExactStock,
    clearAllProducts,
    loadQuickSamples,
    isAdminLoggedIn,
    setActiveTab,
    setIsLoginModalOpen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(true);

  // New product entry form state
  const [inputName, setInputName] = useState('');
  const [inputStock, setInputStock] = useState<number | ''>('');
  const [inputCategory, setInputCategory] = useState<ProductCategory>('cement');
  const [inputPriceINR, setInputPriceINR] = useState('');
  const [inputPackaging, setInputPackaging] = useState('');
  const [inputBrand, setInputBrand] = useState('');
  const [inputActiveIngredient, setInputActiveIngredient] = useState('');
  const [inputUsage, setInputUsage] = useState('');

  // Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editStock, setEditStock] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<ProductCategory>('cement');
  const [editPriceINR, setEditPriceINR] = useState('');
  const [editPackaging, setEditPackaging] = useState('');
  const [editBrand, setEditBrand] = useState('');

  const categories: { id: 'all' | ProductCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Products', icon: Package },
    { id: 'fertilizer', label: 'Fertilizers', icon: Wheat },
    { id: 'insecticide', label: 'Insecticides', icon: Bug },
    { id: 'pesticide', label: 'Pesticides & Fungicides', icon: ShieldCheck },
    { id: 'weedicide', label: 'Weedicides', icon: Sprout },
    { id: 'cement', label: 'Ordinary Cements', icon: Building2 },
    { id: 'ant_poison', label: 'Ant Poison', icon: Bug },
    { id: 'rat_poison', label: 'Rat Poison', icon: Warehouse },
  ];

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    addNewProduct({
      name: inputName.trim(),
      category: inputCategory,
      currentStock: Number(inputStock) || 0,
      priceEstimated: inputPriceINR.trim() ? inputPriceINR.trim() : 'Rate on Inquiry',
      packagingUnit: inputPackaging.trim() || (inputCategory === 'cement' ? '50 kg Bag' : 'Unit Pack'),
      brand: inputBrand.trim() || 'GokulaKrishnan Agencies',
      activeIngredient: inputActiveIngredient.trim() || 'Standard Active Specification',
      targetPestOrUsage: inputUsage.trim() || 'General Usage',
    });

    // Clear input form
    setInputName('');
    setInputStock('');
    setInputPriceINR('');
    setInputPackaging('');
    setInputBrand('');
    setInputActiveIngredient('');
    setInputUsage('');
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditStock(p.currentStock);
    setEditCategory(p.category);
    setEditPriceINR(p.priceEstimated || '');
    setEditPackaging(p.packagingUnit);
    setEditBrand(p.brand);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editName.trim(),
      currentStock: Number(editStock) || 0,
      category: editCategory,
      priceEstimated: editPriceINR.trim() || 'Rate on Inquiry',
      packagingUnit: editPackaging.trim() || 'Unit Pack',
      brand: editBrand.trim() || 'GokulaKrishnan Agencies',
    });

    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.activeIngredient && p.activeIngredient.toLowerCase().includes(q)) ||
      (p.targetPestOrUsage && p.targetPestOrUsage.toLowerCase().includes(q));

    const matchesStock = !inStockOnly || p.currentStock > 0;

    return matchesCategory && matchesSearch && matchesStock;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Owner Direct Stock Form (Only visible when toggled by logged-in admin) */}
      {isAdminLoggedIn && isFormExpanded && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600/40 shadow-xl space-y-5 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                  Manual Product &amp; Stock Entry (Owner Mode)
                </span>
                <h2 className="text-xl font-extrabold text-stone-900 mt-0.5">
                  Enter Product Name, Stock &amp; Category
                </h2>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                Live Stock Database • GokulaKrishnan Agencies
              </span>
            </div>

          <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
            {/* Row 1: Product Name, Category & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Product Name */}
              <div className="sm:col-span-5">
                <label className="font-extrabold text-stone-800 block mb-1">
                  Product Name * <span className="text-stone-400 font-normal">(User entered name)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraTech 53 Grade Ordinary Cement / Chlorpyrifos 20%"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full border-2 border-emerald-600/40 rounded-xl px-3.5 py-2.5 text-stone-900 font-semibold text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                />
              </div>

              {/* Category */}
              <div className="sm:col-span-4">
                <label className="font-extrabold text-stone-800 block mb-1">
                  Category *
                </label>
                <select
                  value={inputCategory}
                  onChange={(e) => setInputCategory(e.target.value as ProductCategory)}
                  className="w-full border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="cement">Ordinary Cement (Not Agricultural - OPC 53/43/PPC)</option>
                  <option value="fertilizer">Fertilizers &amp; Soil Nutrients (DAP, Urea, NPK, Potash)</option>
                  <option value="insecticide">Insecticides (Soil &amp; Foliar Pests)</option>
                  <option value="pesticide">Pesticides &amp; Fungicides (Crop Disease)</option>
                  <option value="weedicide">Weedicides / Herbicides (Land Clearing)</option>
                  <option value="ant_poison">Ant Poison (Bait Gels / Powders)</option>
                  <option value="rat_poison">Rat Poison (Rodenticide Cakes/Bait)</option>
                </select>
              </div>

              {/* Available Stock */}
              <div className="sm:col-span-3">
                <label className="font-extrabold text-stone-800 block mb-1">
                  Current Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 500, 100, 50"
                  value={inputStock}
                  onChange={(e) => setInputStock(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full border-2 border-emerald-600/40 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono font-black text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                />
              </div>
            </div>

            {/* Row 2: Price in INR (₹), Packaging Unit, Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Rate in Indian Rupee (INR / ₹)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹395 / Bag or ₹420 / Liter"
                  value={inputPriceINR}
                  onChange={(e) => setInputPriceINR(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Packaging Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50 kg Bag / 1 Liter / 100g Bar / 30g Tube"
                  value={inputPackaging}
                  onChange={(e) => setInputPackaging(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  placeholder="e.g. UltraTech / Dalmia / Bayer / UPL"
                  value={inputBrand}
                  onChange={(e) => setInputBrand(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Row 3: Active Ingredient & Usage (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Active Ingredient / Technical Composition (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. IS 12269 Clinker, Chlorpyrifos 20%, Fipronil 0.05%"
                  value={inputActiveIngredient}
                  onChange={(e) => setInputActiveIngredient(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Target Pest or Construction Usage (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Structural slabs, Red Ants, Termites, Blight"
                  value={inputUsage}
                  onChange={(e) => setInputUsage(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="submit"
                className="py-3 px-8 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Add Product & Stock to Inventory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? products.length
                : products.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/30'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Stock Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by product name, brand, usage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700 select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-emerald-600 w-4 h-4 rounded"
              />
              In Stock Only
            </label>

            <span className="text-stone-500 font-mono text-xs font-semibold">
              {filteredProducts.length > 0
                ? `${filteredProducts.length} Product${filteredProducts.length === 1 ? '' : 's'} in Stock`
                : 'Demo Godown Images & Items'}
            </span>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {isFormExpanded ? 'Hide Entry Form' : '+ Add Product'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notice for Cement: Ordinary Cement not agricultural */}
      {selectedCategory === 'cement' && (
        <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300 text-xs text-slate-800 flex items-center justify-between">
          <span>
            <strong>Ordinary Building Cements:</strong> Stocks of standard civil construction cement (OPC 53 Grade, OPC 43 Grade, and PPC) conforming to Bureau of Indian Standards for residential and commercial masonry construction (not agricultural cement).
          </span>
          <span className="font-bold text-slate-900 ml-2 whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-slate-300">
            Civil Construction Grade
          </span>
        </div>
      )}

      {/* Product Cards List */}
      {filteredProducts.length === 0 ? (
        <div className="space-y-6">
          {/* Demo Images Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Demo Commodity Gallery • Authentic Godown Imagery
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
                Demo Godown Stock Images &amp; Visual Preview
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Displaying authentic demo photography for <strong>UltraTech Ordinary Cements</strong>, high-yield <strong>Agricultural Insecticides</strong>, <strong>Pesticides</strong>, <strong>Weedicides</strong>, and <strong>Poison</strong>. All quotations and transactions settled strictly in <strong className="text-emerald-400">Indian Rupee (INR / ₹)</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={loadQuickSamples}
                className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> Load All Demo Stocks (INR)
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={() => setIsFormExpanded(true)}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Enter Custom Stock
                </button>
              )}
            </div>
          </div>

          {/* Grid of Demo Product Cards with Demo Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === 'all'
              ? INITIAL_PRODUCTS
              : INITIAL_PRODUCTS.filter((item) => item.category === selectedCategory)
            ).map((demo) => (
              <div
                key={demo.id}
                className="bg-white rounded-3xl border-2 border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-emerald-600"
              >
                {/* Demo Image Banner */}
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={demo.image}
                    alt={demo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-900/90 text-amber-300 border border-amber-400/40 shadow">
                      Demo Image
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-stone-300">
                      {demo.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> In Godown: {demo.currentStock} Units
                    </span>
                  </div>

                  {/* Packaging Unit & Brand */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center text-white text-xs">
                    <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[11px] font-bold text-emerald-300">
                      {demo.packagingUnit}
                    </span>
                    <span className="text-[11px] text-stone-200 font-semibold truncate max-w-[160px]">
                      {demo.brand}
                    </span>
                  </div>
                </div>

                {/* Demo Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                      {demo.name}
                    </h3>

                    {/* Rate in Indian Rupees (INR / ₹) */}
                    <div className="mt-2.5 flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">
                          Trade Rate (INR / ₹):
                        </span>
                        <div className="text-sm font-black text-emerald-900 font-mono">
                          {demo.priceEstimated}
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 font-mono">
                        ₹ Trade Price
                      </span>
                    </div>

                    {/* Technical Specification */}
                    {demo.activeIngredient && (
                      <p className="text-xs text-stone-600 mt-2 line-clamp-1">
                        <strong>Spec:</strong> {demo.activeIngredient}
                      </p>
                    )}
                    {demo.targetPestOrUsage && (
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        <strong>Usage:</strong> {demo.targetPestOrUsage}
                      </p>
                    )}
                  </div>

                  {/* Action Controls for Demo Card */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    {isAdminLoggedIn ? (
                      <button
                        onClick={() => {
                          addNewProduct({
                            name: demo.name,
                            category: demo.category,
                            currentStock: demo.currentStock,
                            unitPriceINR: demo.unitPriceINR,
                            priceEstimated: demo.priceEstimated,
                            packagingUnit: demo.packagingUnit,
                            brand: demo.brand,
                            activeIngredient: demo.activeIngredient,
                            targetPestOrUsage: demo.targetPestOrUsage,
                            safetyHazard: demo.safetyHazard,
                            image: demo.image,
                          });
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Adopt This Demo to Godown Stock
                      </button>
                    ) : (
                      <div className="w-full flex items-center gap-2">
                        <a
                          href="tel:+919486426294"
                          className="flex-1 py-2 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow"
                        >
                          <Phone className="w-3 h-3" /> Sahadevan
                        </a>
                        <a
                          href="tel:+919790924822"
                          className="flex-1 py-2 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-stone-700 shadow"
                        >
                          <Phone className="w-3 h-3" /> Arun
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-emerald-500/50"
              >
                {/* Image Banner */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                      {p.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Stock Availability Badge */}
                  <div className="absolute top-3 right-3">
                    {p.currentStock > 15 ? (
                      <span className="bg-emerald-600/95 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> In Stock: {p.currentStock} Units
                      </span>
                    ) : p.currentStock > 0 ? (
                      <span className="bg-amber-500/95 text-stone-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Low Stock: {p.currentStock} Left
                      </span>
                    ) : (
                      <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                        0 in Stock
                      </span>
                    )}
                  </div>

                  {/* Packaging Unit & Brand */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center text-white text-xs">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[11px]">
                      {p.packagingUnit}
                    </span>
                    <span className="text-[11px] text-stone-300 font-semibold truncate max-w-[140px]">
                      {p.brand}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                        {p.name}
                      </h3>
                      {isAdminLoggedIn && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors shrink-0 cursor-pointer shadow-sm"
                            title="Edit product name, stock, rate, or packaging"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors shrink-0 cursor-pointer shadow-sm"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Rate in Indian Rupees (INR / ₹) */}
                    <div className="mt-2.5 flex items-center justify-between bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">
                          Rate (INR / ₹):
                        </span>
                        <div className="text-sm font-black text-emerald-900 font-mono">
                          {p.priceEstimated}
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                        ₹ INR Trade Rate
                      </span>
                    </div>

                    {/* Active technical specs or usage if present */}
                    {p.activeIngredient && (
                      <p className="text-xs text-stone-600 mt-2 line-clamp-1">
                        <strong>Spec:</strong> {p.activeIngredient}
                      </p>
                    )}
                    {p.targetPestOrUsage && (
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        <strong>Usage:</strong> {p.targetPestOrUsage}
                      </p>
                    )}
                  </div>

                  {/* Stock Quick Adjustment (+ / -) & Direct Contact Buttons */}
                  <div className="pt-3 border-t border-stone-100 space-y-2.5">
                    {/* Live Stock Counter Bar */}
                    <div className="flex items-center justify-between bg-stone-50 p-2 rounded-xl border border-stone-200 text-xs">
                      <span className="text-stone-600 font-medium">
                        Live Godown Stock:
                      </span>
                      {isAdminLoggedIn ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => addStock(p.id, -1, 'Stock deduction')}
                            className="w-7 h-7 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 font-bold text-xs cursor-pointer shadow-sm"
                            title="Deduct 1 unit"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-black text-stone-900 px-2 py-0.5 text-sm bg-white border border-stone-200 rounded-lg">
                            {p.currentStock}
                          </span>
                          <button
                            type="button"
                            onClick={() => addStock(p.id, 1, 'Quick stock arrival')}
                            className="w-7 h-7 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:bg-stone-300 font-bold text-xs cursor-pointer shadow-sm"
                            title="Add 1 unit"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => addStock(p.id, 10, 'Quick +10 units')}
                            className="py-1 px-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] cursor-pointer"
                            title="Add +10 units"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => addStock(p.id, 50, 'Batch shipment addition')}
                            className="py-1 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-[10px] cursor-pointer shadow-sm"
                            title="Add +50 units"
                          >
                            +50
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono font-black text-emerald-800 px-2.5 py-1 text-xs bg-emerald-100/80 border border-emerald-300 rounded-lg">
                          {p.currentStock} {getPackagingUnitName(p)} in Godown
                        </span>
                      )}
                    </div>

                    {/* Direct Contact Calling Buttons */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <a
                        href="tel:+919486426294"
                        className="py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                        title="Call Sahadevan"
                      >
                        <Phone className="w-3 h-3" /> Call Sahadevan
                      </a>

                      <a
                        href="tel:+919790924822"
                        className="py-2 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                        title="Call Arun Kavinaya"
                      >
                        <Phone className="w-3 h-3" /> Call Arun
                      </a>
                    </div>

                    {/* WhatsApp Action & Direct Edit/Delete option */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/919486426294?text=Hello%20GokulaKrishnan%20Agencies%2C%20inquiring%20about%20stock%20and%20rates%20for%20${encodeURIComponent(
                          p.name
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Inquiry
                      </a>

                      {isAdminLoggedIn && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="py-1.5 px-2.5 rounded-xl text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
                            title="Edit product"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-emerald-700" /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  Modify Product
                </span>
                <h3 className="font-extrabold text-stone-900 text-base">
                  Edit Name & Stock
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ProductCategory)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="cement">Ordinary Cement</option>
                    <option value="fertilizer">Fertilizers &amp; Nutrients</option>
                    <option value="insecticide">Insecticides</option>
                    <option value="pesticide">Pesticides</option>
                    <option value="weedicide">Weedicides</option>
                    <option value="ant_poison">Ant Poison</option>
                    <option value="rat_poison">Rat Poison</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Rate in INR (₹)
                </label>
                <input
                  type="text"
                  value={editPriceINR}
                  onChange={(e) => setEditPriceINR(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Packaging Unit
                </label>
                <input
                  type="text"
                  value={editPackaging}
                  onChange={(e) => setEditPackaging(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
