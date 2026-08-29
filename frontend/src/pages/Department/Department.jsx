import React, { useEffect, useState } from 'react';
import departmentService from '../../services/departmentService';
import { Button } from '../../components/ui/button';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  Hash,
  Info,
  CheckCircle2,
  AlertCircle,
  Inbox,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

  const messageStyles = {
    error: {
      wrap: 'bg-red-50 text-red-700 border border-red-200',
      icon: <AlertCircle className="h-4 w-4 shrink-0" />
    },
    success: {
      wrap: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      icon: <CheckCircle2 className="h-4 w-4 shrink-0" />
    },
    info: {
      wrap: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      icon: <Info className="h-4 w-4 shrink-0" />
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Academic Setup
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 mt-1">Departments</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage the academic departments used across the institution.
            </p>
          </div>
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
          <div className={`mb-6 px-4 py-3 rounded-lg ${messageStyles[messageType]?.wrap || messageStyles.info.wrap}`}>
            <div className="flex justify-between items-center gap-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                {messageStyles[messageType]?.icon || messageStyles.info.icon}
                {message}
              </span>
              <button onClick={() => setMessage('')} className="text-current opacity-60 hover:opacity-100">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white p-5 rounded-xl mb-6 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Search className="h-3.5 w-3.5" /> Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search departments..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
                <select
                  name="isActive"
                  value={filters.isActive}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                  <option value="all">All Departments</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Sort By</label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="departmentName">Department Name</option>
                  <option value="departmentCode">Department Code</option>
                  <option value="establishedYear">Established Year</option>
                  <option value="createdAt">Created Date</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Order</label>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              {editingId ? 'Update department' : 'Add new department'}
            </h2>
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
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Building2 className="h-3.5 w-3.5" /> Department name *
              </label>
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                placeholder="Enter department name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Hash className="h-3.5 w-3.5" /> Department code *
              </label>
              <input
                type="text"
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleInputChange}
                placeholder="Enter department code"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 uppercase placeholder:normal-case placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Calendar className="h-3.5 w-3.5" /> Established year
              </label>
              <input
                type="number"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleInputChange}
                placeholder="Enter year"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Mail className="h-3.5 w-3.5" /> Contact email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="Enter contact email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Phone className="h-3.5 w-3.5" /> Contact phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                pattern="[6-9][0-9]{9}"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Globe className="h-3.5 w-3.5" /> Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter website URL"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter department description"
                rows="3"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex gap-2 pt-1">
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-slate-900">
                Departments list
                {pagination.total ? (
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    ({pagination.total} total)
                  </span>
                ) : null}
              </h3>

              {pagination.total > filters.limit && (
                <div className="text-sm text-slate-500">
                  Showing {filters.skip + 1}-{Math.min(filters.skip + filters.limit, pagination.total)} of {pagination.total}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="animate-spin mx-auto mb-3 text-indigo-500" size={22} />
              <p className="text-slate-500 text-sm">Loading departments...</p>
            </div>
          ) : departments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium text-slate-500">Name</th>
                      <th className="px-5 py-3 text-left font-medium text-slate-500">Code</th>
                      <th className="px-5 py-3 text-left font-medium text-slate-500">Established</th>
                      <th className="px-5 py-3 text-left font-medium text-slate-500">Contact</th>
                      <th className="px-5 py-3 text-left font-medium text-slate-500">Status</th>
                      <th className="px-5 py-3 text-right font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departments.map((dept) => (
                      <tr key={dept._id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-800">{dept.departmentName}</div>
                          {dept.description && (
                            <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                              {dept.description}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex px-2 py-0.5 text-xs font-mono font-medium bg-slate-100 text-slate-700 rounded">
                            {dept.departmentCode}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {dept.establishedYear || 'N/A'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          <div className="space-y-0.5">
                            {dept.contactEmail && (
                              <div className="flex items-center gap-1.5 truncate max-w-xs">
                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                {dept.contactEmail}
                              </div>
                            )}
                            {dept.contactPhone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                {dept.contactPhone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${dept.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${dept.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {dept.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-2">
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
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                      Page {Math.floor(filters.skip / filters.limit) + 1} of {pagination.pages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlePageChange(Math.max(0, filters.skip - filters.limit))}
                        disabled={filters.skip === 0}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft size={14} />
                        Previous
                      </Button>
                      <Button
                        onClick={() => handlePageChange(filters.skip + filters.limit)}
                        disabled={filters.skip + filters.limit >= pagination.total}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-14 text-center">
              <Inbox className="h-9 w-9 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-sm font-medium mb-1">No departments found</p>
              <p className="text-sm text-slate-400">Try adjusting your search filters or add a new department</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;