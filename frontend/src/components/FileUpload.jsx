import React, { useState } from 'react';
import { FiFileText, FiUpload } from 'react-icons/fi';

const FileUpload = ({ onFileUpload, onTextPaste, disabled, fileName }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (text) onTextPaste(text);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <FiUpload className="text-blue-500" />
        Upload Document or Paste Text
      </h2>
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-upload').click()}
      >
        <input 
          id="file-upload"
          type="file" 
          accept=".pdf,.doc,.docx,.txt" 
          onChange={handleFileChange} 
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <FiFileText className="mx-auto text-3xl text-gray-400 mb-3" />
        <p className="text-gray-600 mb-1">
          Drag & drop your file here or <span className="text-blue-500 font-medium">browse files</span>
        </p>
        <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, TXT</p>
      </div>
      
      <div className="text-center">
        <label htmlFor="file-input" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
          Choose File
        </label>
        <input type="file" id="file-input" className="hidden" onChange={handleFileChange} disabled={disabled} />
        <div className="mt-2 text-sm text-gray-600">{fileName}</div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>
      
      <div>
        <label htmlFor="text-paste" className="block text-sm font-medium text-gray-700 mb-2">
          Paste text directly
        </label>
        <textarea
          id="text-paste"
          onPaste={handlePaste}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your text here..."
          rows={6}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FileUpload;