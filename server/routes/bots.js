const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../lib/database');
const { authenticateToken } = require('../middleware/auth');

// Slack webhook integration
router.post('/slack/webhook', authenticateToken, async (req, res) => {
  try {
    const { organizationId, webhookUrl, eventType, data } = req.body;
    
    const organization = db.getOrganization(organizationId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    let slackMessage = '';
    
    switch (eventType) {
      case 'achievement':
        slackMessage = {
          text: `🎉 Achievement Unlocked!`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '🎉 Achievement Unlocked!'
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${data.contributor.username}* just earned a new badge: *${data.badge.name}*`
              },
              accessory: {
                type: 'image',
                image_url: data.contributor.avatar,
                alt_text: data.contributor.username
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `_${data.badge.description}_\n\n🏆 Points: ${data.badge.points}`
              }
            }
          ]
        };
        break;
        
      case 'milestone':
        slackMessage = {
          text: `🏆 Milestone Celebration!`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '🏆 Milestone Celebration!'
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${data.contributor.username}* has reached a major milestone!`
              },
              accessory: {
                type: 'image',
                image_url: data.contributor.avatar,
                alt_text: data.contributor.username
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${data.title}*\n_${data.description}_\n\n🎯 Level: ${data.contributor.stats.level}\n⭐ Total Points: ${data.contributor.stats.points}`
              }
            }
          ]
        };
        break;
        
      case 'anniversary':
        slackMessage = {
          text: `🎂 Anniversary Celebration!`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '🎂 Anniversary Celebration!'
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${data.contributor.username}* is celebrating their ${data.years} year anniversary with the organization! 🎉`
              },
              accessory: {
                type: 'image',
                image_url: data.contributor.avatar,
                alt_text: data.contributor.username
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `📊 Stats:\n• ${data.contributor.stats.totalPRs} PRs merged\n• ${data.contributor.stats.totalIssues} issues solved\n• Level ${data.contributor.stats.level}\n• ${data.contributor.stats.points} total points`
              }
            }
          ]
        };
        break;
        
      case 'deadline_reminder':
        slackMessage = {
          text: `⏰ Deadline Reminder`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '⏰ Deadline Reminder'
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${data.contributor.username}*, you have a task due soon!`
              },
              accessory: {
                type: 'image',
                image_url: data.contributor.avatar,
                alt_text: data.contributor.username
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${data.task.title}*\n_${data.task.description}_\n\n⏰ Due: ${new Date(data.task.deadline).toLocaleDateString()}\n🎯 Priority: ${data.task.priority}`
              }
            }
          ]
        };
        break;
        
      default:
        slackMessage = {
          text: data.message || 'Contriverse Notification',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: data.message || 'Contriverse Notification'
              }
            }
          ]
        };
    }

    // Send to Slack webhook
    const response = await axios.post(webhookUrl, slackMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      data: {
        eventType,
        message: slackMessage,
        slackResponse: response.data
      },
      message: 'Slack notification sent successfully'
    });

  } catch (error) {
    console.error('Slack Webhook Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send Slack notification',
      message: error.message
    });
  }
});

// Discord webhook integration
router.post('/discord/webhook', authenticateToken, async (req, res) => {
  try {
    const { organizationId, webhookUrl, eventType, data } = req.body;
    
    const organization = db.getOrganization(organizationId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    let discordMessage = {};
    
    switch (eventType) {
      case 'achievement':
        discordMessage = {
          embeds: [{
            title: '🎉 Achievement Unlocked!',
            description: `**${data.contributor.username}** just earned a new badge: **${data.badge.name}**`,
            color: 0x00ff00,
            thumbnail: {
              url: data.contributor.avatar
            },
            fields: [
              {
                name: 'Badge Description',
                value: data.badge.description,
                inline: false
              },
              {
                name: 'Points Earned',
                value: data.badge.points.toString(),
                inline: true
              },
              {
                name: 'Total Points',
                value: data.contributor.stats.points.toString(),
                inline: true
              }
            ],
            timestamp: new Date().toISOString()
          }]
        };
        break;
        
      case 'milestone':
        discordMessage = {
          embeds: [{
            title: '🏆 Milestone Celebration!',
            description: `**${data.contributor.username}** has reached a major milestone!`,
            color: 0xffd700,
            thumbnail: {
              url: data.contributor.avatar
            },
            fields: [
              {
                name: 'Achievement',
                value: data.title,
                inline: false
              },
              {
                name: 'Description',
                value: data.description,
                inline: false
              },
              {
                name: 'Current Level',
                value: data.contributor.stats.level.toString(),
                inline: true
              },
              {
                name: 'Total Points',
                value: data.contributor.stats.points.toString(),
                inline: true
              }
            ],
            timestamp: new Date().toISOString()
          }]
        };
        break;
        
      case 'anniversary':
        discordMessage = {
          embeds: [{
            title: '🎂 Anniversary Celebration!',
            description: `**${data.contributor.username}** is celebrating their ${data.years} year anniversary! 🎉`,
            color: 0xff69b4,
            thumbnail: {
              url: data.contributor.avatar
            },
            fields: [
              {
                name: '📊 Contribution Stats',
                value: `• ${data.contributor.stats.totalPRs} PRs merged\n• ${data.contributor.stats.totalIssues} issues solved\n• Level ${data.contributor.stats.level}\n• ${data.contributor.stats.points} total points`,
                inline: false
              }
            ],
            timestamp: new Date().toISOString()
          }]
        };
        break;
        
      case 'deadline_reminder':
        discordMessage = {
          embeds: [{
            title: '⏰ Deadline Reminder',
            description: `**${data.contributor.username}**, you have a task due soon!`,
            color: 0xff6b6b,
            thumbnail: {
              url: data.contributor.avatar
            },
            fields: [
              {
                name: 'Task',
                value: data.task.title,
                inline: false
              },
              {
                name: 'Description',
                value: data.task.description,
                inline: false
              },
              {
                name: 'Due Date',
                value: new Date(data.task.deadline).toLocaleDateString(),
                inline: true
              },
              {
                name: 'Priority',
                value: data.task.priority,
                inline: true
              }
            ],
            timestamp: new Date().toISOString()
          }]
        };
        break;
        
      default:
        discordMessage = {
          content: data.message || 'Contriverse Notification'
        };
    }

    // Send to Discord webhook
    const response = await axios.post(webhookUrl, discordMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      data: {
        eventType,
        message: discordMessage,
        discordResponse: response.data
      },
      message: 'Discord notification sent successfully'
    });

  } catch (error) {
    console.error('Discord Webhook Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send Discord notification',
      message: error.message
    });
  }
});

// Trigger milestone celebration
router.post('/celebrate-milestone', authenticateToken, async (req, res) => {
  try {
    const { contributorId, organizationId, milestoneType, data } = req.body;
    
    const contributor = db.getContributor(contributorId);
    const organization = db.getOrganization(organizationId);
    
    if (!contributor || !organization) {
      return res.status(404).json({
        success: false,
        error: 'Contributor or organization not found',
        message: 'Invalid contributor or organization'
      });
    }

    // Create celebration notification
    const notification = db.createNotification({
      contributorId,
      organizationId,
      type: 'celebration',
      title: `Milestone Celebration: ${milestoneType}`,
      message: `Congratulations on reaching this milestone!`,
      data: { milestoneType, ...data }
    });

    // Send to Slack if configured
    if (organization.slackChannel) {
      try {
        await axios.post('/api/bots/slack/webhook', {
          organizationId,
          webhookUrl: organization.slackChannel,
          eventType: 'milestone',
          data: {
            contributor: {
              username: contributor.username,
              name: contributor.name,
              avatar: contributor.avatar,
              stats: contributor.stats
            },
            title: `Milestone: ${milestoneType}`,
            description: `Congratulations on reaching this milestone!`
          }
        });
      } catch (error) {
        console.error('Slack notification failed:', error.message);
      }
    }

    // Send to Discord if configured
    if (organization.discordChannel) {
      try {
        await axios.post('/api/bots/discord/webhook', {
          organizationId,
          webhookUrl: organization.discordChannel,
          eventType: 'milestone',
          data: {
            contributor: {
              username: contributor.username,
              name: contributor.name,
              avatar: contributor.avatar,
              stats: contributor.stats
            },
            title: `Milestone: ${milestoneType}`,
            description: `Congratulations on reaching this milestone!`
          }
        });
      } catch (error) {
        console.error('Discord notification failed:', error.message);
      }
    }

    res.json({
      success: true,
      data: {
        notification,
        contributor: {
          id: contributor.id,
          username: contributor.username,
          stats: contributor.stats
        }
      },
      message: 'Milestone celebration triggered successfully'
    });

  } catch (error) {
    console.error('Celebrate Milestone Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger milestone celebration',
      message: error.message
    });
  }
});

module.exports = router;

