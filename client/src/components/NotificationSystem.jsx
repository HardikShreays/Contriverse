import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  X, 
  Award, 
  Trophy, 
  Star, 
  Clock, 
  AlertTriangle,
  Users,
  Zap,
  Crown,
  Calendar,
  MessageSquare
} from 'lucide-react';

const NotificationSystem = ({ contributor, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [contributor]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockNotifications = [
          {
            id: 1,
            type: 'achievement',
            title: 'Badge Earned: Code Warrior',
            message: 'Congratulations! You\'ve earned the Code Warrior badge for merging 10+ pull requests.',
            data: { badgeId: 'code-warrior', points: 50 },
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            icon: Award,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          },
          {
            id: 2,
            type: 'milestone',
            title: 'Level 5 Achieved!',
            message: 'You\'ve reached level 5! Keep up the great work contributing to open source.',
            data: { level: 5, points: 100 },
            read: false,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            icon: Trophy,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            id: 3,
            type: 'deadline',
            title: 'Task Deadline Approaching',
            message: 'Your task "Fix authentication bug" is due in 2 hours. Don\'t forget to complete it!',
            data: { taskId: 1, deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
            read: true,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            id: 4,
            type: 'celebration',
            title: '1 Year Anniversary!',
            message: 'Congratulations on completing 1 year of contributions to the organization!',
            data: { years: 1, points: 500 },
            read: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            icon: Crown,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            id: 5,
            type: 'team',
            title: 'Team Achievement',
            message: 'Your team has collectively earned 1000 points this month! Great teamwork!',
            data: { teamPoints: 1000 },
            read: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            id: 6,
            type: 'reminder',
            title: 'Weekly Goal Reminder',
            message: 'You\'re 2 PRs away from your weekly goal. Keep pushing!',
            data: { goal: 'weekly_prs', remaining: 2 },
            read: false,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
            icon: Target,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
          }
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => prev - 1);
    
    if (onNotificationRead) {
      onNotificationRead(notificationId);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type) => {
    const icons = {
      achievement: Award,
      milestone: Trophy,
      deadline: Clock,
      celebration: Crown,
      team: Users,
      reminder: Target,
      pr: GitBranch,
      issue: AlertTriangle
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      achievement: 'text-yellow-600 bg-yellow-50',
      milestone: 'text-purple-600 bg-purple-50',
      deadline: 'text-orange-600 bg-orange-50',
      celebration: 'text-blue-600 bg-blue-50',
      team: 'text-green-600 bg-green-50',
      reminder: 'text-indigo-600 bg-indigo-50',
      pr: 'text-blue-600 bg-blue-50',
      issue: 'text-red-600 bg-red-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'achievements') return notification.type === 'achievement' || notification.type === 'milestone';
    if (filter === 'deadlines') return notification.type === 'deadline' || notification.type === 'reminder';
    return notification.type === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Bell className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              Stay updated with your achievements and important updates
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </button>
          )}
          <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            <Bell className="w-4 h-4 mr-1" />
            {unreadCount} unread
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'achievements', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement' || n.type === 'milestone').length },
          { id: 'deadlines', label: 'Deadlines', count: notifications.filter(n => n.type === 'deadline' || n.type === 'reminder').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              filter === tab.id
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => {
          const IconComponent = getNotificationIcon(notification.type);
          const colorClasses = getNotificationColor(notification.type);
          
          return (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                notification.read ? 'border-gray-300' : 'border-blue-500'
              } ${notification.read ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colorClasses.split(' ')[1]} mr-4`}>
                  <IconComponent className={`w-6 h-6 ${colorClasses.split(' ')[0]}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className={`text-lg font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{notification.message}</p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatTimeAgo(notification.createdAt)}
                        
                        {notification.data && notification.data.points && (
                          <span className="ml-4 flex items-center text-green-600">
                            <Star className="w-4 h-4 mr-1" />
                            +{notification.data.points} points
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'You\'re all caught up! No new notifications.'
              : `No ${filter} notifications found.`
            }
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {notifications.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('unread')}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <Bell className="w-4 h-4 mr-1" />
              Show Unread Only
            </button>
            <button
              onClick={() => setFilter('achievements')}
              className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
            >
              <Award className="w-4 h-4 mr-1" />
              Show Achievements
            </button>
            <button
              onClick={() => setFilter('deadlines')}
              className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
            >
              <Clock className="w-4 h-4 mr-1" />
              Show Deadlines
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;

