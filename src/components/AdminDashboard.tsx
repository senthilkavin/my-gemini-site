import React, { useState } from 'react';
import {
  Building2,
  Package,
  Layers,
  PlusCircle,
  FileText,
  DollarSign,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  Plus,
  Minus,
  Search,
  Printer,
  Sparkles,
  ArrowRight,
  LogOut,
  UserCheck,
  TrendingUp,
  Receipt,
  CreditCard,
  QrCode,
  Banknote,
  Bug,
  Sprout,
  Image as ImageIcon,
  X,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, BillItem, PaymentMode, SalesBill } from '../types';
import { getBillWhatsAppUrl } from '../utils/printInvoice';

export const AdminDashboard: React.FC = () => {
  const {
    currentAdmin,
    adminLogout,
    products,
    addStock,
    setExactStock,
    addNewProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    loadQuickSamples,
    salesBills,
    createSalesBill,
    updateBillPayment,
    setBillPaymentState,
    deleteSalesBill,
    clearAllSalesBills,
    loadSampleBills,
    stockAdjustments,
    setActiveTab,
    selectedBillForPrint,
    setSelectedBillForPrint,
    showToast,
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'stocks' | 'bill_generator' | 'sales_history' | 'imagery'>('stocks');

  // Pending Bill Confirmation state (Yes / No confirmation before money is filled in Merchant Sales)
  const [pendingBillConfirm, setPendingBillConfirm] = useState<{
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: BillItem[];
    discountINR: number;
    taxGSTPercent: number;
    subtotalINR: number;
    grandTotalINR: number;
    amountPaidINR: number;
    balanceDueINR: number;
    paymentMode: PaymentMode;
    paymentReference: string;
    billedBy: string;
    notes: string;
  } | null>(null);

  // Print Last Bill / Customer Payment Confirmation state
  const [billForPaymentConfirm, setBillForPaymentConfirm] = useState<SalesBill | null>(null);

  // Direct Godown Entry Edit & Delete state
  const [editingDirectProduct, setEditingDirectProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // --- DIRECT STOCKS ENTRY FORM (NO DROPDOWNS TO REPLENISH!) ---
  const [inputName, setInputName] = useState('');
  const [inputCategory, setInputCategory] = useState<ProductCategory>('cement');
  const [inputStock, setInputStock] = useState<number | ''>('');
  const [inputPriceINR, setInputPriceINR] = useState<number | ''>('');
  const [inputPackaging, setInputPackaging] = useState('');
  const [inputBrand, setInputBrand] = useState('UltraTech / Dalmia');
  const [inputImagePreset, setInputImagePreset] = useState<'ultratech' | 'insecticide' | 'weedicide' | 'ant' | 'rat' | 'custom'>('ultratech');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [inputActiveIngredient, setInputActiveIngredient] = useState('');
  const [inputUsage, setInputUsage] = useState('');

  // Search filter for stock table
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editStock, setEditStock] = useState<number>(0);
  const [editPriceINR, setEditPriceINR] = useState<number | ''>('');
  const [editCategory, setEditCategory] = useState<ProductCategory>('cement');
  const [editPackaging, setEditPackaging] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editUsage, setEditUsage] = useState('');

  // Balance collection modal
  const [payingBill, setPayingBill] = useState<any | null>(null);
  const [payingAmount, setPayingAmount] = useState<number>(0);
  const [payingMode, setPayingMode] = useState<PaymentMode>('cash');
  const [payingNote, setPayingNote] = useState('');

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditStock(p.currentStock);
    setEditPriceINR(p.unitPriceINR > 0 ? p.unitPriceINR : '');
    setEditCategory(p.category);
    setEditPackaging(p.packagingUnit);
    setEditBrand(p.brand);
    setEditUsage(p.targetPestOrUsage || '');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const priceNum = typeof editPriceINR === 'number' ? editPriceINR : 0;
    updateProduct(editingProduct.id, {
      name: editName.trim(),
      currentStock: Number(editStock) || 0,
      category: editCategory,
      unitPriceINR: priceNum,
      priceEstimated: priceNum > 0 ? `₹${priceNum} (INR)` : 'Rate on Request',
      packagingUnit: editPackaging.trim() || 'Unit Pack',
      brand: editBrand.trim() || 'GokulaKrishnan Agencies',
      targetPestOrUsage: editUsage.trim() || editingProduct.targetPestOrUsage,
    });
    setEditingProduct(null);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBill || payingAmount <= 0) return;
    updateBillPayment(payingBill.id, payingAmount, payingMode, payingNote || 'Balance payment collected');
    setPayingBill(null);
  };

  // --- BILL GENERATOR STATE ---
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [discountINR, setDiscountINR] = useState<number>(0);
  const [taxGSTPercent, setTaxGSTPercent] = useState<number>(0);
  const [amountPaidINR, setAmountPaidINR] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [paymentRef, setPaymentRef] = useState('');
  const [billNotes, setBillNotes] = useState('');
  const [billedByPartner, setBilledByPartner] = useState(currentAdmin?.name || 'Sahadevan');

  // Curated high quality authentic images
  const PRESET_IMAGES = {
    ultratech: {
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
      label: 'UltraTech OPC 53 / PPC Cement',
      category: 'cement',
    },
    insecticide: {
      url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1000&q=80',
      label: 'Insecticide (Chlorpyrifos & Termiticide)',
      category: 'insecticide',
    },
    weedicide: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
      label: 'Weedicide (Glyphosate & Crop Eradication)',
      category: 'weedicide',
    },
    ant: {
      url: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=1000&q=80',
      label: 'Ant Poison (Fipronil Bait Gel & Dust)',
      category: 'ant_poison',
    },
    rat: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
      label: 'Rat Poison (Bromadiolone Wax Cakes)',
      category: 'rat_poison',
    },
  };

  const handleStartDirectEdit = (p: Product) => {
    setEditingDirectProduct(p);
    setInputName(p.name);
    setInputCategory(p.category);
    setInputStock(p.currentStock);
    setInputPriceINR(p.unitPriceINR > 0 ? p.unitPriceINR : '');
    setInputPackaging(p.packagingUnit);
    setInputBrand(p.brand);
    setInputUsage(p.targetPestOrUsage || '');
    setInputActiveIngredient(p.activeIngredient || '');

    if (p.image === PRESET_IMAGES.ultratech.url) setInputImagePreset('ultratech');
    else if (p.image === PRESET_IMAGES.insecticide.url) setInputImagePreset('insecticide');
    else if (p.image === PRESET_IMAGES.weedicide.url) setInputImagePreset('weedicide');
    else if (p.image === PRESET_IMAGES.ant.url) setInputImagePreset('ant');
    else if (p.image === PRESET_IMAGES.rat.url) setInputImagePreset('rat');
    else {
      setInputImagePreset('custom');
      setCustomImageUrl(p.image);
    }

    showToast(`Loaded "${p.name}" in Direct Godown Entry for editing.`);
    const el = document.getElementById('direct-godown-entry-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelDirectEdit = () => {
    setEditingDirectProduct(null);
    setInputName('');
    setInputCategory('cement');
    setInputStock('');
    setInputPriceINR('');
    setInputPackaging('');
    setInputBrand('UltraTech / Dalmia');
    setInputImagePreset('ultratech');
    setCustomImageUrl('');
    setInputActiveIngredient('');
    setInputUsage('');
  };

  // Direct Product & Stock Addition / Editing
  const handleDirectAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      showToast('Please enter a product name');
      return;
    }

    let chosenImg = PRESET_IMAGES[inputCategory === 'cement' ? 'ultratech' : inputCategory === 'weedicide' ? 'weedicide' : inputCategory === 'insecticide' ? 'insecticide' : inputCategory === 'ant_poison' ? 'ant' : 'rat']?.url;
    if (inputImagePreset === 'custom' && customImageUrl.trim()) {
      chosenImg = customImageUrl.trim();
    } else if (inputImagePreset !== 'custom') {
      chosenImg = PRESET_IMAGES[inputImagePreset]?.url || chosenImg;
    }

    const priceNum = typeof inputPriceINR === 'number' ? inputPriceINR : 0;
    const stockNum = typeof inputStock === 'number' ? inputStock : 0;

    if (editingDirectProduct) {
      updateProduct(editingDirectProduct.id, {
        name: inputName.trim(),
        category: inputCategory,
        currentStock: stockNum,
        unitPriceINR: priceNum,
        priceEstimated: priceNum > 0 ? `₹${priceNum} (INR)` : 'Rate on Request',
        packagingUnit: inputPackaging.trim() || (inputCategory === 'cement' ? '50 kg Bag' : 'Unit Pack'),
        brand: inputBrand.trim() || (inputCategory === 'cement' ? 'UltraTech Cement' : 'GokulaKrishnan Verified'),
        activeIngredient: inputActiveIngredient.trim() || editingDirectProduct.activeIngredient,
        targetPestOrUsage: inputUsage.trim() || editingDirectProduct.targetPestOrUsage,
        image: chosenImg,
      });
      showToast(`Product "${inputName.trim()}" updated successfully in Godown!`);
      handleCancelDirectEdit();
    } else {
      addNewProduct({
        name: inputName.trim(),
        category: inputCategory,
        currentStock: stockNum,
        unitPriceINR: priceNum,
        priceEstimated: priceNum > 0 ? `₹${priceNum} (INR)` : 'Rate on Request',
        packagingUnit: inputPackaging.trim() || (inputCategory === 'cement' ? '50 kg Bag' : 'Unit Pack'),
        brand: inputBrand.trim() || (inputCategory === 'cement' ? 'UltraTech Cement' : 'GokulaKrishnan Verified'),
        activeIngredient: inputActiveIngredient.trim() || (inputCategory === 'cement' ? 'IS 12269 Ordinary Portland Clinker 95%' : 'Standard Chemical Specification'),
        targetPestOrUsage: inputUsage.trim() || (inputCategory === 'cement' ? 'Civil Construction & Structural Masonry' : 'Agricultural Protection'),
        safetyHazard: inputCategory === 'cement' ? 'Alkaline powder.' : 'Follow manufacturer safety instructions.',
        image: chosenImg,
      });
      showToast(`Product "${inputName.trim()}" added to Godown with ${stockNum} units!`);
      handleCancelDirectEdit();
    }
  };

  // --- Bill Generator Functions ---
  const handleAddProductToBill = (p: Product) => {
    const existingIndex = billItems.findIndex((item) => item.productId === p.id);
    if (existingIndex >= 0) {
      const existing = billItems[existingIndex];
      const newQty = existing.quantity + 1;
      const updated = [...billItems];
      updated[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalINR: newQty * existing.unitPriceINR,
      };
      setBillItems(updated);
    } else {
      const unitRate = p.unitPriceINR > 0 ? p.unitPriceINR : 100;
      const newItem: BillItem = {
        productId: p.id,
        productName: p.name,
        category: p.category,
        packagingUnit: p.packagingUnit,
        quantity: 1,
        unitPriceINR: unitRate,
        totalINR: unitRate,
      };
      setBillItems([...billItems, newItem]);
    }
  };

  const handleUpdateBillItemQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setBillItems(billItems.filter((i) => i.productId !== productId));
    } else {
      setBillItems(
        billItems.map((i) =>
          i.productId === productId
            ? { ...i, quantity: newQty, totalINR: newQty * i.unitPriceINR }
            : i
        )
      );
    }
  };

  const handleUpdateBillItemPrice = (productId: string, newPriceINR: number) => {
    setBillItems(
      billItems.map((i) =>
        i.productId === productId
          ? { ...i, unitPriceINR: newPriceINR, totalINR: i.quantity * newPriceINR }
          : i
      )
    );
  };

  const handleRemoveBillItem = (productId: string) => {
    setBillItems(billItems.filter((i) => i.productId !== productId));
  };

  // Calculations for bill
  const billSubtotal = billItems.reduce((acc, item) => acc + item.totalINR, 0);
  const taxable = Math.max(0, billSubtotal - (discountINR || 0));
  const billGST = Math.round((taxable * (taxGSTPercent || 0)) / 100);
  const billGrandTotal = taxable + billGST;

  const handleGenerateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (billItems.length === 0) {
      showToast('Please add at least one product to the bill before generating.');
      return;
    }
    if (!customerName.trim()) {
      showToast('Please enter customer name to generate bill.');
      return;
    }

    const paidNum =
      typeof amountPaidINR === 'number'
        ? Math.max(0, amountPaidINR)
        : billGrandTotal; // Default to full payment if left blank

    const balanceDue = Math.max(0, billGrandTotal - paidNum);

    // Open confirmation modal: Prompt user with Yes or No before recording sales & generating bill
    setPendingBillConfirm({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      customerAddress: customerAddress.trim(),
      items: billItems,
      discountINR,
      taxGSTPercent,
      subtotalINR: billSubtotal,
      grandTotalINR: billGrandTotal,
      amountPaidINR: paidNum,
      balanceDueINR: balanceDue,
      paymentMode,
      paymentReference: paymentRef.trim(),
      billedBy: billedByPartner,
      notes: billNotes.trim(),
    });
  };

  const handleConfirmBillGenerationYes = () => {
    if (!pendingBillConfirm) return;

    // NOW and ONLY now after explicit "Yes" confirmation is the bill generated and money recorded in Merchant Sales
    const newBill = createSalesBill({
      customerName: pendingBillConfirm.customerName,
      customerPhone: pendingBillConfirm.customerPhone,
      customerAddress: pendingBillConfirm.customerAddress,
      items: pendingBillConfirm.items,
      discountINR: pendingBillConfirm.discountINR,
      taxGSTPercent: pendingBillConfirm.taxGSTPercent,
      amountPaidINR: pendingBillConfirm.amountPaidINR,
      paymentMode: pendingBillConfirm.paymentMode,
      paymentReference: pendingBillConfirm.paymentReference,
      billedBy: pendingBillConfirm.billedBy,
      notes: pendingBillConfirm.notes,
    });

    const recordedMoney = pendingBillConfirm.amountPaidINR;

    // Reset bill generator form
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setBillItems([]);
    setDiscountINR(0);
    setTaxGSTPercent(0);
    setAmountPaidINR('');
    setPaymentRef('');
    setBillNotes('');

    setPendingBillConfirm(null);

    // Open printable tax invoice modal
    setSelectedBillForPrint(newBill);

    showToast(`✓ Confirmed! Bill #${newBill.billNumber} created & ₹${recordedMoney.toLocaleString('en-IN')} filled in Merchant Sales.`);
  };

  const handleConfirmBillGenerationNo = () => {
    setPendingBillConfirm(null);
    showToast('Bill generation cancelled. No changes made to Merchant Sales.');
  };

  // Trigger Print Last Bill with Customer Payment Confirmation
  const handleTriggerPrintLastBill = () => {
    if (salesBills.length === 0) {
      showToast('No sales bills recorded yet. Create a bill first.');
      return;
    }
    setBillForPaymentConfirm(salesBills[0]);
  };

  const handleConfirmCustomerPaymentYes = () => {
    if (!billForPaymentConfirm) return;
    const targetBill = billForPaymentConfirm;
    const fullAmount = targetBill.grandTotalINR;

    // Fill the exact full amount into Merchant Sales Collected
    setBillPaymentState(
      targetBill.id,
      fullAmount,
      targetBill.paymentMode || 'cash',
      'Customer payment confirmed: filled in Merchant Sales'
    );

    const updatedBillForPrint: SalesBill = {
      ...targetBill,
      amountPaidINR: fullAmount,
      balanceDueINR: 0,
      paymentStatus: 'paid',
    };

    setBillForPaymentConfirm(null);
    setSelectedBillForPrint(updatedBillForPrint);
    showToast(`✓ Confirmed! Customer payment of ₹${fullAmount.toLocaleString('en-IN')} filled in Merchant Sales.`);
  };

  const handleConfirmCustomerPaymentNo = () => {
    if (billForPaymentConfirm) {
      // User says: "Rs 255 is hown in the Sales,remove the amount -it should be Rs 0 when the No customer Not ready"
      // Explicitly remove the amount from sales so Merchant Sales Collected becomes ₹0!
      setBillPaymentState(
        billForPaymentConfirm.id,
        0,
        billForPaymentConfirm.paymentMode,
        'Customer not ready: sales amount reset to ₹0'
      );
    }
    setBillForPaymentConfirm(null);
    showToast('Customer not ready: Sales set to ₹0. Amount removed from Merchant Sales.');
  };

  // Revenue Metrics
  const totalSalesRevenueINR = salesBills.reduce((acc, b) => acc + b.amountPaidINR, 0);
  const totalPendingDueINR = salesBills.reduce((acc, b) => acc + b.balanceDueINR, 0);
  const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);

  // Filtered products for direct stock table
  const filteredProducts = products.filter((p) => {
    const q = stockSearchQuery.toLowerCase().trim();
    return !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Merchant Identity Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              Authorized Merchant & Godown Manager
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-serif">
            Gokula<span className="text-emerald-400">Krishnan</span> Agencies
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
            <span className="flex items-center gap-1.5 font-bold bg-stone-800/80 px-3 py-1 rounded-full border border-stone-700">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Logged in as: <strong className="text-white">{currentAdmin?.name} ({currentAdmin?.phone})</strong>
            </span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300">
              Partner: <strong>Sahadevan (+91 94864 26294)</strong> &amp; <strong>Arun Kavinaya (+91 97909 74822)</strong>
            </span>
          </div>
        </div>

        {/* Quick Actions & Logout */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveAdminTab('bill_generator')}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" /> New Sales Bill (INR)
          </button>

          {salesBills.length > 0 && (
            <button
              onClick={handleTriggerPrintLastBill}
              className="py-2.5 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white border border-stone-700 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow transition-all cursor-pointer"
              title="Print the most recent sales bill"
            >
              <Printer className="w-4 h-4 text-amber-400" /> Print Last Bill
            </button>
          )}

          <button
            onClick={() => setActiveAdminTab('stocks')}
            className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Enter Stocks
          </button>

          <button
            onClick={adminLogout}
            className="py-2.5 px-3.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-white border border-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Log out of Owner Dashboard"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 block text-[11px]">Merchant Sales Collected:</span>
            {totalSalesRevenueINR > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (salesBills.length > 0) {
                    setBillPaymentState(salesBills[0].id, 0, salesBills[0].paymentMode, 'Customer not ready: reset to ₹0');
                    showToast('Merchant Sales set to ₹0 (Customer payment not ready).');
                  }
                }}
                className="text-[10px] text-stone-400 hover:text-rose-600 underline font-sans cursor-pointer"
                title="Reset sales amount to ₹0 if customer is not ready"
              >
                Set ₹0
              </button>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-0.5">
            ₹{totalSalesRevenueINR.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-sans font-bold">In Indian Rupees (INR)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-stone-500 block text-[11px]">Credit / Balance Due:</span>
          <div className="text-xl sm:text-2xl font-black text-rose-700 mt-0.5">
            ₹{totalPendingDueINR.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-rose-600 font-sans font-bold">Outstanding Customer Balances</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-stone-500 block text-[11px]">Godown Total Stock:</span>
          <div className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
            {totalStockUnits.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-500 font-sans font-bold">Bags, Liters &amp; Bait Units</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-stone-500 block text-[11px]">Generated Sales Bills:</span>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">
            {salesBills.length}
          </div>
          <span className="text-[10px] text-amber-600 font-sans font-bold">Tax Invoices Recorded</span>
        </div>
      </div>

      {/* VISUAL SHOWCASE: ULTRATECH CEMENT, INSECTICIDES & WEEDICIDES IMAGES */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
                Commodity Visual Showcase
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif mt-1">
              UltraTech Cement, Insecticides &amp; Weedicides Gallery
            </h2>
          </div>
          <p className="text-xs text-stone-400 max-w-md">
            Direct factory consignments stocked at GokulaKrishnan Agencies warehouse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: UltraTech Cement Images */}
          <div className="bg-stone-800/90 rounded-2xl overflow-hidden border border-stone-700 flex flex-col justify-between group hover:border-amber-500/50 transition-all">
            <div className="relative h-48 w-full overflow-hidden bg-stone-950">
              <img
                src={PRESET_IMAGES.ultratech.url}
                alt="UltraTech Ordinary Portland Cement"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                UltraTech Cement
              </span>
              <span className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm drop-shadow">
                OPC 53 Grade &amp; PPC Building Cement
              </span>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <p className="text-stone-300 leading-relaxed">
                Ordinary Portland Cement (not agricultural) conforming to IS 12269. Fresh pallet stacks ready for immediate loading onto trucks.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-stone-700/80 font-mono text-stone-400 text-[11px]">
                <span>Packaging: <strong>50 kg Bag</strong></span>
                <span className="text-amber-400 font-bold">Trade in INR (₹)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Insecticides Images */}
          <div className="bg-stone-800/90 rounded-2xl overflow-hidden border border-stone-700 flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
            <div className="relative h-48 w-full overflow-hidden bg-stone-950">
              <img
                src={PRESET_IMAGES.insecticide.url}
                alt="Insecticide & Termite Control"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                Insecticides
              </span>
              <span className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm drop-shadow">
                Chlorpyrifos &amp; Soil Termiticides
              </span>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <p className="text-stone-300 leading-relaxed">
                Broad-spectrum soil termite barrier &amp; foliar insecticide. Pre-construction trenching and agricultural stem borer eradication.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-stone-700/80 font-mono text-stone-400 text-[11px]">
                <span>Packaging: <strong>1 Liter / 5 Liter</strong></span>
                <span className="text-emerald-400 font-bold">Direct Godown Stock</span>
              </div>
            </div>
          </div>

          {/* Card 3: Weedicides Images */}
          <div className="bg-stone-800/90 rounded-2xl overflow-hidden border border-stone-700 flex flex-col justify-between group hover:border-green-500/50 transition-all">
            <div className="relative h-48 w-full overflow-hidden bg-stone-950">
              <img
                src={PRESET_IMAGES.weedicide.url}
                alt="Weedicide Farmland Eradication"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                Weedicides
              </span>
              <span className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm drop-shadow">
                Glyphosate Systemic Herbicides
              </span>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <p className="text-stone-300 leading-relaxed">
                Non-selective systemic weedicides for total clearing of persistent vegetation, farmland bunds, vacant plots, and construction sites.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-stone-700/80 font-mono text-stone-400 text-[11px]">
                <span>Packaging: <strong>1 Liter Canister</strong></span>
                <span className="text-green-400 font-bold">Fast Action Kill</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Feature Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveAdminTab('stocks')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeAdminTab === 'stocks'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Direct Stocks Entry (No Dropdowns)</span>
          <span className="bg-emerald-900 text-emerald-200 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('bill_generator')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeAdminTab === 'bill_generator'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-500" />
          <span>Payment &amp; Sales Bill Generator</span>
          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded text-[10px] font-mono">
            INR (₹)
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('sales_history')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
            activeAdminTab === 'sales_history'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sales Register &amp; Money Received ({salesBills.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DIRECT STOCKS ENTRY (REVOKED DROPDOWN!) */}
      {/* ========================================================= */}
      {activeAdminTab === 'stocks' && (
        <div className="space-y-8">
          {/* Direct Stock Form */}
          <div
            id="direct-godown-entry-card"
            className={`bg-white rounded-3xl p-6 sm:p-8 border-2 shadow-xl space-y-5 transition-all ${
              editingDirectProduct
                ? 'border-amber-500 ring-4 ring-amber-400/20'
                : 'border-emerald-600/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                {editingDirectProduct ? (
                  <>
                    <span className="text-[10px] font-black text-amber-900 bg-amber-100 border border-amber-300 uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block">
                      Direct Godown Entry • Edit Mode
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900 mt-1">
                      Edit Product &amp; Stock: <span className="text-emerald-800">{editingDirectProduct.name}</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Update details, rates, or stocks. You can also delete this product directly below.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                      Direct Godown Entry
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">
                      Enter New Product Name &amp; Initial Stock
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 font-mono">
                      Direct entry into live godown database • Select below to edit or delete existing items
                    </p>
                  </>
                )}
              </div>

              {/* Quick Edit / Delete Selector for Direct Godown Entry */}
              <div className="flex flex-wrap items-center gap-2">
                {editingDirectProduct ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelDirectEdit}
                      className="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-stone-500" /> Cancel Edit &amp; Add New
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductToDelete(editingDirectProduct)}
                      className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete Product
                    </button>
                  </div>
                ) : (
                  products.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                      <Edit3 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <label htmlFor="quick-edit-select" className="text-[11px] font-bold text-stone-700 whitespace-nowrap">
                        Edit / Delete:
                      </label>
                      <select
                        id="quick-edit-select"
                        value=""
                        onChange={(e) => {
                          const found = products.find((p) => p.id === e.target.value);
                          if (found) handleStartDirectEdit(found);
                        }}
                        className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 cursor-pointer"
                      >
                        <option value="">-- Choose Godown Item to Edit/Delete --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.currentStock} in stock • ₹{p.unitPriceINR})
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
              </div>
            </div>

            <form onSubmit={handleDirectAddProduct} className="space-y-4 text-xs">
              {/* Row 1: Name, Category, Stock & Unit Price in INR */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-5">
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Product Name * <span className="text-stone-400 font-normal">(User entered name)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UltraTech 53 Grade OPC Cement / Chlorpyrifos 20% EC"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full border-2 border-emerald-600/40 rounded-xl px-3.5 py-2.5 text-stone-900 font-semibold text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Category *
                  </label>
                  <select
                    value={inputCategory}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      setInputCategory(cat);
                      if (cat === 'cement') setInputImagePreset('ultratech');
                      else if (cat === 'insecticide') setInputImagePreset('insecticide');
                      else if (cat === 'weedicide') setInputImagePreset('weedicide');
                      else if (cat === 'ant_poison') setInputImagePreset('ant');
                      else if (cat === 'rat_poison') setInputImagePreset('rat');
                    }}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="cement">Ordinary Cement (OPC 53/43/PPC Building)</option>
                    <option value="insecticide">Insecticides (Termite / Soil pests)</option>
                    <option value="weedicide">Weedicides (Glyphosate / Land clearing)</option>
                    <option value="pesticide">Pesticides &amp; Crop Fungicides</option>
                    <option value="ant_poison">Ant Poison (Bait Gels / Dusts)</option>
                    <option value="rat_poison">Rat Poison (Rodenticide Cakes)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 500"
                    value={inputStock}
                    onChange={(e) => setInputStock(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full border-2 border-emerald-600/40 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono font-black text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Rate in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 395"
                    value={inputPriceINR}
                    onChange={(e) => setInputPriceINR(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full border-2 border-emerald-600/40 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono font-black text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20"
                  />
                </div>
              </div>

              {/* Row 2: Brand, Packaging & Image Preset */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Packaging Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 kg Bag / 1 Liter / 100g Bar"
                    value={inputPackaging}
                    onChange={(e) => setInputPackaging(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Select Product Image Photo:
                  </label>
                  <select
                    value={inputImagePreset}
                    onChange={(e) => setInputImagePreset(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="ultratech">UltraTech Cement Bag Photo</option>
                    <option value="insecticide">Insecticide Spray &amp; Canister Photo</option>
                    <option value="weedicide">Weedicide Farmland Spray Photo</option>
                    <option value="ant">Ant Poison Gel Photo</option>
                    <option value="rat">Rat Poison Block Photo</option>
                    <option value="custom">Custom Web Image URL</option>
                  </select>
                </div>
              </div>

              {inputImagePreset === 'custom' && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Custom Image URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-[11px] text-stone-500 font-mono">
                  All transactions and stock values logged in Indian Rupee (INR / ₹).
                </span>

                {editingDirectProduct ? (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setProductToDelete(editingDirectProduct)}
                      className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Permanently delete this product from Godown"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Product</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelDirectEdit}
                      className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs border border-stone-300 transition-colors cursor-pointer"
                    >
                      Cancel Edit
                    </button>

                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>Save Product Changes (INR)</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="py-3 px-8 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Save Product &amp; Add Stock to Godown
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Direct Stock Table & Inline Stock Counters */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  Live Stock Inventory (Direct Updates)
                </h3>
                <p className="text-xs text-stone-500">
                  Click <strong>+1, +10, +50, +100</strong> to instantly add incoming stock. No dropdown required.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search stock..."
                    value={stockSearchQuery}
                    onChange={(e) => setStockSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={loadQuickSamples}
                  className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Load Preset Samples
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-2xl space-y-3">
                <Package className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-stone-700 text-xs">No custom products entered yet.</p>
                <button
                  type="button"
                  onClick={loadQuickSamples}
                  className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Load Demo Commodities &amp; Images (Cements, Insecticides, Weedicides)
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-900 text-white font-bold">
                      <th className="py-3 px-3">Item Photo</th>
                      <th className="py-3 px-3">Product Name &amp; Brand</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Packaging</th>
                      <th className="py-3 px-3 text-right">Trade Rate (INR)</th>
                      <th className="py-3 px-3 text-center">Live Godown Stock</th>
                      <th className="py-3 px-3 text-center">Direct Add Stock</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-2.5 px-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <strong className="text-stone-900 block text-sm">{p.name}</strong>
                          <span className="text-[11px] text-stone-500">{p.brand}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-300">
                            {p.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-600">{p.packagingUnit}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                          ₹{p.unitPriceINR > 0 ? p.unitPriceINR.toLocaleString('en-IN') : p.priceEstimated}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`font-mono font-black text-sm px-2.5 py-1 rounded-xl shadow-sm ${
                              p.currentStock > 15
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : p.currentStock > 0
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {p.currentStock} Units
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {/* Direct Quick Increment Buttons (NO DROPDOWNS!) */}
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => addStock(p.id, -1, 'Direct deduction')}
                              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center border border-stone-300"
                              title="Deduct 1 unit"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => addStock(p.id, 1, 'Direct addition')}
                              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-300"
                              title="Add +1 unit"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => addStock(p.id, 10, 'Direct addition')}
                              className="py-1 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] border border-emerald-300"
                              title="Add +10 units"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => addStock(p.id, 50, 'Truckload batch arrival')}
                              className="py-1 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-sm"
                              title="Add +50 units"
                            >
                              +50
                            </button>
                            <button
                              onClick={() => addStock(p.id, 100, 'Consignment shipment')}
                              className="py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-[11px] shadow-sm"
                              title="Add +100 units"
                            >
                              +100
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleStartDirectEdit(p)}
                              className="py-1 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit product name, stock, rate, or packaging in Direct Godown Entry"
                            >
                              <Edit3 className="w-3 h-3 text-emerald-700" /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PAYMENT & SALES BILL GENERATOR */}
      {/* ========================================================= */}
      {activeAdminTab === 'bill_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Select Products from Stock for the Bill */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                    Available Godown Inventory
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    Select Products to Bill
                  </h3>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  Auto-deducts from stock
                </span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {products.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500 space-y-3">
                    <p>No products registered in godown yet.</p>
                    <button
                      type="button"
                      onClick={loadQuickSamples}
                      className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Load Demo Stock Products with Images
                    </button>
                  </div>
                ) : (
                  products.map((p) => {
                    const isOutOfStock = p.currentStock <= 0;
                    return (
                      <div
                        key={p.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isOutOfStock
                            ? 'bg-stone-50 border-stone-200 opacity-60'
                            : 'bg-white border-stone-200 hover:border-emerald-500 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200"
                          />
                          <div>
                            <strong className="text-stone-900 text-xs block leading-snug">
                              {p.name}
                            </strong>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono mt-0.5">
                              <span>{p.packagingUnit}</span>
                              <span>•</span>
                              <span className="font-bold text-emerald-800">
                                ₹{p.unitPriceINR > 0 ? p.unitPriceINR : 395} (INR)
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-600 font-semibold mt-0.5">
                              Stock in Godown: <strong className="text-stone-900">{p.currentStock} Units</strong>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleAddProductToBill(p)}
                          className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm shrink-0 ${
                            isOutOfStock
                              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Bill
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Details, Line Items, Payment & Bill Generation */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleGenerateBillSubmit}
              className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-900 shadow-2xl space-y-6 text-xs"
            >
              {/* Bill Title & Merchant Details */}
              <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 block">
                    GokulaKrishnan Agencies • Sales Bill &amp; Payment Desk
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 font-serif">
                    Payment &amp; Invoice Generator
                  </h2>
                </div>
                <div className="font-mono text-stone-500 text-[11px] text-right">
                  All transactions in <strong>INR (₹)</strong>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Customer / Buyer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. K. Senthil / Sri Murugan Builders"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Customer Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">
                    Delivery Address / Village / Site Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Plot No 12, Main Road, Construction Site / Farm"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-stone-900 text-sm">
                    Items on Bill ({billItems.length})
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Adjust rates or quantities below
                  </span>
                </div>

                {billItems.length === 0 ? (
                  <div className="bg-amber-50/50 p-6 rounded-2xl border border-dashed border-amber-300 text-center text-amber-900">
                    <Receipt className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <strong>No items added to bill yet.</strong>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Click <strong>"+ Add to Bill"</strong> from the left list to add cement bags, insecticides, weedicides, or poison.
                    </p>
                  </div>
                ) : (
                  <div className="border border-stone-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                          <th className="py-2.5 px-3">Item</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                          <th className="py-2.5 px-3 text-right">Total (₹)</th>
                          <th className="py-2.5 px-3 text-center">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 font-mono">
                        {billItems.map((item) => (
                          <tr key={item.productId} className="hover:bg-stone-50">
                            <td className="py-2.5 px-3 font-sans">
                              <strong className="text-stone-900 block">{item.productName}</strong>
                              <span className="text-[10px] text-stone-500">{item.packagingUnit}</span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBillItemQty(item.productId, item.quantity - 1)}
                                  className="w-5 h-5 rounded bg-stone-200 flex items-center justify-center text-stone-800 font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="font-bold text-stone-900 px-1">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBillItemQty(item.productId, item.quantity + 1)}
                                  className="w-5 h-5 rounded bg-stone-200 flex items-center justify-center text-stone-800 font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                min="0"
                                value={item.unitPriceINR}
                                onChange={(e) => handleUpdateBillItemPrice(item.productId, parseFloat(e.target.value) || 0)}
                                className="w-20 border border-stone-300 rounded px-1.5 py-0.5 text-right font-mono text-stone-900"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                              ₹{item.totalINR.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveBillItem(item.productId)}
                                className="text-stone-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pricing, Discount, GST & Payment Mode */}
              <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Discount in INR (₹):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountINR}
                      onChange={(e) => setDiscountINR(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-mono text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      GST % (Optional):
                    </label>
                    <select
                      value={taxGSTPercent}
                      onChange={(e) => setTaxGSTPercent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-stone-900"
                    >
                      <option value="0">0% (Nil / Exempt / Local Wholesale)</option>
                      <option value="5">5% GST (Agrochemicals Concessional)</option>
                      <option value="18">18% GST (Standard Tax Invoice)</option>
                      <option value="28">28% GST (Cement Standard GST Rate)</option>
                    </select>
                  </div>
                </div>

                {/* Subtotal & Grand Total Preview */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 font-mono space-y-1.5">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span>₹{billSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountINR > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span>- ₹{discountINR.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {taxGSTPercent > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>GST ({taxGSTPercent}%):</span>
                      <span>+ ₹{billGST.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black text-stone-900 pt-2 border-t border-stone-900">
                    <span>Net Bill Amount:</span>
                    <span className="text-emerald-900">₹{billGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Payment Collection Fields */}
                <div className="border-t border-stone-200 pt-3 space-y-3">
                  <span className="font-extrabold text-stone-900 text-xs uppercase tracking-wider block">
                    Record Money Received &amp; Payment Method (INR):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-extrabold text-stone-800 block mb-1">
                        Amount Paid (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={billGrandTotal}
                        placeholder={`Full: ₹${billGrandTotal}`}
                        value={amountPaidINR}
                        onChange={(e) => setAmountPaidINR(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full bg-emerald-50 border-2 border-emerald-600 rounded-xl px-3 py-2 font-mono font-black text-emerald-950 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setAmountPaidINR(billGrandTotal)}
                        className="text-[10px] text-emerald-700 hover:underline mt-1 font-bold"
                      >
                        Set Full Amount (₹{billGrandTotal})
                      </button>
                    </div>

                    <div>
                      <label className="font-extrabold text-stone-800 block mb-1">
                        Payment Mode *
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-stone-900"
                      >
                        <option value="cash">Cash in Hand</option>
                        <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                        <option value="bank_transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                        <option value="cheque">Cheque</option>
                        <option value="credit">Credit / Khata (Pending Balance)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Billed By (Partner)
                      </label>
                      <select
                        value={billedByPartner}
                        onChange={(e) => setBilledByPartner(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-stone-900"
                      >
                        <option value="Sahadevan">Sahadevan (+91 94864 26294)</option>
                        <option value="Arun Kavinaya">Arun Kavinaya (+91 97909 74822)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Payment Reference / UPI Ref / Cheque No / Notes:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI Ref: 493012984920 or Cheque #89102"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-[11px] text-stone-500">
                  Stock will be automatically deducted from godown inventory upon bill creation.
                </span>

                <button
                  type="submit"
                  disabled={billItems.length === 0}
                  className={`py-3.5 px-8 rounded-xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    billItems.length === 0
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                      : 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white shadow-emerald-950/40'
                  }`}
                >
                  <Printer className="w-5 h-5 text-amber-300" />
                  <span>Generate &amp; Print Sales Bill (INR)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SALES REGISTER & MONEY RECEIVED */}
      {/* ========================================================= */}
      {activeAdminTab === 'sales_history' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                Accounting &amp; Payment Records
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">
                Sales Register &amp; Money Received in INR
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-mono text-xs bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
                Merchant Sales: ₹{totalSalesRevenueINR.toLocaleString('en-IN')}
              </div>
              {salesBills.length > 0 ? (
                <button
                  type="button"
                  onClick={clearAllSalesBills}
                  className="py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 border border-stone-300 hover:border-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Clear all recorded sales bills and reset Merchant Sales back to ₹0"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Sales (₹0)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadSampleBills}
                  className="py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Load sample sales receipts for testing"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" /> Load Sample Bills
                </button>
              )}
            </div>
          </div>

          {salesBills.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-2xl space-y-2">
              <Receipt className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-700 text-sm">No sales bills created yet.</p>
              <p className="text-xs text-stone-500">
                Go to the "Payment &amp; Sales Bill Generator" tab to create your first bill and record payment.
              </p>
              <button
                onClick={() => setActiveAdminTab('bill_generator')}
                className="mt-3 py-2 px-4 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                + Create First Sales Bill
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-900 text-white font-bold">
                    <th className="py-3 px-3">Bill Number</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer Details</th>
                    <th className="py-3 px-3">Items Sold</th>
                    <th className="py-3 px-3 text-right">Bill Total (₹)</th>
                    <th className="py-3 px-3 text-right">Paid (₹)</th>
                    <th className="py-3 px-3 text-right">Due (₹)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-medium">
                  {salesBills.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                        {b.billNumber}
                      </td>
                      <td className="py-2.5 px-3 text-stone-500 font-mono">
                        {new Date(b.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-2.5 px-3">
                        <strong className="text-stone-900 block">{b.customerName}</strong>
                        <span className="text-[11px] text-stone-500 font-mono">{b.customerPhone}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-stone-700 max-w-xs truncate">
                          {b.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {b.items.length} product{b.items.length === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                        ₹{b.grandTotalINR.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        ₹{b.amountPaidINR.toLocaleString('en-IN')}
                        <span className="block text-[10px] text-stone-400 uppercase font-sans font-normal">
                          {b.paymentMode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">
                        {b.balanceDueINR > 0 ? `₹${b.balanceDueINR.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {b.paymentStatus === 'paid' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Paid
                          </span>
                        ) : b.paymentStatus === 'partial' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            Partial
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Due
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setBillForPaymentConfirm(b)}
                            className="py-1 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                            title="Print / View Official Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-300" /> Print
                          </button>
                          <a
                            href={getBillWhatsAppUrl(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                            title={
                              b.customerPhone
                                ? `Send Bill #${b.billNumber} to ${b.customerName} (${b.customerPhone}) via WhatsApp`
                                : `Send Bill #${b.billNumber} via WhatsApp`
                            }
                          >
                            <span className="text-xs">💬</span> WhatsApp
                          </a>
                          {b.balanceDueINR > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPayingBill(b);
                                setPayingAmount(b.balanceDueINR);
                                setPayingMode('cash');
                                setPayingNote('Balance payment collected');
                              }}
                              className="py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                              title="Record balance payment"
                            >
                              + Pay
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteSalesBill(b.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Delete bill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* In-App Edit Product Modal for Admin */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 text-stone-900">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                  Inventory Management
                </span>
                <h3 className="font-extrabold text-stone-900 text-lg">
                  Edit Product &amp; Stock
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-stone-800 block mb-1">
                  Product / Commodity Name *
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
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Godown Stock Count *
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
                  <label className="font-extrabold text-stone-800 block mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ProductCategory)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="cement">Ordinary Cement</option>
                    <option value="insecticide">Insecticides</option>
                    <option value="pesticide">Pesticides</option>
                    <option value="weedicide">Weedicides</option>
                    <option value="ant_poison">Ant Poison</option>
                    <option value="rat_poison">Rat Poison</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Unit Rate in INR (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 395"
                    value={editPriceINR}
                    onChange={(e) => setEditPriceINR(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Packaging Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 kg Bag / 1 Liter"
                    value={editPackaging}
                    onChange={(e) => setEditPackaging(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  placeholder="e.g. UltraTech / Dalmia / Bayer"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Usage / Target Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Civil structural construction or Agricultural weed control"
                  value={editUsage}
                  onChange={(e) => setEditUsage(e.target.value)}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Record Payment Modal */}
      {payingBill && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 text-stone-900">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                  Sales Accounting
                </span>
                <h3 className="font-extrabold text-stone-900 text-lg">
                  Record Balance Payment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPayingBill(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Bill Number:</span>
                  <strong className="text-stone-900 font-mono">#{payingBill.billNumber}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Customer:</span>
                  <strong className="text-stone-900">{payingBill.customerName}</strong>
                </div>
                <div className="flex justify-between text-rose-700 font-bold pt-1 border-t border-stone-200">
                  <span>Pending Balance:</span>
                  <span className="font-mono text-sm">₹{payingBill.balanceDueINR.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-stone-800 block mb-1">
                  Amount Received in INR (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={payingBill.balanceDueINR}
                  required
                  value={payingAmount}
                  onChange={(e) => setPayingAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-emerald-50 border-2 border-emerald-600 rounded-xl px-3 py-2 font-mono font-black text-emerald-950 text-base"
                />
                <button
                  type="button"
                  onClick={() => setPayingAmount(payingBill.balanceDueINR)}
                  className="text-[11px] text-emerald-700 hover:underline mt-1 font-bold block"
                >
                  Pay Full Balance (₹{payingBill.balanceDueINR})
                </button>
              </div>

              <div>
                <label className="font-extrabold text-stone-800 block mb-1">
                  Payment Mode *
                </label>
                <select
                  value={payingMode}
                  onChange={(e) => setPayingMode(e.target.value as PaymentMode)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-stone-900"
                >
                  <option value="cash">Cash in Hand</option>
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="bank_transfer">Bank Transfer (NEFT / RTGS)</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Payment Reference / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cash received by Sahadevan / GPay Ref #4920"
                  value={payingNote}
                  onChange={(e) => setPayingNote(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingBill(null)}
                  className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Record Payment (₹{payingAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONFIRMATION MODAL: YES / NO FOR BILL & MERCHANT SALES */}
      {/* ========================================================= */}
      {pendingBillConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-emerald-600 space-y-5 animate-in zoom-in-95 text-stone-900">
            {/* Header */}
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
                  <Receipt className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
                    Sales Confirmation
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 font-serif">
                    Record Money in Merchant Sales?
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleConfirmBillGenerationNo}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Details Summary */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-stone-700">
                <span>Customer Name:</span>
                <strong className="text-stone-900 font-bold text-sm">
                  {pendingBillConfirm.customerName}
                </strong>
              </div>
              <div className="flex justify-between items-center text-stone-600 font-mono">
                <span>Phone:</span>
                <span>{pendingBillConfirm.customerPhone}</span>
              </div>
              {pendingBillConfirm.customerAddress && (
                <div className="flex justify-between items-center text-stone-600">
                  <span>Location / Site:</span>
                  <span className="text-right text-stone-700 font-medium">{pendingBillConfirm.customerAddress}</span>
                </div>
              )}
              <div className="flex justify-between items-start text-stone-600 border-t border-stone-200 pt-2">
                <span>Items ({pendingBillConfirm.items.length}):</span>
                <div className="text-right max-w-xs font-semibold text-stone-900">
                  {pendingBillConfirm.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-stone-200 pt-2 text-stone-700">
                <span>Total Bill Value:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  ₹{pendingBillConfirm.grandTotalINR.toLocaleString('en-IN')}
                </span>
              </div>

              {/* HIGHLIGHT: EXACT AMOUNT TO FILL IN SALES */}
              <div className="bg-emerald-100/90 border-2 border-emerald-600 rounded-xl p-3.5 flex justify-between items-center text-emerald-950 font-bold">
                <div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-emerald-800">
                    Money to fill in Merchant Sales (INR):
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-900">
                    ₹{pendingBillConfirm.amountPaidINR.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="bg-emerald-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide">
                  {pendingBillConfirm.paymentMode.replace('_', ' ')}
                </span>
              </div>

              {pendingBillConfirm.balanceDueINR > 0 && (
                <div className="flex justify-between items-center text-rose-700 font-bold">
                  <span>Outstanding Customer Balance (Credit Due):</span>
                  <span className="font-mono font-bold">₹{pendingBillConfirm.balanceDueINR.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Prompt with clear explanation */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                Confirmation Required (Yes / No):
              </p>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Money will be filled into <strong>Merchant Sales Collected</strong> only after your confirmation. Stock will also be deducted from the Godown database.
              </p>
            </div>

            {/* Yes / No Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleConfirmBillGenerationNo}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 border border-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-rose-600" />
                <span>No, Cancel &amp; Review</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmBillGenerationYes}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Yes, Confirm Bill &amp; Add ₹{pendingBillConfirm.amountPaidINR.toLocaleString('en-IN')} to Sales</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONFIRMATION MODAL: IS CUSTOMER READY FOR PAYMENT (PRINT BILL) */}
      {/* ========================================================= */}
      {billForPaymentConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-emerald-600 space-y-5 animate-in zoom-in-95 text-stone-900">
            {/* Header */}
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
                  <Printer className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
                    Customer Payment Confirmation
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 font-serif">
                    Is customer ready for payment to be done?
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleConfirmCustomerPaymentNo}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Summary */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-stone-700">
                <span>Bill Number:</span>
                <strong className="text-stone-900 font-mono font-bold text-sm">
                  #{billForPaymentConfirm.billNumber}
                </strong>
              </div>
              <div className="flex justify-between items-center text-stone-700">
                <span>Customer Name:</span>
                <strong className="text-stone-900 font-bold">
                  {billForPaymentConfirm.customerName}
                </strong>
              </div>
              <div className="flex justify-between items-center text-stone-600 font-mono">
                <span>Customer Phone:</span>
                <span>{billForPaymentConfirm.customerPhone}</span>
              </div>
              <div className="flex justify-between items-start text-stone-600 border-t border-stone-200 pt-2">
                <span>Items Billed:</span>
                <div className="text-right max-w-xs font-semibold text-stone-900">
                  {billForPaymentConfirm.items.map((i: BillItem) => `${i.productName} (${i.quantity})`).join(', ')}
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-stone-200 pt-2 text-stone-700">
                <span>Total Bill Value (INR):</span>
                <span className="font-mono font-black text-stone-900 text-sm">
                  ₹{billForPaymentConfirm.grandTotalINR.toLocaleString('en-IN')}
                </span>
              </div>

              {/* HIGHLIGHT: EXACT AMOUNT TO FILL IN SALES */}
              <div className="bg-emerald-100/90 border-2 border-emerald-600 rounded-xl p-3.5 flex justify-between items-center text-emerald-950 font-bold">
                <div>
                  <span className="block text-[10px] uppercase font-black tracking-wider text-emerald-800">
                    Money to fill in Merchant Sales (INR):
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-900">
                    ₹{billForPaymentConfirm.grandTotalINR.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="bg-emerald-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide">
                  {billForPaymentConfirm.paymentMode.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Prompt explanation */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                Confirmation: Ready for Payment? (Yes / No)
              </p>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                If customer is ready, clicking <strong>"Yes"</strong> will fill ₹{billForPaymentConfirm.grandTotalINR.toLocaleString('en-IN')} into <strong>Merchant Sales Collected (INR)</strong> and open the bill.
                If customer is not ready, clicking <strong>"No"</strong> ensures Merchant Sales remains at <strong>₹0</strong>.
              </p>
            </div>

            {/* Yes / No Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleConfirmCustomerPaymentNo}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-rose-600" />
                <span>No, Customer Not Ready (Set Sales to ₹0)</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmCustomerPaymentYes}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Yes, Customer is Ready (Fill ₹{billForPaymentConfirm.grandTotalINR.toLocaleString('en-IN')} to Sales &amp; Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE PRODUCT FROM GODOWN CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 space-y-4 animate-in zoom-in-95 text-stone-900">
            <div className="flex items-center gap-2.5 border-b border-stone-200 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 block">
                  Direct Godown Entry
                </span>
                <h3 className="font-extrabold text-stone-900 text-lg">
                  Delete Product from Godown?
                </h3>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={productToDelete.image}
                  alt={productToDelete.name}
                  className="w-12 h-12 rounded-xl object-cover border border-rose-200 shadow-sm"
                />
                <div>
                  <strong className="text-stone-900 font-bold block text-sm">{productToDelete.name}</strong>
                  <span className="text-stone-500 font-mono text-[11px]">
                    Current Stock: {productToDelete.currentStock} {productToDelete.packagingUnit}
                  </span>
                </div>
              </div>
              <p className="text-rose-900 font-medium pt-2 border-t border-rose-200 text-[11px]">
                Are you sure you want to delete this commodity? It will be removed from godown stock totals and product listings.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs border border-stone-300 transition-colors cursor-pointer"
              >
                No, Keep Product
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  if (editingDirectProduct?.id === productToDelete.id) {
                    handleCancelDirectEdit();
                  }
                  setProductToDelete(null);
                }}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs shadow-md shadow-rose-950/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete from Godown</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
