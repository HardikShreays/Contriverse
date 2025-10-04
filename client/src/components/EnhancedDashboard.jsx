import React, { useState, useEffect } from 'react';
import { 
  User, 
  Trophy, 
  Star, 
  GitBranch, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target, 
  LogOut,
  Bell,
  Clock,
  Users,
  Activity,
  Settings,
  Zap
} from 'lucide-react';
import OrganizationDashboard from './OrganizationDashboard';
import BadgeSystem from './BadgeSystem';
import TimeBoundTasks from './TimeBoundTasks';
import NotificationSystem from './NotificationSystem';

const EnhancedDashboard = ({ user, onLogout, userType }) => {
  const [activeView, setActiveView] = useState('overview');
  const [userStats, setUserStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setUserStats({
          totalRepos: 15,
          totalStars: 128,
          followers: 45,
          totalForks: 34,
          activeDays: 67,
          level: 5,
          points: 1250,
          badges: 8,
          achievements: 12,
          streak: 7,
          totalPRs: 25,
          totalIssues: 15
        });

        setNotifications([
          { id: 1, type: 'achievement', title: 'Badge Earned', read: false },
          { id: 2, type: 'milestone', title: 'Level Up!', read: false },
          { id: 3, type: 'deadline', title: 'Task Due Soon', read: true }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    onLogout();
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getViewIcon = (view) => {
    const icons = {
      overview: Activity,
      badges: Award,
      tasks: Clock,
      notifications: Bell,
      organization: Users
    };
    return icons[view] || Activity;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-pulse"
          style={{ 
            background: userType === 'contributor' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 animate-pulse"
          style={{ 
            background: userType === 'contributor' 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
      </div>

      {/* Header */}
      <div 
        className="relative z-10 backdrop-blur-sm border-b"
        style={{
          background: userType === 'contributor' 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(240, 147, 251, 0.9) 0%, rgba(245, 87, 108, 0.9) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl border-2 border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-110"
                />
                <div 
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#10b981' }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{user.name || user.username}</h1>
                <p className="text-white/80 text-lg">
                  {userType === 'contributor' ? 'Individual Contributor' : 'Project Maintainer'}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <p className="text-white/70 text-sm">
                      Level {userStats?.level} • {userStats?.points} points
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-white/70 text-sm">
                      {userStats?.streak} day streak
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                <Bell className="w-6 h-6 text-white" />
                {getUnreadNotificationCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold animate-bounce-gentle">
                    {getUnreadNotificationCount()}
                  </span>
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 text-white backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-72 backdrop-blur-sm border rounded-3xl p-6 h-fit relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-50"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
              }}
            />
            <nav className="space-y-3 relative z-10">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'badges', label: 'Badges & Achievements', icon: Award },
                { id: 'tasks', label: 'Time-Bound Tasks', icon: Clock },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                ...(userType === 'maintainer' ? [{ id: 'organization', label: 'Organization', icon: Users }] : [])
              ].map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`group w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    activeView === item.id
                      ? 'backdrop-blur-sm border shadow-lg'
                      : 'hover:backdrop-blur-sm border-transparent hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: activeView === item.id 
                      ? (userType === 'contributor' 
                          ? 'rgba(102, 126, 234, 0.1)' 
                          : 'rgba(240, 147, 251, 0.1)')
                      : 'transparent',
                    color: activeView === item.id 
                      ? (userType === 'contributor' ? '#667eea' : '#f093fb')
                      : '#666666',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <item.icon className={`w-6 h-6 mr-4 transition-transform duration-300 ${
                    activeView === item.id ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="font-medium text-lg">{item.label}</span>
                  {activeView === item.id && (
                    <div 
                      className="ml-auto w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: userType === 'contributor' ? '#667eea' : '#f093fb'
                      }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeView === 'overview' && (
              <div className="space-y-8 animate-fadeInUp">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group backdrop-blur-sm border rounded-3xl p-6 text-center relative overflow-hidden hover:scale-105 transition-all duration-300">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
                      }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)', boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)' }}>
                        <GitBranch className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{userStats?.totalPRs}</h3>
                      <p className="text-gray-600 font-medium">PRs Merged</p>
                    </div>
                  </div>

                  <div className="group backdrop-blur-sm border rounded-3xl p-6 text-center relative overflow-hidden hover:scale-105 transition-all duration-300">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)'
                      }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)' }}>
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{userStats?.totalStars}</h3>
                      <p className="text-gray-600 font-medium">Stars Received</p>
                    </div>
                  </div>

                  <div className="group backdrop-blur-sm border rounded-3xl p-6 text-center relative overflow-hidden hover:scale-105 transition-all duration-300">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                      }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}>
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{userStats?.level}</h3>
                      <p className="text-gray-600 font-medium">Current Level</p>
                    </div>
                  </div>

                  <div className="group backdrop-blur-sm border rounded-3xl p-6 text-center relative overflow-hidden hover:scale-105 transition-all duration-300">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
                      }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)' }}>
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{userStats?.badges}</h3>
                      <p className="text-gray-600 font-medium">Badges Earned</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-500" />
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

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveView('badges')}
                      className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                    >
                      <Award className="w-6 h-6 text-yellow-600 mr-3" />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">View Badges</h3>
                        <p className="text-sm text-gray-600">Check your achievements</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveView('tasks')}
                      className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Clock className="w-6 h-6 text-blue-600 mr-3" />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Time-Bound Tasks</h3>
                        <p className="text-sm text-gray-600">Manage your deadlines</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveView('notifications')}
                      className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Bell className="w-6 h-6 text-green-600 mr-3" />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-600">Stay updated</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'badges' && (
              <BadgeSystem contributor={user} onBadgeEarned={(badge) => console.log('Badge earned:', badge)} />
            )}

            {activeView === 'tasks' && (
              <TimeBoundTasks contributor={user} onTaskUpdate={(taskId, status) => console.log('Task updated:', taskId, status)} />
            )}

            {activeView === 'notifications' && (
              <NotificationSystem contributor={user} onNotificationRead={(id) => console.log('Notification read:', id)} />
            )}

            {activeView === 'organization' && userType === 'maintainer' && (
              <OrganizationDashboard 
                organization={{ id: 'org1', name: 'Your Organization' }} 
                onBack={() => setActiveView('overview')} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed top-20 right-6 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <button
              onClick={() => setActiveView('notifications')}
              className="w-full text-center text-blue-600 hover:text-blue-800 text-sm"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;

