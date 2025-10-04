const express = require('express');
const router = express.Router();
const db = require('../lib/database');
const { authenticateToken } = require('../middleware/auth');

// Create organization
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, githubOrg, slackChannel, discordChannel } = req.body;
    
    if (!name || !githubOrg) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Organization name and GitHub org are required'
      });
    }

    const organization = db.createOrganization({
      name,
      githubOrg,
      slackChannel,
      discordChannel
    });

    res.status(201).json({
      success: true,
      data: organization,
      message: 'Organization created successfully'
    });

  } catch (error) {
    console.error('Create Organization Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create organization',
      message: error.message
    });
  }
});

// Get organization dashboard
router.get('/:orgId/dashboard', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const organization = db.getOrganization(orgId);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    const stats = db.getOrganizationStats(orgId);
    const leaderboard = db.getOrganizationLeaderboard(orgId, 10);
    
    // Get recent achievements
    const recentAchievements = organization.contributors
      .map(contribId => db.getContributor(contribId))
      .filter(Boolean)
      .flatMap(contrib => contrib.achievements)
      .map(achId => db.achievements.get(achId))
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        organization,
        stats,
        leaderboard,
        recentAchievements
      }
    });

  } catch (error) {
    console.error('Get Organization Dashboard Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get organization dashboard',
      message: error.message
    });
  }
});

// Get organization contributors
router.get('/:orgId/contributors', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const organization = db.getOrganization(orgId);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    const contributors = organization.contributors
      .map(contribId => {
        const contrib = db.getContributor(contribId);
        if (!contrib) return null;
        
        const achievements = contrib.achievements
          .map(achId => db.achievements.get(achId))
          .filter(Boolean);
        
        const badges = contrib.badges
          .map(badgeId => db.badges.get(badgeId))
          .filter(Boolean);
        
        return {
          ...contrib,
          achievements,
          badges
        };
      })
      .filter(Boolean);

    res.json({
      success: true,
      data: contributors,
      total: contributors.length
    });

  } catch (error) {
    console.error('Get Contributors Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get contributors',
      message: error.message
    });
  }
});

// Add contributor to organization
router.post('/:orgId/contributors', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { githubId, username, name, avatar, githubUrl } = req.body;
    
    const organization = db.getOrganization(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    // Check if contributor already exists
    let contributor = Array.from(db.contributors.values())
      .find(contrib => contrib.githubId === githubId);
    
    if (!contributor) {
      contributor = db.createContributor({
        githubId,
        username,
        name,
        avatar,
        githubUrl
      });
    }

    // Add to organization
    db.addContributorToOrg(orgId, contributor.id);
    contributor.organizations.push(orgId);

    res.status(201).json({
      success: true,
      data: contributor,
      message: 'Contributor added to organization'
    });

  } catch (error) {
    console.error('Add Contributor Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add contributor',
      message: error.message
    });
  }
});

// Get contributor achievements
router.get('/:orgId/contributors/:contributorId/achievements', authenticateToken, async (req, res) => {
  try {
    const { orgId, contributorId } = req.params;
    
    const organization = db.getOrganization(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    const contributor = db.getContributor(contributorId);
    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: 'Contributor not found',
        message: 'Contributor does not exist'
      });
    }

    const achievements = db.getContributorAchievements(contributorId);
    const badges = contributor.badges
      .map(badgeId => db.badges.get(badgeId))
      .filter(Boolean);

    res.json({
      success: true,
      data: {
        contributor: {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar,
          stats: contributor.stats
        },
        achievements,
        badges
      }
    });

  } catch (error) {
    console.error('Get Contributor Achievements Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get contributor achievements',
      message: error.message
    });
  }
});

// Create time-bound task
router.post('/:orgId/tasks', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { contributorId, issueId, title, description, deadline, priority, points } = req.body;
    
    const organization = db.getOrganization(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    const task = db.createTimeBoundTask({
      contributorId,
      organizationId: orgId,
      issueId,
      title,
      description,
      deadline,
      priority,
      points
    });

    // Create notification
    db.createNotification({
      contributorId,
      organizationId: orgId,
      type: 'deadline',
      title: 'New Time-Bound Task Assigned',
      message: `You have been assigned a new task: ${title}. Deadline: ${new Date(deadline).toLocaleDateString()}`,
      data: { taskId: task.id, priority }
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Time-bound task created successfully'
    });

  } catch (error) {
    console.error('Create Task Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
      message: error.message
    });
  }
});

// Get organization leaderboard
router.get('/:orgId/leaderboard', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { limit = 10 } = req.query;
    
    const organization = db.getOrganization(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    const leaderboard = db.getOrganizationLeaderboard(orgId, parseInt(limit));

    res.json({
      success: true,
      data: leaderboard
    });

  } catch (error) {
    console.error('Get Leaderboard Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get leaderboard',
      message: error.message
    });
  }
});

// Get organization analytics
router.get('/:orgId/analytics', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { period = '30d' } = req.query;
    
    const organization = db.getOrganization(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    const stats = db.getOrganizationStats(orgId);
    const leaderboard = db.getOrganizationLeaderboard(orgId, 5);
    
    // Get overdue tasks
    const overdueTasks = db.getOverdueTasks()
      .filter(task => task.organizationId === orgId);

    res.json({
      success: true,
      data: {
        stats,
        leaderboard,
        overdueTasks,
        period
      }
    });

  } catch (error) {
    console.error('Get Analytics Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics',
      message: error.message
    });
  }
});

module.exports = router;

