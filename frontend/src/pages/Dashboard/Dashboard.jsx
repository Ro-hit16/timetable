
// import React, { useState, useEffect } from 'react';
// import {
//   Users,
//   GraduationCap,
//   BookOpen,
//   Calendar,
//   Clock,
//   Building2
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import teacherService from '../../services/teacherService';

// import departmentService from '../../services/departmentService';
// import timetableService from '../../services/timetableService';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import subjectService from '../../services/subjectService';

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     subjects: 0,
//     teachers: 0,
//     courses: 0,
//     departments: 0,
//     activeTimetables: 0
//   });

//   const [recentActivities, setRecentActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // const fetchDashboardData = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const [ teachers, courses, departments, timetables, subjects ] = await Promise.all([

//   //       teacherService.getAllTeachers({ limit: 1 }),
//   //       courseService.getAllCourses({ limit: 1 }),
//   //       departmentService.getAllDepartments({ limit: 1 }),
//   //       timetableService.getAllTimetables({ limit: 5 }),
//   //       subjectService.getAllSubjects({ limit: 5 })
//   //     ]);

//   //     setStats({
//   //       subjects: Array.isArray(subjects) ? subjects.length : 0,
//   //       teachers: Array.isArray(teachers) ? teachers.length : 0,
//   //       courses: Array.isArray(courses) ? courses.length : 0,
//   //       departments: Array.isArray(departments) ? departments.length : 0,
//   //       activeTimetables: Array.isArray(timetables) ? timetables.length : 0
//   //     });

//   //     // Replace with real activity API later
//   //     setRecentActivities([
//   //       { id: 1, action: 'New student enrolled', details: 'John Doe joined Computer Science', time: '2 hours ago', type: 'student' },
//   //       { id: 2, action: 'Timetable updated', details: 'CS Semester 3 schedule modified', time: '4 hours ago', type: 'timetable' },
//   //       { id: 3, action: 'New teacher added', details: 'Dr. Smith joined Mathematics dept', time: '1 day ago', type: 'teacher' },
//   //       { id: 4, action: 'Course created', details: 'Advanced Database Systems', time: '2 days ago', type: 'course' }
//   //     ]);

//   //   } catch (error) {
//   //     console.error('Dashboard fetch error:', error);
//   //     toast.error('Failed to load dashboard data');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const fetchDashboardData = async () => {
//   setLoading(true);
//   try {
//     const [
//       teachersRes,,
//       departmentsRes,
//       timetablesRes,
//       subjectsRes
//     ] = await Promise.all([
//       //teacherService.getAllTeachers(),
      
//       departmentService.getAllDepartments(),
//       timetableService.getTimetables(),
//       subjectService.getAllSubjects()
//     ]);
//     console.log('teachersRes', subjectsRes);

//     // Safely extract array from .data (similar to fetchSubjects logic)
//     const teachers    = Array.isArray(teachersRes?.data)    ? teachersRes.data    : (teachersRes?.data?.teachers || []);
    
//     const departments = Array.isArray(departmentsRes?.data) ? departmentsRes.data : (departmentsRes?.data?.departments || []);
//     const timetables  = Array.isArray(timetablesRes?.data)  ? timetablesRes.data  : (timetablesRes?.data?.timetables || []);
//     const subjects    = Array.isArray(subjectsRes?.data)    ? subjectsRes.data    : (subjectsRes?.data?.subjects || []);

//     setStats({
//       subjects: subjects.length,
//       teachers:  teachersRes.length,
     
//       departments: departmentsRes.departments.length,
//       activeTimetables: timetables.length,
//     });

//     setRecentActivities([
//       { id: 1, action: 'New student enrolled', details: 'John Doe joined Computer Science', time: '2 hours ago', type: 'student' },
//       { id: 2, action: 'Timetable updated', details: 'CS Semester 3 schedule modified', time: '4 hours ago', type: 'timetable' },
//       { id: 3, action: 'New teacher added', details: 'Dr. Smith joined Mathematics dept', time: '1 day ago', type: 'teacher' },
//       { id: 4, action: 'Course created', details: 'Advanced Database Systems', time: '2 days ago', type: 'course' }
//     ]);

//   } catch (error) {
//     console.error('Dashboard fetch error:', error);
//     toast.error('Failed to load dashboard data');
//   } finally {
//     setLoading(false);
//   }
// };

//   const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//         </div>
//         <div className={`p-3 rounded-full ${bgColor}`}>
//           <Icon className={`h-6 w-6 ${color}`} />
//         </div>
//       </div>
//     </div>
//   );

//   const ActivityItem = ({ activity }) => {
//     const getActivityIcon = (type) => {
//       switch (type) {
//         case 'student': return <Users className="h-4 w-4 text-blue-500" />;
//         case 'teacher': return <GraduationCap className="h-4 w-4 text-green-500" />;
//         case 'course': return <BookOpen className="h-4 w-4 text-purple-500" />;
//         case 'timetable': return <Calendar className="h-4 w-4 text-orange-500" />;
//         default: return <Clock className="h-4 w-4 text-gray-500" />;
//       }
//     };

//     return (
//       <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
//         <div className="mt-1">{getActivityIcon(activity.type)}</div>
//         <div>
//           <p className="text-sm font-medium text-gray-900">{activity.action}</p>
//           <p className="text-sm text-gray-500">{activity.details}</p>
//           <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return <LoadingSpinner size="large" text="Loading dashboard..." />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
//         </div>
//         <button
//           onClick={fetchDashboardData}
//           className="text-sm text-blue-600 hover:underline"
//         >
//           Refresh
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//         <StatCard title="Total Subjects" value={stats.subjects} icon={Users} color="text-blue-600" bgColor="bg-blue-100" />
//         <StatCard title="Total Teachers" value={stats.teachers} icon={GraduationCap} color="text-green-600" bgColor="bg-green-100" />
//         <StatCard title="Departments" value={stats.departments} icon={Building2} color="text-orange-600" bgColor="bg-orange-100" />
//         <StatCard title="Active Timetables" value={stats.activeTimetables} icon={Calendar} color="text-red-600" bgColor="bg-red-100" />
//       </div>

//       {/* Activities & Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Activities */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-sm border">
//             <div className="px-6 py-4 border-b">
//               <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
//             </div>
//             <div className="p-4">
//               {recentActivities.length > 0 ? (
//                 <div className="space-y-2">
//                   {recentActivities.map((activity) => (
//                     <ActivityItem key={activity.id} activity={activity} />
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-center text-gray-500 py-8">No recent activities</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="px-6 py-4 border-b">
//             <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
//           </div>
//           <div className="p-4 space-y-3">
            
//             <button onClick={() => navigate('/teachers')} className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
//               <GraduationCap className="h-5 w-5 text-green-600" />
//               <span className="text-sm font-medium text-gray-900" >Add New Teacher</span>
//             </button>
//             <button onClick={() => navigate('/subjects')} className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
//               <BookOpen className="h-5 w-5 text-purple-600" />
//               <span className="text-sm font-medium text-gray-900">Add Subjects</span>
//             </button>
//             <button onClick={() => navigate('/timetables')} className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
//               <Calendar className="h-5 w-5 text-orange-600" />
//               <span className="text-sm font-medium text-gray-900">Generate Timetable</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import {
//   Users,
//   GraduationCap,
//   BookOpen,
//   Calendar,
//   Clock,
//   Building2
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import teacherService from '../../services/teacherService';
// import departmentService from '../../services/departmentService';
// import timetableService from '../../services/timetableService';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import subjectService from '../../services/subjectService';

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     subjects: 0,
//     teachers: 0,
//     departments: 0,
//     activeTimetables: 0
//   });

//   const [recentActivities, setRecentActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   /** -----------------------------------------------
//    * Corrected dashboard logic
//    * ----------------------------------------------- */
//   // const fetchDashboardData = async () => {
//   //   setLoading(true);
//   //   console.log("Fetching dashboard data...");
//   //   try {
//   //     const [
//   //       teachersRes,
//   //       departmentsRes,
//   //       timetablesRes,
//   //       subjectsRes
//   //     ] = await Promise.all([
//   //       teacherService.getAllTeachers({ limit: 9999 }),
//   //       departmentService.getDepartmentsForSelect({ limit: 9999 }),
//   //       timetableService.getAllTimetables({ limit: 9999 }),
//   //       subjectService.getAllSubjects({ limit: 9999 })
//   //     ]);


//   //     console.log("Teachers Response:", teachersRes);
//   //   console.log("Departments Response:", departmentsRes);
//   //   console.log("Timetables Response:", timetablesRes);
//   //   console.log("Subjects Response:", subjectsRes);

//   //     const teachers    = Array.isArray(teachersRes?.data)    ? teachersRes.data    : (teachersRes?.data?.teachers || []);
      
//   //     const departments = Array.isArray(departmentsRes?.data) ? departmentsRes.data : (departmentsRes?.data?.departments || []);
//   //     const timetables  = Array.isArray(timetablesRes?.data)  ? timetablesRes.data  : (timetablesRes?.data?.timetables || []);
//   //     const subjects    = Array.isArray(subjectsRes?.data)    ? subjectsRes.data    : (subjectsRes?.data?.subjects || []);

//   //     setStats({
//   //       subjects: subjects.length,
//   //       teachers: teachers.length,
//   //       departments: departments.length,
//   //       activeTimetables: timetables.length
//   //     });

//   //     setRecentActivities([
//   //       { id: 1, action: 'New timetable published', details: 'TY CSE timetable uploaded', time: '3 hours ago', type: 'timetable' },
//   //       { id: 2, action: 'Teacher added', details: 'Prof. Sneha joined this week', time: '1 day ago', type: 'teacher' }
//   //     ]);

//   //   } catch (error) {
//   //     console.error('Dashboard fetch error:', error);
//   //     toast.error('Failed to load dashboard data');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const fetchDashboardData = async () => {
//   setLoading(true);

//   let subjectsArray = [];
//   let teachersArray = [];
//   let departmentsArray = [];
//   let timetablesArray = [];

//   try {
//     // 1️⃣ Fetch Subjects
//     try {
//       console.log("Fetching subjects...");
//       const subjectsRes = await subjectService.getAllSubjects();
//       subjectsArray = subjectsRes.success && subjectsRes.data
//         ? (Array.isArray(subjectsRes.data) ? subjectsRes.data : subjectsRes.data.subjects || [])
//         : [];
//       console.log("Subjects fetched:", subjectsArray);
//     } catch (err) {
//       console.error("Error fetching subjects:", err);
//       toast.error("Failed to fetch subjects");
//     }

//     // 2️⃣ Fetch Departments
//     try {
//       console.log("Fetching departments...");
//       departmentsArray = await departmentService.getDepartmentsForSelect();
//       console.log("Departments fetched:", departmentsArray);
//     } catch (err) {
//       console.error("Error fetching departments:", err);
//       toast.error("Failed to fetch departments");
//     }

//     // 3️⃣ Fetch Teachers
//     try {
//       console.log("Fetching teachers...");
//       const teachersRes = await fetch('/api/teachers');
//       const teachersData = await teachersRes.json();
//       teachersArray = teachersData.success
//         ? (Array.isArray(teachersData.data) ? teachersData.data : teachersData.data.teachers || [])
//         : [];
//       console.log("Teachers fetched:", teachersArray);
//     } catch (err) {
//       console.error("Error fetching teachers:", err);
//       toast.error("Failed to fetch teachers");
//     }

//     // 4️⃣ Fetch Timetables
//     try {
//       console.log("Fetching timetables...");
//       const timetablesRes = await timetableService.getAllTimetables();
//       timetablesArray = timetablesRes.success && timetablesRes.data
//         ? (Array.isArray(timetablesRes.data) ? timetablesRes.data : timetablesRes.data.timetables || [])
//         : [];
//       console.log("Timetables fetched:", timetablesArray);
//     } catch (err) {
//       console.error("Error fetching timetables:", err);
//       toast.error("Failed to fetch timetables");
//     }

//     // Set Dashboard stats
//     setStats({
//       subjects: subjectsArray.length,
//       teachers: teachersArray.length,
//       departments: departmentsArray.length,
//       activeTimetables: timetablesArray.length
//     });

//     console.log("Dashboard stats set:", {
//       subjects: subjectsArray.length,
//       teachers: teachersArray.length,
//       departments: departmentsArray.length,
//       activeTimetables: timetablesArray.length
//     });

//   } finally {
//     setLoading(false);
//     console.log("Dashboard loading finished");
//   }
// };


//   const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
//     <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//         </div>
//         <div className={`p-3 rounded-full ${bgColor}`}>
//           <Icon className={`h-6 w-6 ${color}`} />
//         </div>
//       </div>
//     </div>
//   );

//   const ActivityItem = ({ activity }) => {
//     const getActivityIcon = (type) => {
//       switch (type) {
//         case 'teacher': return <GraduationCap className="h-4 w-4 text-green-500" />;
//         case 'timetable': return <Calendar className="h-4 w-4 text-orange-500" />;
//         case 'course': return <BookOpen className="h-4 w-4 text-purple-500" />;
//         default: return <Clock className="h-4 w-4 text-gray-500" />;
//       }
//     };

//     return (
//       <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
//         <div className="mt-1">{getActivityIcon(activity.type)}</div>
//         <div>
//           <p className="text-sm font-medium text-gray-900">{activity.action}</p>
//           <p className="text-sm text-gray-500">{activity.details}</p>
//           <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return <LoadingSpinner size="large" text="Loading dashboard..." />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
//         </div>
//         <button onClick={fetchDashboardData} className="text-sm text-blue-600 hover:underline">
//           Refresh
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Subjects" value={stats.subjects} icon={BookOpen} color="text-blue-600" bgColor="bg-blue-100" />
//         <StatCard title="Total Teachers" value={stats.teachers} icon={GraduationCap} color="text-green-600" bgColor="bg-green-100" />
//         <StatCard title="Departments" value={stats.departments} icon={Building2} color="text-orange-600" bgColor="bg-orange-100" />
//         <StatCard title="Active Timetables" value={stats.activeTimetables} icon={Calendar} color="text-red-600" bgColor="bg-red-100" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-sm border">
//             <div className="px-6 py-4 border-b">
//               <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
//             </div>
//             <div className="p-4">
//               {recentActivities.length ? (
//                 <div className="space-y-2">
//                   {recentActivities.map(a => <ActivityItem key={a.id} activity={a}/>)}
//                 </div>
//               ) : (
//                 <p className="text-center text-gray-500 py-8">No recent activities</p>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="px-6 py-4 border-b">
//             <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
//           </div>
//           <div className="p-4 space-y-3">
//             <button onClick={() => navigate('/teachers')} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
//               <GraduationCap className="h-5 w-5 text-green-600" />
//               <span className="text-sm font-medium">Add New Teacher</span>
//             </button>
//             <button onClick={() => navigate('/subjects')} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
//               <BookOpen className="h-5 w-5 text-purple-600" />
//               <span className="text-sm font-medium">Add Subjects</span>
//             </button>
//             <button onClick={() => navigate('/timetables')} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
//               <Calendar className="h-5 w-5 text-orange-600" />
//               <span className="text-sm font-medium">Generate Timetable</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




// import React, { useState, useEffect } from 'react';
// import {
//   Users,
//   GraduationCap,
//   BookOpen,
//   Calendar,
//   Clock,
//   Building2,
//   BarChart3,
//   Bell,
//   Search,
//   Plus,
//   Download,
//   RefreshCw,
//   ChevronRight,
//   Eye,
//   MoreHorizontal
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import teacherService from '../../services/teacherService';
// import departmentService from '../../services/departmentService';
// import timetableService from '../../services/timetableService';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import subjectService from '../../services/subjectService';

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     subjects: 0,
//     teachers: 0,
//     departments: 0,
//     activeTimetables: 0
//   });

//   const [recentActivities, setRecentActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);

//     let subjectsArray = [];
//     let teachersArray = [];
//     let departmentsArray = [];
//     let timetablesArray = [];

//     try {
//       // 1️⃣ Fetch Subjects
//       try {
//         console.log("Fetching subjects...");
//         const subjectsRes = await subjectService.getAllSubjects();
//         subjectsArray = subjectsRes.success && subjectsRes.data
//           ? (Array.isArray(subjectsRes.data) ? subjectsRes.data : subjectsRes.data.subjects || [])
//           : [];
//         console.log("Subjects fetched:", subjectsArray);
//       } catch (err) {
//         console.error("Error fetching subjects:", err);
//         toast.error("Failed to fetch subjects");
//       }

//       // 2️⃣ Fetch Departments
//       try {
//         console.log("Fetching departments...");
//         departmentsArray = await departmentService.getDepartmentsForSelect();
//         console.log("Departments fetched:", departmentsArray);
//       } catch (err) {
//         console.error("Error fetching departments:", err);
//         toast.error("Failed to fetch departments");
//       }

//       // 3️⃣ Fetch Teachers
//       try {
//         console.log("Fetching teachers...");
//         const teachersRes = await fetch('/api/teachers');
//         const teachersData = await teachersRes.json();
//         teachersArray = teachersData.success
//           ? (Array.isArray(teachersData.data) ? teachersData.data : teachersData.data.teachers || [])
//           : [];
//         console.log("Teachers fetched:", teachersArray);
//       } catch (err) {
//         console.error("Error fetching teachers:", err);
//         toast.error("Failed to fetch teachers");
//       }

//       // 4️⃣ Fetch Timetables
//       try {
//         console.log("Fetching timetables...");
//         const timetablesRes = await timetableService.getAllTimetables();
//         timetablesArray = timetablesRes.success && timetablesRes.data
//           ? (Array.isArray(timetablesRes.data) ? timetablesRes.data : timetablesRes.data.timetables || [])
//           : [];
//         console.log("Timetables fetched:", timetablesArray);
//       } catch (err) {
//         console.error("Error fetching timetables:", err);
//         toast.error("Failed to fetch timetables");
//       }

//       // Set Dashboard stats
//       setStats({
//         subjects: subjectsArray.length,
//         teachers: teachersArray.length,
//         departments: departmentsArray.length,
//         activeTimetables: timetablesArray.length
//       });

//       console.log("Dashboard stats set:", {
//         subjects: subjectsArray.length,
//         teachers: teachersArray.length,
//         departments: departmentsArray.length,
//         activeTimetables: timetablesArray.length
//       });

//       // Add sample recent activities (you can replace with actual data)
//       setRecentActivities([
//         { id: 1, action: 'New timetable published', details: 'TY CSE timetable uploaded', time: '3 hours ago', type: 'timetable' },
//         { id: 2, action: 'Teacher added', details: 'Prof. Sneha joined this week', time: '1 day ago', type: 'teacher' },
//         { id: 3, action: 'Subject updated', details: 'Advanced Algorithms syllabus modified', time: '2 days ago', type: 'subject' }
//       ]);

//     } finally {
//       setLoading(false);
//       console.log("Dashboard loading finished");
//     }
//   };

//   const StatCard = ({ title, value, icon: Icon, color, bgColor, trend }) => (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
//           <p className="text-3xl font-bold text-gray-900">{value}</p>
//           {trend && (
//             <div className={`flex items-center mt-2 text-sm ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
//             </div>
//           )}
//         </div>
//         <div className={`p-3 rounded-xl ${bgColor} shadow-inner`}>
//           <Icon className={`h-6 w-6 ${color}`} />
//         </div>
//       </div>
//     </div>
//   );

//   const ActivityItem = ({ activity }) => {
//     const getActivityIcon = (type) => {
//       switch (type) {
//         case 'teacher': return <GraduationCap className="h-5 w-5 text-green-500" />;
//         case 'timetable': return <Calendar className="h-5 w-5 text-blue-500" />;
//         case 'subject': return <BookOpen className="h-5 w-5 text-purple-500" />;
//         default: return <Clock className="h-5 w-5 text-gray-500" />;
//       }
//     };

//     const getActivityColor = (type) => {
//       switch (type) {
//         case 'teacher': return 'bg-green-100';
//         case 'timetable': return 'bg-blue-100';
//         case 'subject': return 'bg-purple-100';
//         default: return 'bg-gray-100';
//       }
//     };

//     return (
//       <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
//         <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
//           {getActivityIcon(activity.type)}
//         </div>
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-900">{activity.action}</p>
//           <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
//           <p className="text-xs text-gray-400 mt-2 flex items-center">
//             <Clock className="h-3 w-3 mr-1" /> {activity.time}
//           </p>
//         </div>
//         <button className="text-gray-400 hover:text-gray-600">
//           <MoreHorizontal className="h-4 w-4" />
//         </button>
//       </div>
//     );
//   };

//   const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
//     <button 
//       onClick={onClick} 
//       className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200 group"
//     >
//       <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200 mb-2`}>
//         <Icon className="h-5 w-5 text-white" />
//       </div>
//       <span className="text-sm font-medium text-gray-700">{label}</span>
//     </button>
//   );

//   if (loading) {
//     return <LoadingSpinner size="large" text="Loading dashboard..." />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
//             <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your institution today.</p>
//           </div>
//           <div className="flex items-center space-x-4 mt-4 md:mt-0">
//             <div className="relative">
//               <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
//               <Bell className="h-5 w-5 text-gray-600" />
//             </button>
//             <button 
//               onClick={fetchDashboardData}
//               className="flex items-center space-x-2 bg-white py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <RefreshCw className="h-4 w-4" />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard 
//             title="Total Subjects" 
//             value={stats.subjects} 
//             icon={BookOpen} 
//             color="text-blue-600" 
//             bgColor="bg-blue-100"
//             trend={{ value: 12, label: 'from last month' }}
//           />
//           <StatCard 
//             title="Total Teachers" 
//             value={stats.teachers} 
//             icon={GraduationCap} 
//             color="text-green-600" 
//             bgColor="bg-green-100"
//             trend={{ value: 5, label: 'from last month' }}
//           />
//           <StatCard 
//             title="Departments" 
//             value={stats.departments} 
//             icon={Building2} 
//             color="text-orange-600" 
//             bgColor="bg-orange-100"
//           />
//           <StatCard 
//             title="Active Timetables" 
//             value={stats.activeTimetables} 
//             icon={Calendar} 
//             color="text-purple-600" 
//             bgColor="bg-purple-100"
//             trend={{ value: 8, label: 'from last week' }}
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           {/* Quick Actions */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
//                 <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
//                 Quick Actions
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <QuickActionButton 
//                   icon={Plus} 
//                   label="Add Teacher" 
//                   onClick={() => navigate('/teachers')} 
//                   color="bg-green-500"
//                 />
//                 <QuickActionButton 
//                   icon={BookOpen} 
//                   label="Add Subject" 
//                   onClick={() => navigate('/subjects')} 
//                   color="bg-blue-500"
//                 />
//                 <QuickActionButton 
//                   icon={Calendar} 
//                   label="Generate Timetable" 
//                   onClick={() => navigate('/timetables')} 
//                   color="bg-purple-500"
//                 />
//                 <QuickActionButton 
//                   icon={Download} 
//                   label="Export Data" 
//                   onClick={() => toast.info('Export functionality will be implemented here')} 
//                   color="bg-orange-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Recent Activities */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
//                 <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
//                   View all <ChevronRight className="h-4 w-4 inline" />
//                 </button>
//               </div>
//               <div className="divide-y divide-gray-100">
//                 {recentActivities.length > 0 ? (
//                   recentActivities.map(activity => (
//                     <ActivityItem key={activity.id} activity={activity} />
//                   ))
//                 ) : (
//                   <div className="text-center py-12">
//                     <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                     <p className="text-gray-500">No recent activities</p>
//                     <p className="text-sm text-gray-400 mt-1">Activities will appear here as they happen</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Upcoming Events Section - Added for better visualization */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">Upcoming Schedule</h3>
//             <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
//               View full calendar <ChevronRight className="h-4 w-4 inline" />
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="p-4 border border-gray-200 rounded-lg">
//               <div className="text-sm font-medium text-gray-500">Mon, 12 Jun</div>
//               <div className="mt-2 font-semibold">Faculty Meeting</div>
//               <div className="text-sm text-gray-500 mt-1">10:00 AM - Conference Room</div>
//             </div>
//             <div className="p-4 border border-gray-200 rounded-lg">
//               <div className="text-sm font-medium text-gray-500">Tue, 13 Jun</div>
//               <div className="mt-2 font-semibold">Exam Schedule Finalization</div>
//               <div className="text-sm text-gray-500 mt-1">2:00 PM - Principal's Office</div>
//             </div>
//             <div className="p-4 border border-gray-200 rounded-lg">
//               <div className="text-sm font-medium text-gray-500">Wed, 14 Jun</div>
//               <div className="mt-2 font-semibold">New Semester Planning</div>
//               <div className="text-sm text-gray-500 mt-1">11:00 AM - Meeting Room A</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Building2,
  BarChart3,
  Bell,
  Search,
  Plus,
  Download,
  RefreshCw,
  ChevronRight,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import teacherService from '../../services/teacherService';
import departmentService from '../../services/departmentService';
import timetableService from '../../services/timetableService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import subjectService from '../../services/subjectService';

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    subjects: 0,
    teachers: 0,
    departments: 0,
    activeTimetables: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    let subjectsArray = [];
    let teachersArray = [];
    let departmentsArray = [];
    let activeArray = [];

    try {
      // 1️⃣ Fetch Subjects
      try {
        console.log("Fetching subjects...");
        const subjectsRes = await subjectService.getAllSubjects();
        subjectsArray = subjectsRes.success && subjectsRes.data
          ? (Array.isArray(subjectsRes.data) ? subjectsRes.data : subjectsRes.data.subjects || [])
          : [];
        console.log("Subjects fetched:", subjectsArray);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        toast.error("Failed to fetch subjects");
      }

      // 2️⃣ Fetch Departments
      try {
        console.log("Fetching departments...");
        departmentsArray = await departmentService.getDepartmentsForSelect();
        console.log("Departments fetched:", departmentsArray);
      } catch (err) {
        console.error("Error fetching departments:", err);
        toast.error("Failed to fetch departments");
      }

      // 3️⃣ Fetch Teachers
      try {
        console.log("Fetching teachers...");
        const teachersRes = await fetch('/api/teachers');
        const teachersData = await teachersRes.json();
        teachersArray = teachersData.success
          ? (Array.isArray(teachersData.data) ? teachersData.data : teachersData.data.teachers || [])
          : [];
        console.log("Teachers fetched:", teachersArray);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        toast.error("Failed to fetch teachers");
      }

      // 4️⃣ Fetch Active Timetables
      try {
        console.log("Fetching active timetables...");
        const activeRes = await timetableService.getActiveTimetables();
        activeArray = activeRes.success && activeRes.data
          ? (Array.isArray(activeRes.data) ? activeRes.data : activeRes.data.timetables || [])
          : [];
        console.log("Active timetables fetched:", activeArray);
      } catch (err) {
        console.error("Error fetching active timetables:", err);
        toast.error("Failed to fetch active timetables");
      }

      // Set Dashboard stats
      setStats({
        subjects: subjectsArray.length,
        teachers: teachersArray.length,
        departments: departmentsArray.length,
        activeTimetables: activeArray.length   // ✅ fixed
      });

      console.log("Dashboard stats set:", {
        subjects: subjectsArray.length,
        teachers: teachersArray.length,
        departments: departmentsArray.length,
        activeTimetables: activeArray.length
      });

      // Add sample recent activities (replace with actual later)
      setRecentActivities([
        { id: 1, action: 'New timetable published', details: 'TY CSE timetable uploaded', time: '3 hours ago', type: 'timetable' },
        { id: 2, action: 'Teacher added', details: 'Prof. Sneha joined this week', time: '1 day ago', type: 'teacher' },
        { id: 3, action: 'Subject updated', details: 'Advanced Algorithms syllabus modified', time: '2 days ago', type: 'subject' }
      ]);

    } finally {
      setLoading(false);
      console.log("Dashboard loading finished");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor} shadow-inner`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'teacher': return <GraduationCap className="h-5 w-5 text-green-500" />;
        case 'timetable': return <Calendar className="h-5 w-5 text-blue-500" />;
        case 'subject': return <BookOpen className="h-5 w-5 text-purple-500" />;
        default: return <Clock className="h-5 w-5 text-gray-500" />;
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'teacher': return 'bg-green-100';
        case 'timetable': return 'bg-blue-100';
        case 'subject': return 'bg-purple-100';
        default: return 'bg-gray-100';
      }
    };

    return (
      <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
          <p className="text-xs text-gray-400 mt-2 flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {activity.time}
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-blue-200 group"
    >
      <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200 mb-2`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your institution today.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={fetchDashboardData}
              className="flex items-center space-x-2 bg-white py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Subjects" 
            value={stats.subjects} 
            icon={BookOpen} 
            color="text-blue-600" 
            bgColor="bg-blue-100"
            trend={{ value: 12, label: 'from last month' }}
          />
          <StatCard 
            title="Total Teachers" 
            value={stats.teachers} 
            icon={GraduationCap} 
            color="text-green-600" 
            bgColor="bg-green-100"
            trend={{ value: 5, label: 'from last month' }}
          />
          <StatCard 
            title="Departments" 
            value={stats.departments} 
            icon={Building2} 
            color="text-orange-600" 
            bgColor="bg-orange-100"
          />
          <StatCard 
            title="Active Timetables" 
            value={stats.activeTimetables} 
            icon={Calendar} 
            color="text-purple-600" 
            bgColor="bg-purple-100"
            trend={{ value: 8, label: 'from last week' }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton 
                  icon={Plus} 
                  label="Add Teacher" 
                  onClick={() => navigate('/teachers')} 
                  color="bg-green-500"
                />
                <QuickActionButton 
                  icon={BookOpen} 
                  label="Add Subject" 
                  onClick={() => navigate('/subjects')} 
                  color="bg-blue-500"
                />
                <QuickActionButton 
                  icon={Calendar} 
                  label="Generate Timetable" 
                  onClick={() => navigate('/timetables')} 
                  color="bg-purple-500"
                />
                <QuickActionButton 
                  icon={Download} 
                  label="Export Data" 
                  onClick={() => toast.info('Export functionality will be implemented here')} 
                  color="bg-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all <ChevronRight className="h-4 w-4 inline" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivities.length > 0 ? (
                  recentActivities.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activities</p>
                    <p className="text-sm text-gray-400 mt-1">Activities will appear here as they happen</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Schedule</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View full calendar <ChevronRight className="h-4 w-4 inline" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Mon, 12 Jun</div>
              <div className="mt-2 font-semibold">Faculty Meeting</div>
              <div className="text-sm text-gray-500 mt-1">10:00 AM - Conference Room</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Tue, 13 Jun</div>
              <div className="mt-2 font-semibold">Exam Schedule Finalization</div>
              <div className="text-sm text-gray-500 mt-1">2:00 PM - Principal's Office</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Wed, 14 Jun</div>
              <div className="mt-2 font-semibold">New Semester Planning</div>
              <div className="text-sm text-gray-500 mt-1">11:00 AM - Meeting Room A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
