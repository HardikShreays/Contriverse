# Contriverse Rating System

A comprehensive rating system for evaluating PRs and contributions based on priority, code amount, time factors, and relevance.

## Overview

The rating system evaluates contributions using six key factors:

1. **Priority** (25%) - Priority level of the PR
2. **Code Amount** (20%) - Amount of code changed
3. **Time Factor** (20%) - Time-related factors (deadlines, speed)
4. **Relevance** (15%) - Relevance to project goals
5. **Quality** (10%) - Code quality indicators
6. **Impact** (10%) - Impact on the project

## API Endpoints

### Rate a PR
```http
POST /api/ratings/rate-pr
Content-Type: application/json
Authorization: Bearer <token>

{
  "prId": "pr_123",
  "contributorId": "contrib_456",
  "organizationId": "org_789",
  "priority": "high",
  "linesAdded": 150,
  "linesDeleted": 20,
  "filesChanged": 5,
  "commits": 3,
  "timeToComplete": 7,
  "deadline": "2024-01-15T23:59:59Z",
  "relevanceScore": 85,
  "qualityIndicators": {
    "hasTests": true,
    "hasDocumentation": true,
    "reviewComments": 2,
    "ciPassed": true,
    "codeCoverage": 85,
    "complexity": "medium"
  },
  "impactScore": 75,
  "createdAt": "2024-01-10T10:00:00Z",
  "mergedAt": "2024-01-12T15:30:00Z",
  "author": "john_doe",
  "repository": "my-org/my-repo",
  "title": "Add user authentication system",
  "description": "Implements JWT-based authentication"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rating": {
      "id": "rating_1234567890",
      "prId": "pr_123",
      "contributorId": "contrib_456",
      "organizationId": "org_789",
      "rating": {
        "totalScore": 82,
        "ratingLevel": "very-good",
        "breakdown": {
          "priority": {
            "score": 80,
            "weight": 0.25,
            "weightedScore": 20
          },
          "codeAmount": {
            "score": 75,
            "weight": 0.20,
            "weightedScore": 15
          },
          "timeFactor": {
            "score": 100,
            "weight": 0.20,
            "weightedScore": 20
          },
          "relevance": {
            "score": 85,
            "weight": 0.15,
            "weightedScore": 12.75
          },
          "quality": {
            "score": 90,
            "weight": 0.10,
            "weightedScore": 9
          },
          "impact": {
            "score": 75,
            "weight": 0.10,
            "weightedScore": 7.5
          }
        }
      }
    }
  },
  "message": "PR rated successfully"
}
```

### Get Contributor Ratings
```http
GET /api/ratings/contributor/:contributorId?limit=20&offset=0
Authorization: Bearer <token>
```

### Get Organization Rating Statistics
```http
GET /api/ratings/organization/:orgId
Authorization: Bearer <token>
```

### Get Rating Leaderboard
```http
GET /api/ratings/leaderboard/:orgId?limit=10&period=30d
Authorization: Bearer <token>
```

### Get Rating Analytics
```http
GET /api/ratings/analytics/:orgId?period=30d
Authorization: Bearer <token>
```

### Update Rating Weights (Admin)
```http
PUT /api/ratings/weights
Content-Type: application/json
Authorization: Bearer <token>

{
  "weights": {
    "priority": 0.30,
    "codeAmount": 0.20,
    "timeFactor": 0.20,
    "relevance": 0.15,
    "quality": 0.10,
    "impact": 0.05
  }
}
```

### Get Rating Configuration
```http
GET /api/ratings/config
Authorization: Bearer <token>
```

## Rating Levels

- **Excellent** (90-100): Outstanding contribution
- **Very Good** (80-89): High-quality contribution
- **Good** (70-79): Solid contribution
- **Satisfactory** (60-69): Adequate contribution
- **Average** (50-59): Standard contribution
- **Below Average** (40-49): Needs improvement
- **Poor** (0-39): Significant issues

## Priority Levels

- **Critical** (100 points): Critical bugs, security issues
- **High** (80 points): Important features, major bugs
- **Medium** (60 points): Standard features, minor bugs
- **Low** (40 points): Nice-to-have features
- **Trivial** (20 points): Minor improvements, typos

## Code Amount Scoring

- **Small** (0-50 lines): 30 points
- **Medium** (51-200 lines): 60 points
- **Large** (201-500 lines): 80 points
- **Massive** (500+ lines): 100 points

## Time Factor Scoring

- **Early** (120 points): Completed significantly before deadline
- **On Time** (100 points): Completed on or before deadline
- **Slightly Late** (80 points): 1-3 days late
- **Moderately Late** (60 points): 4-7 days late
- **Very Late** (40 points): 8+ days late
- **No Deadline** (50 points): No specific deadline set

## Quality Indicators

- **Tests**: +15 points if tests included
- **Documentation**: +10 points if documented
- **Code Coverage**: +10 points if >80%, +5 if >60%
- **Review Comments**: +5 points if reviewed, +5 more if >3 comments
- **CI Status**: -20 points if CI failed
- **Complexity**: Adjusts based on code complexity

## Usage Examples

### Example 1: High-Priority Bug Fix
```json
{
  "prId": "pr_bug_fix_123",
  "contributorId": "contrib_456",
  "organizationId": "org_789",
  "priority": "critical",
  "linesAdded": 25,
  "linesDeleted": 5,
  "filesChanged": 2,
  "commits": 1,
  "timeToComplete": 2,
  "deadline": "2024-01-15T23:59:59Z",
  "relevanceScore": 95,
  "qualityIndicators": {
    "hasTests": true,
    "hasDocumentation": false,
    "reviewComments": 1,
    "ciPassed": true,
    "codeCoverage": 90,
    "complexity": "low"
  },
  "impactScore": 95,
  "title": "Fix critical security vulnerability",
  "description": "Patches SQL injection vulnerability in user authentication"
}
```

### Example 2: Feature Development
```json
{
  "prId": "pr_feature_456",
  "contributorId": "contrib_789",
  "organizationId": "org_789",
  "priority": "high",
  "linesAdded": 300,
  "linesDeleted": 50,
  "filesChanged": 8,
  "commits": 5,
  "timeToComplete": 14,
  "deadline": "2024-01-20T23:59:59Z",
  "relevanceScore": 80,
  "qualityIndicators": {
    "hasTests": true,
    "hasDocumentation": true,
    "reviewComments": 4,
    "ciPassed": true,
    "codeCoverage": 75,
    "complexity": "medium"
  },
  "impactScore": 85,
  "title": "Add user dashboard with analytics",
  "description": "Implements comprehensive user dashboard with real-time analytics and reporting features"
}
```

## Integration with GitHub

The rating system can be integrated with GitHub webhooks to automatically rate PRs:

1. Set up GitHub webhook for PR events
2. Extract PR data (lines changed, files, commits, etc.)
3. Determine priority based on labels or issue type
4. Calculate relevance from PR title/description
5. Submit rating via API

## Analytics and Insights

The system provides comprehensive analytics:

- **Organization Statistics**: Average ratings, distribution, top performers
- **Component Analysis**: Performance breakdown by rating factors
- **Trends**: Rating improvements over time
- **Insights**: Automated recommendations for improvement
- **Leaderboards**: Top contributors by rating

## Customization

The rating system is highly customizable:

- **Adjustable Weights**: Modify the importance of different factors
- **Custom Priority Levels**: Define organization-specific priorities
- **Quality Metrics**: Add custom quality indicators
- **Scoring Thresholds**: Adjust scoring ranges for different factors

## Best Practices

1. **Regular Rating**: Rate PRs consistently and promptly
2. **Fair Assessment**: Use objective criteria for ratings
3. **Feedback Loop**: Use ratings to provide constructive feedback
4. **Team Alignment**: Ensure team understands rating criteria
5. **Continuous Improvement**: Regularly review and adjust weights

## Troubleshooting

### Common Issues

1. **Missing Required Fields**: Ensure all required fields are provided
2. **Invalid Priority**: Use valid priority levels (critical, high, medium, low, trivial)
3. **Weight Validation**: Weights must sum to 1.0 when updating
4. **Date Format**: Use ISO 8601 format for dates

### Error Responses

```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "prId, contributorId, and organizationId are required"
}
```

## Future Enhancements

- **Machine Learning**: AI-powered rating suggestions
- **Integration**: Direct GitHub/GitLab integration
- **Advanced Analytics**: Predictive analytics and forecasting
- **Custom Metrics**: Organization-specific rating criteria
- **Automated Rating**: Automatic rating based on PR metadata
