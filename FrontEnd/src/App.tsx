import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Theme
import theme from './utils/theme';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import ClientLayout from './components/layout/ClientLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ConsultantsPage from './pages/consultants/ConsultantsPage';
import ConsultantDetailPage from './pages/consultants/ConsultantDetailPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Admin Pages
import UsersPage from './pages/admin/UsersPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Protected route component for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  // if (user?.role !== 'admin' && user?.role !== 'manager') {
  //   return <Navigate to="/" />;
  // }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Client Routes with ClientLayout */}
            <Route path="/" element={
              <ClientLayout>
                <HomePage />
              </ClientLayout>
            } />



            <Route path="/consultants" element={
              <ClientLayout>
                <ConsultantsPage />
              </ClientLayout>
            } />

            <Route path="/consultants/:id" element={
              <ClientLayout>
                <ConsultantDetailPage />
              </ClientLayout>
            } />


            {/* Admin Routes with AdminLayout */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              </AdminRoute>
            } />

            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminLayout>
                  <UsersPage />
                </AdminLayout>
              </AdminRoute>
            } />








            {/* Redirect old dashboard to admin dashboard */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
