export const SUPPORTED_FILE_TYPES = [
  '.pdf', '.docx', '.txt', '.xlsx', '.xls', '.csv',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv'
];

/**
 * High-performance on-demand document parser.
 * Heavy parser engines (pdfjs-dist, mammoth, xlsx) are dynamically imported
 * ONLY when the user actually uploads that file type, keeping the initial bundle super light.
 */
export const parseDocument = async (file) => {
  if (!file) return { success: false, error: 'No file provided' };

  try {
    const fileName = file.name;
    const fileType = file.type || fileName.split('.').pop().toLowerCase();
    let text = '';
    let pageCount = 0;

    const arrayBuffer = await file.arrayBuffer();

    if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
      const pdfjsLib = await import('pdfjs-dist');
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      }
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
      const pdf = await loadingTask.promise;
      pageCount = pdf.numPages;
      let fullText = '';
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      text = fullText;
    } else if (fileName.endsWith('.docx') || fileType.includes('wordprocessingml')) {
      const mammothModule = await import('mammoth');
      const mammoth = mammothModule.default || mammothModule;
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else if (fileName.match(/\.(xlsx|xls|csv)$/) || fileType.includes('spreadsheet') || fileType === 'text/csv') {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheets = workbook.SheetNames;
      let allCsv = '';
      sheets.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        allCsv += `--- Sheet: ${sheetName} ---\n`;
        allCsv += XLSX.utils.sheet_to_csv(sheet) + '\n\n';
      });
      text = allCsv;
    } else {
      // Plain text fallback
      text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read text file'));
        reader.readAsText(file);
      });
    }

    return {
      success: true,
      text: text.trim(),
      fileName,
      fileType,
      pageCount: pageCount || 1,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to parse document',
    };
  }
};
