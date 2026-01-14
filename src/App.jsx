import React, { useState } from 'react';
import Header from './components/Header';
import FormPanel from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';
import FloatingToggle from './components/FloatingToggle';

function App() {
  const [viewMode, setViewMode] = useState('form'); // 'form' | 'preview'
  
  const [formData, setFormData] = useState({
    pemberi: {
      nama: '',
      nik: '',
      pekerjaan: '',
      alamat: '',
    },
    penerimaList: [
      {
        id: Date.now(),
        nama: '',
        nik: '',
        pekerjaan: '',
        alamat: '',
      }
    ],
    info: {
      tujuan: '',
      kota: '',
      tanggal: new Date().toISOString().split('T')[0],
    }
  });

  const [signatures, setSignatures] = useState({
    pemberi: null,
    // Dynamic keys for penerima: 'penerima_ID'
  });

  // LOGIC: Add new recipient
  const addPenerima = () => {
    setFormData(prev => ({
      ...prev,
      penerimaList: [
        ...prev.penerimaList,
        {
          id: Date.now(),
          nama: '',
          nik: '',
          pekerjaan: '',
          alamat: '',
        }
      ]
    }));
  };

  // LOGIC: Remove recipient
  const removePenerima = (id) => {
    if (formData.penerimaList.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      penerimaList: prev.penerimaList.filter(p => p.id !== id)
    }));
    // Clean up signature
    setSignatures(prev => {
      const newSigs = { ...prev };
      delete newSigs[`penerima_${id}`];
      return newSigs;
    });
  };

  // LOGIC: Update specific recipient
  const updatePenerima = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      penerimaList: prev.penerimaList.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const toggleView = () => {
    setViewMode(prev => prev === 'form' ? 'preview' : 'form');
  };

  return (
    <div className="h-dvh flex flex-col bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Header />

      {/* Main Container - Flex grow handles remaining height automatically */}
      <main className="flex-1 w-full max-w-7xl mx-auto md:p-6 lg:p-8 flex flex-col overflow-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6 h-full w-full">
          
          {/* LEFT: FORM PANEL */}
          <div className={`
            md:col-span-5 lg:col-span-4 h-full flex flex-col bg-slate-50 md:bg-transparent overflow-hidden
            ${viewMode === 'form' ? 'block' : 'hidden md:flex'}
          `}>
            <FormPanel 
              data={formData}
              setData={setFormData}
              signatures={signatures}
              setSignatures={setSignatures}
              addPenerima={addPenerima}
              removePenerima={removePenerima}
              updatePenerima={updatePenerima}
            />
          </div>

          {/* RIGHT: PREVIEW PANEL */}
          <div className={`
            md:col-span-7 lg:col-span-8 h-full flex flex-col overflow-hidden
            ${viewMode === 'preview' ? 'block' : 'hidden md:flex'}
          `}>
            <PreviewPanel 
              data={formData}
              signatures={signatures}
            />
          </div>

        </div>
      </main>

      <FloatingToggle viewMode={viewMode} toggleView={toggleView} />
    </div>
  );
}

export default App;