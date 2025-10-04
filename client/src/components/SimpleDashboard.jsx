import React, { useState, useEffect } from 'react';
import { User, Trophy, Star, GitBranch, Calendar, TrendingUp, Award, Target, LogOut } from 'lucide-react';

const SimpleDashboard = ({ user, onLogout, userType }) => {
  const [userStats, setUserStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setUserStats({
        totalRepos: 15,
        totalStars: 128,
        followers: 45,
        totalForks: 34,
        activeDays: 67
      });

      setBadges([
        { id: 1, name: 'First PR', description: 'Merged your first pull request', icon: '🎉', color: 'bronze', unlocked: true },
        { id: 2, name: 'Code Warrior', description: '10+ pull requests merged', icon: '⚔️', color: 'silver', unlocked: true },
        { id: 3, name: 'Issue Solver', description: 'Solved 5+ issues', icon: '🔧', color: 'gold', unlocked: false },
        { id: 4, name: 'Streak Master', description: '7 days coding streak', icon: '🔥', color: 'platinum', unlocked: false },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    onLogout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${userType === 'contributor' ? 'from-green-500 to-blue-600' : 'from-blue-500 to-purple-600'} rounded-lg shadow-lg p-6 mb-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
              <p className="text-blue-100">
                {userType === 'contributor' ? 'Individual Contributor' : 'Project Maintainer'}
              </p>
              <p className="text-sm text-blue-200">
                {userType === 'contributor' ? 'Level 4 - Trusted Developer' : 'Managing 5 repositories'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <GitBranch className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userStats.totalRepos}</h3>
            <p className="text-gray-600">Repositories</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userStats.totalStars}</h3>
            <p className="text-gray-600">Stars Received</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{userStats.activeDays}</h3>
            <p className="text-gray-600">Active Days</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{badges.filter(b => b.unlocked).length}</h3>
            <p className="text-gray-600">Badges Earned</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Your Badges
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 ${
                  badge.unlocked 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                    badge.color === 'bronze' ? 'bg-orange-100 text-orange-800' :
                    badge.color === 'silver' ? 'bg-gray-100 text-gray-800' :
                    badge.color === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {badge.color}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Goals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Next Goals
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-sm">Issue Solver</h3>
                <p className="text-xs text-gray-600">Solve 3 more issues</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-sm">Streak Master</h3>
                <p className="text-xs text-gray-600">Code for 5 more days</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-green-500" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">awesome-project</span>
              <span className="ml-2 text-xs text-gray-500">(PushEvent)</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">contriverse</span>
              <span className="ml-2 text-xs text-gray-500">(PullRequestEvent)</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(Date.now() - 86400000).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;

