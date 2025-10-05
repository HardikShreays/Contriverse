import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  GitBranch, 
  Users, 
  Award,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGitHubProfile, useGitHubRepositories, useGitHubActivity } from '../hooks/useGitHubData';
import { useRatingSystem } from '../hooks/useRatingSystem';
import { calculateStats } from '../utils/githubStatsCalculator';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const { user: authUser } = useAuth();
  
  // Fetch GitHub profile and repository data
  const { 
    stats: githubStats, 
    topRepositories,
    loading: profileLoading,
    error: profileError 
  } = useGitHubProfile(authUser?.username);
  
  const { 
    repositories,
    loading: reposLoading,
    error: reposError 
  } = useGitHubRepositories(authUser?.username);
  
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

  const contributionTrend = [
    { month: 'Jan', contributions: 45, prs: 12, issues: 8 },
    { month: 'Feb', contributions: 52, prs: 15, issues: 10 },
    { month: 'Mar', contributions: 38, prs: 9, issues: 6 },
    { month: 'Apr', contributions: 67, prs: 18, issues: 12 },
    { month: 'May', contributions: 89, prs: 22, issues: 15 },
    { month: 'Jun', contributions: 76, prs: 19, issues: 11 },
  ];

  // Use real GitHub repositories for project breakdown
  const projectBreakdown = topRepositories ? topRepositories.slice(0, 5).map((repo, index) => ({
    name: repo.name,
    contributions: repo.stars + repo.forks,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  })) : [
    { name: 'PRAISE', contributions: 45, color: '#3B82F6' },
    { name: 'React-App', contributions: 32, color: '#10B981' },
    { name: 'UI-Library', contributions: 28, color: '#F59E0B' },
    { name: 'API-Service', contributions: 19, color: '#EF4444' },
    { name: 'Other', contributions: 15, color: '#8B5CF6' },
  ];

  const skillAreas = [
    { skill: 'Frontend Development', level: 85, contributions: 120 },
    { skill: 'Backend Development', level: 78, contributions: 95 },
    { skill: 'DevOps', level: 65, contributions: 45 },
    { skill: 'Testing', level: 72, contributions: 60 },
    { skill: 'Documentation', level: 88, contributions: 80 },
  ];

  const weeklyActivity = [
    { day: 'Mon', contributions: 8 },
    { day: 'Tue', contributions: 12 },
    { day: 'Wed', contributions: 6 },
    { day: 'Thu', contributions: 15 },
    { day: 'Fri', contributions: 10 },
    { day: 'Sat', contributions: 4 },
    { day: 'Sun', contributions: 2 },
  ];

  // Calculate comprehensive stats from GitHub data including rating data
  const calculatedStats = calculateStats(githubStats, githubActivity, ratingSummary);

  const metrics = [
    { name: 'Contribution Score', value: calculatedStats.contributionScore.toLocaleString(), change: '+12%', trend: 'up', icon: GitBranch },
    { name: 'Total Repositories', value: calculatedStats.projects.toString(), change: '+2', trend: 'up', icon: GitBranch },
    { name: 'Total Stars', value: githubStats ? githubStats.totalStars.toLocaleString() : '0', change: '+15%', trend: 'up', icon: Target },
    { name: 'Followers', value: calculatedStats.followers.toString(), change: '+5', trend: 'up', icon: Users },
    { name: 'Following', value: calculatedStats.following.toString(), change: '+1', trend: 'up', icon: Award },
    { name: 'Earned Badges', value: `${calculatedStats.badges}/${calculatedStats.totalBadges}`, change: '+1', trend: 'up', icon: Zap },
  ];

  // Add rating metrics if available
  if (calculatedStats.ratingScore > 0) {
    metrics.push(
      { name: 'Rating Score', value: `${calculatedStats.ratingScore}/100`, change: '+5%', trend: 'up', icon: Award },
      { name: 'Rated PRs', value: calculatedStats.totalPRs.toString(), change: '+2', trend: 'up', icon: Target }
    );
  }

  // Show loading state
  if (profileLoading || reposLoading || activityLoading || ratingLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (profileError || reposError || activityError || ratingError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600 mb-4">{profileError || reposError || activityError || ratingError}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Deep dive into your contribution patterns and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contribution Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contributionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="contributions" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="prs" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="issues" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="contributions"
                >
                  {projectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Activity & Skill Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Pattern */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity Pattern</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contributions" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Development */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Development</h3>
          <div className="space-y-4">
            {skillAreas.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                  <span className="text-sm text-gray-500">{skill.contributions} contributions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">Level {skill.level}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">94%</div>
            <div className="text-sm text-gray-600">Code Quality Score</div>
            <div className="text-xs text-green-600 mt-1">+5% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">2.1h</div>
            <div className="text-sm text-gray-600">Avg. Response Time</div>
            <div className="text-xs text-green-600 mt-1">-0.5h improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
            <div className="text-sm text-gray-600">PR Acceptance Rate</div>
            <div className="text-xs text-green-600 mt-1">+3% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
