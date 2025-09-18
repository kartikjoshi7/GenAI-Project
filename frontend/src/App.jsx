import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUpload, FiFileText, FiMessageSquare, FiAlertTriangle, FiHelpCircle } from 'react-icons/fi';

// Import components
import FileUpload from './components/FileUpload';
import DocumentViewer from './components/DocumentViewer';
import SimplifiedView from './components/SimplifiedView';
import LanguageSelector from './components/LanguageSelector';
import RiskAnalysis from './components/RiskAnalysis';
import SummaryView from './components/SummaryView';
import TabButton from './components/TabButton';

// Import services
import { apiService, getLanguageName } from './services/apiService';

const App = () => {
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [risks, setRisks] = useState([]);
  const [riskLoading, setRiskLoading] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const [summary, setSummary] = useState(null);
  const [translationError, setTranslationError] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [fullText, setFullText] = useState('');
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setTranslationError('');
    
    try {
      const result = await apiService.processDocument(file);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Store both the full text and the potentially truncated text
      setFullText(result.rawText || '');
      setOriginalText(result.rawText || '');
      setFileName(file.name);
      
      // Parse the summary if it's a JSON string
      try {
        const parsedSummary = typeof result.summary === 'string' 
          ? JSON.parse(result.summary) 
          : result.summary;
        setSummary(parsedSummary);
        
        // Set simplified text from the summary
        if (parsedSummary && parsedSummary.summary) {
          setSimplifiedText(parsedSummary.summary);
        }
      } catch (e) {
        console.error('Error parsing summary:', e);
        setSimplifiedText(result.summary || '');
      }
      
      // Check if text was truncated
      setIsTextTruncated(result.truncated || false);
      
      toast.success('Document processed successfully!');
      setActiveTab('document');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  const handleTextPaste = async (text) => {
    setLoading(true);
    setTranslationError('');
    
    try {
      const result = await apiService.processText(text);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setFullText(text);
      setOriginalText(text);
      
      // Parse the summary if it's a JSON string
      try {
        const parsedSummary = typeof result.summary === 'string' 
          ? JSON.parse(result.summary) 
          : result.summary;
        setSummary(parsedSummary);
        
        // Set simplified text from the summary
        if (parsedSummary && parsedSummary.summary) {
          setSimplifiedText(parsedSummary.summary);
        }
      } catch (e) {
        console.error('Error parsing summary:', e);
        setSimplifiedText(result.summary || '');
      }
      
      toast.success('Text processed successfully!');
      setActiveTab('document');
    } catch (error) {
      console.error('Text processing error:', error);
      toast.error(error.message || 'Failed to process text');
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async (text, level = 'standard') => {
    if (!text && !originalText) return;
    setLoading(true);
    setTranslationError('');
    
    try {
      const result = await apiService.simplifyText(text || originalText);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setSimplifiedText(result.simplified || result.text || 'Simplification completed');
      toast.success('Text simplified successfully!');
    } catch (error) {
      console.error('Simplify error:', error);
      toast.error(error.message || 'Failed to simplify text');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (lang) => {
    if (!simplifiedText) {
      toast.error('Please simplify text first before translating');
      return;
    }
    
    setTranslationLoading(true);
    setTranslationError('');
    
    try {
      const translatedText = await apiService.translateText(simplifiedText, lang);
      
      setSimplifiedText(translatedText);
      setSelectedLanguage(lang);
      toast.success(`Translated to ${getLanguageName(lang)} successfully!`);
    } catch (error) {
      console.error('Translation error:', error);
      const errorMsg = error.message || 'Failed to translate text';
      setTranslationError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setTranslationLoading(false);
    }
  };

  const handleAnalyzeRisks = async () => {
    if (!originalText) {
      toast.error('Please upload a document first');
      return;
    }
    
    setRiskLoading(true);
    setTranslationError('');
    
    try {
      const result = await apiService.analyzeRisks(originalText);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Handle different response formats
      let risksData = [];
      if (result.risks && Array.isArray(result.risks)) {
        risksData = result.risks;
      } else if (result.analysis && Array.isArray(result.analysis)) {
        risksData = result.analysis;
      } else if (summary && summary.risks) {
        risksData = summary.risks.map(risk => ({ 
          title: risk, 
          description: risk, 
          severity: 'medium' 
        }));
      } else if (result.text) {
        // Try to parse risks from text response
        risksData = [{ 
          title: 'Analysis completed', 
          description: result.text, 
          severity: 'medium' 
        }];
      } else {
        risksData = [
          { title: 'No specific risks identified', description: 'The document appears to be low risk.', severity: 'low' }
        ];
      }
      
      setRisks(risksData);
      setActiveTab('risks');
      toast.success('Risk analysis completed successfully!');
    } catch (error) {
      console.error('Risk analysis error:', error);
      toast.error(error.message || 'Failed to analyze risks');
    } finally {
      setRiskLoading(false);
    }
  };

  const handleViewFullText = () => {
    // If text was truncated, fetch the full version
    if (isTextTruncated && fullText.length > originalText.length) {
      setOriginalText(fullText);
      setIsTextTruncated(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      <motion.header 
        initial={{ y: -100 }} 
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-blue-600">LexiAI</h1>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm font-medium">
              Beta
            </span>
          </div>
          
          <LanguageSelector 
            selectedLanguage={selectedLanguage} 
            onLanguageChange={handleTranslate} 
            disabled={!simplifiedText} 
            loading={translationLoading}
          />
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Tabs */}
        <div className="flex space-x-4">
          <TabButton 
            name="Upload" 
            isActive={activeTab === 'upload'} 
            onClick={() => setActiveTab('upload')}
            icon={FiUpload}
          />
          <TabButton 
            name="Document" 
            isActive={activeTab === 'document'} 
            onClick={() => setActiveTab('document')}
            disabled={!originalText}
            icon={FiFileText}
          />
          <TabButton 
            name="Summary" 
            isActive={activeTab === 'summary'} 
            onClick={() => setActiveTab('summary')}
            disabled={!summary}
            icon={FiMessageSquare}
          />
          <TabButton 
            name="Risks" 
            isActive={activeTab === 'risks'} 
            onClick={handleAnalyzeRisks}
            disabled={!originalText}
            icon={FiAlertTriangle}
          />
        </div>

        {/* Content */}
        {activeTab === 'upload' && (
          <FileUpload 
            onFileUpload={handleFileUpload} 
            onTextPaste={handleTextPaste} 
            disabled={loading} 
            fileName={fileName}
          />
        )}
        
        {activeTab === 'document' && (
          <>
            <DocumentViewer 
              text={originalText} 
              isTruncated={isTextTruncated}
              onViewFullText={handleViewFullText}
            />
            <div className="flex justify-end space-x-4">
              {isTextTruncated && (
                <button
                  onClick={handleViewFullText}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  View Full Text
                </button>
              )}
              <button
                onClick={() => handleSimplify(originalText)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Simplify Text
              </button>
            </div>
          </>
        )}
        
        {activeTab === 'summary' && <SummaryView summary={summary} />}
        
        {activeTab === 'risks' && <RiskAnalysis risks={risks} loading={riskLoading} />}

        {/* Simplified view - always visible when we have content */}
        {(simplifiedText || loading) && (
          <SimplifiedView 
            text={simplifiedText} 
            loading={loading} 
            translationError={translationError} 
          />
        )}
      </main>
      
      <footer className="mt-12 py-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>LexiAI &copy; {new Date().getFullYear()} - Simplify and analyze your documents with AI</p>
      </footer>
    </div>
  );
};

export default App;