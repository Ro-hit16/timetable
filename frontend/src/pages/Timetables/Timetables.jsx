

// import React, { useState, useEffect } from 'react';
// import {
//   Calendar,
//   Clock,
//   Users,
//   BookOpen,
//   Download,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   CheckCircle,
//   AlertCircle,
//   BarChart3,
//   Copy,
//   RefreshCw,
//   Filter,
//   Search
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import timetableService, { mockTimetableData } from '../../services/timetableService';
// import {
//   divisions,
//   days,
//   timeSlots,
//   fetchDepartments,
//   fetchSubjects,
//   fetchTeachers,

//   renderTimetableGrid,
//   formatTimetableData,
//   processScheduleData
// } from '../../utils/timetableUtils';
// import { fetchClasses } from '../../utils/timetableUtils';
// const Timetables = () => {
//   const [timetables, setTimetables] = useState([]);
//   const [selectedTimetable, setSelectedTimetable] = useState(null);
//   const [formattedTimetable, setFormattedTimetable] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('list');
//   const [statistics, setStatistics] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [timetableData, setTimetableData] = useState([]);


//   const academicYears = ["2024-25", "2025-26", "2026-27"];


//   const [filters, setFilters] = useState({
//     department: '',
//     semester: '',
//     academicYear: '',
//     status: ''
//   });
//   const [generateForm, setGenerateForm] = useState({
//     departmentId: '',
//     semester: '',
//     academicYear: '',
//     divisions: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
//   });

//   useEffect(() => {
//     const loadInitialData = async () => {
//       setLoading(true);
//       try {
//         await Promise.all([
//           fetchDepartments(setDepartments),
//           fetchSubjects(setSubjects),
//           fetchTeachers(setTeachers),
//           fetchClasses(setClasses)
//         ]);

//       } catch (error) {
//         toast.error('Failed to load initial data');
//         console.error('Initialization error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       const res = await fetch('/api/classes');
//       const data = await res.json();
//       setClasses(data); // directly set
//       console.log("✅ SETTING CLASSES TO:", data);
//     };
//     loadInitialData();
//   }, []);
//   ;


//   const loadTimetables = async () => {
//     console.log("🔍 Filters being used to fetch timetables:", filters);

//     setLoading(true);
//     try {


//       const departmentId = filters.department; // Ensure this is a valid ID
//       console.log("✅ departmentId being used:", departmentId);
//       if (!departmentId) {
//         console.log('No department selected, skipping timetable fetch');
//         setTimetables([]);
//         setFormattedTimetable(null);
//         return; // Prevent the API call if department ID is not set
//       }

//       const result = await timetableService.getTimetables(departmentId, filters);
//       console.log("📦 API Response from backend:", result);
//       console.log("📅 Timetables to be shown on UI:", result.data);

//       setTimetables(result.data || []);
//       formatTimetableData(result.data || [], setFormattedTimetable);
//     } catch (error) {
//       toast.error('Failed to load timetables');
//       console.error('Load timetables error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // const handleGenerate = async () => {
//   //   if (!generateForm.departmentId || !generateForm.semester) {
//   //     toast.error('Please select department and semester');
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   try {
//   //     const result = await timetableService.generateTimetable({
//   //       ...generateForm,
//   //       subjects,
//   //       teachers,
//   //       classes
//   //     });

//   //     if (result.success || result.id) { // Handle both success formats
//   //       toast.success('Timetable generated successfully!');
//   //       await loadTimetables();
//   //       setActiveTab('list');
//   //       setGenerateForm({ // Reset form
//   //         ...generateForm,
//   //         departmentId: '',
//   //         semester: ''
//   //       });
//   //     } else {
//   //       toast.error('Failed to generate timetable: ' + 
//   //         (result.message || 'Unknown error'));
//   //     }
//   //   } catch (error) {
//   //     toast.error('Error generating timetable');
//   //     console.error('Generation error:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleGenerate = async () => {
//   //   console.log('Generate function triggered');
//   //   if (!generateForm.departmentId || !generateForm.semester ||
//   //     !generateForm.academicYear) {
//   //     toast.error('Please select department and semester');
//   //     return;
//   //   }
//   //   console.log('Generate Form:', generateForm);
//   //   setLoading(true);
//   //   try {
//   //     const result = await timetableService.generateTimetable({
//   //       ...generateForm,
//   //       subjects,
//   //       teachers,
//   //       classes
//   //     });
//   //     console.log('Generate API Response:', result);
//   //     if (result.success || result.id) { // Handle both success formats
//   //       toast.success('Timetable generated successfully!');
//   //       await loadTimetables();
//   //       setActiveTab('list');
//   //       setGenerateForm({ // Reset form
//   //         ...generateForm,
//   //         departmentId: '',
//   //         semester: ''
//   //       });
//   //     } else {
//   //       toast.error('Failed to generate timetable: ' +
//   //         (result.message || 'Unknown error'));
//   //     }
//   //   } catch (error) {
//   //     toast.error('Error generating timetable');
//   //     console.error('Error generating timetable:', error);

//   //   }
//   // }

//   // const handleGenerate = async () => {


//   //   if (!generateForm.departmentId || !generateForm.semester || !generateForm.academicYear) {
//   //     toast.error('Please select Department, Semester, and Academic Year');
//   //     return;
//   //   }


//   //   setLoading(true);

//   //   try {
//   //     const result = await timetableService.generateTimetable({
//   //       ...generateForm,
//   //       subjects,
//   //       teachers,
//   //       classes,
//   //     });



//   //     if (result.success || result.id) {
//   //       toast.success('Timetable generated successfully!');
//   //       await loadTimetables();
//   //       setActiveTab('list');

//   //       // ✅ Reset full form
//   //       setGenerateForm({
//   //         departmentId: '',
//   //         semester: '',
//   //         academicYear: '',
//   //         divisions: [],
//   //       });
//   //     } else {
//   //       toast.error('Failed to generate timetable: ' + (result.message || 'Unknown error'));
//   //     }
//   //   } catch (error) {
//   //     toast.error('Error generating timetable');

//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   //  const autoGenerateLectures = () => {
//   //   const generatedLectures = [];

//   //   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
//   //   const periodsPerDay = 6;

//   //   generateForm.divisions.forEach((division) => {
//   //     days.forEach((day) => {
//   //       for (let period = 1; period <= periodsPerDay; period++) {
//   //         const subject = subjects[0]?._id;
//   //         const teacher = teachers[0]?._id;
//   //         const room = classes[0]?.name;

//   //         if (subject && teacher && room) {
//   //           generatedLectures.push({
//   //             subject,
//   //             teacher,
//   //             division,
//   //             day,
//   //             period,
//   //             room,
//   //           });
//   //         }
//   //       }
//   //     });
//   //   });

//   //   return generatedLectures;
//   // };



//   //   const handleGenerate = async () => {

//   //   if (!generateForm.departmentId || !generateForm.semester || !generateForm.academicYear) {
//   //     toast.error('Please select Department, Semester, and Academic Year');
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     // ✅ Format lectures with only _id and necessary fields
//   //     const formattedLectures = lectures.map((lec) => ({
//   //       subject: lec.subject._id,
//   //       teacher: lec.teacher._id,
//   //       division: lec.division, // or lec.division._id if it's an object
//   //       day: lec.day,
//   //       period: lec.period,
//   //       room: lec.room,
//   //     }));

//   //     const result = await timetableService.generateTimetable({
//   //       ...generateForm,
//   //       subjects,
//   //       teachers,
//   //       classes,
//   //       lectures: formattedLectures, // ✅ pass it here
//   //     });

//   //     if (result.success || result.id) {
//   //       toast.success('Timetable generated successfully!');
//   //       await loadTimetables();
//   //       setActiveTab('list');

//   //       setGenerateForm({
//   //         departmentId: '',
//   //         semester: '',
//   //         academicYear: '',
//   //         divisions: [],
//   //       });
//   //     } else {
//   //       toast.error('Failed to generate timetable: ' + (result.message || 'Unknown error'));
//   //     }
//   //   } catch (error) {
//   //     toast.error('Error generating timetable');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   // const handleView = async (timetableId) => {
//   //   setLoading(true);
//   //   try {
//   //     const [result, statsResult] = await Promise.all([
//   //       timetableService.getTimetable(timetableId, true),
//   //       timetableService.getStatistics(timetableId)
//   //     ]);
//   //     console.log("📄 API Response for timetable:", result);
//   //     console.log("📊 API Response for statistics:", statsResult);


//   //     if (result.success || result.schedule) {
//   //       setFormattedTimetable(result.data || result);
//   //       setSelectedTimetable(timetableId);

//   //       if (statsResult.success || statsResult.statistics) {
//   //         setStatistics(statsResult.data?.statistics || statsResult.statistics);
//   //       }


//   //       setActiveTab('view');
//   //     }
//   //   } catch (error) {
//   //     toast.error('Failed to load timetable');
//   //     console.error('View timetable error:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   //  const handleGenerate = async () => {
//   //   if (!generateForm.departmentId || !generateForm.semester || !generateForm.academicYear) {
//   //     toast.error('Please select Department, Semester, and Academic Year');
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //    // const formattedLectures = autoGenerateLectures(); // ✅ Auto-generate based on selected inputs

//   //     const result = await timetableService.generateTimetable({
//   //       ...generateForm,
//   //       subjects,
//   //       teachers,
//   //       classes,
//   //       lectures: formattedLectures, // ✅ now auto-generated
//   //     });

//   //     if (result.success || result.id) {
//   //       toast.success('Timetable generated successfully!');
//   //       await loadTimetables();
//   //       setActiveTab('list');

//   //       setGenerateForm({
//   //         departmentId: '',
//   //         semester: '',
//   //         academicYear: '',
//   //         divisions: [],
//   //       });
//   //     } else {
//   //       toast.error('Failed to generate timetable: ' + (result.message || 'Unknown error'));
//   //     }
//   //   } catch (error) {
//   //     toast.error('Error generating timetable');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleGenerate = async () => {
//     console.log("✅ CLASSES:", classes);
//     if (
//       !generateForm.departmentId ||
//       !generateForm.semester ||
//       !generateForm.academicYear
//     ) {
//       toast.error('Please select Department, Semester, and Academic Year');
//       return;
//     }

//     if (classes.length === 0) {
//       toast.error('No classes available. Please check class data.');
//       return;
//     }
//     console.log("✅ DIVISIONS:", generateForm.divisions); // Add this
//     setLoading(true);

//     try {
//       console.log("📤 Sending data", {
//         departmentId: generateForm.departmentId,
//         semester: generateForm.semester,
//         academicYear: generateForm.academicYear,
//         classes,
//         teachers,
//         subjects,
//         divisions,
//       });

//       const result = await timetableService.generateTimetable({
//         departmentId: generateForm.departmentId,
//         semester: generateForm.semester,
//         academicYear: generateForm.academicYear,
//         classes,
//         teachers,
//         subjects,
//         divisions,
//       });

//       if (result.success) {
//         toast.success('Timetable generated successfully!');
//         await loadTimetables();
//         setActiveTab('list');

//         setGenerateForm({
//           departmentId: '',
//           semester: '',
//           academicYear: '',
//           divisions: [],
//         });
//       } else {
//         toast.error('Failed to generate timetable: ' + (result.message || 'Unknown error'));
//       }
//     } catch (error) {
//       toast.error('Error generating timetable');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };




//   const handleView = async (timetableId) => {
//     setLoading(true);
//     try {
//       const [result, statsResult] = await Promise.all([
//         timetableService.getTimetable(timetableId, true),
//         timetableService.getStatistics(timetableId)
//       ]);

//       console.log("📄 API Response for timetable:", result);
//       console.log("📊 API Response for statistics:", statsResult);

//       if (result.success && result.data) {
//         // ✅ Important: directly use result.data
//         console.log("🎯 Final formattedTimetable set to:", result.data);
//         setFormattedTimetable(result.data);
//         setSelectedTimetable(timetableId);

//         if (statsResult.success && statsResult.data) {
//           setStatistics(statsResult.data.statistics);
//         }

//         setActiveTab('view');
//       }
//     } catch (error) {
//       toast.error('Failed to load timetable');
//       console.error('View timetable error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleStatusUpdate = async (id, status) => {
//     try {
//       const result = await timetableService.updateStatus(id, status);
//       if (result.success || result.status) {
//         await loadTimetables();
//         toast.success(`Timetable ${status} successfully!`);
//       }
//     } catch (error) {
//       toast.error('Failed to update status');
//       console.error('Status update error:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this timetable?')) return;

//     try {
//       const result = await timetableService.deleteTimetable(id);
//       if (result.success || !result.error) {
//         await loadTimetables();
//         toast.success('Timetable deleted successfully!');
//       }
//     } catch (error) {
//       toast.error('Failed to delete timetable');
//       console.error('Delete error:', error);
//     }
//   };

//   const handleExport = async (id, format) => {
//     try {
//       const response = await timetableService.exportTimetable(id, format);

//       if (format === 'csv') {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `timetable_${id}.csv`;
//         a.click();
//         window.URL.revokeObjectURL(url);
//         toast.success('CSV exported successfully!');
//       } else {
//         // Handle other export formats (PDF, etc.)
//         toast.success('Export completed!');
//       }
//     } catch (error) {
//       toast.error('Failed to export timetable');
//       console.error('Export error:', error);
//     }
//   };

//   const handleClone = async (id) => {
//     const newAcademicYear = prompt('Enter new academic year:');
//     if (!newAcademicYear) return;

//     const newSemester = prompt('Enter new semester:');
//     if (!newSemester) return;

//     try {
//       const result = await timetableService.cloneTimetable(id, {
//         newAcademicYear,
//         newSemester
//       });

//       if (result.success || result.id) {
//         await loadTimetables();
//         toast.success('Timetable cloned successfully!');
//       }
//     } catch (error) {
//       toast.error('Failed to clone timetable');
//       console.error('Clone error:', error);
//     }
//   };

//   // const formatSchedule = (scheduleArrayFormat) => {
//   //   const formatted = {};

//   //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   //   for (const day of days) {
//   //     formatted[day] = {};
//   //     const periods = scheduleArrayFormat[day] || [];
//   //     periods.forEach((item, index) => {
//   //       formatted[day][index + 1] = {
//   //         subject: item.subject || "Free",
//   //         teacher: item.teacher || "",
//   //       };
//   //     });
//   //   }

//   //   return formatted;
//   // };

//   const formatSchedule = (lecturesArray) => {
//     const schedule = {};
//     for (const lecture of lecturesArray) {
//       const { day, period, subject_name, teacher_name, classroom } = lecture;

//       if (!schedule[day]) schedule[day] = {};
//       schedule[day][period] = { subject_name, teacher_name, classroom };
//     }
//     return schedule;
//   };

//   useEffect(() => {
//     loadTimetables();
//   }, [filters]);

//   useEffect(() => {
//     formatTimetableData(timetables, setFormattedTimetable);
//   }, [timetables]);

//   useEffect(() => {
//     console.log("✅ formattedTimetable.divisions =", formattedTimetable?.divisions);
//     formattedTimetable?.divisions?.forEach((div, idx) => {
//       console.log(`➡️ Division ${idx}:`, div.division_name, div.schedule);
//     });
//   }, [formattedTimetable]);



//   console.log("🧠 Formatted Timetable in State:", formattedTimetable);

//   // Render UI
//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Timetable Management</h1>
//         <p className="text-gray-600">Manage and generate timetables</p>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex space-x-1 mb-6 border-b">
//         {[
//           { id: 'list', label: 'Timetables', icon: Calendar },
//           { id: 'generate', label: 'Generate New', icon: Plus },
//           { id: 'view', label: 'View Timetable', icon: Eye, disabled: !selectedTimetable }
//         ].map(tab => {
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => !tab.disabled && setActiveTab(tab.id)}
//               disabled={tab.disabled}
//               className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
//                 ? 'border-blue-500 text-blue-600 bg-blue-50'
//                 : tab.disabled
//                   ? 'border-transparent text-gray-400 cursor-not-allowed'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//             >
//               <Icon className="w-4 h-4 mr-2" />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* Timetables List */}
//       {activeTab === 'list' && (
//         <>
//           <div className="space-y-6">
//             {/* Filters */}
//             <div className="bg-white p-6 rounded-lg border">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <Filter className="w-5 h-5 mr-2" />
//                 Filters
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {/* Department Filter */}
//                 <div className="">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//                   <select
//                     value={filters.department}
//                     onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Department</option>
//                     {departments.length > 0 ? (
//                       departments.map((dep) => (
//                         <option key={dep.value} value={dep.value}>
//                           {dep.label}
//                         </option>
//                       ))
//                     ) : (
//                       <option disabled>Loading...</option>
//                     )}
//                   </select>
//                 </div>

//                 {/* Semester Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
//                   <select
//                     value={filters.semester}
//                     onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Semester</option>
//                     {[...Array(8)].map((_, i) => (
//                       <option key={i + 1} value={i + 1}>
//                         Semester {i + 1}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Academic Year Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>


//                   <select
//                     value={generateForm.academicYear}
//                     onChange={(e) =>
//                       setGenerateForm({ ...generateForm, academicYear: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Academic Year</option>
//                     {academicYears.map((year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     ))}
//                   </select>

//                 </div>

//                 {/* Status Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={filters.status}
//                     onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">All Status</option>
//                     <option value="draft">Draft</option>
//                     <option value="published">Published</option>
//                     <option value="archived">Archived</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Timetables Grid */}
//           <div className="grid gap-6">
//             {loading ? (
//               <div className="text-center py-12">
//                 <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
//                 <p className="text-gray-600">Loading timetables...</p>
//               </div>
//             ) : timetables.length === 0 ? (
//               <div className="text-center py-12 bg-white rounded-lg border">
//                 <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No timetables found</h3>
//                 <p className="text-gray-600 mb-4">
//                   {filters.department ? 'No timetables match your filters' : 'Select a department to view timetables'}
//                 </p>
//                 {filters.department && (
//                   <button
//                     onClick={() => setActiveTab('generate')}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
//                   >
//                     Generate New Timetable
//                   </button>
//                 )}
//               </div>
//             ) : (
//               timetables.map((timetable) => (
//                 <div key={timetable._id || timetable.id} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {timetable.semester} - {timetable.academic_year || timetable.academicYear}
//                       </h3>
//                       <p className="text-gray-600">
//                         Department: {timetable.department_id?.name || timetable.department?.name || 'Unknown'}
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${timetable.status === 'published'
//                         ? 'bg-green-100 text-green-800'
//                         : timetable.status === 'draft'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-gray-100 text-gray-800'
//                         }`}
//                       >
//                         {timetable.status}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-blue-600">
//                         {timetable.divisions?.length || 0}
//                       </div>
//                       <div className="text-sm text-gray-600">Divisions</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-green-600">
//                         {timetable.generation_metadata?.fitness_score?.toFixed(2) ||
//                           timetable.fitnessScore?.toFixed(2) || 'N/A'}
//                       </div>
//                       <div className="text-sm text-gray-600">Fitness Score</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-purple-600">
//                         {timetable.generation_metadata?.generation_count ||
//                           timetable.generationCount || 'N/A'}
//                       </div>
//                       <div className="text-sm text-gray-600">Generations</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-orange-600">
//                         {timetable.generation_metadata?.conflicts_resolved ||
//                           timetable.conflictsResolved || 0}
//                       </div>
//                       <div className="text-sm text-gray-600">Conflicts</div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-500">
//                       Created: {new Date(timetable.createdAt || timetable.createdDate).toLocaleDateString()}
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleView(timetable._id || timetable.id)}
//                         className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         View
//                       </button>

//                       {timetable.status === 'draft' && (
//                         <button
//                           onClick={() => handleStatusUpdate(timetable._id || timetable.id, 'published')}
//                           className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
//                         >
//                           <CheckCircle className="w-4 h-4 mr-1" />
//                           Publish
//                         </button>
//                       )}

//                       <button
//                         onClick={() => handleExport(timetable._id || timetable.id, 'csv')}
//                         className="flex items-center px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
//                       >
//                         <Download className="w-4 h-4 mr-1" />
//                         Export
//                       </button>

//                       <button
//                         onClick={() => handleClone(timetable._id || timetable.id)}
//                         className="flex items-center px-3 py-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
//                       >
//                         <Copy className="w-4 h-4 mr-1" />
//                         Clone
//                       </button>

//                       <button
//                         onClick={() => handleDelete(timetable._id || timetable.id)}
//                         className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4 mr-1" />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}

//       {/* Generate New Timetable */}
//       {activeTab === 'generate' && (
//         <div className="max-w-2xl mx-auto">
//           <div className="bg-white p-8 rounded-lg border">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//               <Plus className="w-6 h-6 mr-2" />
//               Generate New Timetable
//             </h2>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                 <select
//                   value={generateForm.departmentId}
//                   onChange={(e) => setGenerateForm({ ...generateForm, departmentId: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Department</option>
//                   {departments.map((dep) => (
//                     <option key={dep.value} value={dep.value}>
//                       {dep.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
//                   <select
//                     value={generateForm.semester}
//                     onChange={(e) => setGenerateForm({ ...generateForm, semester: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Semester</option>
//                     {[...Array(8)].map((_, i) => (
//                       <option key={i + 1} value={i + 1}>
//                         Semester {i + 1}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
//                   <select
//                     value={generateForm.academicYear}
//                     onChange={(e) => setGenerateForm({ ...generateForm, academicYear: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Academic Year</option>
//                     <option value="2024-25">2024-25</option>
//                     <option value="2023-24">2023-24</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Divisions</label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {divisions.map(division => (
//                     <label key={division} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={generateForm.divisions.includes(division)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setGenerateForm({
//                               ...generateForm,
//                               divisions: [...generateForm.divisions, division]
//                             });
//                           } else {
//                             setGenerateForm({
//                               ...generateForm,
//                               divisions: generateForm.divisions.filter(d => d !== division)
//                             });
//                           }
//                         }}
//                         className="mr-2"
//                       />
//                       {division}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-blue-50 p-4 rounded-md">
//                 <h4 className="font-medium text-blue-900 mb-2">Generation Settings</h4>
//                 <p className="text-sm text-blue-700">
//                   The system will automatically optimize the timetable considering all constraints
//                 </p>
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   onClick={handleGenerate}
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <>
//                       <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
//                       Generating...
//                     </>
//                   ) : 'Generate Timetable'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Timetable */}
//       {activeTab === 'view' && selectedTimetable && (
//         <div className="space-y-6">
//           {statistics && (
//             <div className="bg-white p-6 rounded-lg border">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <BarChart3 className="w-5 h-5 mr-2" />
//                 Timetable Statistics
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-600">{statistics.totalClasses}</div>
//                   <div className="text-sm text-gray-600">Total Classes</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-600">{statistics.labSessions}</div>
//                   <div className="text-sm text-gray-600">Lab Sessions</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-purple-600">{statistics.theorySessions}</div>
//                   <div className="text-sm text-gray-600">Theory Sessions</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-orange-600">
//                     {typeof statistics.teacherUtilization === 'number'
//                       ? `${(statistics.teacherUtilization * 100).toFixed(1)}%`
//                       : 'N/A'}
//                   </div>
//                   <div className="text-sm text-gray-600">Teacher Utilization</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-red-600">
//                     {typeof statistics.roomUtilization === 'number'
//                       ? `${(statistics.roomUtilization * 100).toFixed(1)}%`
//                       : 'N/A'}
//                   </div>
//                   <div className="text-sm text-gray-600">Room Utilization</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* {console.log("🔥 formattedTimetable", formattedTimetable)}
//           {console.log("📌 Divisions in generateForm:", generateForm.divisions)}
//           {console.log("📌 All available divisions:", divisions)} */}


//           {/* {formattedTimetable && (
//             <div className="space-y-6">
//               {divisions
//                .filter(div => formattedTimetable?.divisions?.includes(div))
//                 .map(division => (
//                   <div key={division} className="bg-white rounded-lg border">
//                     <div className="px-6 py-4 border-b">
//                       <h3 className="text-lg font-semibold">
//                         Division {division} - {formattedTimetable?.semester || 'N/A'}
//                       </h3>
//                     </div>
//                     <div className="p-6 overflow-x-auto">
//                       {renderTimetableGrid(division, formattedTimetable)}
//                     </div>
//                   </div>
//                 ))
//               }
//             </div>
//           )} */}
//           {/* {formattedTimetable?.divisions?.length > 0 && (
//             <div className="space-y-6">
//               {formattedTimetable.divisions.map((division) => (
//                 <div key={division} className="bg-white rounded-lg border">
//                   <div className="px-6 py-4 border-b">
//                     <h3 className="text-lg font-semibold">
//                       Division {division} - {formattedTimetable?.semester || 'N/A'}
//                     </h3>
//                   </div>
//                   <div className="p-6 overflow-x-auto">
//                     {renderTimetableGrid(division, formattedTimetable)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )} */}




//           {/* {formattedTimetable?.divisions?.length > 0 && (
//   <div className="space-y-6">
//     {formattedTimetable.divisions.map(division => (
//       <div key={division._id} className="bg-white rounded-lg border">
//         <div className="px-6 py-4 border-b">
//           <h3 className="text-lg font-semibold">
//             Division {division.division_name} — Semester {formattedTimetable.semester}
//           </h3>
//         </div>
//         <div className="p-6 overflow-x-auto">
//           {renderTimetableGrid(division.schedule, division.division_name)}
//         </div>
//       </div>
//     ))}
//   </div>
// )} */}
//           {/* {formattedTimetable && formattedTimetable.divisions && (
//             <div className="space-y-6">
//               {formattedTimetable.divisions.map((division, index) => {
//                 const schedule = division.schedule || [];

//                 console.log(`🗓️ Schedule for ${division.division_name}`, schedule);


//                 return (
//                   <div key={index} className="bg-white rounded-lg border">
//                     <div className="px-6 py-4 border-b">
//                       <h3 className="text-lg font-semibold">
//                         Division {division.division_name} — Semester {formattedTimetable.semester}
//                       </h3>
//                     </div>
//                     <div className="p-6 overflow-x-auto">
//                       {division.schedule && Object.keys(division.schedule).length > 0 ? (
//                         renderTimetableGrid(
//                           division.division_name,
//                           formatSchedule(division.schedule)
//                         )
//                       ) : (
//                         <p className="text-gray-500 text-sm italic">No schedule found for this division.</p>
//                       )}


//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )} */}

//         {formattedTimetable.divisions.map((division, index) => {
//   const schedule = division.schedule || {};
//   const hasSchedule = Object.keys(schedule).length > 0;

//   console.log(`🗓️ Schedule for ${division.division_name}:`, schedule);

//   let formattedSchedule;
//   try {
//     formattedSchedule = formatSchedule(schedule);
//     console.log(`🎯 Formatted schedule for ${division.division_name}:`, formattedSchedule);
//   } catch (error) {
//     console.error(`❌ Error formatting schedule for ${division.division_name}:`, error);
//     formattedSchedule = null;
//   }

//   return (
//     <div key={index}>
//       <h3>Division {division.division_name} — Semester {formattedTimetable.semester}</h3>

//       {hasSchedule && formattedSchedule && Object.keys(formattedSchedule).length > 0 ? (
//         renderTimetableGrid(division.division_name, formattedSchedule)
//       ) : hasSchedule ? (
//         <>
//           <p>⚠️ Unable to format schedule. Showing raw JSON:</p>
//           <pre>{JSON.stringify(schedule, null, 2)}</pre>
//         </>
//       ) : (
//         <p>🚫 No schedule found for this division.</p>
//       )}
//     </div>
//   );
// })}









//           <div className="flex justify-end space-x-4">
//             <button
//               onClick={() => handleExport(selectedTimetable, 'csv')}
//               className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Export CSV
//             </button>
//             <button
//               onClick={() => setActiveTab('list')}
//               className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//             >
//               Back to List
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Timetables;





import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Copy,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { toast } from 'react-toastify';
import timetableService from '../../services/timetableService';
import {
  divisions,
  days,
  timeSlots,
  fetchDepartments,
  fetchSubjects,
  fetchTeachers,
  renderTimetableGrid,
  formatTimetableData,
  processScheduleData
} from '../../utils/timetableUtils';
import { fetchClasses } from '../../utils/timetableUtils';

const Timetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [formattedTimetable, setFormattedTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [statistics, setStatistics] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allDivisions, setAllDivisions] = useState([]);


  const academicYears = ["2024-25", "2025-26", "2026-27"];

  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    academicYear: '',
    status: ''
  });

  const [generateForm, setGenerateForm] = useState({
    departmentId: '',
    semester: '',
    academicYear: '',
    divisions: ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB']
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDepartments(setDepartments),
          fetchSubjects(setSubjects),
          fetchTeachers(setTeachers),
          fetchClasses(setClasses)

        ]);
      } catch (error) {
        toast.error('Failed to load initial data');
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };


    loadInitialData();
  }, []);



  useEffect(() => {
    const loadInitialData = async () => {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(data); // directly set
      console.log("✅ SETTING CLASSES TO:", data);
    };
    loadInitialData();
  }, []);


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [classesRes, subjectsRes, classroomsRes] = await Promise.all([
          fetch('/api/classes'),
          fetch('/api/subjects'),

        ]);

        const [classes, subjects] = await Promise.all([
          classesRes.json(),
          subjectsRes.json(),

        ]);

        setClasses(classes);
        setSubjects(subjects.data.subjects);


        console.log("✅ Classes:", classes);
        console.log("📚 Subjects:", subjects.data.subjects);

      } catch (err) {
        console.error("❌ Failed to load initial data:", err);
      }
    };

    loadInitialData();
  }, []);


  const loadTimetables = async () => {
    //console.log("🔍 Filters being used to fetch timetables:", filters);

    setLoading(true);
    try {
      const departmentId = filters.department;
      //console.log("✅ departmentId being used:", departmentId);

      if (!departmentId) {
        //console.log('No department selected, skipping timetable fetch');
        setTimetables([]);
        setFormattedTimetable(null);
        return;
      }

      const result = await timetableService.getTimetables(departmentId, filters);
      console.log("📦 API Response from backend:", result.data[0]);
      //console.log("📦 API Response from backend:", result);
      console.log("📅 Timetables to be shown on UI:", result.data);
      const sample = result.data[0];
      console.log("🧪 Full timetable object sample:", JSON.stringify(sample, null, 2));

      console.log("📌 division:", sample.divisions);
      //console.log(`📌 Division ${idx + 1}: ${division.division_name}`);
      console.log("📅 Schedule of first division:", sample.divisions[0].schedule);



      setTimetables(result.data || []);
      formatTimetableData(result.data || [], setFormattedTimetable);
    } catch (error) {
      toast.error('Failed to load timetables');
      console.error('Load timetables error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubjects(setSubjects);
  }, [setSubjects]);




  const handleGenerate = async () => {
    try {
      setLoading(true);

      console.log('📝 Initial Data:', {
        subjects: subjects?.length,
        teachers: teachers?.length,
        classes: classes?.length,
        semester: generateForm.semester
      });

      // Basic validation
      if (
        !generateForm.departmentId ||
        !generateForm.semester ||
        !generateForm.academicYear ||
        !generateForm.divisions.length
      ) {
        toast.error('Please fill all required fields');
        return;
      }

      // Normalize and filter by semester
      const normalizedSubjects = normalizeSubjects(subjects);
      const filteredSubjects = normalizedSubjects.filter(
        (s) => String(s.semester).trim() === String(generateForm.semester).trim()
      );

      const filteredTeachers = teachers.filter(
        (t) => String(t.semester).trim() === String(generateForm.semester).trim()
      );

      // ✅ Classroom filtering with fallback
      let filteredClasses = classes;
      const allHaveSemester = classes.every((c) => c.semester !== undefined);
      if (allHaveSemester) {
        filteredClasses = classes.filter(
          (c) => String(c.semester).trim() === String(generateForm.semester).trim()
        );
      }

      // Final validations
      if (!filteredSubjects.length) {
        toast.error(`No subjects available for semester ${generateForm.semester}`);
        return;
      }

      if (!filteredTeachers.length) {
        toast.error(`No teachers available for semester ${generateForm.semester}`);
        return;
      }

      if (!filteredClasses.length) {
        toast.error(`No classrooms available for semester ${generateForm.semester}`);
        return;
      }

      const filteredData = {
        departmentId: generateForm.departmentId,
        semester: generateForm.semester,
        academicYear: generateForm.academicYear,
        divisions: generateForm.divisions,
        subjects: filteredSubjects,
        teachers: filteredTeachers,
        classes: filteredClasses
      };

      console.log('🔄 Sending generation request:', filteredData);

      const result = await timetableService.generateTimetable(filteredData);

      if (result.success) {
        toast.success('Timetable generated successfully');
        await loadTimetables();
        setActiveTab('list');
      } else {
        toast.error(result.error || 'Failed to generate timetable');
      }
    } catch (error) {
      console.error('❌ Generation error:', error);
      toast.error(error.message || 'Failed to generate timetable');
    } finally {
      setLoading(false);
    }
  };















  // const normalizeSubjects = (subjects) => {
  //   if (!subjects) return [];

  //   let rawSubjects = [];

  //   if (subjects.subjects && Array.isArray(subjects.subjects)) {
  //     rawSubjects = subjects.subjects;
  //   } else if (Array.isArray(subjects)) {
  //     rawSubjects = subjects;
  //   } else if (typeof subjects === 'object') {
  //     rawSubjects = Object.values(subjects).flat();
  //   }

  //   return rawSubjects.map(subject => ({
  //     _id: subject._id || subject.id,
  //     name: subject.name || subject.subject_name || 'Unnamed Subject',
  //     semester: String(subject.semester || subject.sem_id || '').trim(),
  //     type: subject.type || 'Theory',
  //     department: subject.department_id || subject.department,
  //     credits: subject.credits || 0,
  //     teachers: subject.teachers || []
  //   }));
  // };

  // ✅ Validation function with structured logs
  const validateData = (data) => {
    const errors = [];

    if (!data.departmentId) errors.push('Please select a department');
    if (!data.semester) errors.push('Please select a semester');
    if (!data.academicYear) errors.push('Please select an academic year');
    if (!data.divisions?.length) errors.push('Please select at least one division');

    console.log('🔍 Validation input:', {
      departmentId: data.departmentId,
      semester: data.semester,
      subjectsCount: data.subjects?.length,
      rawSubjects: data.subjects
    });

    const normalizedSubjects = normalizeSubjects(data.subjects);
    console.log('📚 Normalized subjects:', normalizedSubjects.map(s => ({
      name: s.name,
      semester: s.semester
    })));

    const semesterSubjects = normalizedSubjects.filter(subject => {
      const subjectSemester = String(subject.semester).trim();
      const targetSemester = String(data.semester).trim();
      console.log(`Comparing subject "${subject.name}": ${subjectSemester} === ${targetSemester}`);
      return subjectSemester === targetSemester;
    });

    console.log('🎯 Filtered subjects:', {
      semester: data.semester,
      total: normalizedSubjects.length,
      filtered: semesterSubjects.length,
      subjects: semesterSubjects.map(s => s.name)
    });

    if (!semesterSubjects.length) {
      errors.push(`No subjects available for semester ${data.semester}`);
    }

    const semesterTeachers = data.teachers?.filter(t =>
      String(t.semester).trim() === String(data.semester).trim()
    );
    if (!semesterTeachers?.length) {
      errors.push(`No teachers available for semester ${data.semester}`);
    }

    const semesterClasses = data.classes?.filter(c =>
      String(c.semester).trim() === String(data.semester).trim()
    );
    if (!semesterClasses?.length) {
      errors.push(`No classrooms available for semester ${data.semester}`);
    }

    return errors;
  };

  const normalizeSubjects = (subjects) => {
  if (!subjects) return [];

  let rawSubjects = [];

  if (subjects.subjects && Array.isArray(subjects.subjects)) {
    rawSubjects = subjects.subjects;
  } else if (Array.isArray(subjects)) {
    rawSubjects = subjects;
  } else if (typeof subjects === 'object') {
    rawSubjects = Object.values(subjects).flat();
  }

  return rawSubjects.map(subject => ({
    _id: subject._id || subject.id,
     // ✅ Prefer subject.subjectName first (matches DB field)
    name: subject.subjectName || subject.name || subject.subject_name || 'Unnamed Subject',
    semester: String(subject.semester || subject.sem_id || '').trim(),
    type: subject.type || 'Theory',
    department: subject.department_id || subject.department,
    credits: subject.credits || 0,
    teachers: subject.teachers || []
   }));
};

  const handleView = async (timetableId) => {
    setLoading(true);
    try {
      const [result, statsResult] = await Promise.all([
        timetableService.getTimetables(timetableId, true),
        timetableService.getStatistics(timetableId),
      ]);
      console.log("📋 Formatted Timetable API Response:", result);


      console.log("📥 Raw timetable API response:", result.data);
      console.log("📊 Raw statistics API response:", statsResult.data);

      if (result.success && result.data) {
        setFormattedTimetable(result.data);
        setSelectedTimetable(timetableId);

        if (statsResult.success && statsResult.data) {
          setStatistics(statsResult.data.statistics);
        }

        setActiveTab("view");
      }
    } catch (error) {
      toast.error("Failed to load timetable");
      console.error("View timetable error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async (id, status) => {
    try {
      const result = await timetableService.updateStatus(id, status);
      if (result.success || result.status) {
        await loadTimetables();
        toast.success(`Timetable ${status} successfully!`);
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Status update error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable?')) return;

    try {
      const result = await timetableService.deleteTimetable(id);
      if (result.success || !result.error) {
        await loadTimetables();
        toast.success('Timetable deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete timetable');
      console.error('Delete error:', error);
    }
  };

  const handleExport = async (id, format) => {
    try {
      const response = await timetableService.exportTimetable(id, format);

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timetable_${id}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('CSV exported successfully!');
      } else {
        toast.success('Export completed!');
      }
    } catch (error) {
      toast.error('Failed to export timetable');
      console.error('Export error:', error);
    }
  };

  const calculateStatistics = async (timetableData, teachers, classrooms) => {
    let totalClasses = 0;
    let labSessions = 0;
    let theorySessions = 0;

    const teacherLectureCount = {};
    const roomLectureCount = {};

    if (timetableData && timetableData.divisions) {
      timetableData.divisions.forEach((division) => {
        const schedule = division.schedule;

        for (const day in schedule) {
          const periods = schedule[day];
          periods.forEach((lecture) => {
            if (lecture) {
              totalClasses++;

              // Count labs
              if (lecture.isLab) {
                labSessions++;
              } else {
                theorySessions++;
              }

              // Count teacher usage
              if (lecture.teacher) {
                teacherLectureCount[lecture.teacher] = (teacherLectureCount[lecture.teacher] || 0) + 1;
              }

              // Count room usage
              if (lecture.room) {
                roomLectureCount[lecture.room] = (roomLectureCount[lecture.room] || 0) + 1;
              }
            }
          });
        }
      });
    }

    const totalTeacherPeriods = teachers.length * 12 * 5; // assuming 6 periods/day, 5 days/week, 2 semesters
    const usedTeacherPeriods = Object.values(teacherLectureCount).reduce((a, b) => a + b, 0);

    const totalRoomPeriods = classrooms.length * 6 * 5;
    const usedRoomPeriods = Object.values(roomLectureCount).reduce((a, b) => a + b, 0);

    const teacherUtilization = totalTeacherPeriods ? usedTeacherPeriods / totalTeacherPeriods : 0;
    const roomUtilization = totalRoomPeriods ? usedRoomPeriods / totalRoomPeriods : 0;

    const fitness_score = totalClasses * 2 + teacherUtilization * 100;

    return {
      totalClasses,
      labSessions,
      theorySessions,
      teacherUtilization,
      roomUtilization,
      fitness_score,
    };
  }



  const handleClone = async (id) => {
    const newAcademicYear = prompt('Enter new academic year:');
    if (!newAcademicYear) return;

    const newSemester = prompt('Enter new semester:');
    if (!newSemester) return;

    try {
      const result = await timetableService.cloneTimetable(id, {
        newAcademicYear,
        newSemester
      });

      if (result.success || result.id) {
        await loadTimetables();
        toast.success('Timetable cloned successfully!');
      }
    } catch (error) {
      toast.error('Failed to clone timetable');
      console.error('Clone error:', error);
    }
  };

  useEffect(() => {
    loadTimetables();
  }, [filters]);

  useEffect(() => {
    formatTimetableData(timetables, setFormattedTimetable);
  }, [timetables]);

  useEffect(() => {
    // console.log("✅ formattedTimetable.divisions =", formattedTimetable?.divisions);
    formattedTimetable?.divisions?.forEach((div, idx) => {
      //console.log(`➡️ Division ${idx}:`, div.division_name, div.schedule);
    });
  }, [formattedTimetable]);

  //console.log("🧠 Formatted Timetable in State:", formattedTimetable);

  // Render UI
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Timetable Management</h1>
        <p className="text-gray-600">Manage and generate timetables using genetic algorithm</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 border-b">
        {[
          { id: 'list', label: 'Timetables', icon: Calendar },
          { id: 'generate', label: 'Generate New', icon: Plus },
          { id: 'view', label: 'View Timetable', icon: Eye, disabled: !selectedTimetable }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : tab.disabled
                  ? 'border-transparent text-gray-400 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Timetables List */}
      {activeTab === 'list' && (
        <>
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Department Filter */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Semester</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select
                    value={filters.academicYear}
                    onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Timetables Grid */}
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
                <p className="text-gray-600">Loading timetables...</p>
              </div>
            ) : timetables.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No timetables found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.department ? 'No timetables match your filters' : 'Select a department to view timetables'}
                </p>
                {filters.department && (
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Generate New Timetable
                  </button>
                )}
              </div>
            ) : (
              timetables.map((timetable) => (
                <div key={timetable._id || timetable.id} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Semester {timetable.semester} - {timetable.academic_year || timetable.academicYear}
                      </h3>
                      <p className="text-gray-600">
                        Department: {timetable.department_id?.name || timetable.department?.name || 'Unknown'}
                      </p>
                      {timetable.generation_metadata?.algorithm_version && (
                        <p className="text-sm text-blue-600">
                          Generated using: {timetable.generation_metadata.algorithm_version}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${timetable.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : timetable.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {timetable.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {timetable.divisions?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Divisions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {timetable.generation_metadata?.fitness_score?.toFixed(3) || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Fitness Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {timetable.generation_metadata?.generation_count || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Generations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {timetable.generation_metadata?.conflicts_resolved || 0}
                      </div>
                      <div className="text-sm text-gray-600">Conflicts</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(timetable.createdAt || timetable.createdDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(timetable._id || timetable.id)}
                        className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>

                      {timetable.status === 'draft' && (
                        <button
                          onClick={() => handleStatusUpdate(timetable._id || timetable.id, 'published')}
                          className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Publish
                        </button>
                      )}

                      <button
                        onClick={() => handleExport(timetable._id || timetable.id, 'csv')}
                        className="flex items-center px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </button>

                      <button
                        onClick={() => handleClone(timetable._id || timetable.id)}
                        className="flex items-center px-3 py-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Clone
                      </button>

                      <button
                        onClick={() => handleDelete(timetable._id || timetable.id)}
                        className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Generate New Timetable */}
      {activeTab === 'generate' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-2" />
              Generate New Timetable
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={generateForm.departmentId}
                  onChange={(e) => setGenerateForm({ ...generateForm, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep.value} value={dep.value}>
                      {dep.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select
                    value={generateForm.semester}
                    onChange={(e) => setGenerateForm({ ...generateForm, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Semester</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select
                    value={generateForm.academicYear}
                    onChange={(e) => setGenerateForm({ ...generateForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Academic Year</option>
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Divisions</label>
                <div className="grid grid-cols-3 gap-2">
                  {divisions.map(division => (
                    <label key={division} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={generateForm.divisions.includes(division)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGenerateForm({
                              ...generateForm,
                              divisions: [...generateForm.divisions, division]
                            });
                          } else {
                            setGenerateForm({
                              ...generateForm,
                              divisions: generateForm.divisions.filter(d => d !== division)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      {division}
                    </label>
                  ))}
                </div>
              </div>







              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">🧬 Genetic Algorithm Settings</h4>
                <p className="text-sm text-blue-700">
                  The system will use advanced genetic algorithms to optimize the timetable considering all constraints,
                  teacher availability, and resource allocation for the best possible solution.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                      Generating with AI...
                    </>
                  ) : 'Generate Optimized Timetable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Timetable */}
      {activeTab === 'view' && selectedTimetable && formattedTimetable && (

        <div className="space-y-6">
          {statistics && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Timetable Statistics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{statistics.totalClasses || 0}</div>
                  <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{statistics.labSessions || 0}</div>
                  <div className="text-sm text-gray-600">Lab Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{statistics.theorySessions || 0}</div>
                  <div className="text-sm text-gray-600">Theory Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {typeof statistics.teacherUtilization === 'number'
                      ? `${(statistics.teacherUtilization * 100).toFixed(1)}%`
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Teacher Utilization</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {typeof statistics.roomUtilization === 'number'
                      ? `${(statistics.roomUtilization * 100).toFixed(1)}%`
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Room Utilization</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {typeof statistics.fitness_score === 'number'
                      ? statistics.fitness_score.toFixed(3)
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Fitness Score</div>
                </div>
              </div>

            </div>
          )}
          {/* 
          
{console.log("🧾 formattedTimetable:", formattedTimetable)}
{formattedTimetable?.divisions?.length > 0 ? (
  formattedTimetable.divisions.map((division, idx) => {
    console.log(`📌 Division ${idx + 1}: ${division.division_name}`);
    console.log("📌 Schedule for this division:", division.schedule);

    const schedule = division.schedule || {};
    const hasSchedule = Object.keys(schedule).length > 0;

    return (
      <div key={idx} className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Division {division.division_name} — Semester {formattedTimetable.semester}
          </h3>
        </div>
        <div className="p-6 overflow-x-auto">
          {hasSchedule ? (
            renderTimetableGrid(division.division_name, formattedTimetable) // ✅ Corrected here
          ) : (
            <div className="text-center py-8 text-gray-500">
              No schedule found for this division
            </div>
          )}
        </div>
      </div>
    );
  })
) : (
  <div className="text-center py-8 text-gray-500">
    No divisions found or timetable not generated yet.
  </div>
)} */}

          {console.log("🧾 formattedTimetable:", formattedTimetable)}
          {console.log("📚 Subjects:", subjects)}
          {console.log("🏫 Classrooms:", classes)}

          {formattedTimetable?.divisions?.length > 0 ? (
            formattedTimetable.divisions.map((division, idx) => {
              console.log(`📌 Division ${idx + 1}: ${division.division_name}`);
              console.log("📌 Schedule for this division:", division.schedule);

              const schedule = division.schedule || {};
              const hasSchedule = Object.keys(schedule).length > 0;

              return (
                <div key={idx} className="bg-white rounded-lg border mb-6">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">
                      Division {division.division_name} — Semester {formattedTimetable.semester}
                    </h3>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    {console.log("📦 formattedTimetable = ", formattedTimetable)
                      }
                    {hasSchedule ? (
                      // renderTimetableGrid(division.division_name, schedule) // ✅ Pass only the schedule
                      renderTimetableGrid(
                        division.division_name,
                        schedule,
                        formattedTimetable.subjects || subjects,
                        formattedTimetable.classes || classes
                      )

                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No schedule found for this division
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No divisions found or timetable not generated yet.
            </div> 
          )}



        </div>
      )}
    </div>
  );
};

export default Timetables;
