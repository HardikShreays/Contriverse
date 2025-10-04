import React from 'react';
import { Trophy, Users, BarChart3, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { handleSelectUserType } = useAuth();

  const handleSelectUserTypeAndNavigate = (type) => {
    handleSelectUserType(type);
    navigate(`/login/${type}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Contriverse
        </h1>
        <p className="text-gray-600 mb-6">
          Choose your role to get started with gamified open-source contributions
        </p>
      </div>

      {/* User Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Individual Contributor */}
        <div 
          onClick={() => handleSelectUserTypeAndNavigate('contributor')}
          className="bg-white rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-200"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Individual Contributor</h2>
            <p className="text-gray-600 mb-6">
              Track your personal contributions, earn badges, and build your developer profile
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center text-sm text-gray-600">
                <Github className="w-4 h-4 mr-2 text-green-500" />
                <span>Personal contribution tracking</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Trophy className="w-4 h-4 mr-2 text-green-500" />
                <span>Achievement badges & levels</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
                <span>Progress analytics</span>
              </div>
            </div>
            
            <button className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors">
              Login as Contributor
            </button>
          </div>
        </div>

        {/* Maintainer/Organization */}
        <div 
          onClick={() => handleSelectUserTypeAndNavigate('maintainer')}
          className="bg-white rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Maintainer/Organization</h2>
            <p className="text-gray-600 mb-6">
              Manage your projects, track team contributions, and celebrate milestones
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                <span>Project dashboard & analytics</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span>Team contribution tracking</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Trophy className="w-4 h-4 mr-2 text-blue-500" />
                <span>Milestone celebrations</span>
              </div>
            </div>
            
            <button className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Login as Maintainer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
