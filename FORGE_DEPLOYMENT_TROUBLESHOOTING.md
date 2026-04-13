# Laravel Forge Deployment Troubleshooting

## 502 Bad Gateway Error

A 502 error means nginx can't connect to your Next.js application. Here's how to fix it:

## Quick Checklist

1. ✅ **Environment Variables Set** - Check Laravel Forge → Your Site → Environment
2. ✅ **Application Running** - Check if PM2/systemd process is running
3. ✅ **Build Completed** - Ensure `npm run build` succeeded
4. ✅ **MongoDB Connection** - Verify connection string is correct
5. ✅ **Port Configuration** - Ensure app runs on port 3000 (or configured port)

---

## Step-by-Step Fix

### 1. SSH into Your Server

```bash
ssh forge@your-server-ip
# Or use Forge's "SSH" button in the dashboard
```

### 2. Check if Application is Running

```bash
# If using PM2
pm2 list

# If using systemd
sudo systemctl status orbit

# Check if Node process is running
ps aux | grep node
```

### 3. Check Application Logs

```bash
# Navigate to your site directory
cd /home/forge/corbit.sa

# Check PM2 logs (if using PM2)
pm2 logs

# Check application logs
tail -f storage/logs/laravel.log  # If Forge created this
# Or check PM2 logs
pm2 logs --lines 100
```

### 4. Verify Environment Variables

In Laravel Forge dashboard:
- Go to your site → **Environment**
- Ensure these variables are set:

```
MONGODB_URI=mongodb+srv://markline_app:MarkLine2024Secure!@cluster0.e19alq2.mongodb.net/orbit?appName=Cluster0
JWT_SECRET=e69d716e1c631abd8c27562c40f293449568b1ade00c4914391f1d97dc990286
NODE_ENV=production
PORT=3000
```

**Important**: After adding/changing environment variables, restart the application!

### 5. Navigate to Current Release and Check

```bash
cd /home/forge/corbit.sa/current
# Or if using releases structure:
cd /home/forge/corbit.sa/releases/$(ls -t /home/forge/corbit.sa/releases | head -1)

# Check if .env exists (it should be symlinked)
ls -la .env

# Check if node_modules exists
ls -la node_modules

# Check if .next build exists
ls -la .next
```

### 6. Rebuild the Application

```bash
cd /home/forge/corbit.sa/current

# Install dependencies
npm ci

# Build the application
npm run build

# Start the application
npm start
```

### 7. Set Up PM2 (Recommended for Production)

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Navigate to your app
cd /home/forge/corbit.sa/current

# Start with PM2
pm2 start npm --name "orbit" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 8. Configure Laravel Forge Deployment Script

In Forge dashboard → Your Site → **Deploy Script**, ensure it includes:

```bash
cd /home/forge/corbit.sa/current

npm ci
npm run build

# Restart PM2 (if using PM2)
pm2 restart orbit

# Or restart systemd service (if using systemd)
sudo systemctl restart orbit
```

### 9. Check Nginx Configuration

In Forge dashboard → Your Site → **Nginx**, ensure proxy is configured:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 10. Test MongoDB Connection

```bash
cd /home/forge/corbit.sa/current

# Test connection (will show error if it fails)
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.error('❌', e))"
```

---

## Common Issues & Solutions

### Issue: "MONGODB_URI is not defined"

**Solution**: 
- Set `MONGODB_URI` in Forge Environment variables
- Restart the application after setting

### Issue: Application crashes on startup

**Check logs**:
```bash
pm2 logs orbit --lines 50
```

Common causes:
- Missing environment variables
- MongoDB connection failure
- Build errors (missing .next folder)

### Issue: Port already in use

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Issue: npm ci fails

**Solution**: Make sure `package-lock.json` is committed and up to date:
```bash
cd /home/forge/corbit.sa/current
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Fix Script

Run this on your server to quickly diagnose:

```bash
#!/bin/bash
cd /home/forge/corbit.sa/current

echo "🔍 Checking environment..."
[ -z "$MONGODB_URI" ] && echo "❌ MONGODB_URI not set" || echo "✅ MONGODB_URI set"
[ -z "$JWT_SECRET" ] && echo "❌ JWT_SECRET not set" || echo "✅ JWT_SECRET set"

echo ""
echo "🔍 Checking files..."
[ -d "node_modules" ] && echo "✅ node_modules exists" || echo "❌ node_modules missing"
[ -d ".next" ] && echo "✅ .next build exists" || echo "❌ .next build missing"

echo ""
echo "🔍 Checking processes..."
pgrep -f "node.*next" > /dev/null && echo "✅ Next.js process running" || echo "❌ Next.js process NOT running"

echo ""
echo "🔍 Checking port 3000..."
netstat -tuln | grep :3000 > /dev/null && echo "✅ Port 3000 in use" || echo "❌ Port 3000 NOT in use"
```

---

## Still Not Working?

1. **Check Forge logs** in the dashboard
2. **Check server logs**: `journalctl -u orbit -n 50` (if using systemd)
3. **Check PM2 logs**: `pm2 logs orbit --lines 100`
4. **Try running manually** to see errors:
   ```bash
   cd /home/forge/corbit.sa/current
   npm start
   ```
