const pdf = require('pdf-parse');
const fs = require('fs').promises;

class PDFService {
  constructor() {
    // You can add any initialization code here
  }

  /**
   * Extract text from a PDF buffer
   * @param {Buffer} buffer - PDF file buffer
   * @returns {Promise<string>} Extracted text
   */
  async extractTextFromPDF(buffer) {
    try {
      // Validate that we have a buffer
      if (!buffer || !Buffer.isBuffer(buffer)) {
        throw new Error('Invalid PDF buffer provided');
      }

      // Check if buffer has PDF header
      const header = buffer.slice(0, 5).toString();
      if (!header.startsWith('%PDF-')) {
        throw new Error('Invalid PDF structure: Missing PDF header');
      }

      // Parse the PDF
      const data = await pdf(buffer);
      
      // Check if we got any text
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains no extractable text');
      }
      
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Invalid PDF structure')) {
        throw new Error('The PDF file appears to be corrupted or has an unsupported structure');
      } else if (error.message.includes('No PDF header')) {
        throw new Error('This does not appear to be a valid PDF file');
      } else if (error.message.includes('empty')) {
        throw new Error('The PDF file appears to be empty or contains no text');
      } else {
        throw new Error('Failed to process PDF: ' + error.message);
      }
    }
  }

  /**
   * Extract text from a PDF file
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<string>} Extracted text
   */
  async extractTextFromFile(filePath) {
    try {
      // Read the file
      const buffer = await fs.readFile(filePath);
      return await this.extractTextFromPDF(buffer);
    } catch (error) {
      console.error('Error reading PDF file:', error);
      throw new Error('Failed to read PDF file: ' + error.message);
    }
  }

  /**
   * Validate if a buffer is a valid PDF
   * @param {Buffer} buffer - Buffer to validate
   * @returns {boolean} True if valid PDF
   */
  isValidPDF(buffer) {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 5) {
      return false;
    }
    
    // Check for PDF header
    const header = buffer.slice(0, 5).toString();
    return header.startsWith('%PDF-');
  }
}

module.exports = PDFService;