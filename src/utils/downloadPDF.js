import html2pdf from 'html2pdf.js';

/**
 * Generate PDF Surat Kuasa (A4 rapi & konsisten di semua device)
 * @param {Object} pemberiKuasa
 * @param {Array} penerimaKuasaList
 * @param {Array} maksudKuasaList
 * @param {Object} infoSurat
 */
export const generatePDF = async (pemberiKuasa, penerimaKuasaList, maksudKuasaList, infoSurat) => {
  // Buat container dengan ukuran A4 yang tepat
  const element = document.createElement('div');
  
  // Styling untuk memastikan konsistensi A4 (210mm x 297mm)
  element.style.width = '210mm';
  element.style.minHeight = '297mm';
  element.style.padding = '15mm 20mm'; // top-bottom: 15mm, left-right: 20mm
  element.style.margin = '0';
  element.style.boxSizing = 'border-box';
  element.style.fontFamily = 'Times New Roman, serif'; // Font formal untuk surat resmi
  element.style.fontSize = '12pt';
  element.style.lineHeight = '1.6';
  element.style.color = '#000000';
  element.style.backgroundColor = '#ffffff';
  element.style.position = 'relative';

  // ================== HEADER ==================
  const header = document.createElement('div');
  header.style.textAlign = 'center';
  header.style.marginBottom = '25px';
  header.style.pageBreakInside = 'avoid';
  header.innerHTML = `
    <h1 style="margin: 0 0 8px 0; font-size: 18pt; font-weight: bold; text-decoration: underline;">SURAT KUASA</h1>
  `;
  element.appendChild(header);

  // ================== PEMBERI KUASA ==================
  const pemberiDiv = document.createElement('div');
  pemberiDiv.style.pageBreakInside = 'avoid';
  pemberiDiv.style.marginBottom = '20px';
  pemberiDiv.innerHTML = `
    <p style="margin: 0 0 10px 0; text-align: justify;">Yang bertanda tangan di bawah ini:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 15px 20px; font-size: 12pt;">
      <tbody>
        <tr>
          <td style="width: 35%; padding: 3px 0; vertical-align: top;">Nama</td>
          <td style="width: 3%; padding: 3px 0; vertical-align: top;">:</td>
          <td style="padding: 3px 0; vertical-align: top;"><strong>${pemberiKuasa.nama || '[Nama Pemberi Kuasa]'}</strong></td>
        </tr>
        <tr>
          <td style="padding: 3px 0; vertical-align: top;">Tempat/Tgl. Lahir</td>
          <td style="padding: 3px 0; vertical-align: top;">:</td>
          <td style="padding: 3px 0; vertical-align: top;">${pemberiKuasa.tempatLahir || '[Tempat]'}, ${pemberiKuasa.tanggalLahir || '[Tanggal]'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0; vertical-align: top;">Nomor KTP</td>
          <td style="padding: 3px 0; vertical-align: top;">:</td>
          <td style="padding: 3px 0; vertical-align: top;">${pemberiKuasa.nik || '[Nomor KTP]'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0; vertical-align: top;">Jenis Kelamin</td>
          <td style="padding: 3px 0; vertical-align: top;">:</td>
          <td style="padding: 3px 0; vertical-align: top;">${pemberiKuasa.jenisKelamin || '[Jenis Kelamin]'}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0; vertical-align: top;">Alamat</td>
          <td style="padding: 3px 0; vertical-align: top;">:</td>
          <td style="padding: 3px 0; vertical-align: top;">${pemberiKuasa.alamat || '[Alamat Lengkap]'}</td>
        </tr>
      </tbody>
    </table>
    <p style="margin: 0 0 15px 0; text-align: justify;">Selanjutnya disebut sebagai <strong>PEMBERI KUASA</strong>.</p>
  `;
  element.appendChild(pemberiDiv);

  // ================== PENERIMA KUASA ==================
  const penerimaDiv = document.createElement('div');
  penerimaDiv.style.pageBreakInside = 'avoid';
  penerimaDiv.style.marginBottom = '20px';
  
  let penerimaHTML = `<p style="margin: 0 0 10px 0; text-align: justify;">Dengan ini memberikan kuasa kepada:</p>`;
  
  penerimaKuasaList.forEach((p, i) => {
    if (penerimaKuasaList.length > 1) {
      penerimaHTML += `<p style="margin: 15px 0 10px 0;"><strong>Penerima Kuasa ${i + 1}:</strong></p>`;
    }
    penerimaHTML += `
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 15px 20px; font-size: 12pt;">
        <tbody>
          <tr>
            <td style="width: 35%; padding: 3px 0; vertical-align: top;">Nama</td>
            <td style="width: 3%; padding: 3px 0; vertical-align: top;">:</td>
            <td style="padding: 3px 0; vertical-align: top;"><strong>${p.nama || '[Nama Penerima]'}</strong></td>
          </tr>
          <tr>
            <td style="padding: 3px 0; vertical-align: top;">Tempat/Tgl. Lahir</td>
            <td style="padding: 3px 0; vertical-align: top;">:</td>
            <td style="padding: 3px 0; vertical-align: top;">${p.tempatLahir || '[Tempat]'}, ${p.tanggalLahir || '[Tanggal]'}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; vertical-align: top;">Nomor KTP</td>
            <td style="padding: 3px 0; vertical-align: top;">:</td>
            <td style="padding: 3px 0; vertical-align: top;">${p.nik || '[Nomor KTP]'}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; vertical-align: top;">Jenis Kelamin</td>
            <td style="padding: 3px 0; vertical-align: top;">:</td>
            <td style="padding: 3px 0; vertical-align: top;">${p.jenisKelamin || '[Jenis Kelamin]'}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0; vertical-align: top;">Alamat</td>
            <td style="padding: 3px 0; vertical-align: top;">:</td>
            <td style="padding: 3px 0; vertical-align: top;">${p.alamat || '[Alamat Lengkap]'}</td>
          </tr>
        </tbody>
      </table>
    `;
  });
  
  penerimaHTML += `<p style="margin: 0 0 15px 0; text-align: justify;">Selanjutnya disebut sebagai <strong>PENERIMA KUASA</strong>.</p>`;
  penerimaDiv.innerHTML = penerimaHTML;
  element.appendChild(penerimaDiv);

  // ================== MAKSUD KUASA ==================
  const maksudDiv = document.createElement('div');
  maksudDiv.style.pageBreakInside = 'avoid';
  maksudDiv.style.marginBottom = '20px';
  
  const maksudFiltered = maksudKuasaList.filter(m => m && m.trim());
  const maksudItems = maksudFiltered.length > 0 
    ? maksudFiltered.map(m => `<li style="margin-bottom: 5px; text-align: justify;">${m}</li>`).join('')
    : '<li style="margin-bottom: 5px; text-align: justify;">[Keperluan/Maksud Kuasa]</li>';
  
  maksudDiv.innerHTML = `
    <p style="margin: 0 0 10px 0; text-align: justify;">Untuk keperluan:</p>
    <ol style="padding-left: 40px; margin: 0 0 15px 0; font-size: 12pt;">
      ${maksudItems}
    </ol>
    <p style="margin: 0 0 15px 0; text-align: justify;">Demikian surat kuasa ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
    Dan apabila di kemudian hari terdapat kesalahan dan/atau sejenis perselisihan maka segala akibat penyalahgunaan dari timbulnya surat kuasa ini akan sepenuhnya menjadi tanggung jawab pemberi kuasa.</p>
  `;
  element.appendChild(maksudDiv);

  // ================== TEMPAT & TANGGAL ==================
  const tempatTanggalDiv = document.createElement('div');
  tempatTanggalDiv.style.marginTop = '30px';
  tempatTanggalDiv.style.marginBottom = '15px';
  tempatTanggalDiv.style.textAlign = 'right';
  tempatTanggalDiv.innerHTML = `
    <p style="margin: 0 50px;">${infoSurat.tempat || '[Tempat]'}, ${infoSurat.tanggal || '[Tanggal]'}</p>
  `;
  element.appendChild(tempatTanggalDiv);

  // ================== TANDA TANGAN ==================
  const ttdContainer = document.createElement('div');
  ttdContainer.style.marginTop = '20px';
  ttdContainer.style.display = 'flex';
  ttdContainer.style.justifyContent = 'space-between';
  ttdContainer.style.pageBreakInside = 'avoid';

  // Kolom Pemberi Kuasa
  const pemberiTTD = document.createElement('div');
  pemberiTTD.style.textAlign = 'center';
  pemberiTTD.style.width = '45%';
  pemberiTTD.innerHTML = `
    <p style="margin: 0 0 5px 0;"><strong>Pemberi Kuasa</strong></p>
    <div style="height: 80px;"></div>
    <p style="margin: 0; border-top: 1px solid #000; display: inline-block; padding-top: 5px; min-width: 150px;">
      <strong>${pemberiKuasa.nama || '[Pemberi Kuasa]'}</strong>
    </p>
  `;

  // Kolom Penerima Kuasa
  const penerimaTTD = document.createElement('div');
  penerimaTTD.style.textAlign = 'center';
  penerimaTTD.style.width = '45%';
  const penerimaNama = penerimaKuasaList.length > 0 && penerimaKuasaList[0].nama 
    ? penerimaKuasaList[0].nama 
    : '[Penerima Kuasa]';
  penerimaTTD.innerHTML = `
    <p style="margin: 0 0 5px 0;"><strong>Penerima Kuasa</strong></p>
    <div style="height: 80px;"></div>
    <p style="margin: 0; border-top: 1px solid #000; display: inline-block; padding-top: 5px; min-width: 150px;">
      <strong>${penerimaNama}</strong>
    </p>
  `;

  ttdContainer.appendChild(pemberiTTD);
  ttdContainer.appendChild(penerimaTTD);
  element.appendChild(ttdContainer);

  // ================== KONFIGURASI PDF (OPTIMAL UNTUK SEMUA DEVICE) ==================
  const opt = {
    margin: 0, // Margin sudah diatur di padding element
    filename: `Surat-Kuasa-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2, // Kualitas tinggi
      useCORS: true,
      letterRendering: true,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 794, // 210mm in pixels at 96 DPI
      windowHeight: 1123 // 297mm in pixels at 96 DPI
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: 'table'
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    console.log('PDF berhasil diunduh');
  } catch (error) {
    console.error('Error saat generate PDF:', error);
    alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
  }
};