// import React, { useEffect, useState } from 'react';
// import departmentService from '../../services/departmentService';
// //import { Button } from '@/components/ui/button';
// import { Button } from '../../components/ui/button';
// const Departments = () => {
//   const [departments, setDepartments] = useState([]);
//   const [newDept, setNewDept] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const fetchDepartments = async () => {
//     try {
//       setLoading(true);
//       const res = await departmentService.getAllDepartments();
//       setDepartments(res.data);
//     } catch (error) {
//       setMessage('Error loading departments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddDepartment = async () => {
//     if (!newDept.trim()) return;

//     try {
//       const res = await departmentService.createDepartment({ name: newDept });
//       setMessage('Department added successfully');
//       setNewDept('');
//       fetchDepartments();
//     } catch (error) {
//       setMessage('Failed to add department');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this department?')) return;
//     try {
//       await departmentService.deleteDepartment(id);
//       fetchDepartments();
//     } catch (error) {
//       setMessage('Failed to delete');
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Manage Departments</h2>

//       {message && <div className="mb-3 text-sm text-blue-600">{message}</div>}

//       <div className="flex items-center gap-2 mb-6">
//         <input
//           type="text"
//           placeholder="New Department Name"
//           value={newDept}
//           onChange={(e) => setNewDept(e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//         <Button onClick={handleAddDepartment}>Add</Button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="w-full border border-gray-200 rounded">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-2 px-4 text-left">Department Name</th>
//               <th className="py-2 px-4">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {departments.map((dept) => (
//               <tr key={dept._id} className="border-t">
//                 <td className="py-2 px-4">{dept.name}</td>
//                 <td className="py-2 px-4 text-center">
//                   <Button variant="destructive" onClick={() => handleDelete(dept._id)}>
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Departments;



// import React, { useEffect, useState } from 'react';
// import departmentService from '../../services/departmentService';
// import { Button } from '../../components/ui/button';

// const Departments = () => {
//   const [departments, setDepartments] = useState([]);
//   const [departmentName, setDepartmentName] = useState('');
//   const [departmentCode, setDepartmentCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const fetchDepartments = async () => {
//     try {
//       setLoading(true);
//       const res = await departmentService.getAllDepartments();
//       setDepartments(res.data);
//     } catch (error) {
//       setMessage('Error loading departments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddDepartment = async () => {
//     if (!departmentName.trim() || !departmentCode.trim()) {
//       setMessage('Please enter both name and code');
//       return;
//     }

//     try {
//       await departmentService.createDepartment({
//         departmentName,
//         departmentCode
//       });
//       setMessage('Department added successfully');
//       setDepartmentName('');
//       setDepartmentCode('');
//       fetchDepartments();
//     } catch (error) {
//       setMessage(error?.response?.data?.message || 'Failed to add department');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this department?')) return;
//     try {
//       await departmentService.deleteDepartment(id);
//       fetchDepartments();
//     } catch (error) {
//       setMessage('Failed to delete department');
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Manage Departments</h2>

//       {message && <div className="mb-3 text-sm text-blue-600">{message}</div>}

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
//         <input
//           type="text"
//           placeholder="Department Name"
//           value={departmentName}
//           onChange={(e) => setDepartmentName(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Department Code"
//           value={departmentCode}
//           onChange={(e) => setDepartmentCode(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <Button onClick={handleAddDepartment} disabled={loading}>
//           {loading ? 'Adding...' : 'Add Department'}
//         </Button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="w-full border border-gray-200 rounded text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-2 px-4 text-left">Name</th>
//               <th className="py-2 px-4 text-left">Code</th>
//               <th className="py-2 px-4 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {departments.map((dept) => (
//               <tr key={dept._id} className="border-t">
//                 <td className="py-2 px-4">{dept.departmentName}</td>
//                 <td className="py-2 px-4">{dept.departmentCode}</td>
//                 <td className="py-2 px-4 text-center">
//                   <Button variant="destructive" onClick={() => handleDelete(dept._id)}>
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Departments;


// import React, { useEffect, useState } from 'react';
// import departmentService from '../../services/departmentService';
// import { Button } from '../../components/ui/button';

// const Departments = () => {
//   const [departments, setDepartments] = useState([]);
//   const [departmentName, setDepartmentName] = useState('');
//   const [departmentCode, setDepartmentCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const fetchDepartments = async () => {
//     try {
//       setLoading(true);
//       const res = await departmentService.getAllDepartments();

//       // Safe fallback if res.data is undefined or not an array
//       const deptList = Array.isArray(res?.data) ? res.data : [];
//       setDepartments(deptList);
//     } catch (error) {
//       setMessage('Error loading departments');
//       console.error('Fetch error:', error);
//       setDepartments([]); // ensure it's at least an empty array
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddDepartment = async () => {
//     if (!departmentName.trim() || !departmentCode.trim()) {
//       setMessage('Please enter both name and code');
//       return;
//     }

//     try {
//       setLoading(true);
//       await departmentService.createDepartment({
//         departmentName,
//         departmentCode,
//       });
//       setMessage('Department added successfully');
//       setDepartmentName('');
//       setDepartmentCode('');
//       await fetchDepartments();
//     } catch (error) {
//       setMessage(error?.response?.data?.message || 'Failed to add department');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this department?')) return;
//     try {
//       await departmentService.deleteDepartment(id);
//       await fetchDepartments();
//     } catch (error) {
//       setMessage('Failed to delete department');
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Manage Departments</h2>

//       {message && <div className="mb-3 text-sm text-blue-600">{message}</div>}

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
//         <input
//           type="text"
//           placeholder="Department Name"
//           value={departmentName}
//           onChange={(e) => setDepartmentName(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Department Code"
//           value={departmentCode}
//           onChange={(e) => setDepartmentCode(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <Button onClick={handleAddDepartment} disabled={loading}>
//           {loading ? 'Adding...' : 'Add Department'}
//         </Button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : departments.length > 0 ? (
//         <table className="w-full border border-gray-200 rounded text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-2 px-4 text-left">Name</th>
//               <th className="py-2 px-4 text-left">Code</th>
//               <th className="py-2 px-4 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {departments.map((dept) => (
//               <tr key={dept._id} className="border-t">
//                 <td className="py-2 px-4">{dept.departmentName}</td>
//                 <td className="py-2 px-4">{dept.departmentCode}</td>
//                 <td className="py-2 px-4 text-center">
//                   <Button variant="destructive" onClick={() => handleDelete(dept._id)}>
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No departments found.</p>
//       )}
//     </div>
//   );
// };

// export default Departments;


import React, { useEffect, useState } from 'react';
import departmentService from '../../services/departmentService';
import { Button } from '../../components/ui/button';
import { Search, Filter, Plus, Edit, Trash2, RefreshCw, X } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  
  // Form states
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
    description: '',
    establishedYear: '',
    contactEmail: '',
    contactPhone: '',
    website: ''
  });
  
  // Filter and search states
  const [filters, setFilters] = useState({
    search: '',
    isActive: true,
    sortBy: 'departmentName',
    sortOrder: 'asc',
    limit: 10,
    skip: 0
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pagination, setPagination] = useState({});

  // Fetch departments with current filters
  const fetchDepartments = async (customFilters = {}) => {
    try {
      setLoading(true);
      const queryParams = { ...filters, ...customFilters };

        console.log('Query Params being sent =>', queryParams);
    console.log('Calling API...');
      const response = await departmentService.getAllDepartments(queryParams);
      console.log('API Response => ', response);

      
      if (response && response.departments) {
        setDepartments(response.departments);
        setPagination(response.pagination || {});
      } else if (Array.isArray(response)) {
        setDepartments(response);
      } else {
        setDepartments([]);
      }
      
      setMessage('');
    } catch (error) {
      setMessage('Error loading departments');
      setMessageType('error');
      console.error('Fetch error:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      skip: 0 // Reset pagination when filters change
    }));
  };

  // Reset all form data
  const resetForm = () => {
    setFormData({
      departmentName: '',
      departmentCode: '',
      description: '',
      establishedYear: '',
      contactEmail: '',
      contactPhone: '',
      website: ''
    });
    setEditingId(null);
    setMessage('Form cleared successfully');
    setMessageType('info');
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      isActive: 'true',
      sortBy: 'departmentName',
      sortOrder: 'asc',
      limit: 10,
      skip: 0
    });
    setMessage('Filters reset successfully');
    setMessageType('info');
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.departmentName.trim() || !formData.departmentCode.trim()) {
      setMessage('Department name and code are required');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      
      if (editingId) {
        await departmentService.updateDepartment(editingId, formData);
        setMessage('Department updated successfully');
      } else {
        await departmentService.createDepartment(formData);
        setMessage('Department created successfully');
      }
      
      setMessageType('success');
      resetForm();
      await fetchDepartments();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Operation failed';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (department) => {
    setFormData({
      departmentName: department.departmentName || '',
      departmentCode: department.departmentCode || '',
      description: department.description || '',
      establishedYear: department.establishedYear || '',
      contactEmail: department.contactEmail || '',
      contactPhone: department.contactPhone || '',
      website: department.website || ''
    });
    setEditingId(department._id);
    setMessage('Editing department - make changes and click Update');
    setMessageType('info');
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    
    try {
      setLoading(true);
      await departmentService.deleteDepartment(id);
      setMessage('Department deleted successfully');
      setMessageType('success');
      await fetchDepartments();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to delete department';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchDepartments();
  };

  // Handle pagination
  const handlePageChange = (newSkip) => {
    setFilters(prev => ({ ...prev, skip: newSkip }));
  };

  // Show message with auto-clear
  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // Load departments on component mount and filter changes
  useEffect(() => {
    fetchDepartments();
  }, [filters]);

  return (
    <div className="p-6 max-w-7xl mx-auto mt-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Departments</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            onClick={() => fetchDepartments()}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
          messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
          'bg-blue-100 text-blue-700 border border-blue-300'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search departments..."
                  className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
                <option value="all">All Departments</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="departmentName">Department Name</option>
                <option value="departmentCode">Department Code</option>
                <option value="establishedYear">Established Year</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search size={16} />
              Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="outline" className="flex items-center gap-2">
              <X size={16} />
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {editingId ? 'Update Department' : 'Add New Department'}
          </h3>
          <Button
            onClick={resetForm}
            variant="outline"
            className="flex items-center gap-2"
            type="button"
          >
            <X size={16} />
            Reset Form
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
              placeholder="Enter department name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Code *
            </label>
            <input
              type="text"
              name="departmentCode"
              value={formData.departmentCode}
              onChange={handleInputChange}
              placeholder="Enter department code"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Established Year
            </label>
            <input
              type="number"
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleInputChange}
              placeholder="Enter year"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="Enter contact email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              pattern="[6-9][0-9]{9}"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Enter website URL"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter department description"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="md:col-span-2 lg:col-span-3 flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : editingId ? (
                <Edit size={16} />
              ) : (
                <Plus size={16} />
              )}
              {loading ? 'Processing...' : editingId ? 'Update Department' : 'Add Department'}
            </Button>
            
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Departments List
              {pagination.total && (
                <span className="text-sm text-gray-500 ml-2">
                  ({pagination.total} total)
                </span>
              )}
            </h3>
            
            {pagination.total > filters.limit && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Showing {filters.skip + 1}-{Math.min(filters.skip + filters.limit, pagination.total)} of {pagination.total}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <p className="text-gray-600">Loading departments...</p>
          </div>
        ) : departments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Established</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr key={dept._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{dept.departmentName}</div>
                          {dept.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {dept.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {dept.departmentCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dept.establishedYear || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>
                          {dept.contactEmail && (
                            <div className="truncate max-w-xs">{dept.contactEmail}</div>
                          )}
                          {dept.contactPhone && (
                            <div>{dept.contactPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          dept.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => handleEdit(dept)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit size={14} />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(dept._id)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Page {Math.floor(filters.skip / filters.limit) + 1} of {pagination.pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePageChange(Math.max(0, filters.skip - filters.limit))}
                      disabled={filters.skip === 0}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(filters.skip + filters.limit)}
                      disabled={filters.skip + filters.limit >= pagination.total}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-lg mb-1">No departments found</p>
            <p className="text-sm">Try adjusting your search filters or add a new department</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;