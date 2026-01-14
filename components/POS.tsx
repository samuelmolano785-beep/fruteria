import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem, StoreConfig, Sale } from '../types';
import { StorageService } from '../services/storageService';
import { Plus, Minus, Trash2, Printer, Mail, Search } from 'lucide-react';

interface POSProps {
  config: StoreConfig;
}

const POS: React.FC<POSProps> = ({ config }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReceipt, setShowReceipt] = useState<Sale | null>(null);
  const [clientEmail, setClientEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProducts(StorageService.getProducts());
    // Auto-focus search for barcode scanning
    barcodeInputRef.current?.focus();
  }, [showReceipt]); // Refresh products when a sale is completed (stock update)

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Producto agotado');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('No hay suficiente stock');
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setSearchTerm(''); // Clear search after adding (simulate barcode scan complete)
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= item.stock) return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  // Handle "Enter" key on search input to simulate barcode scan
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredProducts.length === 1) {
      addToCart(filteredProducts[0]);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * config.taxRate;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (clientEmail && !privacyAccepted) {
        alert("El cliente debe aceptar la política de tratamiento de datos para enviar el correo.");
        return;
    }

    const { subtotal, tax, total } = calculateTotals();
    const newSale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      clientEmail: clientEmail || undefined
    };

    StorageService.saveSale(newSale);
    setShowReceipt(newSale);
    setCart([]);
    setClientEmail('');
    setPrivacyAccepted(false);
  };

  const { subtotal, tax, total } = calculateTotals();

  if (showReceipt) {
    return (
      <ReceiptView 
        sale={showReceipt} 
        config={config} 
        onClose={() => setShowReceipt(null)} 
      />
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Product List */}
      <div className="w-2/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Escanear código de barras o buscar nombre..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-green-500 transition-all ${product.stock === 0 ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
                {product.category === 'Frutas' ? '🍎' : '📦'}
              </div>
              <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <p className="text-lg font-bold text-green-600">${product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart / Checkout */}
      <div className="w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b bg-green-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-green-900">Orden Actual</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-xs text-gray-500">${item.price} c/u</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm"><Minus size={14} /></button>
                  <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm"><Plus size={14} /></button>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-2 mb-4">
             <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IVA ({config.taxRate * 100}%)</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600">Email del Cliente (Opcional)</label>
            <input 
              type="email" 
              placeholder="cliente@email.com" 
              className="w-full mt-1 p-2 border rounded text-sm"
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
            />
            {clientEmail && (
              <div className="flex items-start gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="privacy" 
                  className="mt-1"
                  checked={privacyAccepted}
                  onChange={e => setPrivacyAccepted(e.target.checked)}
                />
                <label htmlFor="privacy" className="text-xs text-gray-500 leading-tight">
                  Autorizo el tratamiento de datos para el envío de la factura (Ley 1581).
                </label>
              </div>
            )}
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            Pagar e Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

const ReceiptView: React.FC<{ sale: Sale, config: StoreConfig, onClose: () => void }> = ({ sale, config, onClose }) => {
  const printReceipt = () => {
    window.print();
  };

  const sendEmail = () => {
    if (!sale.clientEmail) {
      alert("No se registró email para esta venta.");
      return;
    }
    const subject = encodeURIComponent(`Factura de compra - ${config.name}`);
    const body = encodeURIComponent(`
      Hola, gracias por tu compra en ${config.name}.
      
      Total pagado: $${sale.total.toLocaleString()}
      Fecha: ${new Date(sale.date).toLocaleDateString()}
      
      Atentamente,
      El equipo de ${config.name}
    `);
    window.location.href = `mailto:${sale.clientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div id="printable-receipt" className="bg-white p-8 w-96 shadow-2xl rounded-sm text-sm border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="font-bold text-xl uppercase">{config.name}</h1>
          <p>{config.address}</p>
          <p>Tel: {config.phone}</p>
          <p>NIT: {config.nit}</p>
        </div>

        <div className="mb-4 border-b pb-2">
          <p><strong>Fecha:</strong> {new Date(sale.date).toLocaleString()}</p>
          <p><strong>Factura:</strong> #{sale.id.slice(-6)}</p>
        </div>

        <table className="w-full mb-4">
          <thead>
            <tr className="border-b text-left">
              <th className="py-1">Cant.</th>
              <th className="py-1">Prod.</th>
              <th className="py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i}>
                <td className="py-1">{item.quantity}</td>
                <td className="py-1">{item.name}</td>
                <td className="py-1 text-right">${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${sale.subtotal.toLocaleString()}</span>
          </div>
          {sale.tax > 0 && (
            <div className="flex justify-between">
              <span>IVA:</span>
              <span>${sale.tax.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>TOTAL:</span>
            <span>${sale.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center mt-8 text-xs text-gray-500">
          <p>¡Gracias por su compra!</p>
          <p>Régimen Simplificado</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4 print:hidden">
        <button onClick={printReceipt} className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
          <Printer size={18} /> Imprimir
        </button>
        {sale.clientEmail && (
          <button onClick={sendEmail} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <Mail size={18} /> Enviar Email
          </button>
        )}
        <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
          Nueva Venta
        </button>
      </div>
    </div>
  );
};

// Lucide icon helper
const ShoppingCart = ({ size, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

export default POS;