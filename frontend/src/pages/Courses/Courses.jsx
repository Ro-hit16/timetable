// // import React, { useState, useEffect } from 'react';
// // import { Plus, Edit, Trash2, Eye, Search, Filter, BookOpen } from 'lucide-react';
// // import { toast } from 'react-toastify';
// // import courseService from '../../services/courseService';
// // import departmentService from '../../services/departmentService';
// // import { semesterService } from '../../services/semesterService';
// // import DataTable from '../../components/Common/DataTable';
// // import Modal from '../../components/Common/Modal';
// // import LoadingSpinner from '../../components/Common/LoadingSpinner';

// // const Courses = () => {
// //   const [courses, setCourses] = useState([]);
// //   const [departments, setDepartments] = useState([]);
// //   const [semesters, setSemesters] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [editingCourse, setEditingCourse] = useState(null);
// //   const [viewingCourse, setViewingCourse] = useState(null);
// //   const [filters, setFilters] = useState({
// //     search: '',
// //     department: '',
// //     semester: '',
// //     type: ''
// //   });
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     code: '',
// //     credits: '',
// //     type: 'core',
// //     department: '',
// //     semester: '',
// //     description: ''
// //   });

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);
// //       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
// //         courseService.getAllCourses(),
// //         departmentService.getAllDepartments(),
// //         semesterService.getAllSemesters()
// //       ]);
      
// //       setCourses(coursesRes.data.data || coursesRes.data);
// //       setDepartments(departmentsRes.data.data || departmentsRes.data);
// //       setSemesters(semestersRes.data.data || semestersRes.data);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //       toast.error('Failed to load courses data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleFilterChange = (e) => {
// //     const { name, value } = e.target;
// //     setFilters(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       name: '',
// //       code: '',
// //       credits: '',
// //       type: 'core',
// //       department: '',
// //       semester: '',
// //       description: ''
// //     });
// //     setEditingCourse(null);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       if (editingCourse) {
// //         await courseService.updateCourse(editingCourse._id, formData);
// //         toast.success('Course updated successfully');
// //       } else {
// //         await courseService.createCourse(formData);
// //         toast.success('Course created successfully');
// //       }
      
// //       setModalOpen(false);
// //       resetForm();
// //       fetchData();
// //     } catch (error) {
// //       console.error('Error saving course:', error);
// //       toast.error(editingCourse ? 'Failed to update course' : 'Failed to create course');
// //     }
// //   };

// //   const handleEdit = (course) => {
// //     setEditingCourse(course);
// //     setFormData({
// //       name: course.name,
// //       code: course.code,
// //       credits: course.credits?.toString() || '',
// //       type: course.type || 'core',
// //       department: course.department?._id || course.department || '',
// //       semester: course.semester?._id || course.semester || '',
// //       description: course.description || ''
// //     });
// //     setModalOpen(true);
// //   };

// //   const handleDelete = async (courseId) => {
// //     if (!window.confirm('Are you sure you want to delete this course?')) return;
    
// //     try {
// //       await courseService.deleteCourse(courseId);
// //       toast.success('Course deleted successfully');
// //       fetchData();
// //     } catch (error) {
// //       console.error('Error deleting course:', error);
// //       toast.error('Failed to delete course');
// //     }
// //   };

// //   const handleView = (course) => {
// //     setViewingCourse(course);
// //   };

// //   const filteredCourses = courses.filter(course => {
// //     const matchesSearch = !filters.search || 
// //       course.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
// //       course.code?.toLowerCase().includes(filters.search.toLowerCase());
    
// //     const matchesDepartment = !filters.department || 
// //       (course.department?._id || course.department) === filters.department;
    
// //     const matchesSemester = !filters.semester || 
// //       (course.semester?._id || course.semester) === filters.semester;
    
// //     const matchesType = !filters.type || course.type === filters.type;
    
// //     return matchesSearch && matchesDepartment && matchesSemester && matchesType;
// //   });

// //   const columns = [
// //     {
// //       header: 'Course Code',
// //       accessor: 'code',
// //       render: (value) => (
// //         <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
// //           {value}
// //         </span>
// //       )
// //     },
// //     {
// //       header: 'Course Name',
// //       accessor: 'name',
// //       render: (value) => (
// //         <span className="font-medium text-gray-900">{value}</span>
// //       )
// //     },
// //     {
// //       header: 'Department',
// //       accessor: 'department',
// //       render: (value) => value?.name || value || 'N/A'
// //     },
// //     {
// //       header: 'Semester',
// //       accessor: 'semester',
// //       render: (value) => value?.name || value || 'N/A'
// //     },
// //     {
// //       header: 'Credits',
// //       accessor: 'credits',
// //       render: (value) => (
// //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
// //           {value} Credits
// //         </span>
// //       )
// //     },
// //     {
// //       header: 'Type',
// //       accessor: 'type',
// //       render: (value) => {
// //         const colors = {
// //           core: 'bg-green-100 text-green-800',
// //           elective: 'bg-yellow-100 text-yellow-800',
// //           practical: 'bg-purple-100 text-purple-800'
// //         };
// //         return (
// //           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
// //             {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
// //           </span>
// //         );
// //       }
// //     },
// //     {
// //       header: 'Actions',
// //       accessor: '_id',
// //       render: (value, row) => (
// //         <div className="flex items-center space-x-2">
// //           <button
// //             onClick={() => handleView(row)}
// //             className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
// //             title="View Details"
// //           >
// //             <Eye className="h-4 w-4" />
// //           </button>
// //           <button
// //             onClick={() => handleEdit(row)}
// //             className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
// //             title="Edit Course"
// //           >
// //             <Edit className="h-4 w-4" />
// //           </button>
// //           <button
// //             onClick={() => handleDelete(value)}
// //             className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
// //             title="Delete Course"
// //           >
// //             <Trash2 className="h-4 w-4" />
// //           </button>
// //         </div>
// //       )
// //     }
// //   ];

// //   if (loading) {
// //     return <LoadingSpinner size="large" text="Loading courses..." />;
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
// //           <p className="text-gray-600 mt-1">Manage course information and curriculum</p>
// //         </div>
// //         <button
// //           onClick={() => {
// //             resetForm();
// //             setModalOpen(true);
// //           }}
// //           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
// //         >
// //           <Plus className="h-4 w-4" />
// //           <span>Add Course</span>
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
// //             <input
// //               type="text"
// //               name="search"
// //               placeholder="Search courses..."
// //               value={filters.search}
// //               onChange={handleFilterChange}
// //               className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             />
// //           </div>
          
// //           <select
// //             name="department"
// //             value={filters.department}
// //             onChange={handleFilterChange}
// //             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           >
// //             <option value="">All Departments</option>
// //             {departments.map(dept => (
// //               <option key={dept._id} value={dept._id}>
// //                 {dept.name}
// //               </option>
// //             ))}
// //           </select>

// //           <select
// //             name="semester"
// //             value={filters.semester}
// //             onChange={handleFilterChange}
// //             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           >
// //             <option value="">All Semesters</option>
// //             {semesters.map(sem => (
// //               <option key={sem._id} value={sem._id}>
// //                 {sem.name}
// //               </option>
// //             ))}
// //           </select>

// //           <select
// //             name="type"
// //             value={filters.type}
// //             onChange={handleFilterChange}
// //             className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           >
// //             <option value="">All Types</option>
// //             <option value="core">Core</option>
// //             <option value="elective">Elective</option>
// //             <option value="practical">Practical</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Courses Table */}
// //       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //         <DataTable
// //           data={filteredCourses}
// //           columns={columns}
// //           searchable={false}
// //           pagination={true}
// //           itemsPerPage={10}
// //         />
// //       </div>

// //       {/* Add/Edit Course Modal */}
// //       <Modal
// //         isOpen={modalOpen}
// //         onClose={() => {
// //           setModalOpen(false);
// //           resetForm();
// //         }}
// //         title={editingCourse ? 'Edit Course' : 'Add New Course'}
// //         size="large"
// //       >
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Course Name *
// //               </label>
// //               <input
// //                 type="text"
// //                 name="name"
// //                 value={formData.name}
// //                 onChange={handleInputChange}
// //                 required
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 placeholder="Enter course name"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Course Code *
// //               </label>
// //               <input
// //                 type="text"
// //                 name="code"
// //                 value={formData.code}
// //                 onChange={handleInputChange}
// //                 required
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 placeholder="e.g., CS101"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Credits *
// //               </label>
// //               <input
// //                 type="number"
// //                 name="credits"
// //                 value={formData.credits}
// //                 onChange={handleInputChange}
// //                 required
// //                 min="1"
// //                 max="10"
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 placeholder="Enter credits"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Course Type *
// //               </label>
// //               <select
// //                 name="type"
// //                 value={formData.type}
// //                 onChange={handleInputChange}
// //                 required
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option value="core">Core</option>
// //                 <option value="elective">Elective</option>
// //                 <option value="practical">Practical</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Department *
// //               </label>
// //               <select
// //                 name="department"
// //                 value={formData.department}
// //                 onChange={handleInputChange}
// //                 required
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option value="">Select Department</option>
// //                 {departments.map(dept => (
// //                   <option key={dept._id} value={dept._id}>
// //                     {dept.name}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Semester *
// //               </label>
// //               <select
// //                 name="semester"
// //                 value={formData.semester}
// //                 onChange={handleInputChange}
// //                 required
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option value="">Select Semester</option>
// //                 {semesters.map(sem => (
// //                   <option key={sem._id} value={sem._id}>
// //                     {sem.name}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Description
// //             </label>
// //             <textarea
// //               name="description"
// //               value={formData.description}
// //               onChange={handleInputChange}
// //               rows={3}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               placeholder="Enter course description (optional)"
// //             />
// //           </div>

// //           <div className="flex justify-end space-x-3 pt-4">
// //             <button
// //               type="button"
// //               onClick={() => {
// //                 setModalOpen(false);
// //                 resetForm();
// //               }}
// //               className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
// //             >
// //               {editingCourse ? 'Update Course' : 'Create Course'}
// //             </button>
// //           </div>
// //         </form>
// //       </Modal>

// //       {/* View Course Modal */}
// //       {viewingCourse && (
// //         <Modal
// //           isOpen={!!viewingCourse}
// //           onClose={() => setViewingCourse(null)}
// //           title="Course Details"
// //           size="medium"
// //         >
// //           <div className="space-y-4">
// //             <div className="flex items-center space-x-3">
// //               <BookOpen className="h-8 w-8 text-blue-600" />
// //               <div>
// //                 <h3 className="text-lg font-semibold text-gray-900">{viewingCourse.name}</h3>
// //                 <p className="text-sm text-gray-600">{viewingCourse.code}</p>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <p className="text-sm font-medium text-gray-500">Department</p>
// //                 <p className="text-gray-900">{viewingCourse.department?.name || 'N/A'}</p>
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-gray-500">Semester</p>
// //                 <p className="text-gray-900">{viewingCourse.semester?.name || 'N/A'}</p>
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-gray-500">Credits</p>
// //                 <p className="text-gray-900">{viewingCourse.credits}</p>
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-gray-500">Type</p>
// //                 <p className="text-gray-900">{viewingCourse.type?.charAt(0).toUpperCase() + viewingCourse.type?.slice(1)}</p>
// //               </div>
// //             </div>

// //             {viewingCourse.description && (
// //               <div>
// //                 <p className="text-sm font-medium text-gray-500">Description</p>
// //                 <p className="text-gray-900 mt-1">{viewingCourse.description}</p>
// //               </div>
// //             )}
// //           </div>
// //         </Modal>
// //       )}
// //     </div>
// //   );
// // };

// // export default Courses;


// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     department: '',
//     semester: '',
//     type: ''
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       // Defensive check: coursesRes.data may be an array or an object with .data
//       const coursesData = Array.isArray(coursesRes.data) 
//         ? coursesRes.data 
//         : coursesRes.data?.data || [];

//       const departmentsData = Array.isArray(departmentsRes.data)
//         ? departmentsRes.data
//         : departmentsRes.data?.data || [];

//       const semestersData = Array.isArray(semestersRes.data)
//         ? semestersRes.data
//         : semestersRes.data?.data || [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load courses data');
//       setCourses([]);  // reset to empty on failure
//       setDepartments([]);
//       setSemesters([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       code: '',
//       credits: '',
//       type: 'core',
//       department: '',
//       semester: '',
//       description: ''
//     });
//     setEditingCourse(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, formData);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(formData);
//         toast.success('Course created successfully');
//       }
      
//       setModalOpen(false);
//       resetForm();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving course:', error);
//       toast.error(editingCourse ? 'Failed to update course' : 'Failed to create course');
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course.name,
//       code: course.code,
//       credits: course.credits?.toString() || '',
//       type: course.type || 'core',
//       department: course.department?._id || course.department || '',
//       semester: course.semester?._id || course.semester || '',
//       description: course.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleDelete = async (courseId) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
    
//     try {
//       await courseService.deleteCourse(courseId);
//       toast.success('Course deleted successfully');
//       fetchData();
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   // Defensive: Ensure courses is an array before filtering
//   const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
//     const matchesSearch = !filters.search || 
//       course.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
//       course.code?.toLowerCase().includes(filters.search.toLowerCase());
    
//     const matchesDepartment = !filters.department || 
//       (course.department?._id || course.department) === filters.department;
    
//     const matchesSemester = !filters.semester || 
//       (course.semester?._id || course.semester) === filters.semester;
    
//     const matchesType = !filters.type || course.type === filters.type;
    
//     return matchesSearch && matchesDepartment && matchesSemester && matchesType;
//   }) : [];

//   const columns = [
//     {
//       header: 'Course Code',
//       accessor: 'code',
//       render: (value) => (
//         <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//           {value}
//         </span>
//       )
//     },
//     {
//       header: 'Course Name',
//       accessor: 'name',
//       render: (value) => (
//         <span className="font-medium text-gray-900">{value}</span>
//       )
//     },
//     {
//       header: 'Department',
//       accessor: 'department',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Semester',
//       accessor: 'semester',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Credits',
//       accessor: 'credits',
//       render: (value) => (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//           {value} Credits
//         </span>
//       )
//     },
//     {
//       header: 'Type',
//       accessor: 'type',
//       render: (value) => {
//         const colors = {
//           core: 'bg-green-100 text-green-800',
//           elective: 'bg-yellow-100 text-yellow-800',
//           practical: 'bg-purple-100 text-purple-800'
//         };
//         return (
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
//             {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
//           </span>
//         );
//       }
//     },
//     {
//       header: 'Actions',
//       accessor: '_id',
//       render: (value, row) => (
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleView(row)}
//             className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
//             title="View Details"
//           >
//             <Eye className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleEdit(row)}
//             className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
//             title="Edit Course"
//           >
//             <Edit className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleDelete(value)}
//             className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
//             title="Delete Course"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       )
//     }
//   ];

//   if (loading) {
//     return <LoadingSpinner size="large" text="Loading courses..." />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
//           <p className="text-gray-600 mt-1">Manage course information and curriculum</p>
//         </div>
//         <button
//           onClick={() => {
//             resetForm();
//             setModalOpen(true);
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
//         >
//           <Plus className="h-4 w-4" />
//           <span>Add Course</span>
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <input
//             type="text"
//             name="search"
//             value={filters.search}
//             onChange={handleFilterChange}
//             placeholder="Search by name or code"
//             className="border border-gray-300 rounded px-3 py-2"
//           />
//           <select
//             name="department"
//             value={filters.department}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded px-3 py-2"
//           >
//             <option value="">All Departments</option>
//             {departments.map(dep => (
//               <option key={dep._id} value={dep._id}>
//                 {dep.name}
//               </option>
//             ))}
//           </select>
//           <select
//             name="semester"
//             value={filters.semester}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded px-3 py-2"
//           >
//             <option value="">All Semesters</option>
//             {semesters.map(sem => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.name}
//               </option>
//             ))}
//           </select>
//           <select
//             name="type"
//             value={filters.type}
//             onChange={handleFilterChange}
//             className="border border-gray-300 rounded px-3 py-2"
//           >
//             <option value="">All Types</option>
//             <option value="core">Core</option>
//             <option value="elective">Elective</option>
//             <option value="practical">Practical</option>
//           </select>
//         </div>
//       </div>

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={filteredCourses}
//         noDataText="No courses found."
//       />

//       {/* Modal for Add/Edit */}
//       {modalOpen && (
//         <Modal
//           title={editingCourse ? 'Edit Course' : 'Add Course'}
//           onClose={() => setModalOpen(false)}
//         >
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="name" className="block font-medium text-gray-700">
//                 Course Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="code" className="block font-medium text-gray-700">
//                 Course Code <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="code"
//                 name="code"
//                 type="text"
//                 value={formData.code}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
//               />
//             </div>
//             <div>
//               <label htmlFor="credits" className="block font-medium text-gray-700">
//                 Credits <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="credits"
//                 name="credits"
//                 type="number"
//                 min="0"
//                 value={formData.credits}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label htmlFor="type" className="block font-medium text-gray-700">
//                 Type <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="type"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               >
//                 <option value="core">Core</option>
//                 <option value="elective">Elective</option>
//                 <option value="practical">Practical</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="department" className="block font-medium text-gray-700">
//                 Department <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="department"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               >
//                 <option value="">Select Department</option>
//                 {departments.map(dep => (
//                   <option key={dep._id} value={dep._id}>
//                     {dep.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="semester" className="block font-medium text-gray-700">
//                 Semester <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="semester"
//                 name="semester"
//                 value={formData.semester}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               >
//                 <option value="">Select Semester</option>
//                 {semesters.map(sem => (
//                   <option key={sem._id} value={sem._id}>
//                     {sem.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="description" className="block font-medium text-gray-700">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 type="button"
//                 onClick={() => setModalOpen(false)}
//                 className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 {editingCourse ? 'Update' : 'Add'}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* View Course Modal */}
//       {viewingCourse && (
//         <Modal
//           title="Course Details"
//           onClose={() => setViewingCourse(null)}
//         >
//           <div className="space-y-3">
//             <p><strong>Course Code:</strong> {viewingCourse.code}</p>
//             <p><strong>Course Name:</strong> {viewingCourse.name}</p>
//             <p><strong>Department:</strong> {viewingCourse.department?.name || viewingCourse.department}</p>
//             <p><strong>Semester:</strong> {viewingCourse.semester?.name || viewingCourse.semester}</p>
//             <p><strong>Credits:</strong> {viewingCourse.credits}</p>
//             <p><strong>Type:</strong> {viewingCourse.type}</p>
//             <p><strong>Description:</strong> {viewingCourse.description || 'N/A'}</p>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;


// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     department: '',
//     semester: '',
//     type: ''
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       const coursesData = Array.isArray(coursesRes.data)
//         ? coursesRes.data
//         : coursesRes.data?.data || [];

//       const departmentsData = Array.isArray(departmentsRes.data)
//         ? departmentsRes.data
//         : departmentsRes.data?.data || [];

//       const semestersData = Array.isArray(semestersRes.data)
//         ? semestersRes.data
//         : semestersRes.data?.data || [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load courses data');
//       setCourses([]);
//       setDepartments([]);
//       setSemesters([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       code: '',
//       credits: '',
//       type: 'core',
//       department: '',
//       semester: '',
//       description: ''
//     });
//     setEditingCourse(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);

//     // Basic validation: you can enhance this or move to a separate validator
//     if (!formData.name.trim() || !formData.code.trim()) {
//       toast.error('Course name and code are required.');
//       setSubmitLoading(false);
//       return;
//     }
//     if (isNaN(Number(formData.credits)) || Number(formData.credits) < 0) {
//       toast.error('Credits must be a positive number.');
//       setSubmitLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         ...formData,
//         credits: Number(formData.credits),
//       };

//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, payload);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(payload);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       resetForm();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving course:', error);
//       toast.error(editingCourse ? 'Failed to update course' : 'Failed to create course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course.name || '',
//       code: course.code || '',
//       credits: course.credits?.toString() || '',
//       type: course.type || 'core',
//       department: course.department?._id || course.department || '',
//       semester: course.semester?._id || course.semester || '',
//       description: course.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleDelete = async (courseId) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;

//     try {
//       await courseService.deleteCourse(courseId);
//       toast.success('Course deleted successfully');
//       fetchData();
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const filteredCourses = Array.isArray(courses)
//     ? courses.filter(course => {
//       const searchLower = filters.search.toLowerCase();
//       const matchesSearch =
//         !filters.search ||
//         course.name?.toLowerCase().includes(searchLower) ||
//         course.code?.toLowerCase().includes(searchLower);

//       const matchesDepartment =
//         !filters.department ||
//         (course.department?._id || course.department) === filters.department;

//       const matchesSemester =
//         !filters.semester ||
//         (course.semester?._id || course.semester) === filters.semester;

//       const matchesType = !filters.type || course.type === filters.type;

//       return matchesSearch && matchesDepartment && matchesSemester && matchesType;
//     })
//     : [];

//   const columns = [
//     {
//       header: 'Course Code',
//       accessor: 'code',
//       render: (value) => (
//         <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//           {value}
//         </span>
//       )
//     },
//     {
//       header: 'Course Name',
//       accessor: 'name',
//       render: (value) => (
//         <span className="font-medium text-gray-900">{value}</span>
//       )
//     },
//     {
//       header: 'Department',
//       accessor: 'department',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Semester',
//       accessor: 'semester',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Credits',
//       accessor: 'credits',
//       render: (value) => (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//           {value} Credits
//         </span>
//       )
//     },
//     {
//       header: 'Type',
//       accessor: 'type',
//       render: (value) => {
//         const colors = {
//           core: 'bg-green-100 text-green-800',
//           elective: 'bg-yellow-100 text-yellow-800',
//           practical: 'bg-purple-100 text-purple-800'
//         };
//         return (
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
//             {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
//           </span>
//         );
//       }
//     },
//     {
//       header: 'Actions',
//       accessor: '_id',
//       render: (value, row) => (
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleView(row)}
//             aria-label="View Details"
//             className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
//           >
//             <Eye className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleEdit(row)}
//             aria-label="Edit Course"
//             className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
//           >
//             <Edit className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleDelete(value)}
//             aria-label="Delete Course"
//             className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       )
//     }
//   ];

//   if (loading) {
//     return <LoadingSpinner size="large" text="Loading courses..." />;
//   }

//   return (
//     <div className="p-4 space-y-4 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-2">
//         <h1 className="text-xl font-semibold">Courses</h1>
//         <button
//           onClick={() => {
//             resetForm();
//             setModalOpen(true);
//           }}
//           className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           <Plus className="h-5 w-5" />
//           Add Course
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//         <input
//           type="search"
//           name="search"
//           placeholder="Search by name or code"
//           value={filters.search}
//           onChange={handleFilterChange}
//           className="rounded border px-3 py-2"
//           aria-label="Search courses by name or code"
//         />
//         <select
//           name="department"
//           value={filters.department}
//           onChange={handleFilterChange}
//           className="rounded border px-3 py-2"
//           aria-label="Filter by department"
//         >
//           <option value="">All Departments</option>
//           {departments.map(dept => (
//             <option key={dept._id} value={dept._id}>
//               {dept.name}
//             </option>
//           ))}
//         </select>
//         <select
//           name="semester"
//           value={filters.semester}
//           onChange={handleFilterChange}
//           className="rounded border px-3 py-2"
//           aria-label="Filter by semester"
//         >
//           <option value="">All Semesters</option>
//           {semesters.map(sem => (
//             <option key={sem._id} value={sem._id}>
//               {sem.name}
//             </option>
//           ))}
//         </select>
//         <select
//           name="type"
//           value={filters.type}
//           onChange={handleFilterChange}
//           className="rounded border px-3 py-2"
//           aria-label="Filter by course type"
//         >
//           <option value="">All Types</option>
//           <option value="core">Core</option>
//           <option value="elective">Elective</option>
//           <option value="practical">Practical</option>
//         </select>
//       </div>

//       <DataTable columns={columns} data={filteredCourses} />

//       {/* Add/Edit Modal */}
//       {modalOpen && (
//         <Modal
//           title={editingCourse ? 'Edit Course' : 'Add Course'}
//           onClose={() => {
//             setModalOpen(false);
//             resetForm();
//           }}
//         >
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="name" className="block font-medium mb-1">
//                 Course Name
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full rounded border px-3 py-2"
//                 placeholder="Enter course name"
//               />
//             </div>
//             <div>
//               <label htmlFor="code" className="block font-medium mb-1">
//                 Course Code
//               </label>
//               <input
//                 id="code"
//                 name="code"
//                 type="text"
//                 value={formData.code}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full rounded border px-3 py-2"
//                 placeholder="Enter course code"
//               />
//             </div>
//             <div>
//               <label htmlFor="credits" className="block font-medium mb-1">
//                 Credits
//               </label>
//               <input
//                 id="credits"
//                 name="credits"
//                 type="number"
//                 min="0"
//                 step="0.5"
//                 value={formData.credits}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full rounded border px-3 py-2"
//                 placeholder="Enter number of credits"
//               />
//             </div>
//             <div>
//               <label htmlFor="type" className="block font-medium mb-1">
//                 Course Type
//               </label>
//               <select
//                 id="type"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="core">Core</option>
//                 <option value="elective">Elective</option>
//                 <option value="practical">Practical</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="department" className="block font-medium mb-1">
//                 Department
//               </label>
//               <select
//                 id="department"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="">Select Department</option>
//                 {departments.map(dept => (
//                   <option key={dept._id} value={dept._id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="semester" className="block font-medium mb-1">
//                 Semester
//               </label>
//               <select
//                 id="semester"
//                 name="semester"
//                 value={formData.semester}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="">Select Semester</option>
//                 {semesters.map(sem => (
//                   <option key={sem._id} value={sem._id}>
//                     {sem.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="description" className="block font-medium mb-1">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="w-full rounded border px-3 py-2"
//                 rows="3"
//                 placeholder="Optional course description"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setModalOpen(false);
//                   resetForm();
//                 }}
//                 className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
//                 disabled={submitLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
//                 disabled={submitLoading}
//               >
//                 {submitLoading ? 'Saving...' : editingCourse ? 'Update Course' : 'Add Course'}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* View Course Modal */}
//       {viewingCourse && (
//         <Modal
//           title="Course Details"
//           onClose={() => setViewingCourse(null)}
//         >
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {viewingCourse.name || 'N/A'}</p>
//             <p><strong>Code:</strong> {viewingCourse.code || 'N/A'}</p>
//             <p><strong>Credits:</strong> {viewingCourse.credits || 'N/A'}</p>
//             <p><strong>Type:</strong> {viewingCourse.type || 'N/A'}</p>
//             <p><strong>Department:</strong> {viewingCourse.department?.name || 'N/A'}</p>
//             <p><strong>Semester:</strong> {viewingCourse.semester?.name || 'N/A'}</p>
//             <p><strong>Description:</strong> {viewingCourse.description || 'No description provided.'}</p>
//           </div>
//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={() => setViewingCourse(null)}
//               className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
//             >
//               Close
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;


// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     department: '',
//     semester: '',
//     type: ''
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       const coursesData = Array.isArray(coursesRes.data)
//         ? coursesRes.data
//         : coursesRes.data?.data || [];

//       const departmentsData = Array.isArray(departmentsRes.data)
//         ? departmentsRes.data
//         : departmentsRes.data?.data || [];

//       const semestersData = Array.isArray(semestersRes.data)
//         ? semestersRes.data
//         : semestersRes.data?.data || [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load courses data');
//       setCourses([]);
//       setDepartments([]);
//       setSemesters([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       code: '',
//       credits: '',
//       type: 'core',
//       department: '',
//       semester: '',
//       description: ''
//     });
//     setEditingCourse(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);

//     if (!formData.name.trim() || !formData.code.trim()) {
//       toast.error('Course name and code are required.');
//       setSubmitLoading(false);
//       return;
//     }
//     if (isNaN(Number(formData.credits)) || Number(formData.credits) < 0) {
//       toast.error('Credits must be a positive number.');
//       setSubmitLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         ...formData,
//         credits: Number(formData.credits),
//       };

//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, payload);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(payload);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       resetForm();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving course:', error);
//       toast.error(editingCourse ? 'Failed to update course' : 'Failed to create course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course.name || '',
//       code: course.code || '',
//       credits: course.credits?.toString() || '',
//       type: course.type || 'core',
//       department: course.department?._id || course.department || '',
//       semester: course.semester?._id || course.semester || '',
//       description: course.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleDelete = async (courseId) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;

//     try {
//       await courseService.deleteCourse(courseId);
//       toast.success('Course deleted successfully');
//       fetchData();
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const filteredCourses = Array.isArray(courses)
//     ? courses.filter(course => {
//         const searchLower = filters.search.toLowerCase();
//         const matchesSearch =
//           !filters.search ||
//           course.name?.toLowerCase().includes(searchLower) ||
//           course.code?.toLowerCase().includes(searchLower);

//         const matchesDepartment =
//           !filters.department ||
//           (course.department?._id || course.department) === filters.department;

//         const matchesSemester =
//           !filters.semester ||
//           (course.semester?._id || course.semester) === filters.semester;

//         const matchesType = !filters.type || course.type === filters.type;

//         return matchesSearch && matchesDepartment && matchesSemester && matchesType;
//       })
//     : [];

//   const columns = [
//     {
//       header: 'Course Code',
//       accessor: 'code',
//       render: (value) => (
//         <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//           {value}
//         </span>
//       )
//     },
//     {
//       header: 'Course Name',
//       accessor: 'name',
//       render: (value) => (
//         <span className="font-medium text-gray-900">{value}</span>
//       )
//     },
//     {
//       header: 'Department',
//       accessor: 'department',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Semester',
//       accessor: 'semester',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Credits',
//       accessor: 'credits',
//       render: (value) => (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//           {value} Credits
//         </span>
//       )
//     },
//     {
//       header: 'Type',
//       accessor: 'type',
//       render: (value) => {
//         const colors = {
//           core: 'bg-green-100 text-green-800',
//           elective: 'bg-yellow-100 text-yellow-800',
//           practical: 'bg-purple-100 text-purple-800'
//         };
//         return (
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
//             {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
//           </span>
//         );
//       }
//     },
//     {
//       header: 'Actions',
//       accessor: '_id',
//       render: (value, row) => (
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleView(row)}
//             aria-label="View Details"
//             className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
//           >
//             <Eye className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleEdit(row)}
//             aria-label="Edit Course"
//             className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
//           >
//             <Edit className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleDelete(row._id)}
//             aria-label="Delete Course"
//             className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Courses</h2>
//         <button
//           onClick={() => {
//             resetForm();
//             setModalOpen(true);
//           }}
//           className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Course
//         </button>
//       </div>

//       {/* Filter Inputs */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//         <input
//           type="text"
//           name="search"
//           placeholder="Search..."
//           value={filters.search}
//           onChange={handleFilterChange}
//           className="border px-3 py-2 rounded w-full"
//         />
//         <select
//           name="department"
//           value={filters.department}
//           onChange={handleFilterChange}
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="">All Departments</option>
//           {departments.map(dep => (
//             <option key={dep._id} value={dep._id}>
//               {dep.name}
//             </option>
//           ))}
//         </select>
//         <select
//           name="semester"
//           value={filters.semester}
//           onChange={handleFilterChange}
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="">All Semesters</option>
//           {semesters.map(sem => (
//             <option key={sem._id} value={sem._id}>
//               {sem.name}
//             </option>
//           ))}
//         </select>
//         <select
//           name="type"
//           value={filters.type}
//           onChange={handleFilterChange}
//           className="border px-3 py-2 rounded w-full"
//         >
//           <option value="">All Types</option>
//           <option value="core">Core</option>
//           <option value="elective">Elective</option>
//           <option value="practical">Practical</option>
//         </select>
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={filteredCourses} columns={columns} />
//       )}

//       <Modal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editingCourse ? 'Edit Course' : 'Add Course'}
//       >
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Course Name" className="border px-3 py-2 rounded w-full" />
//           <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="Course Code" className="border px-3 py-2 rounded w-full" />
//           <input type="number" name="credits" value={formData.credits} onChange={handleInputChange} placeholder="Credits" className="border px-3 py-2 rounded w-full" />
//           <select name="type" value={formData.type} onChange={handleInputChange} className="border px-3 py-2 rounded w-full">
//             <option value="core">Core</option>
//             <option value="elective">Elective</option>
//             <option value="practical">Practical</option>
//           </select>
//           <select name="department" value={formData.department} onChange={handleInputChange} className="border px-3 py-2 rounded w-full">
//             <option value="">Select Department</option>
//             {departments.map(dep => (
//               <option key={dep._id} value={dep._id}>{dep.name}</option>
//             ))}
//           </select>
//           <select name="semester" value={formData.semester} onChange={handleInputChange} className="border px-3 py-2 rounded w-full">
//             <option value="">Select Semester</option>
//             {semesters.map(sem => (
//               <option key={sem._id} value={sem._id}>{sem.name}</option>
//             ))}
//           </select>
//           <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="border px-3 py-2 rounded w-full" />
//           <button type="submit" disabled={submitLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             {submitLoading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default Courses;


// // frontend/src/pages/Courses.jsx

// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     department: '',
//     semester: '',
//     type: ''
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       const coursesData = Array.isArray(coursesRes.data)
//         ? coursesRes.data
//         : coursesRes.data?.data || [];

//       const departmentsData = Array.isArray(departmentsRes.data)
//         ? departmentsRes.data
//         : departmentsRes.data?.data || [];

//       const semestersData = Array.isArray(semestersRes.data)
//         ? semestersRes.data
//         : semestersRes.data?.data || [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load courses data');
//       setCourses([]);
//       setDepartments([]);
//       setSemesters([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       code: '',
//       credits: '',
//       type: 'core',
//       department: '',
//       semester: '',
//       description: ''
//     });
//     setEditingCourse(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);

//     if (!formData.name.trim() || !formData.code.trim()) {
//       toast.error('Course name and code are required.');
//       setSubmitLoading(false);
//       return;
//     }
//     if (isNaN(Number(formData.credits)) || Number(formData.credits) < 0) {
//       toast.error('Credits must be a positive number.');
//       setSubmitLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         ...formData,
//         credits: Number(formData.credits),
//       };

//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, payload);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(payload);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       resetForm();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving course:', error);
//       toast.error(editingCourse ? 'Failed to update course' : 'Failed to create course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course.name || '',
//       code: course.code || '',
//       credits: course.credits?.toString() || '',
//       type: course.type || 'core',
//       department: course.department?._id || course.department || '',
//       semester: course.semester?._id || course.semester || '',
//       description: course.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleDelete = async (courseId) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;

//     try {
//       await courseService.deleteCourse(courseId);
//       toast.success('Course deleted successfully');
//       fetchData();
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const filteredCourses = Array.isArray(courses)
//     ? courses.filter(course => {
//         const searchLower = filters.search.toLowerCase();
//         const matchesSearch =
//           !filters.search ||
//           course.name?.toLowerCase().includes(searchLower) ||
//           course.code?.toLowerCase().includes(searchLower);

//         const matchesDepartment =
//           !filters.department ||
//           (course.department?._id || course.department) === filters.department;

//         const matchesSemester =
//           !filters.semester ||
//           (course.semester?._id || course.semester) === filters.semester;

//         const matchesType = !filters.type || course.type === filters.type;

//         return matchesSearch && matchesDepartment && matchesSemester && matchesType;
//       })
//     : [];

//   const columns = [
//     {
//       header: 'Course Code',
//       accessor: 'code',
//       render: (value) => (
//         <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//           {value}
//         </span>
//       )
//     },
//     {
//       header: 'Course Name',
//       accessor: 'name',
//       render: (value) => (
//         <span className="font-medium text-gray-900">{value}</span>
//       )
//     },
//     {
//       header: 'Department',
//       accessor: 'department',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Semester',
//       accessor: 'semester',
//       render: (value) => value?.name || value || 'N/A'
//     },
//     {
//       header: 'Credits',
//       accessor: 'credits',
//       render: (value) => (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//           {value} Credits
//         </span>
//       )
//     },
//     {
//       header: 'Type',
//       accessor: 'type',
//       render: (value) => {
//         const colors = {
//           core: 'bg-green-100 text-green-800',
//           elective: 'bg-yellow-100 text-yellow-800',
//           practical: 'bg-purple-100 text-purple-800'
//         };
//         return (
//           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
//             {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
//           </span>
//         );
//       }
//     },
//     {
//       header: 'Actions',
//       accessor: '_id',
//       render: (value, row) => (
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleView(row)}
//             className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
//           >
//             <Eye className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleEdit(row)}
//             className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
//           >
//             <Edit className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleDelete(row._id)}
//             className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold">Courses</h1>
//         <button
//           onClick={() => {
//             resetForm();
//             setModalOpen(true);
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-1"
//         >
//           <Plus className="w-4 h-4" />
//           <span>Add Course</span>
//         </button>
//       </div>

//       <DataTable
//         data={filteredCourses}
//         columns={columns}
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         loading={loading}
//         filterOptions={{
//           department: departments,
//           semester: semesters,
//           type: ['core', 'elective', 'practical']
//         }}
//       />

//       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCourse ? 'Edit Course' : 'Add Course'}>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Course Name" className="input" />
//           <input name="code" value={formData.code} onChange={handleInputChange} placeholder="Course Code" className="input" />
//           <input name="credits" value={formData.credits} onChange={handleInputChange} placeholder="Credits" type="number" className="input" />
//           <select name="type" value={formData.type} onChange={handleInputChange} className="input">
//             <option value="core">Core</option>
//             <option value="elective">Elective</option>
//             <option value="practical">Practical</option>
//           </select>
//           <select name="department" value={formData.department} onChange={handleInputChange} className="input">
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept._id} value={dept._id}>{dept.name}</option>
//             ))}
//           </select>
//           <select name="semester" value={formData.semester} onChange={handleInputChange} className="input">
//             <option value="">Select Semester</option>
//             {semesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>{sem.name}</option>
//             ))}
//           </select>
//           <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="input" rows="3" />
//           <button type="submit" className="btn btn-primary w-full" disabled={submitLoading}>
//             {submitLoading ? <LoadingSpinner size="sm" /> : editingCourse ? 'Update Course' : 'Create Course'}
//           </button>
//         </form>
//       </Modal>

//       {viewingCourse && (
//         <Modal isOpen={!!viewingCourse} onClose={() => setViewingCourse(null)} title="Course Details">
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {viewingCourse.name}</p>
//             <p><strong>Code:</strong> {viewingCourse.code}</p>
//             <p><strong>Credits:</strong> {viewingCourse.credits}</p>
//             <p><strong>Type:</strong> {viewingCourse.type}</p>
//             <p><strong>Department:</strong> {viewingCourse.department?.name || viewingCourse.department}</p>
//             <p><strong>Semester:</strong> {viewingCourse.semester?.name || viewingCourse.semester}</p>
//             <p><strong>Description:</strong> {viewingCourse.description}</p>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;


// // frontend/src/pages/Courses.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     department: { value: '', options: [] },
//     semester: { value: '', options: [] },
//     type: { value: '', options: [
//       { label: 'Core', value: 'core' },
//       { label: 'Elective', value: 'elective' }
//     ] }
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       const coursesData = Array.isArray(coursesRes.data)
//         ? coursesRes.data
//         : coursesRes.data?.data || [];

//       const departmentsData = Array.isArray(departmentsRes.data)
//         ? departmentsRes.data
//         : departmentsRes.data?.data || [];

//       const semestersData = Array.isArray(semestersRes.data)
//         ? semestersRes.data
//         : semestersRes.data?.data || [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);

//       setFilters(prev => ({
//         ...prev,
//         department: {
//           ...prev.department,
//           options: departmentsData.map(d => ({ label: d.name, value: d._id }))
//         },
//         semester: {
//           ...prev.semester,
//           options: semestersData.map(s => ({ label: s.name, value: s._id }))
//         }
//       }));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load courses data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = async () => {
//     try {
//       setSubmitLoading(true);
//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, formData);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(formData);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       setEditingCourse(null);
//       setFormData({
//         name: '',
//         code: '',
//         credits: '',
//         type: 'core',
//         department: '',
//         semester: '',
//         description: ''
//       });
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       toast.error('Error saving course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course.name || '',
//       code: course.code || '',
//       credits: course.credits || '',
//       type: course.type || 'core',
//       department: course.department || '',
//       semester: course.semester || '',
//       description: course.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
//     try {
//       await courseService.deleteCourse(id);
//       toast.success('Course deleted');
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term.toLowerCase());
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: { ...prev[key], value }
//     }));
//   };

//   const filteredCourses = courses.filter(course => {
//     return (
//       (!searchTerm || (course.name && course.name.toLowerCase().includes(searchTerm))) &&
//       (!filters.department.value || course.department === filters.department.value) &&
//       (!filters.semester.value || course.semester === filters.semester.value) &&
//       (!filters.type.value || course.type === filters.type.value)
//     );
//   });

//   const columns = [
//     { key: 'name', label: 'Course Name' },
//     { key: 'code', label: 'Code' },
//     { key: 'credits', label: 'Credits' },
//     { key: 'type', label: 'Type' },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button onClick={() => handleView(row)} title="View"><Eye size={16} /></button>
//           <button onClick={() => handleEdit(row)} title="Edit"><Edit size={16} /></button>
//           <button onClick={() => handleDelete(row._id)} title="Delete"><Trash2 size={16} className="text-red-500" /></button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Courses</h1>
//         <button
//           className="btn btn-primary flex items-center gap-2"
//           onClick={() => {
//             setEditingCourse(null);
//             setFormData({
//               name: '',
//               code: '',
//               credits: '',
//               type: 'core',
//               department: '',
//               semester: '',
//               description: ''
//             });
//             setModalOpen(true);
//           }}
//         >
//           <Plus size={18} />
//           Add Course
//         </button>
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable
//           data={filteredCourses}
//           columns={columns}
//           loading={loading}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onSearch={handleSearch}
//           pagination={{ page: 1, totalPages: 1 }} // Pagination can be added later if needed
//           onPageChange={() => {}}
//         />
//       )}

//       {/* View Course Modal */}
//       {viewingCourse && (
//         <Modal title="View Course" onClose={() => setViewingCourse(null)}>
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {viewingCourse.name}</p>
//             <p><strong>Code:</strong> {viewingCourse.code}</p>
//             <p><strong>Credits:</strong> {viewingCourse.credits}</p>
//             <p><strong>Type:</strong> {viewingCourse.type}</p>
//             <p><strong>Department:</strong> {departments.find(d => d._id === viewingCourse.department)?.name || 'N/A'}</p>
//             <p><strong>Semester:</strong> {semesters.find(s => s._id === viewingCourse.semester)?.name || 'N/A'}</p>
//             <p><strong>Description:</strong> {viewingCourse.description || 'N/A'}</p>
//           </div>
//         </Modal>
//       )}

//       {/* Add/Edit Course Modal */}
//       {modalOpen && (
//         <Modal
//           title={editingCourse ? 'Edit Course' : 'Add Course'}
//           onClose={() => {
//             setModalOpen(false);
//             setEditingCourse(null);
//             setFormData({
//               name: '',
//               code: '',
//               credits: '',
//               type: 'core',
//               department: '',
//               semester: '',
//               description: ''
//             });
//           }}
//           footer={
//             <div className="flex justify-end gap-2">
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => {
//                   setModalOpen(false);
//                   setEditingCourse(null);
//                 }}
//                 disabled={submitLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-primary"
//                 onClick={handleFormSubmit}
//                 disabled={submitLoading}
//               >
//                 {submitLoading ? 'Saving...' : 'Save'}
//               </button>
//             </div>
//           }
//         >
//           <form className="space-y-4" onSubmit={e => e.preventDefault()}>
//             <div>
//               <label className="block mb-1 font-medium">Course Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="input w-full"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Code</label>
//               <input
//                 type="text"
//                 name="code"
//                 value={formData.code}
//                 onChange={handleInputChange}
//                 className="input w-full"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Credits</label>
//               <input
//                 type="number"
//                 name="credits"
//                 value={formData.credits}
//                 onChange={handleInputChange}
//                 className="input w-full"
//                 required
//                 min={1}
//                 max={10}
//               />
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Type</label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 className="input w-full"
//                 required
//               >
//                 {filters.type.options.map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Department</label>
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleInputChange}
//                 className="input w-full"
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {filters.department.options.map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Semester</label>
//               <select
//                 name="semester"
//                 value={formData.semester}
//                 onChange={handleInputChange}
//                 className="input w-full"
//                 required
//               >
//                 <option value="">Select Semester</option>
//                 {filters.semester.options.map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 font-medium">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="input w-full"
//                 rows={3}
//               />
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;

// // frontend/src/pages/Courses.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     department: { value: '', options: [] },
//     semester: { value: '', options: [] },
//     type: { value: '', options: [
//       { label: 'Core', value: 'core' },
//       { label: 'Elective', value: 'elective' }
//     ] }
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       const coursesData = Array.isArray(coursesRes.data)
//         ? coursesRes.data
//         : coursesRes.data?.data || [];

//       const departmentsData = Array.isArray(departmentsRes.data)
//         ? departmentsRes.data
//         : departmentsRes.data?.data || [];

//       const semestersData = Array.isArray(semestersRes.data)
//         ? semestersRes.data
//         : semestersRes.data?.data || [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);

//       setFilters(prev => ({
//         ...prev,
//         department: {
//           ...prev.department,
//           options: departmentsData.map(d => ({ label: d.name, value: d._id }))
//         },
//         semester: {
//           ...prev.semester,
//           options: semestersData.map(s => ({ label: s.name, value: s._id }))
//         }
//       }));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load courses data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = async () => {
//     try {
//       setSubmitLoading(true);
//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, formData);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(formData);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       setEditingCourse(null);
//       setFormData({
//         name: '',
//         code: '',
//         credits: '',
//         type: 'core',
//         department: '',
//         semester: '',
//         description: ''
//       });
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       toast.error('Error saving course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course.name || '',
//       code: course.code || '',
//       credits: course.credits || '',
//       type: course.type || 'core',
//       department: course.department || '',
//       semester: course.semester || '',
//       description: course.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
//     try {
//       await courseService.deleteCourse(id);
//       toast.success('Course deleted');
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term.toLowerCase());
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: { ...prev[key], value }
//     }));
//   };

//   const filteredCourses = courses.filter(course => {
//     return (
//       (!searchTerm || (course.name && course.name.toLowerCase().includes(searchTerm))) &&
//       (!filters.department.value || course.department === filters.department.value) &&
//       (!filters.semester.value || course.semester === filters.semester.value) &&
//       (!filters.type.value || course.type === filters.type.value)
//     );
//   });

//   const columns = [
//     { key: 'name', label: 'Course Name' },
//     { key: 'code', label: 'Code' },
//     { key: 'credits', label: 'Credits' },
//     { key: 'type', label: 'Type' },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button onClick={() => handleView(row)} title="View"><Eye size={16} /></button>
//           <button onClick={() => handleEdit(row)} title="Edit"><Edit size={16} /></button>
//           <button onClick={() => handleDelete(row._id)} title="Delete"><Trash2 size={16} className="text-red-500" /></button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Courses</h1>
//         <button
//           className="btn btn-primary flex items-center gap-2"
//           onClick={() => {
//             setEditingCourse(null);
//             setFormData({
//               name: '',
//               code: '',
//               credits: '',
//               type: 'core',
//               department: '',
//               semester: '',
//               description: ''
//             });
//             setModalOpen(true);
//           }}
//         >
//           <Plus size={18} />
//           Add Course
//         </button>
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable
//           data={filteredCourses}
//           columns={columns}
//           loading={loading}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onSearch={handleSearch}
//           pagination={{ page: 1, totalPages: 1 }}
//           onPageChange={() => {}}
//         />
//       )}

//       {/* View Modal */}
//       {viewingCourse && (
//         <Modal title="View Course" onClose={() => setViewingCourse(null)}>
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {viewingCourse.name}</p>
//             <p><strong>Code:</strong> {viewingCourse.code}</p>
//             <p><strong>Credits:</strong> {viewingCourse.credits}</p>
//             <p><strong>Type:</strong> {viewingCourse.type}</p>
//             <p><strong>Department:</strong> {departments.find(d => d._id === viewingCourse.department)?.name || 'N/A'}</p>
//             <p><strong>Semester:</strong> {semesters.find(s => s._id === viewingCourse.semester)?.name || 'N/A'}</p>
//             <p><strong>Description:</strong> {viewingCourse.description || 'N/A'}</p>
//           </div>
//         </Modal>
//       )}

//       {/* Add/Edit Modal */}
//       {modalOpen && (
//         <Modal title={editingCourse ? 'Edit Course' : 'Add Course'} onClose={() => setModalOpen(false)}>
//           <div className="space-y-4">
//             <input
//               name="name"
//               placeholder="Course Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <input
//               name="code"
//               placeholder="Course Code"
//               value={formData.code}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <input
//               name="credits"
//               placeholder="Credits"
//               value={formData.credits}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="core">Core</option>
//               <option value="elective">Elective</option>
//             </select>
//             <select
//               name="department"
//               value={formData.department}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Department</option>
//               {departments.map(d => (
//                 <option key={d._id} value={d._id}>{d.name}</option>
//               ))}
//             </select>
//             <select
//               name="semester"
//               value={formData.semester}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Semester</option>
//               {semesters.map(s => (
//                 <option key={s._id} value={s._id}>{s.name}</option>
//               ))}
//             </select>
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="textarea textarea-bordered w-full"
//             />
//             <button
//               className="btn btn-primary w-full"
//               onClick={handleFormSubmit}
//               disabled={submitLoading}
//             >
//               {submitLoading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;
// // frontend/src/pages/Courses.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     department: { value: '', options: [] },
//     semester: { value: '', options: [] },
//     type: { value: '', options: [
//       { label: 'Core', value: 'core' },
//       { label: 'Elective', value: 'elective' }
//     ] }
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       // Make sure the responses are arrays
//       const coursesData = Array.isArray(coursesRes) ? coursesRes : [];
//       const departmentsData = Array.isArray(departmentsRes) ? departmentsRes : [];
//       const semestersData = Array.isArray(semestersRes) ? semestersRes : [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);

//       setFilters(prev => ({
//         ...prev,
//         department: {
//           ...prev.department,
//           options: departmentsData.map(d => ({ label: d.name, value: String(d._id) })) // Stringify IDs
//         },
//         semester: {
//           ...prev.semester,
//           options: semestersData.map(s => ({ label: s.name, value: String(s._id) })) // Stringify IDs
//         }
//       }));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load courses data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = async () => {
//     // Basic validation - you can enhance as needed
//     if (!formData.name.trim()) {
//       toast.error('Course Name is required');
//       return;
//     }
//     if (!formData.department) {
//       toast.error('Please select a Department');
//       return;
//     }
//     if (!formData.semester) {
//       toast.error('Please select a Semester');
//       return;
//     }

//     try {
//       setSubmitLoading(true);
//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, formData);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(formData);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       setEditingCourse(null);
//       setFormData({
//         name: '',
//         code: '',
//         credits: '',
//         type: 'core',
//         department: '',
//         semester: '',
//         description: ''
//       });
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       toast.error('Error saving course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course?.name || '',
//       code: course?.code || '',
//       credits: course?.credits || '',
//       type: course?.type || 'core',
//       department: String(course?.department || ''),  // stringify to keep controlled select consistent
//       semester: String(course?.semester || ''),
//       description: course?.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
//     try {
//       await courseService.deleteCourse(id);
//       toast.success('Course deleted');
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term.toLowerCase());
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: { ...prev[key], value }
//     }));
//   };

//   const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course => {
//     return (
//       (!searchTerm || (course?.name?.toLowerCase().includes(searchTerm))) &&
//       (!filters.department.value || String(course?.department) === filters.department.value) &&
//       (!filters.semester.value || String(course?.semester) === filters.semester.value) &&
//       (!filters.type.value || course?.type === filters.type.value)
//     );
//   });

//   const columns = [
//     { key: 'name', label: 'Course Name' },
//     { key: 'code', label: 'Code' },
//     { key: 'credits', label: 'Credits' },
//     { key: 'type', label: 'Type' },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button onClick={() => handleView(row)} title="View"><Eye size={16} /></button>
//           <button onClick={() => handleEdit(row)} title="Edit"><Edit size={16} /></button>
//           <button onClick={() => handleDelete(row._id)} title="Delete"><Trash2 size={16} className="text-red-500" /></button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold">Courses</h1>
//         <button
//           className="btn btn-primary flex items-center gap-2"
//           onClick={() => {
//             setEditingCourse(null);
//             setFormData({
//               name: '',
//               code: '',
//               credits: '',
//               type: 'core',
//               department: '',
//               semester: '',
//               description: ''
//             });
//             setModalOpen(true);
//           }}
//         >
//           <Plus size={18} />
//           Add Course
//         </button>
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable
//           data={filteredCourses}
//           columns={columns}
//           loading={loading}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onSearch={handleSearch}
//           pagination={{ page: 1, totalPages: 1 }}
//           onPageChange={() => {}}
//         />
//       )}

//       {/* View Modal */}
//       {viewingCourse && (
//         <Modal title="View Course" onClose={() => setViewingCourse(null)}>
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {viewingCourse?.name || 'N/A'}</p>
//             <p><strong>Code:</strong> {viewingCourse?.code || 'N/A'}</p>
//             <p><strong>Credits:</strong> {viewingCourse?.credits || 'N/A'}</p>
//             <p><strong>Type:</strong> {viewingCourse?.type || 'N/A'}</p>
//             <p><strong>Department:</strong> {departments.find(d => String(d._id) === String(viewingCourse?.department))?.name || 'N/A'}</p>
//             <p><strong>Semester:</strong> {semesters.find(s => String(s._id) === String(viewingCourse?.semester))?.name || 'N/A'}</p>
//             <p><strong>Description:</strong> {viewingCourse?.description || 'N/A'}</p>
//           </div>
//         </Modal>
//       )}

//       {/* Add/Edit Modal */}
//       {modalOpen && (
//         <Modal title={editingCourse ? 'Edit Course' : 'Add Course'} onClose={() => setModalOpen(false)}>
//           <div className="space-y-4">
//             <input
//               name="name"
//               placeholder="Course Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <input
//               name="code"
//               placeholder="Course Code"
//               value={formData.code}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <input
//               name="credits"
//               placeholder="Credits"
//               value={formData.credits}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="core">Core</option>
//               <option value="elective">Elective</option>
//             </select>
//             <select
//               name="department"
//               value={formData.department}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Department</option>
//               {departments.map(d => (
//                 <option key={d._id} value={String(d._id)}>{d.name}</option>
//               ))}
//             </select>
//             <select
//               name="semester"
//               value={formData.semester}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Semester</option>
//               {semesters.map(s => (
//                 <option key={s._id} value={String(s._id)}>{s.name}</option>
//               ))}
//             </select>
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="textarea textarea-bordered w-full"
//             />
//             <button
//               onClick={handleFormSubmit}
//               className="btn btn-primary w-full"
//               disabled={submitLoading}
//             >
//               {submitLoading ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;


// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     department: { value: '', options: [] },
//     semester: { value: '', options: [] },
//     type: {
//       value: '',
//       options: [
//         { label: 'Core', value: 'core' },
//         { label: 'Elective', value: 'elective' }
//       ]
//     }
//   });
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//     credits: '',
//     type: 'core',
//     department: '',
//     semester: '',
//     description: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       console.log("✅ Departments:", departmentsRes);
//       console.log("✅ Semesters:", semestersRes);

//       const coursesData = Array.isArray(coursesRes) ? coursesRes : [];
//       const departmentsData = Array.isArray(departmentsRes) ? departmentsRes : [];
//       const semestersData = Array.isArray(semestersRes) ? semestersRes : [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);

//       setFilters(prev => ({
//         ...prev,
//         department: {
//           ...prev.department,
//           options: departmentsData.map(d => ({ label: d.name, value: String(d._id) }))
//         },
//         semester: {
//           ...prev.semester,
//           options: semestersData.map(s => ({ label: s.name, value: String(s._id) }))
//         }
//       }));
//     } catch (error) {
//       console.error('❌ Error fetching data:', error);
//       toast.error('Failed to load courses data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = async () => {
//     if (!formData.name.trim()) {
//       toast.error('Course Name is required');
//       return;
//     }
//     if (!formData.department) {
//       toast.error('Please select a Department');
//       return;
//     }
//     if (!formData.semester) {
//       toast.error('Please select a Semester');
//       return;
//     }

//     try {
//       setSubmitLoading(true);
//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, formData);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(formData);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       setEditingCourse(null);
//       setFormData({
//         name: '',
//         code: '',
//         credits: '',
//         type: 'core',
//         department: '',
//         semester: '',
//         description: ''
//       });
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       toast.error('Error saving course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       name: course?.name || '',
//       code: course?.code || '',
//       credits: course?.credits || '',
//       type: course?.type || 'core',
//       department: String(course?.department || ''),
//       semester: String(course?.semester || ''),
//       description: course?.description || ''
//     });
//     setModalOpen(true);
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
//     try {
//       await courseService.deleteCourse(id);
//       toast.success('Course deleted');
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term.toLowerCase());
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: { ...prev[key], value }
//     }));
//   };

//   const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
//     return (
//       (!searchTerm || (course?.name?.toLowerCase().includes(searchTerm))) &&
//       (!filters.department.value || String(course?.department) === filters.department.value) &&
//       (!filters.semester.value || String(course?.semester) === filters.semester.value) &&
//       (!filters.type.value || course?.type === filters.type.value)
//     );
//   }) : [];

//   const columns = [
//     { key: 'name', label: 'Course Name' },
//     { key: 'code', label: 'Code' },
//     { key: 'credits', label: 'Credits' },
//     { key: 'type', label: 'Type' },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button onClick={() => handleView(row)} title="View"><Eye size={16} /></button>
//           <button onClick={() => handleEdit(row)} title="Edit"><Edit size={16} /></button>
//           <button onClick={() => handleDelete(row._id)} title="Delete"><Trash2 size={16} className="text-red-500" /></button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4 mt-5">
//         <h1 className="text-2xl font-semibold">Courses</h1>
//         <button
//           className="btn btn-primary flex items-center gap-2"
//           onClick={() => {
//             setEditingCourse(null);
//             setFormData({
//               name: '',
//               code: '',
//               credits: '',
//               type: 'core',
//               department: '',
//               semester: '',
//               description: ''
//             });
//             setModalOpen(true);
//           }}
//         >
//           <Plus size={18} />
//           Add Course
//         </button>
//       </div>

//       <div className="text-sm text-gray-500 mb-2">
//         Departments loaded: {departments.length} | Semesters loaded: {semesters.length}
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable
//           data={filteredCourses}
//           columns={columns}
//           loading={loading}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onSearch={handleSearch}
//           pagination={{ page: 1, totalPages: 1 }}
//           onPageChange={() => {}}
//         />
//       )}

//       {viewingCourse && (
//         <Modal title="View Course" onClose={() => setViewingCourse(null)}>
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {viewingCourse?.name || 'N/A'}</p>
//             <p><strong>Code:</strong> {viewingCourse?.code || 'N/A'}</p>
//             <p><strong>Credits:</strong> {viewingCourse?.credits || 'N/A'}</p>
//             <p><strong>Type:</strong> {viewingCourse?.type || 'N/A'}</p>
//             <p><strong>Department:</strong> {departments.find(d => String(d._id) === String(viewingCourse?.department))?.name || 'N/A'}</p>
//             <p><strong>Semester:</strong> {semesters.find(s => String(s._id) === String(viewingCourse?.semester))?.name || 'N/A'}</p>
//             <p><strong>Description:</strong> {viewingCourse?.description || 'N/A'}</p>
//           </div>
//         </Modal>
//       )}

//       {modalOpen && (
//         <Modal title={editingCourse ? 'Edit Course' : 'Add Course'} onClose={() => setModalOpen(false)}>
//           <div className="space-y-4">
//             <input
//               name="name"
//               placeholder="Course Name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <input
//               name="code"
//               placeholder="Course Code"
//               value={formData.code}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <input
//               name="credits"
//               placeholder="Credits"
//               value={formData.credits}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="core">Core</option>
//               <option value="elective">Elective</option>
//             </select>
//             <select
//               name="department"
//               value={formData.department}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Department</option>
//               {departments.map(d => (
//                 <option key={d._id} value={String(d._id)}>{d.name}</option>
//               ))}
//             </select>
//             <select
//               name="semester"
//               value={formData.semester}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Semester</option>
//               {semesters.map(s => (
//                 <option key={s._id} value={String(s._id)}>{s.name}</option>
//               ))}
//             </select>
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="textarea textarea-bordered w-full"
//             />
//             <button
//               onClick={handleFormSubmit}
//               className="btn btn-primary w-full"
//               disabled={submitLoading}
//             >
//               {submitLoading ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;


// import React, { useState, useEffect, useCallback } from 'react';
// import { Plus, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
// import { toast } from 'react-toastify';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     department_id: { value: '', options: [] },
//     semester_id: { value: '', options: [] },
//     course_type: {
//       value: '',
//       options: [
//         { label: 'Core', value: 'core' },
//         { label: 'Elective', value: 'elective' }
//       ]
//     }
//   });
//   const [formData, setFormData] = useState({
//     course_name: '',
//     course_code: '',
//     credits: '',
//     course_type: 'core',
//     department_id: '',
//     semester_id: '',
//     description: '',
//     duration: '',
//     year: '',
//     section: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [coursesRes, departmentsRes, semestersRes] = await Promise.all([
//         courseService.getAllCourses(),
//         departmentService.getAllDepartments(),
//         semesterService.getAllSemesters()
//       ]);

//       console.log("✅ Departments:", departmentsRes);
//       console.log("✅ Semesters:", semestersRes);

//       const coursesData = Array.isArray(coursesRes) ? coursesRes : [];
//       const departmentsData = Array.isArray(departmentsRes) ? departmentsRes : [];
//       const semestersData = Array.isArray(semestersRes) ? semestersRes : [];

//       setCourses(coursesData);
//       setDepartments(departmentsData);
//       setSemesters(semestersData);

//       setFilters(prev => ({
//         ...prev,
//         department_id: {
//           ...prev.department_id,
//           options: departmentsData.map(d => ({ label: d.name, value: String(d._id) }))
//         },
//         semester_id: {
//           ...prev.semester_id,
//           options: semestersData.map(s => ({ label: s.name, value: String(s._id) }))
//         }
//       }));
//     } catch (error) {
//       console.error('❌ Error fetching data:', error);
//       toast.error('Failed to load courses data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Reset Form Data Function
//   const resetFormData = () => {
//     setFormData({
//       course_name: '',
//       course_code: '',
//       credits: '',
//       course_type: 'core',
//       department_id: '',
//       semester_id: '',
//       description: '',
//       duration: '',
//       year: '',
//       section: ''
//     });
//   };

//   // Reset All Filters Function
//   const resetFilters = () => {
//     setFilters(prev => ({
//       department_id: { ...prev.department_id, value: '' },
//       semester_id: { ...prev.semester_id, value: '' },
//       course_type: { ...prev.course_type, value: '' }
//     }));
//     setSearchTerm('');
//     toast.success('All filters cleared');
//   };

//   const handleFormSubmit = async () => {
//     console.log("Form submit triggered");
//     if (!formData.course_name.trim()) {
//       toast.error('Course Name is required');
//       return;
//     }
//     if (!formData.course_code.trim()) {
//       toast.error('Course Code is required');
//       return;
//     }
//     if (!formData.department_id) {
//       toast.error('Please select a Department');
//       return;
//     }
//     if (!formData.semester_id) {
//       toast.error('Please select a Semester');
//       return;
//     }

//     try {
//       setSubmitLoading(true);
//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, formData);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.createCourse(formData);
//         toast.success('Course created successfully');
//       }
//       setModalOpen(false);
//       setEditingCourse(null);
//       resetFormData();
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       toast.error('Error saving course');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleEdit = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       course_name: course?.course_name || '',
//       course_code: course?.course_code || '',
//       credits: course?.credits || '',
//       course_type: course?.course_type || 'core',
//       department_id: String(course?.department_id || ''),
//       semester_id: String(course?.semester_id || ''),
//       description: course?.description || '',
//       duration: course?.duration || '',
//       year: course?.year || '',
//       section: course?.section || ''
//     });
//     setModalOpen(true);
//   };

//   const handleView = (course) => {
//     setViewingCourse(course);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
//     try {
//       await courseService.deleteCourse(id);
//       toast.success('Course deleted');
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to delete course');
//     }
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term.toLowerCase());
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: { ...prev[key], value }
//     }));
//   };

//   const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
//     return (
//       (!searchTerm || (course?.course_name?.toLowerCase().includes(searchTerm))) &&
//       (!filters.department_id.value || String(course?.department_id) === filters.department_id.value) &&
//       (!filters.semester_id.value || String(course?.semester_id) === filters.semester_id.value) &&
//       (!filters.course_type.value || course?.course_type === filters.course_type.value)
//     );
//   }) : [];

//   const columns = [
//     { key: 'course_name', label: 'Course Name' },
//     { key: 'course_code', label: 'Code' },
//     { key: 'credits', label: 'Credits' },
//     { key: 'course_type', label: 'Type' },
//     { key: 'year', label: 'Year' },
//     { key: 'section', label: 'Section' },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button onClick={() => handleView(row)} title="View"><Eye size={16} /></button>
//           <button onClick={() => handleEdit(row)} title="Edit"><Edit size={16} /></button>
//           <button onClick={() => handleDelete(row._id)} title="Delete"><Trash2 size={16} className="text-red-500" /></button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4 mt-5">
//         <h1 className="text-2xl font-semibold">Courses</h1>
//         <div className="flex gap-2">
//           <button
//             className="btn btn-secondary flex items-center gap-2"
//             onClick={resetFilters}
//             title="Clear all filters"
//           >
//             <RefreshCw size={18} />
//             Reset Filters
//           </button>
//           <button
//             className="btn btn-primary flex items-center gap-2"
//             onClick={() => {
//               setEditingCourse(null);
//               resetFormData();
//               setModalOpen(true);
//             }}
//           >
//             <Plus size={18} />
//             Add Course
//           </button>
//         </div>
//       </div>

//       <div className="text-sm text-gray-500 mb-2">
//         Departments loaded: {departments.length} | Semesters loaded: {semesters.length}
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable
//           data={filteredCourses}
//           columns={columns}
//           loading={loading}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onSearch={handleSearch}
//           pagination={{ page: 1, totalPages: 1 }}
//           onPageChange={() => {}}
//         />
//       )}

//       {viewingCourse && (
//         <Modal title="View Course" onClose={() => setViewingCourse(null)}>
//           <div className="space-y-2">
//             <p><strong>Name:</strong> {viewingCourse?.course_name || 'N/A'}</p>
//             <p><strong>Code:</strong> {viewingCourse?.course_code || 'N/A'}</p>
//             <p><strong>Credits:</strong> {viewingCourse?.credits || 'N/A'}</p>
//             <p><strong>Type:</strong> {viewingCourse?.course_type || 'N/A'}</p>
//             <p><strong>Year:</strong> {viewingCourse?.year || 'N/A'}</p>
//             <p><strong>Section:</strong> {viewingCourse?.section || 'N/A'}</p>
//             <p><strong>Duration:</strong> {viewingCourse?.duration || 'N/A'} years</p>
//             <p><strong>Department:</strong> {departments.find(d => String(d._id) === String(viewingCourse?.department_id))?.name || 'N/A'}</p>
//             <p><strong>Semester:</strong> {semesters.find(s => String(s._id) === String(viewingCourse?.semester_id))?.name || 'N/A'}</p>
//             <p><strong>Description:</strong> {viewingCourse?.description || 'N/A'}</p>
//           </div>
//         </Modal>
//       )}

//       {modalOpen && (
//         <Modal title={editingCourse ? 'Edit Course' : 'Add Course'} onClose={() => setModalOpen(false)}>
//           <div className="space-y-4">
//             <input
//               name="course_name"
//               placeholder="Course Name *"
//               value={formData.course_name}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//               required
//             />
//             <input
//               name="course_code"
//               placeholder="Course Code *"
//               value={formData.course_code}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//               required
//             />
//             <input
//               name="credits"
//               placeholder="Credits"
//               type="number"
//               value={formData.credits}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <input
//               name="duration"
//               placeholder="Duration (Years)"
//               type="number"
//               value={formData.duration}
//               onChange={handleInputChange}
//               className="input input-bordered w-full"
//             />
//             <select
//               name="course_type"
//               value={formData.course_type}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="core">Core</option>
//               <option value="elective">Elective</option>
//             </select>
//             <select
//               name="year"
//               value={formData.year}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Year</option>
//               <option value="FE">FE (First Year)</option>
//               <option value="SE">SE (Second Year)</option>
//               <option value="TE">TE (Third Year)</option>
//               <option value="BE">BE (Final Year)</option>
//             </select>
//             <select
//               name="section"
//               value={formData.section}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//             >
//               <option value="">Select Section</option>
//               <option value="A">Section A</option>
//               <option value="B">Section B</option>
//               <option value="C">Section C</option>
//             </select>
//             <select
//               name="department_id"
//               value={formData.department_id}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//               required
//             >
//               <option value="">Select Department *</option>
//               {departments.map(d => (
//                 <option key={d._id} value={String(d._id)}>{d.name}</option>
//               ))}
//             </select>
//             <select
//               name="semester_id"
//               value={formData.semester_id}
//               onChange={handleInputChange}
//               className="select select-bordered w-full"
//               required
//             >
//               <option value="">Select Semester *</option>
//               {semesters.map(s => (
//                 <option key={s._id} value={String(s._id)}>{s.name}</option>
//               ))}
//             </select>
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="textarea textarea-bordered w-full"
//             />
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={resetFormData}
//                 className="btn btn-secondary flex-1"
//               >
//                 <RefreshCw size={16} />
//                 Reset Form
//               </button>
//               <button
//                 onClick={handleFormSubmit}
//                 className="btn btn-primary flex-1"
//                 disabled={submitLoading}
//               >
//                 {submitLoading ? 'Saving...' : 'Save Course'}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Courses;

// import React, { useEffect, useState } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import Modal from '../../components/Common/Modal';
// import DataTable from '../../components/Common/DataTable';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import courseService from '../../services/courseService';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [formData, setFormData] = useState({
//     course_name: '',
//     course_code: '',
//     semester: '',
//     department: ''
//   });

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const res = await courseService.getCourses();
//       setCourses(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submit triggered");

//     try {
//       if (editingCourse) {
//         await courseService.updateCourse(editingCourse._id, formData);
//       } else {
//         await courseService.createCourse(formData);
//       }
//       fetchCourses();
//       setModalOpen(false);
//       setEditingCourse(null);
//       setFormData({
//         course_name: '',
//         course_code: '',
//         semester: '',
//         department: ''
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEditClick = (course) => {
//     setEditingCourse(course);
//     setFormData({
//       course_name: course.course_name,
//       course_code: course.course_code,
//       semester: course.semester,
//       department: course.department
//     });
//     setModalOpen(true);
//   };

//   const handleDeleteClick = async (courseId) => {
//     if (window.confirm('Are you sure you want to delete this course?')) {
//       try {
//         await courseService.deleteCourse(courseId);
//         fetchCourses();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   const columns = [
//     { label: 'Course Name', key: 'course_name' },
//     { label: 'Course Code', key: 'course_code' },
//     { label: 'Semester', key: 'semester' },
//     { label: 'Department', key: 'department' },
//     {
//       label: 'Actions',
//       render: (course) => (
//         <div className="flex space-x-2">
//           <button onClick={() => setViewingCourse(course)} className="text-blue-500 hover:underline">
//             <Eye size={16} />
//           </button>
//           <button onClick={() => handleEditClick(course)} className="text-yellow-500 hover:underline">
//             <Edit size={16} />
//           </button>
//           <button onClick={() => handleDeleteClick(course._id)} className="text-red-500 hover:underline">
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Courses</h2>
//         <button
//           onClick={() => {
//             setModalOpen(true);
//             setEditingCourse(null);
//             setFormData({
//               course_name: '',
//               course_code: '',
//               semester: '',
//               department: ''
//             });
//           }}
//           className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           <Plus className="mr-2" size={16} />
//           Add Course
//         </button>
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={courses} columns={columns} />
//       )}

//       {/* Add/Edit Modal */}
//       <Modal
//         isOpen={modalOpen}
//         title={editingCourse ? 'Edit Course' : 'Add Course'}
//         onClose={() => setModalOpen(false)}
//       >
//         <form onSubmit={handleFormSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Course Name</label>
//             <input
//               type="text"
//               name="course_name"
//               value={formData.course_name}
//               onChange={handleInputChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Course Code</label>
//             <input
//               type="text"
//               name="course_code"
//               value={formData.course_code}
//               onChange={handleInputChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Semester</label>
//             <input
//               type="text"
//               name="semester"
//               value={formData.semester}
//               onChange={handleInputChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Department</label>
//             <input
//               type="text"
//               name="department"
//               value={formData.department}
//               onChange={handleInputChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//               required
//             />
//           </div>
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Save Course
//             </button>
//           </div>
//         </form>
//       </Modal>

//       {/* View Modal */}
//       <Modal
//         isOpen={!!viewingCourse}
//         title="View Course"
//         onClose={() => setViewingCourse(null)}
//       >
//         {viewingCourse && (
//           <div className="space-y-2">
//             <p><strong>Course Name:</strong> {viewingCourse.course_name}</p>
//             <p><strong>Course Code:</strong> {viewingCourse.course_code}</p>
//             <p><strong>Semester:</strong> {viewingCourse.semester}</p>
//             <p><strong>Department:</strong> {viewingCourse.department}</p>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default Courses;

// frontend/src/pages/Courses/Course.jsx

// import React, { useEffect, useState } from 'react';
// import courseService from '../../services/courseService';
// import departmentService from '../../services/departmentService';
// import { semesterService }  from '../../services/semesterService';
// import { Plus, Edit, Trash2 } from 'lucide-react';
// import Modal from '../../components/Common/Modal';
// import DataTable from '../../components/Common/DataTable';
// import { toast } from 'react-toastify';

// const Courses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [formData, setFormData] = useState({
//     course_name: '',
//     course_code: '',
//     credits: 0,
//     course_type: 'core',
//     department_id: '',
//     semester_id: '',
//     description: '',
//     duration: 4,
//     year: '',
//     section: '',
//   });

//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);

//   useEffect(() => {
//     fetchCourses();
//     fetchDepartments();
//     fetchSemesters();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const res = await courseService.getAll();
//       setCourses(res.data?.courses || []);
//     } catch (err) {
//       toast.error('Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await departmentService.getAll();
//       setDepartments(res.data.departments || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAll();
//       setSemesters(res.data.semesters || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddCourse = async () => {
//     try {
//       await courseService.create(formData);
//       toast.success('Course added successfully');
//       setShowAddModal(false);
//       fetchCourses();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Failed to add course');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const columns = [
//     { label: 'Name', key: 'course_name' },
//     { label: 'Code', key: 'course_code' },
//     { label: 'Credits', key: 'credits' },
//     { label: 'Type', key: 'course_type' },
//     { label: 'Department', key: 'department_id.name' },
//     { label: 'Semester', key: 'semester_id.name' },
//     { label: 'Year', key: 'year' },
//     { label: 'Section', key: 'section' },
//     {
//       label: 'Actions',
//       key: 'actions',
//       render: (item) => (
//         <div className="flex gap-2">
//           <Edit className="cursor-pointer text-blue-600" size={18} />
//           <Trash2 className="cursor-pointer text-red-600" size={18} />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Courses</h2>
//         <button
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           onClick={() => setShowAddModal(true)}
//         >
//           <Plus size={16} /> Add Course
//         </button>
//       </div>

//       <DataTable data={courses} columns={columns} loading={loading} />

//       {/* Add Course Modal */}
//       <Modal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         title="Add Course"
//         size="large"
//       >
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="course_name"
//             placeholder="Course Name"
//             value={formData.course_name}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           />
//           <input
//             type="text"
//             name="course_code"
//             placeholder="Course Code"
//             value={formData.course_code}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           />
//           <input
//             type="number"
//             name="credits"
//             placeholder="Credits"
//             value={formData.credits}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           />
//           <select
//             name="course_type"
//             value={formData.course_type}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           >
//             <option value="core">Core</option>
//             <option value="elective">Elective</option>
//           </select>
//           <select
//             name="department_id"
//             value={formData.department_id}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept._id} value={dept._id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>
//           <select
//             name="semester_id"
//             value={formData.semester_id}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">Select Semester</option>
//             {semesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.name}
//               </option>
//             ))}
//           </select>
//           <select
//             name="year"
//             value={formData.year}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">Select Year</option>
//             <option value="FE">FE</option>
//             <option value="SE">SE</option>
//             <option value="TE">TE</option>
//             <option value="BE">BE</option>
//           </select>
//           <select
//             name="section"
//             value={formData.section}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">Select Section</option>
//             <option value="A">A</option>
//             <option value="B">B</option>
//             <option value="C">C</option>
//           </select>
//           <input
//             type="number"
//             name="duration"
//             placeholder="Duration (years)"
//             value={formData.duration}
//             onChange={handleChange}
//             className="border rounded px-3 py-2"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 col-span-2"
//           />
//         </div>
//         <div className="flex justify-end mt-4">
//           <button
//             className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
//             onClick={() => setShowAddModal(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//             onClick={handleAddCourse}
//           >
//             Add Course
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Courses;




// import React, { useEffect, useState } from 'react';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import { toast } from 'react-toastify';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Courses = () => {
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     courseName: '',
//     courseCode: '',
//     departmentId: '',
//     semesterId: '',
//     description: '',
//     credits: ''
//   });

//   // Fetch departments
//   const fetchDepartments = async () => {
//     try {
//       const res = await departmentService.getAllDepartments();
//       setDepartments(res.departments || []);
//     } catch (error) {
//       toast.error('Failed to fetch departments');
//       console.error(error);
//     }
//   };

//   // Fetch semesters
//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAllSemesters();
//       setSemesters(res.semesters || []);
//     } catch (error) {
//       toast.error('Failed to fetch semesters');
//       console.error(error);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       // Call your courseService here to create the course
//       // Example: await courseService.createCourse(formData);
//       toast.success('Course created successfully!');
//       setFormData({
//         courseName: '',
//         courseCode: '',
//         departmentId: '',
//         semesterId: '',
//         description: '',
//         credits: ''
//       });
//     } catch (error) {
//       toast.error('Failed to create course');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchSemesters();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h3 className="mb-4">Manage Courses</h3>

//       {loading && <LoadingSpinner />}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="courseName" className="form-label">Course Name</label>
//           <input
//             type="text"
//             className="form-control"
//             id="courseName"
//             name="courseName"
//             value={formData.courseName}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label htmlFor="courseCode" className="form-label">Course Code</label>
//           <input
//             type="text"
//             className="form-control"
//             id="courseCode"
//             name="courseCode"
//             value={formData.courseCode}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label htmlFor="departmentId" className="form-label">Department</label>
//           <select
//             className="form-select"
//             id="departmentId"
//             name="departmentId"
//             value={formData.departmentId}
//             onChange={handleChange}
//             required
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept._id} value={dept._id}>
//                 {dept.departmentName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="semesterId" className="form-label">Semester</label>
//           <select
//             className="form-select"
//             id="semesterId"
//             name="semesterId"
//             value={formData.semesterId}
//             onChange={handleChange}
//             required
//           >
//             <option value="">-- Select Semester --</option>
//             {semesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semesterName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="description" className="form-label">Description</label>
//           <textarea
//             className="form-control"
//             id="description"
//             name="description"
//             rows="3"
//             value={formData.description}
//             onChange={handleChange}
//           ></textarea>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="credits" className="form-label">Credits</label>
//           <input
//             type="number"
//             className="form-control"
//             id="credits"
//             name="credits"
//             value={formData.credits}
//             onChange={handleChange}
//             min="1"
//             max="10"
//           />
//         </div>

//         <button type="submit" className="btn btn-primary">
//           Create Course
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Courses;


import React, { useEffect, useState } from 'react';
import departmentService from '../../services/departmentService';
import { semesterService } from '../../services/semesterService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Courses = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    departmentId: '',
    semesterId: '',
    description: '',
    credits: ''
  });

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getAllDepartments();
      if (res && Array.isArray(res.departments)) {
        setDepartments(res.departments);
      } else if (Array.isArray(res)) {
        setDepartments(res);
      } else {
        console.warn('Unexpected department data:', res);
        setDepartments([]);
        toast.warn('No departments found');
      }
    } catch (error) {
      toast.error('Failed to fetch departments');
      console.error(error);
      setDepartments([]);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await semesterService.getAllSemesters();
      if (res && Array.isArray(res.semesters)) {
        setSemesters(res.semesters);
      } else if (Array.isArray(res)) {
        setSemesters(res);
      } else {
        console.warn('Unexpected semester data:', res);
        setSemesters([]);
        toast.warn('No semesters found');
      }
    } catch (error) {
      toast.error('Failed to fetch semesters');
      console.error(error);
      setSemesters([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Example: await courseService.createCourse(formData);
      toast.success('Course created successfully!');
      setFormData({
        courseName: '',
        courseCode: '',
        departmentId: '',
        semesterId: '',
        description: '',
        credits: ''
      });
    } catch (error) {
      toast.error('Failed to create course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchSemesters();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Manage Courses</h3>

      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="courseName" className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="courseCode" className="form-label">Course Code</label>
          <input
            type="text"
            className="form-control"
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="departmentId" className="form-label">Department</label>
          <select
            className="form-select"
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentName || dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="semesterId" className="form-label">Semester</label>
          <select
            className="form-select"
            id="semesterId"
            name="semesterId"
            value={formData.semesterId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.semesterName || sem.semester_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="credits" className="form-label">Credits</label>
          <input
            type="number"
            className="form-control"
            id="credits"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            min="1"
            max="10"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Course
        </button>
      </form>
    </div>
  );
};

export default Courses;
