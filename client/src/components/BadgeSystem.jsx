import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Target, 
  Clock, 
  GitBranch,
  CheckCircle,
  Lock
} from 'lucide-react';

const BadgeSystem = ({ contributor, onBadgeEarned }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBadges();
  }, [contributor]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockBadges = [
          {
            id: 'first-pr',
            name: 'First PR',
            description: 'Merged your first pull request',
            icon: '🎉',
            color: 'bronze',
            category: 'pr',
            requirements: { prs: 1 },
            points: 10,
            unlocked: true,
            unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'code-warrior',
            name: 'Code Warrior',
            description: '10+ pull requests merged',
            icon: '⚔️',
            color: 'silver',
            category: 'pr',
            requirements: { prs: 10 },
            points: 50,
            unlocked: true,
            unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'issue-solver',
            name: 'Issue Solver',
            description: 'Solved 5+ issues',
            icon: '🔧',
            color: 'gold',
            category: 'issue',
            requirements: { issues: 5 },
            points: 75,
            unlocked: false,
            progress: { current: 3, required: 5 }
          },
          {
            id: 'streak-master',
            name: 'Streak Master',
            description: '7 days coding streak',
            icon: '🔥',
            color: 'platinum',
            category: 'streak',
            requirements: { streak: 7 },
            points: 100,
            unlocked: false,
            progress: { current: 4, required: 7 }
          },
          {
            id: 'milestone-master',
            name: 'Milestone Master',
            description: 'Completed 1 year of contributions',
            icon: '🏆',
            color: 'diamond',
            category: 'milestone',
            requirements: { days: 365 },
            points: 500,
            unlocked: false,
            progress: { current: 120, required: 365 }
          },
          {
            id: 'pr-champion',
            name: 'PR Champion',
            description: '25+ pull requests merged',
            icon: '👑',
            color: 'legendary',
            category: 'pr',
            requirements: { prs: 25 },
            points: 250,
            unlocked: false,
            progress: { current: 12, required: 25 }
          },
          {
            id: 'bug-hunter',
            name: 'Bug Hunter',
            description: 'Found and fixed 10+ bugs',
            icon: '🐛',
            color: 'silver',
            category: 'issue',
            requirements: { bugs: 10 },
            points: 100,
            unlocked: false,
            progress: { current: 7, required: 10 }
          },
          {
            id: 'documentation-hero',
            name: 'Documentation Hero',
            description: 'Improved documentation for 5+ projects',
            icon: '📚',
            color: 'gold',
            category: 'contribution',
            requirements: { docs: 5 },
            points: 150,
            unlocked: false,
            progress: { current: 2, required: 5 }
          }
        ];
        setBadges(mockBadges);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching badges:', error);
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Badges', icon: Award },
    { id: 'pr', label: 'Pull Requests', icon: GitBranch },
    { id: 'issue', label: 'Issues', icon: Target },
    { id: 'streak', label: 'Streaks', icon: Zap },
    { id: 'milestone', label: 'Milestones', icon: Trophy },
    { id: 'contribution', label: 'Contributions', icon: Star }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const getBadgeColor = (color) => {
    const colors = {
      bronze: 'from-orange-400 to-orange-600',
      silver: 'from-gray-300 to-gray-500',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-purple-600',
      diamond: 'from-blue-400 to-blue-600',
      legendary: 'from-red-400 to-red-600'
    };
    return colors[color] || 'from-gray-400 to-gray-600';
  };

  const getBadgeIcon = (category) => {
    const icons = {
      pr: GitBranch,
      issue: Target,
      streak: Zap,
      milestone: Trophy,
      contribution: Star
    };
    return icons[category] || Award;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Badge System</h1>
        <p className="text-gray-600">
          Earn badges by contributing to open source projects and achieving milestones
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{badges.filter(b => b.unlocked).length}</h3>
          <p className="text-gray-600">Badges Earned</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{badges.length}</h3>
          <p className="text-gray-600">Total Badges</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {badges.filter(b => b.unlocked).reduce((sum, badge) => sum + badge.points, 0)}
          </h3>
          <p className="text-gray-600">Points Earned</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
            <Crown className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
          </h3>
          <p className="text-gray-600">Completion</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <category.icon className="w-4 h-4 mr-2" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBadges.map(badge => (
          <div
            key={badge.id}
            className={`relative bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
              badge.unlocked 
                ? 'ring-2 ring-yellow-300 hover:shadow-lg' 
                : 'opacity-60 hover:opacity-80'
            }`}
          >
            {/* Badge Icon */}
            <div className="text-center mb-4">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${getBadgeColor(badge.color)} flex items-center justify-center text-2xl mb-3`}>
                {badge.icon}
              </div>
              
              {/* Unlock Status */}
              {badge.unlocked ? (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              ) : (
                <div className="absolute top-2 right-2">
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Badge Info */}
            <div className="text-center">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
              
              {/* Points */}
              <div className="flex items-center justify-center mb-3">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-semibold text-gray-700">{badge.points} points</span>
              </div>

              {/* Progress Bar (for locked badges) */}
              {!badge.unlocked && badge.progress && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{badge.progress.current}/{badge.progress.required}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Unlock Date (for unlocked badges) */}
              {badge.unlocked && badge.unlockedAt && (
                <div className="text-xs text-gray-500">
                  Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                </div>
              )}

              {/* Requirements */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <getBadgeIcon className="w-3 h-3 mr-1" />
                  {badge.category}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Goals */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-500" />
          Next Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.filter(badge => !badge.unlocked && badge.progress).slice(0, 4).map(badge => (
            <div key={badge.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-sm">{badge.name}</h3>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;

