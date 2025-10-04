const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Helper function to make GitHub API requests
const githubRequest = async (endpoint, token = null) => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Contriverse-API'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  try {
    const response = await axios.get(`${GITHUB_API_BASE}${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`GitHub API Error: ${error.response?.data?.message || error.message}`);
  }
};

// Get user profile details (optional auth for public profiles)
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const token = process.env.GITHUB_API_TOKEN;
    
    // Fetch user profile
    const profile = await githubRequest(`/users/${username}`, token);
    
    // Fetch user repositories
    const repos = await githubRequest(`/users/${username}/repos?sort=updated&per_page=100`, token);
    
    // Fetch user events (recent activity)
    const events = await githubRequest(`/users/${username}/events/public?per_page=30`, token);
    
    // Calculate contribution stats
    const contributionStats = {
      totalRepos: repos.length,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
      accountCreated: profile.created_at,
      lastActive: profile.updated_at
    };
    
    // Get recent contributions
    const recentContributions = events
      .filter(event => ['PushEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type))
      .slice(0, 10)
      .map(event => ({
        type: event.type,
        repo: event.repo.name,
        createdAt: event.created_at,
        url: event.payload?.pull_request?.html_url || event.payload?.issue?.html_url || `https://github.com/${event.repo.name}`
      }));
    
    // Get top repositories
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        updatedAt: repo.updated_at
      }));
    
    res.json({
      success: true,
      data: {
        profile: {
          id: profile.id,
          username: profile.login,
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          avatar: profile.avatar_url,
          location: profile.location,
          website: profile.blog,
          company: profile.company,
          twitter: profile.twitter_username,
          githubUrl: profile.html_url,
          accountCreated: profile.created_at,
          lastActive: profile.updated_at
        },
        stats: contributionStats,
        recentContributions,
        topRepositories: topRepos
      }
    });
    
  } catch (error) {
    console.error('GitHub API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GitHub profile',
      message: error.message
    });
  }
});

// Get user repositories (optional auth)
router.get('/repos/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { sort = 'updated', per_page = 30 } = req.query;
    const token = process.env.GITHUB_API_TOKEN;
    
    const repos = await githubRequest(`/users/${username}/repos?sort=${sort}&per_page=${per_page}`, token);
    
    const formattedRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      size: repo.size,
      defaultBranch: repo.default_branch,
      isPrivate: repo.private,
      isFork: repo.fork,
      url: repo.html_url,
      cloneUrl: repo.clone_url,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at
    }));
    
    res.json({
      success: true,
      data: formattedRepos,
      total: formattedRepos.length
    });
    
  } catch (error) {
    console.error('GitHub Repos Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories',
      message: error.message
    });
  }
});

// Get user contribution activity (optional auth)
router.get('/activity/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { per_page = 50 } = req.query;
    const token = process.env.GITHUB_API_TOKEN;
    
    const events = await githubRequest(`/users/${username}/events/public?per_page=${per_page}`, token);
    
    const activity = events.map(event => ({
      id: event.id,
      type: event.type,
      repo: event.repo.name,
      actor: event.actor.login,
      createdAt: event.created_at,
      url: event.payload?.pull_request?.html_url || 
           event.payload?.issue?.html_url || 
           `https://github.com/${event.repo.name}`,
      payload: {
        action: event.payload?.action,
        ref: event.payload?.ref,
        commits: event.payload?.commits?.length || 0,
        size: event.payload?.size
      }
    }));
    
    res.json({
      success: true,
      data: activity,
      total: activity.length
    });
    
  } catch (error) {
    console.error('GitHub Activity Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity',
      message: error.message
    });
  }
});

// Get repository details (optional auth)
router.get('/repo/:owner/:repo', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = process.env.GITHUB_API_TOKEN;
    
    const repoData = await githubRequest(`/repos/${owner}/${repo}`, token);
    
    // Get repository languages
    const languages = await githubRequest(`/repos/${owner}/${repo}/languages`, token);
    
    // Get repository contributors
    const contributors = await githubRequest(`/repos/${owner}/${repo}/contributors?per_page=10`, token);
    
    res.json({
      success: true,
      data: {
        ...repoData,
        languages,
        contributors: contributors.map(contrib => ({
          username: contrib.login,
          avatar: contrib.avatar_url,
          contributions: contrib.contributions,
          url: contrib.html_url
        }))
      }
    });
    
  } catch (error) {
    console.error('GitHub Repo Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repository details',
      message: error.message
    });
  }
});

module.exports = router;
