// Rating calculation service for PRs and contributions
// Evaluates PRs based on priority, code amount, time, and relevance factors

class RatingCalculator {
  constructor() {
    // Weight factors for different rating components
    this.weights = {
      priority: 0.25,      // 25% - Priority level of the PR
      codeAmount: 0.20,    // 20% - Amount of code changed
      timeFactor: 0.20,    // 20% - Time-related factors (deadlines, speed)
      relevance: 0.15,     // 15% - Relevance to project goals
      quality: 0.10,       // 10% - Code quality indicators
      impact: 0.10         // 10% - Impact on the project
    };

    // Priority levels and their scores
    this.priorityScores = {
      'critical': 100,
      'high': 80,
      'medium': 60,
      'low': 40,
      'trivial': 20
    };

    // Code amount scoring thresholds
    this.codeAmountThresholds = {
      small: { min: 0, max: 50, score: 30 },
      medium: { min: 51, max: 200, score: 60 },
      large: { min: 201, max: 500, score: 80 },
      massive: { min: 501, max: Infinity, score: 100 }
    };

    // Time factor scoring
    this.timeFactorScores = {
      onTime: 100,        // Completed on time
      early: 120,         // Completed early (bonus)
      slightlyLate: 80,   // 1-3 days late
      moderatelyLate: 60, // 4-7 days late
      veryLate: 40,       // 8+ days late
      noDeadline: 50     // No specific deadline
    };
  }

  /**
   * Calculate overall rating for a PR
   * @param {Object} prData - PR data object
   * @returns {Object} Rating breakdown and total score
   */
  calculatePRRating(prData) {
    const {
      priority = 'medium',
      linesAdded = 0,
      linesDeleted = 0,
      filesChanged = 0,
      commits = 1,
      timeToComplete = null,
      deadline = null,
      relevanceScore = 50,
      qualityIndicators = {},
      impactScore = 50,
      createdAt,
      mergedAt,
      author,
      repository,
      title,
      description
    } = prData;

    // Calculate individual component scores
    const priorityScore = this.calculatePriorityScore(priority);
    const codeAmountScore = this.calculateCodeAmountScore(linesAdded, linesDeleted, filesChanged);
    const timeScore = this.calculateTimeScore(timeToComplete, deadline, createdAt, mergedAt);
    const relevanceScoreFinal = this.calculateRelevanceScore(relevanceScore, title, description);
    const qualityScore = this.calculateQualityScore(qualityIndicators);
    const impactScoreFinal = this.calculateImpactScore(impactScore, linesAdded, filesChanged);

    // Calculate weighted total
    const totalScore = Math.round(
      (priorityScore * this.weights.priority) +
      (codeAmountScore * this.weights.codeAmount) +
      (timeScore * this.weights.timeFactor) +
      (relevanceScoreFinal * this.weights.relevance) +
      (qualityScore * this.weights.quality) +
      (impactScoreFinal * this.weights.impact)
    );

    // Determine rating level
    const ratingLevel = this.getRatingLevel(totalScore);

    return {
      totalScore,
      ratingLevel,
      breakdown: {
        priority: {
          score: priorityScore,
          weight: this.weights.priority,
          weightedScore: Math.round(priorityScore * this.weights.priority)
        },
        codeAmount: {
          score: codeAmountScore,
          weight: this.weights.codeAmount,
          weightedScore: Math.round(codeAmountScore * this.weights.codeAmount)
        },
        timeFactor: {
          score: timeScore,
          weight: this.weights.timeFactor,
          weightedScore: Math.round(timeScore * this.weights.timeFactor)
        },
        relevance: {
          score: relevanceScoreFinal,
          weight: this.weights.relevance,
          weightedScore: Math.round(relevanceScoreFinal * this.weights.relevance)
        },
        quality: {
          score: qualityScore,
          weight: this.weights.quality,
          weightedScore: Math.round(qualityScore * this.weights.quality)
        },
        impact: {
          score: impactScoreFinal,
          weight: this.weights.impact,
          weightedScore: Math.round(impactScoreFinal * this.weights.impact)
        }
      },
      metadata: {
        linesAdded,
        linesDeleted,
        filesChanged,
        commits,
        timeToComplete,
        priority,
        author,
        repository
      }
    };
  }

  /**
   * Calculate priority score
   */
  calculatePriorityScore(priority) {
    return this.priorityScores[priority] || this.priorityScores.medium;
  }

  /**
   * Calculate code amount score based on lines changed
   */
  calculateCodeAmountScore(linesAdded, linesDeleted, filesChanged) {
    const totalLinesChanged = linesAdded + linesDeleted;
    
    // Base score from lines changed
    let baseScore = 0;
    for (const [size, config] of Object.entries(this.codeAmountThresholds)) {
      if (totalLinesChanged >= config.min && totalLinesChanged <= config.max) {
        baseScore = config.score;
        break;
      }
    }

    // Bonus for multiple files (complexity factor)
    const fileBonus = Math.min(filesChanged * 2, 20);
    
    // Bonus for significant changes
    const significantChangeBonus = totalLinesChanged > 100 ? 10 : 0;

    return Math.min(baseScore + fileBonus + significantChangeBonus, 100);
  }

  /**
   * Calculate time factor score
   */
  calculateTimeScore(timeToComplete, deadline, createdAt, mergedAt) {
    if (!timeToComplete && !deadline) {
      return this.timeFactorScores.noDeadline;
    }

    if (!mergedAt) {
      // PR not yet merged, calculate based on current time
      const now = new Date();
      const created = new Date(createdAt);
      const daysSinceCreation = (now - created) / (1000 * 60 * 60 * 24);
      
      if (deadline) {
        const deadlineDate = new Date(deadline);
        const daysUntilDeadline = (deadlineDate - created) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCreation <= daysUntilDeadline) {
          return this.timeFactorScores.onTime;
        } else {
          const daysLate = daysSinceCreation - daysUntilDeadline;
          if (daysLate <= 3) return this.timeFactorScores.slightlyLate;
          if (daysLate <= 7) return this.timeFactorScores.moderatelyLate;
          return this.timeFactorScores.veryLate;
        }
      }
      
      return this.timeFactorScores.noDeadline;
    }

    // PR is merged, calculate based on completion time
    const created = new Date(createdAt);
    const merged = new Date(mergedAt);
    const actualTimeToComplete = (merged - created) / (1000 * 60 * 60 * 24);

    if (deadline) {
      const deadlineDate = new Date(deadline);
      const expectedTimeToComplete = (deadlineDate - created) / (1000 * 60 * 60 * 24);
      
      if (actualTimeToComplete <= expectedTimeToComplete) {
        // Completed on time or early
        const timeRatio = actualTimeToComplete / expectedTimeToComplete;
        if (timeRatio <= 0.8) return this.timeFactorScores.early;
        return this.timeFactorScores.onTime;
      } else {
        // Completed late
        const daysLate = actualTimeToComplete - expectedTimeToComplete;
        if (daysLate <= 3) return this.timeFactorScores.slightlyLate;
        if (daysLate <= 7) return this.timeFactorScores.moderatelyLate;
        return this.timeFactorScores.veryLate;
      }
    }

    // No deadline, but has timeToComplete expectation
    if (timeToComplete) {
      const expectedDays = timeToComplete;
      const timeRatio = actualTimeToComplete / expectedDays;
      
      if (timeRatio <= 0.8) return this.timeFactorScores.early;
      if (timeRatio <= 1.2) return this.timeFactorScores.onTime;
      if (timeRatio <= 1.5) return this.timeFactorScores.slightlyLate;
      return this.timeFactorScores.moderatelyLate;
    }

    return this.timeFactorScores.noDeadline;
  }

  /**
   * Calculate relevance score
   */
  calculateRelevanceScore(baseRelevance, title, description) {
    let score = baseRelevance;

    // Analyze title and description for relevance keywords
    const text = `${title} ${description}`.toLowerCase();
    
    // Positive relevance indicators
    const positiveKeywords = [
      'bug fix', 'security', 'performance', 'optimization',
      'feature', 'enhancement', 'improvement', 'refactor',
      'critical', 'important', 'urgent', 'hotfix'
    ];

    // Negative relevance indicators
    const negativeKeywords = [
      'typo', 'formatting', 'whitespace', 'comment',
      'documentation', 'readme', 'chore', 'style'
    ];

    // Check for positive indicators
    const positiveMatches = positiveKeywords.filter(keyword => text.includes(keyword)).length;
    const negativeMatches = negativeKeywords.filter(keyword => text.includes(keyword)).length;

    // Adjust score based on keyword matches
    score += positiveMatches * 5;
    score -= negativeMatches * 3;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate quality score based on various indicators
   */
  calculateQualityScore(qualityIndicators) {
    const {
      hasTests = false,
      hasDocumentation = false,
      reviewComments = 0,
      ciPassed = true,
      codeCoverage = 0,
      complexity = 'medium'
    } = qualityIndicators;

    let score = 50; // Base score

    // Test coverage bonus
    if (hasTests) score += 15;
    if (codeCoverage > 80) score += 10;
    else if (codeCoverage > 60) score += 5;

    // Documentation bonus
    if (hasDocumentation) score += 10;

    // Review process bonus
    if (reviewComments > 0) score += 5;
    if (reviewComments > 3) score += 5;

    // CI status
    if (!ciPassed) score -= 20;

    // Complexity factor
    const complexityScores = {
      'low': 10,
      'medium': 0,
      'high': -5,
      'very-high': -10
    };
    score += complexityScores[complexity] || 0;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate impact score
   */
  calculateImpactScore(baseImpact, linesAdded, filesChanged) {
    let score = baseImpact;

    // Impact based on scope of changes
    if (linesAdded > 500) score += 10;
    if (filesChanged > 10) score += 5;
    if (linesAdded > 1000) score += 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get rating level based on total score
   */
  getRatingLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'very-good';
    if (score >= 70) return 'good';
    if (score >= 60) return 'satisfactory';
    if (score >= 50) return 'average';
    if (score >= 40) return 'below-average';
    return 'poor';
  }

  /**
   * Calculate contributor rating based on multiple PRs
   */
  calculateContributorRating(prRatings) {
    if (!prRatings || prRatings.length === 0) {
      return {
        averageScore: 0,
        totalPRs: 0,
        ratingLevel: 'no-data',
        breakdown: {}
      };
    }

    const totalScore = prRatings.reduce((sum, rating) => sum + rating.totalScore, 0);
    const averageScore = Math.round(totalScore / prRatings.length);
    const ratingLevel = this.getRatingLevel(averageScore);

    // Calculate breakdown by component
    const breakdown = {};
    const components = ['priority', 'codeAmount', 'timeFactor', 'relevance', 'quality', 'impact'];
    
    components.forEach(component => {
      const componentScores = prRatings.map(rating => rating.breakdown[component].score);
      const avgComponentScore = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;
      breakdown[component] = Math.round(avgComponentScore);
    });

    return {
      averageScore,
      totalPRs: prRatings.length,
      ratingLevel,
      breakdown,
      recentTrend: this.calculateTrend(prRatings)
    };
  }

  /**
   * Calculate trend in ratings over time
   */
  calculateTrend(prRatings) {
    if (prRatings.length < 2) return 'insufficient-data';

    const sortedRatings = prRatings.sort((a, b) => new Date(a.metadata.createdAt) - new Date(b.metadata.createdAt));
    const recent = sortedRatings.slice(-3); // Last 3 PRs
    const older = sortedRatings.slice(0, -3); // Earlier PRs

    if (older.length === 0) return 'insufficient-data';

    const recentAvg = recent.reduce((sum, r) => sum + r.totalScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.totalScore, 0) / older.length;

    const improvement = recentAvg - olderAvg;
    
    if (improvement > 10) return 'improving';
    if (improvement > 5) return 'slightly-improving';
    if (improvement < -10) return 'declining';
    if (improvement < -5) return 'slightly-declining';
    return 'stable';
  }

  /**
   * Get rating statistics for an organization
   */
  getOrganizationRatingStats(contributorRatings) {
    if (!contributorRatings || contributorRatings.length === 0) {
      return {
        averageRating: 0,
        totalContributors: 0,
        ratingDistribution: {},
        topPerformers: [],
        improvementAreas: []
      };
    }

    const ratings = contributorRatings.map(cr => cr.averageScore);
    const averageRating = Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length);

    // Rating distribution
    const distribution = {
      excellent: 0,
      'very-good': 0,
      good: 0,
      satisfactory: 0,
      average: 0,
      'below-average': 0,
      poor: 0
    };

    contributorRatings.forEach(cr => {
      distribution[cr.ratingLevel] = (distribution[cr.ratingLevel] || 0) + 1;
    });

    // Top performers (top 20%)
    const sortedContributors = contributorRatings
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, Math.ceil(contributorRatings.length * 0.2));

    // Identify improvement areas
    const improvementAreas = [];
    const componentAverages = {};

    ['priority', 'codeAmount', 'timeFactor', 'relevance', 'quality', 'impact'].forEach(component => {
      const componentScores = contributorRatings.map(cr => cr.breakdown[component]);
      const avg = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;
      componentAverages[component] = Math.round(avg);
      
      if (avg < 60) {
        improvementAreas.push({
          component,
          averageScore: Math.round(avg),
          description: this.getImprovementDescription(component)
        });
      }
    });

    return {
      averageRating,
      totalContributors: contributorRatings.length,
      ratingDistribution: distribution,
      topPerformers: sortedContributors,
      improvementAreas,
      componentAverages
    };
  }

  /**
   * Get improvement description for a component
   */
  getImprovementDescription(component) {
    const descriptions = {
      priority: 'Focus on higher priority tasks and better task prioritization',
      codeAmount: 'Encourage more substantial contributions and meaningful changes',
      timeFactor: 'Improve time management and deadline adherence',
      relevance: 'Better alignment with project goals and objectives',
      quality: 'Enhance code quality, testing, and documentation',
      impact: 'Increase the impact and scope of contributions'
    };
    
    return descriptions[component] || 'General improvement needed';
  }
}

module.exports = new RatingCalculator();
