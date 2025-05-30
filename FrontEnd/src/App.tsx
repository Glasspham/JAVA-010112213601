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

// Pages
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProgramsPage from './pages/programs/ProgramsPage';
import ConsultantsPage from './pages/consultants/ConsultantsPage';
import ConsultantDetailPage from './pages/consultants/ConsultantDetailPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Client Routes with ClientLayout */}
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
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
