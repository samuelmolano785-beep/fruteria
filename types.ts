export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number; // Precio de venta
  cost: number;  // Precio de costo
  stock: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string; // ISO string
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  clientEmail?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'purchase' | 'service' | 'other';
}

export interface StoreConfig {
  name: string;
  address: string;
  phone: string;
  taxRate: number; // Porcentaje (e.g., 0.19 para 19%)
  logoUrl?: string;
  nit: string; // Identificación tributaria
}

export enum View {
  POS = 'POS',
  INVENTORY = 'INVENTORY',
  FINANCE = 'FINANCE',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  LEGAL = 'LEGAL'
}