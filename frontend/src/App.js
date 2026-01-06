
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
  const { isAuthenticated, loading } = useAuth();

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
        {/* <Route 
          path="/login" 
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} 
        /> */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route 
            path="dashboard" 
            element={
              
                <Dashboard />
              
            } 
          />
          
          <Route 
            path="teachers" 
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            } 
          />
            
          <Route 
            path="departments" // ✅ Added route for departments
            element={
              
                <Departments />
             
            } 
          />
          <Route 
            path="class" 
            element={
             
                <ClassPage />
              
            } 
          />
          <Route 
            path="subjects" 
            element={
              
                <Subjects />
              
            } 
          />
         
          <Route 
            path="timetables" 
            element={
              
                <Timetables />
              
            } 
          />
        </Route>
        {/* <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        /> */}
      </Routes>
    </div>
  );
}

export default App;
