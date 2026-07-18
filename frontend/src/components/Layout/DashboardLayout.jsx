// frontend/src/components/Layout/DashboardLayout.jsx
//
// Replaces Layout.jsx as the element rendered for the protected route
// tree in App.js. Same <Outlet/> contract, same nested routes — nothing
// about routing changes, only the chrome around it.

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

const SIDEBAR_COLLAPSED_KEY = 'sidebarCollapsed';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  );

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <DashboardSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader
          onOpenMobileSidebar={() => setMobileOpen(true)}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
        />

        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;