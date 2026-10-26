import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  ProductCategory,
  StockAdjustment,
  SalesBill,
  BillItem,
  PaymentMode,
  PaymentStatus,
  AdminUser,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_BILLS } from '../data/productsData';

interface StoreContextType {
  products: Product[];
  activeTab: 'home' | 'about' | 'products' | 'contact' | 'admin';
  setActiveTab: (tab: 'home' | 'about' | 'products' | 'contact' | 'admin') => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;

  // Admin Authentication
  isAdminLoggedIn: boolean;
  currentAdmin: AdminUser | null;
  adminLogin: (username: string, pass: string) => boolean;
  adminLogout: () => void;

  // Direct Stock Operations (No Dropdowns!)
  addStock: (productId: string, qtyToAdd: number, note?: string, updatedBy?: string) => void;
  setExactStock: (productId: string, newStock: number) => void;
  addNewProduct: (productData: {
    name: string;
    category: ProductCategory;
    brand?: string;
    packagingUnit?: string;
    currentStock: number;
    unitPriceINR?: number;
    priceEstimated?: string;
    description?: string;
    activeIngredient?: string;
    targetPestOrUsage?: string;
    safetyHazard?: string;
    image?: string;
  }) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  loadQuickSamples: () => void;
  resetStockToDefault: () => void;
  stockAdjustments: StockAdjustment[];

  // Sales Bill & Payment Generator
  salesBills: SalesBill[];
  createSalesBill: (billInput: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    items: BillItem[];
    discountINR?: number;
    taxGSTPercent?: number;
    amountPaidINR: number;
    paymentMode: PaymentMode;
    paymentReference?: string;
    billedBy?: string;
    notes?: string;
  }) => SalesBill;
  updateBillPayment: (
    billId: string,
    additionalPaymentINR: number,
    paymentMode: PaymentMode,
    note?: string
  ) => void;
  deleteSalesBill: (billId: string) => void;
  clearAllSalesBills: () => void;
  loadSampleBills: () => void;
  selectedBillForPrint: SalesBill | null;
  setSelectedBillForPrint: (bill: SalesBill | null) => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'gokulakrishnan_user_custom_stocks_v4',
  ADJUSTMENTS: 'gokulakrishnan_adjustments_v4',
  BILLS: 'gokulakrishnan_sales_bills_v4',
  ADMIN_AUTH: 'gokulakrishnan_admin_auth_v4',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADJUSTMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [salesBills, setSalesBills] = useState<SalesBill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdminLoggedIn = !!currentAdmin;

  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'products' | 'contact' | 'admin'>('products');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<SalesBill | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Could not save products to local storage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADJUSTMENTS, JSON.stringify(stockAdjustments));
    } catch (e) {
      console.warn('Could not save adjustments to local storage', e);
    }
  }, [stockAdjustments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(salesBills));
    } catch (e) {
      console.warn('Could not save sales bills to local storage', e);
    }
  }, [salesBills]);

  useEffect(() => {
    try {
      if (currentAdmin) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(currentAdmin));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      }
    } catch (e) {
      console.warn('Could not save admin session', e);
    }
  }, [currentAdmin]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Admin authentication for Owners (Sahadevan & Arun Kavinaya)
  const adminLogin = (username: string, pass: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Standard owner accounts or general admin
    if (
      (cleanUser === 'admin' && (cleanPass === 'gokul123' || cleanPass === 'admin' || cleanPass === 'password')) ||
      (cleanUser === 'sahadevan' && (cleanPass === 'gokul123' || cleanPass === '9486426294')) ||
      (cleanUser === 'arun' && (cleanPass === 'gokul123' || cleanPass === '9790974822')) ||
      (cleanPass === 'gokul123') // universal owner master key
    ) {
      const userObj: AdminUser =
        cleanUser === 'arun'
          ? {
              username: 'arun',
              name: 'Arun Kavinaya',
              phone: '+91 97909 74822',
              role: 'partner',
            }
          : {
              username: cleanUser === 'sahadevan' ? 'sahadevan' : 'sahadevan',
              name: 'Sahadevan',
              phone: '+91 94864 26294',
              role: 'owner',
            };

      setCurrentAdmin(userObj);
      setIsLoginModalOpen(false);
      setActiveTab('admin');
      showToast(`Welcome back, ${userObj.name}! Logged in as Merchant Owner.`);
      return true;
    }

    showToast('Invalid credentials. Hint: Username "admin" and password "gokul123"');
    return false;
  };

  const adminLogout = () => {
    setCurrentAdmin(null);
    setActiveTab('products');
    showToast('Logged out of Owner Admin Dashboard successfully.');
  };

  // Direct Stock Operations (No Dropdowns!)
  const addStock = (
    productId: string,
    qtyToAdd: number,
    note: string = 'Stock arrival',
    updatedBy: string = currentAdmin?.name || 'Sahadevan'
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newQty = Math.max(0, p.currentStock + qtyToAdd);
          const stockStatus: Product['stockStatus'] =
            newQty <= 0 ? 'out_of_stock' : newQty <= 15 ? 'low_stock' : 'in_stock';

          const newAdj: StockAdjustment = {
            id: `adj-${Date.now()}`,
            productId,
            productName: p.name,
            quantityAdded: qtyToAdd,
            newStock: newQty,
            date: new Date().toISOString(),
            note,
            updatedBy,
          };
          setStockAdjustments((prevAdj) => [newAdj, ...prevAdj]);

          return {
            ...p,
            currentStock: newQty,
            stockStatus,
          };
        }
        return p;
      })
    );

    showToast(`Stock updated! ${qtyToAdd >= 0 ? `+${qtyToAdd}` : qtyToAdd} units.`);
  };

  const setExactStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const stockStatus: Product['stockStatus'] =
            newStock <= 0 ? 'out_of_stock' : newStock <= 15 ? 'low_stock' : 'in_stock';
          return {
            ...p,
            currentStock: Math.max(0, newStock),
            stockStatus,
          };
        }
        return p;
      })
    );
    showToast(`Stock count set to ${newStock} units`);
  };

  const addNewProduct = (productData: {
    name: string;
    category: ProductCategory;
    brand?: string;
    packagingUnit?: string;
    currentStock: number;
    unitPriceINR?: number;
    priceEstimated?: string;
    description?: string;
    activeIngredient?: string;
    targetPestOrUsage?: string;
    safetyHazard?: string;
    image?: string;
  }) => {
    const newId = `item-${productData.category.slice(0, 3)}-${Date.now().toString().slice(-4)}`;
    const stockStatus: Product['stockStatus'] =
      productData.currentStock <= 0
        ? 'out_of_stock'
        : productData.currentStock <= 15
        ? 'low_stock'
        : 'in_stock';

    let defaultImg = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80';
    if (productData.category === 'cement') {
      defaultImg = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80';
    } else if (productData.category === 'insecticide') {
      defaultImg = 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80';
    } else if (productData.category === 'pesticide') {
      defaultImg = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80';
    } else if (productData.category === 'weedicide') {
      defaultImg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
    } else if (productData.category === 'ant_poison') {
      defaultImg = 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80';
    } else if (productData.category === 'rat_poison') {
      defaultImg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
    }

    const calculatedPriceNum =
      productData.unitPriceINR !== undefined && productData.unitPriceINR > 0
        ? productData.unitPriceINR
        : productData.priceEstimated
        ? parseFloat(productData.priceEstimated.replace(/[^0-9.]/g, '')) || 0
        : 0;

    const newProd: Product = {
      id: newId,
      name: productData.name.trim(),
      category: productData.category,
      brand: productData.brand?.trim() || 'GokulaKrishnan Stock',
      packagingUnit: productData.packagingUnit?.trim() || (productData.category === 'cement' ? '50 kg Bag' : 'Unit Pack'),
      currentStock: Number(productData.currentStock) || 0,
      stockStatus,
      unitPriceINR: calculatedPriceNum,
      priceEstimated: productData.priceEstimated?.trim() || (calculatedPriceNum > 0 ? `₹${calculatedPriceNum} (INR)` : 'Rate on Inquiry'),
      description: productData.description?.trim() || `${productData.name} stocked at GokulaKrishnan Agencies godown.`,
      activeIngredient: productData.activeIngredient?.trim() || 'Standard Active Formulation',
      targetPestOrUsage: productData.targetPestOrUsage?.trim() || 'Agricultural / Construction / Pest Eradication',
      safetyHazard: productData.safetyHazard?.trim() || 'Follow manufacturer safety instructions.',
      image: productData.image || defaultImg,
    };

    setProducts((prev) => [newProd, ...prev]);

    const newAdj: StockAdjustment = {
      id: `adj-${Date.now()}`,
      productId: newId,
      productName: newProd.name,
      quantityAdded: newProd.currentStock,
      newStock: newProd.currentStock,
      date: new Date().toISOString(),
      note: 'Product registered to agency stock inventory',
      updatedBy: currentAdmin?.name || 'Sahadevan / Arun Kavinaya',
    };
    setStockAdjustments((prev) => [newAdj, ...prev]);

    showToast(`Added "${newProd.name}" with ${newProd.currentStock} stock units!`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updates };
          const stockStatus: Product['stockStatus'] =
            merged.currentStock <= 0
              ? 'out_of_stock'
              : merged.currentStock <= 15
              ? 'low_stock'
              : 'in_stock';
          return { ...merged, stockStatus };
        }
        return p;
      })
    );
    showToast('Product details & stock updated!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from stock inventory');
  };

  const clearAllProducts = () => {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ADJUSTMENTS);
    setStockAdjustments([]);
    showToast('All product names and stocks cleared. Enter fresh products!');
  };

  const loadQuickSamples = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
    showToast('Loaded demo stock commodities with authentic images in INR!');
  };

  const resetStockToDefault = () => {
    clearAllProducts();
  };

  // Sales Bill & Payment Generator
  const createSalesBill = (billInput: {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    items: BillItem[];
    discountINR?: number;
    taxGSTPercent?: number;
    amountPaidINR: number;
    paymentMode: PaymentMode;
    paymentReference?: string;
    billedBy?: string;
    notes?: string;
  }): SalesBill => {
    const subtotal = billInput.items.reduce((sum, item) => sum + item.totalINR, 0);
    const discount = billInput.discountINR || 0;
    const taxPercent = billInput.taxGSTPercent || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxINR = Math.round((taxableAmount * taxPercent) / 100);
    const grandTotalINR = taxableAmount + taxINR;

    const amountPaidINR = Math.min(grandTotalINR, Math.max(0, billInput.amountPaidINR));
    const balanceDueINR = Math.max(0, grandTotalINR - amountPaidINR);

    const paymentStatus: PaymentStatus =
      balanceDueINR === 0 ? 'paid' : amountPaidINR > 0 ? 'partial' : 'due';

    const billSeq = (salesBills.length + 1).toString().padStart(4, '0');
    const billNumber = `GKA-INV-${new Date().getFullYear()}-${billSeq}`;

    const newBill: SalesBill = {
      id: `bill-${Date.now()}`,
      billNumber,
      date: new Date().toISOString(),
      customerName: billInput.customerName.trim(),
      customerPhone: billInput.customerPhone.trim(),
      customerAddress: billInput.customerAddress?.trim() || '',
      items: billInput.items,
      subtotalINR: subtotal,
      discountINR: discount,
      taxGSTPercent: taxPercent,
      taxINR: taxINR,
      grandTotalINR,
      amountPaidINR,
      balanceDueINR,
      paymentMode: billInput.paymentMode,
      paymentStatus,
      paymentReference: billInput.paymentReference?.trim() || '',
      billedBy: billInput.billedBy || currentAdmin?.name || 'Sahadevan',
      notes: billInput.notes?.trim() || '',
    };

    // Auto-deduct stock from products
    setProducts((prevProds) =>
      prevProds.map((p) => {
        const soldItem = billInput.items.find((item) => item.productId === p.id);
        if (soldItem) {
          const remaining = Math.max(0, p.currentStock - soldItem.quantity);
          const stockStatus: Product['stockStatus'] =
            remaining <= 0 ? 'out_of_stock' : remaining <= 15 ? 'low_stock' : 'in_stock';
          return {
            ...p,
            currentStock: remaining,
            stockStatus,
          };
        }
        return p;
      })
    );

    // Record stock deduction in audit trail
    billInput.items.forEach((item) => {
      const adj: StockAdjustment = {
        id: `adj-bill-${Date.now()}-${item.productId}`,
        productId: item.productId,
        productName: item.productName,
        quantityAdded: -item.quantity,
        newStock: 0, // will reflect next
        date: new Date().toISOString(),
        note: `Sold on Bill #${billNumber} to ${billInput.customerName}`,
        updatedBy: currentAdmin?.name || 'Sahadevan',
      };
      setStockAdjustments((prev) => [adj, ...prev]);
    });

    setSalesBills((prev) => [newBill, ...prev]);

    showToast(`Bill #${billNumber} generated! ₹${amountPaidINR} received.`);
    return newBill;
  };

  const updateBillPayment = (
    billId: string,
    additionalPaymentINR: number,
    paymentMode: PaymentMode,
    note?: string
  ) => {
    setSalesBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const newPaid = Math.min(b.grandTotalINR, b.amountPaidINR + additionalPaymentINR);
          const newBalance = Math.max(0, b.grandTotalINR - newPaid);
          const newStatus: PaymentStatus =
            newBalance === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'due';

          return {
            ...b,
            amountPaidINR: newPaid,
            balanceDueINR: newBalance,
            paymentStatus: newStatus,
            paymentMode,
            notes: note ? `${b.notes ? b.notes + ' | ' : ''}Payment of ₹${additionalPaymentINR} recorded (${paymentMode})` : b.notes,
          };
        }
        return b;
      })
    );

    showToast(`Payment of ₹${additionalPaymentINR} recorded successfully.`);
  };

  const deleteSalesBill = (billId: string) => {
    setSalesBills((prev) => prev.filter((b) => b.id !== billId));
    showToast('Sales bill deleted.');
  };

  const clearAllSalesBills = () => {
    setSalesBills([]);
    localStorage.removeItem(STORAGE_KEYS.BILLS);
    showToast('Sales register cleared. Merchant Sales reset to ₹0.');
  };

  const loadSampleBills = () => {
    setSalesBills(INITIAL_BILLS);
    try {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
    showToast('Sample bills loaded! Official tax invoices ready.');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedProductForDetail,
        setSelectedProductForDetail,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toast,
        showToast,
        isAdminLoggedIn,
        currentAdmin,
        adminLogin,
        adminLogout,
        addStock,
        setExactStock,
        addNewProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        loadQuickSamples,
        resetStockToDefault,
        stockAdjustments,
        salesBills,
        createSalesBill,
        updateBillPayment,
        deleteSalesBill,
        clearAllSalesBills,
        loadSampleBills,
        selectedBillForPrint,
        setSelectedBillForPrint,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
