import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout();
    navigate('/');
  }, [handleLogout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
