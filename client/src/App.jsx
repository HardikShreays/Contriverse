import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LogoutPage from './pages/LogoutPage';

// Loading component for app initialization
const AppLoader = () => {
  const { loading } = useAuth();
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: isDarkMode ? '#5c899d' : '#f9fafb' }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: isDarkMode ? '#fffcef' : '#5c899d' }}
          ></div>
          <p 
            className="transition-colors duration-200"
            style={{ color: isDarkMode ? '#fffcef' : '#6b7280' }}
          >
            Loading Contriverse...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-200"
      style={{ backgroundColor: isDarkMode ? '#5c899d' : '#f9fafb' }}
    >
      <Header />
      
      <main className="w-full">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:userType" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard/:userType" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppLoader />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;