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
git clone https://github.com/yourusername/mphinance-dashboard.git
cd mphinance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Optional: Custom API endpoints
VITE_API_BASE_URL=https://your-api-url.com

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

### 3. Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🌐 Production Deployment

### Option 1: Netlify (Recommended)

#### Quick Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/mphinance-dashboard)

#### Manual Netlify Setup
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

#### Continuous Deployment Setup
1. **Connect GitHub Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (in Environment variables)

3. **Environment Variables** (if needed)
   - Go to Site settings → Environment variables
   - Add any required environment variables

### Option 2: Vercel

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mphinance-dashboard)

#### Manual Vercel Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### Option 4: Traditional Web Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload dist folder**
   - Upload the entire `dist` folder contents to your web server
   - Ensure your server serves `index.html` for all routes (SPA routing)

## ⚙️ Server Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache Configuration (.htaccess)
```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

## 🔒 Security Considerations

### Content Security Policy
Add to your hosting platform or server:
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://query1.finance.yahoo.com;
">
```

### HTTPS Configuration
- Always use HTTPS in production
- Most hosting platforms provide free SSL certificates
- Redirect HTTP to HTTPS

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Build with source maps (for debugging)
npm run build -- --sourcemap
```

### Hosting Optimization
- Enable gzip compression
- Set proper cache headers
- Use CDN for static assets
- Enable HTTP/2

## 🔍 Monitoring and Analytics

### Error Tracking
Consider integrating error tracking services:
- Sentry
- LogRocket
- Bugsnag

### Analytics
Add analytics to track usage:
- Google Analytics
- Plausible
- Mixpanel

### Performance Monitoring
- Lighthouse CI
- Web Vitals
- Real User Monitoring (RUM)

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### Routing Issues
- Ensure server is configured for SPA routing
- Check that all routes serve `index.html`

#### API Proxy Issues
- Verify proxy configuration in `vite.config.ts`
- Check CORS settings
- Ensure API endpoints are accessible

#### Performance Issues
- Optimize images and assets
- Enable compression
- Check bundle size with analyzer

### Debug Mode
```bash
# Run with debug information
DEBUG=* npm run dev

# Build with verbose output
npm run build -- --verbose
```

## 📈 Scaling Considerations

### Database Integration
For production use, consider:
- Supabase for backend
- Firebase for real-time features
- PostgreSQL for complex queries

### API Rate Limiting
- Implement caching strategies
- Use API keys for higher limits
- Consider premium data providers

### User Management
- Add authentication system
- Implement user accounts
- Add data persistence

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

**Need help with deployment? Create an issue on GitHub or contact support.**

*This deployment guide covers all major hosting platforms and configurations for the mphinance Dashboard.*