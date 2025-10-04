const express = require('express');
const router = express.Router();
const db = require('../lib/database');
const { authenticateToken } = require('../middleware/auth');

// Track GitHub activity and update achievements
router.post('/track-activity', authenticateToken, async (req, res) => {
  try {
    const { contributorId, activityType, data } = req.body;
    
    const contributor = db.getContributor(contributorId);
    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: 'Contributor not found',
        message: 'Contributor does not exist'
      });
    }

    let achievements = [];
    let statsUpdate = {};

    switch (activityType) {
      case 'pr_merged':
        statsUpdate.totalPRs = (contributor.stats.totalPRs || 0) + 1;
        statsUpdate.points = (contributor.stats.points || 0) + 10;
        
        // Check for PR-based achievements
        achievements = await checkPRAchievements(contributor, data);
        break;
        
      case 'issue_solved':
        statsUpdate.totalIssues = (contributor.stats.totalIssues || 0) + 1;
        statsUpdate.points = (contributor.stats.points || 0) + 5;
        
        // Check for issue-based achievements
        achievements = await checkIssueAchievements(contributor, data);
        break;
        
      case 'commit_pushed':
        statsUpdate.totalCommits = (contributor.stats.totalCommits || 0) + (data.commits || 1);
        statsUpdate.points = (contributor.stats.points || 0) + 2;
        
        // Check for commit-based achievements
        achievements = await checkCommitAchievements(contributor, data);
        break;
        
      case 'star_received':
        statsUpdate.totalStars = (contributor.stats.totalStars || 0) + 1;
        statsUpdate.points = (contributor.stats.points || 0) + 3;
        
        // Check for star-based achievements
        achievements = await checkStarAchievements(contributor, data);
        break;
        
      case 'daily_activity':
        // Update streak
        const currentStreak = await updateStreak(contributor, data);
        statsUpdate.streak = currentStreak;
        statsUpdate.points = (contributor.stats.points || 0) + 1;
        
        // Check for streak achievements
        achievements = await checkStreakAchievements(contributor, currentStreak);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid activity type',
          message: 'Activity type must be one of: pr_merged, issue_solved, commit_pushed, star_received, daily_activity'
        });
    }

    // Update contributor stats
    db.updateContributorStats(contributorId, statsUpdate);

    // Create achievements
    const createdAchievements = [];
    for (const achievement of achievements) {
      const created = db.createAchievement({
        contributorId,
        organizationId: contributor.organizations[0],
        type: achievement.type,
        title: achievement.title,
        description: achievement.description,
        points: achievement.points,
        metadata: achievement.metadata
      });
      createdAchievements.push(created);
    }

    // Check for milestone achievements
    const milestoneAchievements = await checkMilestoneAchievements(contributor);
    for (const achievement of milestoneAchievements) {
      const created = db.createAchievement({
        contributorId,
        organizationId: contributor.organizations[0],
        type: achievement.type,
        title: achievement.title,
        description: achievement.description,
        points: achievement.points,
        metadata: achievement.metadata
      });
      createdAchievements.push(created);
    }

    res.json({
      success: true,
      data: {
        contributor: {
          id: contributor.id,
          username: contributor.username,
          stats: contributor.stats
        },
        achievements: createdAchievements,
        statsUpdate
      },
      message: `Activity tracked successfully. ${createdAchievements.length} new achievements earned.`
    });

  } catch (error) {
    console.error('Track Activity Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to track activity',
      message: error.message
    });
  }
});

// Check PR-based achievements
async function checkPRAchievements(contributor, data) {
  const achievements = [];
  const totalPRs = (contributor.stats.totalPRs || 0) + 1;
  
  // First PR
  if (totalPRs === 1) {
    achievements.push({
      type: 'pr',
      title: 'First PR Merged!',
      description: 'Congratulations on merging your first pull request!',
      points: 25,
      metadata: { prCount: 1 }
    });
  }
  
  // PR milestones
  const prMilestones = [5, 10, 25, 50, 100];
  for (const milestone of prMilestones) {
    if (totalPRs === milestone) {
      achievements.push({
        type: 'pr',
        title: `${milestone} PRs Merged!`,
        description: `Amazing work! You've merged ${milestone} pull requests.`,
        points: milestone * 2,
        metadata: { prCount: milestone }
      });
    }
  }
  
  // PR quality achievements
  if (data.linesAdded > 1000) {
    achievements.push({
      type: 'pr',
      title: 'Code Champion',
      description: 'Merged a PR with 1000+ lines of code!',
      points: 50,
      metadata: { linesAdded: data.linesAdded }
    });
  }
  
  if (data.reviews > 5) {
    achievements.push({
      type: 'pr',
      title: 'Review Master',
      description: 'Received 5+ reviews on a single PR!',
      points: 30,
      metadata: { reviews: data.reviews }
    });
  }
  
  return achievements;
}

// Check issue-based achievements
async function checkIssueAchievements(contributor, data) {
  const achievements = [];
  const totalIssues = (contributor.stats.totalIssues || 0) + 1;
  
  // Issue milestones
  const issueMilestones = [1, 5, 10, 25, 50];
  for (const milestone of issueMilestones) {
    if (totalIssues === milestone) {
      achievements.push({
        type: 'issue',
        title: `${milestone} Issues Solved!`,
        description: `Great problem-solving! You've solved ${milestone} issues.`,
        points: milestone * 3,
        metadata: { issueCount: milestone }
      });
    }
  }
  
  // Issue type achievements
  if (data.issueType === 'bug') {
    achievements.push({
      type: 'issue',
      title: 'Bug Hunter',
      description: 'Successfully fixed a bug!',
      points: 15,
      metadata: { issueType: 'bug' }
    });
  }
  
  if (data.issueType === 'feature') {
    achievements.push({
      type: 'issue',
      title: 'Feature Builder',
      description: 'Implemented a new feature!',
      points: 25,
      metadata: { issueType: 'feature' }
    });
  }
  
  return achievements;
}

// Check commit-based achievements
async function checkCommitAchievements(contributor, data) {
  const achievements = [];
  const totalCommits = (contributor.stats.totalCommits || 0) + (data.commits || 1);
  
  // Commit milestones
  const commitMilestones = [10, 50, 100, 500, 1000];
  for (const milestone of commitMilestones) {
    if (totalCommits === milestone) {
      achievements.push({
        type: 'commit',
        title: `${milestone} Commits!`,
        description: `Incredible dedication! You've made ${milestone} commits.`,
        points: milestone / 10,
        metadata: { commitCount: milestone }
      });
    }
  }
  
  // Daily commit achievements
  if (data.commits >= 10) {
    achievements.push({
      type: 'commit',
      title: 'Commit Machine',
      description: 'Made 10+ commits in a single day!',
      points: 20,
      metadata: { dailyCommits: data.commits }
    });
  }
  
  return achievements;
}

// Check star-based achievements
async function checkStarAchievements(contributor, data) {
  const achievements = [];
  const totalStars = (contributor.stats.totalStars || 0) + 1;
  
  // Star milestones
  const starMilestones = [1, 10, 50, 100, 500, 1000];
  for (const milestone of starMilestones) {
    if (totalStars === milestone) {
      achievements.push({
        type: 'star',
        title: `${milestone} Stars!`,
        description: `Your work is getting recognition! You've received ${milestone} stars.`,
        points: milestone / 5,
        metadata: { starCount: milestone }
      });
    }
  }
  
  return achievements;
}

// Check streak achievements
async function checkStreakAchievements(contributor, currentStreak) {
  const achievements = [];
  
  // Streak milestones
  const streakMilestones = [3, 7, 14, 30, 60, 100, 365];
  for (const milestone of streakMilestones) {
    if (currentStreak === milestone) {
      achievements.push({
        type: 'streak',
        title: `${milestone} Day Streak!`,
        description: `Incredible consistency! You've been active for ${milestone} days straight.`,
        points: milestone * 2,
        metadata: { streakDays: milestone }
      });
    }
  }
  
  return achievements;
}

// Update contributor streak
async function updateStreak(contributor, data) {
  const today = new Date().toDateString();
  const lastActive = contributor.stats.lastActive ? new Date(contributor.stats.lastActive).toDateString() : null;
  
  if (lastActive === today) {
    // Already active today, no change
    return contributor.stats.streak || 0;
  }
  
  if (lastActive === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
    // Active yesterday, increment streak
    return (contributor.stats.streak || 0) + 1;
  }
  
  // Streak broken, reset to 1
  return 1;
}

// Check milestone achievements
async function checkMilestoneAchievements(contributor) {
  const achievements = [];
  const stats = contributor.stats;
  
  // Level milestones
  const level = Math.floor((stats.points || 0) / 100) + 1;
  if (level > (stats.level || 1)) {
    achievements.push({
      type: 'milestone',
      title: `Level ${level} Achieved!`,
      description: `Congratulations! You've reached level ${level}.`,
      points: level * 10,
      metadata: { level, points: stats.points }
    });
  }
  
  // Anniversary achievements
  const joinDate = new Date(stats.joinDate);
  const daysSinceJoin = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
  const yearsSinceJoin = Math.floor(daysSinceJoin / 365);
  
  if (yearsSinceJoin >= 1 && !contributor.achievements.some(ach => ach.type === 'anniversary')) {
    achievements.push({
      type: 'anniversary',
      title: '1 Year Anniversary!',
      description: 'Congratulations on completing 1 year of contributions!',
      points: 500,
      metadata: { years: 1, days: daysSinceJoin }
    });
  }
  
  // Points milestones
  const pointsMilestones = [100, 500, 1000, 2500, 5000, 10000];
  for (const milestone of pointsMilestones) {
    if (stats.points >= milestone && !contributor.achievements.some(ach => 
      ach.metadata && ach.metadata.pointsMilestone === milestone)) {
      achievements.push({
        type: 'milestone',
        title: `${milestone} Points!`,
        description: `Amazing work! You've earned ${milestone} points.`,
        points: 0, // No additional points for milestone
        metadata: { pointsMilestone: milestone }
      });
    }
  }
  
  return achievements;
}

// Get contributor's achievement history
router.get('/history/:contributorId', authenticateToken, async (req, res) => {
  try {
    const { contributorId } = req.params;
    const { limit = 50, type } = req.query;
    
    const contributor = db.getContributor(contributorId);
    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: 'Contributor not found',
        message: 'Contributor does not exist'
      });
    }

    let achievements = db.getContributorAchievements(contributorId);
    
    if (type) {
      achievements = achievements.filter(ach => ach.type === type);
    }
    
    achievements = achievements
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        contributor: {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar
        },
        achievements,
        total: achievements.length
      }
    });

  } catch (error) {
    console.error('Get Achievement History Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get achievement history',
      message: error.message
    });
  }
});

// Get achievement analytics
router.get('/analytics/:contributorId', authenticateToken, async (req, res) => {
  try {
    const { contributorId } = req.params;
    const { period = '30d' } = req.query;
    
    const contributor = db.getContributor(contributorId);
    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: 'Contributor not found',
        message: 'Contributor does not exist'
      });
    }

    const achievements = db.getContributorAchievements(contributorId);
    
    // Calculate analytics
    const analytics = {
      totalAchievements: achievements.length,
      totalPoints: achievements.reduce((sum, ach) => sum + ach.points, 0),
      achievementsByType: {},
      recentActivity: [],
      milestones: [],
      badges: contributor.badges.map(badgeId => db.badges.get(badgeId)).filter(Boolean)
    };
    
    // Group by type
    achievements.forEach(achievement => {
      if (!analytics.achievementsByType[achievement.type]) {
        analytics.achievementsByType[achievement.type] = 0;
      }
      analytics.achievementsByType[achievement.type]++;
    });
    
    // Recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    analytics.recentActivity = achievements
      .filter(ach => new Date(ach.createdAt) > weekAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Milestones
    analytics.milestones = achievements
      .filter(ach => ach.type === 'milestone')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        contributor: {
          id: contributor.id,
          username: contributor.username,
          stats: contributor.stats
        },
        analytics,
        period
      }
    });

  } catch (error) {
    console.error('Get Achievement Analytics Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get achievement analytics',
      message: error.message
    });
  }
});

module.exports = router;

