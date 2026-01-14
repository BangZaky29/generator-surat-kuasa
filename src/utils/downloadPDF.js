import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const downloadPDF = async (elementId, fileName = 'document.pdf') => {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Element not found')

  // ===============================
  // FORCE PDF MODE
  // ===============================
  element.classList.add('pdf-export')

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    scrollY: -window.scrollY
  })

  element.classList.remove('pdf-export')

  const pdf = new jsPDF('p', 'mm', 'a4')

  // ===============================
  // A4 & MARGIN
  // ===============================
  const pageWidth = 210
  const pageHeight = 297

  const margin = {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  }

  const contentWidth = pageWidth - margin.left - margin.right
  const contentHeight = pageHeight - margin.top - margin.bottom

  // ===============================
  // PIXEL → MM RATIO
  // ===============================
  const pxPerMm = canvas.width / contentWidth
  const pageHeightPx = contentHeight * pxPerMm

  let renderedHeightPx = 0
  let pageIndex = 0

  // ===============================
  // PAGINATION LOOP (CROP CANVAS)
  // ===============================
  while (renderedHeightPx < canvas.height) {
    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = Math.min(pageHeightPx, canvas.height - renderedHeightPx)

    const ctx = pageCanvas.getContext('2d')

    ctx.drawImage(
      canvas,
      0,
      renderedHeightPx,
      canvas.width,
      pageCanvas.height,
      0,
      0,
      canvas.width,
      pageCanvas.height
    )

    const imgData = pageCanvas.toDataURL('image/png')

    if (pageIndex > 0) pdf.addPage()

    pdf.addImage(
      imgData,
      'PNG',
      margin.left,
      margin.top,
      contentWidth,
      (pageCanvas.height / pxPerMm)
    )

    renderedHeightPx += pageCanvas.height
    pageIndex++
  }

  pdf.save(fileName)
}
