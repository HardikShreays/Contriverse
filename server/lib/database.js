// Database schema and models for Contriverse gamification system
// This is a mock database implementation - in production, use a real database like PostgreSQL

class Database {
  constructor() {
    this.organizations = new Map();
    this.contributors = new Map();
    this.achievements = new Map();
    this.badges = new Map();
    this.issues = new Map();
    this.timeBoundTasks = new Map();
    this.notifications = new Map();
    this.leaderboards = new Map();
    this.ratings = new Map();
    
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Initialize default badges
    const defaultBadges = [
      {
        id: 'first-pr',
        name: 'First PR',
        description: 'Merged your first pull request',
        icon: '🎉',
        color: 'bronze',
        requirements: { prs: 1 },
        points: 10
      },
      {
        id: 'code-warrior',
        name: 'Code Warrior',
        description: '10+ pull requests merged',
        icon: '⚔️',
        color: 'silver',
        requirements: { prs: 10 },
        points: 50
      },
      {
        id: 'issue-solver',
        name: 'Issue Solver',
        description: 'Solved 5+ issues',
        icon: '🔧',
        color: 'gold',
        requirements: { issues: 5 },
        points: 75
      },
      {
        id: 'streak-master',
        name: 'Streak Master',
        description: '7 days coding streak',
        icon: '🔥',
        color: 'platinum',
        requirements: { streak: 7 },
        points: 100
      },
      {
        id: 'milestone-master',
        name: 'Milestone Master',
        description: 'Completed 1 year of contributions',
        icon: '🏆',
        color: 'diamond',
        requirements: { days: 365 },
        points: 500
      },
      {
        id: 'pr-champion',
        name: 'PR Champion',
        description: '25+ pull requests merged',
        icon: '👑',
        color: 'legendary',
        requirements: { prs: 25 },
        points: 250
      }
    ];

    defaultBadges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
  }

  // Organization methods
  createOrganization(orgData) {
    const org = {
      id: `org_${Date.now()}`,
      name: orgData.name,
      githubOrg: orgData.githubOrg,
      slackChannel: orgData.slackChannel,
      discordChannel: orgData.discordChannel,
      createdAt: new Date().toISOString(),
      contributors: [],
      achievements: [],
      settings: {
        timeBoundIssues: true,
        notificationEnabled: true,
        leaderboardEnabled: true
      }
    };
    this.organizations.set(org.id, org);
    return org;
  }

  getOrganization(orgId) {
    return this.organizations.get(orgId);
  }

  addContributorToOrg(orgId, contributorId) {
    const org = this.organizations.get(orgId);
    if (org && !org.contributors.includes(contributorId)) {
      org.contributors.push(contributorId);
    }
  }

  // Contributor methods
  createContributor(contributorData) {
    const contributor = {
      id: `contrib_${Date.now()}`,
      githubId: contributorData.githubId,
      username: contributorData.username,
      name: contributorData.name,
      avatar: contributorData.avatar,
      githubUrl: contributorData.githubUrl,
      organizations: [],
      achievements: [],
      badges: [],
      stats: {
        totalPRs: 0,
        totalIssues: 0,
        totalStars: 0,
        totalCommits: 0,
        streak: 0,
        level: 1,
        points: 0,
        averageRating: 0,
        ratingLevel: 'no-data',
        joinDate: new Date().toISOString()
      },
      timeBoundTasks: [],
      notifications: [],
      ratings: []
    };
    this.contributors.set(contributor.id, contributor);
    return contributor;
  }

  getContributor(contributorId) {
    return this.contributors.get(contributorId);
  }

  findContributorByUsername(username) {
    for (const [id, contributor] of this.contributors.entries()) {
      if (contributor.username === username) {
        return id;
      }
    }
    return null;
  }

  setContributor(contributorId, contributor) {
    this.contributors.set(contributorId, contributor);
  }

  updateContributorStats(contributorId, stats) {
    const contributor = this.contributors.get(contributorId);
    if (contributor) {
      contributor.stats = { ...contributor.stats, ...stats };
      this.updateContributorLevel(contributorId);
    }
  }

  updateContributorLevel(contributorId) {
    const contributor = this.contributors.get(contributorId);
    if (contributor) {
      const points = contributor.stats.points;
      let level = 1;
      
      if (points >= 1000) level = 10;
      else if (points >= 500) level = 9;
      else if (points >= 250) level = 8;
      else if (points >= 100) level = 7;
      else if (points >= 75) level = 6;
      else if (points >= 50) level = 5;
      else if (points >= 25) level = 4;
      else if (points >= 10) level = 3;
      else if (points >= 5) level = 2;
      
      contributor.stats.level = level;
    }
  }

  // Achievement methods
  createAchievement(achievementData) {
    const achievement = {
      id: `ach_${Date.now()}`,
      contributorId: achievementData.contributorId,
      organizationId: achievementData.organizationId,
      type: achievementData.type, // 'pr', 'issue', 'milestone', 'streak'
      title: achievementData.title,
      description: achievementData.description,
      points: achievementData.points,
      badgeId: achievementData.badgeId,
      createdAt: new Date().toISOString(),
      metadata: achievementData.metadata || {}
    };
    
    this.achievements.set(achievement.id, achievement);
    
    // Add to contributor
    const contributor = this.contributors.get(achievement.contributorId);
    if (contributor) {
      contributor.achievements.push(achievement.id);
      contributor.stats.points += achievement.points;
      this.updateContributorLevel(achievement.contributorId);
    }
    
    return achievement;
  }

  getContributorAchievements(contributorId) {
    const contributor = this.contributors.get(contributorId);
    if (!contributor) return [];
    
    return contributor.achievements.map(achId => this.achievements.get(achId)).filter(Boolean);
  }

  // Badge methods
  awardBadge(contributorId, badgeId) {
    const contributor = this.contributors.get(contributorId);
    const badge = this.badges.get(badgeId);
    
    if (contributor && badge && !contributor.badges.includes(badgeId)) {
      contributor.badges.push(badgeId);
      contributor.stats.points += badge.points;
      this.updateContributorLevel(contributorId);
      
      // Create achievement
      this.createAchievement({
        contributorId,
        organizationId: contributor.organizations[0], // Assuming first org
        type: 'badge',
        title: `Earned ${badge.name}`,
        description: badge.description,
        points: badge.points,
        badgeId
      });
      
      return true;
    }
    return false;
  }

  // Time-bound task methods
  createTimeBoundTask(taskData) {
    const task = {
      id: `task_${Date.now()}`,
      contributorId: taskData.contributorId,
      organizationId: taskData.organizationId,
      issueId: taskData.issueId,
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      priority: taskData.priority, // 'low', 'medium', 'high', 'urgent'
      status: 'assigned', // 'assigned', 'in_progress', 'completed', 'overdue'
      points: taskData.points,
      createdAt: new Date().toISOString()
    };
    
    this.timeBoundTasks.set(task.id, task);
    
    // Add to contributor
    const contributor = this.contributors.get(task.contributorId);
    if (contributor) {
      contributor.timeBoundTasks.push(task.id);
    }
    
    return task;
  }

  updateTaskStatus(taskId, status) {
    const task = this.timeBoundTasks.get(taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
    }
  }

  getOverdueTasks() {
    const now = new Date();
    return Array.from(this.timeBoundTasks.values()).filter(task => {
      const deadline = new Date(task.deadline);
      return deadline < now && task.status !== 'completed';
    });
  }

  // Notification methods
  createNotification(notificationData) {
    const notification = {
      id: `notif_${Date.now()}`,
      contributorId: notificationData.contributorId,
      organizationId: notificationData.organizationId,
      type: notificationData.type, // 'achievement', 'milestone', 'deadline', 'celebration'
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data || {},
      read: false,
      createdAt: new Date().toISOString()
    };
    
    this.notifications.set(notification.id, notification);
    
    // Add to contributor
    const contributor = this.contributors.get(notification.contributorId);
    if (contributor) {
      contributor.notifications.push(notification.id);
    }
    
    return notification;
  }

  // Leaderboard methods
  getOrganizationLeaderboard(orgId, limit = 10) {
    const org = this.organizations.get(orgId);
    if (!org) return [];
    
    const contributors = org.contributors
      .map(contribId => this.contributors.get(contribId))
      .filter(Boolean)
      .sort((a, b) => b.stats.points - a.stats.points)
      .slice(0, limit);
    
    return contributors.map((contrib, index) => ({
      rank: index + 1,
      contributor: {
        id: contrib.id,
        username: contrib.username,
        name: contrib.name,
        avatar: contrib.avatar
      },
      stats: contrib.stats,
      badges: contrib.badges.map(badgeId => this.badges.get(badgeId)).filter(Boolean)
    }));
  }

  // Analytics methods
  getOrganizationStats(orgId) {
    const org = this.organizations.get(orgId);
    if (!org) return null;
    
    const contributors = org.contributors
      .map(contribId => this.contributors.get(contribId))
      .filter(Boolean);
    
    const totalContributors = contributors.length;
    const totalPoints = contributors.reduce((sum, contrib) => sum + contrib.stats.points, 0);
    const totalPRs = contributors.reduce((sum, contrib) => sum + contrib.stats.totalPRs, 0);
    const totalIssues = contributors.reduce((sum, contrib) => sum + contrib.stats.totalIssues, 0);
    const activeContributors = contributors.filter(contrib => {
      const lastActive = new Date(contrib.stats.lastActive || contrib.stats.joinDate);
      const daysSinceActive = (new Date() - lastActive) / (1000 * 60 * 60 * 24);
      return daysSinceActive <= 30;
    }).length;
    
    return {
      totalContributors,
      activeContributors,
      totalPoints,
      totalPRs,
      totalIssues,
      averagePoints: totalContributors > 0 ? Math.round(totalPoints / totalContributors) : 0,
      topContributor: contributors.sort((a, b) => b.stats.points - a.stats.points)[0]
    };
  }
}

// Create singleton instance
const db = new Database();

module.exports = db;

