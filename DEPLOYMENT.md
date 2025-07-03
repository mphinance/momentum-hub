# 🚀 Deployment Guide - mphinance Dashboard

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control
- GitHub account (for continuous deployment)
- Netlify account (recommended hosting)

## 🔧 Local Development Setup

### 1. Clone and Install
```bash
# Clone the repository
git clone [https://github.com/yourusername/mphinance-dashboard.git](https://github.com/yourusername/mphinance-dashboard.git)
cd mphinance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```
### 2. Environment Configuration

For sensitive data like API keys, use environment variables.

Create a `.env` file in the root directory for local development:
```env
# Polygon.io API Key (Required for market data)
VITE_POLYGON_API_KEY=your_polygon_api_key

# Optional: Custom API endpoints
VITE_API_BASE_URL=[https://your-api-url.com](https://your-api-url.com)

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
