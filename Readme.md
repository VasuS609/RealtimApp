# 💬 Real-Time Chat Application

A scalable WebSocket-based chat app with Auth0 authentication.

## 🏗️ Architecture: Stateless vs Stateful

| Stateless (Our Approach) | Stateful |
|--------------------------|----------|
| ✅ Easy to scale (ASG, HPA, VPA) | ❌ Hard to scale |
| ✅ State in database | ❌ State in memory |
| ✅ Any server handles requests | ❌ Tied to specific server |

### Architecture Pattern

```
React Frontend ──WebSocket──> Gateway (Relayer) ──> Database
                              (Stateless)           (Centralized State)
```

**Examples:** Excalidraw, Second Brain apps, Trading platforms, Gaming lobbies

**Why?** Database stores state centrally → compute can happen anywhere → easy horizontal scaling

---

## 🚀 Quick Setup

### 1. Install

```bash
npm install
```

### 2. Configure Auth0

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Create **Single Page Application**
3. Add to settings:
   - **Callback URL:** `http://localhost:5173/callback`
   - **Logout URL:** `http://localhost:5173`
   - **Web Origins:** `http://localhost:5173`
4. **Disable "Require Organization"** (important!)

### 3. Create `.env`

```bash
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_WS_URL=ws://localhost:8080
```

### 4. Run

```bash
npm run dev
```

---

## 📁 Structure

```
src/
├── pages/          # Landing, Login, Callback, Chat
├── Chat/           # Chat component + WebSocket hook
├── authentication/ # Auth0 buttons & profile
└── components/     # UI components
```

---

## 🔐 Auth Flow

```
Landing → Login → Auth0 → Callback → Chat (Protected)
```

---

## 🐛 Common Issues

**"parameter organization is required"**
→ Disable "Require Organization" in Auth0 app settings

**WebSocket not connecting**
→ Ensure WebSocket server running on port 8080

**Auth0 redirect loop**
→ Clear cache, verify callback URL matches exactly

---

## 🚀 Scaling Strategy

- **HPA** - Horizontal Pod Autoscaler (scale pods based on CPU/memory)
- **VPA** - Vertical Pod Autoscaler (adjust resource limits)
- **Node Autoscaling** - Add/remove cluster nodes
- **Database** - Centralized state enables stateless compute layer

**WebSocket Relayer:** Acts as bidirectional pipe, routes messages, stores in DB

---

## 📝 Tech Stack

**Frontend:** React, TypeScript, Tailwind, Vite
**Auth:** Auth0
**Real-time:** WebSocket
**UI:** shadcn/ui, Lucide icons
