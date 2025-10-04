import React from 'react';
import { Trophy, Users, BarChart3, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { handleSelectUserType } = useAuth();
  const { isDarkMode } = useTheme();

  const handleSelectUserTypeAndNavigate = (type) => {
    handleSelectUserType(type);
    navigate(`/login/${type}`);
  };

  return (
    <div 
      className="max-w-4xl mx-auto p-6 transition-colors duration-200"
      style={{ backgroundColor: isDarkMode ? '#5c899d' : '#fffcef' }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.2)' : 'rgba(92, 137, 157, 0.1)' 
            }}
          >
            <Trophy 
              className="w-8 h-8" 
              style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
            />
          </div>
        </div>
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
        >
          Welcome to Contriverse
        </h1>
        <p 
          className="mb-6"
          style={{ 
            color: isDarkMode ? 'rgba(255, 252, 239, 0.8)' : 'rgba(92, 137, 157, 0.8)' 
          }}
        >
          Choose your role to get started with gamified open-source contributions
        </p>
      </div>

      {/* User Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Individual Contributor */}
        <div 
          onClick={() => handleSelectUserTypeAndNavigate('contributor')}
          className="rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:scale-105"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.1)' : 'white',
            borderColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = isDarkMode ? '#fffcef' : '#5c899d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.2)' : 'rgba(92, 137, 157, 0.1)' 
              }}
            >
              <Users 
                className="w-8 h-8" 
                style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
              />
            </div>
            <h2 
              className="text-2xl font-bold mb-3"
              style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
            >
              Individual Contributor
            </h2>
            <p 
              className="mb-6"
              style={{ 
                color: isDarkMode ? 'rgba(255, 252, 239, 0.8)' : 'rgba(92, 137, 157, 0.8)' 
              }}
            >
              Track your personal contributions, earn badges, and build your developer profile
            </p>
            
            <div className="space-y-3 text-left">
              <div 
                className="flex items-center text-sm"
                style={{ 
                  color: isDarkMode ? 'rgba(255, 252, 239, 0.7)' : 'rgba(92, 137, 157, 0.7)' 
                }}
              >
                <Github 
                  className="w-4 h-4 mr-2" 
                  style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
                />
                <span>Personal contribution tracking</span>
              </div>
              <div 
                className="flex items-center text-sm"
                style={{ 
                  color: isDarkMode ? 'rgba(255, 252, 239, 0.7)' : 'rgba(92, 137, 157, 0.7)' 
                }}
              >
                <Trophy 
                  className="w-4 h-4 mr-2" 
                  style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
                />
                <span>Achievement badges & levels</span>
              </div>
              <div 
                className="flex items-center text-sm"
                style={{ 
                  color: isDarkMode ? 'rgba(255, 252, 239, 0.7)' : 'rgba(92, 137, 157, 0.7)' 
                }}
              >
                <BarChart3 
                  className="w-4 h-4 mr-2" 
                  style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
                />
                <span>Progress analytics</span>
              </div>
            </div>
            
            <button 
              className="mt-6 w-full text-white py-3 px-4 rounded-md transition-colors"
              style={{ 
                backgroundColor: isDarkMode ? '#fffcef' : '#5c899d',
                color: isDarkMode ? '#5c899d' : '#fffcef'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 252, 239, 0.9)' : 'rgba(92, 137, 157, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#fffcef' : '#5c899d';
              }}
            >
              Login as Contributor
            </button>
          </div>
        </div>

        {/* Maintainer/Organization */}
        <div 
          onClick={() => handleSelectUserTypeAndNavigate('maintainer')}
          className="rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:scale-105"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.1)' : 'white',
            borderColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = isDarkMode ? '#fffcef' : '#5c899d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.2)' : 'rgba(92, 137, 157, 0.1)' 
              }}
            >
              <Users 
                className="w-8 h-8" 
                style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
              />
            </div>
            <h2 
              className="text-2xl font-bold mb-3"
              style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
            >
              Maintainer/Organization
            </h2>
            <p 
              className="mb-6"
              style={{ 
                color: isDarkMode ? 'rgba(255, 252, 239, 0.8)' : 'rgba(92, 137, 157, 0.8)' 
              }}
            >
              Manage your projects, track team contributions, and celebrate milestones
            </p>
            
            <div className="space-y-3 text-left">
              <div 
                className="flex items-center text-sm"
                style={{ 
                  color: isDarkMode ? 'rgba(255, 252, 239, 0.7)' : 'rgba(92, 137, 157, 0.7)' 
                }}
              >
                <BarChart3 
                  className="w-4 h-4 mr-2" 
                  style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
                />
                <span>Project dashboard & analytics</span>
              </div>
              <div 
                className="flex items-center text-sm"
                style={{ 
                  color: isDarkMode ? 'rgba(255, 252, 239, 0.7)' : 'rgba(92, 137, 157, 0.7)' 
                }}
              >
                <Users 
                  className="w-4 h-4 mr-2" 
                  style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
                />
                <span>Team contribution tracking</span>
              </div>
              <div 
                className="flex items-center text-sm"
                style={{ 
                  color: isDarkMode ? 'rgba(255, 252, 239, 0.7)' : 'rgba(92, 137, 157, 0.7)' 
                }}
              >
                <Trophy 
                  className="w-4 h-4 mr-2" 
                  style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }} 
                />
                <span>Milestone celebrations</span>
              </div>
            </div>
            
            <button 
              className="mt-6 w-full text-white py-3 px-4 rounded-md transition-colors"
              style={{ 
                backgroundColor: isDarkMode ? '#fffcef' : '#5c899d',
                color: isDarkMode ? '#5c899d' : '#fffcef'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 252, 239, 0.9)' : 'rgba(92, 137, 157, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDarkMode ? '#fffcef' : '#5c899d';
              }}
            >
              Login as Maintainer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
