// src/services/apiService.js
const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Process uploaded document
  processDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await fetch(`${API_BASE_URL}/process-document`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },
  
  // Process text input
  processText: async (text) => {
    const response = await fetch(`${API_BASE_URL}/process-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },
  
  // Simplify text
  simplifyText: async (text) => {
    const response = await fetch(`${API_BASE_URL}/simplify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },
  
  // Analyze risks
  analyzeRisks: async (text) => {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  },
  
  // Translate text
  translateText: async (text, targetLang) => {
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLang }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Translation failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.translatedText || result.translated || result.text || result.data || text;
    } catch (error) {
      throw error;
    }
  },
};

// Helper function to get language name
export const getLanguageName = (code) => {
  const languages = {
    en: 'English',
    hi: 'Hindi',
    gu: 'Gujarati',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese'
  };
  return languages[code] || code.toUpperCase();
};