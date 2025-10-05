import { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  GitBranch, 
  Star, 
  Users, 
  Zap,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useGitHubProfile, useGitHubActivity } from '../hooks/useGitHubData';
import { useRatingSystem } from '../hooks/useRatingSystem';
import { calculateStats } from '../utils/githubStatsCalculator';

const DashboardPage = () => {
  const { user: authUser } = useAuth();
  
  // Fetch GitHub profile and activity data
  const { 
    stats: githubStats, 
    topRepositories,
    loading: profileLoading,
    error: profileError 
  } = useGitHubProfile(authUser?.username);
  
  const { 
    activity: githubActivity,
    loading: activityLoading,
    error: activityError 
  } = useGitHubActivity(authUser?.username);

  // Rating system hook
  const { 
    ratingSummary,
    loading: ratingLoading,
    error: ratingError,
    hasRatings
  } = useRatingSystem(authUser?.username);

  // Calculate comprehensive stats from GitHub data including rating data
  const calculatedStats = calculateStats(githubStats, githubActivity, ratingSummary);
  
  // Transform to dashboard format
  const stats = {
    totalContributions: calculatedStats.totalContributions,
    streak: calculatedStats.streak,
    level: calculatedStats.level,
    badges: calculatedStats.badges,
    rank: calculatedStats.rank,
    weeklyContributions: Math.floor(calculatedStats.totalContributions / 52), // Rough estimate
    totalRepos: calculatedStats.projects,
    followers: calculatedStats.followers,
    following: calculatedStats.following,
    contributionScore: calculatedStats.contributionScore,
    levelProgress: calculatedStats.levelProgress
  };

  // Transform GitHub activity to dashboard format
  const recentActivity = githubActivity ? githubActivity.slice(0, 10).map((activity, index) => ({
    id: index + 1,
    type: activity.type === 'PushEvent' ? 'commit' : activity.type === 'PullRequestEvent' ? 'pr_merged' : 'issue_closed',
    title: activity.type === 'PushEvent' ? `Pushed ${activity.payload.commits || 1} commits` : 
           activity.type === 'PullRequestEvent' ? `Pull request ${activity.payload.action}` :
           `Issue ${activity.payload.action}`,
    project: activity.repo.split('/')[1] || 'Unknown',
    time: new Date(activity.createdAt).toLocaleDateString(),
    url: activity.url
  })) : [];

  const contributionData = [
    { month: 'Jan', contributions: 45 },
    { month: 'Feb', contributions: 52 },
    { month: 'Mar', contributions: 38 },
    { month: 'Apr', contributions: 67 },
    { month: 'May', contributions: 89 },
    { month: 'Jun', contributions: 76 },
  ];

  // Use real GitHub repositories for project data
  const projectData = topRepositories ? topRepositories.slice(0, 5).map((repo, index) => ({
    name: repo.name,
    contributions: repo.stars + repo.forks,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  })) : [
    { name: 'PRAISE', contributions: 45, color: '#3B82F6' },
    { name: 'React-App', contributions: 32, color: '#10B981' },
    { name: 'UI-Library', contributions: 28, color: '#F59E0B' },
    { name: 'API-Service', contributions: 19, color: '#EF4444' },
  ];

  // Use calculated badges for achievements
  const achievements = calculatedStats.badgesList ? calculatedStats.badgesList.slice(0, 5) : [
    { id: 1, name: 'First Contribution', description: 'Made your first contribution', earned: true, icon: Star },
    { id: 2, name: 'Code Quality Master', description: 'Maintained 95%+ code quality', earned: true, icon: Award },
    { id: 3, name: 'Team Player', description: 'Collaborated on 10+ PRs', earned: true, icon: Users },
    { id: 4, name: 'Bug Hunter', description: 'Fixed 25+ bugs', earned: false, icon: Target },
    { id: 5, name: 'Streak Master', description: '30-day contribution streak', earned: false, icon: Zap },
  ];

  // Show loading state
  if (profileLoading || activityLoading || ratingLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (profileError || activityError || ratingError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{profileError || activityError || ratingError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your contribution overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Level</p>
            <p className="text-2xl font-bold text-primary-600">Level {stats.level}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GitBranch className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contributions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContributions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.badges}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Rank</p>
              <p className="text-2xl font-bold text-gray-900">#{stats.rank}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contribution Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="contributions" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Contributions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="contributions"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'pr_merged' && <GitBranch className="h-5 w-5 text-green-600" />}
                  {activity.type === 'issue_closed' && <Target className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'badge_earned' && <Award className="h-5 w-5 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.project} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      achievement.earned ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      achievement.earned ? 'text-green-900' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </p>
                    <p className={`text-xs ${
                      achievement.earned ? 'text-green-700' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-green-600">
                      <Trophy className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
