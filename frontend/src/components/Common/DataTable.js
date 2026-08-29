// frontend/src/components/Common/DataTable.js
//
// Modernized presentation only — props/behavior contract is unchanged
// (data, columns[{key,label,render}], loading, pagination, onPageChange,
// onSearch, filters, onFilterChange all work exactly as before). This
// file is used exclusively by the Teachers page, so these visual
// improvements are scoped to that page in practice.

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Inbox } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = { page: 1, totalPages: 1 },
  onPageChange,
  onSearch,
  filters = {},
  onFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState(() => {
    const initial = {};
    for (const key in filters) {
      initial[key] = filters[key].value || '';
    }
    return initial;
  });

  // Debounce search input for better performance
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch && onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onSearch]);

  // Sync external filters changes to local state
  // Using JSON.stringify to prevent unnecessary updates/infinite loops
  useEffect(() => {
    const newFilters = {};
    for (const key in filters) {
      newFilters[key] = filters[key].value || '';
    }
    setLocalFilters(newFilters);
  }, [JSON.stringify(filters)]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));

    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const handlePageChange = (newPage) => {
    if (onPageChange && newPage > 0 && newPage <= pagination.totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-shadow">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="outline-none w-full text-sm bg-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(filters).map(key => {
            const filter = filters[key];
            if (!filter.options || filter.options.length === 0) return null;
            const label = filter.label || `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            return (
              <select
                key={key}
                value={localFilters[key]}
                onChange={e => handleFilterChange(key, e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All {label}</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 border-b border-gray-200 font-medium text-xs uppercase tracking-wide text-gray-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-14">
                  <div className="flex justify-center">
                    <LoadingSpinner size="medium" text="Loading..." />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-14">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-3 rounded-full bg-gray-100 mb-3">
                      <Inbox className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium text-sm">No results found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row._id || idx} className="bg-white hover:bg-gray-50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 align-middle">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;