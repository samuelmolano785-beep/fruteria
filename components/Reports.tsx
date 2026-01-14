import React, { useState, useEffect } from 'react';
import { Sale, Expense, Product } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { BarChart2, BrainCircuit, Download } from 'lucide-react';

const Reports: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setSales(StorageService.getSales());
    setExpenses(StorageService.getExpenses());
    setProducts(StorageService.getProducts());
  }, []);

  // 1. Top Products Calculation
  const productSalesMap = new Map<string, number>();
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const current = productSalesMap.get(item.name) || 0;
      productSalesMap.set(item.name, current + item.quantity);
    });
  });

  const topProducts = Array.from(productSalesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxQty = topProducts.length > 0 ? topProducts[0][1] : 1;

  // 2. Monthly Sales
  const monthlySales = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('es-CO', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const maxMonthly = Math.max(...(Object.values(monthlySales) as number[]), 1);

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const result = await GeminiService.analyzeBusiness(sales, expenses, products);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const exportCSV = () => {
    const headers = "ID Venta,Fecha,Total\n";
    const rows = sales.map(s => `${s.id},${s.date},${s.total}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventas_frutipos.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h2>
        <button onClick={exportCSV} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="text-green-600" /> Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-gray-400">Sin datos suficientes</p>
            ) : (
              topProducts.map(([name, qty]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{name}</span>
                    <span className="text-gray-500">{qty} und</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${(qty / maxQty) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Ventas Mensuales
          </h3>
          <div className="flex items-end justify-around h-48 gap-2 pt-4 border-b border-gray-100">
            {Object.keys(monthlySales).length === 0 ? (
              <p className="text-gray-400 self-center">Sin datos suficientes</p>
            ) : (
              (Object.entries(monthlySales) as [string, number][]).map(([month, total]) => (
                <div key={month} className="flex flex-col items-center w-full">
                  <div className="relative group w-full flex justify-center">
                    <div 
                      className="w-2/3 bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all duration-300"
                      style={{ height: `${(total / maxMonthly) * 150}px` }}
                    ></div>
                    <div className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${total.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 uppercase">{month}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-indigo-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> Asesoría Inteligente (IA)
            </h3>
            <p className="text-sm text-indigo-700">Obtén recomendaciones personalizadas para tu negocio usando Gemini.</p>
          </div>
          <button 
            onClick={handleAiAnalysis}
            disabled={loadingAi}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loadingAi ? 'Analizando...' : 'Generar Reporte'}
          </button>
        </div>

        {aiAnalysis && (
          <div className="bg-white p-6 rounded-lg shadow-inner text-gray-800 leading-relaxed border border-indigo-100">
            <div dangerouslySetInnerHTML={{ __html: aiAnalysis }} />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper icon
const TrendingUp = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default Reports;