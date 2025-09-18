// src/services/translationService.js
const OllamaService = require('./ollamaService');

class TranslationService {
  constructor(ollamaInstance = null) {
    this.ollama = ollamaInstance || new OllamaService();
    
    // Greatly expanded fallback dictionary with common words and phrases
    this.dictionary = {
      es: { 
        // Existing phrases
        "slow loading time on mobile": "tiempo de carga lento en móvil",
        "frequent disconnection issues": "problemas de desconexión frecuentes",
        "delayed response from support team": "respuesta tardía del equipo de soporte",
        "payment gateway not working properly": "la pasarela de pago no funciona correctamente",
        "too many ads displayed during use": "demasiados anuncios mostrados durante el uso",
        "poor customer care service": "servicio de atención al cliente deficiente",
        "high-quality products": "productos de alta calidad",
        "timely updates and communication": "actualizaciones y comunicación oportunas",
        "fast and reliable delivery": "entrega rápida y confiable",
        "smooth payment process": "proceso de pago sin problemas",
        
        // Common words
        "customer": "cliente",
        "complaint": "queja",
        "issue": "problema",
        "problem": "problema",
        "error": "error",
        "slow": "lento",
        "fast": "rápido",
        "good": "bueno",
        "bad": "malo",
        "service": "servicio",
        "product": "producto",
        "quality": "calidad",
        "price": "precio",
        "support": "soporte",
        "technical": "técnico",
        "mobile": "móvil",
        "app": "aplicación",
        "website": "sitio web",
        "login": "iniciar sesión",
        "account": "cuenta",
        "payment": "pago",
        "refund": "reembolso",
        "delivery": "entrega",
        "update": "actualización",
        "notification": "notificación"
      },
      fr: { 
        // Fixed typo: frecuentes -> fréquentes
        "slow loading time on mobile": "temps de chargement lent sur mobile",
        "frequent disconnection issues": "problèmes de déconnexion fréquents",
        "delayed response from support team": "réponse retardée de l'équipe de support",
        "payment gateway not working properly": "la passerelle de paiement ne fonctionne pas correctement",
        "too many ads displayed during use": "trop de publicités affichées pendant l'utilisation",
        "poor customer care service": "mauvais service à la clientèle",
        "high-quality products": "produits de haute qualité",
        "timely updates and communication": "mises à jour et communication opportunes",
        "fast and reliable delivery": "livraison rapide et fiable",
        "smooth payment process": "processus de paiement fluide",
        
        // Common words
        "customer": "client",
        "complaint": "plainte",
        "issue": "problème",
        "problem": "problème",
        "error": "erreur",
        "slow": "lent",
        "fast": "rapide",
        "good": "bon",
        "bad": "mauvais",
        "service": "service",
        "product": "produit",
        "quality": "qualité",
        "price": "prix",
        "support": "support",
        "technical": "technique",
        "mobile": "mobile",
        "app": "application",
        "website": "site web",
        "login": "se connecter",
        "account": "compte",
        "payment": "paiement",
        "refund": "remboursement",
        "delivery": "livraison",
        "update": "mise à jour",
        "notification": "notification"
      },
      hi: { 
        // Existing phrases
        "slow loading time on mobile": "मोबाइल पर धीमा लोडिंग समय",
        "frequent disconnection issues": "लगातार डिस्कनेक्शन की समस्याएं",
        "delayed response from support team": "समर्थन टीम से विलंबित प्रतिक्रिया",
        "payment gateway not working properly": "भुगतान गेटवे ठीक से काम नहीं कर रहा है",
        "too many ads displayed during use": "उपयोग के दौरान बहुत सारे विज्ञापन दिखाए जाते हैं",
        "poor customer care service": "खराब ग्राहक सेवा",
        "high-quality products": "उच्च गुणवत्ता वाले उत्पाद",
        "timely updates and communication": "समय पर अद्यतन और संचार",
        "fast and reliable delivery": "तेज और विश्वसनीय डिलीवरी",
        "smooth payment process": "सहज भुगतान प्रक्रिया",
        
        // Common words
        "customer": "ग्राहक",
        "complaint": "शिकायत",
        "issue": "मुद्दा",
        "problem": "समस्या",
        "error": "त्रुटि",
        "slow": "धीमा",
        "fast": "तेज",
        "good": "अच्छा",
        "bad": "खराब",
        "service": "सेवा",
        "product": "उत्पाद",
        "quality": "गुणवत्ता",
        "price": "मूल्य",
        "support": "समर्थन",
        "technical": "तकनीकी",
        "mobile": "मोबाइल",
        "app": "ऐप",
        "website": "वेबसाइट",
        "login": "लॉग इन",
        "account": "खाता",
        "payment": "भुगतान",
        "refund": "धनवापसी",
        "delivery": "वितरण",
        "update": "अद्यतन",
        "notification": "सूचना"
      },
      gu: {
        // Gujarati translations
        "customer": "ગ્રાહક",
        "complaint": "ફરિયાદ",
        "issue": "મુદ્દો",
        "problem": "સમસ્યા",
        "error": "ભૂલ",
        "slow": "ધીમી",
        "fast": "ઝડપી",
        "good": "સારું",
        "bad": "ખરાબ",
        "service": "સેવા",
        "product": "ઉત્પાદન",
        "quality": "ગુણવત્તા",
        "price": "કિંમત",
        "support": "આધાર",
        "technical": "ટેકનિકલ",
        "mobile": "મોબાઇલ",
        "app": "એપ્લિકેશન",
        "website": "વેબસાઇટ",
        "login": "લૉગ ઇન",
        "account": "ખાતું",
        "payment": "ચુકવણી",
        "refund": "રિફંડ",
        "delivery": "વિતરણ",
        "update": "અપડેટ",
        "notification": "સૂચના",
        "slow loading time on mobile": "મોબાઇલ પર ધીમી લોડિંગ સમય",
        "frequent disconnection issues": "વારંવાર ડિસ્કનેક્શન સમસ્યાઓ",
        "delayed response from support team": "સપોર્ટ ટીમમાંથી વિલંબિત પ્રતિક્રિયા",
        "payment gateway not working properly": "ચુકવણી ગેટવે યોગ્ય રીતે કામ નથી કરી રહ્યું",
        "too many ads displayed during use": "ઉપયોગ દરમિયાન ઘણા બધા જાહેરાતો પ્રદર્શિત થાય છે",
        "poor customer care service": "નબળી ગ્રાહક સેવા",
        "high-quality products": "ઉચ્ચ-ગુણવત્તાના ઉત્પાદનો",
        "timely updates and communication": "સમયસર અપડેટ્સ અને સંચાર",
        "fast and reliable delivery": "ઝડપી અને વિશ્વસનીય ડિલિવરી",
        "smooth payment process": "સરળ ચુકવણી પ્રક્રિયા"
      }
    };
  }

  // returns translated string
  async translate(text, targetLang) {
    console.log(`Translating: "${text.substring(0, 30)}..." to ${targetLang}`);
    
    if (!text || !targetLang) {
      console.error('Missing parameters - text:', text, 'targetLang:', targetLang);
      throw new Error('Text and target language are required');
    }

    try {
      // First try phrase-based translation with our dictionary
      let translatedText = text;
      const code = targetLang.toLowerCase().slice(0,2);
      const dict = this.dictionary[code] || {};
      
      // Count how many phrases we replace for better logging
      let replacementCount = 0;
      
      // Replace whole phrases first (longer matches first)
      const phrases = Object.keys(dict).sort((a, b) => b.length - a.length);
      for (const phrase of phrases) {
        const regex = new RegExp(this.escapeRegExp(phrase), 'gi');
        if (translatedText.match(regex)) {
          translatedText = translatedText.replace(regex, dict[phrase]);
          replacementCount++;
        }
      }
      
      // If we made significant changes, return the phrase-based translation
      if (replacementCount > 0) {
        console.log(`Using phrase-based translation (${replacementCount} phrases replaced)`);
        return translatedText;
      }
      
      // If no phrases matched, use Ollama for the full translation
      console.log('No phrase matches, using Ollama for full translation');
      const modelOut = await this.ollama.translate(text, targetLang);

      // If Ollama fails or returns same text, use word-by-word fallback
      if (!modelOut || modelOut.trim() === text.trim() || 
          this.calculateSimilarity(text, modelOut) > 0.8) {
        console.log('Ollama translation failed, using word-by-word fallback');
        
        // Word-by-word translation as fallback with better handling
        const wordTranslated = this.translateWordByWord(text, dict);
        return wordTranslated;
      }

      return modelOut;
    } catch (err) {
      console.error('[TranslationService] error:', err.message);
      // final fallback attempt (word-by-word)
      const code = (targetLang || '').toLowerCase().slice(0,2);
      const dict = this.dictionary[code] || {};
      
      return this.translateWordByWord(text, dict);
    }
  }

  // Helper method to escape regex special characters
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Improved word-by-word translation
  translateWordByWord(text, dict) {
    // Split by words but preserve punctuation
    const words = text.split(/(\s+)/);
    
    const translatedWords = words.map(word => {
      // Skip whitespace
      if (word.trim().length === 0) return word;
      
      // Clean word for matching (remove punctuation and convert to lowercase)
      const cleanWord = word.replace(/[.,!?;:"]/g, '').toLowerCase();
      
      // Return translation if available, otherwise keep original word
      return dict[cleanWord] || word;
    });
    
    return translatedWords.join('');
  }

  // Calculate similarity between two texts
  calculateSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
}

module.exports = TranslationService;