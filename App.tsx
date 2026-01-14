import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Finance from './components/Finance';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Legal from './components/Legal';
import { View, StoreConfig } from './types';
import { StorageService } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.POS);
  const [config, setConfig] = useState<StoreConfig>({
    name: 'Cargando...',
    address: '',
    phone: '',
    taxRate: 0,
    nit: ''
  });

  useEffect(() => {
    // Cargar configuración al inicio
    const storedConfig = StorageService.getConfig();
    setConfig(storedConfig);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.POS:
        return <POS config={config} />;
      case View.INVENTORY:
        return <Inventory />;
      case View.FINANCE:
        return <Finance />;
      case View.REPORTS:
        return <Reports />;
      case View.SETTINGS:
        return <Settings onUpdate={setConfig} />;
      case View.LEGAL:
        return <Legal />;
      default:
        return <POS config={config} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;