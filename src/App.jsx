import { useState } from 'react';
import { ChevronDown, ChevronUp, Printer, User, Users, FileText, Info, Plus, Trash2 } from 'lucide-react';
import logo from './assets/NS_white_01.png';
import './App.css';

function App() {
  // State untuk form data
  const [pemberiKuasa, setPemberiKuasa] = useState({
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    nik: '',
    jenisKelamin: 'Laki-Laki',
    alamat: ''
  });

  const [penerimaKuasaList, setPenerimaKuasaList] = useState([{
    id: 1,
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    nik: '',
    jenisKelamin: 'Laki-Laki',
    alamat: ''
  }]);

  const [maksudKuasaList, setMaksudKuasaList] = useState(['']);

  const [infoSurat, setInfoSurat] = useState({
    tempat: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  // State untuk expand/collapse sections
  const [expandedSections, setExpandedSections] = useState({
    pemberi: false,
    penerima: false,
    perihal: false,
    info: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const next = {
        pemberi: false,
        penerima: false,
        perihal: false,
        info: false
      };
      next[section] = !prev[section];
      return next;
    });
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '';
    const date = new Date(tanggal);
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTTL = (tempat, tanggal) => {
    if (!tempat && !tanggal) return '';
    if (!tanggal) return tempat;
    return `${tempat}, ${formatTanggal(tanggal)}`;
  };

  // Penerima Kuasa Functions
  const handleAddPenerima = () => {
    const newId = penerimaKuasaList.length + 1;
    setPenerimaKuasaList([...penerimaKuasaList, {
      id: newId,
      nama: '',
      tempatLahir: '',
      tanggalLahir: '',
      nik: '',
      jenisKelamin: 'Laki-Laki',
      alamat: ''
    }]);
  };

  const handleRemovePenerima = (id) => {
    if (penerimaKuasaList.length > 1) {
      setPenerimaKuasaList(penerimaKuasaList.filter(p => p.id !== id));
    }
  };

  const handlePenerimaChange = (id, field, value) => {
    setPenerimaKuasaList(penerimaKuasaList.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Maksud Kuasa Functions
  const handleAddMaksud = () => {
    setMaksudKuasaList([...maksudKuasaList, '']);
  };

  const handleRemoveMaksud = (index) => {
    if (maksudKuasaList.length > 1) {
      setMaksudKuasaList(maksudKuasaList.filter((_, i) => i !== index));
    }
  };

  const handleMaksudChange = (index, value) => {
    setMaksudKuasaList(maksudKuasaList.map((m, i) => i === index ? value : m));
  };

  // Print Function
  const handlePrint = () => {
    window.print();
  };

  // Render TTD Grid - Mobile Responsive
  const renderTTDGrid = () => {
    const isMobile = window.innerWidth <= 640;
    
    if (penerimaKuasaList.length === 1) {
      // Jika hanya 1 penerima
      return (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: '2rem', 
          marginTop: '2rem',
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Penerima Kuasa */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ marginBottom: '4rem' }}>Penerima Kuasa</p>
            <div style={{ 
              borderTop: '1.5px solid black', 
              paddingTop: '0.5rem', 
              marginTop: '7.1rem',
              width: '100%'
            }}>
              <p style={{ fontWeight: '700', wordWrap: 'break-word' }}>
                {penerimaKuasaList[0].nama || '[Penerima Kuasa]'}
              </p>
            </div>
          </div>

          {/* Pemberi Kuasa */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ marginBottom: '0.5rem', wordWrap: 'break-word' }}>
              {infoSurat.tempat || '[Tempat]'}, {formatTanggal(infoSurat.tanggal)}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>Pemberi Kuasa</p>
            <div style={{ 
              display: 'inline-block', 
              border: '1px solid #000', 
              padding: '0.5rem 0.75rem', 
              margin: '0.5rem 0',
              maxWidth: '100%'
            }}>
              Materai 10.000
            </div>
            <div style={{ 
              borderTop: '1.5px solid black', 
              paddingTop: '0.5rem', 
              marginTop: '1.5rem',
              width: '100%'
            }}>
              <p style={{ fontWeight: '700', wordWrap: 'break-word' }}>
                {pemberiKuasa.nama || '[Pemberi Kuasa]'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Jika lebih dari 1 penerima
    return (
      <div style={{ width: '100%', maxWidth: '100%' }}>
        {/* Tanggal di atas kanan (mobile: center) */}
        <div style={{ 
          marginLeft: isMobile ? '0' : '335px', 
          marginBottom: '1rem',
          textAlign: isMobile ? 'center' : 'left',
          wordWrap: 'break-word'
        }}>
          <p>{infoSurat.tempat || '[Tempat]'}, {formatTanggal(infoSurat.tanggal)}</p>
        </div>

        {/* Baris Pertama: Penerima 1 & Pemberi Kuasa */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '1.5rem' : '3rem', 
          marginBottom: '2rem',
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Penerima Kuasa 1 */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ marginBottom: '4rem' }}>Penerima Kuasa 1</p>
            <div style={{ 
              borderTop: '1.5px solid black', 
              paddingTop: '0.5rem', 
              marginTop: '6.0rem',
              width: '100%'
            }}>
              <p style={{ fontWeight: '700', wordWrap: 'break-word' }}>
                {penerimaKuasaList[0].nama || '[Penerima 1]'}
              </p>
            </div>
          </div>

          {/* Pemberi Kuasa */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ marginBottom: '0.5rem' }}>Pemberi Kuasa</p>
            <div style={{ 
              display: 'inline-block', 
              border: '1px solid #000000ff', 
              padding: '0.5rem 0.75rem', 
              margin: '0.5rem 0',
              maxWidth: '100%'
            }}>
              Materai 10.000
            </div>
            <div style={{ 
              borderTop: '1.5px solid black', 
              paddingTop: '0.5rem', 
              marginTop: '2rem',
              width: '100%'
            }}>
              <p style={{ fontWeight: '700', wordWrap: 'break-word' }}>
                {pemberiKuasa.nama || '[Pemberi Kuasa]'}
              </p>
            </div>
          </div>
        </div>

        {/* Penerima Kuasa 2+ dalam grid */}
        {penerimaKuasaList.length > 1 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: isMobile ? '1.5rem' : '2rem 3rem',
            width: '100%',
            maxWidth: '100%'
          }}>
            {penerimaKuasaList.slice(1).map((penerima, index) => (
              <div key={penerima.id} style={{ 
                textAlign: 'center', 
                marginBottom: '1rem',
                width: '100%'
              }}>
                <p style={{ marginBottom: '4rem' }}>Penerima Kuasa {index + 2}</p>
                <div style={{ 
                  borderTop: '1.5px solid black', 
                  paddingTop: '0.5rem', 
                  marginTop: '6.0rem',
                  width: '100%'
                }}>
                  <p style={{ fontWeight: '700', wordWrap: 'break-word' }}>
                    {penerima.nama || `[Penerima ${index + 2}]`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header no-print">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="header-logo">
                <img 
                  src={logo} 
                  alt="Nuansa Legal Logo" 
                />
              </div>
              <div className="header-text">
                <h1>Generator Surat Kuasa</h1>
                <p>Buat surat kuasa profesional dengan mudah</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column - Form */}
            <div className="form-column no-print">
              {/* Biodata Pemberi Kuasa */}
              <div className="form-section">
                <button
                  onClick={() => toggleSection('pemberi')}
                  className="section-header"
                >
                  <div className="section-header-left">
                    <User size={20} />
                    <h2>Biodata Pemberi Kuasa</h2>
                  </div>
                  {expandedSections.pemberi ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {expandedSections.pemberi && (
                  <div className="section-body">
                    <div className="form-group">
                      <label className="form-label">Nama Lengkap *</label>
                      <input
                        type="text"
                        value={pemberiKuasa.nama}
                        onChange={(e) => setPemberiKuasa({...pemberiKuasa, nama: e.target.value})}
                        className="form-input"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Tempat Lahir *</label>
                        <input
                          type="text"
                          value={pemberiKuasa.tempatLahir}
                          onChange={(e) => setPemberiKuasa({...pemberiKuasa, tempatLahir: e.target.value})}
                          className="form-input"
                          placeholder="Kota"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tanggal Lahir *</label>
                        <input
                          type="date"
                          value={pemberiKuasa.tanggalLahir}
                          onChange={(e) => setPemberiKuasa({...pemberiKuasa, tanggalLahir: e.target.value})}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Nomor KTP/NIK *</label>
                        <input
                          type="text"
                          value={pemberiKuasa.nik}
                          onChange={(e) => setPemberiKuasa({...pemberiKuasa, nik: e.target.value})}
                          className="form-input"
                          placeholder="16 digit"
                          maxLength="16"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Jenis Kelamin *</label>
                        <select
                          value={pemberiKuasa.jenisKelamin}
                          onChange={(e) => setPemberiKuasa({...pemberiKuasa, jenisKelamin: e.target.value})}
                          className="form-select"
                        >
                          <option value="Laki-Laki">Laki-Laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alamat Lengkap *</label>
                      <textarea
                        value={pemberiKuasa.alamat}
                        onChange={(e) => setPemberiKuasa({...pemberiKuasa, alamat: e.target.value})}
                        className="form-textarea"
                        rows="3"
                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Biodata Penerima Kuasa */}
              <div className="form-section">
                <button
                  onClick={() => toggleSection('penerima')}
                  className="section-header"
                >
                  <div className="section-header-left">
                    <Users size={20} />
                    <h2>Biodata Penerima Kuasa</h2>
                  </div>
                  {expandedSections.penerima ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {expandedSections.penerima && (
                  <div className="section-body">
                    {penerimaKuasaList.map((penerima, index) => (
                      <div key={penerima.id} className="penerima-card">
                        <div className="penerima-card-header">
                          <strong>Penerima #{index + 1}</strong>
                          {penerimaKuasaList.length > 1 && (
                            <button
                              onClick={() => handleRemovePenerima(penerima.id)}
                              className="btn-remove"
                            >
                              <Trash2 size={16} />
                              Hapus
                            </button>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Nama Lengkap *</label>
                          <input
                            type="text"
                            value={penerima.nama}
                            onChange={(e) => handlePenerimaChange(penerima.id, 'nama', e.target.value)}
                            className="form-input"
                            placeholder="Masukkan nama lengkap"
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Tempat Lahir *</label>
                            <input
                              type="text"
                              value={penerima.tempatLahir}
                              onChange={(e) => handlePenerimaChange(penerima.id, 'tempatLahir', e.target.value)}
                              className="form-input"
                              placeholder="Kota"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Tanggal Lahir *</label>
                            <input
                              type="date"
                              value={penerima.tanggalLahir}
                              onChange={(e) => handlePenerimaChange(penerima.id, 'tanggalLahir', e.target.value)}
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Nomor KTP/NIK *</label>
                            <input
                              type="text"
                              value={penerima.nik}
                              onChange={(e) => handlePenerimaChange(penerima.id, 'nik', e.target.value)}
                              className="form-input"
                              placeholder="16 digit"
                              maxLength="16"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Jenis Kelamin *</label>
                            <select
                              value={penerima.jenisKelamin}
                              onChange={(e) => handlePenerimaChange(penerima.id, 'jenisKelamin', e.target.value)}
                              className="form-select"
                            >
                              <option value="Laki-Laki">Laki-Laki</option>
                              <option value="Perempuan">Perempuan</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Alamat Lengkap *</label>
                          <textarea
                            value={penerima.alamat}
                            onChange={(e) => handlePenerimaChange(penerima.id, 'alamat', e.target.value)}
                            className="form-textarea"
                            rows="3"
                            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                          />
                        </div>
                      </div>
                    ))}

                    <button onClick={handleAddPenerima} className="btn-add">
                      <Plus size={18} />
                      <span>Tambah Penerima Kuasa</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Maksud/Tujuan Kuasa */}
              <div className="form-section">
                <button
                  onClick={() => toggleSection('perihal')}
                  className="section-header"
                >
                  <div className="section-header-left">
                    <FileText size={20} />
                    <h2>Maksud/Tujuan Kuasa</h2>
                  </div>
                  {expandedSections.perihal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {expandedSections.perihal && (
                  <div className="section-body">
                    {maksudKuasaList.map((maksud, index) => (
                      <div key={index} className="maksud-item">
                        <div className="maksud-item-header">
                          <span className="maksud-number">{index + 1}.</span>
                          <input
                            type="text"
                            value={maksud}
                            onChange={(e) => handleMaksudChange(index, e.target.value)}
                            className="form-input"
                            placeholder="Masukkan maksud/tujuan kuasa"
                            style={{ flex: 1 }}
                          />
                          {maksudKuasaList.length > 1 && (
                            <button
                              onClick={() => handleRemoveMaksud(index)}
                              className="btn-remove-small"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button onClick={handleAddMaksud} className="btn-add">
                      <Plus size={18} />
                      <span>Tambah Maksud/Tujuan</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Informasi Surat */}
              <div className="form-section">
                <button
                  onClick={() => toggleSection('info')}
                  className="section-header"
                >
                  <div className="section-header-left">
                    <Info size={20} />
                    <h2>Informasi Surat</h2>
                  </div>
                  {expandedSections.info ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {expandedSections.info && (
                  <div className="section-body">
                    <div className="form-group">
                      <label className="form-label">Tempat Pembuatan Surat *</label>
                      <input
                        type="text"
                        value={infoSurat.tempat}
                        onChange={(e) => setInfoSurat({...infoSurat, tempat: e.target.value})}
                        className="form-input"
                        placeholder="Contoh: Bogor"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tanggal Surat *</label>
                      <input
                        type="date"
                        value={infoSurat.tanggal}
                        onChange={(e) => setInfoSurat({...infoSurat, tanggal: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Print Button */}
              <button onClick={handlePrint} className="btn-download">
                <Printer size={20} />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>

            {/* Right Column - Preview */}
            <div className="preview-column">
              <div className="preview-container no-print">
                <div className="preview-header">
                  <h2>Preview Surat</h2>
                  <div className="preview-badge">
                    <span>Live Preview</span>
                  </div>
                </div>

                {/* Preview Content (A4 size) */}
                <div className="preview-content">
                  {/* Header Surat */}
                  <div className="surat-header">
                    <h1>SURAT KUASA</h1>
                  </div>

                  {/* Pemberi Kuasa */}
                  <div className="surat-section">
                    <p>Yang bertanda tangan di bawah ini:</p>
                    <table className="surat-table">
                      <tbody>
                        <tr>
                          <td>Nama</td>
                          <td>:</td>
                          <td className="font-bold">{pemberiKuasa.nama || '[Nama Pemberi Kuasa]'}</td>
                        </tr>
                        <tr>
                          <td>Tempat/Tgl. Lahir</td>
                          <td>:</td>
                          <td>{formatTTL(pemberiKuasa.tempatLahir, pemberiKuasa.tanggalLahir) || '[Tempat, Tanggal Lahir]'}</td>
                        </tr>
                        <tr>
                          <td>Nomor KTP</td>
                          <td>:</td>
                          <td>{pemberiKuasa.nik || '[Nomor KTP]'}</td>
                        </tr>
                        <tr>
                          <td>Jenis Kelamin</td>
                          <td>:</td>
                          <td>{pemberiKuasa.jenisKelamin}</td>
                        </tr>
                        <tr>
                          <td>Alamat</td>
                          <td>:</td>
                          <td>{pemberiKuasa.alamat || '[Alamat Lengkap]'}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-3">Selanjutnya dalam surat kuasa ini disebut sebagai <strong>PEMBERI KUASA</strong>.</p>
                  </div>

                  {/* Penerima Kuasa */}
                  <div className="surat-section">
                    <p>Dengan ini memberikan kuasa kepada:</p>
                    <p className="mt-3">Selanjutnya dalam surat kuasa ini disebut sebagai <strong>PENERIMA KUASA</strong>.</p>
                  </div>

                  {penerimaKuasaList.map((penerima, index) => (
                    <div key={penerima.id} className="surat-section">
                      {penerimaKuasaList.length > 1 && <p className="font-bold">Penerima {index + 1}:</p>}
                      <table className="surat-table">
                        <tbody> 
                          <tr>
                            <td>Nama</td>
                            <td>:</td>
                            <td className="font-bold">{penerima.nama || '[Nama Penerima Kuasa]'}</td>
                          </tr>
                          <tr>
                            <td>Tempat/Tgl. Lahir</td>
                            <td>:</td>
                            <td>{formatTTL(penerima.tempatLahir, penerima.tanggalLahir) || '[Tempat, Tanggal Lahir]'}</td>
                          </tr>
                          <tr>
                            <td>Nomor KTP</td>
                            <td>:</td>
                            <td>{penerima.nik || '[Nomor KTP]'}</td>
                          </tr>
                          <tr>
                            <td>Jenis Kelamin</td>
                            <td>:</td>
                            <td>{penerima.jenisKelamin}</td>
                          </tr>
                          <tr>
                            <td>Alamat</td>
                            <td>:</td>
                            <td>{penerima.alamat || '[Alamat Lengkap]'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}

                  {/* Keperluan */}
                  <div className="surat-section">
                    <div className="surat-khusus">
                      <p>======================== KHUSUS ========================</p>
                    </div>
                    <p className="text-justify mb-3">
                      Untuk keperluan:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                      {maksudKuasaList.filter(m => m.trim()).map((maksud, index) => (
                        <li key={index} style={{ marginBottom: '0.3rem' }}>{maksud || '[Maksud/tujuan kuasa]'}</li>
                      ))}
                    </ol>
                    <p className="text-justify">
                      Demikian surat kuasa ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya. 
                      Dan apabila di kemudian hari terdapat kesalahan dan/atau sejenis perselisihan maka segala akibat penyalahgunaan dari timbulnya surat kuasa ini akan sepenuhnya menjadi tanggung jawab pemberi kuasa.
                    </p>
                  </div>

                  {/* Tanda Tangan */}
                  <div className="surat-signature">
                    {renderTTDGrid()}
                  </div>
                </div>
              </div>

              {/* Print Preview (hidden, only for print) */}
              <div className="print-only">
                <div className="preview-content">
                  <div className="surat-header">
                    <h1>SURAT KUASA</h1>
                  </div>

                  <div className="surat-section">
                    <p>Yang bertanda tangan di bawah ini:</p>
                    <table className="surat-table">
                      <tbody>
                        <tr>
                          <td>Nama</td>
                          <td>:</td>
                          <td className="font-bold">{pemberiKuasa.nama || '[Nama Pemberi Kuasa]'}</td>
                        </tr>
                        <tr>
                          <td>Tempat/Tgl. Lahir</td>
                          <td>:</td>
                          <td>{formatTTL(pemberiKuasa.tempatLahir, pemberiKuasa.tanggalLahir) || '[Tempat, Tanggal Lahir]'}</td>
                        </tr>
                        <tr>
                          <td>Nomor KTP</td>
                          <td>:</td>
                          <td>{pemberiKuasa.nik || '[Nomor KTP]'}</td>
                        </tr>
                        <tr>
                          <td>Jenis Kelamin</td>
                          <td>:</td>
                          <td>{pemberiKuasa.jenisKelamin}</td>
                        </tr>
                        <tr>
                          <td>Alamat</td>
                          <td>:</td>
                          <td>{pemberiKuasa.alamat || '[Alamat Lengkap]'}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-3">Selanjutnya dalam surat kuasa ini disebut sebagai <strong>PEMBERI KUASA</strong>.</p>
                  </div>

                  <div className="surat-section">
                    <p>Dengan ini memberikan kuasa kepada:</p>
                    <p className="mt-3">Selanjutnya dalam surat kuasa ini disebut sebagai <strong>PENERIMA KUASA</strong>.</p>
                  </div>

                  {penerimaKuasaList.map((penerima, index) => (
                    <div key={penerima.id} className="surat-section">
                      {penerimaKuasaList.length > 1 && <p className="font-bold">Penerima {index + 1}:</p>}
                      <table className="surat-table">
                        <tbody> 
                          <tr>
                            <td>Nama</td>
                            <td>:</td>
                            <td className="font-bold">{penerima.nama || '[Nama Penerima Kuasa]'}</td>
                          </tr>
                          <tr>
                            <td>Tempat/Tgl. Lahir</td>
                            <td>:</td>
                            <td>{formatTTL(penerima.tempatLahir, penerima.tanggalLahir) || '[Tempat, Tanggal Lahir]'}</td>
                          </tr>
                          <tr>
                            <td>Nomor KTP</td>
                            <td>:</td>
                            <td>{penerima.nik || '[Nomor KTP]'}</td>
                          </tr>
                          <tr>
                            <td>Jenis Kelamin</td>
                            <td>:</td>
                            <td>{penerima.jenisKelamin}</td>
                          </tr>
                          <tr>
                            <td>Alamat</td>
                            <td>:</td>
                            <td>{penerima.alamat || '[Alamat Lengkap]'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}

                  <div className="surat-section">
                    <div className="surat-khusus">
                      <p>======================== KHUSUS ========================</p>
                    </div>
                    <p className="text-justify mb-3">
                      Untuk keperluan:
                    </p>
                    <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                      {maksudKuasaList.filter(m => m.trim()).map((maksud, index) => (
                        <li key={index} style={{ marginBottom: '0.3rem' }}>{maksud || '[Maksud/tujuan kuasa]'}</li>
                      ))}
                    </ol>
                    <p className="text-justify">
                      Demikian surat kuasa ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya. 
                      Dan apabila di kemudian hari terdapat kesalahan dan/atau sejenis perselisihan maka segala akibat penyalahgunaan dari timbulnya surat kuasa ini akan sepenuhnya menjadi tanggung jawab pemberi kuasa.
                    </p>
                  </div>

                  <div className="surat-signature">
                    {renderTTDGrid()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer no-print">
        <div className="container">
          <div className="footer-content">
            <p>Generator Surat Kuasa - Generated Automatically</p>
            <p className="footer-note">© 2022 Nuansa Solution | All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;