import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Star, 
  GitBranch, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target, 
  Clock,
  AlertTriangle,
  Crown,
  Zap,
  Activity
} from 'lucide-react';

const OrganizationDashboard = ({ organization, onBack }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [organization]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      setTimeout(() => {
        setDashboardData({
          stats: {
            totalContributors: 25,
            activeContributors: 18,
            totalPoints: 12500,
            totalPRs: 156,
            totalIssues: 89,
            averagePoints: 500,
            topContributor: {
              username: 'johndoe',
              name: 'John Doe',
              points: 1250,
              level: 8
            }
          },
          leaderboard: [
            { rank: 1, contributor: { username: 'johndoe', name: 'John Doe', avatar: 'https://via.placeholder.com/40' }, stats: { points: 1250, level: 8 }, badges: ['code-warrior', 'issue-solver'] },
            { rank: 2, contributor: { username: 'janedoe', name: 'Jane Doe', avatar: 'https://via.placeholder.com/40' }, stats: { points: 980, level: 7 }, badges: ['first-pr', 'streak-master'] },
            { rank: 3, contributor: { username: 'alice', name: 'Alice Smith', avatar: 'https://via.placeholder.com/40' }, stats: { points: 750, level: 6 }, badges: ['first-pr'] },
            { rank: 4, contributor: { username: 'bob', name: 'Bob Johnson', avatar: 'https://via.placeholder.com/40' }, stats: { points: 650, level: 5 }, badges: [] },
            { rank: 5, contributor: { username: 'charlie', name: 'Charlie Brown', avatar: 'https://via.placeholder.com/40' }, stats: { points: 520, level: 4 }, badges: ['first-pr'] }
          ],
          recentAchievements: [
            { id: 1, contributor: { username: 'johndoe', name: 'John Doe' }, type: 'badge', title: 'Earned Code Warrior Badge', description: '10+ pull requests merged', points: 50, createdAt: new Date().toISOString() },
            { id: 2, contributor: { username: 'janedoe', name: 'Jane Doe' }, type: 'milestone', title: 'Level 7 Achieved', description: 'Reached level 7', points: 100, createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 3, contributor: { username: 'alice', name: 'Alice Smith' }, type: 'pr', title: '25th PR Merged', description: 'Merged 25th pull request', points: 25, createdAt: new Date(Date.now() - 172800000).toISOString() }
          ],
          overdueTasks: [
            { id: 1, contributor: { username: 'bob', name: 'Bob Johnson' }, title: 'Fix authentication bug', deadline: new Date(Date.now() - 86400000).toISOString(), priority: 'high' },
            { id: 2, contributor: { username: 'charlie', name: 'Charlie Brown' }, title: 'Update documentation', deadline: new Date(Date.now() - 172800000).toISOString(), priority: 'medium' }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const { stats, leaderboard, recentAchievements, overdueTasks } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{organization.name}</h1>
              <p className="text-blue-100">Organization Dashboard</p>
              <p className="text-sm text-blue-200">
                {stats.totalContributors} contributors • {stats.activeContributors} active
              </p>
            </div>
          </div>
          
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'tasks', label: 'Tasks', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalContributors}</h3>
              <p className="text-gray-600">Total Contributors</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalPoints}</h3>
              <p className="text-gray-600">Total Points</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalPRs}</h3>
              <p className="text-gray-600">PRs Merged</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalIssues}</h3>
              <p className="text-gray-600">Issues Solved</p>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h2>
            <div className="space-y-3">
              {recentAchievements.map(achievement => (
                <div key={achievement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <span className="font-semibold text-sm text-gray-700">{achievement.contributor.username}</span>
                      <span className="ml-2 text-xs text-gray-500">({achievement.title})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">+{achievement.points} pts</span>
                    <div className="text-xs text-gray-400">
                      {new Date(achievement.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-red-800">Overdue Tasks</h3>
              </div>
              <div className="mt-2 space-y-2">
                {overdueTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between text-sm">
                    <span className="text-red-700">{task.contributor.username}: {task.title}</span>
                    <span className="text-red-500 font-semibold">{task.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Leaderboard
          </h2>
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div key={entry.contributor.username} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-4">
                    <span className="text-sm font-bold text-blue-600">#{entry.rank}</span>
                  </div>
                  <img
                    src={entry.contributor.avatar}
                    alt={entry.contributor.username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{entry.contributor.username}</h3>
                    <p className="text-sm text-gray-600">{entry.contributor.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-bold text-gray-900">Level {entry.stats.level}</span>
                  </div>
                  <p className="text-sm text-gray-600">{entry.stats.points} points</p>
                  <div className="flex space-x-1 mt-1">
                    {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAchievements.map(achievement => (
              <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <img
                    src={`https://via.placeholder.com/32`}
                    alt={achievement.contributor.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="font-semibold text-sm">{achievement.contributor.username}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(achievement.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    +{achievement.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Overdue Tasks
            </h2>
            {overdueTasks.length > 0 ? (
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-red-800">{task.title}</h3>
                      <p className="text-sm text-red-600">Assigned to: {task.contributor.username}</p>
                      <p className="text-xs text-red-500">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.priority === 'high' ? 'bg-red-200 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No overdue tasks</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDashboard;

