const express = require('express');
const router = express.Router();
const db = require('../lib/database');
const { authenticateToken } = require('../middleware/auth');

// Get all available badges
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const badges = Array.from(db.badges.values());
    
    res.json({
      success: true,
      data: badges
    });

  } catch (error) {
    console.error('Get Badges Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get badges',
      message: error.message
    });
  }
});

// Award badge to contributor
router.post('/badges/:badgeId/award', authenticateToken, async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { contributorId, organizationId } = req.body;
    
    const badge = db.badges.get(badgeId);
    if (!badge) {
      return res.status(404).json({
        success: false,
        error: 'Badge not found',
        message: 'Badge does not exist'
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

    const awarded = db.awardBadge(contributorId, badgeId);
    
    if (awarded) {
      // Create notification
      db.createNotification({
        contributorId,
        organizationId,
        type: 'achievement',
        title: `Badge Earned: ${badge.name}`,
        message: badge.description,
        data: { badgeId, points: badge.points }
      });

      res.json({
        success: true,
        data: {
          badge,
          contributor: {
            id: contributor.id,
            username: contributor.username,
            stats: contributor.stats
          }
        },
        message: 'Badge awarded successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Badge already awarded',
        message: 'Contributor already has this badge'
      });
    }

  } catch (error) {
    console.error('Award Badge Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to award badge',
      message: error.message
    });
  }
});

// Check and award badges based on contributor stats
router.post('/check-badges/:contributorId', authenticateToken, async (req, res) => {
  try {
    const { contributorId } = req.params;
    const { organizationId } = req.body;
    
    const contributor = db.getContributor(contributorId);
    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: 'Contributor not found',
        message: 'Contributor does not exist'
      });
    }

    const awardedBadges = [];
    const badges = Array.from(db.badges.values());
    
    for (const badge of badges) {
      // Skip if already has badge
      if (contributor.badges.includes(badge.id)) continue;
      
      let shouldAward = false;
      
      // Check requirements
      if (badge.requirements.prs && contributor.stats.totalPRs >= badge.requirements.prs) {
        shouldAward = true;
      }
      
      if (badge.requirements.issues && contributor.stats.totalIssues >= badge.requirements.issues) {
        shouldAward = true;
      }
      
      if (badge.requirements.streak && contributor.stats.streak >= badge.requirements.streak) {
        shouldAward = true;
      }
      
      if (badge.requirements.days) {
        const daysSinceJoin = (new Date() - new Date(contributor.stats.joinDate)) / (1000 * 60 * 60 * 24);
        if (daysSinceJoin >= badge.requirements.days) {
          shouldAward = true;
        }
      }
      
      if (shouldAward) {
        const awarded = db.awardBadge(contributorId, badge.id);
        if (awarded) {
          awardedBadges.push(badge);
          
          // Create notification
          db.createNotification({
            contributorId,
            organizationId,
            type: 'achievement',
            title: `Badge Earned: ${badge.name}`,
            message: badge.description,
            data: { badgeId: badge.id, points: badge.points }
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        awardedBadges,
        contributor: {
          id: contributor.id,
          username: contributor.username,
          stats: contributor.stats,
          badges: contributor.badges.map(badgeId => db.badges.get(badgeId)).filter(Boolean)
        }
      },
      message: `Checked badges and awarded ${awardedBadges.length} new badges`
    });

  } catch (error) {
    console.error('Check Badges Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to check badges',
      message: error.message
    });
  }
});

// Create custom achievement
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { contributorId, organizationId, type, title, description, points, metadata } = req.body;
    
    const achievement = db.createAchievement({
      contributorId,
      organizationId,
      type,
      title,
      description,
      points,
      metadata
    });

    // Create notification
    db.createNotification({
      contributorId,
      organizationId,
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: title,
      data: { achievementId: achievement.id, points }
    });

    res.status(201).json({
      success: true,
      data: achievement,
      message: 'Achievement created successfully'
    });

  } catch (error) {
    console.error('Create Achievement Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create achievement',
      message: error.message
    });
  }
});

// Get contributor's achievements
router.get('/contributor/:contributorId', authenticateToken, async (req, res) => {
  try {
    const { contributorId } = req.params;
    
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

    // Group achievements by type
    const achievementsByType = achievements.reduce((acc, achievement) => {
      if (!acc[achievement.type]) {
        acc[achievement.type] = [];
      }
      acc[achievement.type].push(achievement);
      return acc;
    }, {});

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
        badges,
        achievementsByType,
        totalPoints: contributor.stats.points,
        level: contributor.stats.level
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

// Get milestone celebrations
router.get('/milestones/:orgId', authenticateToken, async (req, res) => {
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

    const contributors = organization.contributors
      .map(contribId => db.getContributor(contribId))
      .filter(Boolean);

    const milestones = [];
    const now = new Date();
    
    contributors.forEach(contributor => {
      // Check for anniversary milestones
      const joinDate = new Date(contributor.stats.joinDate);
      const yearsSinceJoin = (now - joinDate) / (1000 * 60 * 60 * 24 * 365);
      
      if (yearsSinceJoin >= 1 && yearsSinceJoin < 1.1) {
        milestones.push({
          type: 'anniversary',
          contributor: {
            id: contributor.id,
            username: contributor.username,
            name: contributor.name,
            avatar: contributor.avatar
          },
          title: '1 Year Anniversary!',
          description: `${contributor.username} has been contributing for 1 year!`,
          date: joinDate,
          points: 500
        });
      }
      
      // Check for PR milestones
      if (contributor.stats.totalPRs === 25) {
        milestones.push({
          type: 'pr_milestone',
          contributor: {
            id: contributor.id,
            username: contributor.username,
            name: contributor.name,
            avatar: contributor.avatar
          },
          title: '25 PRs Merged!',
          description: `${contributor.username} has merged 25 pull requests!`,
          date: now,
          points: 250
        });
      }
      
      // Check for level milestones
      if (contributor.stats.level >= 5) {
        milestones.push({
          type: 'level_milestone',
          contributor: {
            id: contributor.id,
            username: contributor.username,
            name: contributor.name,
            avatar: contributor.avatar
          },
          title: `Level ${contributor.stats.level} Achieved!`,
          description: `${contributor.username} has reached level ${contributor.stats.level}!`,
          date: now,
          points: contributor.stats.points
        });
      }
    });

    // Sort by date (most recent first)
    milestones.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        milestones,
        total: milestones.length,
        period
      }
    });

  } catch (error) {
    console.error('Get Milestones Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get milestones',
      message: error.message
    });
  }
});

module.exports = router;

