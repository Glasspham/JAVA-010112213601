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
import ProfilePage from './pages/profile/ProfilePage';
import ProgramsPage from './pages/programs/ProgramsPage';
import ProgramDetailPage from './pages/programs/ProgramDetailPage';
import ConsultantsPage from './pages/consultants/ConsultantsPage';
import ConsultantDetailPage from './pages/consultants/ConsultantDetailPage';
import SurveysPage from './pages/surveys/SurveysPage';
import SurveyDetailPage from './pages/surveys/SurveyDetailPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';

// Admin Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import AdminConsultantsPage from './pages/admin/ConsultantsPage';
import AdminProgramsPage from './pages/admin/ProgramsPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import AdminAppointmentsPage from './pages/admin/AppointmentsPage';

// Protected route component for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
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

            <Route path="/profile" element={
              <ClientLayout>
                <ProfilePage />
              </ClientLayout>
            } />

            <Route path="/programs" element={
              <ClientLayout>
                <ProgramsPage />
              </ClientLayout>
            } />

            <Route path="/programs/:id" element={
              <ClientLayout>
                <ProgramDetailPage />
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

            <Route path="/appointments" element={
              <ClientLayout>
                <AppointmentsPage />
              </ClientLayout>
            } />

            <Route path="/surveys" element={
              <ClientLayout>
                <SurveysPage />
              </ClientLayout>
            } />

            <Route path="/surveys/:id" element={
              <ClientLayout>
                <SurveyDetailPage />
              </ClientLayout>
            } />

            <Route path="/courses" element={
              <ClientLayout>
                <CoursesPage />
              </ClientLayout>
            } />

            <Route path="/courses/:id" element={
              <ClientLayout>
                <CourseDetailPage />
              </ClientLayout>
            } />

            {/* Admin Routes */}
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

            <Route path="/admin/consultants" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminConsultantsPage />
                </AdminLayout>
              </AdminRoute>
            } />

            <Route path="/admin/programs" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminProgramsPage />
                </AdminLayout>
              </AdminRoute>
            } />

            <Route path="/admin/appointments" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminAppointmentsPage />
                </AdminLayout>
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
