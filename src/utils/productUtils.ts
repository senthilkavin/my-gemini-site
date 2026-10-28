import { Product, ProductCategory } from '../types';

export type PackagingType = 'bags' | 'litres' | 'bait_units';

/**
 * Determines whether a product is classified as Bags (e.g. UltraTech 53 OPC, Super PPC, cement bags).
 */
export const isBagProduct = (p: { category: ProductCategory; packagingUnit?: string }): boolean => {
  if (p.category === 'cement') return true;
  const pkg = (p.packagingUnit || '').toLowerCase();
  return pkg.includes('bag');
};

/**
 * Determines whether a product is classified as Bait Units (ant/rat poison tubes, cakes, boxes, syringes).
 */
export const isBaitProduct = (p: { category: ProductCategory; packagingUnit?: string }): boolean => {
  if (p.category === 'ant_poison' || p.category === 'rat_poison') return true;
  const pkg = (p.packagingUnit || '').toLowerCase();
  return (
    pkg.includes('bait') ||
    pkg.includes('tube') ||
    pkg.includes('syringe') ||
    pkg.includes('cake') ||
    pkg.includes('box') ||
    pkg.includes('bar')
  );
};

/**
 * Determines whether a product is classified as Liquid Litres (liquid agrochemicals, insecticides, pesticides, weedicides).
 */
export const isLitreProduct = (p: { category: ProductCategory; packagingUnit?: string }): boolean => {
  if (isBagProduct(p) || isBaitProduct(p)) return false;
  return (
    p.category === 'insecticide' ||
    p.category === 'pesticide' ||
    p.category === 'weedicide' ||
    p.category === 'fertilizer'
  );
};

/**
 * Returns the classification key for a product: 'bags' | 'litres' | 'bait_units'.
 */
export const getProductPackagingType = (p: {
  category: ProductCategory;
  packagingUnit?: string;
}): PackagingType => {
  if (isBagProduct(p)) return 'bags';
  if (isBaitProduct(p)) return 'bait_units';
  return 'litres';
};

/**
 * Returns the human-readable unit label (plural): 'Bags', 'Liquid Litres', or 'Bait Units'.
 */
export const getPackagingUnitName = (p: {
  category: ProductCategory;
  packagingUnit?: string;
}): string => {
  const type = getProductPackagingType(p);
  switch (type) {
    case 'bags':
      return 'Bags';
    case 'litres':
      return 'Liquid Litres';
    case 'bait_units':
      return 'Bait Units';
  }
};

/**
 * Returns the singular unit label: 'Bag', 'Litre', or 'Bait Unit'.
 */
export const getPackagingUnitSingular = (p: {
  category: ProductCategory;
  packagingUnit?: string;
}): string => {
  const type = getProductPackagingType(p);
  switch (type) {
    case 'bags':
      return 'Bag';
    case 'litres':
      return 'Litre';
    case 'bait_units':
      return 'Bait Unit';
  }
};
