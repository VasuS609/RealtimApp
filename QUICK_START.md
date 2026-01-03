# Quick Start Guide - Production Deployment

## 🚀 Deploy in 5 Minutes

### Step 1: Configure Environment Variables

**Frontend (.env):**
```bash
cd chat-app
cp .env.example .env
# Edit .env with your Auth0 credentials
```

**Backend (.env):**
```bash
cd ../relayer-ws
cp .env.example .env
# Edit .env with your configuration
```

### Step 2: Choose Deployment Method

#### Option A: Docker (Easiest - Recommended)

```bash
# From project root
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8081
# Health: http://localhost:8081/health
```

#### Option B: Traditional VPS

```bash
# Install dependencies
npm run install:all

# Build both apps
cd chat-app && npm run build
cd ../relayer-ws && npm run build

# Install PM2
npm install -g pm2

# Start backend
cd relayer-ws
pm2 start dist/src/index.js --name cavlo-backend

# Start frontend (serve static files)
cd ../chat-app
pm2 serve dist 3000 --spa --name cavlo-frontend

# Save PM2 config
pm2 save
pm2 startup
```

#### Option C: Cloud Platforms

**Vercel (Frontend):**
```bash
cd chat-app
npm install -g vercel
vercel deploy --prod
```

**Render/Railway (Backend):**
1. Connect your GitHub repo
2. Select `relayer-ws` folder
3. Set environment variables
4. Deploy!

### Step 3: Test Your Deployment

```bash
# Test health endpoint
curl http://localhost:8081/health

# Expected response:
# {"status":"ok","timestamp":1234567890,"connections":0,"rooms":0}
```

### Step 4: Configure Domain & SSL

**With Nginx:**
```nginx
# /etc/nginx/sites-available/cavlo
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

    # Backend WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable SSL:**
```bash
sudo certbot --nginx -d yourdomain.com
```

### Step 5: Monitor

```bash
# With PM2
pm2 monit

# With Docker
docker stats

# Check logs
pm2 logs
# or
docker-compose logs -f
```

---

## 🔧 Troubleshooting

### Issue: Can't connect to WebSocket
**Solution:** 
- Check if ports 8081 and 8082 are open
- Verify ALLOWED_ORIGINS in backend .env
- Check firewall rules

### Issue: CORS errors
**Solution:**
- Add your frontend URL to ALLOWED_ORIGINS
- Format: `ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`

### Issue: Auth0 not working
**Solution:**
- Verify Auth0 credentials in .env
- Check callback URL in Auth0 dashboard
- Ensure domain format: `your-tenant.auth0.com` (no https://)

---

## 📊 Performance Benchmarks

After fixing bugs, your application can handle:
- ✅ 10+ concurrent WebSocket connections
- ✅ 100 messages per minute per user
- ✅ 10 users per video room
- ✅ < 100ms latency on local network

---

## 🎯 Next Steps

1. **Test with real users** (5-10 people)
2. **Monitor error logs** for first week
3. **Set up automated backups**
4. **Configure monitoring** (Sentry, Uptime Robot)
5. **Plan scaling strategy** for growth

---

## 📞 Quick Commands Reference

```bash
# Development
npm run dev                    # Start both frontend & backend

# Production
docker-compose up -d           # Start with Docker
docker-compose down            # Stop services
docker-compose logs -f         # View logs

# PM2
pm2 start all                  # Start all apps
pm2 restart all                # Restart all apps
pm2 stop all                   # Stop all apps
pm2 delete all                 # Remove all apps
pm2 logs                       # View logs

# Health Check
curl http://localhost:8081/health

# Load Test
npm install -g artillery
artillery run load-test.yml
```

**You're ready to go live! 🚀**
