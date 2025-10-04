const express = require('express');
const router = express.Router();
const db = require('../lib/database');
const { authenticateToken } = require('../middleware/auth');

// Get contributor notifications
router.get('/contributor/:contributorId', authenticateToken, async (req, res) => {
  try {
    const { contributorId } = req.params;
    const { limit = 20, unreadOnly = false } = req.query;
    
    const contributor = db.getContributor(contributorId);
    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: 'Contributor not found',
        message: 'Contributor does not exist'
      });
    }

    let notifications = contributor.notifications
      .map(notifId => db.notifications.get(notifId))
      .filter(Boolean);

    if (unreadOnly === 'true') {
      notifications = notifications.filter(notif => !notif.read);
    }

    notifications = notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: notifications,
      total: notifications.length,
      unreadCount: notifications.filter(notif => !notif.read).length
    });

  } catch (error) {
    console.error('Get Notifications Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications',
      message: error.message
    });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = db.notifications.get(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
        message: 'Notification does not exist'
      });
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();

    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark Notification Read Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      message: error.message
    });
  }
});

// Mark all notifications as read
router.patch('/contributor/:contributorId/read-all', authenticateToken, async (req, res) => {
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

    const notifications = contributor.notifications
      .map(notifId => db.notifications.get(notifId))
      .filter(Boolean);

    let updatedCount = 0;
    notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        updatedCount++;
      }
    });

    res.json({
      success: true,
      data: { updatedCount },
      message: `Marked ${updatedCount} notifications as read`
    });

  } catch (error) {
    console.error('Mark All Notifications Read Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      message: error.message
    });
  }
});

// Create celebration notification
router.post('/celebrate', authenticateToken, async (req, res) => {
  try {
    const { contributorId, organizationId, type, title, message, data } = req.body;
    
    const notification = db.createNotification({
      contributorId,
      organizationId,
      type: 'celebration',
      title,
      message,
      data
    });

    // Get contributor for additional context
    const contributor = db.getContributor(contributorId);
    const organization = db.getOrganization(organizationId);

    res.json({
      success: true,
      data: {
        notification,
        contributor: {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar
        },
        organization: {
          id: organization.id,
          name: organization.name
        }
      },
      message: 'Celebration notification created successfully'
    });

  } catch (error) {
    console.error('Create Celebration Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create celebration notification',
      message: error.message
    });
  }
});

// Get organization-wide notifications
router.get('/organization/:orgId', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { limit = 20, type } = req.query;
    
    const organization = db.getOrganization(orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    let notifications = Array.from(db.notifications.values())
      .filter(notif => notif.organizationId === orgId);

    if (type) {
      notifications = notifications.filter(notif => notif.type === type);
    }

    notifications = notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    // Add contributor info to each notification
    const enrichedNotifications = notifications.map(notif => {
      const contributor = db.getContributor(notif.contributorId);
      return {
        ...notif,
        contributor: contributor ? {
          id: contributor.id,
          username: contributor.username,
          name: contributor.name,
          avatar: contributor.avatar
        } : null
      };
    });

    res.json({
      success: true,
      data: enrichedNotifications,
      total: enrichedNotifications.length
    });

  } catch (error) {
    console.error('Get Organization Notifications Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get organization notifications',
      message: error.message
    });
  }
});

module.exports = router;

