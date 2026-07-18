// frontend/src/components/ui/avatar.jsx

import React from 'react';

export const Avatar = ({ name = '', src, className = '' }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        className={`h-8 w-8 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-sm font-medium ${className}`}
    >
      {initials || <span className="sr-only">User</span>}
    </div>
  );
};