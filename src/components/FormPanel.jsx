import React from 'react';
import AccordionSection from './AccordionSection';
import SignaturePad from './SignaturePad';
import { User, Users, FileText, Info, Plus, Trash2, Building2, Image as ImageIcon, X } from 'lucide-react';

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input-field"
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="input-field resize-none"
    />
  </div>
);

const ImageUpload = ({ label, value, onChange }) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="relative group/upload">
        {value ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-white flex items-center justify-center p-4">
            <img src={value} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
            <button
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover/upload:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-slate-400 hover:text-indigo-500"
          >
            <div className="p-3 bg-slate-100 rounded-full group-hover/upload:bg-indigo-100 transition-colors">
              <ImageIcon size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Upload Logo</span>
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

const FormPanel = ({
  data,
  setData,
  signatures,
  setSignatures,
  addPenerima,
  removePenerima,
  updatePenerima,
  history,
  onImport,
  onDeleteHistory
}) => {
  const [showHistory, setShowHistory] = React.useState(false);

  const handlePemberiChange = (field, value) => {
    setData(prev => ({ ...prev, pemberi: { ...prev.pemberi, [field]: value } }));
  };

  const handleInfoChange = (field, value) => {
    setData(prev => ({ ...prev, info: { ...prev.info, [field]: value } }));
  };

  const handleKopChange = (field, value) => {
    setData(prev => ({ ...prev, kopSurat: { ...prev.kopSurat, [field]: value } }));
  };

  return (
    <div className="form-panel h-full overflow-y-auto p-4 md:pr-1 md:pl-0 pb-24 md:pb-0 scroll-smooth custom-scrollbar">

      {/* SECTION 0: HISTORY SELECTION */}
      <div className="mb-6 relative">
        <div
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <Info size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Riwayat Data</h3>
              <p className="text-[10px] text-slate-500 font-medium">Gunakan data yang pernah disimpan sebelumnya</p>
            </div>
          </div>
          <Plus className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showHistory ? 'rotate-45 text-slate-600' : ''}`} />
        </div>

        {showHistory && (
          <div className="absolute top-full left-0 right-0 z-[60] mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {history.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-slate-400 font-medium italic">Belum ada riwayat data tersimpan</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 group/item">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">{item.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.timestamp).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            onImport(item.data);
                            setShowHistory(false);
                          }}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Import
                        </button>
                        <button
                          onClick={() => onDeleteHistory(item.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus dari riwayat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION -1: KOP SURAT (OPTIONAL) */}
      <AccordionSection title="Informasi Kop Surat" icon={Building2}>
        <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl mb-6 border border-indigo-100/50">
          <div>
            <h4 className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">Aktifkan Kop Surat</h4>
            <p className="text-[10px] text-indigo-600 mt-0.5">Tampilkan identitas perusahaan di bagian atas surat</p>
          </div>
          <button
            onClick={() => handleKopChange('enabled', !data.kopSurat.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${data.kopSurat.enabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.kopSurat.enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {data.kopSurat.enabled && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <ImageUpload
              label="Logo Perusahaan"
              value={data.kopSurat.logo}
              onChange={(val) => handleKopChange('logo', val)}
            />
            <InputField
              label="Nama Perusahaan"
              value={data.kopSurat.namaPerusahaan}
              onChange={(e) => handleKopChange('namaPerusahaan', e.target.value)}
              placeholder="Contoh: PT. Nuansa Solution"
            />
            <TextArea
              label="Alamat Perusahaan"
              value={data.kopSurat.alamat}
              onChange={(e) => handleKopChange('alamat', e.target.value)}
              placeholder="Jl. Raya Utama No. 123..."
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Telepon"
                value={data.kopSurat.telepon}
                onChange={(e) => handleKopChange('telepon', e.target.value)}
                placeholder="021-1234567"
              />
              <InputField
                label="Email"
                value={data.kopSurat.email}
                onChange={(e) => handleKopChange('email', e.target.value)}
                placeholder="info@perusahaan.com"
              />
            </div>
            <InputField
              label="Website"
              value={data.kopSurat.website}
              onChange={(e) => handleKopChange('website', e.target.value)}
              placeholder="www.perusahaan.com"
            />
          </div>
        )}
      </AccordionSection>

      {/* SECTION 1: PEMBERI KUASA */}
      <AccordionSection title="Biodata Pemberi Kuasa" icon={User} isOpen={true}>
        <InputField
          label="Nama Lengkap"
          value={data.pemberi.nama}
          onChange={(e) => handlePemberiChange('nama', e.target.value)}
          placeholder="Contoh: Budi Santoso"
        />
        <InputField
          label="NIK / No. KTP"
          value={data.pemberi.nik}
          onChange={(e) => handlePemberiChange('nik', e.target.value)}
          placeholder="16 digit NIK"
        />
        <InputField
          label="Pekerjaan"
          value={data.pemberi.pekerjaan}
          onChange={(e) => handlePemberiChange('pekerjaan', e.target.value)}
          placeholder="Wiraswasta"
        />
        <TextArea
          label="Alamat Lengkap"
          value={data.pemberi.alamat}
          onChange={(e) => handlePemberiChange('alamat', e.target.value)}
          placeholder="Jl. Merdeka No. 1, Jakarta"
        />
        <div className="mt-6 pt-4 border-t border-slate-100">
          <SignaturePad
            label="Tanda Tangan Pemberi Kuasa"
            onSave={(sign) => setSignatures(prev => ({ ...prev, pemberi: sign }))}
          />
        </div>
      </AccordionSection>

      {/* SECTION 2: PENERIMA KUASA (DYNAMIC) */}
      <AccordionSection title="Biodata Penerima Kuasa" icon={Users}>
        <div className="space-y-6">
          {data.penerimaList.map((penerima, index) => (
            <div key={penerima.id} className="relative p-5 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:border-indigo-200 hover:shadow-sm">
              {data.penerimaList.length > 1 && (
                <button
                  onClick={() => removePenerima(penerima.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                  title="Hapus Penerima"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                  {index + 1}
                </span>
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Penerima Kuasa
                </h4>
              </div>

              <InputField
                label="Nama Lengkap"
                value={penerima.nama}
                onChange={(e) => updatePenerima(penerima.id, 'nama', e.target.value)}
              />
              <InputField
                label="NIK / No. KTP"
                value={penerima.nik}
                onChange={(e) => updatePenerima(penerima.id, 'nik', e.target.value)}
              />
              <InputField
                label="Pekerjaan"
                value={penerima.pekerjaan}
                onChange={(e) => updatePenerima(penerima.id, 'pekerjaan', e.target.value)}
              />
              <TextArea
                label="Alamat Lengkap"
                value={penerima.alamat}
                onChange={(e) => updatePenerima(penerima.id, 'alamat', e.target.value)}
              />

              <div className="mt-4 pt-4 border-t border-slate-200/60">
                <SignaturePad
                  label={`Tanda Tangan Penerima #${index + 1}`}
                  onSave={(sign) => setSignatures(prev => ({
                    ...prev,
                    [`penerima_${penerima.id}`]: sign
                  }))}
                />
              </div>
            </div>
          ))}

          <button
            onClick={addPenerima}
            className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2 text-sm font-semibold group"
          >
            <div className="p-1 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
              <Plus size={14} />
            </div>
            Tambah Penerima Kuasa
          </button>
        </div>
      </AccordionSection>

      {/* SECTION 3: MAKSUD / TUJUAN */}
      <AccordionSection title="Isi Kuasa (Khusus)" icon={FileText}>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-5 flex gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Tips:</strong> Jelaskan secara rinci dan spesifik tindakan apa saja yang boleh dilakukan oleh Penerima Kuasa untuk menghindari penyalahgunaan wewenang.
          </p>
        </div>
        <TextArea
          label="Untuk / Khusus"
          value={data.info.tujuan}
          onChange={(e) => handleInfoChange('tujuan', e.target.value)}
          placeholder="Contoh: Mengurus pengambilan sertifikat tanah di kantor BPN..."
        />
      </AccordionSection>

      {/* SECTION 4: INFORMASI SURAT */}
      <AccordionSection title="Informasi Surat" icon={Info}>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Kota Pembuatan"
            value={data.info.kota}
            onChange={(e) => handleInfoChange('kota', e.target.value)}
          />
          <InputField
            label="Tanggal Surat"
            type="date"
            value={data.info.tanggal}
            onChange={(e) => handleInfoChange('tanggal', e.target.value)}
          />
        </div>
      </AccordionSection>

    </div>
  );
};

export default FormPanel;