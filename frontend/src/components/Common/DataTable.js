

// frontend/src/components/Common/DataTable.jsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex items-center border rounded px-2 py-1 w-full sm:w-64">
          <Search size={16} className="mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(filters).map(key => {
            const filter = filters[key];
            if (!filter.options || filter.options.length === 0) return null;
            return (
              <select
                key={key}
                value={localFilters[key]}
                onChange={e => handleFilterChange(key, e.target.value)}
                className="input"
              >
                <option value="">All {key.charAt(0).toUpperCase() + key.slice(1)}</option>
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
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left px-4 py-2 border-b border-gray-300"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-2 border-b border-gray-300">
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
        <div className="flex justify-end items-center gap-2 mt-3">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn btn-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="btn btn-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
