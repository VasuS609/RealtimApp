# 📋 Production Deployment Checklist

## ✅ Phase 1: Environment Setup (15 minutes)

### Frontend Configuration
```bash
cd chat-app
cp .env.example .env
```

Edit `chat-app/.env`:
- [ ] `VITE_AUTH0_DOMAIN` - Your Auth0 domain
- [ ] `VITE_AUTH0_CLIENT_ID` - Your Auth0 client ID
- [ ] `VITE_AUTH0_AUDIENCE` - Your Auth0 API identifier (optional)
- [ ] `VITE_SIGNALING_URL` - Backend URL (production domain)
- [ ] `VITE_CHAT_WS_URL` - WebSocket URL (production domain)

### Backend Configuration
```bash
cd relayer-ws
cp .env.example .env
```

Edit `relayer-ws/.env`:
- [ ] `PORT` - Server port (default: 8081)
- [ ] `CHAT_PORT` - WebSocket port (default: 8082)
- [ ] `ALLOWED_ORIGINS` - Comma-separated frontend URLs
- [ ] `MAX_ROOM_SIZE` - Maximum users per room (default: 10)
- [ ] `AUTH0_DOMAIN` - Your Auth0 domain (for JWT validation)
- [ ] `AUTH0_AUDIENCE` - Your Auth0 API identifier

---

## ✅ Phase 2: Choose Deployment Method (5 minutes)

### Option A: Docker Compose (Recommended - Easiest)
```bash
# From project root
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

**Advantages:**
- ✅ Easiest setup
- ✅ Includes Redis for scaling
- ✅ Built-in health checks
- ✅ Easy to update/restart

**Access Points:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8081
- Health Check: http://localhost:8081/health

---

### Option B: VPS (DigitalOcean, Linode, AWS EC2)

#### Step 1: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 2: Install Dependencies
```bash
npm run install:all
```

#### Step 3: Build Applications
```bash
# Build backend
cd relayer-ws
npm run build

# Build frontend
cd ../chat-app
npm run build
```

#### Step 4: Install PM2
```bash
sudo npm install -g pm2
```

#### Step 5: Start Services
```bash
# Start backend
cd relayer-ws
pm2 start dist/src/index.js --name cavlo-backend

# Start frontend (static files)
cd ../chat-app
pm2 serve dist 3000 --spa --name cavlo-frontend

# Save configuration
pm2 save
pm2 startup
```

#### Step 6: Configure Nginx
```bash
sudo apt install nginx

# Create config file
sudo nano /etc/nginx/sites-available/cavlo
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API & WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8081/health;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/cavlo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Configure SSL
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### Option C: Cloud Platforms (Vercel + Railway)

#### Frontend on Vercel
```bash
cd chat-app
npm install -g vercel
vercel deploy --prod
```

In Vercel Dashboard:
- [ ] Add environment variables from `.env.example`
- [ ] Set `VITE_SIGNALING_URL` to your backend URL
- [ ] Set `VITE_CHAT_WS_URL` to your backend WebSocket URL

#### Backend on Railway/Render
1. **Connect Repository**
   - Go to Railway.app or Render.com
   - Connect your GitHub repository
   - Select `relayer-ws` folder as root

2. **Configure Environment**
   - Add all variables from `relayer-ws/.env.example`
   - Set `ALLOWED_ORIGINS` to your Vercel domain

3. **Deploy**
   - Click deploy
   - Note the backend URL

4. **Update Frontend**
   - Go back to Vercel
   - Update `VITE_SIGNALING_URL` with Railway/Render URL
   - Redeploy

---

## ✅ Phase 3: Testing (10 minutes)

### 1. Health Check
```bash
curl http://your-domain.com/health

# Expected response:
# {"status":"ok","timestamp":1234567890,"connections":0,"rooms":0}
```
- [ ] Health endpoint responds
- [ ] Status is "ok"

### 2. Frontend Access
- [ ] Open frontend in browser
- [ ] No console errors
- [ ] Can navigate to login page

### 3. WebSocket Connection
- [ ] Open chat page
- [ ] See "Connected" status (not "Connecting...")
- [ ] Send a test message
- [ ] Message appears in chat

### 4. Video Call
- [ ] Open video page in two browsers
- [ ] First user: Click "Start Room"
- [ ] Second user: Enter same room name, click "Join"
- [ ] Video connection establishes
- [ ] Can see both video feeds

### 5. Load Test (Optional but Recommended)
```bash
npm install -g artillery
artillery run load-test.yml
```
- [ ] All requests succeed
- [ ] Response times < 500ms
- [ ] No errors in logs

---

## ✅ Phase 4: Monitoring Setup (15 minutes)

### 1. Uptime Monitoring
**Recommended: UptimeRobot (Free)**
- [ ] Sign up at uptimerobot.com
- [ ] Add monitor for health endpoint: `http://your-domain.com/health`
- [ ] Set check interval: 5 minutes
- [ ] Add alert email

### 2. Error Tracking
**Recommended: Sentry (Free tier available)**
```bash
npm install @sentry/react @sentry/node

# Frontend (chat-app/src/main.tsx)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});

# Backend (relayer-ws/src/index.ts)
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

- [ ] Sign up at sentry.io
- [ ] Create projects for frontend and backend
- [ ] Install Sentry packages
- [ ] Add initialization code
- [ ] Test error reporting

### 3. Log Aggregation
**Docker:**
```bash
docker-compose logs -f > logs.txt &
```

**PM2:**
```bash
pm2 logs --lines 1000 > logs.txt
```

- [ ] Logs are being captured
- [ ] Can access historical logs

---

## ✅ Phase 5: Security Checklist (10 minutes)

### Firewall Configuration
```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (be careful!)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

- [ ] Only necessary ports are open
- [ ] SSH is secured (key-based auth recommended)
- [ ] Firewall is enabled

### Environment Variables
- [ ] No secrets in code
- [ ] `.env` files in `.gitignore`
- [ ] Production secrets are different from dev
- [ ] Auth0 secrets are secure

### SSL/TLS
- [ ] HTTPS is enabled
- [ ] Certificate is valid
- [ ] Redirects HTTP to HTTPS
- [ ] WebSocket uses WSS (not WS)

### Updates
```bash
# Update dependencies
npm audit fix

# Update system packages (Ubuntu)
sudo apt update && sudo apt upgrade -y
```

- [ ] Dependencies are up to date
- [ ] No critical vulnerabilities
- [ ] System is patched

---

## ✅ Phase 6: Performance Optimization (Optional)

### CDN Setup (Cloudflare - Free)
- [ ] Sign up at cloudflare.com
- [ ] Add your domain
- [ ] Update nameservers
- [ ] Enable "Auto Minify" for JS/CSS/HTML
- [ ] Enable "Brotli" compression
- [ ] Set cache rules

### Database (for scaling beyond 10 users)
- [ ] Set up MongoDB/PostgreSQL
- [ ] Store chat history
- [ ] Implement user profiles
- [ ] Add analytics

### Redis (for horizontal scaling)
```bash
# Already in docker-compose.yml
# Uncomment Redis adapter in relayer-ws/src/index.ts when needed
```

---

## ✅ Phase 7: Documentation (5 minutes)

### Create README for your team
- [ ] How to access production site
- [ ] How to check logs
- [ ] Emergency contact information
- [ ] Rollback procedure

### Backup Strategy
- [ ] Database backups (if applicable)
- [ ] Configuration backups
- [ ] Code is in version control (Git)

---

## 🎯 Post-Deployment Checklist

### Day 1
- [ ] Monitor error logs every hour
- [ ] Test all features from different devices
- [ ] Verify user authentication works
- [ ] Check resource usage (CPU, RAM, Disk)

### Week 1
- [ ] Review error rates in Sentry
- [ ] Check uptime percentage (should be >99%)
- [ ] Collect user feedback
- [ ] Optimize based on real usage patterns

### Month 1
- [ ] Review performance metrics
- [ ] Plan for scaling if needed
- [ ] Update dependencies
- [ ] Security audit

---

## 🚨 Rollback Plan

If something goes wrong:

**Docker:**
```bash
docker-compose down
docker-compose up -d
```

**PM2:**
```bash
pm2 restart all
```

**Full Rollback:**
```bash
git revert HEAD
npm run install:all
# Rebuild and redeploy
```

---

## 📞 Emergency Contacts

**Service Down:**
1. Check `/health` endpoint
2. Check logs: `docker-compose logs` or `pm2 logs`
3. Restart services
4. Check firewall rules
5. Verify DNS/SSL

**High Error Rate:**
1. Check Sentry dashboard
2. Review recent deployments
3. Check resource usage
4. Consider rolling back

**Performance Issues:**
1. Check connection count: `curl http://localhost:8081/health`
2. Review server resources
3. Check rate limiting logs
4. Consider scaling

---

## ✅ Final Verification

Before announcing to users:
- [ ] Health check passes
- [ ] Frontend loads correctly
- [ ] Chat works
- [ ] Video calls work
- [ ] Authentication works
- [ ] SSL certificate is valid
- [ ] Monitoring is active
- [ ] Backups are configured
- [ ] Team knows how to access logs
- [ ] Rollback plan is documented

**🎉 You're ready to go live!**

---

## 📊 Expected Performance

With current configuration:
- **Concurrent Users:** 10+
- **Message Throughput:** 1,000+ messages/minute
- **Video Rooms:** Multiple rooms with up to 10 users each
- **Uptime:** 99.9% (with proper monitoring)
- **Response Time:** < 100ms (local network), < 500ms (internet)

---

## 🔄 Regular Maintenance

**Weekly:**
- [ ] Review error logs
- [ ] Check uptime metrics
- [ ] Verify backups

**Monthly:**
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Performance optimization
- [ ] Cost optimization

**Quarterly:**
- [ ] Full security audit
- [ ] Capacity planning
- [ ] Architecture review
- [ ] User feedback analysis
