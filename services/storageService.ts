import { Product, Sale, Expense, StoreConfig } from '../types';

const KEYS = {
  PRODUCTS: 'frutipos_products',
  SALES: 'frutipos_sales',
  EXPENSES: 'frutipos_expenses',
  CONFIG: 'frutipos_config',
};

// Datos iniciales de ejemplo
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', barcode: '1001', name: 'Manzana Roja', price: 1500, cost: 800, stock: 50, category: 'Frutas' },
  { id: '2', barcode: '1002', name: 'Banano Criollo', price: 500, cost: 200, stock: 120, category: 'Frutas' },
  { id: '3', barcode: '1003', name: 'Papaya', price: 4500, cost: 2500, stock: 15, category: 'Frutas' },
  { id: '4', barcode: '1004', name: 'Leche 1L', price: 3800, cost: 3100, stock: 20, category: 'Lácteos' },
];

const INITIAL_CONFIG: StoreConfig = {
  name: 'La Frutería del Barrio',
  address: 'Calle 123 # 45-67, Bogotá, Colombia',
  phone: '300 123 4567',
  taxRate: 0, // Frutas suelen ser exentas, pero configurable
  nit: '900.123.456-7'
};

export const StorageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getSales: (): Sale[] => {
    const data = localStorage.getItem(KEYS.SALES);
    return data ? JSON.parse(data) : [];
  },

  saveSale: (sale: Sale) => {
    const sales = StorageService.getSales();
    sales.push(sale);
    localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
    
    // Actualizar inventario
    const products = StorageService.getProducts();
    sale.items.forEach(item => {
      const productIndex = products.findIndex(p => p.id === item.id);
      if (productIndex !== -1) {
        products[productIndex].stock -= item.quantity;
      }
    });
    StorageService.saveProducts(products);
  },

  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },

  saveExpense: (expense: Expense) => {
    const expenses = StorageService.getExpenses();
    expenses.push(expense);
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getConfig: (): StoreConfig => {
    const data = localStorage.getItem(KEYS.CONFIG);
    return data ? JSON.parse(data) : INITIAL_CONFIG;
  },

  saveConfig: (config: StoreConfig) => {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  }
};