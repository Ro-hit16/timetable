// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
// import { toast } from 'react-toastify';
// import teacherService from '../../services/teacherService';
// import departmentService from '../../services/departmentService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import TeacherForm from '../../components/Teachers/TeacherForm';
// import TeacherDetails from '../../components/Teachers/TeacherDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog.jsx';

// const Teachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   useEffect(() => {
//     fetchTeachers();
//     fetchDepartments();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter]);

//   const fetchTeachers = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter
//       };
      
//       const response = await teacherService.getAllTeachers(params);
//       setTeachers(response.data.teachers);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data.total,
//         totalPages: response.data.totalPages
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch teachers');
//       console.error('Error fetching teachers:', error);
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

//   const handleAddTeacher = () => {
//     setSelectedTeacher(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await teacherService.deleteTeacher(selectedTeacher.teacher_id);
//       toast.success('Teacher deleted successfully');
//       fetchTeachers();
//       setIsDeleteDialogOpen(false);
//       setSelectedTeacher(null);
//     } catch (error) {
//       toast.error('Failed to delete teacher');
//       console.error('Error deleting teacher:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await teacherService.createTeacher(formData);
//         toast.success('Teacher added successfully');
//       } else {
//         await teacherService.updateTeacher(selectedTeacher.teacher_id, formData);
//         toast.success('Teacher updated successfully');
//       }
      
//       fetchTeachers();
//       setIsFormModalOpen(false);
//       setSelectedTeacher(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} teacher`);
//       console.error(`Error ${formMode}ing teacher:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleDepartmentFilter = (value) => {
//     setDepartmentFilter(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const columns = [
//     {
//       key: 'teacher_id',
//       label: 'Teacher ID',
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
//       render: (teacher) => teacher.department?.department_name || 'N/A'
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       sortable: false,
//       render: (teacher) => (
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => handleViewTeacher(teacher)}
//             className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
//             title="View Details"
//           >
//             <Eye size={16} />
//           </button>
//           <button
//             onClick={() => handleEditTeacher(teacher)}
//             className="p-1 text-green-600 hover:text-green-800 transition-colors"
//             title="Edit"
//           >
//             <Edit size={16} />
//           </button>
//           <button
//             onClick={() => handleDeleteTeacher(teacher)}
//             className="p-1 text-red-600 hover:text-red-800 transition-colors"
//             title="Delete"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )
//     }
//   ];

//   if (loading && teachers.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingSpinner size="large" text="Loading teachers..." />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
//           <p className="text-gray-600">Manage teacher information and assignments</p>
//         </div>
//         <button
//           onClick={handleAddTeacher}
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           <Plus size={20} className="mr-2" />
//           Add Teacher
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Search Teachers
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
//               Filter by Department
//             </label>
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <select
//                 value={departmentFilter}
//                 onChange={(e) => handleDepartmentFilter(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">All Departments</option>
//                 {departments.map((dept) => (
//                   <option key={dept.department_id} value={dept.department_id}>
//                     {dept.department_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setDepartmentFilter('');
//                 setPagination(prev => ({ ...prev, page: 1 }));
//               }}
//               className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Teachers Table */}
//       <div className="bg-white rounded-lg shadow">
//         <DataTable
//           data={teachers}
//           columns={columns}
//           loading={loading}
//           pagination={{
//             current: pagination.page,
//             total: pagination.totalPages,
//             pageSize: pagination.limit,
//             totalItems: pagination.total,
//             onPageChange: handlePageChange
//           }}
//           emptyMessage="No teachers found"
//         />
//       </div>

//       {/* Add/Edit Teacher Modal */}
//       <Modal
//         isOpen={isFormModalOpen}
//         onClose={() => {
//           setIsFormModalOpen(false);
//           setSelectedTeacher(null);
//         }}
//         title={`${formMode === 'add' ? 'Add New' : 'Edit'} Teacher`}
//         size="large"
//       >
//         <TeacherForm
//           teacher={selectedTeacher}
//           departments={departments}
//           onSubmit={handleFormSubmit}
//           onCancel={() => {
//             setIsFormModalOpen(false);
//             setSelectedTeacher(null);
//           }}
//           mode={formMode}
//         />
//       </Modal>

//       {/* Teacher Details Modal */}
//       <Modal
//         isOpen={isDetailsModalOpen}
//         onClose={() => {
//           setIsDetailsModalOpen(false);
//           setSelectedTeacher(null);
//         }}
//         title="Teacher Details"
//         size="large"
//       >
//         {selectedTeacher && (
//           <TeacherDetails
//             teacher={selectedTeacher}
//             onEdit={() => {
//               setIsDetailsModalOpen(false);
//               handleEditTeacher(selectedTeacher);
//             }}
//             onClose={() => {
//               setIsDetailsModalOpen(false);
//               setSelectedTeacher(null);
//             }}
//           />
//         )}
//       </Modal>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         onClose={() => {
//           setIsDeleteDialogOpen(false);
//           setSelectedTeacher(null);
//         }}
//         onConfirm={confirmDelete}
//         title="Delete Teacher"
//         message={`Are you sure you want to delete ${selectedTeacher?.name}? This action cannot be undone.`}
//         type="danger"
//       />
//     </div>
//   );
// };

// export default Teachers;

// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
// import { toast } from 'react-toastify';
// import teacherService from '../../services/teacherService';
// import departmentService from '../../services/departmentService';
// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import TeacherForm from '../../components/Teachers/TeacherForm';
// import TeacherDetails from '../../components/Teachers/TeacherDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog.jsx';

// const Teachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   useEffect(() => {
//     fetchTeachers();
//     fetchDepartments();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter]);

//   const fetchTeachers = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter
//       };
//       const response = await teacherService.getAllTeachers(params);
//       setTeachers(response.data.teachers);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data.total,
//         totalPages: response.data.totalPages
//       }));
//     } catch (error) {
//       toast.error('Failed to fetch teachers');
//       console.error('Error fetching teachers:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchDepartments = async () => {
//   //   try {
//   //     const response = await departmentService.getAllDepartments();
//   //     setDepartments(response.data.departments || []);
//   //   } catch (error) {
//   //     console.error('Error fetching departments:', error);
//   //   }
//   // };
//   const fetchDepartments = async () => {
//   try {
//     const res = await departmentService.getAllDepartments();
//     console.log('Fetched departments:', res);

//     // Safely access departments
//     const deptList = res?.data?.departments || []; 
//     setDepartments(deptList);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//   }
// };

//   const handleAddTeacher = () => {
//     setSelectedTeacher(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await teacherService.deleteTeacher(selectedTeacher.teacher_id);
//       toast.success('Teacher deleted successfully');
//       fetchTeachers();
//       setIsDeleteDialogOpen(false);
//       setSelectedTeacher(null);
//     } catch (error) {
//       toast.error('Failed to delete teacher');
//       console.error('Error deleting teacher:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await teacherService.createTeacher(formData);
//         toast.success('Teacher added successfully');
//       } else {
//         await teacherService.updateTeacher(selectedTeacher.teacher_id, formData);
//         toast.success('Teacher updated successfully');
//       }
//       fetchTeachers();
//       setIsFormModalOpen(false);
//       setSelectedTeacher(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} teacher`);
//       console.error(`Error ${formMode}ing teacher:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleDepartmentFilter = (value) => {
//     setDepartmentFilter(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const columns = [
//     {
//       key: 'teacher_id',
//       label: 'Teacher ID',
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
//       render: (teacher) => teacher.department?.department_name || 'N/A'
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       sortable: false,
//       render: (teacher) => (
//         <div className="flex items-center space-x-2">
//           <button onClick={() => handleViewTeacher(teacher)} className="p-1 text-blue-600 hover:text-blue-800" title="View">
//             <Eye size={16} />
//           </button>
//           <button onClick={() => handleEditTeacher(teacher)} className="p-1 text-green-600 hover:text-green-800" title="Edit">
//             <Edit size={16} />
//           </button>
//           <button onClick={() => handleDeleteTeacher(teacher)} className="p-1 text-red-600 hover:text-red-800" title="Delete">
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )
//     }
//   ];

//   if (loading && teachers.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingSpinner size="large" text="Loading teachers..." />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
//           <p className="text-gray-600">Manage teacher information and assignments</p>
//         </div>
//         <button
//           onClick={handleAddTeacher}
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           <Plus size={20} className="mr-2" />
//           Add Teacher
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Search */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Search Teachers</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search by name, email..."
//                 className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Department Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
//             <select
//               value={departmentFilter}
//               onChange={(e) => handleDepartmentFilter(e.target.value)}
//               className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Departments</option>
//               {departments.map((dept) => (
//                 <option key={dept._id} value={dept._id}>
//                   {dept.department_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <DataTable
//         data={teachers}
//         columns={columns}
//         pagination={pagination}
//         onPageChange={handlePageChange}
//       />

//       {/* Modals */}
//       <Modal
//         isOpen={isFormModalOpen}
//         onClose={() => setIsFormModalOpen(false)}
//         title={formMode === 'add' ? 'Add Teacher' : 'Edit Teacher'}
//       >
//         <TeacherForm
//           departments={departments}
//           initialData={formMode === 'edit' ? selectedTeacher : null}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       <Modal
//         isOpen={isDetailsModalOpen}
//         onClose={() => setIsDetailsModalOpen(false)}
//         title="Teacher Details"
//       >
//         <TeacherDetails teacher={selectedTeacher} />
//       </Modal>

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Confirm Deletion"
//         message={`Are you sure you want to delete ${selectedTeacher?.name}?`}
//         onConfirm={confirmDelete}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//       />
//     </div>
//   );
// };

// export default Teachers;


// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
// import { toast } from 'react-toastify';

// import teacherService from '../../services/teacherService';
// import departmentService from '../../services/departmentService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import TeacherForm from '../../components/Teachers/TeacherForm';
// import TeacherDetails from '../../components/Teachers/TeacherDetails';
// import ConfirmDialog from '../../components/Common/ConfirmDialog.jsx';

// const Teachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [formMode, setFormMode] = useState('add');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   useEffect(() => {
//     fetchTeachers();
//     fetchDepartments();
//   }, [pagination.page, pagination.limit, searchTerm, departmentFilter]);

//   const fetchTeachers = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         search: searchTerm,
//         department: departmentFilter
//       };

//       const data = await teacherService.getAllTeachers(params);

//       // Handle if full response is returned or just the array
//       const teachersData = Array.isArray(data) ? data : data.teachers || [];

//       setTeachers(teachersData);

//       if (!Array.isArray(data)) {
//         setPagination(prev => ({
//           ...prev,
//           total: data.total || 0,
//           totalPages: data.totalPages || 0
//         }));
//       }

//     } catch (error) {
//       toast.error('Failed to fetch teachers');
//       console.error('Error fetching teachers:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await departmentService.getAllDepartments();
//       const deptList = res?.data?.departments || [];
//       setDepartments(deptList);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const handleAddTeacher = () => {
//     setSelectedTeacher(null);
//     setFormMode('add');
//     setIsFormModalOpen(true);
//   };

//   const handleEditTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setFormMode('edit');
//     setIsFormModalOpen(true);
//   };

//   const handleViewTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setIsDetailsModalOpen(true);
//   };

//   const handleDeleteTeacher = (teacher) => {
//     setSelectedTeacher(teacher);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await teacherService.deleteTeacher(selectedTeacher.teacher_id);
//       toast.success('Teacher deleted successfully');
//       fetchTeachers();
//       setIsDeleteDialogOpen(false);
//       setSelectedTeacher(null);
//     } catch (error) {
//       toast.error('Failed to delete teacher');
//       console.error('Error deleting teacher:', error);
//     }
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (formMode === 'add') {
//         await teacherService.createTeacher(formData);
//         toast.success('Teacher added successfully');
//       } else {
//         await teacherService.updateTeacher(selectedTeacher.teacher_id, formData);
//         toast.success('Teacher updated successfully');
//       }
//       fetchTeachers();
//       setIsFormModalOpen(false);
//       setSelectedTeacher(null);
//     } catch (error) {
//       toast.error(`Failed to ${formMode} teacher`);
//       console.error(`Error ${formMode}ing teacher:`, error);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleDepartmentFilter = (value) => {
//     setDepartmentFilter(value);
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const columns = [
//     {
//       key: 'teacher_id',
//       label: 'Teacher ID',
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
//       render: (teacher) => teacher.department?.department_name || 'N/A'
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       sortable: false,
//       render: (teacher) => (
//         <div className="flex items-center space-x-2">
//           <button onClick={() => handleViewTeacher(teacher)} className="p-1 text-blue-600 hover:text-blue-800" title="View">
//             <Eye size={16} />
//           </button>
//           <button onClick={() => handleEditTeacher(teacher)} className="p-1 text-green-600 hover:text-green-800" title="Edit">
//             <Edit size={16} />
//           </button>
//           <button onClick={() => handleDeleteTeacher(teacher)} className="p-1 text-red-600 hover:text-red-800" title="Delete">
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )
//     }
//   ];

//   if (loading && teachers.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingSpinner size="large" text="Loading teachers..." />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
//           <p className="text-gray-600">Manage teacher information and assignments</p>
//         </div>
//         <button
//           onClick={handleAddTeacher}
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           <Plus size={20} className="mr-2" />
//           Add Teacher
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Search */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Search Teachers</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search by name, email..."
//                 className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Department Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
//             <select
//               value={departmentFilter}
//               onChange={(e) => handleDepartmentFilter(e.target.value)}
//               className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Departments</option>
//               {departments.map((dept) => (
//                 <option key={dept._id} value={dept._id}>
//                   {dept.department_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <DataTable
//         data={teachers}
//         columns={columns}
//         pagination={pagination}
//         onPageChange={handlePageChange}
//       />

//       {/* Modals */}
//       <Modal
//         isOpen={isFormModalOpen}
//         onClose={() => setIsFormModalOpen(false)}
//         title={formMode === 'add' ? 'Add Teacher' : 'Edit Teacher'}
//       >
//         <TeacherForm
//           departments={departments}
//           initialData={formMode === 'edit' ? selectedTeacher : null}
//           onSubmit={handleFormSubmit}
//           onCancel={() => setIsFormModalOpen(false)}
//         />
//       </Modal>

//       <Modal
//         isOpen={isDetailsModalOpen}
//         onClose={() => setIsDetailsModalOpen(false)}
//         title="Teacher Details"
//       >
//         <TeacherDetails teacher={selectedTeacher} />
//       </Modal>

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Confirm Deletion"
//         message={`Are you sure you want to delete ${selectedTeacher?.name}?`}
//         onConfirm={confirmDelete}
//         onCancel={() => setIsDeleteDialogOpen(false)}
//       />
//     </div>
//   );
// };

// export default Teachers;

// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchDepartments = async () => {
//     try {
//       console.log('Fetching departments using getDepartmentsForSelect...');
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       console.log('Formatted departments:', formattedDepartments);
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

//   const fetchSemesters = async () => {
//     try {
//       const res = await semesterService.getAllSemesters();
//       if (Array.isArray(res.semesters)) {
//         setSemesters(res.semesters);
//       } else {
//         console.warn('Semesters not found in expected format');
//       }
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//       toast.error('Failed to load semesters');
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchSemesters();
//   }, []);

//   return (
//     <div className='mt-5'>
//       <h2 className="text-xl font-bold mb-4">Teachers</h2>

//       {/* Filters */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.value} value={dept.value}>
//                 {dept.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="">-- Select Semester --</option>
//             {semesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semester_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* DataTable or Loading */}
//       {loading ? <LoadingSpinner /> : <DataTable data={[]} columns={[]} />}
//     </div>
//   );
// };

// export default Teachers;

// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
// import { toast } from 'react-toastify';

// import studentService from '../../services/studentService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchDepartments = async () => {
//     try {
//       console.log('Fetching departments using getDepartmentsForSelect...');
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       console.log('Formatted departments:', formattedDepartments);
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

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
//     fetchDepartments();
//     fetchSemesters();
//   }, []);

//   return (
//     <div className='mt-5'>
//       <h2 className="text-xl font-bold mb-4">Teachers</h2>

//       {/* Filters */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.value} value={dept.value}>
//                 {dept.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="">-- Select Semester --</option>
//             {semesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semesterName} {/* Make sure your model uses semesterName */}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* DataTable or Loading */}
//       {loading ? <LoadingSpinner /> : <DataTable data={[]} columns={[]} />}
//     </div>
//   );
// };

// export default Teachers;


// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// import departmentService from '../../services/departmentService';

// import DataTable from '../../components/Common/DataTable';
// import Modal from '../../components/Common/Modal';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchDepartments = async () => {
//     try {
//       console.log('Fetching departments using getDepartmentsForSelect...');
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       console.log('Formatted departments:', formattedDepartments);
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   // Manually define semesters 1 to 8
//   const manualSemesters = Array.from({ length: 8 }, (_, i) => ({
//     _id: (i + 1).toString(),
//     semesterName: `Semester ${i + 1}`
//   }));

//   return (
//     <div className="mt-5">
//       <h2 className="text-xl font-bold mb-4">Teachers</h2>

//       {/* Filters */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.value} value={dept.value}>
//                 {dept.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="">-- Select Semester --</option>
//             {manualSemesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semesterName}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* DataTable or Loading */}
//       {loading ? <LoadingSpinner /> : <DataTable data={[]} columns={[]} />}
//     </div>
//   );
// };

// export default Teachers;

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// import departmentService from '../../services/departmentService';

// import DataTable from '../../components/Common/DataTable';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: ''
//   });

//   const manualSemesters = Array.from({ length: 8 }, (_, i) => ({
//     _id: (i + 1).toString(),
//     semesterName: `Semester ${i + 1}`
//   }));

//   const fetchDepartments = async () => {
//     try {
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddTeacher = (e) => {
//     e.preventDefault();
//     if (!formData.name || !selectedDepartment || !selectedSemester) {
//       toast.warn('Please fill all fields');
//       return;
//     }

//     const newTeacher = {
//       id: Date.now().toString(),
//       name: formData.name,
//       department: departments.find(d => d.value === selectedDepartment)?.label || '',
//       semester: manualSemesters.find(s => s._id === selectedSemester)?.semesterName || ''
//     };

//     setTeachers((prev) => [...prev, newTeacher]);

//     toast.success('Teacher added');

//     // Reset form
//     setFormData({ name: '' });
//     setSelectedDepartment('');
//     setSelectedSemester('');
//   };

//   const columns = [
//     { Header: 'Name', accessor: 'name' },
//     { Header: 'Department', accessor: 'department' },
//     { Header: 'Semester', accessor: 'semester' }
//   ];

//   return (
//     <div className="mt-5">
//       <h2 className="text-xl font-bold mb-4">Teachers</h2>

//       {/* Form */}
//       <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block mb-1 font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2"
//             placeholder="Enter teacher name"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.value} value={dept.value}>
//                 {dept.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//           >
//             <option value="">-- Select Semester --</option>
//             {manualSemesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semesterName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-end">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
//           >
//             Add Teacher
//           </button>
//         </div>
//       </form>

//       {/* DataTable */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={teachers} columns={columns} />
//       )}
//     </div>
//   );
// };

// export default Teachers;


// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// import departmentService from '../../services/departmentService.js';
// import teacherService from '../../services/teacherService.js';

// import DataTable from '../../components/Common/DataTable.js';
// import LoadingSpinner from '../../components/Common/LoadingSpinner.js';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: ''
//   });

//   const manualSemesters = Array.from({ length: 8 }, (_, i) => ({
//     _id: (i + 1).toString(),
//     semesterName: `Semester ${i + 1}`
//   }));

//   // const fetchDepartments = async () => {
//   //   try {
//   //     const formattedDepartments = await departmentService.getDepartmentsForSelect();
//   //     setDepartments(formattedDepartments);
//   //   } catch (error) {
//   //     console.error('Error fetching departments:', error);
//   //     toast.error('Failed to load departments');
//   //   }
//   // };
// const fetchDepartments = async () => {
//     try {
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };
//   const fetchTeachers = async () => {
//     setLoading(true);
//     try {
//       const teachersData = await teacherService.getAllTeachers();
//       const formattedTeachers = teachersData.map(teacher => ({
//         id: teacher._id,
//         name: teacher.name,
//         department: teacher.department?.name || 'N/A',
//         semester: `Semester ${teacher.semester}`
//       }));
//       setTeachers(formattedTeachers);
//     } catch (error) {
//       console.error('Error fetching teachers:', error);
//       toast.error('Failed to load teachers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchTeachers();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddTeacher = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !selectedDepartment || !selectedSemester) {
//       toast.warn('Please fill all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const teacherData = {
//         name: formData.name,
//         department: selectedDepartment,
//         semester: parseInt(selectedSemester)
//       };

//       await teacherService.createTeacher(teacherData);
//       toast.success('Teacher added successfully');

//       // Reset form
//       setFormData({ name: '' });
//       setSelectedDepartment('');
//       setSelectedSemester('');

//       // Refresh teachers list
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error adding teacher:', error);
//       toast.error(error.message || 'Failed to add teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     { Header: 'Name', accessor: 'name' },
//     { Header: 'Department', accessor: 'department' },
//     { Header: 'Semester', accessor: 'semester' }
//   ];

//   return (
//     <div className="mt-5">
//       <h2 className="text-xl font-bold mb-4">Teachers</h2>

//       {/* Form */}
//       <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block mb-1 font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2"
//             placeholder="Enter teacher name"
//             required
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.value} value={dept.value}>
//                 {dept.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Semester --</option>
//             {manualSemesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semesterName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-end">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400"
//             disabled={loading}
//           >
//             {loading ? 'Adding...' : 'Add Teacher'}
//           </button>
//         </div>
//       </form>

//       {/* DataTable */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={teachers} columns={columns} />
//       )}
//     </div>
//   );
// };

// export default Teachers;

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// import departmentService from '../../services/departmentService.js';
// import teacherService from '../../services/teacherService.js';

// import DataTable from '../../components/Common/DataTable.js';
// import LoadingSpinner from '../../components/Common/LoadingSpinner.js';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: ''
//   });

//   const manualSemesters = Array.from({ length: 8 }, (_, i) => ({
//     _id: (i + 1).toString(),
//     semesterName: `Semester ${i + 1}`
//   }));

//   const fetchDepartments = async () => {
//     try {
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

//   const fetchTeachers = async () => {
//     setLoading(true);
//     try {
//       const teachersData = await teacherService.getAllTeachers();
//       console.log('Fetched teachers data:', teachersData);
      
//       const formattedTeachers = teachersData.map(teacher => {
//         // Handle different possible department data structures
//         let departmentName = 'N/A';
//         if (teacher.department) {
//           if (typeof teacher.department === 'string') {
//             departmentName = teacher.department;
//           } else if (teacher.department.name) {
//             departmentName = teacher.department.name;
//           } else if (teacher.department._id) {
//             departmentName = teacher.department._id;
//           }
//         }

//         return {
//           id: teacher._id,
//           name: teacher.name,
//           department: departmentName,
//           semester: `Semester ${teacher.semester}`,
//           actions: (
//             <button
//               onClick={() => handleDeleteTeacher(teacher._id)}
//               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors duration-200 font-medium"
//               disabled={loading}
//               title="Delete this teacher"
//             >
//               🗑️ Delete
//             </button>
//           )
//         };
//       });
//       setTeachers(formattedTeachers);
//     } catch (error) {
//       console.error('Error fetching teachers:', error);
//       toast.error('Failed to load teachers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTeacher = async (teacherId) => {
//     if (!window.confirm('Are you sure you want to delete this teacher?')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await teacherService.deleteTeacher(teacherId);
//       toast.success('Teacher deleted successfully');
      
//       // Refresh teachers list
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error deleting teacher:', error);
//       toast.error(error.message || 'Failed to delete teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAllTeachers = async () => {
//     if (teachers.length === 0) {
//       toast.info('No teachers to delete');
//       return;
//     }

//     const confirmMessage = `Are you sure you want to delete ALL ${teachers.length} teachers? This action cannot be undone.`;
//     if (!window.confirm(confirmMessage)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       // Delete all teachers one by one
//       const deletePromises = teachers.map(teacher => 
//         teacherService.deleteTeacher(teacher.id)
//       );
      
//       await Promise.all(deletePromises);
//       toast.success(`Successfully deleted all ${teachers.length} teachers`);
      
//       // Refresh teachers list
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error deleting all teachers:', error);
//       toast.error('Failed to delete all teachers. Some teachers may have been deleted.');
//       // Refresh to show current state
//       fetchTeachers();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchTeachers();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddTeacher = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !selectedDepartment || !selectedSemester) {
//       toast.warn('Please fill all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const teacherData = {
//         name: formData.name,
//         department: selectedDepartment,
//         semester: parseInt(selectedSemester)
//       };

//       const newTeacher = await teacherService.createTeacher(teacherData);
//       console.log('Created teacher:', newTeacher);
//       toast.success('Teacher added successfully');

//       // Reset form
//       setFormData({ name: '' });
//       setSelectedDepartment('');
//       setSelectedSemester('');

//       // Refresh teachers list
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error adding teacher:', error);
//       toast.error(error.message || 'Failed to add teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     { Header: 'Name', accessor: 'name' },
//     { Header: 'Department', accessor: 'department' },
//     { Header: 'Semester', accessor: 'semester' },
//     { Header: 'Actions', accessor: 'actions' }
//   ];

//   return (
//     <div className="mt-5">
//       <h2 className="text-xl font-bold mb-4">Teachers Management</h2>

//       {/* Form */}
//       <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block mb-1 font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2"
//             placeholder="Enter teacher name"
//             required
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map((dept) => (
//               <option key={dept.value} value={dept.value}>
//                 {dept.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Semester --</option>
//             {manualSemesters.map((sem) => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semesterName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-end">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
//             disabled={loading}
//           >
//             {loading ? 'Adding...' : 'Add Teacher'}
//           </button>
//         </div>
//       </form>

//       {/* Teachers List and Delete All Button */}
//       <div className="mb-4 flex justify-between items-center">
//         <div className="text-gray-600">
//           {teachers.length === 0 ? (
//             <p>No teachers added yet</p>
//           ) : teachers.length === 1 ? (
//             <p>Teacher: {teachers[0].name}</p>
//           ) : (
//             <div>
//               <p>Teachers:</p>
//               <ul className="list-disc list-inside ml-2">
//                 {teachers.map((teacher, index) => (
//                   <li key={teacher.id}>{teacher.name}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         {teachers.length > 0 && (
//           <button
//             onClick={handleDeleteAllTeachers}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
//             disabled={loading}
//             title={`Delete all ${teachers.length} teachers`}
//           >
//             {loading ? 'Deleting All...' : `Delete All (${teachers.length})`}
//           </button>
//         )}
//       </div>

//       {/* DataTable */}
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <DataTable data={teachers} columns={columns} />
//       )}
//     </div>
//   );
// };

// export default Teachers;
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// import departmentService from '../../services/departmentService.js';
// import teacherService from '../../services/teacherService.js';

// import DataTable from '../../components/Common/DataTable.js';
// import LoadingSpinner from '../../components/Common/LoadingSpinner.js';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: ''
//   });

//   const manualSemesters = Array.from({ length: 8 }, (_, i) => ({
//     _id: (i + 1).toString(),
//     semesterName: `Semester ${i + 1}`
//   }));

//   const fetchDepartments = async () => {
//     try {
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

//   const fetchTeachers = async () => {
//     setLoading(true);
//     try {
//       const teachersData = await teacherService.getAllTeachers();
//       const formattedTeachers = teachersData.map(teacher => ({
//         id: teacher._id,
//         name: teacher.name,
//         department: teacher.department?.name || 'N/A',
//         semester: `Semester ${teacher.semester}`,
//         actions: (
//           <button
//             onClick={() => handleDeleteTeacher(teacher._id)}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors duration-200 font-medium"
//             disabled={loading}
//             title="Delete this teacher"
//           >
//             🗑️ Delete
//           </button>
//         )
//       }));
//       setTeachers(formattedTeachers);
//     } catch (error) {
//       console.error('Error fetching teachers:', error);
//       toast.error('Failed to load teachers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTeacher = async (teacherId) => {
//     if (!window.confirm('Are you sure you want to delete this teacher?')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await teacherService.deleteTeacher(teacherId);
//       toast.success('Teacher deleted successfully');
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error deleting teacher:', error);
//       toast.error(error.message || 'Failed to delete teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAllTeachers = async () => {
//     if (teachers.length === 0) {
//       toast.info('No teachers to delete');
//       return;
//     }

//     if (!window.confirm(`Are you sure you want to delete ALL ${teachers.length} teachers? This cannot be undone.`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const deletePromises = teachers.map(teacher => teacherService.deleteTeacher(teacher.id));
//       await Promise.all(deletePromises);
//       toast.success(`Successfully deleted all ${teachers.length} teachers`);
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error deleting all teachers:', error);
//       toast.error('Failed to delete all teachers. Some teachers may have been deleted.');
//       fetchTeachers();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchTeachers();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddTeacher = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !selectedDepartment || !selectedSemester) {
//       toast.warn('Please fill all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const teacherData = {
//         name: formData.name,
//         department: selectedDepartment,
//         semester: parseInt(selectedSemester, 10)
//       };
//       console.log('👀 Sending teacher data:', teacherData);  
//       console.log("Available departments", departments)

//       await teacherService.createTeacher(teacherData);
//       toast.success('Teacher added successfully');

//       setFormData({ name: '' });
//       setSelectedDepartment('');
//       setSelectedSemester('');

//       fetchTeachers();
//     } catch (error) {
//       console.error('Error adding teacher:', error);
//       toast.error(error.message || 'Failed to add teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     { Header: 'Name', accessor: 'name' },
//     { Header: 'Department', accessor: 'department' },
//     { Header: 'Semester', accessor: 'semester' },
//     { Header: 'Actions', accessor: 'actions' }
//   ];

//   return (
//     <div className="mt-5">
//       <h2 className="text-xl font-bold mb-4">Teachers Management</h2>

//       <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block mb-1 font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2"
//             placeholder="Enter teacher name"
//             required
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map(dept => (
//               <option key={dept.value} value={dept.value}>{dept.label}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Semester --</option>
//             {manualSemesters.map(sem => (
//               <option key={sem._id} value={sem._id}>{sem.semesterName}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-end">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
//             disabled={loading}
//           >
//             {loading ? 'Adding...' : 'Add Teacher'}
//           </button>
//         </div>
//       </form>

//       <div className="mb-4">
//         {teachers.length === 0 ? (
//           <p className="text-gray-600">No teachers added yet</p>
//         ) : (
//           <div>
//             <p className="font-medium">Teachers:</p>
//             <ul className="list-disc list-inside">
//               {teachers.map(teacher => (
//                 <li key={teacher.id} className="flex items-center justify-between">
//                   <span>{teacher.name}</span>
//                   <button
//                     onClick={() => handleDeleteTeacher(teacher.id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
//                     disabled={loading}
//                   >
//                     🗑️
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {teachers.length > 0 && (
//         <button
//           onClick={handleDeleteAllTeachers}
//           className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
//           disabled={loading}
//         >
//           {loading ? 'Deleting All...' : `Delete All (${teachers.length})`}
//         </button>
//       )}

//       <div className="mt-4">
//         {loading ? <LoadingSpinner /> : <DataTable data={teachers} columns={columns} />}
//       </div>
//     </div>
//   );
// };

// export default Teachers;

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// import departmentService from '../../services/departmentService.js';
// import teacherService from '../../services/teacherService.js';

// import DataTable from '../../components/Common/DataTable.js';
// import LoadingSpinner from '../../components/Common/LoadingSpinner.js';

// const Teachers = () => {
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: ''
//   });

//   const manualSemesters = Array.from({ length: 8 }, (_, i) => ({
//     _id: (i + 1).toString(),
//     semesterName: `Semester ${i + 1}`
//   }));

//   const fetchDepartments = async () => {
//     try {
//       const formattedDepartments = await departmentService.getDepartmentsForSelect();
//       setDepartments(formattedDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

//   const fetchTeachers = async () => {
//     setLoading(true);
//     try {
//       const teachersData = await teacherService.getAllTeachers();
//       const formattedTeachers = teachersData.map(teacher => ({
//         id: teacher._id,
//         name: teacher.name,
//         department: teacher.department?.name || 'N/A',
//         semester: `Semester ${teacher.semester}`,
//         actions: (
//           <button
//             onClick={() => handleDeleteTeacher(teacher._id)}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors duration-200 font-medium"
//             disabled={loading}
//             title="Delete this teacher"
//           >
//             🗑️ Delete
//           </button>
//         )
//       }));
//       setTeachers(formattedTeachers);
//     } catch (error) {
//       console.error('Error fetching teachers:', error);
//       toast.error('Failed to load teachers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTeacher = async (teacherId) => {
//     if (!window.confirm('Are you sure you want to delete this teacher?')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await teacherService.deleteTeacher(teacherId);
//       toast.success('Teacher deleted successfully');
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error deleting teacher:', error);
//       toast.error(error.message || 'Failed to delete teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAllTeachers = async () => {
//     if (teachers.length === 0) {
//       toast.info('No teachers to delete');
//       return;
//     }

//     if (!window.confirm(`Are you sure you want to delete ALL ${teachers.length} teachers? This cannot be undone.`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const deletePromises = teachers.map(teacher => teacherService.deleteTeacher(teacher.id));
//       await Promise.all(deletePromises);
//       toast.success(`Successfully deleted all ${teachers.length} teachers`);
//       fetchTeachers();
//     } catch (error) {
//       console.error('Error deleting all teachers:', error);
//       toast.error('Failed to delete all teachers. Some teachers may have been deleted.');
//       fetchTeachers();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchTeachers();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddTeacher = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !selectedDepartment || !selectedSemester) {
//       toast.warn('Please fill all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const teacherData = {
//         name: formData.name,
//         department: selectedDepartment,
//         semester: parseInt(selectedSemester, 10)
//       };
//       console.log('👀 Sending teacher data:', teacherData);
//       console.log('Available departments:', departments);

//       const result = await teacherService.createTeacher(teacherData);
//       toast.success('Teacher added successfully');

//       setFormData({ name: '' });
//       setSelectedDepartment('');
//       setSelectedSemester('');

//       fetchTeachers();
//     } catch (error) {
//       console.error('❌ Error adding teacher:', error);
      
//       // Check if it's an axios error with response
//       if (error.response && error.response.data) {
//         console.error('❌ Backend error response:', error.response.data);
//         toast.error(error.response.data.message || error.response.data.error || 'Failed to add teacher');
//       } else if (error.message) {
//         toast.error(error.message);
//       } else {
//         toast.error('Failed to add teacher');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     { Header: 'Name', accessor: 'name' },
//     { Header: 'Department', accessor: 'department' },
//     { Header: 'Semester', accessor: 'semester' },
//     { Header: 'Actions', accessor: 'actions' }
//   ];

//   return (
//     <div className="mt-5">
//       <h2 className="text-xl font-bold mb-4">Teachers Management</h2>

//       <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block mb-1 font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full border rounded p-2"
//             placeholder="Enter teacher name"
//             required
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Department</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Department --</option>
//             {departments.map(dept => (
//               <option key={dept.value} value={dept.value}>{dept.label}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">Semester</label>
//           <select
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//             className="w-full border rounded p-2"
//             required
//             disabled={loading}
//           >
//             <option value="">-- Select Semester --</option>
//             {manualSemesters.map(sem => (
//               <option key={sem._id} value={sem._id}>{sem.semesterName}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-end">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
//             disabled={loading}
//           >
//             {loading ? 'Adding...' : 'Add Teacher'}
//           </button>
//         </div>
//       </form>

//       <div className="mb-4">
//         {teachers.length === 0 ? (
//           <p className="text-gray-600">No teachers added yet</p>
//         ) : (
//           <div>
//             <p className="font-medium">Teachers:</p>
//             <ul className="list-disc list-inside">
//               {teachers.map(teacher => (
//                 <li key={teacher.id} className="flex items-center justify-between">
//                   <span>{teacher.name}</span>
//                   <button
//                     onClick={() => handleDeleteTeacher(teacher.id)}
//                     className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
//                     disabled={loading}
//                   >
//                     🗑️
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {teachers.length > 0 && (
//         <button
//           onClick={handleDeleteAllTeachers}
//           className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
//           disabled={loading}
//         >
//           {loading ? 'Deleting All...' : `Delete All (${teachers.length})`}
//         </button>
//       )}

//       <div className="mt-4">
//         {loading ? <LoadingSpinner /> : <DataTable data={teachers} columns={columns} />}
//       </div>
//     </div>
//   );
// };

// export default Teachers;


import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import departmentService from '../../services/departmentService.js';
import teacherService from '../../services/teacherService.js';

import DataTable from '../../components/Common/DataTable.js';
import LoadingSpinner from '../../components/Common/LoadingSpinner.js';

const Teachers = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

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
        department: teacher.department?.name || 'N/A',
        semester: `Semester ${teacher.semester}`,
        actions: (
          <button
            onClick={() => handleDeleteTeacher(teacher._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors duration-200 font-medium"
            disabled={loading}
            title="Delete this teacher"
          >
            🗑️ Delete
          </button>
        )
      }));
      setTeachers(formattedTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
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

  // const handleAddTeacher = async (e) => {
  //   e.preventDefault();
    
  //   // Validation
  //   if (!formData.name || !formData.email || !selectedDepartment || !selectedSemester) {
  //     toast.warn('Please fill all fields');
  //     return;
  //   }

  //   if (!validateEmail(formData.email)) {
  //     toast.error('Please enter a valid email address');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const teacherData = {
  //       name: formData.name.trim(),
  //       email: formData.email.trim().toLowerCase(),
  //       department: selectedDepartment,
  //       semester: parseInt(selectedSemester, 10)
  //     };
      
  //     console.log('👀 Sending teacher data:', teacherData);
  //     console.log('Available departments:', departments);
  //     console.log("👀 Sending teacher data:", JSON.stringify(teacherData, null, 2));

  //     const result = await teacherService.createTeacher(teacherData);
  //     toast.success('Teacher added successfully');

  //     // Reset form
  //     setFormData({ name: '', email: '' });
  //     setSelectedDepartment('');
  //     setSelectedSemester('');

  //     fetchTeachers();
  //   } catch (error) {
  //     console.error('❌ Error adding teacher:', error);
      
  //     // Handle specific error messages
  //     if (error.response && error.response.data) {
  //       console.error('❌ Backend error response:', error.response.data);
  //       const errorMessage = error.response.data.message || error.response.data.error;
        
  //       if (errorMessage.includes('duplicate key') && errorMessage.includes('email')) {
  //         toast.error('This email is already registered. Please use a different email.');
  //       } else {
  //         toast.error(errorMessage || 'Failed to add teacher');
  //       }
  //     } else if (error.message) {
  //       toast.error(error.message);
  //     } else {
  //       toast.error('Failed to add teacher');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddTeacher = async (e) => {
  e.preventDefault();

  // Validation
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

    console.log('👀 Sending teacher data:', teacherData);
    console.log('Available departments:', departments);

    const result = await teacherService.createTeacher(teacherData);

    toast.success('✅ Teacher added successfully');

    // Reset form
    setFormData({ name: '', email: '' });
    setSelectedDepartment('');
    setSelectedSemester('');

    fetchTeachers();
  } catch (error) {
    console.error('❌ Error adding teacher:', error);

    let errorMessage = 'Failed to add teacher';

    if (error.response && error.response.data) {
      console.error('❌ Backend error response:', error.response.data);
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

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Department', accessor: 'department' },
    { Header: 'Semester', accessor: 'semester' },
    { Header: 'Actions', accessor: 'actions' }
  ];

  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold mb-4">Teachers Management</h2>

      <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter teacher name"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter email address"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Department *</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
            required
            disabled={loading}
          >
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.value} value={dept.value}>{dept.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Semester *</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full border rounded p-2 focus:border-blue-500 focus:outline-none"
            required
            disabled={loading}
          >
            <option value="">-- Select Semester --</option>
            {manualSemesters.map(sem => (
              <option key={sem._id} value={sem._id}>{sem.semesterName}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end lg:col-span-4">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 font-medium"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Teacher'}
          </button>
        </div>
      </form>

      <div className="mb-4">
        {teachers.length === 0 ? (
          <p className="text-gray-600">No teachers added yet</p>
        ) : (
          <div>
            <p className="font-medium mb-2">Teachers ({teachers.length}):</p>
            <div className="bg-gray-50 p-4 rounded">
              {teachers.map(teacher => (
                <div key={teacher.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <span className="font-medium">{teacher.name}</span>
                    {/* <span className="text-gray-600 ml-2">({teacher.email})</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {teacher.department} - {teacher.semester}
                    </span> */}
                  </div>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    disabled={loading}
                    title="Delete this teacher"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {teachers.length > 0 && (
        <button
          onClick={handleDeleteAllTeachers}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200 mb-4"
          disabled={loading}
        >
          {loading ? 'Deleting All...' : `Delete All (${teachers.length})`}
        </button>
      )}

      <div className="mt-4">
        {loading ? <LoadingSpinner /> : <DataTable data={teachers} columns={columns} />}
      </div>
    </div>
  );
};

export default Teachers;