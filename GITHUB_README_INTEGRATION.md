# GitHub Profile README Integration

This document explains how to integrate Contriverse stats into your GitHub profile README.

## Overview

Contriverse provides APIs to display your contribution stats, badges, and achievements directly in your GitHub profile README. This creates a dynamic, always-updated showcase of your open source contributions.

## Features

- **Dynamic Stats Cards**: SVG-based stats cards that update automatically
- **Badge Display**: Show earned badges and achievements
- **Contribution Metrics**: PRs merged, issues solved, points earned
- **Organization Stats**: Display organization-level statistics
- **Multiple Themes**: Light, dark, and custom themes
- **Real-time Updates**: Stats update automatically as you contribute

## API Endpoints

### Get Contributor Stats

```http
GET /api/readme/stats/{username}?format=svg&theme=default&show_badges=true&show_stats=true
```

**Parameters:**
- `format`: `svg` (default) or `json`
- `theme`: `default`, `dark`, or `light`
- `show_badges`: `true` or `false`
- `show_stats`: `true` or `false`

### Get Organization Stats

```http
GET /api/readme/organization/{orgId}/stats?format=svg&theme=default
```

### Get Profile Markdown

```http
GET /api/readme/profile/{username}?include_stats=true
```

## Usage Examples

### 1. SVG Stats Card in README

Add this to your GitHub profile README:

```markdown
# Hi there, I'm [Your Name] 👋

[![Contriverse Stats](https://contriverse.com/api/readme/stats/yourusername?theme=default)](https://contriverse.com/profile/yourusername)

## 🏆 Badges

[![Badges](https://contriverse.com/api/readme/stats/yourusername?theme=dark&show_badges=true)](https://contriverse.com/profile/yourusername)

## 📊 Contribution Stats

- **Level**: 5
- **Points**: 1,250
- **PRs Merged**: 25
- **Issues Solved**: 15
- **Badges Earned**: 8
```

### 2. Dynamic Badge Display

```markdown
## 🏆 Recent Achievements

![Achievements](https://contriverse.com/api/readme/stats/yourusername?theme=light&show_badges=true&show_stats=false)
```

### 3. Organization Stats

```markdown
## 🏢 Organization Contributions

![Org Stats](https://contriverse.com/api/readme/organization/yourorg/stats?theme=default)
```

## SVG Customization

### Themes

#### Default Theme
```markdown
![Stats](https://contriverse.com/api/readme/stats/yourusername?theme=default)
```

#### Dark Theme
```markdown
![Stats](https://contriverse.com/api/readme/stats/yourusername?theme=dark)
```

#### Light Theme
```markdown
![Stats](https://contriverse.com/api/readme/stats/yourusername?theme=light)
```

### Customization Options

- **Show/Hide Badges**: `show_badges=true/false`
- **Show/Hide Stats**: `show_stats=true/false`
- **Format**: `format=svg` or `format=json`

## JSON API Response

When using `format=json`, you get structured data:

```json
{
  "success": true,
  "data": {
    "contributor": {
      "id": "contrib_123",
      "username": "yourusername",
      "name": "Your Name",
      "avatar": "https://...",
      "githubUrl": "https://github.com/yourusername"
    },
    "stats": {
      "level": 5,
      "points": 1250,
      "totalPRs": 25,
      "totalIssues": 15,
      "totalStars": 128,
      "activeDays": 67
    },
    "badges": [
      {
        "id": "first-pr",
        "name": "First PR",
        "description": "Merged your first pull request",
        "icon": "🎉",
        "color": "bronze",
        "points": 10
      }
    ],
    "achievements": [
      {
        "id": "ach_123",
        "type": "pr",
        "title": "25th PR Merged",
        "description": "Merged 25th pull request",
        "points": 25,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Advanced Integration

### Custom Markdown Generation

Use the profile endpoint to get pre-formatted markdown:

```markdown
# Your Profile

<!-- Include your Contriverse stats -->
<script>
fetch('https://contriverse.com/api/readme/profile/yourusername?include_stats=true')
  .then(response => response.json())
  .then(data => {
    document.getElementById('stats').innerHTML = data.data.markdown;
  });
</script>

<div id="stats"></div>
```

### GitHub Actions Integration

Create a workflow to update your README automatically:

```yaml
name: Update Contriverse Stats

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  update-stats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Update README with Contriverse stats
        run: |
          curl -s "https://contriverse.com/api/readme/stats/${{ github.actor }}?format=svg&theme=default" > contriverse-stats.svg
          
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add contriverse-stats.svg
          git commit -m "Update Contriverse stats" || exit 0
          git push
```

## Best Practices

### 1. Caching
- SVG images are cached for 1 hour
- Use appropriate cache headers for your use case

### 2. Performance
- Use SVG format for better performance
- Consider lazy loading for multiple stats cards

### 3. Accessibility
- Include alt text for images
- Provide fallback content

### 4. Privacy
- Only public stats are displayed
- Private contributions are not included

## Examples in the Wild

### Basic Stats Card
```markdown
[![Contriverse Stats](https://contriverse.com/api/readme/stats/octocat)](https://contriverse.com/profile/octocat)
```

### Badge Showcase
```markdown
## 🏆 My Badges

[![Badges](https://contriverse.com/api/readme/stats/octocat?show_badges=true&show_stats=false)](https://contriverse.com/profile/octocat)
```

### Organization Dashboard
```markdown
## 🏢 Organization Stats

![Org Stats](https://contriverse.com/api/readme/organization/myorg/stats)
```

## Troubleshooting

### Common Issues

1. **Image not loading**: Check if the username exists in Contriverse
2. **Outdated stats**: Stats update every hour, check back later
3. **Theme not applying**: Ensure theme parameter is correct
4. **Badge not showing**: Verify badges are earned and public

### Support

- Check the [API documentation](https://contriverse.com/api/docs)
- Join our [Discord community](https://discord.gg/contriverse)
- Open an issue on [GitHub](https://github.com/contriverse/contriverse)

## API Rate Limits

- **Public endpoints**: 100 requests per hour
- **Authenticated endpoints**: 1000 requests per hour
- **Organization endpoints**: 500 requests per hour

## Security

- All data is public and read-only
- No authentication required for public stats
- Personal information is not exposed
- Only contribution metrics are displayed

---

**Note**: This integration is designed to showcase your open source contributions in a gamified way. All stats are based on your actual GitHub activity and contributions tracked by Contriverse.

