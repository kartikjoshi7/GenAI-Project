import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const SummaryView = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiMessageSquare className="text-blue-500" />
        Document Summary
      </h3>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
        <p className="text-gray-600">{summary.summary || 'No summary available'}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Risks</h4>
          <ul className="list-disc list-inside text-gray-600">
            {summary.risks && summary.risks.length > 0 ? (
              summary.risks.map((risk, i) => <li key={i}>{risk}</li>)
            ) : (
              <li>No risks identified</li>
            )}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {summary.keywords && summary.keywords.length > 0 ? (
              summary.keywords.map((keyword, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No keywords extracted</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;