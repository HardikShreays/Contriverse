import { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Github, 
  Trophy, 
  Award, 
  Target,
  Star,
  Users,
  GitBranch,
  Zap,
  Edit,
  Settings,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGitHubProfile, useGitHubActivity } from '../hooks/useGitHubData';
import { useRatingSystem } from '../hooks/useRatingSystem';
import { calculateStats } from '../utils/githubStatsCalculator';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const { user: authUser } = useAuth();
  
  // Fetch GitHub profile and activity data
  const { 
    profile: githubProfile, 
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
    isGenerating,
    generateRatings,
    hasRatings
  } = useRatingSystem(authUser?.username);

  // Calculate real stats from GitHub data including rating data
  const calculatedStats = calculateStats(githubStats, githubActivity, ratingSummary);
  
  // Use GitHub data if available, fallback to auth user data
  const user = githubProfile ? {
    name: githubProfile.name || authUser.name,
    username: githubProfile.username || authUser.username,
    email: githubProfile.email || authUser.email,
    location: githubProfile.location,
    joinDate: githubProfile.accountCreated ? new Date(githubProfile.accountCreated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown',
    avatar: githubProfile.avatar || authUser.avatar,
    bio: githubProfile.bio,
    githubUrl: githubProfile.githubUrl || authUser.githubUrl,
    stats: calculatedStats
  } : {
    name: authUser?.name || 'Loading...',
    username: authUser?.username || 'Loading...',
    email: authUser?.email || '',
    location: '',
    joinDate: '',
    avatar: authUser?.avatar || '',
    bio: '',
    githubUrl: authUser?.githubUrl || '',
    stats: {
      contributionScore: 0,
      level: 1,
      levelProgress: 0,
      streak: 0,
      badges: 0,
      totalBadges: 0,
      totalContributions: 0,
      rank: 0,
      projects: 0,
      followers: 0,
      following: 0
    }
  };

  // Use calculated badges from stats
  const badges = calculatedStats.badgesList || [];

  // Use real GitHub repositories for recent projects
  const recentProjects = topRepositories ? topRepositories.slice(0, 6).map(repo => ({
    name: repo.name,
    role: 'Owner', // GitHub doesn't provide role info, assume owner for user's repos
    contributions: repo.stars + repo.forks,
    lastActive: new Date(repo.updatedAt).toLocaleDateString(),
    url: repo.url,
    description: repo.description,
    language: repo.language
  })) : [
    { name: 'PRAISE', role: 'Maintainer', contributions: 45, lastActive: '2 days ago' },
    { name: 'React-App', role: 'Contributor', contributions: 32, lastActive: '1 week ago' },
    { name: 'UI-Library', role: 'Contributor', contributions: 28, lastActive: '2 weeks ago' },
    { name: 'API-Service', role: 'Contributor', contributions: 19, lastActive: '3 weeks ago' },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'badges', name: 'Badges', icon: Trophy },
    { id: 'projects', name: 'Projects', icon: GitBranch },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  // Show loading state
  if (profileLoading || activityLoading || ratingLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading profile data...</span>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {!hasRatings && (
            <button
              onClick={generateRatings}
              disabled={isGenerating}
              className="btn-primary flex items-center space-x-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trophy className="h-4 w-4" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate Ratings'}</span>
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">@{user.username}</p>
              <p className="text-sm text-gray-500 mt-2">{user.bio}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {user.location}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {user.joinDate}
                </div>
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{user.stats.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{user.stats.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Stats Overview */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{user.stats.totalContributions.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Contributions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.stats.streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Level {user.stats.level}</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{user.stats.badges}</div>
                <div className="text-sm text-gray-600">Badges</div>
              </div>
              {user.stats.ratingScore > 0 && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{user.stats.ratingScore}/100</div>
                    <div className="text-sm text-gray-600">Rating Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{user.stats.totalPRs}</div>
                    <div className="text-sm text-gray-600">Rated PRs</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <GitBranch className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Merged PR in PRAISE</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Closed issue in React-App</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Earned "Code Quality Master" badge</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Badges Tab */}
              {activeTab === 'badges' && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.map((badge) => {
                      const Icon = badge.icon;
                      return (
                        <div key={badge.id} className={`p-4 rounded-lg border-2 ${
                          badge.earned ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${badge.color}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h5 className={`font-medium ${
                                badge.earned ? 'text-primary-900' : 'text-gray-500'
                              }`}>
                                {badge.name}
                              </h5>
                              <p className={`text-sm ${
                                badge.earned ? 'text-primary-700' : 'text-gray-400'
                              }`}>
                                {badge.description}
                              </p>
                            </div>
                            {badge.earned && (
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h4>
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <GitBranch className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{project.name}</h5>
                            <p className="text-sm text-gray-600">{project.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{project.contributions} contributions</p>
                          <p className="text-xs text-gray-500">Last active {project.lastActive}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive updates about your contributions</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Public Profile</p>
                            <p className="text-sm text-gray-600">Make your profile visible to others</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
