import React, { useState, useEffect } from 'react';
import { StoreConfig } from '../types';
import { StorageService } from '../services/storageService';
import { Save } from 'lucide-react';

interface SettingsProps {
  onUpdate: (config: StoreConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ onUpdate }) => {
  const [config, setConfig] = useState<StoreConfig | null>(null);

  useEffect(() => {
    setConfig(StorageService.getConfig());
  }, []);

  const handleSave = () => {
    if (config) {
      StorageService.saveConfig(config);
      onUpdate(config);
      alert('Configuración guardada exitosamente.');
    }
  };

  if (!config) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración de la Tienda</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={config.name}
            onChange={e => setConfig({...config, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">NIT / Identificación</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={config.nit}
            onChange={e => setConfig({...config, nit: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={config.address}
            onChange={e => setConfig({...config, address: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={config.phone}
            onChange={e => setConfig({...config, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tasa de Impuesto (IVA) - Decimal (e.g., 0.19)</label>
          <input 
            type="number" 
            step="0.01"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            value={config.taxRate}
            onChange={e => setConfig({...config, taxRate: parseFloat(e.target.value)})}
          />
          <p className="text-xs text-gray-500 mt-1">0.19 equivale al 19%.</p>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold w-full justify-center"
          >
            <Save size={20} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;