import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import { getLanguageName } from '../services/apiService';

const LanguageSelector = ({ selectedLanguage, onLanguageChange, disabled, loading }) => {
  return (
    <div className="flex items-center gap-2">
      <FiGlobe className="text-gray-600" />
      <span className="text-sm text-gray-600">Translate to:</span>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled || loading}
        className="border rounded-md px-2 py-1 text-sm"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="gu">Gujarati</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="zh">Chinese</option>
      </select>
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      )}
    </div>
  );
};

export default LanguageSelector;