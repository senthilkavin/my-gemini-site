export type ProductCategory =
  | 'insecticide'
  | 'pesticide'
  | 'weedicide'
  | 'cement'
  | 'fertilizer'
  | 'ant_poison'
  | 'rat_poison';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  packagingUnit: string;
  currentStock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  priceEstimated?: string; // formatted e.g. "₹395 / Bag"
  unitPriceINR: number;    // numeric trade price for bill calculation
  description: string;
  activeIngredient: string;
  targetPestOrUsage: string;
  safetyHazard: string;
  image: string;
  isPopular?: boolean;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  quantityAdded: number;
  newStock: number;
  date: string;
  note: string;
  updatedBy: string;
}

export type PaymentMode = 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'credit';

export type PaymentStatus = 'paid' | 'partial' | 'due';

export interface BillItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  packagingUnit: string;
  quantity: number;
  unitPriceINR: number;
  totalINR: number;
}

export interface SalesBill {
  id: string;
  billNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: BillItem[];
  subtotalINR: number;
  discountINR: number;
  taxGSTPercent: number;
  taxINR: number;
  grandTotalINR: number;
  amountPaidINR: number;
  balanceDueINR: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  paymentReference?: string; // UPI Ref / Cheque No / Bank Trans ID
  billedBy: string;          // "Sahadevan" or "Arun Kavinaya"
  notes?: string;
}

export interface AdminUser {
  username: string;
  name: string;
  phone: string;
  role: 'owner' | 'partner';
}
