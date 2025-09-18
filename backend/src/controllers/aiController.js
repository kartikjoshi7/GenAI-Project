// src/controllers/aiController.js
const OllamaService = require('../services/ollamaService');
const PdfService = require('../services/pdfService');
const TranslationService = require('../services/translationService');

class AIController {
  constructor() {
    this.ollamaService = new OllamaService();
    this.pdfService = new PdfService();
    this.translationService = new TranslationService();
  }

  // Simplify text using Ollama
  async simplifyText(req, res) {
    try {
      const { text, level = 'standard' } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, error: 'Text content is required' });
      }

      const simplified = await this.ollamaService.simplifyText(text, level);

      res.json({
        success: true,
        simplified,
        originalLength: text.length,
        simplifiedLength: simplified.length,
        reduction: Math.round((1 - simplified.length / text.length) * 100),
      });
    } catch (error) {
      console.error('[Simplify Error]', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to simplify text' });
    }
  }

  // Analyze document for risks
  async analyzeRisks(req, res) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required for risk analysis' });
      }

      // Use the improved risk analysis from OllamaService
      const risks = await this.ollamaService.analyzeRisks(text);
      
      res.json({ risks });
    } catch (error) {
      console.error('Risk analysis error:', error);
      res.status(500).json({ 
        error: 'Failed to analyze risks', 
        details: error.message,
        risks: [{
          title: 'Analysis Failed',
          description: 'The risk analysis could not be completed due to an error.',
          severity: 'high'
        }]
      });
    }
  }

  // Answer questions about the document
  async askQuestion(req, res) {
    try {
      const { question, context } = req.body;

      if (!question || !context) {
        return res.status(400).json({ success: false, error: 'Question and context are required' });
      }

      const answer = await this.ollamaService.answerQuestion(question, context);

      res.json({ success: true, answer });
    } catch (error) {
      console.error('[Ask Error]', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to answer question' });
    }
  }

  // Translate text
  async translateText(req, res) {
    try {
      const { text, targetLang } = req.body;

      if (!text || !targetLang) {
        return res.status(400).json({ success: false, error: 'Text and target language are required' });
      }

      const translatedText = await this.translationService.translate(text, targetLang);

      res.json({ success: true, translatedText });
    } catch (error) {
      console.error('[Translate Error]', error);
      
      // Provide a fallback response if translation fails
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Translation failed',
        translatedText: text // Return original text as fallback
      });
    }
  }
}

module.exports = AIController;