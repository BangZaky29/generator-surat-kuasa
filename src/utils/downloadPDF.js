import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures a DOM element and downloads it as a PDF.
 * @param {string} elementId - The ID of the DOM element to capture.
 * @param {string} fileName - The desired filename for the download.
 */
export const downloadPDF = async (elementId, fileName = 'document.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  // Increase scale for better quality
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png');
  
  // A4 Dimensions in mm
  const pdfWidth = 210;
  const pdfHeight = 297;
  
  // Create PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Calculate aspect ratio to fit width
  const imgProps = pdf.getImageProperties(imgData);
  const pdfImageHeight = (imgProps.height * pdfWidth) / imgProps.width;

  // Add image to PDF
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImageHeight);
  
  // Download
  pdf.save(fileName);
  return true;
};