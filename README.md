# 🏆 Contriverse

> A Milestone Celebration Dashboard that gamifies open-source contributions through achievements, badges, progress tracking, and automated community shoutouts - empowering recognition, motivation, and accountability in the open-source ecosystem.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://postgresql.org/)

## 🎯 Overview

Contriverse transforms open-source contribution tracking into an engaging, gamified experience. With dual dashboards for maintainers and contributors, automated milestone celebrations, and comprehensive analytics, it fosters a culture of recognition and motivation in the open-source community.

### ✨ Key Features

- **🎮 Gamification System**: Badges, achievements, and progress tracking
- **📊 Dual Dashboards**: Separate views for maintainers and contributors  
- **🤖 Automated Celebrations**: Discord/Slack bot integrations for milestone announcements
- **📈 Analytics & Insights**: Comprehensive metrics and performance tracking
- **🔗 README API**: Dynamic badges and stats for GitHub profiles
- **🎯 Smart Metrics**: Quality-focused contribution tracking beyond just lines of code

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express API    │    │   PostgreSQL    │
│                 │◄──►│                 │◄──►│                 │
│  - Project Dash │    │  - REST API     │    │  - User Data    │
│  - Contributor  │    │  - Webhooks     │    │  - Analytics    │
│  - Gamification│    │  - Auth          │    │  - Milestones   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Discord Bot   │    │   Slack Bot     │    │   GitHub API    │
│                 │    │                 │    │                 │
│  - Notifications│    │  - Notifications│    │  - Webhooks     │
│  - Celebrations │    │  - Celebrations │    │  - Data Sync    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **JavaScript (ES6+)** - Modern JavaScript development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization and analytics
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JavaScript (ES6+)** - Modern JavaScript development
- **In-Memory Database** - Custom database implementation (development only)
- **JWT** - Authentication tokens

> **Note**: The current implementation uses an in-memory database for development purposes. For production deployment, consider migrating to a persistent database like PostgreSQL with Prisma ORM.

### Integrations
- **Discord Bot API** - Automated celebrations and notifications
- **Slack Bot API** - Team notifications and milestone alerts
- **GitHub API** - Contribution data sync and webhooks
- **README API** - Dynamic profile badges and statistics

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Git
- GitHub App (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/contriverse.git
cd contriverse
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Environment Setup

Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Configure your environment variables:

```env
# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Discord Bot
DISCORD_BOT_TOKEN="your_discord_bot_token"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_GUILD_ID="your_discord_guild_id"

# Slack Bot
SLACK_BOT_TOKEN="your_slack_bot_token"
SLACK_SIGNING_SECRET="your_slack_signing_secret"

# JWT
JWT_SECRET="your_jwt_secret_key"

# API
API_PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Database setup (using in-memory database)
# No additional setup required - database initializes automatically
```

### 5. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Start Discord bot
cd bots/discord
npm run dev

# Terminal 4: Start Slack bot
cd bots/slack
npm run dev
```

## 🎮 Dashboard Features

### 📊 Project Dashboard (Maintainer View)

**Core Metrics:**
- Top Contributors leaderboard (PRs merged, issues solved, active days)
- Project milestone timeline and achievements
- Average PR merge time analytics
- Contributor retention rate tracking
- Badge distribution overview (Bronze/Silver/Gold/Platinum)

**Management Tools:**
- Recent PRs merged with detailed metrics
- Current issues organized by priority
- Quick celebration trigger for manual announcements
- Slack/Discord bot integration controls

### 🏆 Contributor Dashboard (Individual View)

**Personal Progress:**
- Badge collection and achievement timeline
- Activity graph (GitHub-style contribution calendar)
- Contributor level system (Level 1-10 progression)
- Weekly challenges and streak tracking
- Next badge preview and requirements

**Social Features:**
- Rank among organization contributors
- Achievement feed with milestone celebrations
- Social media post automation
- README API integration for profile badges

## 🔧 API Endpoints

### Authentication
```http
POST /api/auth/github
GET  /api/auth/me
POST /api/auth/refresh
```

### Projects
```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

### Contributors
```http
GET    /api/contributors
GET    /api/contributors/:id
GET    /api/contributors/:id/badges
GET    /api/contributors/:id/activity
```

### Analytics
```http
GET /api/analytics/project/:id/overview
GET /api/analytics/contributor/:id/progress
GET /api/analytics/milestones
```

### Webhooks
```http
POST /api/webhooks/github
POST /api/webhooks/discord
POST /api/webhooks/slack
```

## 🤖 Bot Integrations

### Discord Bot Features
- Automatic milestone announcements
- Daily/weekly contribution summaries
- Badge unlock celebrations
- Custom emoji reactions for achievements

### Slack Bot Features
- Team milestone notifications
- Contributor spotlight posts
- Project progress updates
- Custom slash commands for manual triggers

## 📊 README API

Generate dynamic badges for your GitHub profile:

```markdown
![Contriverse Stats](https://api.contriverse.dev/badge/username)
![Contriverse Level](https://api.contriverse.dev/level/username)
![Contriverse Streak](https://api.contriverse.dev/streak/username)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Variables (Production)

Ensure all environment variables are properly configured in your production environment, including:
- OAuth credentials
- Bot tokens and secrets
- JWT secrets
- API endpoints

## 📈 Performance Metrics

- **Response Time**: < 200ms for API endpoints
- **Database Queries**: Optimized in-memory operations
- **Frontend Bundle**: < 500KB gzipped
- **Uptime**: 99.9% availability target

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- JavaScript (ES6+) for modern development
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub for the amazing API
- Discord and Slack for bot integration support
- The open-source community for inspiration
- All contributors who make this project possible

## 📞 Support

- 📧 Email: support@contriverse.dev
- 💬 Discord: [Join our community](https://discord.gg/contriverse)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/contriverse/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/contriverse/wiki)

---

<div align="center">
  <strong>Made with ❤️ for the open-source community</strong>
</div>