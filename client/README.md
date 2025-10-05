# Contriverse Frontend

A beautiful and modern React frontend for the Contriverse gamification platform.

## 🚀 Features

- **Modern React 18** with Vite for fast development
- **Beautiful UI** with Tailwind CSS and custom components
- **Responsive Design** that works on all devices
- **Interactive Charts** with Recharts for analytics
- **Authentication** with GitHub OAuth integration
- **Real-time Updates** and smooth animations

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Beautiful charts and graphs
- **Lucide React** - Modern icon library
- **Axios** - HTTP client for API calls

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#64748B)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Components
- **Cards**: Clean, modern card layouts
- **Buttons**: Primary and secondary button styles
- **Forms**: Styled form inputs and controls
- **Charts**: Interactive data visualizations
- **Navigation**: Responsive sidebar and top navigation

## 📱 Pages

### Landing Page
- Hero section with compelling copy
- Feature highlights
- Statistics and social proof
- Call-to-action sections

### Dashboard
- Contribution overview
- Recent activity feed
- Achievement badges
- Interactive charts

### Analytics
- Detailed performance metrics
- Contribution trends
- Project breakdowns
- Skill development tracking

### Profile
- User information
- Badge collection
- Project contributions
- Settings and preferences

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── pages/             # Page components
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

### Key Components
- **Layout**: Main app layout with navigation
- **ProtectedRoute**: Authentication guard
- **AuthContext**: User authentication state
- **ThemeContext**: Dark/light mode toggle

## 🚀 Deployment

The app is ready for deployment to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: `npm run build && gh-pages -d dist`

## 📄 License

MIT License - see LICENSE file for details.