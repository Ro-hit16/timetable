// import React, { useState } from 'react';
// import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

// const DataTable = ({ 
//   data, 
//   columns, 
//   searchable = true,
//   pagination = true,
//   itemsPerPage = 10,
//   onRowClick,
//   loading = false 
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   // Filter data based on search term
//   const filteredData = data.filter(item =>
//     columns.some(column => {
//       const value = column.accessor ? item[column.accessor] : '';
//       return String(value).toLowerCase().includes(searchTerm.toLowerCase());
//     })
//   );

//   // Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

//   const goToPage = (page) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   if (loading) {
//     return (
//       <div className="bg-white shadow rounded-lg">
//         <div className="animate-pulse">
//           <div className="h-12 bg-gray-200 rounded-t-lg"></div>
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-16 bg-gray-100 border-t"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow rounded-lg">
//       {searchable && (
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {columns.map((column, index) => (
//                 <th
//                   key={index}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {column.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedData.length === 0 ? (
//               <tr>
//                 <td 
//                   colSpan={columns.length}
//                   className="px-6 py-12 text-center text-gray-500"
//                 >
//                   No data found
//                 </td>
//               </tr>
//             ) : (
//               paginatedData.map((item, index) => (
//                 <tr
//                   key={index}
//                   onClick={() => onRowClick && onRowClick(item)}
//                   className={`${
//                     onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
//                   } transition-colors`}
//                 >
//                   {columns.map((column, colIndex) => (
//                     <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {column.render 
//                         ? column.render(item, index)
//                         : item[column.accessor]
//                       }
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {pagination && totalPages > 1 && (
//         <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
//           </div>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </button>
//             <span className="text-sm text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataTable;


// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

// const DataTable = ({
//   data = [],
//   columns = [],
//   loading = false,
//   pagination = { page: 1, totalPages: 1 },
//   onPageChange,
//   onSearch,
//   filters = {},
//   onFilterChange
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [localFilters, setLocalFilters] = useState(() => {
//     const initial = {};
//     for (const key in filters) {
//       initial[key] = filters[key].value || '';
//     }
//     return initial;
//   });

//   // Debounce search input for better performance
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       onSearch && onSearch(searchTerm);
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm, onSearch]);

//   // Sync external filters changes to local state
//   useEffect(() => {
//     const newFilters = {};
//     for (const key in filters) {
//       newFilters[key] = filters[key].value || '';
//     }
//     setLocalFilters(newFilters);
//   }, [filters]);

//   const handleFilterChange = (filterKey, value) => {
//     setLocalFilters(prev => ({ ...prev, [filterKey]: value }));
//     onFilterChange && onFilterChange(filterKey, value);
//   };

//   return (
//     <div className="relative">
//       {/* Search and Filters */}
//       <div className="flex flex-wrap justify-between mb-4 space-y-2 md:space-y-0 md:space-x-4">
//         <div className="flex items-center space-x-2 flex-1 max-w-md">
//           <Search size={16} />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border rounded-md px-3 py-1 w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="flex space-x-2 flex-wrap">
//           {Object.entries(filters).map(([filterKey, filter]) => (
//             <select
//               key={filterKey}
//               value={localFilters[filterKey] || ''}
//               onChange={e => handleFilterChange(filterKey, e.target.value)}
//               className="border rounded-md px-3 py-1"
//               title={`Filter by ${filterKey}`}
//             >
//               <option value="">All {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</option>
//               {filter.options && filter.options.map((option, idx) => {
//                 // Support if option is string or object with label/value
//                 if (typeof option === 'string') {
//                   return (
//                     <option key={idx} value={option}>
//                       {option.charAt(0).toUpperCase() + option.slice(1)}
//                     </option>
//                   );
//                 } else if (typeof option === 'object' && option !== null) {
//                   // Assuming { label, value }
//                   return (
//                     <option key={idx} value={option.value}>
//                       {option.label}
//                     </option>
//                   );
//                 }
//                 return null;
//               })}
//             </select>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg shadow-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               {columns.map(col => (
//                 <th
//                   key={col.key}
//                   className="text-left px-4 py-2 text-sm font-semibold text-gray-700"
//                 >
//                   {col.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-6">
//                   Loading...
//                 </td>
//               </tr>
//             ) : data.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-6">
//                   No records found.
//                 </td>
//               </tr>
//             ) : (
//               data.map((row, idx) => (
//                 <tr
//                   key={row.stu_id || idx}
//                   className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//                 >
//                   {columns.map(col => (
//                     <td
//                       key={col.key}
//                       className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap"
//                     >
//                       {col.render ? col.render(row) : row[col.key]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-3">
//         <div className="text-sm text-gray-600">
//           Page {pagination.page} of {pagination.totalPages}
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => onPageChange && onPageChange(pagination.page - 1)}
//             disabled={pagination.page <= 1}
//             className="p-2 rounded border border-gray-300 disabled:opacity-50"
//             title="Previous Page"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <button
//             onClick={() => onPageChange && onPageChange(pagination.page + 1)}
//             disabled={pagination.page >= pagination.totalPages}
//             className="p-2 rounded border border-gray-300 disabled:opacity-50"
//             title="Next Page"
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;


// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

// const DataTable = ({
//   data = [],
//   columns = [],
//   loading = false,
//   pagination = { page: 1, totalPages: 1 },
//   onPageChange,
//   onSearch,
//   filters = {},
//   onFilterChange
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [localFilters, setLocalFilters] = useState(() => {
//     const initial = {};
//     for (const key in filters) {
//       initial[key] = filters[key].value || '';
//     }
//     return initial;
//   });

//   // Debounce search input for better performance
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       onSearch && onSearch(searchTerm);
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm, onSearch]);

//   // Sync external filters changes to local state
//   // FIX: use JSON.stringify(filters) to avoid infinite loop if filters object identity changes but content does not
//   useEffect(() => {
//     const newFilters = {};
//     for (const key in filters) {
//       newFilters[key] = filters[key].value || '';
//     }
//     setLocalFilters(newFilters);
//   }, [JSON.stringify(filters)]); // <-- fix here

//   const handleFilterChange = (filterKey, value) => {
//     setLocalFilters(prev => ({ ...prev, [filterKey]: value }));
//     onFilterChange && onFilterChange(filterKey, value);
//   };

//   return (
//     <div className="relative">
//       {/* Search and Filters */}
//       <div className="flex flex-wrap justify-between mb-4 space-y-2 md:space-y-0 md:space-x-4">
//         <div className="flex items-center space-x-2 flex-1 max-w-md">
//           <Search size={16} />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border rounded-md px-3 py-1 w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="flex space-x-2 flex-wrap">
//           {Object.entries(filters).map(([filterKey, filter]) => (
//             <select
//               key={filterKey}
//               value={localFilters[filterKey] || ''}
//               onChange={e => handleFilterChange(filterKey, e.target.value)}
//               className="border rounded-md px-3 py-1"
//               title={`Filter by ${filterKey}`}
//             >
//               <option value="">All {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</option>
//               {filter.options && filter.options.map((option, idx) => {
//                 if (typeof option === 'string') {
//                   return (
//                     <option key={idx} value={option}>
//                       {option.charAt(0).toUpperCase() + option.slice(1)}
//                     </option>
//                   );
//                 } else if (typeof option === 'object' && option !== null) {
//                   return (
//                     <option key={idx} value={option.value}>
//                       {option.label}
//                     </option>
//                   );
//                 }
//                 return null;
//               })}
//             </select>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg shadow-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               {columns.map(col => (
//                 <th
//                   key={col.key}
//                   className="text-left px-4 py-2 text-sm font-semibold text-gray-700"
//                 >
//                   {col.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-6">
//                   Loading...
//                 </td>
//               </tr>
//             ) : data.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-6">
//                   No records found.
//                 </td>
//               </tr>
//             ) : (
//               data.map((row, idx) => (
//                 <tr
//                   key={row.stu_id || idx}
//                   className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//                 >
//                   {columns.map(col => (
//                     <td
//                       key={col.key}
//                       className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap"
//                     >
//                       {col.render ? col.render(row) : row[col.key]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-3">
//         <div className="text-sm text-gray-600">
//           Page {pagination.page} of {pagination.totalPages}
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => onPageChange && onPageChange(pagination.page - 1)}
//             disabled={pagination.page <= 1}
//             className="p-2 rounded border border-gray-300 disabled:opacity-50"
//             title="Previous Page"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <button
//             onClick={() => onPageChange && onPageChange(pagination.page + 1)}
//             disabled={pagination.page >= pagination.totalPages}
//             className="p-2 rounded border border-gray-300 disabled:opacity-50"
//             title="Next Page"
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;


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
