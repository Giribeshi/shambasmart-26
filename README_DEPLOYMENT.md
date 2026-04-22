# Shambasmart - Deployment Guide

## Overview
Shambasmart is an AI-powered agricultural assistant for Tanzanian farmers. This guide shows how to deploy to various free hosting platforms.

## Free Hosting Options

### 1. Vercel (Recommended)
**Best for:** React applications, easy deployment, free tier
**URL:** https://vercel.com
**Features:** 
- Free hosting with custom domains
- Automatic deployments from Git
- Global CDN
- Serverless functions support

**Steps:**
1. Push code to GitHub
2. Connect Vercel to GitHub
3. Deploy automatically

### 2. Netlify
**Best for:** Static sites, Git integration
**URL:** https://netlify.com
**Features:**
- Free hosting
- Continuous deployment
- Form handling
- CDN

### 3. GitHub Pages
**Best for:** Simple static sites
**URL:** https://pages.github.com
**Features:**
- Free hosting
- GitHub integration
- Custom domains

### 4. Heroku
**Best for:** Full-stack applications
**URL:** https://heroku.com
**Features:**
- Free tier with dynos
- Node.js support
- Database add-ons

### 5. Render
**Best for:** Modern web applications
**URL:** https://render.com
**Features:**
- Free tier
- Docker support
- Custom domains

### 6. Railway
**Best for:** Node.js applications
**URL:** https://railway.app
**Features:**
- Free tier
- Automatic deployments
- Environment variables

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account

### Step 1: Prepare for Production
```bash
# Build the application
cd client
npm run build

# The build folder is ready at: client/build/
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository
4. Select "shambasmart-app" folder
5. Vercel will automatically detect it's a React app
6. Deploy!

### Alternative: Manual Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from build folder
cd client/build
vercel --prod
```

## Environment Variables Needed
Set these in your hosting platform:
```
NODE_ENV=production
JWT_SECRET=your-secret-key-here
```

## Production Considerations

### Backend Deployment
For full functionality, you'll need to deploy the Node.js backend separately:

#### Options:
1. **Vercel Serverless Functions**
2. **Heroku** (Free tier)
3. **Render** (Free tier)
4. **Railway** (Free tier)

### Frontend Only Deployment
If deploying only the React frontend:

1. **API URLs** - Update all API calls to your backend URL
2. **Environment** - Set production environment variables
3. **Build** - Use production build

## Domain Configuration
Once deployed, you can:
- Use custom domain (e.g., shambasmart.co.tz)
- Configure SSL certificates
- Set up analytics

## Testing After Deployment
1. Test all features: Login, Dashboard, Market Prices, etc.
2. Test responsive design on mobile
3. Test Swahili language switching
4. Test with different browsers

## Monitoring
Set up:
- Error tracking (Sentry for React)
- Performance monitoring
- User analytics
- Uptime monitoring

## Security Notes
- Use HTTPS
- Validate all inputs
- Rate limiting
- Secure JWT secrets
- CORS configuration

## Support
For deployment issues:
- Check hosting platform documentation
- Review build logs
- Test environment variables
- Monitor error tracking
