import React, { useState, useEffect } from 'react';
import { Trophy, Github, Users, BarChart3 } from 'lucide-react';
import SimpleLogin from './components/SimpleLogin';
import SimpleDashboard from './components/SimpleDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    const accessToken = localStorage.getItem('accessToken');

    if (savedUser && accessToken && savedUserType) {
      try {
        setUser(JSON.parse(savedUser));
        setUserType(savedUserType);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const handleSelectUserType = (type) => {
    setUserType(type);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData.user);
    localStorage.setItem('userType', userType);
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('userType');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Contriverse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Contriverse</h1>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name || user.username}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user && userType ? (
          <SimpleDashboard user={user} onLogout={handleLogout} userType={userType} />
        ) : userType ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {userType === 'contributor' ? 'Individual Contributor' : 'Project Maintainer'}
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Sign in to start tracking your contributions and earning achievements.
              </p>
              
              <SimpleLogin 
                onLoginSuccess={handleLoginSuccess}
                onLoginError={handleLoginError}
              />
            </div>
          </div>
        ) : (
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
                onClick={() => handleSelectUserType('contributor')}
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
                onClick={() => handleSelectUserType('maintainer')}
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>Made with ❤️ for the open-source community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;