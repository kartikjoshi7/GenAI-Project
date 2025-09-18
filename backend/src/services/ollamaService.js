// src/services/ollamaService.js
const axios = require('axios');

class OllamaService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.OLLAMA_URL || 'http://127.0.0.1:11434',
      timeout: 1200000, // Fixed timeout value (removed underscore)
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Core query method
  async query(prompt, model = 'mistral:7b') {
    try {
      const payload = {
        model,
        prompt: prompt, // Using 'prompt' instead of 'messages' for completion API
        stream: false,
      };

      const res = await this.client.post('/api/generate', payload); // Using /api/generate instead of /api/chat
      const data = res.data;

      const content = data?.response || data?.output || null;

      return content ? String(content).trim() : JSON.stringify(data);
    } catch (err) {
      console.error(
        'Ollama query error:',
        err?.response
          ? { status: err.response.status, data: err.response.data }
          : err
      );
      throw new Error(
        `Query failed: ${err.response?.status || ''} ${err.message || 'unknown error'}`
      );
    }
  }

  // Alias so documentController works
  async queryOllama(prompt, model = 'mistral:7b') {
    return this.query(prompt, model);
  }

  /* Convenience helpers */

  async simplifyText(text, level = 'standard') {
    const prompt = `Simplify the following text to a ${level} reading level:\n\n${text}`;
    return this.query(prompt);
  }

  async translate(text, targetLanguage) {
    // Use a more specific translation prompt
    const prompt = `
    You are a professional translator. Translate the following text to ${targetLanguage}.
    Maintain the original meaning, tone, and context.
    Provide only the translation, no explanations.
    If you cannot translate certain proper nouns or technical terms, keep them in English.
    
    Text to translate: "${text}"
    
    Translation:
    `;
    
    try {
      const translation = await this.queryOllama(prompt);
      
      // Basic validation to check if translation is reasonable
      if (!translation || translation.length < text.length / 3) {
        throw new Error('Translation too short or empty');
      }
      
      // Check if translation is too similar to original (indicating failure)
      const similarity = this.calculateSimilarity(text, translation);
      if (similarity > 0.8) {
        throw new Error('Translation too similar to original text');
      }
      
      return translation;
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  // Helper method to calculate text similarity
  calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  async analyzeRisks(text) {
    const prompt = `
    Analyze the following text and identify potential risks, compliance issues, and warnings.
    Return your response as a JSON array with each risk having:
    - title: short risk title
    - description: detailed description
    - severity: high/medium/low
    
    Text: ${text.substring(0, 1500)}
    `;
    
    try {
      const output = await this.query(prompt);
      
      // Try to extract JSON from the response
      const jsonMatch = output.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Failed to parse JSON from risk analysis:', e);
        }
      }
      
      // Fallback to simple line-based parsing
      return output
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(line => line.length > 0)
        .map(line => ({
          title: line.substring(0, 50),
          description: line,
          severity: this.determineSeverity(line)
        }));
    } catch (error) {
      console.error('Risk analysis failed:', error);
      return [{
        title: 'Analysis Error',
        description: 'Failed to analyze risks: ' + error.message,
        severity: 'high'
      }];
    }
  }

  determineSeverity(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('high') || lowerText.includes('critical') || lowerText.includes('severe')) {
      return 'high';
    } else if (lowerText.includes('medium') || lowerText.includes('moderate')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  async answerQuestion(question, context) {
    const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nProvide a clear, concise answer.`;
    return this.query(prompt);
  }
}

module.exports = OllamaService;