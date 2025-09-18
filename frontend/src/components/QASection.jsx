import React, { useState } from 'react';
import { FiHelpCircle, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { askQuestion } from '../services/api';

const QASection = ({ originalText, simplifiedText, loading }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAsk = async () => {
    if (!question) {
      toast.error('Please enter a question');
      return;
    }
    
    setIsAsking(true);
    try {
      const response = await askQuestion({
        question,
        context: simplifiedText || originalText,
      });
      
      if (response?.data?.success) {
        setAnswer(response.data.answer);
        setHistory(prev => [...prev, { question, answer: response.data.answer }]);
        setQuestion('');
      } else {
        toast.error('Failed to get answer');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Error fetching answer');
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100"
    >
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <FiHelpCircle className="text-purple-600" />
        </div>
        Ask a Question
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="question-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your question about the document
          </label>
          <div className="relative">
            <input
              id="question-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., What are the main obligations in this agreement?"
              className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-12"
              disabled={loading || isAsking}
            />
            <button 
              onClick={handleAsk} 
              disabled={loading || isAsking || !question}
              className="absolute right-2 top-2 bg-purple-600 text-white p-2 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAsking ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : 'Ask'}
            </button>
          </div>
        </div>
        
        {answer && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-purple-50 p-4 border border-purple-200 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <strong className="text-purple-800">Answer:</strong>
              <button onClick={() => setAnswer('')} className="text-purple-500 hover:text-purple-700">
                <FiX />
              </button>
            </div>
            <p className="text-gray-700">{answer}</p>
          </motion.div>
        )}
      </div>
      
      {history.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3">Question History</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-800">Q: {item.question}</p>
                <p className="text-sm text-gray-600 mt-1">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QASection;