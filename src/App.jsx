
import React, { useState } from 'react';
import Header from './components/Header';
import FormPanel from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';
import FloatingToggle from './components/FloatingToggle';
import { getHistory, saveHistory, deleteHistory } from './utils/localStorage';
import Notification from './components/Notification';
import Modal from './components/Modal';

function App() {
  const [viewMode, setViewMode] = useState('form'); // 'form' | 'preview'
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState(getHistory());

  // Modal States
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    showInput: false,
    onConfirm: () => { },
  });

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
    },
    kopSurat: {
      enabled: false,
      namaPerusahaan: '',
      alamat: '',
      telepon: '',
      email: '',
      website: '',
      logo: null,
    }
  });

  const [signatures, setSignatures] = useState({
    pemberi: null,
  });

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const closeModals = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const openSaveModal = () => {
    setModalConfig({
      isOpen: true,
      type: 'info',
      title: 'Simpan Riwayat',
      message: 'Masukkan nama label untuk data ini agar mudah ditemukan nanti.',
      showInput: true,
      onConfirm: (label) => {
        const success = saveHistory(formData, label);
        if (success) {
          setHistory(getHistory());
          addNotification('Data berhasil disimpan ke riwayat', 'success');
        } else {
          addNotification('Gagal menyimpan data', 'error');
        }
        closeModals();
      }
    });
  };

  const openImportModal = (data) => {
    setModalConfig({
      isOpen: true,
      type: 'import',
      title: 'Import Data',
      message: 'Apakah Anda yakin ingin mengimport data ini? Data yang sedang diisi saat ini akan tertimpa.',
      showInput: false,
      onConfirm: () => {
        setFormData(data);
        addNotification('Data berhasil diimport', 'import');
        closeModals();
      }
    });
  };

  const openDeleteModal = (id) => {
    setModalConfig({
      isOpen: true,
      type: 'danger',
      title: 'Hapus Riwayat',
      message: 'Data ini akan dihapus secara permanen dari browser Anda. Tindakan ini tidak dapat dibatalkan.',
      showInput: false,
      onConfirm: () => {
        const success = deleteHistory(id);
        if (success) {
          setHistory(getHistory());
          addNotification('Data riwayat berhasil dihapus', 'delete');
        } else {
          addNotification('Gagal menghapus data riwayat', 'error');
        }
        closeModals();
      }
    });
  };

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
              history={history}
              onImport={openImportModal}
              onDeleteHistory={openDeleteModal}
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
              onSave={openSaveModal}
            />
          </div>

        </div>
      </main>

      <FloatingToggle viewMode={viewMode} toggleView={toggleView} />

      {/* Notifications */}
      {notifications.map(n => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      {/* Global Modals */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModals}
        onConfirm={modalConfig.onConfirm}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        showInput={modalConfig.showInput}
      />
    </div>
  );
}

export default App;