// frontend/src/components/Layout/DashboardSidebar.jsx
//
// Same nav items/routes as the old Sidebar.jsx (no routing change), plus
// a desktop collapse mode (icon-only) and a mobile slide-in drawer.

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Teachers', href: '/teachers', icon: GraduationCap },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Classes', href: '/class', icon: BookOpen },
  { name: 'Subjects', href: '/subjects', icon: Calendar },
  { name: 'Timetables', href: '/timetables', icon: Clock },
];

const DashboardSidebar = ({ mobileOpen, onCloseMobile, collapsed, onToggleCollapsed }) => {
  return (
    <>
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800 shadow-lg lg:shadow-none
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <span className={`text-lg font-semibold text-gray-900 dark:text-gray-100 truncate ${collapsed ? 'lg:hidden' : ''}`}>
            Timetable
          </span>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleCollapsed}
            className="hidden lg:inline-flex p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto mt-4 px-2">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={onCloseMobile}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${collapsed ? 'lg:justify-center' : ''}
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className={collapsed ? 'lg:hidden' : ''}>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;