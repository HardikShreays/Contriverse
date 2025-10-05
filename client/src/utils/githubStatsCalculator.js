import { Star, Award, Users, Target, Zap, Trophy, GitBranch, Shield, TrendingUp, Medal } from 'lucide-react';

// Calculate contribution score based on multiple GitHub metrics
export const calculateContributionScore = (githubStats, githubActivity) => {
  if (!githubStats) return 0;
  
  const {
    totalStars,
    totalForks,
    totalRepos,
    followers,
    publicRepos
  } = githubStats;

  // Weight different metrics for a more comprehensive score
  const score = 
    (totalStars * 3) +           // Stars are highly valued
    (totalForks * 2) +           // Forks show project usage
    (totalRepos * 5) +           // Repository count shows activity
    (followers * 1) +            // Followers show community recognition
    (publicRepos * 2);           // Public repos show open source contribution

  return Math.floor(score);
};

// Calculate user level based on contribution score
export const calculateLevel = (contributionScore) => {
  if (contributionScore === 0) return 1;
  
  // Progressive level calculation: each level requires more points
  let level = 1;
  let requiredPoints = 100;
  
  while (contributionScore >= requiredPoints) {
    level++;
    requiredPoints += Math.floor(requiredPoints * 0.5); // 50% increase per level
  }
  
  return level;
};

// Calculate progress to next level
export const calculateLevelProgress = (contributionScore, currentLevel) => {
  if (currentLevel === 1) {
    const nextLevelPoints = 100;
    return Math.min((contributionScore / nextLevelPoints) * 100, 100);
  }
  
  // Calculate points needed for current level
  let requiredPoints = 100;
  for (let i = 2; i <= currentLevel; i++) {
    requiredPoints += Math.floor(requiredPoints * 0.5);
  }
  
  // Calculate points needed for next level
  const nextLevelPoints = requiredPoints + Math.floor(requiredPoints * 0.5);
  const progressPoints = contributionScore - requiredPoints;
  const neededPoints = nextLevelPoints - requiredPoints;
  
  return Math.max(0, Math.min((progressPoints / neededPoints) * 100, 100));
};

// Calculate estimated streak based on recent activity
export const calculateStreak = (githubActivity) => {
  if (!githubActivity || githubActivity.length === 0) return 0;
  
  // Group activities by date
  const activitiesByDate = {};
  githubActivity.forEach(activity => {
    const date = new Date(activity.createdAt).toDateString();
    activitiesByDate[date] = (activitiesByDate[date] || 0) + 1;
  });
  
  // Calculate consecutive days with activity
  const dates = Object.keys(activitiesByDate).sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < dates.length; i++) {
    const activityDate = new Date(dates[i]);
    const diffTime = currentDate - activityDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak + 1 || (streak === 0 && diffDays <= 1)) {
      streak++;
      currentDate = activityDate;
    } else {
      break;
    }
  }
  
  return streak;
};

// Generate badges based on GitHub metrics
export const generateBadges = (githubStats, githubActivity, contributionScore) => {
  if (!githubStats) return [];
  
  const {
    totalStars,
    totalForks,
    totalRepos,
    followers,
    publicRepos
  } = githubStats;
  
  const badges = [];
  
  // First Contribution
  if (totalRepos > 0) {
    badges.push({
      id: 'first-contribution',
      name: 'First Contribution',
      description: 'Made your first repository',
      earned: true,
      icon: Star,
      color: 'bg-yellow-100 text-yellow-800'
    });
  }
  
  // Repository Creator
  if (totalRepos >= 5) {
    badges.push({
      id: 'repository-creator',
      name: 'Repository Creator',
      description: 'Created 5+ repositories',
      earned: true,
      icon: GitBranch,
      color: 'bg-blue-100 text-blue-800'
    });
  }
  
  // Star Collector
  if (totalStars >= 10) {
    badges.push({
      id: 'star-collector',
      name: 'Star Collector',
      description: 'Earned 10+ stars',
      earned: true,
      icon: Star,
      color: 'bg-yellow-100 text-yellow-800'
    });
  }
  
  // Open Source Hero
  if (totalStars >= 100) {
    badges.push({
      id: 'open-source-hero',
      name: 'Open Source Hero',
      description: 'Earned 100+ stars',
      earned: true,
      icon: Trophy,
      color: 'bg-orange-100 text-orange-800'
    });
  }
  
  // Community Builder
  if (followers >= 10) {
    badges.push({
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Gained 10+ followers',
      earned: true,
      icon: Users,
      color: 'bg-green-100 text-green-800'
    });
  }
  
  // Influencer
  if (followers >= 100) {
    badges.push({
      id: 'influencer',
      name: 'Influencer',
      description: 'Gained 100+ followers',
      earned: true,
      icon: Award,
      color: 'bg-purple-100 text-purple-800'
    });
  }
  
  // Fork Master
  if (totalForks >= 20) {
    badges.push({
      id: 'fork-master',
      name: 'Fork Master',
      description: 'Projects forked 20+ times',
      earned: true,
      icon: Target,
      color: 'bg-red-100 text-red-800'
    });
  }
  
  // Prolific Developer
  if (totalRepos >= 20) {
    badges.push({
      id: 'prolific-developer',
      name: 'Prolific Developer',
      description: 'Created 20+ repositories',
      earned: true,
      icon: Zap,
      color: 'bg-indigo-100 text-indigo-800'
    });
  }
  
  // Public Contributor
  if (publicRepos >= 10) {
    badges.push({
      id: 'public-contributor',
      name: 'Public Contributor',
      description: 'Maintains 10+ public repositories',
      earned: true,
      icon: Shield,
      color: 'bg-emerald-100 text-emerald-800'
    });
  }
  
  // Contribution Master
  if (contributionScore >= 500) {
    badges.push({
      id: 'contribution-master',
      name: 'Contribution Master',
      description: 'High overall contribution score',
      earned: true,
      icon: Trophy,
      color: 'bg-amber-100 text-amber-800'
    });
  }
  
  // Add some unearned badges for motivation
  const unearnedBadges = [
    {
      id: 'github-superstar',
      name: 'GitHub Superstar',
      description: 'Earn 1000+ stars',
      earned: false,
      icon: Star,
      color: 'bg-gray-100 text-gray-500'
    },
    {
      id: 'github-celebrity',
      name: 'GitHub Celebrity',
      description: 'Gain 1000+ followers',
      earned: false,
      icon: Award,
      color: 'bg-gray-100 text-gray-500'
    },
    {
      id: 'repository-legend',
      name: 'Repository Legend',
      description: 'Create 100+ repositories',
      earned: false,
      icon: GitBranch,
      color: 'bg-gray-100 text-gray-500'
    }
  ];
  
  // Add unearned badges that haven't been achieved
  unearnedBadges.forEach(badge => {
    if (!badges.find(b => b.id === badge.id)) {
      badges.push(badge);
    }
  });
  
  return badges.sort((a, b) => {
    // Sort earned badges first, then by name
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return a.name.localeCompare(b.name);
  });
};

// Calculate comprehensive stats including rating data
export const calculateStats = (githubStats, githubActivity, ratingSummary = null) => {
  const contributionScore = calculateContributionScore(githubStats, githubActivity);
  const level = calculateLevel(contributionScore);
  const levelProgress = calculateLevelProgress(contributionScore, level);
  const streak = calculateStreak(githubActivity);
  
  // Generate GitHub-based badges
  const githubBadges = generateBadges(githubStats, githubActivity, contributionScore);
  
  // Generate rating-based badges if rating data exists
  const ratingBadges = ratingSummary ? generateRatingBadges(ratingSummary) : [];
  
  // Combine all badges
  const allBadges = [...githubBadges, ...ratingBadges];
  const earnedBadges = allBadges.filter(badge => badge.earned).length;
  
  // Calculate enhanced contribution score with rating bonus
  const ratingBonus = ratingSummary ? ratingSummary.averageScore * 0.1 : 0; // 10% bonus for rating score
  const enhancedContributionScore = contributionScore + ratingBonus;
  
  return {
    contributionScore: enhancedContributionScore,
    level: calculateLevel(enhancedContributionScore),
    levelProgress: calculateLevelProgress(enhancedContributionScore, calculateLevel(enhancedContributionScore)),
    streak,
    badges: earnedBadges,
    totalBadges: allBadges.length,
    badgesList: allBadges,
    // Additional calculated metrics
    totalContributions: githubStats ? githubStats.totalStars + githubStats.totalForks : 0,
    projects: githubStats ? githubStats.totalRepos : 0,
    followers: githubStats ? githubStats.followers : 0,
    following: githubStats ? githubStats.following : 0,
    rank: 0, // Would need global ranking system
    // Rating-specific metrics
    ratingScore: ratingSummary ? ratingSummary.averageScore : 0,
    totalPRs: ratingSummary ? ratingSummary.totalPRs : 0,
    ratingLevel: ratingSummary ? ratingSummary.ratingLevel : 'no-data',
    ratingTrend: ratingSummary ? ratingSummary.recentTrend : 'no-data'
  };
};

// Generate rating-based badges
export const generateRatingBadges = (ratingSummary) => {
  const badges = [];

  // Rating level badges
  if (ratingSummary.ratingLevel === 'excellent') {
    badges.push({
      id: 'rating-excellent',
      name: 'Excellent Contributor',
      description: 'Consistently excellent PR ratings (90+ average)',
      earned: true,
      icon: Medal,
      color: 'bg-yellow-100 text-yellow-800'
    });
  }

  if (ratingSummary.ratingLevel === 'very-good') {
    badges.push({
      id: 'rating-very-good',
      name: 'High Quality Contributor',
      description: 'Very good PR ratings (80+ average)',
      earned: true,
      icon: Award,
      color: 'bg-green-100 text-green-800'
    });
  }

  if (ratingSummary.ratingLevel === 'good') {
    badges.push({
      id: 'rating-good',
      name: 'Quality Contributor',
      description: 'Good PR ratings (70+ average)',
      earned: true,
      icon: Star,
      color: 'bg-blue-100 text-blue-800'
    });
  }

  // PR count badges
  if (ratingSummary.totalPRs >= 5) {
    badges.push({
      id: 'rating-active',
      name: 'Active Contributor',
      description: '5+ rated PRs',
      earned: true,
      icon: GitBranch,
      color: 'bg-indigo-100 text-indigo-800'
    });
  }

  if (ratingSummary.totalPRs >= 10) {
    badges.push({
      id: 'rating-prolific',
      name: 'Prolific Contributor',
      description: '10+ rated PRs',
      earned: true,
      icon: Zap,
      color: 'bg-purple-100 text-purple-800'
    });
  }

  if (ratingSummary.totalPRs >= 25) {
    badges.push({
      id: 'rating-expert',
      name: 'Rating Expert',
      description: '25+ rated PRs',
      earned: true,
      icon: Trophy,
      color: 'bg-amber-100 text-amber-800'
    });
  }

  // Average score badges
  if (ratingSummary.averageScore >= 95) {
    badges.push({
      id: 'rating-perfect',
      name: 'Near Perfect',
      description: '95+ average rating score',
      earned: true,
      icon: Medal,
      color: 'bg-yellow-100 text-yellow-800'
    });
  }

  if (ratingSummary.averageScore >= 85) {
    badges.push({
      id: 'rating-high-performer',
      name: 'High Performer',
      description: '85+ average rating score',
      earned: true,
      icon: Award,
      color: 'bg-emerald-100 text-emerald-800'
    });
  }

  // Trend badges
  if (ratingSummary.recentTrend === 'improving') {
    badges.push({
      id: 'rating-improving',
      name: 'Getting Better',
      description: 'Improving rating trend',
      earned: true,
      icon: TrendingUp,
      color: 'bg-teal-100 text-teal-800'
    });
  }

  if (ratingSummary.recentTrend === 'slightly-improving') {
    badges.push({
      id: 'rating-slightly-improving',
      name: 'On the Rise',
      description: 'Slightly improving rating trend',
      earned: true,
      icon: TrendingUp,
      color: 'bg-teal-100 text-teal-800'
    });
  }

  // Component-specific badges based on breakdown
  if (ratingSummary.breakdown) {
    const { breakdown } = ratingSummary;
    
    if (breakdown.priority >= 80) {
      badges.push({
        id: 'rating-priority-master',
        name: 'Priority Master',
        description: 'Excellent priority handling',
        earned: true,
        icon: Target,
        color: 'bg-red-100 text-red-800'
      });
    }

    if (breakdown.quality >= 80) {
      badges.push({
        id: 'rating-quality-expert',
        name: 'Quality Expert',
        description: 'Excellent code quality',
        earned: true,
        icon: Shield,
        color: 'bg-green-100 text-green-800'
      });
    }

    if (breakdown.timeFactor >= 80) {
      badges.push({
        id: 'rating-time-master',
        name: 'Time Master',
        description: 'Excellent time management',
        earned: true,
        icon: Zap,
        color: 'bg-orange-100 text-orange-800'
      });
    }
  }

  // Add unearned badges for motivation
  const unearnedBadges = [
    {
      id: 'rating-perfectionist',
      name: 'Perfectionist',
      description: 'Achieve 98+ average rating',
      earned: false,
      icon: Medal,
      color: 'bg-gray-100 text-gray-500'
    },
    {
      id: 'rating-legend',
      name: 'Rating Legend',
      description: 'Achieve 50+ rated PRs',
      earned: false,
      icon: Trophy,
      color: 'bg-gray-100 text-gray-500'
    }
  ];

  // Add unearned badges that haven't been achieved
  unearnedBadges.forEach(badge => {
    if (!badges.find(b => b.id === badge.id)) {
      badges.push(badge);
    }
  });

  return badges.sort((a, b) => {
    // Sort earned badges first, then by name
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return a.name.localeCompare(b.name);
  });
};
