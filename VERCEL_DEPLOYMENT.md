# Vercel Deployment Guide for ORBIT

## Deployment Steps Overview

1. ✅ **Seed Database** - Set up ORBIT database with initial data
2. ✅ **Test Locally** - Verify everything works
3. ✅ **Push to GitHub** - Commit and push code to repository
4. ✅ **Deploy to Vercel** - Link GitHub repo to Vercel
5. ✅ **Configure Environment Variables** - Set up production environment

---

## Step 1: Seed the Database

Before deploying, make sure your database is seeded:

```bash
# 1. Start development server
npm run dev

# 2. In another terminal, seed the database
node scripts/init-db.js
```

**Verify:**
- Database connection works
- Admin user created: `admin@orbit.com.sa` / `Abd123#Abd`
- You can log in to `/admin` page

---

## Step 2: Test Everything Locally

Test these before deploying:

- [ ] Homepage loads correctly
- [ ] Admin login works (`/admin`)
- [ ] Admin dashboard accessible
- [ ] All pages load without errors
- [ ] Database connections work
- [ ] No console errors

---

## Step 3: Push to GitHub

### 3.1 Commit All Changes

```bash
# Add all files
git add .

# Commit with message
git commit -m "Rebrand to ORBIT - Admin panel, database setup, and deployment ready"

# Push to GitHub
git push origin main
```

### 3.2 Verify GitHub Repository

- Go to: https://github.com/A7mDFaraj/orbit
- Verify all files are pushed
- Check that `.env.local` is NOT in the repo (it's in .gitignore)

---

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select **"A7mDFaraj/orbit"** from GitHub
5. Click **"Import"**

### 4.2 Configure Build Settings

Vercel should auto-detect Next.js, but verify:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 4.3 Set Environment Variables

**⚠️ CRITICAL: Add these in Vercel Dashboard before deploying**

Go to **Settings** → **Environment Variables** and add:

```env
MONGODB_URI=mongodb+srv://markline_app:MarkLine2024Secure!@cluster0.e19alq2.mongodb.net/orbit?appName=Cluster0
JWT_SECRET=e69d716e1c631abd8c27562c40f293449568b1ade00c4914391f1d97dc990286
NODE_ENV=production
```

**Important:**
- Add these for **Production**, **Preview**, and **Development** environments
- Click **"Save"** after adding each variable
- **DO NOT** commit these to GitHub (they're in .gitignore)

### 4.4 Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-5 minutes)
3. Check build logs for any errors

---

## Step 5: Post-Deployment Setup

### 5.1 Seed Production Database

After first deployment, seed the production database:

1. Visit: `https://your-app.vercel.app/api/seed`
2. Or use the Vercel CLI:
   ```bash
   vercel env pull .env.local
   node scripts/init-db.js
   ```

**Note:** You may need to update the script to use production URL instead of localhost.

### 5.2 Verify Deployment

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Admin login works: `https://your-app.vercel.app/admin`
- [ ] Database connections work
- [ ] No build errors in Vercel logs

---

## Step 6: Custom Domain (Optional)

If you have a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

---

## Environment Variables Reference

### Required for Production:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://.../orbit?appName=...` | ORBIT database connection |
| `JWT_SECRET` | `e69d716e1c631abd8c27562c40f293449568b1ade00c4914391f1d97dc990286` | JWT signing secret |
| `NODE_ENV` | `production` | Environment mode |

### ⚠️ Security Notes:

- **Never commit** `.env.local` to GitHub
- **Never share** JWT_SECRET publicly
- Use **different** JWT_SECRET for production (optional but recommended)
- MongoDB credentials should be kept secure

---

## Troubleshooting

### Build Fails

1. Check Vercel build logs
2. Verify all dependencies in `package.json`
3. Check for TypeScript errors: `npm run build` locally
4. Ensure Node.js version is compatible (Vercel uses Node 18+ by default)

### Database Connection Errors

1. Verify `MONGODB_URI` is set correctly in Vercel
2. Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
3. Verify database name is `orbit` not `markline`

### Authentication Issues

1. Verify `JWT_SECRET` matches between local and production
2. Clear browser cookies if switching between environments
3. Check that admin user exists in production database

### 404 Errors on Routes

1. Check `next.config.ts` for any route rewrites
2. Verify all pages are in correct directories
3. Check Vercel build logs for route generation

---

## Quick Deployment Checklist

Before pushing to GitHub:
- [ ] Database seeded locally
- [ ] All tests pass
- [ ] No console errors
- [ ] `.env.local` is NOT committed
- [ ] All ORBIT branding is correct
- [ ] Admin panel works

Before deploying to Vercel:
- [ ] Code pushed to GitHub
- [ ] Environment variables ready
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Build command verified

After deployment:
- [ ] Production database seeded
- [ ] Admin login tested
- [ ] All pages load correctly
- [ ] No errors in Vercel logs

---

## MongoDB Atlas IP Whitelist for Vercel

Since Vercel uses dynamic IPs, you need to:

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Or add specific Vercel IP ranges (check Vercel docs)

**Security Note:** Using `0.0.0.0/0` allows from anywhere, but your database is still protected by username/password authentication.

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check MongoDB Atlas connection logs
3. Verify environment variables are set correctly
4. Test locally first before deploying

**Your GitHub Repo:** https://github.com/A7mDFaraj/orbit  
**Vercel Dashboard:** https://vercel.com/dashboard






