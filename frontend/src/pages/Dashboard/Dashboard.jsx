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
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  CalendarClock
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import teacherService from '../../services/teacherService';
import departmentService from '../../services/departmentService';
import timetableService from '../../services/timetableService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import subjectService from '../../services/subjectService';
import activityService from '../../services/activityService';
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
        console.log("Department object keys:", Object.keys(departmentsArray[0] || {}));

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

        const departmentId =
          departmentsArray?.[0]?._id ||
          departmentsArray?.[0]?.id ||
          departmentsArray?.[0]?.value;   // 🔥 fallback


        if (!departmentId) {
          console.warn("No departmentId found");
        } else {
          const activeRes = await timetableService.getTimetables(
            departmentId,
            { status: 'published' }
          );

          activeArray = activeRes.success && activeRes.data
            ? activeRes.data
            : [];

          console.log("Active timetables fetched:", activeArray);
        }

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

      // 5️⃣ Fetch Recent Activities
      try {
        console.log("Fetching recent activities...");
        const activityRes = await activityService.getRecentActivity();

        if (activityRes.success) {
          setRecentActivities(activityRes.data);
        } else {
          console.warn("No activities returned");
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }


    } finally {
      setLoading(false);
      console.log("Dashboard loading finished");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend.value > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'teacher': return <GraduationCap className="h-4.5 w-4.5 text-emerald-600" />;
        case 'timetable': return <Calendar className="h-4.5 w-4.5 text-indigo-600" />;
        case 'subject': return <BookOpen className="h-4.5 w-4.5 text-violet-600" />;
        default: return <Clock className="h-4.5 w-4.5 text-slate-500" />;
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'teacher': return 'bg-emerald-50';
        case 'timetable': return 'bg-indigo-50';
        case 'subject': return 'bg-violet-50';
        default: return 'bg-slate-100';
      }
    };

    return (
      <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors duration-200">
        <div className={`p-2 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800">{activity.action}</p>
          <p className="text-sm text-slate-500 mt-0.5">{activity.details}</p>
          <p className="text-xs text-slate-400 mt-2 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(activity.createdAt).toLocaleString()}
          </p>
        </div>
        <button className="text-slate-300 hover:text-slate-500 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const QuickActionButton = ({ icon: Icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-indigo-200 group"
    >
      <div className={`p-3 rounded-lg ${color} group-hover:scale-105 transition-transform duration-200 mb-2`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
              Overview
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back — here's what's happening with your institution today.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <Bell className="h-4.5 w-4.5 text-slate-500" />
            </button>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 bg-white text-sm font-medium text-slate-700 py-2 px-3.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Subjects"
            value={stats.subjects}
            icon={BookOpen}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
            trend={{ value: 12, label: 'from last month' }}
          />
          <StatCard
            title="Total Teachers"
            value={stats.teachers}
            icon={GraduationCap}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
            trend={{ value: 5, label: 'from last month' }}
          />
          <StatCard
            title="Departments"
            value={stats.departments}
            icon={Building2}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard
            title="Active Timetables"
            value={stats.activeTimetables}
            icon={Calendar}
            color="text-violet-600"
            bgColor="bg-violet-50"
            trend={{ value: 8, label: 'from last week' }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center">
                <BarChart3 className="h-4.5 w-4.5 mr-2 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                  icon={Plus}
                  label="Add Teacher"
                  onClick={() => navigate('/teachers')}
                  color="bg-emerald-500"
                />
                <QuickActionButton
                  icon={BookOpen}
                  label="Add Subject"
                  onClick={() => navigate('/subjects')}
                  color="bg-indigo-500"
                />
                <QuickActionButton
                  icon={Calendar}
                  label="Generate Timetable"
                  onClick={() => navigate('/timetables')}
                  color="bg-violet-500"
                />
                <QuickActionButton
                  icon={Download}
                  label="Export Data"
                  onClick={() => toast.info('Export functionality will be implemented here')}
                  color="bg-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Recent Activities</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                  View all <ChevronRight className="h-4 w-4 inline" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentActivities.length > 0 ? (
                  recentActivities.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-14">
                    <Calendar className="h-9 w-9 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 text-sm font-medium">No recent activities</p>
                    <p className="text-sm text-slate-400 mt-1">Activities will appear here as they happen</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-900">Upcoming Schedule</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              View full calendar <ChevronRight className="h-4 w-4 inline" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg hover:border-indigo-200 transition">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <CalendarClock className="h-3.5 w-3.5" /> Mon, 12 Jun
              </div>
              <div className="mt-2 font-semibold text-slate-900 text-sm">Faculty Meeting</div>
              <div className="text-sm text-slate-500 mt-1">10:00 AM · Conference Room</div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg hover:border-indigo-200 transition">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <CalendarClock className="h-3.5 w-3.5" /> Tue, 13 Jun
              </div>
              <div className="mt-2 font-semibold text-slate-900 text-sm">Exam Schedule Finalization</div>
              <div className="text-sm text-slate-500 mt-1">2:00 PM · Principal's Office</div>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg hover:border-indigo-200 transition">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <CalendarClock className="h-3.5 w-3.5" /> Wed, 14 Jun
              </div>
              <div className="mt-2 font-semibold text-slate-900 text-sm">New Semester Planning</div>
              <div className="text-sm text-slate-500 mt-1">11:00 AM · Meeting Room A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;