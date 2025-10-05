const express = require('express');
const router = express.Router();
const db = require('../lib/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Get contributor stats for GitHub README
router.get('/stats/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { format = 'svg', theme = 'default', show_badges = 'true', show_stats = 'true' } = req.query;
    
    // Find contributor by username
    let contributor = Array.from(db.contributors.values())
      .find(contrib => contrib.username === username);
    
    // If contributor doesn't exist, create one from GitHub data
    if (!contributor) {
      try {
        // Fetch GitHub profile data
        const axios = require('axios');
        const githubResponse = await axios.get(`https://api.github.com/users/${username}`, {
          headers: {
            'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Contriverse-API'
          }
        });
        
        const githubProfile = githubResponse.data;
        
        // Create contributor from GitHub data
        contributor = db.createContributor({
          githubId: githubProfile.id,
          username: githubProfile.login,
          name: githubProfile.name || githubProfile.login,
          avatar: githubProfile.avatar_url,
          githubUrl: githubProfile.html_url
        });
        
        // Initialize with some basic stats from GitHub
        db.updateContributorStats(contributor.id, {
          totalStars: githubProfile.public_repos * 2, // Estimate
          activeDays: Math.floor((new Date() - new Date(githubProfile.created_at)) / (1000 * 60 * 60 * 24)),
          joinDate: githubProfile.created_at
        });
        
        // Award some basic badges based on GitHub stats
        if (githubProfile.public_repos > 0) {
          db.awardBadge(contributor.id, 'first-pr');
        }
        if (githubProfile.public_repos > 10) {
          db.awardBadge(contributor.id, 'code-warrior');
        }
        if (githubProfile.followers > 10) {
          db.awardBadge(contributor.id, 'issue-solver');
        }
        
      } catch (githubError) {
        return res.status(404).json({
          success: false,
          error: 'GitHub user not found',
          message: 'User does not exist on GitHub'
        });
      }
    }

    const badges = contributor.badges
      .map(badgeId => db.badges.get(badgeId))
      .filter(Boolean);

    const achievements = db.getContributorAchievements(contributor.id);

    if (format === 'svg') {
      // Generate SVG stats card
      const svg = generateStatsSVG(contributor, badges, achievements, theme);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(svg);
    }

    // Return JSON data
    res.json({
      success: true,
      data: {
        contributor: {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar,
          githubUrl: contributor.githubUrl
        },
        stats: contributor.stats,
        badges: badges.map(badge => ({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          color: badge.color,
          points: badge.points
        })),
        achievements: achievements.map(achievement => ({
          id: achievement.id,
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          points: achievement.points,
          createdAt: achievement.createdAt
        })),
        organizations: contributor.organizations.map(orgId => {
          const org = db.getOrganization(orgId);
          return org ? {
            id: org.id,
            name: org.name,
            githubOrg: org.githubOrg
          } : null;
        }).filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Get GitHub README Stats Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get stats',
      message: error.message
    });
  }
});

// Generate SVG stats card
function generateStatsSVG(contributor, badges, achievements, theme) {
  const colors = getThemeColors(theme);
  const stats = contributor.stats;
  
  // Calculate badge display
  const badgeDisplay = badges.slice(0, 6).map(badge => badge.icon).join(' ');
  
  // Calculate level progress
  const levelProgress = calculateLevelProgress(stats.points);
  
  const svg = `
    <svg width="495" height="195" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="495" height="195" fill="${colors.background}" rx="8"/>
      
      <!-- Header -->
      <rect width="495" height="40" fill="url(#gradient)" rx="8"/>
      <text x="20" y="25" fill="${colors.text}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        ${contributor.username}'s Contribution Stats
      </text>
      
      <!-- Avatar -->
      <circle cx="60" cy="80" r="25" fill="${colors.accent}"/>
      <text x="60" y="87" text-anchor="middle" fill="${colors.text}" font-family="Arial, sans-serif" font-size="20" font-weight="bold">
        ${contributor.username.charAt(0).toUpperCase()}
      </text>
      
      <!-- Stats Grid -->
      <g transform="translate(100, 60)">
        <!-- Level -->
        <text x="0" y="20" fill="${colors.text}" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
          Level ${stats.level}
        </text>
        <rect x="0" y="25" width="200" height="8" fill="${colors.border}" rx="4"/>
        <rect x="0" y="25" width="${levelProgress * 2}" height="8" fill="${colors.primary}" rx="4"/>
        
        <!-- Points -->
        <text x="0" y="50" fill="${colors.text}" font-family="Arial, sans-serif" font-size="12">
          ${stats.points} Points
        </text>
        
        <!-- PRs -->
        <text x="0" y="70" fill="${colors.text}" font-family="Arial, sans-serif" font-size="12">
          ${stats.totalPRs} PRs Merged
        </text>
        
        <!-- Issues -->
        <text x="0" y="90" fill="${colors.text}" font-family="Arial, sans-serif" font-size="12">
          ${stats.totalIssues} Issues Solved
        </text>
      </g>
      
      <!-- Badges -->
      <g transform="translate(320, 60)">
        <text x="0" y="20" fill="${colors.text}" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
          Badges
        </text>
        <text x="0" y="40" fill="${colors.text}" font-family="Arial, sans-serif" font-size="16">
          ${badgeDisplay}
        </text>
        <text x="0" y="60" fill="${colors.textSecondary}" font-family="Arial, sans-serif" font-size="10">
          ${badges.length} badges earned
        </text>
      </g>
      
      <!-- Footer -->
      <text x="20" y="180" fill="${colors.textSecondary}" font-family="Arial, sans-serif" font-size="10">
        Generated by Contriverse • Last updated: ${new Date().toLocaleDateString()}
      </text>
    </svg>
  `;
  
  return svg;
}

// Get theme colors
function getThemeColors(theme) {
  const themes = {
    default: {
      background: '#ffffff',
      primary: '#0366d6',
      secondary: '#28a745',
      accent: '#f1f8ff',
      text: '#24292e',
      textSecondary: '#586069',
      border: '#e1e4e8'
    },
    dark: {
      background: '#0d1117',
      primary: '#58a6ff',
      secondary: '#3fb950',
      accent: '#161b22',
      text: '#f0f6fc',
      textSecondary: '#8b949e',
      border: '#30363d'
    },
    light: {
      background: '#f6f8fa',
      primary: '#0969da',
      secondary: '#1a7f37',
      accent: '#dbeafe',
      text: '#1f2328',
      textSecondary: '#656d76',
      border: '#d0d7de'
    }
  };
  
  return themes[theme] || themes.default;
}

// Calculate level progress
function calculateLevelProgress(points) {
  if (points >= 1000) return 100;
  if (points >= 500) return 80;
  if (points >= 250) return 60;
  if (points >= 100) return 40;
  if (points >= 50) return 20;
  return 10;
}

// Get contributor's GitHub profile integration
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { include_stats = 'true' } = req.query;
    
    let contributor = Array.from(db.contributors.values())
      .find(contrib => contrib.username === username);
    
    // If contributor doesn't exist, create one from GitHub data
    if (!contributor) {
      try {
        // Fetch GitHub profile data
        const axios = require('axios');
        const githubResponse = await axios.get(`https://api.github.com/users/${username}`, {
          headers: {
            'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Contriverse-API'
          }
        });
        
        const githubProfile = githubResponse.data;
        
        // Create contributor from GitHub data
        contributor = db.createContributor({
          githubId: githubProfile.id,
          username: githubProfile.login,
          name: githubProfile.name || githubProfile.login,
          avatar: githubProfile.avatar_url,
          githubUrl: githubProfile.html_url
        });
        
        // Initialize with some basic stats from GitHub
        db.updateContributorStats(contributor.id, {
          totalStars: githubProfile.public_repos * 2, // Estimate
          activeDays: Math.floor((new Date() - new Date(githubProfile.created_at)) / (1000 * 60 * 60 * 24)),
          joinDate: githubProfile.created_at
        });
        
        // Award some basic badges based on GitHub stats
        if (githubProfile.public_repos > 0) {
          db.awardBadge(contributor.id, 'first-pr');
        }
        if (githubProfile.public_repos > 10) {
          db.awardBadge(contributor.id, 'code-warrior');
        }
        if (githubProfile.followers > 10) {
          db.awardBadge(contributor.id, 'issue-solver');
        }
        
      } catch (githubError) {
        return res.status(404).json({
          success: false,
          error: 'GitHub user not found',
          message: 'User does not exist on GitHub'
        });
      }
    }

    const badges = contributor.badges
      .map(badgeId => db.badges.get(badgeId))
      .filter(Boolean);

    const achievements = db.getContributorAchievements(contributor.id);

    // Generate markdown for GitHub profile
    const markdown = generateProfileMarkdown(contributor, badges, achievements, include_stats === 'true');

    res.json({
      success: true,
      data: {
        markdown,
        contributor: {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar,
          githubUrl: contributor.githubUrl
        },
        stats: contributor.stats,
        badges,
        achievements
      }
    });

  } catch (error) {
    console.error('Get Profile Markdown Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile markdown',
      message: error.message
    });
  }
});

// Generate markdown for GitHub profile
function generateProfileMarkdown(contributor, badges, achievements, includeStats) {
  let markdown = `# ${contributor.name || contributor.username}\n\n`;
  
  if (includeStats) {
    markdown += `## 📊 Contribution Stats\n\n`;
    markdown += `- **Level:** ${contributor.stats.level}\n`;
    markdown += `- **Points:** ${contributor.stats.points}\n`;
    markdown += `- **PRs Merged:** ${contributor.stats.totalPRs}\n`;
    markdown += `- **Issues Solved:** ${contributor.stats.totalIssues}\n`;
    markdown += `- **Total Stars:** ${contributor.stats.totalStars}\n`;
    markdown += `- **Active Days:** ${contributor.stats.activeDays}\n\n`;
  }
  
  if (badges.length > 0) {
    markdown += `## 🏆 Badges\n\n`;
    badges.forEach(badge => {
      markdown += `- ${badge.icon} **${badge.name}** - ${badge.description}\n`;
    });
    markdown += `\n`;
  }
  
  if (achievements.length > 0) {
    markdown += `## 🎯 Recent Achievements\n\n`;
    achievements.slice(0, 5).forEach(achievement => {
      markdown += `- **${achievement.title}** - ${achievement.description} (+${achievement.points} points)\n`;
    });
    markdown += `\n`;
  }
  
  markdown += `---\n\n`;
  markdown += `*Stats powered by [Contriverse](https://contriverse.com)*\n`;
  
  return markdown;
}

// Get organization stats for README
router.get('/organization/:orgId/stats', optionalAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { format = 'svg', theme = 'default' } = req.query;
    
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

    if (format === 'svg') {
      const svg = generateOrgStatsSVG(organization, stats, leaderboard, theme);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(svg);
    }

    res.json({
      success: true,
      data: {
        organization: {
          id: organization.id,
          name: organization.name,
          githubOrg: organization.githubOrg
        },
        stats,
        leaderboard
      }
    });

  } catch (error) {
    console.error('Get Organization Stats Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get organization stats',
      message: error.message
    });
  }
});

// Generate organization stats SVG
function generateOrgStatsSVG(organization, stats, leaderboard, theme) {
  const colors = getThemeColors(theme);
  
  const svg = `
    <svg width="495" height="195" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="495" height="195" fill="${colors.background}" rx="8"/>
      
      <!-- Header -->
      <rect width="495" height="40" fill="url(#gradient)" rx="8"/>
      <text x="20" y="25" fill="${colors.text}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        ${organization.name} - Contribution Stats
      </text>
      
      <!-- Stats -->
      <g transform="translate(20, 60)">
        <text x="0" y="20" fill="${colors.text}" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
          Organization Overview
        </text>
        <text x="0" y="40" fill="${colors.text}" font-family="Arial, sans-serif" font-size="12">
          ${stats.totalContributors} Contributors
        </text>
        <text x="0" y="60" fill="${colors.text}" font-family="Arial, sans-serif" font-size="12">
          ${stats.totalPRs} PRs Merged
        </text>
        <text x="0" y="80" fill="${colors.text}" font-family="Arial, sans-serif" font-size="12">
          ${stats.totalIssues} Issues Solved
        </text>
        <text x="0" y="100" fill="${colors.text}" font-family="Arial, sans-serif" font-size="12">
          ${stats.totalPoints} Total Points
        </text>
      </g>
      
      <!-- Top Contributors -->
      <g transform="translate(250, 60)">
        <text x="0" y="20" fill="${colors.text}" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
          Top Contributors
        </text>
        ${leaderboard.slice(0, 3).map((contrib, index) => `
          <text x="0" y="${40 + index * 20}" fill="${colors.text}" font-family="Arial, sans-serif" font-size="10">
            ${index + 1}. ${contrib.contributor.username} (${contrib.stats.points} pts)
          </text>
        `).join('')}
      </g>
      
      <!-- Footer -->
      <text x="20" y="180" fill="${colors.textSecondary}" font-family="Arial, sans-serif" font-size="10">
        Generated by Contriverse • Last updated: ${new Date().toLocaleDateString()}
      </text>
    </svg>
  `;
  
  return svg;
}

// Sync GitHub user with local database
router.post('/sync/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    
    // Fetch comprehensive GitHub data
    const axios = require('axios');
    const headers = {
      'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Contriverse-API'
    };
    
    // Get user profile
    const profileResponse = await axios.get(`https://api.github.com/users/${username}`, { headers });
    const profile = profileResponse.data;
    
    // Get user repositories
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
    const repos = reposResponse.data;
    
    // Get user events for activity
    const eventsResponse = await axios.get(`https://api.github.com/users/${username}/events/public?per_page=50`, { headers });
    const events = eventsResponse.data;
    
    // Check if contributor already exists
    let contributor = Array.from(db.contributors.values())
      .find(contrib => contrib.username === username);
    
    if (!contributor) {
      // Create new contributor
      contributor = db.createContributor({
        githubId: profile.id,
        username: profile.login,
        name: profile.name || profile.login,
        avatar: profile.avatar_url,
        githubUrl: profile.html_url
      });
    }
    
    // Calculate comprehensive stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const activeDays = Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24));
    
    // Count PRs and issues from events
    const prEvents = events.filter(event => event.type === 'PullRequestEvent' && event.payload.action === 'closed');
    const issueEvents = events.filter(event => event.type === 'IssuesEvent' && event.payload.action === 'closed');
    
    // Update contributor stats
    db.updateContributorStats(contributor.id, {
      totalPRs: prEvents.length,
      totalIssues: issueEvents.length,
      totalStars,
      totalCommits: events.filter(e => e.type === 'PushEvent').length,
      activeDays,
      joinDate: profile.created_at,
      lastActive: profile.updated_at
    });
    
    // Award badges based on comprehensive stats
    if (profile.public_repos > 0) {
      db.awardBadge(contributor.id, 'first-pr');
    }
    if (prEvents.length >= 10) {
      db.awardBadge(contributor.id, 'code-warrior');
    }
    if (issueEvents.length >= 5) {
      db.awardBadge(contributor.id, 'issue-solver');
    }
    if (profile.public_repos >= 25) {
      db.awardBadge(contributor.id, 'pr-champion');
    }
    
    // Get updated contributor data
    const updatedContributor = db.getContributor(contributor.id);
    const badges = updatedContributor.badges
      .map(badgeId => db.badges.get(badgeId))
      .filter(Boolean);
    
    const achievements = db.getContributorAchievements(contributor.id);
    
    res.json({
      success: true,
      message: 'GitHub data synced successfully',
      data: {
        contributor: {
          id: updatedContributor.id,
          username: updatedContributor.username,
          name: updatedContributor.name,
          avatar: updatedContributor.avatar,
          githubUrl: updatedContributor.githubUrl
        },
        stats: updatedContributor.stats,
        badges: badges.map(badge => ({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          color: badge.color,
          points: badge.points
        })),
        achievements: achievements.map(achievement => ({
          id: achievement.id,
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          points: achievement.points,
          createdAt: achievement.createdAt
        })),
        githubData: {
          profile,
          reposCount: repos.length,
          totalStars,
          totalForks,
          recentActivity: events.slice(0, 10).map(event => ({
            type: event.type,
            repo: event.repo.name,
            createdAt: event.created_at
          }))
        }
      }
    });
    
  } catch (error) {
    console.error('GitHub Sync Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to sync GitHub data',
      message: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;

