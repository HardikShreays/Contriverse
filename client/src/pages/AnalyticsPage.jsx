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

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const contributionTrend = [
    { month: 'Jan', contributions: 45, prs: 12, issues: 8 },
    { month: 'Feb', contributions: 52, prs: 15, issues: 10 },
    { month: 'Mar', contributions: 38, prs: 9, issues: 6 },
    { month: 'Apr', contributions: 67, prs: 18, issues: 12 },
    { month: 'May', contributions: 89, prs: 22, issues: 15 },
    { month: 'Jun', contributions: 76, prs: 19, issues: 11 },
  ];

  const projectBreakdown = [
    { name: 'Contriverse', contributions: 45, color: '#3B82F6' },
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

  const metrics = [
    { name: 'Total Contributions', value: '1,247', change: '+12%', trend: 'up', icon: GitBranch },
    { name: 'Pull Requests', value: '89', change: '+8%', trend: 'up', icon: GitBranch },
    { name: 'Issues Resolved', value: '156', change: '+15%', trend: 'up', icon: Target },
    { name: 'Projects Active', value: '12', change: '+2', trend: 'up', icon: Users },
    { name: 'Code Quality', value: '94%', change: '+3%', trend: 'up', icon: Award },
    { name: 'Response Time', value: '2.1h', change: '-0.5h', trend: 'up', icon: Zap },
  ];

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
