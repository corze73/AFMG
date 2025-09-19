# 🌐 AFMG Netlify Deployment Guide

## 🎯 **Netlify-Specific Configuration**

Since your AFMG frontend is hosted on Netlify, here's the complete deployment strategy:

### 📁 **Architecture Overview**
```
┌─────────────────┐    ┌─────────────────┐
│   Netlify       │    │   Backend API   │
│   (Frontend)    │────│   (Separate)    │
│   Static Build  │    │   Express.js    │
└─────────────────┘    └─────────────────┘
```

## 🚀 **Frontend Deployment (Netlify)**

### 1. **Build Settings**
```bash
# Build command
npm run build

# Publish directory  
dist

# Environment variables (in Netlify dashboard)
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 2. **Netlify Configuration**
Create `netlify.toml` in your root directory:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. **Environment Variables**
In Netlify Dashboard → Site Settings → Environment Variables:
```
VITE_API_BASE_URL = https://your-api-domain.com/api
```

## 🖥️ **Backend API Deployment Options**

### Option 1: **Railway** (Recommended for Node.js)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy API
cd afmg-api
railway login
railway init
railway up
```

### Option 2: **Render**
1. Connect GitHub repo
2. Create Web Service
3. Build command: `cd afmg-api && npm install`
4. Start command: `cd afmg-api && npm start`

### Option 3: **Heroku**
```bash
# In afmg-api directory
heroku create your-afmg-api
git subtree push --prefix=afmg-api heroku main
```

### Option 4: **DigitalOcean App Platform**
1. Create App from GitHub
2. Specify source: `/afmg-api`
3. Auto-deploy enabled

## 🔧 **Production Environment Setup**

### 1. **Update Frontend Environment**
```bash
# In Netlify dashboard, set:
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 2. **Update Backend Environment**
```bash
# On your API hosting platform, set:
NODE_ENV=production
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-secure-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## 📋 **Deployment Checklist**

### ✅ **Frontend (Netlify)**
- [ ] `netlify.toml` configured
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable: `VITE_API_BASE_URL`
- [ ] Redirects for SPA routing

### ✅ **Backend API**
- [ ] Choose hosting platform (Railway/Render/Heroku/DO)
- [ ] Configure environment variables
- [ ] Test database connection
- [ ] Create admin user
- [ ] Verify all endpoints

### ✅ **Database (Neon)**
- [ ] Production database created
- [ ] Connection string configured
- [ ] Tables auto-created on first run
- [ ] Data migrated

### ✅ **Images (Cloudinary)**
- [ ] Production account configured
- [ ] API credentials set
- [ ] Upload folder configured

## 🧪 **Testing Production Setup**

### 1. **Test API Endpoints**
```bash
# Health check
curl https://your-api-domain.com/api/health

# Login test
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@afmg.co.uk","password":"your-password"}'
```

### 2. **Test Frontend**
```bash
# Visit your Netlify site
https://your-site.netlify.app

# Check browser console for API calls
# Verify login flow works
# Test player management
```

## 🔒 **Security for Production**

### Backend Security
```bash
# Strong JWT secret (32+ characters)
JWT_SECRET=your-very-long-random-secure-secret-key-here

# CORS configured for your Netlify domain
FRONTEND_URL=https://your-site.netlify.app
```

### Database Security
- Use connection pooling
- Enable SSL (already configured)
- Regular backups via Neon

## 📈 **Performance Optimization**

### Frontend
- Static build (already optimized by Vite)
- CDN delivery via Netlify
- Automatic compression

### Backend  
- Enable compression middleware
- Database connection pooling
- Image optimization via Cloudinary

## 🆘 **Troubleshooting**

### Common Issues
1. **CORS errors**: Check `FRONTEND_URL` in API env vars
2. **Build failures**: Verify `VITE_API_BASE_URL` format
3. **Database connection**: Check Neon URL format
4. **Image uploads**: Verify Cloudinary credentials

### Debug Commands
```bash
# Check API health
curl https://your-api-domain.com/api/health

# Check frontend environment
echo $VITE_API_BASE_URL

# Check backend logs
# (depends on your hosting platform)
```

## 🎯 **Next Steps**

1. **Deploy API** to your chosen platform
2. **Update environment variables** with production URLs
3. **Test complete flow** end-to-end
4. **Create admin users** in production
5. **Migrate existing data** if needed

Your AFMG app will be live with the same great UI, now powered by your own scalable backend! 🚀