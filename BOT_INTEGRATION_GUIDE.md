# Bot Integration Guide

This guide explains how to integrate Contriverse with Slack and Discord bots for automated achievement announcements and milestone celebrations.

## Overview

Contriverse provides webhook endpoints and bot integration APIs to automatically announce achievements, milestones, and celebrations in your team's Slack or Discord channels.

## Features

- **Achievement Announcements**: Automatic notifications when team members earn badges
- **Milestone Celebrations**: Anniversary and level-up announcements
- **Deadline Reminders**: Time-bound task notifications
- **Team Leaderboards**: Weekly/monthly contribution summaries
- **Custom Messages**: Personalized celebration messages
- **Rich Embeds**: Beautiful formatted messages with images and stats

## Slack Integration

### 1. Setting Up Slack Webhook

1. Go to your Slack workspace settings
2. Navigate to "Apps" → "Incoming Webhooks"
3. Create a new webhook for your channel
4. Copy the webhook URL

### 2. Configure Contriverse

```bash
curl -X POST https://contriverse.com/api/organizations/{orgId}/settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slackChannel": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    "notificationEnabled": true
  }'
```

### 3. Slack Message Examples

#### Achievement Notification
```json
{
  "text": "🎉 Achievement Unlocked!",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🎉 Achievement Unlocked!"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*johndoe* just earned a new badge: *Code Warrior*"
      },
      "accessory": {
        "type": "image",
        "image_url": "https://github.com/johndoe.png",
        "alt_text": "johndoe"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "_10+ pull requests merged_\n\n🏆 Points: 50"
      }
    }
  ]
}
```

#### Milestone Celebration
```json
{
  "text": "🏆 Milestone Celebration!",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🏆 Milestone Celebration!"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*johndoe* has reached a major milestone!"
      },
      "accessory": {
        "type": "image",
        "image_url": "https://github.com/johndoe.png",
        "alt_text": "johndoe"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Level 5 Achieved!*\n_Keep up the great work contributing to open source_\n\n🎯 Level: 5\n⭐ Total Points: 1,250"
      }
    }
  ]
}
```

## Discord Integration

### 1. Setting Up Discord Webhook

1. Go to your Discord server settings
2. Navigate to "Integrations" → "Webhooks"
3. Create a new webhook for your channel
4. Copy the webhook URL

### 2. Configure Contriverse

```bash
curl -X POST https://contriverse.com/api/organizations/{orgId}/settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "discordChannel": "https://discord.com/api/webhooks/YOUR/WEBHOOK/URL",
    "notificationEnabled": true
  }'
```

### 3. Discord Message Examples

#### Achievement Notification
```json
{
  "embeds": [{
    "title": "🎉 Achievement Unlocked!",
    "description": "**johndoe** just earned a new badge: **Code Warrior**",
    "color": 0x00ff00,
    "thumbnail": {
      "url": "https://github.com/johndoe.png"
    },
    "fields": [
      {
        "name": "Badge Description",
        "value": "10+ pull requests merged",
        "inline": false
      },
      {
        "name": "Points Earned",
        "value": "50",
        "inline": true
      },
      {
        "name": "Total Points",
        "value": "1,250",
        "inline": true
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z"
  }]
}
```

#### Milestone Celebration
```json
{
  "embeds": [{
    "title": "🏆 Milestone Celebration!",
    "description": "**johndoe** has reached a major milestone!",
    "color": 0xffd700,
    "thumbnail": {
      "url": "https://github.com/johndoe.png"
    },
    "fields": [
      {
        "name": "Achievement",
        "value": "Level 5 Achieved!",
        "inline": false
      },
      {
        "name": "Description",
        "value": "Keep up the great work contributing to open source",
        "inline": false
      },
      {
        "name": "Current Level",
        "value": "5",
        "inline": true
      },
      {
        "name": "Total Points",
        "value": "1,250",
        "inline": true
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z"
  }]
}
```

## API Endpoints

### Trigger Achievement Notification

```http
POST /api/bots/slack/webhook
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "organizationId": "org_123",
  "webhookUrl": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
  "eventType": "achievement",
  "data": {
    "contributor": {
      "username": "johndoe",
      "name": "John Doe",
      "avatar": "https://github.com/johndoe.png",
      "stats": {
        "level": 5,
        "points": 1250
      }
    },
    "badge": {
      "name": "Code Warrior",
      "description": "10+ pull requests merged",
      "points": 50
    }
  }
}
```

### Trigger Milestone Celebration

```http
POST /api/bots/celebrate-milestone
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "contributorId": "contrib_123",
  "organizationId": "org_123",
  "milestoneType": "level_up",
  "data": {
    "level": 5,
    "points": 1250,
    "title": "Level 5 Achieved!",
    "description": "Keep up the great work contributing to open source"
  }
}
```

## Event Types

### 1. Achievement Events
- `achievement`: Badge earned
- `milestone`: Level up or major milestone
- `anniversary`: Yearly contribution anniversary

### 2. Task Events
- `deadline_reminder`: Task deadline approaching
- `task_completed`: Task marked as completed
- `task_overdue`: Task past deadline

### 3. Team Events
- `team_achievement`: Team milestone reached
- `leaderboard_update`: Weekly/monthly leaderboard
- `welcome`: New team member joined

## Customization

### Message Templates

You can customize message templates for different events:

```json
{
  "templates": {
    "achievement": {
      "title": "🎉 {contributor} earned {badge}!",
      "message": "Congratulations on earning the {badge} badge!",
      "color": "green"
    },
    "milestone": {
      "title": "🏆 {contributor} reached {milestone}!",
      "message": "Amazing work reaching this milestone!",
      "color": "gold"
    }
  }
}
```

### Notification Settings

```json
{
  "notifications": {
    "achievements": true,
    "milestones": true,
    "deadlines": true,
    "anniversaries": true,
    "teamUpdates": true,
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

## Advanced Features

### 1. Scheduled Announcements

Set up weekly or monthly team summaries:

```bash
# Weekly team summary
curl -X POST https://contriverse.com/api/bots/schedule \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_123",
    "schedule": "weekly",
    "messageType": "team_summary",
    "channels": ["slack", "discord"]
  }'
```

### 2. Custom Triggers

Create custom triggers for specific events:

```bash
# Custom trigger for 100 PRs
curl -X POST https://contriverse.com/api/bots/triggers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_123",
    "trigger": {
      "condition": "totalPRs >= 100",
      "message": "🎉 {contributor} has merged 100 PRs! Incredible work!",
      "channels": ["slack", "discord"]
    }
  }'
```

### 3. Rich Embeds

Use rich embeds for better visual presentation:

```json
{
  "embeds": [{
    "title": "Team Leaderboard - This Week",
    "color": 0x3498db,
    "fields": [
      {
        "name": "🥇 Top Contributor",
        "value": "johndoe - 1,250 points",
        "inline": true
      },
      {
        "name": "🔥 Most Active",
        "value": "janedoe - 15 PRs",
        "inline": true
      },
      {
        "name": "🎯 Team Total",
        "value": "5,000 points",
        "inline": true
      }
    ],
    "footer": {
      "text": "Contriverse Team Stats"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }]
}
```

## Testing

### Test Webhook

```bash
# Test Slack webhook
curl -X POST https://contriverse.com/api/bots/slack/webhook \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_123",
    "webhookUrl": "YOUR_SLACK_WEBHOOK_URL",
    "eventType": "test",
    "data": {
      "message": "Test message from Contriverse"
    }
  }'
```

### Test Discord webhook

```bash
# Test Discord webhook
curl -X POST https://contriverse.com/api/bots/discord/webhook \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_123",
    "webhookUrl": "YOUR_DISCORD_WEBHOOK_URL",
    "eventType": "test",
    "data": {
      "message": "Test message from Contriverse"
    }
  }'
```

## Best Practices

### 1. Rate Limiting
- Respect platform rate limits
- Use appropriate delays between messages
- Batch notifications when possible

### 2. Message Design
- Keep messages concise and clear
- Use appropriate emojis and formatting
- Include relevant statistics
- Make messages actionable

### 3. Privacy
- Only share public achievements
- Respect user privacy settings
- Don't expose sensitive information

### 4. Error Handling
- Implement retry logic for failed webhooks
- Log errors for debugging
- Provide fallback notifications

## Troubleshooting

### Common Issues

1. **Webhook not receiving messages**: Check URL and permissions
2. **Messages not formatting correctly**: Verify JSON structure
3. **Rate limiting**: Implement appropriate delays
4. **Authentication errors**: Check API tokens

### Debug Mode

Enable debug mode for detailed logging:

```bash
curl -X POST https://contriverse.com/api/bots/debug \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_123",
    "debug": true,
    "logLevel": "verbose"
  }'
```

## Support

- Check the [API documentation](https://contriverse.com/api/docs)
- Join our [Discord community](https://discord.gg/contriverse)
- Open an issue on [GitHub](https://github.com/contriverse/contriverse)

---

**Note**: Bot integrations are designed to enhance team collaboration and celebrate achievements. All notifications are based on actual contributions and achievements tracked by Contriverse.

