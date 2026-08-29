// frontend/src/components/Layout/DashboardHeader.jsx

import React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen, Bell } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import UserMenu from './UserMenu';
import { ThemeToggle } from '../ui/theme-toggle';

const DashboardHeader = ({ onOpenMobileSidebar, collapsed, onToggleCollapsed }) => {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <button
            onClick={onToggleCollapsed}
            className="hidden lg:inline-flex p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>

          <div className="min-w-0">
            <Breadcrumb />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;