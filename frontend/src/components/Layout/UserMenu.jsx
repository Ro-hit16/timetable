// frontend/src/components/Layout/UserMenu.jsx
//
// Reuses useAuth() exactly as the old Navbar.jsx did — no change to
// AuthContext or any API call.

import React, { useState, useRef, useEffect } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/avatar';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Avatar name={user?.name || 'Admin'} />
        <span className="hidden md:block font-medium">{user?.name || 'Admin'}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.name || 'Admin'}
            </p>
            {user?.email && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            )}
          </div>
          <a>
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;