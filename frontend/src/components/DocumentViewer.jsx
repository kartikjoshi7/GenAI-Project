// components/DocumentViewer.jsx
import React from 'react';

const DocumentViewer = ({ text, isTruncated, onViewFullText }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Document Content</h2>
        {isTruncated && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm">
            Text truncated for display
          </div>
        )}
      </div>
      <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap text-gray-700">
          {text}
        </pre>
      </div>
    </div>
  );
};

export default DocumentViewer;