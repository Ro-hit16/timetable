import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import subjectService from '../../services/subjectService';
import departmentService from '../../services/departmentService.js';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    teacher: '',
    type: '',
    isActive: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    subjectName: '',
    subject_code: '',
    sem_id: '',
    department_id: '',
    teacher_id: '',
    lecturePerWeek: 1,
    type: 'theory',
    credits: 3,
    syllabus: '',
    isActive: true
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getAllSubjects();
      if (response.success && response.data) {
        const subjectsArray = Array.isArray(response.data)
          ? response.data
          : response.data.subjects || [];
        setSubjects(subjectsArray);
      } else {
        setSubjects([]);
        toast.error('Failed to fetch subjects');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
      toast.error('Error fetching subjects');
    } finally {
      setLoading(false);
    }
  };




  const fetchDepartments = async () => {
    try {
      const rawDepartments = await departmentService.getDepartmentsForSelect();

      setDepartments(rawDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
  };


  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`);
      const data = await response.json();
      if (data.success) {
        setTeachers(Array.isArray(data.data) ? data.data : data.data.teachers || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.subjectName.trim()) {
      errors.subjectName = 'Subject name is required';
    } else if (formData.subjectName.length > 100) {
      errors.subjectName = 'Subject name cannot exceed 100 characters';
    }

    if (!formData.subject_code.trim()) {
      errors.subject_code = 'Subject code is required';
    }

    if (!formData.sem_id) {
      errors.sem_id = 'Semester is required';
    }

    if (!formData.department_id) {
      errors.department_id = 'Department is required';
    }

    if (!formData.teacher_id) {
      errors.teacher_id = 'Teacher is required';
    }

    if (!formData.lecturePerWeek || formData.lecturePerWeek < 1 || formData.lecturePerWeek > 20) {
      errors.lecturePerWeek = 'Lectures per week must be between 1 and 20';
    }

    if (!formData.type) {
      errors.type = 'Subject type is required';
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 10) {
      errors.credits = 'Credits must be between 1 and 10';
    }

    if (formData.syllabus && formData.syllabus.length > 2000) {
      errors.syllabus = 'Syllabus cannot exceed 2000 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      subjectName: '',
      subject_code: '',
      sem_id: '',
      department_id: '',
      teacher_id: '',
      lecturePerWeek: 1,
      type: 'theory',
      credits: 3,
      syllabus: '',
      isActive: true
    });
    setFormErrors({});
    setIsEditing(false);
    setSelectedSubject(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await subjectService.updateSubject(selectedSubject._id, formData);
      } else {
        response = await subjectService.createSubject(formData);
      }

      if (response.success) {
        toast.success(isEditing ? 'Subject updated successfully' : 'Subject created successfully');
        setShowModal(false);
        resetForm();
        fetchSubjects();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred while saving');
    }
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      subjectName: subject.subjectName || '',
      subject_code: subject.subject_code || '',
      sem_id: subject.sem_id?._id || subject.sem_id || '',
      department_id: subject.department_id?._id || subject.department_id || '',
      teacher_id: subject.teacher_id?._id || subject.teacher_id || '',
      lecturePerWeek: subject.lecturePerWeek || 1,
      type: subject.type || 'theory',
      credits: subject.credits || 3,
      syllabus: subject.syllabus || '',
      isActive: subject.isActive !== undefined ? subject.isActive : true
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (subject) => {
    setSelectedSubject(subject);
    setShowViewModal(true);
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        const response = await subjectService.deleteSubject(subjectId);
        if (response.success) {
          toast.success('Subject deleted successfully');
          fetchSubjects();
        } else {
          toast.error('Failed to delete subject');
        }
      } catch (error) {
        console.error('Error deleting subject:', error);
        toast.error('Error deleting subject');
      }
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch =
      subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subject_code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !filters.department ||
      (subject.department_id?._id === filters.department || subject.department_id === filters.department);

    const matchesSemester = !filters.semester ||
      (subject.sem_id?._id === filters.semester || subject.sem_id === filters.semester);

    const matchesTeacher = !filters.teacher ||
      (subject.teacher_id?._id === filters.teacher || subject.teacher_id === filters.teacher);

    const matchesType = !filters.type || subject.type === filters.type;

    const matchesActive = filters.isActive === '' ||
      subject.isActive.toString() === filters.isActive;

    return matchesSearch && matchesDepartment && matchesSemester &&
      matchesTeacher && matchesType && matchesActive;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Academic Setup
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">Subjects</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage subjects, assigned teachers, and curriculum details.
          </p>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50">
              <BookOpenIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Subjects</p>
              <p className="text-2xl font-semibold text-slate-900">{subjects.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <AcademicCapIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Teachers</p>
              <p className="text-2xl font-semibold text-slate-900">{teachers.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50">
              <BuildingOffice2Icon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Departments</p>
              <p className="text-2xl font-semibold text-slate-900">{departments.length}</p>
            </div>
          </div>
        </div>

        {/* Toolbar: add + search + filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition shrink-0"
            >
              <PlusIcon className="h-4 w-4" />
              Add Subject
            </button>

            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>
          </div>

          {/*
            Restored the existing filter controls (previously commented out).
            Every onChange handler below is unchanged from the original file —
            this simply gives the already-wired `filters` state a visible UI.
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
                <BuildingOffice2Icon className="h-3.5 w-3.5" /> Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id || dept.value} value={dept._id || dept.value}>
                    {dept.departmentName || dept.label || dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              >
                <option value="">All Semesters</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>
                    Semester {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Teacher</label>
              <select
                value={filters.teacher}
                onChange={(e) => setFilters(prev => ({ ...prev, teacher: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              >
                <option value="">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              >
                <option value="">All Types</option>
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select
                value={filters.isActive}
                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => setFilters({ department: '', semester: '', teacher: '', type: '', isActive: '' })}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <FunnelIcon className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Subject Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800">
                        {subject.subjectName}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Code: {subject.subject_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {subject.department_id?.departmentName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        {subject.sem_id ? `Semester ${subject.sem_id}` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {subject.teacher_id?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-500 space-y-0.5">
                        <div>Type: <span className="capitalize font-medium text-slate-700">{subject.type}</span></div>
                        <div>Credits: {subject.credits}</div>
                        <div>Lectures/Week: {subject.lecturePerWeek}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${subject.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${subject.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {subject.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(subject)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                          title="View"
                        >
                          <EyeIcon className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(subject)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition"
                          title="Edit"
                        >
                          <PencilIcon className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSubjects.length === 0 && (
            <div className="text-center py-16">
              <BookOpenIcon className="h-9 w-9 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-sm font-medium">No subjects found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] overflow-y-auto h-full w-full z-50">
            <div className="relative top-16 mx-auto p-6 border border-slate-200 w-11/12 md:w-3/4 lg:w-1/2 shadow-xl rounded-xl bg-white">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  {isEditing ? 'Edit Subject' : 'Add New Subject'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="h-5.5 w-5.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.subjectName ? 'border-red-400' : 'border-slate-200'
                        }`}
                      placeholder="Enter subject name"
                    />
                    {formErrors.subjectName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.subjectName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      name="subject_code"
                      value={formData.subject_code}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.subject_code ? 'border-red-400' : 'border-slate-200'
                        }`}
                      placeholder="Enter subject code"
                    />
                    {formErrors.subject_code && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.subject_code}</p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleInputChange}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.department_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                    {formErrors.department_id && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.department_id}</p>
                    )}
                  </div> */}

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Department *
                    </label>
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.department_id ? 'border-red-400' : 'border-slate-200'
                        }`}
                    >
                      <option value="">Select Department</option>
                      {departments.length > 0 ? (
                        departments.map((dep) => (
                          <option key={dep.value} value={dep.value}>
                            {dep.label}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading...</option>
                      )}
                    </select>
                    {formErrors.department_id && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.department_id}</p>
                    )}
                  </div>




                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Semester *
                    </label>
                    <select
                      name="sem_id"
                      value={formData.sem_id}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.sem_id ? 'border-red-400' : 'border-slate-200'
                        }`}
                    >
                      <option value="">Select Semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={(i + 1).toString()}>
                          Semester {i + 1}
                        </option>
                      ))}
                    </select>
                    {formErrors.sem_id && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.sem_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Teacher *
                    </label>
                    <select
                      name="teacher_id"
                      value={formData.teacher_id}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.teacher_id ? 'border-red-400' : 'border-slate-200'
                        }`}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.teacher_id && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.teacher_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Subject Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.type ? 'border-red-400' : 'border-slate-200'
                        }`}
                    >
                      <option value="theory">Theory</option>
                      <option value="practical">Practical</option>
                      <option value="tutorial">Tutorial</option>
                    </select>
                    {formErrors.type && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Lectures Per Week *
                    </label>
                    <input
                      type="number"
                      name="lecturePerWeek"
                      value={formData.lecturePerWeek}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.lecturePerWeek ? 'border-red-400' : 'border-slate-200'
                        }`}
                    />
                    {formErrors.lecturePerWeek && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.lecturePerWeek}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Credits *
                    </label>
                    <input
                      type="number"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.credits ? 'border-red-400' : 'border-slate-200'
                        }`}
                    />
                    {formErrors.credits && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.credits}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Syllabus
                  </label>
                  <textarea
                    name="syllabus"
                    value={formData.syllabus}
                    onChange={handleInputChange}
                    rows="4"
                    maxLength="2000"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 ${formErrors.syllabus ? 'border-red-400' : 'border-slate-200'
                      }`}
                    placeholder="Enter syllabus details..."
                  />
                  <div className="text-xs text-slate-400 mt-1">
                    {formData.syllabus.length}/2000 characters
                  </div>
                  {formErrors.syllabus && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.syllabus}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-400 border-slate-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-slate-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedSubject && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] overflow-y-auto h-full w-full z-50">
            <div className="relative top-16 mx-auto p-6 border border-slate-200 w-11/12 md:w-3/4 lg:w-1/2 shadow-xl rounded-xl bg-white">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-slate-900">Subject Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="h-5.5 w-5.5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Subject Name</label>
                    <p className="text-slate-800 mt-0.5">{selectedSubject.subjectName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Subject Code</label>
                    <p className="text-slate-800 mt-0.5">{selectedSubject.subject_code}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Department</label>
                    <p className="text-slate-800 mt-0.5">{selectedSubject.department_id?.departmentName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Semester</label>
                    <p className="text-slate-800 mt-0.5">{selectedSubject.sem_id ? `Semester ${selectedSubject.sem_id}` : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Teacher</label>
                    <p className="text-slate-800 mt-0.5">{selectedSubject.teacher_id?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Type</label>
                    <p className="text-slate-800 capitalize mt-0.5">{selectedSubject.type}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Lectures Per Week</label>
                    <p className="text-slate-800 mt-0.5">{selectedSubject.lecturePerWeek}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Credits</label>
                    <p className="text-slate-800 mt-0.5">{selectedSubject.credits}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Status</label>
                    <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${selectedSubject.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                      }`}>
                      {selectedSubject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {selectedSubject.syllabus && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">Syllabus</label>
                    <p className="text-slate-700 mt-1 whitespace-pre-wrap text-sm leading-relaxed">{selectedSubject.syllabus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;