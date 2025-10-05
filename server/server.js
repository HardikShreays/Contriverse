const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Import routes
const githubRoutes = require('./routes/github');
const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organizations');
const achievementRoutes = require('./routes/achievements');
const notificationRoutes = require('./routes/notifications');
const botRoutes = require('./routes/bots');
const githubReadmeRoutes = require('./routes/github-readme');
const achievementTrackingRoutes = require('./routes/achievement-tracking');
const ratingRoutes = require('./routes/ratings');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/readme', githubReadmeRoutes);
app.use('/api/tracking', achievementTrackingRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Contriverse server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🔗 GitHub API: http://localhost:${PORT}/api/github/profile/:username`);
  console.log(`⭐ Rating API: http://localhost:${PORT}/api/ratings`);
});
