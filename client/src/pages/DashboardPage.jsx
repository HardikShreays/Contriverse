import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SimpleDashboard from '../components/SimpleDashboard';

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
    <SimpleDashboard 
      user={user} 
      onLogout={handleLogoutWithNavigation} 
      userType={userType} 
    />
  );
};

export default DashboardPage;
