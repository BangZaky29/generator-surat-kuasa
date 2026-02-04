
import React, { useState } from 'react';
import { Download, Printer, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadPDF } from "../utils/downloadPDF";

const PreviewPanel = ({ data, signatures, onSave }) => {
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const formatDate = (dateString) => {
    if (!dateString) return "....................";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleDownload = async () => {
    if (downloadStatus === 'loading') return;

    try {
      setDownloadStatus('loading');

      // Add a small delay to allow UI to render 'loading' state before heavy canvas operation
      await new Promise(resolve => setTimeout(resolve, 100));

      await downloadPDF("surat-preview", `Surat-Kuasa-${data.pemberi.nama || 'Draft'}.pdf`);

      setDownloadStatus('success');
      // Reset status after 3 seconds
      setTimeout(() => setDownloadStatus('idle'), 3000);

    } catch (error) {
      console.error("PDF Download Error:", error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="preview-container h-full flex flex-col bg-slate-100 md:rounded-2xl rounded-none overflow-hidden shadow-none md:shadow-inner border-y border-slate-200 md:border-x relative">

      {/* Toast Notification */}
      {downloadStatus !== 'idle' && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-xl border backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-300 ${downloadStatus === 'loading' ? 'bg-indigo-900/90 text-white border-indigo-700' :
            downloadStatus === 'success' ? 'bg-emerald-600/90 text-white border-emerald-500' :
              'bg-red-600/90 text-white border-red-500'
            }`}>
            {downloadStatus === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {downloadStatus === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {downloadStatus === 'error' && <AlertCircle className="w-5 h-5" />}

            <span className="font-medium text-sm">
              {downloadStatus === 'loading' && 'Sedang memproses PDF...'}
              {downloadStatus === 'success' && 'Berhasil didownload!'}
              {downloadStatus === 'error' && 'Gagal membuat PDF'}
            </span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="px-4 md:px-6 py-3 md:py-4 bg-white border-b border-slate-200 flex justify-between items-center print-hidden z-10 shadow-sm sticky top-0">
        <h3 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${downloadStatus === 'loading' ? 'bg-yellow-400' : 'bg-green-500'} animate-pulse`}></span>
          Preview
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs md:text-sm font-bold rounded-xl transition-all active:scale-95"
            title="Simpan Data"
          >
            <Download size={16} className="rotate-180" />
            <span className="hidden sm:inline">Simpan</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={downloadStatus === 'loading'}
            className="btn-secondary px-3 py-1.5 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cetak Dokumen"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={downloadStatus === 'loading'}
            className={`btn-primary px-3 py-1.5 text-xs md:text-sm disabled:opacity-70 disabled:cursor-not-allowed ${downloadStatus === 'success' ? '!bg-emerald-600' : ''
              }`}
            title="Download PDF"
          >
            {downloadStatus === 'loading' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : downloadStatus === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <Download size={16} />
            )}
            <span className="hidden sm:inline">
              {downloadStatus === 'loading' ? 'Memproses...' : 'PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Area - Updated for better mobile centering */}
      <div className="preview-wrapper flex-1 relative flex flex-col items-center p-0 md:p-8 bg-slate-100/50 overflow-x-hidden border-box">

        {/* A4 PAPER - Scaled on Mobile via CSS */}
        <div
          id="surat-preview"
          className="bg-white w-[210mm] min-h-[297mm] paper-shadow p-[2.5cm] text-black box-border relative shrink-0 transition-transform origin-top"
        >
          {/* KOP SURAT */}
          {data.kopSurat?.enabled && (
            <div className="border-b-[3px] border-double border-black pb-4 mb-8 flex items-center min-h-[110px]">
              {/* Left Column (Logo) */}
              <div className="w-[120px] shrink-0 flex items-center justify-start">
                {data.kopSurat.logo && (
                  <img src={data.kopSurat.logo} alt="Logo" className="max-w-[100px] max-h-[100px] object-contain" />
                )}
              </div>

              {/* Center Column (Text Content) */}
              <div className="flex-1 text-center px-4">
                <h2 className="text-xl font-bold uppercase tracking-wide mb-1 leading-tight">{data.kopSurat.namaPerusahaan || "NAMA PERUSAHAAN"}</h2>
                <p className="text-[10pt] leading-snug mb-0.5 max-w-[500px] mx-auto">{data.kopSurat.alamat || "Alamat lengkap perusahaan belum diisi..."}</p>
                <div className="text-[9pt] flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-slate-700 font-sans">
                  {data.kopSurat.telepon && <span>Telp: {data.kopSurat.telepon}</span>}
                  {data.kopSurat.email && <span>Email: {data.kopSurat.email}</span>}
                  {data.kopSurat.website && <span>Web: {data.kopSurat.website}</span>}
                </div>
              </div>

              {/* Right Column (Spacer for Balancing) */}
              <div className="w-[120px] shrink-0" aria-hidden="true"></div>
            </div>
          )}

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold border-b-2 border-black inline-block pb-1 mb-1 font-serif uppercase tracking-widest">
              SURAT KUASA
            </h1>
          </div>

          {/* CONTENT */}
          <div className="text-[11pt] font-serif leading-relaxed text-justify">
            <p className="mb-4">Yang bertanda tangan di bawah ini:</p>

            {/* PEMBERI DATA */}
            <table className="w-full mb-6">
              <tbody>
                <tr>
                  <td className="w-32 align-top pb-1">Nama</td>
                  <td className="w-4 align-top pb-1">:</td>
                  <td className="font-bold uppercase align-top pb-1">{data.pemberi.nama || "......................................."}</td>
                </tr>
                <tr>
                  <td className="align-top pb-1">NIK</td>
                  <td className="align-top pb-1">:</td>
                  <td className="align-top pb-1">{data.pemberi.nik || "......................................."}</td>
                </tr>
                <tr>
                  <td className="align-top pb-1">Pekerjaan</td>
                  <td className="align-top pb-1">:</td>
                  <td className="align-top pb-1">{data.pemberi.pekerjaan || "......................................."}</td>
                </tr>
                <tr>
                  <td className="align-top pb-1">Alamat</td>
                  <td className="align-top pb-1">:</td>
                  <td className="align-top pb-1">{data.pemberi.alamat || "......................................."}</td>
                </tr>
              </tbody>
            </table>

            <p className="mb-4">Selanjutnya disebut sebagai <strong>PEMBERI KUASA</strong>.</p>
            <p className="mb-4">Dengan ini memberikan kuasa kepada:</p>

            {/* PENERIMA LIST */}
            {data.penerimaList.map((penerima, idx) => (
              <div key={penerima.id} className="mb-4">
                {data.penerimaList.length > 1 && <p className="mb-1 italic font-bold">Penerima Kuasa {idx + 1}:</p>}
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-32 align-top pb-1">Nama</td>
                      <td className="w-4 align-top pb-1">:</td>
                      <td className="font-bold uppercase align-top pb-1">{penerima.nama || "......................................."}</td>
                    </tr>
                    <tr>
                      <td className="align-top pb-1">NIK</td>
                      <td className="align-top pb-1">:</td>
                      <td className="align-top pb-1">{penerima.nik || "......................................."}</td>
                    </tr>
                    <tr>
                      <td className="align-top pb-1">Pekerjaan</td>
                      <td className="align-top pb-1">:</td>
                      <td className="align-top pb-1">{penerima.pekerjaan || "......................................."}</td>
                    </tr>
                    <tr>
                      <td className="align-top pb-1">Alamat</td>
                      <td className="align-top pb-1">:</td>
                      <td className="align-top pb-1">{penerima.alamat || "......................................."}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

            <p className="mb-4">Selanjutnya disebut sebagai <strong>PENERIMA KUASA</strong>.</p>

            {/* TUJUAN KHUSUS */}
            <div className="mb-6">
              <p className="font-bold text-center italic mb-2">-------------------- KHUSUS --------------------</p>
              <p className="indent-8 min-h-[3rem]">
                {data.info.tujuan || "Untuk melakukan tindakan berupa................................................................................"}
              </p>
            </div>

            <p className="mb-8">
              Demikian Surat Kuasa ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
            </p>

            {/* ================= SIGNATURE SECTION ================= */}
            <div className="mt-12 break-inside-avoid">

              {/* TANGGAL & KOTA */}
              <div className="text-end mb-1 mr-10">
                <p>
                  {data.info.kota || "Jakarta"}, {formatDate(data.info.tanggal)}
                </p>
              </div>

              {/* GRID SIGNATURE */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-14">

                {/* ===== ROW 1 : PENERIMA 1 | PEMBERI ===== */}
                <div className="text-center break-inside-avoid">
                  <p className="mb-2">
                    Penerima Kuasa {data.penerimaList.length > 1 ? "1" : ""}
                  </p>

                  <div className="h-24 flex items-center justify-center">
                    {data.penerimaList[0] &&
                      signatures[`penerima_${data.penerimaList[0].id}`] ? (
                      <img
                        src={signatures[`penerima_${data.penerimaList[0].id}`]}
                        alt="TTD Penerima"
                        className="max-h-24 mix-blend-multiply"
                      />
                    ) : (
                      <div className="h-24 w-full" />
                    )}
                  </div>

                  <p className="font-bold underline mt-2 uppercase">
                    {data.penerimaList[0]?.nama || "( Nama Lengkap )"}
                  </p>
                </div>

                {/* PEMBERI */}
                <div className="text-center break-inside-avoid">
                  <p className="mb-2">Pemberi Kuasa</p>

                  <div className="relative h-24 flex items-center justify-center">
                    {/* MATERAI */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                      <div className="border border-black w-16 h-8 text-[8px] flex items-center justify-center">
                        MATERAI
                      </div>
                    </div>

                    {signatures.pemberi ? (
                      <img
                        src={signatures.pemberi}
                        alt="TTD Pemberi"
                        className="max-h-24 mix-blend-multiply relative z-10"
                      />
                    ) : (
                      <div className="h-24 w-full" />
                    )}
                  </div>

                  <p className="font-bold underline mt-2 uppercase">
                    {data.pemberi.nama || "( Nama Lengkap )"}
                  </p>
                </div>

                {/* ===== ROW BERIKUTNYA : PENERIMA BERPASANGAN ===== */}
                {data.penerimaList.slice(1).reduce((rows, penerima, index, arr) => {
                  if (index % 2 === 0) {
                    rows.push(arr.slice(index, index + 2))
                  }
                  return rows
                }, []).map((pair, rowIdx) => (
                  <React.Fragment key={rowIdx}>

                    {/* KIRI */}
                    <div className="text-center break-inside-avoid">
                      <p className="mb-2">Penerima Kuasa {rowIdx * 2 + 2}</p>

                      <div className="h-24 flex items-center justify-center">
                        {pair[0] && signatures[`penerima_${pair[0].id}`] ? (
                          <img
                            src={signatures[`penerima_${pair[0].id}`]}
                            alt="TTD Penerima"
                            className="max-h-24 mix-blend-multiply"
                          />
                        ) : (
                          <div className="h-24 w-full" />
                        )}
                      </div>

                      <p className="font-bold underline mt-2 uppercase">
                        {pair[0]?.nama || "( Nama Lengkap )"}
                      </p>
                    </div>

                    {/* KANAN */}
                    <div className="text-center break-inside-avoid">
                      {pair[1] ? (
                        <>
                          <p className="mb-2">Penerima Kuasa {rowIdx * 2 + 3}</p>

                          <div className="h-24 flex items-center justify-center">
                            {signatures[`penerima_${pair[1].id}`] ? (
                              <img
                                src={signatures[`penerima_${pair[1].id}`]}
                                alt="TTD Penerima"
                                className="max-h-24 mix-blend-multiply"
                              />
                            ) : (
                              <div className="h-24 w-full" />
                            )}
                          </div>

                          <p className="font-bold underline mt-2 uppercase">
                            {pair[1]?.nama || "( Nama Lengkap )"}
                          </p>
                        </>
                      ) : (
                        <div />
                      )}
                    </div>

                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;