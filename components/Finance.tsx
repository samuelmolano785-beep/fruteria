import React, { useState, useEffect } from 'react';
import { Sale, Expense } from '../types';
import { StorageService } from '../services/storageService';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';

const Finance: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({ type: 'other' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setSales(StorageService.getSales());
    setExpenses(StorageService.getExpenses());
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert("Por favor complete descripción y monto");
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description: newExpense.description,
      amount: Number(newExpense.amount),
      type: newExpense.type as any || 'other'
    };

    StorageService.saveExpense(expense);
    refreshData();
    setNewExpense({ type: 'other' });
    setShowForm(false);
  };

  // Calculations
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  
  // Cost of Goods Sold (COGS)
  const totalCOGS = sales.reduce((sum, s) => {
    const saleCost = s.items.reduce((isum, item) => isum + (item.cost * item.quantity), 0);
    return sum + saleCost;
  }, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalCOGS - totalExpenses;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gestión Financiera</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign size={24} /></div>
            <h3 className="font-semibold text-gray-600">Ingresos Totales</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">Ventas brutas acumuladas</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown size={24} /></div>
            <h3 className="font-semibold text-gray-600">Gastos Operativos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-red-600 mt-1">Servicios, arriendo, etc.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><TrendingDown size={24} /></div>
            <h3 className="font-semibold text-gray-600">Costo Mercancía</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalCOGS.toLocaleString()}</p>
          <p className="text-xs text-orange-600 mt-1">Costo de productos vendidos</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp size={24} /></div>
            <h3 className="font-semibold text-gray-600">Ganancia Neta</h3>
          </div>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ${netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-blue-500 mt-1">Ingresos - (Costos + Gastos)</p>
        </div>
      </div>

      {/* Expense Management */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Registro de Gastos</h3>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            <Plus size={18} /> Registrar Gasto
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-2 border rounded"
                  value={newExpense.description || ''}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Ej. Pago de luz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto ($)</label>
                <input 
                  type="number" 
                  className="w-full mt-1 p-2 border rounded"
                  value={newExpense.amount || ''}
                  onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select 
                  className="w-full mt-1 p-2 border rounded"
                  value={newExpense.type}
                  onChange={e => setNewExpense({...newExpense, type: e.target.value as any})}
                >
                  <option value="purchase">Compra Mercancía</option>
                  <option value="service">Servicios</option>
                  <option value="other">Otros</option>
                </select>
              </div>
              <button 
                onClick={handleAddExpense}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium"
              >
                Guardar Gasto
              </button>
            </div>
          </div>
        )}

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.slice().reverse().map(expense => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{expense.description}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-xs capitalize">{expense.type === 'purchase' ? 'Compra' : expense.type}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-red-600">-${expense.amount.toLocaleString()}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">No hay gastos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;