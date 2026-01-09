import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.js';
import Layout from './components/Layout/Layout.jsx';
import AuthPage from './pages/Auth/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

import Teachers from './pages/Teachers/Teachers.jsx';
import Subjects from './pages/Subjects/Subjects.jsx';
import Timetables from './pages/Timetables/Timetables.jsx';
import Departments from './pages/Department/Department.jsx'; 
import ProtectedRoute from './components/Common/ProtectedRoute.js';
import ClassPage from './pages/Class/Class.jsx'; 

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/class" element={<ClassPage />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/timetables" element={<Timetables />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
