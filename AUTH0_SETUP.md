# Auth0 Setup Guide for Cavlo

## Step 1: Create Auth0 Account
1. Go to [Auth0](https://auth0.com)
2. Sign up for a free account

## Step 2: Create an Application
1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Click on **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Single Page Application**
5. Select **React** as the technology
6. Click **Create**

## Step 3: Configure Application Settings
1. Go to your application settings
2. Find **Application URIs** section
3. Configure the following:

### Allowed Callback URLs
```
http://localhost:5173/callback
http://localhost:3000/callback
https://yourdomain.com/callback
```

### Allowed Logout URLs
```
http://localhost:5173
http://localhost:3000
https://yourdomain.com
```

### Allowed Web Origins
```
http://localhost:5173
http://localhost:3000
https://yourdomain.com
```

### Allowed Cross-Origin Authentication URLs
```
http://localhost:5173
http://localhost:3000
https://yourdomain.com
```

## Step 4: Create Environment File
1. In `chat-app/` folder, create `.env.local`
2. Add the following:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

**Where to find these values:**
- Go to Auth0 Dashboard → Applications → Your App
- **Domain**: Found at the top of the settings page (e.g., `dev-abc123def456.auth0.com`)
- **Client ID**: Found in the settings page

## Step 5: Verify Settings
- ✅ Callback URL: `http://localhost:5173/callback`
- ✅ Logout URL: `http://localhost:5173`
- ✅ Web Origins: `http://localhost:5173`
- ✅ Environment variables set in `.env.local`

## Step 6: Run the Application
```bash
cd chat-app
npm install
npm run dev
```

## Troubleshooting

### Error: "Something went wrong"
**Solution:** Check that:
- Auth0 domain and client ID are correct in `.env.local`
- Callback URL in Auth0 dashboard matches `http://localhost:5173/callback`
- No typos in environment variables

### Error: "Invalid redirect_uri"
**Solution:**
- Make sure `http://localhost:5173/callback` is added in Auth0 Allowed Callback URLs
- Wait a few seconds for Auth0 to update settings

### Environment variables not loading
**Solution:**
- Restart the dev server after creating `.env.local`
- Make sure the file is in the correct directory (`chat-app/.env.local`)
- Variable names must start with `VITE_`

### Still not working?
1. Check browser console for specific Auth0 errors
2. Verify Auth0 domain format: `domain-name.auth0.com` (not just domain name)
3. Make sure `.env.local` is NOT committed to git (add to `.gitignore`)
