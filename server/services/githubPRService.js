const axios = require('axios');
const ratingCalculator = require('../lib/ratingCalculator');
const db = require('../lib/database');

class GitHubPRService {
  constructor() {
    this.githubAPIBase = 'https://api.github.com';
  }

  /**
   * Fetch PRs for a user from their repositories
   */
  async fetchUserPRs(username, token = null) {
    try {
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PRAISE-API'
      };
      
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }

      // Get user's repositories
      const reposResponse = await axios.get(
        `${this.githubAPIBase}/users/${username}/repos?sort=updated&per_page=100`,
        { headers }
      );

      const repos = reposResponse.data;
      const allPRs = [];

      // Fetch PRs from each repository with rate limiting
      for (const repo of repos.slice(0, 5)) { // Limit to 5 most recent repos to avoid rate limits
        try {
          // Add delay between requests to respect rate limits
          if (allPRs.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          }

          const prsResponse = await axios.get(
            `${this.githubAPIBase}/repos/${repo.full_name}/pulls?state=all&per_page=20&sort=updated`,
            { 
              headers,
              timeout: 10000 // 10 second timeout
            }
          );

          const prs = prsResponse.data.filter(pr => 
            pr.user.login === username // Only PRs authored by the user
          );

          // Enrich PR data with repository info
          const enrichedPRs = prs.map(pr => ({
            ...pr,
            repository: repo.full_name,
            repositoryData: {
              name: repo.name,
              fullName: repo.full_name,
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count
            }
          }));

          allPRs.push(...enrichedPRs);
          console.log(`Fetched ${prs.length} PRs from ${repo.full_name}`);
        } catch (error) {
          if (error.response?.status === 403) {
            console.warn(`Rate limited or access denied for ${repo.full_name}. Skipping...`);
          } else {
            console.warn(`Failed to fetch PRs from ${repo.full_name}:`, error.message);
          }
        }
      }

      return allPRs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('Error fetching user PRs:', error.message);
      throw error;
    }
  }

  /**
   * Analyze PR data and extract rating parameters
   */
  analyzePRForRating(pr) {
    const {
      title,
      body,
      created_at,
      merged_at,
      closed_at,
      commits,
      additions,
      deletions,
      changed_files,
      user,
      repository,
      repositoryData
    } = pr;

    // Calculate priority based on title and labels
    const priority = this.determinePriority(title, body, pr.labels);
    
    // Calculate relevance score based on content analysis
    const relevanceScore = this.calculateRelevanceScore(title, body);
    
    // Calculate quality indicators
    const qualityIndicators = this.analyzeQualityIndicators(pr);
    
    // Calculate impact score
    const impactScore = this.calculateImpactScore(additions, deletions, changed_files, repositoryData);
    
    // Calculate time to complete
    const timeToComplete = this.calculateTimeToComplete(created_at, merged_at, closed_at);

    return {
      prId: pr.id.toString(),
      priority,
      linesAdded: additions || 0,
      linesDeleted: deletions || 0,
      filesChanged: changed_files || 0,
      commits: commits || 1,
      timeToComplete,
      deadline: null, // GitHub doesn't provide deadlines
      relevanceScore,
      qualityIndicators,
      impactScore,
      createdAt: created_at,
      mergedAt: merged_at,
      author: user.login,
      repository: repository,
      title,
      description: body || '',
      contributorId: user.id.toString(),
      organizationId: this.extractOrganizationId(repository)
    };
  }

  /**
   * Determine priority based on PR title, body, and labels
   */
  determinePriority(title, body, labels = []) {
    const text = `${title} ${body}`.toLowerCase();
    const labelNames = labels.map(label => label.name.toLowerCase());

    // Critical indicators
    if (text.includes('critical') || text.includes('urgent') || text.includes('hotfix') ||
        labelNames.includes('critical') || labelNames.includes('urgent')) {
      return 'critical';
    }

    // High priority indicators
    if (text.includes('security') || text.includes('bug') || text.includes('fix') ||
        text.includes('performance') || text.includes('optimization') ||
        labelNames.includes('bug') || labelNames.includes('security')) {
      return 'high';
    }

    // Low priority indicators
    if (text.includes('chore') || text.includes('style') || text.includes('format') ||
        text.includes('typo') || text.includes('documentation') ||
        labelNames.includes('chore') || labelNames.includes('documentation')) {
      return 'low';
    }

    // Trivial indicators
    if (text.includes('whitespace') || text.includes('comment') ||
        labelNames.includes('trivial')) {
      return 'trivial';
    }

    return 'medium'; // Default
  }

  /**
   * Calculate relevance score based on content analysis
   */
  calculateRelevanceScore(title, body) {
    const text = `${title} ${body}`.toLowerCase();
    let score = 50; // Base score

    // Positive relevance indicators
    const positiveKeywords = [
      'feature', 'enhancement', 'improvement', 'optimization',
      'performance', 'security', 'bug fix', 'refactor',
      'api', 'integration', 'authentication', 'database'
    ];

    // Negative relevance indicators
    const negativeKeywords = [
      'typo', 'formatting', 'whitespace', 'comment only',
      'readme', 'changelog', 'version bump'
    ];

    // Check for positive indicators
    const positiveMatches = positiveKeywords.filter(keyword => text.includes(keyword));
    score += positiveMatches.length * 8;

    // Check for negative indicators
    const negativeMatches = negativeKeywords.filter(keyword => text.includes(keyword));
    score -= negativeMatches.length * 5;

    // Bonus for detailed descriptions
    if (body && body.length > 200) {
      score += 10;
    }

    // Bonus for issue references
    if (text.includes('#') || text.includes('issue') || text.includes('fixes')) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Analyze quality indicators from PR data
   */
  analyzeQualityIndicators(pr) {
    const body = (pr.body || '').toLowerCase();
    
    return {
      hasTests: body.includes('test') || body.includes('spec'),
      hasDocumentation: body.includes('doc') || body.includes('readme') || body.includes('comment'),
      reviewComments: pr.review_comments || 0,
      ciPassed: pr.mergeable !== false, // GitHub doesn't always provide CI status
      codeCoverage: 0, // Would need additional API calls to get this
      complexity: this.estimateComplexity(pr.additions, pr.deletions, pr.changed_files)
    };
  }

  /**
   * Estimate code complexity based on changes
   */
  estimateComplexity(additions, deletions, filesChanged) {
    const totalChanges = (additions || 0) + (deletions || 0);
    
    if (totalChanges < 50) return 'low';
    if (totalChanges < 200) return 'medium';
    if (totalChanges < 500) return 'high';
    return 'very-high';
  }

  /**
   * Calculate impact score based on changes and repository importance
   */
  calculateImpactScore(additions, deletions, filesChanged, repositoryData) {
    let score = 50; // Base score

    const totalLines = (additions || 0) + (deletions || 0);
    
    // Impact based on scope of changes
    if (totalLines > 500) score += 20;
    else if (totalLines > 200) score += 15;
    else if (totalLines > 100) score += 10;
    else if (totalLines > 50) score += 5;

    if (filesChanged > 10) score += 10;
    else if (filesChanged > 5) score += 5;

    // Repository importance factor
    if (repositoryData) {
      const stars = repositoryData.stars || 0;
      const forks = repositoryData.forks || 0;
      
      if (stars > 100 || forks > 50) score += 10;
      else if (stars > 50 || forks > 20) score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate time to complete in days
   */
  calculateTimeToComplete(createdAt, mergedAt, closedAt) {
    if (!mergedAt && !closedAt) {
      return null; // PR is still open
    }

    const created = new Date(createdAt);
    const completed = new Date(mergedAt || closedAt);
    const timeDiff = completed - created;
    
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
  }

  /**
   * Extract organization ID from repository full name
   */
  extractOrganizationId(repository) {
    // For now, create a simple org ID from the repository owner
    const owner = repository.split('/')[0];
    return `org_${owner}`;
  }

  /**
   * Generate ratings for all user PRs
   */
  async generateRatingsForUser(username, githubToken = null) {
    try {
      console.log(`Generating ratings for user: ${username}`);
      
      if (!githubToken) {
        throw new Error('GitHub token is required to generate ratings');
      }
      
      // Fetch user's PRs
      const prs = await this.fetchUserPRs(username, githubToken);
      console.log(`Found ${prs.length} PRs for ${username}`);

      if (prs.length === 0) {
        console.log(`No PRs found for ${username}. Creating sample rating for demonstration.`);
        // Create a sample rating for users with no PRs
        const sampleRating = this.createSampleRating(username);
        if (sampleRating) {
          return [sampleRating];
        }
        return [];
      }

      const ratings = [];
      
      for (const pr of prs.slice(0, 20)) { // Limit to 20 most recent PRs
        try {
          // Analyze PR for rating parameters
          const ratingParams = this.analyzePRForRating(pr);
          
          // Calculate rating using the rating calculator
          const rating = ratingCalculator.calculatePRRating(ratingParams);
          
          // Create rating record
          const ratingRecord = {
            id: `rating_${pr.id}_${Date.now()}`,
            prId: ratingParams.prId,
            contributorId: ratingParams.contributorId,
            organizationId: ratingParams.organizationId,
            rating,
            createdAt: new Date().toISOString(),
            metadata: ratingParams,
            githubData: {
              prUrl: pr.html_url,
              prNumber: pr.number,
              repository: pr.repository,
              author: pr.user.login,
              avatar: pr.user.avatar_url
            }
          };

          ratings.push(ratingRecord);
        } catch (error) {
          console.warn(`Failed to generate rating for PR ${pr.id}:`, error.message);
        }
      }

      // Store ratings in database
      if (!db.ratings) {
        db.ratings = new Map();
      }

      ratings.forEach(rating => {
        db.ratings.set(rating.id, rating);
      });

      // Update user's rating history
      const userId = prs[0]?.user.id.toString();
      if (userId && ratings.length > 0) {
        let user = db.getContributor(userId);
        if (!user) {
          // Create user if doesn't exist
          user = {
            id: userId,
            username: username,
            name: prs[0].user.login,
            avatar: prs[0].user.avatar_url,
            ratings: [],
            stats: {}
          };
          db.setContributor(userId, user);
        }

        // Add new ratings to user's history
        if (!user.ratings) {
          user.ratings = [];
        }
        
        const newRatingIds = ratings.map(r => r.id);
        user.ratings.push(...newRatingIds.filter(id => !user.ratings.includes(id)));

        // Update user's overall rating
        const allRatings = user.ratings
          .map(ratingId => db.ratings.get(ratingId))
          .filter(Boolean)
          .map(rating => rating.rating);

        if (allRatings.length > 0) {
          const contributorRating = ratingCalculator.calculateContributorRating(allRatings);
          user.stats.averageRating = contributorRating.averageScore;
          user.stats.ratingLevel = contributorRating.ratingLevel;
          user.stats.totalPRs = contributorRating.totalPRs;
          user.stats.ratingBreakdown = contributorRating.breakdown;
        }
      }

      console.log(`Generated ${ratings.length} ratings for ${username}`);
      return ratings;
    } catch (error) {
      console.error(`Error generating ratings for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Create a sample rating for demonstration purposes
   */
  createSampleRating(username) {
    try {
      const samplePRData = {
        prId: `sample_${Date.now()}`,
        priority: 'medium',
        linesAdded: 50,
        linesDeleted: 10,
        filesChanged: 2,
        commits: 1,
        timeToComplete: 3,
        deadline: null,
        relevanceScore: 75,
        qualityIndicators: {
          hasTests: true,
          hasDocumentation: false,
          reviewComments: 1,
          ciPassed: true,
          codeCoverage: 70,
          complexity: 'medium'
        },
        impactScore: 65,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        mergedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        author: username,
        repository: `${username}/sample-repo`,
        title: 'Sample PR for Rating Demo',
        description: 'This is a sample PR created for demonstration purposes',
        contributorId: username,
        organizationId: `org_${username}`
      };

      const rating = ratingCalculator.calculatePRRating(samplePRData);
      
      const ratingRecord = {
        id: `sample_rating_${Date.now()}`,
        prId: samplePRData.prId,
        contributorId: samplePRData.contributorId,
        organizationId: samplePRData.organizationId,
        rating,
        createdAt: new Date().toISOString(),
        metadata: samplePRData,
        githubData: {
          prUrl: `https://github.com/${username}/sample-repo/pull/1`,
          prNumber: 1,
          repository: samplePRData.repository,
          author: username,
          avatar: `https://github.com/${username}.png`
        }
      };

      return ratingRecord;
    } catch (error) {
      console.error('Error creating sample rating:', error.message);
      return null;
    }
  }

  /**
   * Get user's rating summary
   */
  getUserRatingSummary(username) {
    const userId = db.findContributorByUsername(username);
    if (!userId) {
      return null;
    }

    const user = db.getContributor(userId);
    if (!user || !user.ratings) {
      return null;
    }

    const allRatings = user.ratings
      .map(ratingId => db.ratings.get(ratingId))
      .filter(Boolean)
      .map(rating => rating.rating);

    if (allRatings.length === 0) {
      return null;
    }

    return ratingCalculator.calculateContributorRating(allRatings);
  }
}

module.exports = new GitHubPRService();
