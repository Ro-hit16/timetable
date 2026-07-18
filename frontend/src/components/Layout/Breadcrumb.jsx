// frontend/src/components/Layout/Breadcrumb.jsx
//
// Derives its trail from the current route — labels match the paths
// already registered in App.js (/dashboard, /teachers, /departments,
// /class, /subjects, /timetables). No new routes introduced.

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const LABELS = {
  dashboard: 'Dashboard',
  teachers: 'Teachers',
  departments: 'Departments',
  class: 'Classes',
  subjects: 'Subjects',
  timetables: 'Timetables',
};

const Breadcrumb = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label, isLast: index === segments.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      <Link to="/dashboard" className="flex items-center hover:text-gray-700 dark:hover:text-gray-200">
        <Home className="h-4 w-4" />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 text-gray-300 dark:text-gray-600" />
          {crumb.isLast ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">{crumb.label}</span>
          ) : (
            <Link to={crumb.href} className="hover:text-gray-700 dark:hover:text-gray-200">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;