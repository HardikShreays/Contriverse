const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

// In-memory user store (replace with database in production)
const users = new Map();

// GitHub OAuth redirect URL
router.get('/github', (req, res) => {
  // Generate a secure random state parameter
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/callback`)}&scope=user:email&state=${state}`;
  res.redirect(githubAuthUrl);
});

// GitHub OAuth callback
router.post('/github', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code required',
        message: 'Please provide GitHub authorization code'
      });
    }

    // Note: In production, you should validate the state parameter against a stored value
    // to prevent CSRF attacks. For now, we'll just log it.
    console.log('OAuth state parameter:', state);

    // Exchange code for access token
    console.log('Exchanging code for access token...');
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('GitHub token response status:', tokenResponse.status);
    console.log('GitHub token response data:', tokenResponse.data);

    const { access_token, error: tokenError } = tokenResponse.data;

    if (tokenError) {
      console.error('GitHub token error:', tokenError);
      return res.status(400).json({
        success: false,
        error: 'Failed to get access token',
        message: tokenError === 'bad_verification_code' ? 'Authorization code has expired or already been used' : tokenError
      });
    }

    if (!access_token) {
      return res.status(400).json({
        success: false,
        error: 'Failed to get access token',
        message: 'Invalid authorization code'
      });
    }

    // Get user info from GitHub
    console.log('Fetching user info from GitHub with token:', access_token.substring(0, 10) + '...');
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const githubUser = userResponse.data;

    // Create or update user
    const user = {
      id: githubUser.id,
      username: githubUser.login,
      name: githubUser.name,
      email: githubUser.email,
      avatar: githubUser.avatar_url,
      githubUrl: githubUser.html_url,
      githubToken: access_token,
      createdAt: new Date().toISOString()
    };

    users.set(user.id, user);

    // Generate JWT tokens
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          githubUrl: user.githubUrl,
          githubToken: user.githubToken
        },
        accessToken,
        refreshToken,
        expiresIn: '7d'
      }
    });

  } catch (error) {
    console.error('GitHub OAuth Error:', error.message);
    console.error('Error response:', error.response?.data);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: error.response?.data?.message || error.message
    });
  }
});


// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required',
        message: 'Please provide refresh token'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Get user from store
    const user = users.get(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'Please login again'
      });
    }

    // Generate new tokens
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const newAccessToken = generateToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: '7d'
      }
    });

  } catch (error) {
    console.error('Token Refresh Error:', error.message);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
      message: 'Please login again'
    });
  }
});

// Get current user
router.get('/me', require('../middleware/auth').authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          githubUrl: user.githubUrl,
          githubToken: user.githubToken,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get User Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
      message: error.message
    });
  }
});

// Logout endpoint
router.post('/logout', require('../middleware/auth').authenticateToken, (req, res) => {
  try {
    // In a real app, you'd blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', require('../middleware/auth').authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
      message: 'Token is valid'
    }
  });
});

module.exports = router;
