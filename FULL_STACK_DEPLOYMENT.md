# Shambasmart - Full-Stack Deployment Guide

## Overview
Deploy the complete Shambasmart application with real backend API and frontend for meaningful, dynamic responses.

## Step 1: Deploy Backend (Render.com)

### Quick Backend Deployment:
1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click**: "New" -> "Web Service"
4. **Connect**: Your GitHub repository
5. **Configure**:
   - Name: `shambasmart-api`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

### Environment Variables:
```
NODE_ENV=production
JWT_SECRET=shambasmart-jwt-secret-key-2024
PORT=10000
```

### Backend URL:
Once deployed, you'll get: `https://shambasmart-api.onrender.com`

## Step 2: Update Frontend Configuration

### Create Production Environment:
File: `client/.env.production`
```
REACT_APP_API_URL=https://shambasmart-api.onrender.com
```

## Step 3: Deploy Frontend (Netlify or Render)

### Option A: Netlify (Recommended)
1. **Build**: `npm run build` in client folder
2. **Deploy**: Drag `client/build` to Netlify
3. **Environment**: Set `REACT_APP_API_URL=https://shambasmart-api.onrender.com`

### Option B: Render Frontend
1. **Create**: New Static Site on Render
2. **Build**: `cd client && npm run build`
3. **Publish**: `client/build`

## Step 4: Test Full-Stack Application

### Working Features:
- **Real Authentication**: JWT-based login/register
- **Live API Calls**: All features use real backend
- **Dynamic Responses**: Market prices, weather, advice
- **Data Persistence**: User data stored in database
- **Real Processing**: AI-powered recommendations

### Test URLs:
- **Frontend**: Your Netlify/Render URL
- **Backend API**: `https://shambasmart-api.onrender.com`
- **API Health Check**: `https://shambasmart-api.onrender.com/`

## Step 5: Verify All Features

### Authentication:
- Register new user
- Login with real credentials
- JWT token management

### Market Prices:
- Real AI price predictions
- Dynamic market data
- Live calculations

### Weather:
- Real weather API integration
- Live forecasts
- Dynamic advisories

### All Features:
- Farming advice with real processing
- Disease diagnosis with image analysis
- Crop recommendations with AI

## Troubleshooting:

### CORS Issues:
Backend already has CORS configured for all origins.

### Database:
Uses SQLite - automatically created on first deployment.

### API Rate Limits:
Free Render plan has some limitations but sufficient for demo.

## Benefits of Full-Stack:

### Real Experience:
- Users get actual responses
- Data persists between sessions
- Real authentication flow
- Dynamic content generation

### Professional Demo:
- Shows complete technical capability
- Real backend processing
- Database integration
- API architecture

### Scalable:
- Can handle real users
- Data persistence
- Real-time processing
- Production ready

## Next Steps:

1. Deploy backend to Render
2. Update frontend environment
3. Deploy frontend
4. Test all features
5. Share working application

## Support:

For issues:
- Check Render deployment logs
- Verify API endpoints are working
- Test backend health check
- Monitor error logs
