import React from 'react';

const TabButton = ({ name, isActive, onClick, disabled, icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {Icon && <Icon size={16} />}
    {name}
  </button>
);

export default TabButton;