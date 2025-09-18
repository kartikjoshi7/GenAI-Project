// src/controllers/documentController.js
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
const mammoth = require('mammoth');
const OllamaService = require('../services/ollamaService');

const ollamaService = new OllamaService();

// Configuration
const config = {
  maxRawTextLength: 5000, // Increase from 1500 to 5000 characters
  chunkSize: 2000,
  maxTextLengthForOllama: 5000
};

class DocumentController {
  // 📂 Handle uploaded document (PDF, TXT, DOC, DOCX)
  async processDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No document uploaded' });
      }

      let rawText = '';

      // Process based on file type
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      if (req.file.mimetype === 'application/pdf' || fileExtension === '.pdf') {
        // Read PDF file from disk
        const fileData = fs.readFileSync(req.file.path);
        const data = await pdfParse(fileData);
        rawText = data.text.trim();
      } else if (req.file.mimetype === 'text/plain' || fileExtension === '.txt') {
        // Read TXT file from disk
        rawText = fs.readFileSync(req.file.path, 'utf8').trim();
      } else if (
        req.file.mimetype === 'application/msword' || 
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileExtension === '.doc' || 
        fileExtension === '.docx'
      ) {
        // Process Word documents
        rawText = await this.extractTextFromWord(req.file.path);
      } else {
        return res.status(400).json({ 
          error: 'Unsupported file type', 
          message: 'Only PDF, TXT, DOC, and DOCX files are supported' 
        });
      }

      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.warn('Could not delete uploaded file:', err.message);
      }

      if (!rawText) {
        return res.status(400).json({ error: 'No text extracted from document' });
      }

      // 🔹 Smart chunking
      let chunks = [];

      if (rawText.length > config.chunkSize) {
        for (let i = 0; i < rawText.length; i += config.chunkSize) {
          // Try to split at sentence boundaries
          const chunk = rawText.substring(i, i + config.chunkSize);
          const lastPeriod = chunk.lastIndexOf('.');
          
          if (lastPeriod > config.chunkSize - 500 && lastPeriod < config.chunkSize) {
            chunks.push(chunk.substring(0, lastPeriod + 1));
            i = i - (config.chunkSize - lastPeriod - 1); // Adjust index
          } else {
            chunks.push(chunk);
          }
        }
      } else {
        chunks = [rawText];
      }

      // 🔹 Summarize chunks in parallel
      const summaries = await Promise.all(
        chunks.map(chunk =>
          ollamaService.queryOllama(
            `Give a very short structured summary of this text (max 3 sentences):\n\n${chunk}`
          ).catch(err => {
            console.error('Error summarizing chunk:', err);
            return "Summary unavailable for this section.";
          })
        )
      );

      // 🔹 Final structured merge
      try {
        const finalSummary = await ollamaService.queryOllama(`
          You are an AI assistant. 
          Combine these partial summaries into one final JSON object with the following structure only:

          {
            "summary": "string, max 5 sentences",
            "risks": ["list of strings"],
            "keywords": ["list of important keywords"]
          }

          Strict rules:
          - Output must be ONLY valid JSON
          - Do not include explanations, comments, markdown, or extra text outside the JSON
          - Arrays must use double quotes
          - Do not prefix with "Here is", "Final JSON output", or anything else

          Partial summaries:
          ${summaries.join("\n\n---\n\n")}
        `);

        // Return full text or truncated version based on length
        const returnFullText = req.query.fullText === 'true';
        const displayText = returnFullText ? 
          rawText : 
          rawText.slice(0, config.maxRawTextLength) + 
          (rawText.length > config.maxRawTextLength ? '... [truncated]' : '');

        res.json({
          success: true,
          summary: finalSummary,
          rawText: displayText,
          fullLength: rawText.length,
          truncated: !returnFullText && rawText.length > config.maxRawTextLength
        });
      } catch (err) {
        console.error('Error generating final summary:', err);
        res.status(500).json({
          error: 'Failed to generate summary',
          details: 'The document was processed but summarization failed'
        });
      }
    } catch (err) {
      console.error('Error processing document:', err);
      
      // Clean up uploaded file even on error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkErr) {
          console.warn('Could not delete uploaded file after error:', unlinkErr.message);
        }
      }
      
      res.status(500).json({
        error: 'Failed to process document',
        details: err.message
      });
    }
  }

  // Extract text from Word documents (DOC/DOCX)
  async extractTextFromWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();
    } catch (err) {
      console.error('Error extracting text from Word document:', err);
      throw new Error('Failed to extract text from Word document');
    }
  }

  // 📝 Handle pasted text
  async processText(req, res) {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'No text provided' });
      }

      // Truncate text if it's too long for the AI model
      const processedText = text.length > config.maxTextLengthForOllama ? 
        text.substring(0, config.maxTextLengthForOllama) + '... [truncated for processing]' : 
        text;

      const summary = await ollamaService.queryOllama(`
        Summarize the following text into a structured JSON format with these fields:
        - summary (string, max 5 sentences)
        - risks (array of strings)
        - keywords (array of strings)

        Return ONLY valid JSON, no additional text.

        Text:
        ${processedText}
      `);

      res.json({ 
        success: true, 
        summary,
        originalLength: text.length,
        processedLength: processedText.length,
        truncated: text.length > config.maxTextLengthForOllama
      });
    } catch (err) {
      console.error('Error processing text:', err);
      res.status(500).json({ 
        error: 'Failed to process text', 
        details: err.message 
      });
    }
  }
}

module.exports = new DocumentController();