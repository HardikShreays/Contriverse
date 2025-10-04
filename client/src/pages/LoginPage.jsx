import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SimpleLogin from '../components/SimpleLogin';

const LoginPage = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { handleLoginSuccess, handleLoginError } = useAuth();

  const handleLoginSuccessWithNavigation = (userData) => {
    handleLoginSuccess(userData);
    navigate(`/dashboard/${userType}`);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          {userType === 'contributor' ? 'Individual Contributor' : 'Project Maintainer'}
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Sign in to start tracking your contributions and earning achievements.
        </p>
        
        <SimpleLogin 
          onLoginSuccess={handleLoginSuccessWithNavigation}
          onLoginError={handleLoginError}
        />
      </div>
    </div>
  );
};

export default LoginPage;
