// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search, Filter, Download } from 'lucide-react';
// import { toast } from 'react-toastify';
// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import StudentForm from '../../components/Students/StudentForm';
// import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter
//       };
      
//       const response = await studentService.getAllStudents(params);
//       setStudents(response.data.students);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data.total,
//         totalPages: response.data.totalPages
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await departmentService.getAllDepartments();
//       setDepartments(response.data.departments || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const response = await semesterService.getAllSemesters();
//       setSemesters(response.data.semesters || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }
      
//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter
//       });
      
//       // Create and download file
//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       'active': 'bg-green-100 text-green-800',
//       'inactive': 'bg-red-100 text-red-800',
//       'suspended': 'bg-yellow-100 text-yellow-800'
//     };

//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     {
//       key: 'stu_id',
//       label: 'Student ID',
//       sortable: true
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       sortable: true
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       sortable: true
//     },
//     {
//       key: 'mobile',
//       label: 'Mobile',
//       sortable: false
//     },
//     {
//       key: 'department',
//       label: 'Department',
//       sortable: true,
//       render: (student) => student.department?.department_name || 'N/A'
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       sortable: true,
//       render: (student) => student.semester?.semester_name || 'N/A'
//     },
//     {
//       key: 'gender',
//       label: 'Gender',
//       sortable: true,
//       render: (student) => student.gender?.charAt(0).toUpperCase() + student.gender?.slice(1) || 'N/A'
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       sortable: true,
//       render: (student) => getStatusBadge(student.status)
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       sortable: false,
//       render: (student) => (
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleViewStudent(student)}
//             className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
//             title="View Details"
//           >
//             <Eye size={16} />
//           </button>
//           <button
//             onClick={() => handleEditStudent(student)}
//             className="p-1 text-green-600 hover:text-green-800 transition-colors"
//             title="Edit"
//           >
//             <Edit size={16} />
//           </button>
//           <button
//             onClick={() => handleDeleteStudent(student)}
//             className="p-1 text-red-600 hover:text-red-800 transition-colors"
//             title="Delete"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )
//     }
//   ];

//   if (loading && students.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingSpinner size="large" text="Loading students..." />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Students</h1>
//           <p className="text-gray-600">Manage student information and enrollment</p>
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={handleExportStudents}
//             className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//           >
//             <Download size={20} className="mr-2" />
//             Export
//           </button>
//           <button
//             onClick={handleAddStudent}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             <Plus size={20} className="mr-2" />
//             Add Student
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Search Students
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by name, email..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Department
//             </label>
//             <select
//               value={departmentFilter}
//               onChange={(e) => handleFilterChange('department', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Departments</option>
//               {departments.map((dept) => (
//                 <option key={dept.department_id} value={dept.department_id}>
//                   {dept.department_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Semester
//             </label>
//             <select
//               value={semesterFilter}
//               onChange={(e) => handleFilterChange('semester', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Semesters</option>
//               {semesters.map((sem) => (
//                 <option key={sem.sem_id} value={sem.sem_id}>
//                   {sem.semester_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Status
//             </label>
//             <select
//               value={statusFilter}
//               onChange={(e) => handleFilterChange('status', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="suspended">Suspended</option>
//             </select>
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setDepartmentFilter('');
//                 setSemesterFilter('');
//                 setStatusFilter('');
//                 setPagination(prev => ({ ...prev, page: 1 }));
//               }}
//               className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Students Table */}
//       <div className="bg-white rounded-lg shadow">
//         <DataTable
//           data={students}
//           columns={columns}
//           loading={loading}
//           pagination={{
//             current: pagination.page,
//             total: pagination.totalPages,
//             pageSize: pagination.limit,
//             totalItems: pagination.total,
//             onPageChange: handlePageChange
//           }}
//           emptyMessage="No students found"
//         />
//       </div>

//       {/* Add/Edit Student Modal */}
//       <Modal
//         isOpen={isFormModalOpen}
//         onClose={() => {
//           setIsFormModalOpen(false);
//           setSelectedStudent(null);
//         }}
//         title={`${formMode === 'add' ? 'Add New' : 'Edit'} Student`}
//         size="large"
//       >
//         <StudentForm
//           student={selectedStudent}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//           onCancel={() => {
//             setIsFormModalOpen(false);
//             setSelectedStudent(null);
//           }}
//           mode={formMode}
//         />
//       </Modal>

//       {/* Student Details Modal */}
//       <Modal
//         isOpen={isDetailsModalOpen}
//         onClose={() => {
//           setIsDetailsModalOpen(false);
//           setSelectedStudent(null);
//         }}
//         title="Student Details"
//         size="large"
//       >
//         {selectedStudent && (
//           <StudentDetails
//             student={selectedStudent}
//             onEdit={() => {
//               setIsDetailsModalOpen(false);
//               handleEditStudent(selectedStudent);
//             }}
//             onClose={() => {
//               setIsDetailsModalOpen(false);
//               setSelectedStudent(null);
//             }}
//           />
//         )}
//       </Modal>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         onClose={() => {
//           setIsDeleteDialogOpen(false);
//           setSelectedStudent(null);
//         }}
//         onConfirm={confirmDelete}
//         title="Delete Student"
//         message={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
//         type="danger"
//       />
//     </div>
//   );
// };

// export default Students;

// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search, Filter, Download } from 'lucide-react';
// import { toast } from 'react-toastify';
// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// //import StudentForm from '../../components/Students/StudentForm';
// //import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.data.students);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data.total,
//         totalPages: response.data.totalPages
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await departmentService.getAllDepartments();
//       setDepartments(response.data.departments || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const response = await semesterService.getAllSemesters();
//       setSemesters(response.data.semesters || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800'
//     };

//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     {
//       key: 'stu_id',
//       label: 'Student ID',
//       sortable: true
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       sortable: true
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       sortable: true
//     },
//     {
//       key: 'mobile',
//       label: 'Mobile',
//       sortable: false
//     },
//     {
//       key: 'department',
//       label: 'Department',
//       sortable: true,
//       render: (student) => student.department?.department_name || 'N/A'
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       sortable: true,
//       render: (student) => student.semester?.semester_name || 'N/A'
//     },
//     {
//       key: 'gender',
//       label: 'Gender',
//       sortable: true,
//       render: (student) => student.gender?.charAt(0).toUpperCase() + student.gender?.slice(1) || 'N/A'
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       sortable: true,
//       render: (student) => getStatusBadge(student.status)
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       sortable: false,
//       render: (student) => (
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleViewStudent(student)}
//             className="p-1 text-blue-600 hover:text-blue-800"
//             title="View Details"
//           >
//             <Eye size={16} />
//           </button>
//           <button
//             onClick={() => handleEditStudent(student)}
//             className="p-1 text-green-600 hover:text-green-800"
//             title="Edit"
//           >
//             <Edit size={16} />
//           </button>
//           <button
//             onClick={() => handleDeleteStudent(student)}
//             className="p-1 text-red-600 hover:text-red-800"
//             title="Delete"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Students</h1>
//         <div className="flex space-x-2">
//           <button onClick={handleAddStudent} className="btn btn-primary flex items-center space-x-1">
//             <Plus size={16} />
//             <span>Add Student</span>
//           </button>
//           <button onClick={handleExportStudents} className="btn btn-secondary flex items-center space-x-1">
//             <Download size={16} />
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       <DataTable
//         data={students}
//         columns={columns}
//         loading={loading}
//         pagination={pagination}
//         onPageChange={handlePageChange}
//         onSearch={handleSearch}
//         filters={{
//           department: { options: departments, value: departmentFilter },
//           semester: { options: semesters, value: semesterFilter },
//           status: { options: ['active', 'inactive', 'suspended'], value: statusFilter }
//         }}
//         onFilterChange={handleFilterChange}
//       />

//       <Modal
//         isOpen={isFormModalOpen}
//         onClose={() => setIsFormModalOpen(false)}
//         title={formMode === 'add' ? 'Add Student' : 'Edit Student'}
//       >
//         {/* <StudentForm
//           student={selectedStudent}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//         /> */}
//       </Modal>

//       <Modal
//         isOpen={isDetailsModalOpen}
//         onClose={() => setIsDetailsModalOpen(false)}
//         title="Student Details"
//       >
//         {/* <StudentDetails student={selectedStudent} /> */}
//       </Modal>

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         onClose={() => setIsDeleteDialogOpen(false)}
//         onConfirm={confirmDelete}
//         message="Are you sure you want to delete this student?"
//       />

//       {loading && <LoadingSpinner />}
//     </div>
//   );
// };

// export default Students;


// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search, Filter, Download } from 'lucide-react';
// import { toast } from 'react-toastify';
// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// // import StudentForm from '../../components/Students/StudentForm';
// // import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.data.students);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data.total,
//         totalPages: response.data.totalPages
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await departmentService.getAllDepartments();
//       setDepartments(response.departments || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const response = await semesterService.getAllSemesters();
//       setSemesters(response.data.semesters || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800'
//     };

//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     {
//       key: 'stu_id',
//       label: 'Student ID',
//       sortable: true
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       sortable: true
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       sortable: true
//     },
//     {
//       key: 'mobile',
//       label: 'Mobile',
//       sortable: false
//     },
//     {
//       key: 'department',
//       label: 'Department',
//       sortable: true,
//       render: (student) => student.department?.department_name || 'N/A'
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       sortable: true,
//       render: (student) => student.semester?.semester_name || 'N/A'
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       sortable: true,
//       render: (student) => getStatusBadge(student.status)
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (student) => (
//         <div className="flex items-center gap-2">
//           <button onClick={() => handleViewStudent(student)} title="View">
//             <Eye className="w-4 h-4 text-blue-500" />
//           </button>
//           <button onClick={() => handleEditStudent(student)} title="Edit">
//             <Edit className="w-4 h-4 text-yellow-500" />
//           </button>
//           <button onClick={() => handleDeleteStudent(student)} title="Delete">
//             <Trash2 className="w-4 h-4 text-red-500" />
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div>
//       {/* UI layout, search, filter, table etc. would go here */}
//       {loading ? <LoadingSpinner /> : (
//         <DataTable
//           data={students}
//           columns={columns}
//           pagination={pagination}
//           onPageChange={handlePageChange}
//         />
//       )}

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete Student"
//         message="Are you sure you want to delete this student?"
//         onConfirm={confirmDelete}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//       />
//     </div>
//   );
// };

// export default Students;


// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search, Filter, Download } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import StudentForm from '../../components/Students/StudentForm';
// // import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.data.students);
//       setPagination((prev) => ({
//         ...prev,
//         total: response.data.total,
//         totalPages: response.data.totalPages,
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await departmentService.getAllDepartments();
//       setDepartments(response.departments || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const response = await semesterService.getAllSemesters();
//       setSemesters(response.data.semesters || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800',
//     };

//     return (
//       <span
//         className={`px-2 py-1 text-xs font-medium rounded-full ${
//           statusClasses[status] || 'bg-gray-100 text-gray-800'
//         }`}
//       >
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     {
//       key: 'stu_id',
//       label: 'Student ID',
//       sortable: true,
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       sortable: true,
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       sortable: true,
//     },
//     {
//       key: 'mobile',
//       label: 'Mobile',
//       sortable: false,
//     },
//     {
//       key: 'department',
//       label: 'Department',
//       sortable: true,
//       render: (student) => student.department?.department_name || 'N/A',
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       sortable: true,
//       render: (student) => student.semester?.semester_name || 'N/A',
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       sortable: true,
//       render: (student) => getStatusBadge(student.status),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (student) => (
//         <div className="flex items-center gap-2">
//           <button onClick={() => handleViewStudent(student)} title="View">
//             <Eye className="w-4 h-4 text-blue-500" />
//           </button>
//           <button onClick={() => handleEditStudent(student)} title="Edit">
//             <Edit className="w-4 h-4 text-yellow-500" />
//           </button>
//           <button onClick={() => handleDeleteStudent(student)} title="Delete">
//             <Trash2 className="w-4 h-4 text-red-500" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4">
//       {/* Header with Add, Export, Search and Filters */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Students</h1>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleAddStudent}
//             className="btn btn-primary flex items-center gap-1"
//             title="Add Student"
//           >
//             <Plus className="w-4 h-4" /> Add Student
//           </button>
//           <button
//             onClick={handleExportStudents}
//             className="btn btn-secondary flex items-center gap-1"
//             title="Export Students"
//           >
//             <Download className="w-4 h-4" /> Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex flex-wrap gap-3 mb-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by name, email, ID..."
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="input input-bordered w-full max-w-xs"
//         />
//         <select
//           value={departmentFilter}
//           onChange={(e) => handleFilterChange('department', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>
//               {dept.department_name}
//             </option>
//           ))}
//         </select>
//         <select
//           value={semesterFilter}
//           onChange={(e) => handleFilterChange('semester', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Semesters</option>
//           {semesters.map((sem) => (
//             <option key={sem._id} value={sem._id}>
//               {sem.semester_name}
//             </option>
//           ))}
//         </select>
//         <select
//           value={statusFilter}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//       </div>

//       {/* Students Data Table */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={students} columns={columns} pagination={pagination} onPageChange={handlePageChange} />
//       )}

//       {/* Student Form Modal */}
//       <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formMode === 'add' ? 'Add Student' : 'Edit Student'}>
//         <StudentForm
//           student={selectedStudent}
//           mode={formMode}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       {/* Student Details Modal (Enable if you have this component) */}
//       {/* {isDetailsModalOpen && selectedStudent && (
//         <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Student Details">
//           <StudentDetails student={selectedStudent} />
//         </Modal>
//       )} */}

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete Student"
//         message={`Are you sure you want to delete student "${selectedStudent?.name}"?`}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// };

// export default Students;




// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search, Filter, Download } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import StudentForm from '../../components/Students/StudentForm';
//  import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.data.students);
//       setPagination((prev) => ({
//         ...prev,
//         total: response.data.total,
//         totalPages: response.data.totalPages,
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await departmentService.getAllDepartments();
//       setDepartments(response.departments || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const response = await semesterService.getAllSemesters();
//       setSemesters(response.data.semesters || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800',
//     };

//     return (
//       <span
//         className={`px-2 py-1 text-xs font-medium rounded-full ${
//           statusClasses[status] || 'bg-gray-100 text-gray-800'
//         }`}
//       >
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     {
//       key: 'stu_id',
//       label: 'Student ID',
//       sortable: true,
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       sortable: true,
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       sortable: true,
//     },
//     {
//       key: 'mobile',
//       label: 'Mobile',
//       sortable: false,
//     },
//     {
//       key: 'department',
//       label: 'Department',
//       sortable: true,
//       render: (student) => student.department?.department_name || 'N/A',
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       sortable: true,
//       render: (student) => student.semester?.semester_name || 'N/A',
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       sortable: true,
//       render: (student) => getStatusBadge(student.status),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (student) => (
//         <div className="flex items-center gap-2">
//           <button onClick={() => handleViewStudent(student)} title="View">
//             <Eye className="w-4 h-4 text-blue-500" />
//           </button>
//           <button onClick={() => handleEditStudent(student)} title="Edit">
//             <Edit className="w-4 h-4 text-yellow-500" />
//           </button>
//           <button onClick={() => handleDeleteStudent(student)} title="Delete">
//             <Trash2 className="w-4 h-4 text-red-500" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4">
//       {/* Header with Add, Export, Search and Filters */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Students</h1>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleAddStudent}
//             className="btn btn-primary flex items-center gap-1"
//             title="Add Student"
//           >
//             <Plus className="w-4 h-4" /> Add Student
//           </button>
//           <button
//             onClick={handleExportStudents}
//             className="btn btn-secondary flex items-center gap-1"
//             title="Export Students"
//           >
//             <Download className="w-4 h-4" /> Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex flex-wrap gap-3 mb-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by name, email, ID..."
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="input input-bordered w-full max-w-xs"
//         />
//         <select
//           value={departmentFilter}
//           onChange={(e) => handleFilterChange('department', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>
//               {dept.department_name}
//             </option>
//           ))}
//         </select>
//         <select
//           value={semesterFilter}
//           onChange={(e) => handleFilterChange('semester', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Semesters</option>
//           {semesters.map((sem) => (
//             <option key={sem._id} value={sem._id}>
//               {sem.semester_name}
//             </option>
//           ))}
//         </select>
//         <select
//           value={statusFilter}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//       </div>

//       {/* Students Data Table */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={students} columns={columns} pagination={pagination} onPageChange={handlePageChange} />
//       )}

//       {/* Student Form Modal */}
//       <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formMode === 'add' ? 'Add Student' : 'Edit Student'}>
//         <StudentForm
//           student={selectedStudent}
//           mode={formMode}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       {/* Student Details Modal (Enable if you have this component) */}
//       {isDetailsModalOpen && selectedStudent && (
//         <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Student Details">
//           <StudentDetails student={selectedStudent} />
//         </Modal>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete Student"
//         message={`Are you sure you want to delete student "${selectedStudent?.name}"?`}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// };

// export default Students;
// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import StudentForm from '../../components/Students/StudentForm';
// import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.data.students || []);
//       setPagination((prev) => ({
//         ...prev,
//         total: response.data.total || 0,
//         totalPages: response.data.totalPages || 0,
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchDepartments = async () => {
//   //   try {
//   //     const response = await departmentService.getAllDepartments();
//   //     // Defensive: ensure response.data is array
//   //      console.log('Departments API response:', response.data);
//   //     setDepartments(Array.isArray(response.data) ? response.data : []);
//   //   } catch (error) {
//   //     console.error('Error fetching departments:', error);
//   //     setDepartments([]);
//   //   }
//   // };

//   const fetchDepartments = async () => {
//   try {
//     const departmentsList = await departmentService.getAllDepartments();
//     setDepartments(departmentsList);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     setDepartments([]);
//   }
// };

//   const fetchSemesters = async () => {
//     try {
//       const response = await semesterService.getAllSemesters();
//       // Defensive: ensure response.data is array
//        console.log('Semester API response:', response.data);
//       setSemesters(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//       setSemesters([]);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800',
//     };

//     return (
//       <span
//         className={`px-2 py-1 text-xs font-medium rounded-full ${
//           statusClasses[status] || 'bg-gray-100 text-gray-800'
//         }`}
//       >
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     {
//       key: 'stu_id',
//       label: 'Student ID',
//       sortable: true,
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       sortable: true,
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       sortable: true,
//     },
//     {
//       key: 'mobile',
//       label: 'Mobile',
//       sortable: false,
//     },
//     {
//       key: 'department',
//       label: 'Department',
//       sortable: true,
//       render: (student) => student.department?.department_name || 'N/A',
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       sortable: true,
//       render: (student) => student.semester?.semester_name || 'N/A',
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       sortable: true,
//       render: (student) => getStatusBadge(student.status),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (student) => (
//         <div className="flex items-center gap-2">
//           <button onClick={() => handleViewStudent(student)} title="View">
//             <Eye className="w-4 h-4 text-blue-500" />
//           </button>
//           <button onClick={() => handleEditStudent(student)} title="Edit">
//             <Edit className="w-4 h-4 text-yellow-500" />
//           </button>
//           <button onClick={() => handleDeleteStudent(student)} title="Delete">
//             <Trash2 className="w-4 h-4 text-red-500" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4 mt-5">
//       {/* Header with Add, Export, Search and Filters */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Students</h1>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleAddStudent}
//             className="btn btn-primary flex items-center gap-1"
//             title="Add Student"
//           >
//             <Plus className="w-4 h-4" /> Add Student
//           </button>
//           <button
//             onClick={handleExportStudents}
//             className="btn btn-secondary flex items-center gap-1"
//             title="Export Students"
//           >
//             <Download className="w-4 h-4" /> Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex flex-wrap gap-3 mb-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by name, email, ID..."
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="input input-bordered w-full max-w-xs"
//         />
//         <select
//           value={departmentFilter}
//           onChange={(e) => handleFilterChange('department', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>
//               {dept.departmentName}
//             </option>
//           ))}
//         </select>
//         <select
//           value={semesterFilter}
//           onChange={(e) => handleFilterChange('semester', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Semesters</option>
//           {semesters.map((sem) => (
//             <option key={sem._id} value={sem._id}>
//               {sem.semester_name}
//             </option>
//           ))}
//         </select>
//         <select
//           value={statusFilter}
//           onChange={(e) => handleFilterChange('status', e.target.value)}
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//       </div>

//       {/* Students Data Table */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={students} columns={columns} pagination={pagination} onPageChange={handlePageChange} />
//       )}

//       {/* Student Form Modal */}
//       <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formMode === 'add' ? 'Add Student' : 'Edit Student'}>
//         <StudentForm
//           student={selectedStudent}
//           mode={formMode}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       {/* Student Details Modal */}
//       {isDetailsModalOpen && selectedStudent && (
//         <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Student Details">
//           <StudentDetails student={selectedStudent} />
//         </Modal>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete Student"
//         message={`Are you sure you want to delete student "${selectedStudent?.name}"?`}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// };

// export default Students;

// pages/Students.jsx
// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import StudentForm from '../../components/Students/StudentForm';
// import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.students || []);
//       setPagination((prev) => ({
//         ...prev,
//         total: response.total || 0,
//         totalPages: response.totalPages || 0,
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await departmentService.getAllDepartments();
//       setDepartments(res.data || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       setDepartments([]);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAllSemesters();
//       setSemesters(res.data || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//       setSemesters([]);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800',
//     };

//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     { key: 'stu_id', label: 'Student ID', sortable: true },
//     { key: 'name', label: 'Name', sortable: true },
//     { key: 'email', label: 'Email', sortable: true },
//     { key: 'mobile', label: 'Mobile' },
//     {
//       key: 'department',
//       label: 'Department',
//       render: (student) => student.department?.department_name || 'N/A',
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       render: (student) => student.semester?.semester_name || 'N/A',
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       render: (student) => getStatusBadge(student.status),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (student) => (
//         <div className="flex items-center gap-2">
//           <button onClick={() => handleViewStudent(student)} title="View"><Eye className="w-4 h-4 text-blue-500" /></button>
//           <button onClick={() => handleEditStudent(student)} title="Edit"><Edit className="w-4 h-4 text-yellow-500" /></button>
//           <button onClick={() => handleDeleteStudent(student)} title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4 mt-5">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Students</h1>
//         <div className="flex items-center gap-2">
//           <button onClick={handleAddStudent} className="btn btn-primary flex items-center gap-1" title="Add Student">
//             <Plus className="w-4 h-4" /> Add Student
//           </button>
//           <button onClick={handleExportStudents} className="btn btn-secondary flex items-center gap-1" title="Export Students">
//             <Download className="w-4 h-4" /> Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-wrap gap-3 mb-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by name, email, ID..."
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="input input-bordered w-full max-w-xs"
//         />
//         <select value={departmentFilter} onChange={(e) => handleFilterChange('department', e.target.value)} className="select select-bordered max-w-xs">
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>{dept.department_name}</option>
//           ))}
//         </select>
//         <select value={semesterFilter} onChange={(e) => handleFilterChange('semester', e.target.value)} className="select select-bordered max-w-xs">
//           <option value="">All Semesters</option>
//           {semesters.map((sem) => (
//             <option key={sem._id} value={sem._id}>{sem.semester_name}</option>
//           ))}
//         </select>
//         <select value={statusFilter} onChange={(e) => handleFilterChange('status', e.target.value)} className="select select-bordered max-w-xs">
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//       </div>

//       {/* Data Table */}
//       {loading ? <LoadingSpinner /> : (
//         <DataTable data={students} columns={columns} pagination={pagination} onPageChange={handlePageChange} />
//       )}

//       <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formMode === 'add' ? 'Add Student' : 'Edit Student'}>
//         <StudentForm
//           student={selectedStudent}
//           mode={formMode}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       {isDetailsModalOpen && selectedStudent && (
//         <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Student Details">
//           <StudentDetails student={selectedStudent} />
//         </Modal>
//       )}

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete Student"
//         message={`Are you sure you want to delete student "${selectedStudent?.name}"?`}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// };

// export default Students;


// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService'; // ✅ Fixed here
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import StudentForm from '../../components/Students/StudentForm';
// import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.students || []);
//       setPagination((prev) => ({
//         ...prev,
//         total: response.total || 0,
//         totalPages: response.totalPages || 0,
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await departmentService.getAllDepartments();
//       setDepartments(res || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       setDepartments([]);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAllSemesters();
//       setSemesters(res.data || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//       setSemesters([]);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent.stu_id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent.stu_id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800',
//     };

//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     { key: 'stu_id', label: 'Student ID', sortable: true },
//     { key: 'name', label: 'Name', sortable: true },
//     { key: 'email', label: 'Email', sortable: true },
//     { key: 'mobile', label: 'Mobile' },
//     {
//       key: 'department',
//       label: 'Department',
//       render: (student) => student.department?.department_name || 'N/A',
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       render: (student) => student.semester?.semester_name || 'N/A',
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       render: (student) => getStatusBadge(student.status),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (student) => (
//         <div className="flex items-center gap-2">
//           <button onClick={() => handleViewStudent(student)} title="View"><Eye className="w-4 h-4 text-blue-500" /></button>
//           <button onClick={() => handleEditStudent(student)} title="Edit"><Edit className="w-4 h-4 text-yellow-500" /></button>
//           <button onClick={() => handleDeleteStudent(student)} title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4 mt-5">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Students</h1>
//         <div className="flex items-center gap-2">
//           <button onClick={handleAddStudent} className="btn btn-primary flex items-center gap-1" title="Add Student">
//             <Plus className="w-4 h-4" /> Add Student
//           </button>
//           <button onClick={handleExportStudents} className="btn btn-secondary flex items-center gap-1" title="Export Students">
//             <Download className="w-4 h-4" /> Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-wrap gap-3 mb-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by name, email, ID..."
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="input input-bordered w-full max-w-xs"
//         />
//         <select value={departmentFilter} onChange={(e) => handleFilterChange('department', e.target.value)} className="select select-bordered max-w-xs">
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>{dept.department_name}</option>
//           ))}
//         </select>
//         <select value={semesterFilter} onChange={(e) => handleFilterChange('semester', e.target.value)} className="select select-bordered max-w-xs">
//           <option value="">All Semesters</option>
//           {semesters.map((sem) => (
//             <option key={sem._id} value={sem._id}>{sem.semester_name}</option>
//           ))}
//         </select>
//         <select value={statusFilter} onChange={(e) => handleFilterChange('status', e.target.value)} className="select select-bordered max-w-xs">
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//       </div>

//       {/* Data Table */}
//       {loading ? <LoadingSpinner /> : (
//         <DataTable data={students} columns={columns} pagination={pagination} onPageChange={handlePageChange} />
//       )}

//       <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formMode === 'add' ? 'Add Student' : 'Edit Student'}>
//         <StudentForm
//           student={selectedStudent}
//           mode={formMode}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       {isDetailsModalOpen && selectedStudent && (
//         <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Student Details">
//           <StudentDetails student={selectedStudent} />
//         </Modal>
//       )}

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete Student"
//         message={`Are you sure you want to delete student "${selectedStudent?.name}"?`}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// };

// export default Students;


// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Download, RotateCcw } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import StudentForm from '../../components/Students/StudentForm';
// import StudentDetails from '../../components/Students/StudentDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [semesterFilter, setSemesterFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter, semesterFilter, statusFilter]);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       };

//       const response = await studentService.getAllStudents(params);
//       setStudents(response.students || []);
//       setPagination((prev) => ({
//         ...prev,
//         total: response.total || 0,
//         totalPages: response.totalPages || 0,
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch students');
//       console.error('Error fetching students:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await departmentService.getAllDepartments();
//       setDepartments(res.data || []);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       setDepartments([]);
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAllSemesters();
//       setSemesters(res.data || []);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//       setSemesters([]);
//     }
//   };

//   const handleAddStudent = () => {
//     setSelectedStudent(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditStudent = (student) => {
//     setSelectedStudent(student);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteStudent = (student) => {
//     setSelectedStudent(student);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await studentService.deleteStudent(selectedStudent._id);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//       setIsDeleteDialogOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error('Failed to delete student');
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await studentService.createStudent(formData);
//         toast.success('Student added successfully');
//       } else {
//         await studentService.updateStudent(selectedStudent._id, formData);
//         toast.success('Student updated successfully');
//       }

//       fetchStudents();
//       setIsFormModalOpen(false);
//       setSelectedStudent(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} student`);
//       console.error(`Error ${formMode}ing student:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleFilterChange = (filterType, value) => {
//     switch (filterType) {
//       case 'department':
//         setDepartmentFilter(value);
//         break;
//       case 'semester':
//         setSemesterFilter(value);
//         break;
//       case 'status':
//         setStatusFilter(value);
//         break;
//       default:
//         break;
//     }
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   // Reset all filters and search
//   const handleResetFilters = () => {
//     setSearchTerm('');
//     setDepartmentFilter('');
//     setSemesterFilter('');
//     setStatusFilter('');
//     setPagination((prev) => ({ ...prev, page: 1 }));
//     toast.success('Filters reset successfully');
//   };

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const handleExportStudents = async () => {
//     try {
//       const response = await studentService.exportStudents({
//         search: searchTerm,
//         department: departmentFilter,
//         semester: semesterFilter,
//         status: statusFilter,
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success('Students exported successfully');
//     } catch (error) {
//       toast.error('Failed to export students');
//       console.error('Error exporting students:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-red-100 text-red-800',
//       suspended: 'bg-yellow-100 text-yellow-800',
//     };

//     return (
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
//       </span>
//     );
//   };

//   const columns = [
//     { key: 'stu_id', label: 'Student ID', sortable: true },
//     { key: 'name', label: 'Name', sortable: true },
//     { key: 'eid', label: 'Email', sortable: true },
//     { key: 'mobile', label: 'Mobile' },
//     {
//       key: 'department',
//       label: 'Department',
//       render: (student) => student.department_id?.department_name || 'N/A',
//     },
//     {
//       key: 'semester',
//       label: 'Semester',
//       render: (student) => student.sem_id?.semester_name || 'N/A',
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       render: (student) => getStatusBadge(student.status),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (student) => (
//         <div className="flex items-center gap-2">
//           <button onClick={() => handleViewStudent(student)} title="View">
//             <Eye className="w-4 h-4 text-blue-500" />
//           </button>
//           <button onClick={() => handleEditStudent(student)} title="Edit">
//             <Edit className="w-4 h-4 text-yellow-500" />
//           </button>
//           <button onClick={() => handleDeleteStudent(student)} title="Delete">
//             <Trash2 className="w-4 h-4 text-red-500" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4 mt-5">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Students</h1>
//         <div className="flex items-center gap-2">
//           <button 
//             onClick={handleAddStudent} 
//             className="btn btn-primary flex items-center gap-1" 
//             title="Add Student"
//           >
//             <Plus className="w-4 h-4" /> Add Student
//           </button>
//           <button 
//             onClick={handleExportStudents} 
//             className="btn btn-secondary flex items-center gap-1" 
//             title="Export Students"
//           >
//             <Download className="w-4 h-4" /> Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-wrap gap-3 mb-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by name, email, ID..."
//           value={searchTerm}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="input input-bordered w-full max-w-xs"
//         />
//         <select 
//           value={departmentFilter} 
//           onChange={(e) => handleFilterChange('department', e.target.value)} 
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>{dept.department_name}</option>
//           ))}
//         </select>
//         <select 
//           value={semesterFilter} 
//           onChange={(e) => handleFilterChange('semester', e.target.value)} 
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Semesters</option>
//           {semesters.map((sem) => (
//             <option key={sem._id} value={sem._id}>{sem.semester_name}</option>
//           ))}
//         </select>
//         <select 
//           value={statusFilter} 
//           onChange={(e) => handleFilterChange('status', e.target.value)} 
//           className="select select-bordered max-w-xs"
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//         <button 
//           onClick={handleResetFilters} 
//           className="btn btn-outline flex items-center gap-1" 
//           title="Reset Filters"
//         >
//           <RotateCcw className="w-4 h-4" /> Reset
//         </button>
//       </div>

//       {/* Data Table */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable 
//           data={students} 
//           columns={columns} 
//           pagination={pagination} 
//           onPageChange={handlePageChange} 
//         />
//       )}

//       {/* Modals */}
//       <Modal 
//         isOpen={isFormModalOpen} 
//         onClose={() => setIsFormModalOpen(false)} 
//         title={formMode === 'add' ? 'Add Student' : 'Edit Student'}
//       >
//         <StudentForm
//           student={selectedStudent}
//           mode={formMode}
//           departments={departments}
//           semesters={semesters}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       {isDetailsModalOpen && selectedStudent && (
//         <Modal 
//           isOpen={isDetailsModalOpen} 
//           onClose={() => setIsDetailsModalOpen(false)} 
//           title="Student Details"
//         >
//           <StudentDetails student={selectedStudent} />
//         </Modal>
//       )}

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete Student"
//         message={`Are you sure you want to delete student "${selectedStudent?.name}"?`}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// };

// export default Students;


// Students.jsx
// // Students.jsx
// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     student_name: '',
//     email: '',
//     roll_number: '',
//     department_id: '',
//     sem_id: '',
//   });

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await studentService.getAllStudents();
//       const studentsArray = Array.isArray(res) ? res : res.data || [];
//       setStudents(studentsArray);
//     } catch (error) {
//       toast.error('Failed to load students');
//     }
//     setLoading(false);
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await departmentService.getAllDepartments();
//       const depts = Array.isArray(res) ? res : res.data || [];
//       setDepartments(depts);
//     } catch (error) {
//       toast.error('Failed to load departments');
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAllSemesters();
//       console.log('Fetched semesters:', res);
//       const sems = Array.isArray(res) ? res : res.data || [];
//       if (Array.isArray(sems)) {
//         setSemesters(sems);
//       } else {
//         console.warn('Unexpected semester format:', res);
//         setSemesters([]);
//       }
//     } catch (error) {
//       toast.error('Failed to load semesters');
//       setSemesters([]);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await studentService.createStudent(formData);
//       toast.success('Student created successfully');
//       fetchStudents();
//       setModalOpen(false);
//     } catch (error) {
//       toast.error('Failed to create student');
//     }
//   };

//   const columns = [
//     { label: 'Name', field: 'student_name' },
//     { label: 'Email', field: 'email' },
//     { label: 'Roll Number', field: 'roll_number' },
//     {
//       label: 'Department',
//       field: 'department_id.department_name',
//       render: (row) => row.department_id?.department_name || '-',
//     },
//     {
//       label: 'Semester',
//       field: 'sem_id.semester_name',
//       render: (row) => row.sem_id?.semester_name || '-',
//     },
//     {
//       label: 'Actions',
//       field: 'actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button><Edit size={16} /></button>
//           <button><Trash2 size={16} /></button>
//           <button><Eye size={16} /></button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Students</h2>
//         <button
//           className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
//           onClick={() => setModalOpen(true)}
//         >
//           <Plus size={16} /> Add Student
//         </button>
//       </div>

//       <DataTable data={students} columns={columns} loading={loading} />

//       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Student">
//         <div className="space-y-3">
//           <input
//             type="text"
//             name="student_name"
//             placeholder="Student Name"
//             className="w-full border p-2 rounded"
//             value={formData.student_name}
//             onChange={handleInputChange}
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full border p-2 rounded"
//             value={formData.email}
//             onChange={handleInputChange}
//           />
//           <input
//             type="text"
//             name="roll_number"
//             placeholder="Roll Number"
//             className="w-full border p-2 rounded"
//             value={formData.roll_number}
//             onChange={handleInputChange}
//           />
//           <select
//             name="department_id"
//             className="w-full border p-2 rounded"
//             value={formData.department_id}
//             onChange={handleInputChange}
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept._id} value={dept._id}>
//                 {dept.department_name}
//               </option>
//             ))}
//           </select>
//           <select
//             name="sem_id"
//             className="w-full border p-2 rounded"
//             value={formData.sem_id}
//             onChange={handleInputChange}
//           >
//             <option value="">Select Semester</option>
//             {semesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semester_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-end mt-4">
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded"
//             onClick={handleSubmit}
//           >
//             Save
//           </button>
//         </div>
//       </Modal>

//       {loading && <LoadingSpinner />}
//     </div>
//   );
// };

// export default Students;



// // Students.jsx
// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     student_name: '',
//     email: '',
//     roll_number: '',
//     department_id: '',
//     sem_id: '',
//   });

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await studentService.getAllStudents();
//       setStudents(Array.isArray(res) ? res : res.data || []);
//     } catch (error) {
//       toast.error('Failed to load students');
//     }
//     setLoading(false);
//   };

//   const fetchDepartments = async () => {
//     try {
//       const { departments } = await departmentService.getAllDepartments();
//       setDepartments(Array.isArray(departments) ? departments : []);
//     } catch (error) {
//       toast.error('Failed to load departments');
//       setDepartments([]);
//     }
//   };

//   // const fetchSemesters = async () => {
//   //   try {
//   //     const res = await semesterService.getAllSemesters();
//   //     const semArray = Array.isArray(res) ? res : res.data || [];
//   //     setSemesters(Array.isArray(semArray) ? semArray : []);
//   //   } catch (error) {
//   //     toast.error('Failed to load semesters');
//   //     setSemesters([]);
//   //   }
//   // };
//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAllSemesters();
//       if (res && res.data && Array.isArray(res.data.semesters)) {
//         setSemesters(res.data.semesters);
//       } else {
//         console.warn('Semesters not found in expected format', res);
//         toast.warn('Semesters not found');
//       }
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//       toast.error('Failed to load semesters');
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//     fetchDepartments();
//     fetchSemesters();
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await studentService.createStudent(formData);
//       toast.success('Student created successfully');
//       fetchStudents();
//       setModalOpen(false);
//     } catch (error) {
//       toast.error('Failed to create student');
//     }
//   };

//   const columns = [
//     { label: 'Name', field: 'student_name' },
//     { label: 'Email', field: 'email' },
//     { label: 'Roll Number', field: 'roll_number' },
//     {
//       label: 'Department',
//       field: 'department_id.department_name',
//       render: (row) => row.department_id?.department_name || '-',
//     },
//     {
//       label: 'Semester',
//       field: 'sem_id.semester_name',
//       render: (row) => row.sem_id?.semester_name || '-',
//     },
//     {
//       label: 'Actions',
//       field: 'actions',
//       render: (row) => (
//         <div className="flex gap-2">
//           <button><Edit size={16} /></button>
//           <button><Trash2 size={16} /></button>
//           <button><Eye size={16} /></button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className='mt-5'>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Students</h2>
//         <button
//           className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
//           onClick={() => setModalOpen(true)}
//         >
//           <Plus size={16} /> Add Student
//         </button>
//       </div>

//       <DataTable data={students} columns={columns} loading={loading} />

//       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Student">
//         <div className="space-y-3">
//           <input
//             type="text"
//             name="student_name"
//             placeholder="Student Name"
//             className="w-full border p-2 rounded"
//             value={formData.student_name}
//             onChange={handleInputChange}
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full border p-2 rounded"
//             value={formData.email}
//             onChange={handleInputChange}
//           />
//           <input
//             type="text"
//             name="roll_number"
//             placeholder="Roll Number"
//             className="w-full border p-2 rounded"
//             value={formData.roll_number}
//             onChange={handleInputChange}
//           />
//           <select
//             name="department_id"
//             className="w-full border p-2 rounded"
//             value={formData.department_id}
//             onChange={handleInputChange}
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept._id} value={dept._id}>
//                 {dept.departmentName || dept.department_name}
//               </option>
//             ))}
//           </select>
//           <select
//             name="sem_id"
//             className="w-full border p-2 rounded"
//             value={formData.sem_id}
//             onChange={handleInputChange}
//           >
//             <option value="">Select Semester</option>
//             {semesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semester_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-end mt-4">
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded"
//             onClick={handleSubmit}
//           >
//             Save
//           </button>
//         </div>
//       </Modal>

//       {loading && <LoadingSpinner />}
//     </div>
//   );
// };

// export default Students;


// Students.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

import studentService from '../../services/studentService';
import departmentService from '../../services/departmentService';
import { semesterService } from '../../services/semesterService';

import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    roll_number: '',
    department_id: '',
    sem_id: '',
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAllStudents();
      setStudents(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      toast.error('Failed to load students');
    }
    setLoading(false);
  };

  const fetchDepartments = async () => {
    try {
      const { departments } = await departmentService.getAllDepartments();
      setDepartments(Array.isArray(departments) ? departments : []);
    } catch (error) {
      toast.error('Failed to load departments');
      setDepartments([]);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await semesterService.getAllSemesters();

      // Adjust based on API structure
      if (res && Array.isArray(res.semesters)) {
        setSemesters(res.semesters);
      } else if (res && res.data && Array.isArray(res.data.semesters)) {
        setSemesters(res.data.semesters);
      } else if (Array.isArray(res)) {
        setSemesters(res);
      } else {
        console.warn('Unexpected semester data:', res);
        toast.warn('Semesters not found');
        setSemesters([]);
      }
    } catch (error) {
      console.error('Error fetching semesters:', error);
      toast.error('Failed to load semesters');
      setSemesters([]);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchSemesters();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await studentService.createStudent(formData);
      toast.success('Student created successfully');
      fetchStudents();
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to create student');
    }
  };

  const columns = [
    { label: 'Name', field: 'student_name' },
    { label: 'Email', field: 'email' },
    { label: 'Roll Number', field: 'roll_number' },
    {
      label: 'Department',
      field: 'department_id.department_name',
      render: (row) => row.department_id?.department_name || '-',
    },
    {
      label: 'Semester',
      field: 'sem_id.semester_name',
      render: (row) => row.sem_id?.semesterName || row.sem_id?.semester_name || '-',
    },
    {
      label: 'Actions',
      field: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button><Edit size={16} /></button>
          <button><Trash2 size={16} /></button>
          <button><Eye size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Students</h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      <DataTable data={students} columns={columns} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Student">
        <div className="space-y-3">
          <input
            type="text"
            name="student_name"
            placeholder="Student Name"
            className="w-full border p-2 rounded"
            value={formData.student_name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="roll_number"
            placeholder="Roll Number"
            className="w-full border p-2 rounded"
            value={formData.roll_number}
            onChange={handleInputChange}
          />
          <select
            name="department_id"
            className="w-full border p-2 rounded"
            value={formData.department_id}
            onChange={handleInputChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentName || dept.department_name}
              </option>
            ))}
          </select>
          <select
            name="sem_id"
            className="w-full border p-2 rounded"
            value={formData.sem_id}
            onChange={handleInputChange}
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.semesterName || sem.semester_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </Modal>

      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Students;
