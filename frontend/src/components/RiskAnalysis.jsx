// src/components/RiskAnalysis.jsx
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const RiskAnalysis = ({ risks, loading }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Helper function to normalize risks data
  const normalizeRisks = (risksData) => {
    if (!risksData) return [];
    
    // If risks is already an array of objects
    if (Array.isArray(risksData) && risksData.length > 0) {
      // Check if it's an array of strings
      if (typeof risksData[0] === 'string') {
        return risksData.map(risk => ({
          title: risk,
          description: risk,
          severity: 'medium'
        }));
      }
      // Check if it's an array of objects but missing severity
      return risksData.map(risk => ({
        title: risk.title || risk.name || 'Unnamed Risk',
        description: risk.description || risk.detail || 'No description available',
        severity: risk.severity || 'medium'
      }));
    }
    
    return [];
  };

  const normalizedRisks = normalizeRisks(risks);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiAlertTriangle className="text-red-500" />
        Risks Found
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-500">Analyzing risks...</span>
        </div>
      ) : normalizedRisks.length > 0 ? (
        <div className="space-y-4">
          {normalizedRisks.map((risk, i) => (
            <div key={i} className={`p-4 border rounded-lg ${getSeverityColor(risk.severity)}`}>
              <h4 className="font-medium">{risk.title}</h4>
              <p className="mt-1 text-sm">{risk.description}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-white">
                Severity: {risk.severity}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FiAlertTriangle className="mx-auto text-3xl mb-2" />
          <p>No risks identified in this document.</p>
        </div>
      )}
    </div>
  );
};

export default RiskAnalysis;