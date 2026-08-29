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
  CalendarClock,
  Sparkles
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const StatCard = ({ title, value, icon: Icon, color, bgColor, ringColor, trend }) => (
    <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden">
      <div className={`absolute -top-6 -right-6 h-24 w-24 rounded-full ${bgColor} opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70`} />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 mb-2 truncate">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded-full text-xs font-semibold ${trend.value > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
              {trend.value > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trend.value)}%
              <span className="font-normal text-slate-400">&nbsp;{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`shrink-0 p-3 rounded-xl ${bgColor} ring-4 ${ringColor} transition-transform duration-300 group-hover:scale-110`}>
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
      <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors duration-200">
        <div className={`p-2.5 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
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
      className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-indigo-200 hover:-translate-y-0.5 group"
    >
      <div className={`p-3 rounded-lg ${color} shadow-sm group-hover:scale-105 transition-transform duration-200 mb-2.5`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-sm font-medium text-slate-700 text-center">{label}</span>
    </button>
  );

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 shadow-sm">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_85%_60%,white,transparent_30%)]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-6 sm:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-100 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              {todayLabel}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {getGreeting()} 👋
            </h1>
            <p className="text-indigo-100 mt-1.5 max-w-xl">
              Here's what's happening with your institution today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 bg-white/95 border border-transparent w-44 sm:w-56"
              />
            </div>
            <button className="p-2.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition text-white">
              <Bell className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 bg-white text-sm font-semibold text-indigo-700 py-2.5 px-4 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Subjects"
          value={stats.subjects}
          icon={BookOpen}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          ringColor="ring-indigo-50/60"
          trend={{ value: 12, label: 'from last month' }}
        />
        <StatCard
          title="Total Teachers"
          value={stats.teachers}
          icon={GraduationCap}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          ringColor="ring-emerald-50/60"
          trend={{ value: 5, label: 'from last month' }}
        />
        <StatCard
          title="Departments"
          value={stats.departments}
          icon={Building2}
          color="text-amber-600"
          bgColor="bg-amber-50"
          ringColor="ring-amber-50/60"
        />
        <StatCard
          title="Active Timetables"
          value={stats.activeTimetables}
          icon={Calendar}
          color="text-violet-600"
          bgColor="bg-violet-50"
          ringColor="ring-violet-50/60"
          trend={{ value: 8, label: 'from last week' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Recent Activities</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-slate-900">Upcoming Schedule</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            View full calendar <ChevronRight className="h-4 w-4 inline" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <CalendarClock className="h-3.5 w-3.5" /> Mon, 12 Jun
            </div>
            <div className="mt-2 font-semibold text-slate-900 text-sm">Faculty Meeting</div>
            <div className="text-sm text-slate-500 mt-1">10:00 AM · Conference Room</div>
          </div>
          <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <CalendarClock className="h-3.5 w-3.5" /> Tue, 13 Jun
            </div>
            <div className="mt-2 font-semibold text-slate-900 text-sm">Exam Schedule Finalization</div>
            <div className="text-sm text-slate-500 mt-1">2:00 PM · Principal's Office</div>
          </div>
          <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <CalendarClock className="h-3.5 w-3.5" /> Wed, 14 Jun
            </div>
            <div className="mt-2 font-semibold text-slate-900 text-sm">New Semester Planning</div>
            <div className="text-sm text-slate-500 mt-1">11:00 AM · Meeting Room A</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;