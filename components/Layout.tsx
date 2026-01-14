import React from 'react';
import { View } from '../types';
import { ShoppingCart, Package, DollarSign, BarChart2, Settings, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const navItems = [
    { id: View.POS, label: 'Punto de Venta', icon: ShoppingCart },
    { id: View.INVENTORY, label: 'Inventario', icon: Package },
    { id: View.FINANCE, label: 'Finanzas', icon: DollarSign },
    { id: View.REPORTS, label: 'Reportes', icon: BarChart2 },
    { id: View.SETTINGS, label: 'Configuración', icon: Settings },
    { id: View.LEGAL, label: 'Privacidad', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col shadow-lg print:hidden">
        <div className="p-6 border-b border-green-700">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🍎 FrutiPOS
          </h1>
          <p className="text-green-200 text-xs mt-1">Gestión Inteligente</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-green-100 hover:bg-green-700'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 bg-green-900 text-xs text-center text-green-300">
          v1.0.0 - Colombia
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;