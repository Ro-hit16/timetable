import React from 'react';

export const Button = ({ children, className = '', variant = '', ...props }) => {
  const base = 'px-4 py-2 rounded transition font-medium';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };

  const selected = variants[variant] || variants.default;

  return (
    <button className={`${base} ${selected} ${className}`} {...props}>
      {children}
    </button>
  );
};
