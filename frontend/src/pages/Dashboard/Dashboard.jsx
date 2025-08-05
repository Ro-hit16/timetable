
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


import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Building2
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /** -----------------------------------------------
   * Corrected dashboard logic
   * ----------------------------------------------- */
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        teachersRes,
        departmentsRes,
        timetablesRes,
        subjectsRes
      ] = await Promise.all([
        teacherService.getAllTeachers({ limit: 9999 }),
        departmentService.getAllDepartments({ limit: 9999 }),
        timetableService.getAllTimetables({ limit: 9999 }),
        subjectService.getAllSubjects({ limit: 9999 })
      ]);

      const teachers    = Array.isArray(teachersRes?.data)    ? teachersRes.data    : (teachersRes?.data?.teachers || []);
      const departments = Array.isArray(departmentsRes?.data) ? departmentsRes.data : (departmentsRes?.data?.departments || []);
      const timetables  = Array.isArray(timetablesRes?.data)  ? timetablesRes.data  : (timetablesRes?.data?.timetables || []);
      const subjects    = Array.isArray(subjectsRes?.data)    ? subjectsRes.data    : (subjectsRes?.data?.subjects || []);

      setStats({
        subjects: subjects.length,
        teachers: teachers.length,
        departments: departments.length,
        activeTimetables: timetables.length
      });

      setRecentActivities([
        { id: 1, action: 'New timetable published', details: 'TY CSE timetable uploaded', time: '3 hours ago', type: 'timetable' },
        { id: 2, action: 'Teacher added', details: 'Prof. Sneha joined this week', time: '1 day ago', type: 'teacher' }
      ]);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'teacher': return <GraduationCap className="h-4 w-4 text-green-500" />;
        case 'timetable': return <Calendar className="h-4 w-4 text-orange-500" />;
        case 'course': return <BookOpen className="h-4 w-4 text-purple-500" />;
        default: return <Clock className="h-4 w-4 text-gray-500" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className="mt-1">{getActivityIcon(activity.type)}</div>
        <div>
          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
          <p className="text-sm text-gray-500">{activity.details}</p>
          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <button onClick={fetchDashboardData} className="text-sm text-blue-600 hover:underline">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Subjects" value={stats.subjects} icon={BookOpen} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard title="Total Teachers" value={stats.teachers} icon={GraduationCap} color="text-green-600" bgColor="bg-green-100" />
        <StatCard title="Departments" value={stats.departments} icon={Building2} color="text-orange-600" bgColor="bg-orange-100" />
        <StatCard title="Active Timetables" value={stats.activeTimetables} icon={Calendar} color="text-red-600" bgColor="bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-4">
              {recentActivities.length ? (
                <div className="space-y-2">
                  {recentActivities.map(a => <ActivityItem key={a.id} activity={a}/>)}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No recent activities</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-3">
            <button onClick={() => navigate('/teachers')} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Add New Teacher</span>
            </button>
            <button onClick={() => navigate('/subjects')} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Add Subjects</span>
            </button>
            <button onClick={() => navigate('/timetables')} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Generate Timetable</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
