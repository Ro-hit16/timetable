
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import subjectService from '../../services/subjectService';
import departmentService from '../../services/departmentService.js';

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
      const response = await fetch('/api/teachers');
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Summary Card */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Subjects</h3>
            <p className="text-2xl">{subjects.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Teachers</h3>
            <p className="text-2xl">{teachers.length}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold">Departments</h3>
            <p className="text-2xl">{departments.length}</p>
          </div>
        </div>
      </div>

      {/* Add Subject Button */}
      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 mb-4"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add Subject</span>
      </button>

      {/* Filters and Search */}
      {/* <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select
              value={filters.teacher}
              onChange={(e) => setFilters(prev => ({ ...prev, teacher: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="theory">Theory</option>
              <option value="practical">Practical</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setFilters({ department: '', semester: '', teacher: '', type: '', isActive: '' })}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Clear Filters
        </button>
      </div> */}

      {/* Subjects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubjects.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {subject.subjectName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Code: {subject.subject_code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.department_id?.departmentName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.sem_id ? `Semester ${subject.sem_id}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.teacher_id?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Type: <span className="capitalize">{subject.type}</span></div>
                      <div>Credits: {subject.credits}</div>
                      <div>Lectures/Week: {subject.lecturePerWeek}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subject.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(subject)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(subject)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No subjects found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.subjectName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter subject name"
                  />
                  {formErrors.subjectName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.subjectName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    name="subject_code"
                    value={formData.subject_code}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.subject_code ? 'border-red-500' : 'border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.department_id ? 'border-red-500' : 'border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester *
                  </label>
                  <select
                    name="sem_id"
                    value={formData.sem_id}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.sem_id ? 'border-red-500' : 'border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher *
                  </label>
                  <select
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.teacher_id ? 'border-red-500' : 'border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.type ? 'border-red-500' : 'border-gray-300'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lectures Per Week *
                  </label>
                  <input
                    type="number"
                    name="lecturePerWeek"
                    value={formData.lecturePerWeek}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.lecturePerWeek ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {formErrors.lecturePerWeek && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.lecturePerWeek}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credits *
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.credits ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {formErrors.credits && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.credits}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Syllabus
                </label>
                <textarea
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  rows="4"
                  maxLength="2000"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.syllabus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter syllabus details..."
                />
                <div className="text-xs text-gray-500 mt-1">
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Subject Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Subject Name</label>
                  <p className="text-gray-900">{selectedSubject.subjectName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Subject Code</label>
                  <p className="text-gray-900">{selectedSubject.subject_code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-900">{selectedSubject.department_id?.departmentName || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Semester</label>
                  <p className="text-gray-900">{selectedSubject.sem_id ? `Semester ${selectedSubject.sem_id}` : 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Teacher</label>
                  <p className="text-gray-900">{selectedSubject.teacher_id?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900 capitalize">{selectedSubject.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Lectures Per Week</label>
                  <p className="text-gray-900">{selectedSubject.lecturePerWeek}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Credits</label>
                  <p className="text-gray-900">{selectedSubject.credits}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedSubject.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {selectedSubject.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {selectedSubject.syllabus && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Syllabus</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedSubject.syllabus}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
