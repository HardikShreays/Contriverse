const express = require('express');
const router = express.Router();
const ratingCalculator = require('../lib/ratingCalculator');
const db = require('../lib/database');
const { authenticateToken } = require('../middleware/auth');

// Rate a specific PR
router.post('/rate-pr', authenticateToken, async (req, res) => {
  try {
    const {
      prId,
      priority,
      linesAdded,
      linesDeleted,
      filesChanged,
      commits,
      timeToComplete,
      deadline,
      relevanceScore,
      qualityIndicators,
      impactScore,
      createdAt,
      mergedAt,
      author,
      repository,
      title,
      description,
      contributorId,
      organizationId
    } = req.body;

    // Validate required fields
    if (!prId || !contributorId || !organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'prId, contributorId, and organizationId are required'
      });
    }

    // Calculate rating
    const rating = ratingCalculator.calculatePRRating({
      priority,
      linesAdded,
      linesDeleted,
      filesChanged,
      commits,
      timeToComplete,
      deadline,
      relevanceScore,
      qualityIndicators,
      impactScore,
      createdAt,
      mergedAt,
      author,
      repository,
      title,
      description
    });

    // Store rating in database
    const ratingRecord = {
      id: `rating_${Date.now()}`,
      prId,
      contributorId,
      organizationId,
      rating,
      createdAt: new Date().toISOString(),
      metadata: {
        priority,
        linesAdded,
        linesDeleted,
        filesChanged,
        commits,
        timeToComplete,
        deadline,
        relevanceScore,
        qualityIndicators,
        impactScore,
        author,
        repository,
        title,
        description
      }
    };

    // Store in database (you might want to add this to your database schema)
    if (!db.ratings) {
      db.ratings = new Map();
    }
    db.ratings.set(ratingRecord.id, ratingRecord);

    // Update contributor stats
    const contributor = db.getContributor(contributorId);
    if (contributor) {
      // Add rating to contributor's rating history
      if (!contributor.ratings) {
        contributor.ratings = [];
      }
      contributor.ratings.push(ratingRecord.id);

      // Update contributor's average rating
      const allRatings = contributor.ratings.map(ratingId => db.ratings.get(ratingId)).filter(Boolean);
      const contributorRating = ratingCalculator.calculateContributorRating(allRatings);
      
      contributor.stats.averageRating = contributorRating.averageScore;
      contributor.stats.ratingLevel = contributorRating.ratingLevel;
    }

    // Create notification for high ratings
    if (rating.totalScore >= 80) {
      db.createNotification({
        contributorId,
        organizationId,
        type: 'achievement',
        title: 'Excellent PR Rating!',
        message: `Your PR received a ${rating.ratingLevel} rating (${rating.totalScore}/100)`,
        data: { 
          ratingId: ratingRecord.id,
          score: rating.totalScore,
          level: rating.ratingLevel
        }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        rating: ratingRecord,
        breakdown: rating.breakdown,
        ratingLevel: rating.ratingLevel,
        totalScore: rating.totalScore
      },
      message: 'PR rated successfully'
    });

  } catch (error) {
    console.error('Rate PR Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to rate PR',
      message: error.message
    });
  }
});

// Get contributor's rating history
router.get('/contributor/:contributorId', authenticateToken, async (req, res) => {
  try {
    const { contributorId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const contributor = db.getContributor(contributorId);
    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: 'Contributor not found',
        message: 'Contributor does not exist'
      });
    }

    // Get rating history
    const ratingIds = contributor.ratings || [];
    const ratings = ratingIds
      .map(ratingId => db.ratings.get(ratingId))
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + parseInt(limit));

    // Calculate overall contributor rating
    const allRatings = ratingIds
      .map(ratingId => db.ratings.get(ratingId))
      .filter(Boolean)
      .map(rating => rating.rating);

    const contributorRating = ratingCalculator.calculateContributorRating(allRatings);

    res.json({
      success: true,
      data: {
        contributor: {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar
        },
        overallRating: contributorRating,
        recentRatings: ratings,
        totalRatings: ratingIds.length
      }
    });

  } catch (error) {
    console.error('Get Contributor Ratings Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get contributor ratings',
      message: error.message
    });
  }
});

// Get organization rating statistics
router.get('/organization/:orgId', authenticateToken, async (req, res) => {
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

    // Get all contributors and their ratings
    const contributors = organization.contributors
      .map(contribId => db.getContributor(contribId))
      .filter(Boolean);

    const contributorRatings = contributors.map(contributor => {
      const ratingIds = contributor.ratings || [];
      const ratings = ratingIds
        .map(ratingId => db.ratings.get(ratingId))
        .filter(Boolean)
        .map(rating => rating.rating);

      return {
        contributorId: contributor.id,
        username: contributor.username,
        name: contributor.name,
        avatar: contributor.avatar,
        ...ratingCalculator.calculateContributorRating(ratings)
      };
    });

    // Get organization statistics
    const orgStats = ratingCalculator.getOrganizationRatingStats(contributorRatings);

    res.json({
      success: true,
      data: {
        organization: {
          id: organization.id,
          name: organization.name,
          githubOrg: organization.githubOrg
        },
        statistics: orgStats,
        contributors: contributorRatings
      }
    });

  } catch (error) {
    console.error('Get Organization Ratings Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get organization ratings',
      message: error.message
    });
  }
});

// Get rating leaderboard for organization
router.get('/leaderboard/:orgId', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { limit = 10, period = '30d' } = req.query;

    const organization = db.getOrganization(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    // Get contributors with their ratings
    const contributors = organization.contributors
      .map(contribId => db.getContributor(contribId))
      .filter(Boolean);

    const leaderboard = contributors.map(contributor => {
      const ratingIds = contributor.ratings || [];
      const ratings = ratingIds
        .map(ratingId => db.ratings.get(ratingId))
        .filter(Boolean)
        .map(rating => rating.rating);

      const contributorRating = ratingCalculator.calculateContributorRating(ratings);

      return {
        rank: 0, // Will be set after sorting
        contributor: {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar
        },
        rating: contributorRating,
        stats: contributor.stats
      };
    })
    .filter(item => item.rating.totalPRs > 0) // Only include contributors with ratings
    .sort((a, b) => b.rating.averageScore - a.rating.averageScore)
    .slice(0, parseInt(limit))
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        period,
        total: leaderboard.length
      }
    });

  } catch (error) {
    console.error('Get Rating Leaderboard Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get rating leaderboard',
      message: error.message
    });
  }
});

// Get rating analytics and insights
router.get('/analytics/:orgId', authenticateToken, async (req, res) => {
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

    // Get all ratings for the organization
    const allRatings = Array.from(db.ratings?.values() || [])
      .filter(rating => rating.organizationId === orgId);

    // Calculate analytics
    const analytics = {
      totalRatings: allRatings.length,
      averageRating: 0,
      ratingDistribution: {},
      componentAnalysis: {},
      trends: {},
      insights: []
    };

    if (allRatings.length > 0) {
      // Calculate average rating
      const totalScore = allRatings.reduce((sum, rating) => sum + rating.rating.totalScore, 0);
      analytics.averageRating = Math.round(totalScore / allRatings.length);

      // Rating distribution
      allRatings.forEach(rating => {
        const level = rating.rating.ratingLevel;
        analytics.ratingDistribution[level] = (analytics.ratingDistribution[level] || 0) + 1;
      });

      // Component analysis
      const components = ['priority', 'codeAmount', 'timeFactor', 'relevance', 'quality', 'impact'];
      components.forEach(component => {
        const componentScores = allRatings.map(rating => rating.rating.breakdown[component].score);
        const avgScore = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;
        analytics.componentAnalysis[component] = Math.round(avgScore);
      });

      // Generate insights
      analytics.insights = generateInsights(analytics);
    }

    res.json({
      success: true,
      data: {
        organization: {
          id: organization.id,
          name: organization.name
        },
        analytics,
        period
      }
    });

  } catch (error) {
    console.error('Get Rating Analytics Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get rating analytics',
      message: error.message
    });
  }
});

// Helper function to generate insights
function generateInsights(analytics) {
  const insights = [];

  // Component insights
  const components = analytics.componentAnalysis;
  const lowestComponent = Object.entries(components)
    .sort(([,a], [,b]) => a - b)[0];

  if (lowestComponent && lowestComponent[1] < 60) {
    insights.push({
      type: 'improvement',
      title: 'Focus Area Identified',
      message: `${lowestComponent[0]} scores are below average (${lowestComponent[1]}/100). Consider providing training or resources in this area.`,
      priority: 'high'
    });
  }

  // Rating distribution insights
  const distribution = analytics.ratingDistribution;
  const excellentCount = distribution.excellent || 0;
  const totalRatings = analytics.totalRatings;
  const excellentPercentage = (excellentCount / totalRatings) * 100;

  if (excellentPercentage > 30) {
    insights.push({
      type: 'positive',
      title: 'High Quality Contributions',
      message: `${excellentPercentage.toFixed(1)}% of contributions are rated as excellent. Great job!`,
      priority: 'low'
    });
  } else if (excellentPercentage < 10) {
    insights.push({
      type: 'improvement',
      title: 'Quality Improvement Needed',
      message: `Only ${excellentPercentage.toFixed(1)}% of contributions are rated as excellent. Consider reviewing processes and providing feedback.`,
      priority: 'high'
    });
  }

  // Average rating insights
  if (analytics.averageRating >= 80) {
    insights.push({
      type: 'positive',
      title: 'Strong Performance',
      message: `Organization average rating is ${analytics.averageRating}/100. Excellent work!`,
      priority: 'low'
    });
  } else if (analytics.averageRating < 60) {
    insights.push({
      type: 'improvement',
      title: 'Performance Improvement Needed',
      message: `Organization average rating is ${analytics.averageRating}/100. Consider implementing improvement strategies.`,
      priority: 'high'
    });
  }

  return insights;
}

// Update rating weights (admin only)
router.put('/weights', authenticateToken, async (req, res) => {
  try {
    const { weights } = req.body;

    // Validate weights
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return res.status(400).json({
        success: false,
        error: 'Invalid weights',
        message: 'Weights must sum to 1.0'
      });
    }

    // Update weights in rating calculator
    Object.assign(ratingCalculator.weights, weights);

    res.json({
      success: true,
      data: { weights: ratingCalculator.weights },
      message: 'Rating weights updated successfully'
    });

  } catch (error) {
    console.error('Update Weights Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update weights',
      message: error.message
    });
  }
});

// Get current rating configuration
router.get('/config', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        weights: ratingCalculator.weights,
        priorityScores: ratingCalculator.priorityScores,
        codeAmountThresholds: ratingCalculator.codeAmountThresholds,
        timeFactorScores: ratingCalculator.timeFactorScores
      }
    });

  } catch (error) {
    console.error('Get Config Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get configuration',
      message: error.message
    });
  }
});

module.exports = router;
