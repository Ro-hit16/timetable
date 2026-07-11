import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Search,
  Filter,
  Edit3,
  UserPlus,
  FileText,
  Users,
  BookOpen,
  Building2
} from 'lucide-react';

import departmentService from '../../services/departmentService.js';
import teacherService from '../../services/teacherService.js';

import DataTable from '../../components/Common/DataTable.js';
import LoadingSpinner from '../../components/Common/LoadingSpinner.js';

const Teachers = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const manualSemesters = Array.from({ length: 8 }, (_, i) => ({
    _id: (i + 1).toString(),
    semesterName: `Semester ${i + 1}`
  }));

  const fetchDepartments = async () => {
    try {
      const formattedDepartments = await departmentService.getDepartmentsForSelect();
      setDepartments(formattedDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const teachersData = await teacherService.getAllTeachers();
      const formattedTeachers = teachersData.map(teacher => ({
        id: teacher._id,
        name: teacher.name,
        email: teacher.email || 'N/A',
        // Backend populates department with `departmentName` (see
        // teachers.controller.js: .populate('department', 'departmentName')),
        // not `name`. Reading `.name` always produced undefined -> 'N/A'.
        department: teacher.department?.departmentName || 'N/A',
        semester: `Semester ${teacher.semester}`,
        actions: (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditTeacher(teacher._id)}
              className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
              title="Edit teacher"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDeleteTeacher(teacher._id)}
              className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
              title="Delete teacher"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )
      }));
      setTeachers(formattedTeachers);
      setFilteredTeachers(formattedTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter teachers based on search term
    if (searchTerm) {
      const filtered = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [searchTerm, teachers]);

  const handleEditTeacher = (teacherId) => {
    // Placeholder for edit functionality
    toast.info('Edit functionality will be implemented here');
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) {
      return;
    }

    setLoading(true);
    try {
      await teacherService.deleteTeacher(teacherId);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error(error.message || 'Failed to delete teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllTeachers = async () => {
    if (teachers.length === 0) {
      toast.info('No teachers to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ALL ${teachers.length} teachers? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const deletePromises = teachers.map(teacher => teacherService.deleteTeacher(teacher.id));
      await Promise.all(deletePromises);
      toast.success(`Successfully deleted all ${teachers.length} teachers`);
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting all teachers:', error);
      toast.error('Failed to delete all teachers. Some teachers may have been deleted.');
      fetchTeachers();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !selectedDepartment || !selectedSemester) {
      toast.warn('Please fill all fields');
      return;
    }

    if (!validateEmail(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const teacherData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        department: selectedDepartment,
        semester: parseInt(selectedSemester, 10)
      };

      const result = await teacherService.createTeacher(teacherData);

      toast.success('✅ Teacher added successfully');
      setFormData({ name: '', email: '' });
      setSelectedDepartment('');
      setSelectedSemester('');

      fetchTeachers();
    } catch (error) {
      console.error('❌ Error adding teacher:', error);
      let errorMessage = 'Failed to add teacher';

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;

        if (
          errorMessage.toLowerCase().includes('duplicate') &&
          errorMessage.toLowerCase().includes('email')
        ) {
          errorMessage = 'This email is already registered. Please use a different email.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPdf = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.warn('Please select a PDF file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      await teacherService.uploadTeachersPdf(formData);

      toast.success('📄 Teachers uploaded from PDF successfully');
      setPdfFile(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error uploading teachers PDF:', error);
      toast.error('Failed to upload teachers from PDF');
    } finally {
      setUploading(false);
    }
  };

  // DataTable (components/Common/DataTable.js) reads `col.key` and
  // `col.label` (it renders `{col.label}` in the header and `row[col.key]`
  // in each cell). This array previously used react-table-style
  // `{ Header, accessor }` keys, which DataTable does not read at all -
  // every header rendered blank and every cell rendered `row[undefined]`
  // (blank), even though `filteredTeachers` contained valid data. This is
  // why the Teachers page appeared to show teachers as an empty/blank table.
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'semester', label: 'Semester' },
    { key: 'actions', label: 'Actions' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Teachers Management</h1>
            <p className="text-gray-600 mt-2">Manage all faculty members and their details</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              <Users className="inline mr-2" size={18} />
              View Teachers
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              <UserPlus className="inline mr-2" size={18} />
              Add Teacher
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900">{teachers.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Semesters</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PDF Uploads</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* PDF Upload Section */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="mr-2" size={20} />
            Bulk Upload Teachers
          </h3>
          <p className="text-gray-600 mb-4">Upload a PDF file containing teacher information for bulk processing</p>
          
          <form onSubmit={handleUploadPdf} className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                disabled={uploading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center font-medium"
              disabled={uploading || !pdfFile}
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Upload PDF
                </>
              )}
            </button>
          </form>
        </div>

        {/* Add Teacher Form */}
        {activeTab === 'add' && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <UserPlus className="mr-2" size={20} />
              Add New Teacher
            </h3>
            
            <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter teacher name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Department *</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Semester *</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">Select Semester</option>
                  {manualSemesters.map(sem => (
                    <option key={sem._id} value={sem._id}>{sem.semesterName}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 font-medium flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Add Teacher
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teachers List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">
              <Users className="inline mr-2" size={20} />
              Teachers List ({filteredTeachers.length})
            </h3>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {filteredTeachers.length > 0 && (
                <button
                  onClick={handleDeleteAllTeachers}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 disabled:bg-gray-200 transition-colors duration-200 font-medium flex items-center"
                  disabled={loading}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete All
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" text="Loading teachers..." />
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No teachers found</p>
                <p className="text-gray-400 mt-2">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first teacher'}
                </p>
              </div>
            ) : (
              <DataTable data={filteredTeachers} columns={columns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teachers;