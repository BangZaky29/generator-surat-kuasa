import React from 'react';
import AccordionSection from './AccordionSection';
import SignaturePad from './SignaturePad';
import { User, Users, FileText, Info, Plus, Trash2 } from 'lucide-react';

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

const FormPanel = ({ 
  data, 
  setData, 
  signatures, 
  setSignatures, 
  addPenerima, 
  removePenerima, 
  updatePenerima 
}) => {
  
  const handlePemberiChange = (field, value) => {
    setData(prev => ({ ...prev, pemberi: { ...prev.pemberi, [field]: value } }));
  };

  const handleInfoChange = (field, value) => {
    setData(prev => ({ ...prev, info: { ...prev.info, [field]: value } }));
  };

  return (
    <div className="form-panel h-full overflow-y-auto p-4 md:pr-1 md:pl-0 pb-24 md:pb-0 scroll-smooth custom-scrollbar">
      
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