import React from 'react';
import Header from './components/ui/Header.jsx';
import Footer from './components/ui/Footer.jsx';
import CanvasScene from './components/CanvasScene.jsx';
import { useGameStore } from './store/useGameStore.js';

export default function App() {
  const { loading, initialize } = useGameStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex justify-center items-center p-4">
        {loading ? (
          <div className="text-center animate-pulse">
            <p className="text-xl font-medium">Cargando mundo…</p>
          </div>
        ) : (
          <CanvasScene />
        )}
      </main>
      <Footer />
    </div>
  );
}
