import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const SimplifiedView = ({ text, loading, translationError }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiMessageSquare className="text-green-500" />
          Simplified Document
        </h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Simplified</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-500">Processing...</span>
        </div>
      ) : (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 min-h-[120px]">
          <pre className="whitespace-pre-wrap font-sans text-gray-700">{text || 'No simplified text yet. Upload a document or paste text to begin.'}</pre>
        </div>
      )}
      {translationError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
          <strong>Translation Error:</strong> {translationError}
        </div>
      )}
    </div>
  );
};

export default SimplifiedView;