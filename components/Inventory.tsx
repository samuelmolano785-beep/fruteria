import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { StorageService } from '../services/storageService';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(StorageService.getProducts());
  };

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.barcode) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    const newProduct = {
      ...currentProduct,
      id: currentProduct.id || Date.now().toString(),
      stock: Number(currentProduct.stock) || 0,
      cost: Number(currentProduct.cost) || 0,
      price: Number(currentProduct.price) || 0,
    } as Product;

    let updatedProducts;
    if (currentProduct.id) {
      updatedProducts = products.map(p => p.id === newProduct.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    StorageService.saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setIsEditing(false);
    setCurrentProduct({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      const updated = products.filter(p => p.id !== id);
      StorageService.saveProducts(updated);
      setProducts(updated);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Inventario de Productos</h2>
        <button 
          onClick={() => { setCurrentProduct({}); setIsEditing(true); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{currentProduct.id ? 'Editar' : 'Nuevo'} Producto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2 mt-1"
                  value={currentProduct.name || ''}
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Código de Barras</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2 mt-1"
                  value={currentProduct.barcode || ''}
                  onChange={e => setCurrentProduct({...currentProduct, barcode: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select 
                  className="w-full border rounded p-2 mt-1"
                  value={currentProduct.category || 'Frutas'}
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                >
                  <option value="Frutas">Frutas</option>
                  <option value="Verduras">Verduras</option>
                  <option value="Lácteos">Lácteos</option>
                  <option value="Abarrotes">Abarrotes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio Venta ($)</label>
                <input 
                  type="number" 
                  className="w-full border rounded p-2 mt-1"
                  value={currentProduct.price || ''}
                  onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Costo ($)</label>
                <input 
                  type="number" 
                  className="w-full border rounded p-2 mt-1"
                  value={currentProduct.cost || ''}
                  onChange={e => setCurrentProduct({...currentProduct, cost: Number(e.target.value)})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Stock Actual</label>
                <input 
                  type="number" 
                  className="w-full border rounded p-2 mt-1"
                  value={currentProduct.stock || ''}
                  onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                <Save size={18} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3 text-right">Precio</th>
              <th className="px-6 py-3 text-right">Costo</th>
              <th className="px-6 py-3 text-center">Stock</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{product.barcode}</td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">${product.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-gray-500">${product.cost.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No hay productos registrados. Agrega uno nuevo para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;