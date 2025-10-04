import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SimpleLogin from '../components/SimpleLogin';

const LoginPage = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { handleLoginSuccess, handleLoginError } = useAuth();
  const { isDarkMode } = useTheme();

  const handleLoginSuccessWithNavigation = (userData) => {
    handleLoginSuccess(userData);
    navigate(`/dashboard/${userType}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}
        />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div 
          className="rounded-3xl border backdrop-blur-sm p-8 relative overflow-hidden animate-scaleIn"
          style={{ 
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(255, 255, 255, 0.9)',
            borderColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.1)',
            boxShadow: isDarkMode 
              ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
              : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{ 
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
            }}
          />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ 
                  background: userType === 'contributor' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: userType === 'contributor' 
                    ? '0 10px 30px rgba(102, 126, 234, 0.3)'
                    : '0 10px 30px rgba(240, 147, 251, 0.3)'
                }}
              >
                <span className="text-2xl">
                  {userType === 'contributor' ? '👨‍💻' : '🏗️'}
                </span>
              </div>
              
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ 
                  color: isDarkMode ? '#ffffff' : '#000000',
                  backgroundImage: userType === 'contributor' 
                    ? (isDarkMode 
                        ? 'linear-gradient(135deg, #ffffff 0%, #667eea 100%)'
                        : 'linear-gradient(135deg, #000000 0%, #667eea 100%)')
                    : (isDarkMode 
                        ? 'linear-gradient(135deg, #ffffff 0%, #f093fb 100%)'
                        : 'linear-gradient(135deg, #000000 0%, #f093fb 100%)'),
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {userType === 'contributor' ? 'Individual Contributor' : 'Project Maintainer'}
              </h2>
              
              <p 
                className="text-base"
                style={{ color: isDarkMode ? '#cccccc' : '#666666' }}
              >
                Sign in to start tracking your contributions and earning achievements.
              </p>
            </div>
            
            <SimpleLogin 
              onLoginSuccess={handleLoginSuccessWithNavigation}
              onLoginError={handleLoginError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
