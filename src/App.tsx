import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Resumes from './pages/dashboard/Resumes';
import Templates from './pages/dashboard/Templates';
import Profile from './pages/dashboard/Profile';
import CreateResume from './pages/dashboard/CreateResume';
import EditResume from './pages/dashboard/EditResume';
import ViewResume from './pages/dashboard/ViewResume';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/resumes" element={<Resumes />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resumes/create" element={<CreateResume />} />
        <Route path="/resumes/:id/edit" element={<EditResume />} />
        <Route path="/resumes/:id/view" element={<ViewResume />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;