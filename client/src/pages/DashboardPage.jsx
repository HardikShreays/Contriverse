import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EnhancedDashboard from '../components/EnhancedDashboard';

const DashboardPage = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const handleLogoutWithNavigation = () => {
    handleLogout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <EnhancedDashboard 
      user={user} 
      onLogout={handleLogoutWithNavigation} 
      userType={userType} 
    />
  );
};

export default DashboardPage;
