# ORBIT Database Setup Guide

## ⚠️ IMPORTANT: Database Isolation

This guide will help you set up a **completely separate** database for the ORBIT project without affecting your existing MarkLine database.

## Step 1: Create New Database in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster (the same one you use for MarkLine is fine)
4. Click **"Browse Collections"**
5. In the left sidebar, you'll see your databases
6. Click **"+ Create Database"** button
7. Enter:
   - **Database Name**: `orbit`
   - **Collection Name**: `users` (or any name, it will be created automatically)
8. Click **"Create"**

**✅ You now have a separate `orbit` database that won't affect your `markline` database**

## Step 2: Update .env.local File

Open your `.env.local` file and update both `MONGODB_URI` and `JWT_SECRET`:

### Current (MarkLine - DO NOT CHANGE):
```env
MONGODB_URI=mongodb+srv://markline_app:MarkLine2024Secure!@cluster0.e19alq2.mongodb.net/markline?appName=Cluster0
JWT_SECRET=adb52e575e85840f169f23fd2b870f69ad4ec1fde9ce90997fe2ffb8ba1f3360
```

### New (ORBIT - Use This):
```env
MONGODB_URI=mongodb+srv://markline_app:MarkLine2024Secure!@cluster0.e19alq2.mongodb.net/orbit?appName=Cluster0
JWT_SECRET=your-unique-orbit-jwt-secret-key-here
NODE_ENV=development
```

**Important Notes:**
- **MONGODB_URI**: Only the database name changed from `markline` to `orbit` at the end
- **JWT_SECRET**: ⚠️ **MUST be different** from MarkLine's JWT_SECRET for security isolation
  - JWT_SECRET is used to sign and verify authentication tokens
  - If both projects use the same secret, tokens from one project could work in the other (security risk!)
  - Generate a new random secret for ORBIT (see below)

### Generate a Secure JWT_SECRET

You can generate a secure random JWT secret using:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
- Use a secure random string generator (at least 32 characters)
- Example format: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

**What is JWT_SECRET used for?**
- Signs JWT tokens when users log in to the admin panel
- Verifies JWT tokens to authenticate admin users
- Ensures tokens can't be tampered with or used across projects

## Step 3: Verify Database Connection

The code is already configured to use the `orbit` database:
- Default fallback: `mongodb://localhost:27017/orbit`
- Reads from `MONGODB_URI` environment variable
- **Will NOT touch the `markline` database**

## Step 4: Seed the ORBIT Database

After updating `.env.local`, run the seed script:

```bash
npm run dev
```

Then in another terminal or browser, call:
```
POST http://localhost:3000/api/seed
```

Or use the init script:
```bash
node scripts/init-db.js
```

## Database Structure

The ORBIT database will contain:
- `users` - Admin users
- `services` - Service listings (currently empty, using static components)
- `clients` - Client portfolio
- `testimonials` - Customer testimonials
- `faqs` - Frequently asked questions
- `clientinquiries` - Contact form submissions
- `aboutsettings` - About page content
- `uniquefeatures` - Unique features content
- `packages` - Package offerings

## Safety Checklist

✅ **Code uses `orbit` database name** - Verified in `src/lib/mongodb.ts`  
✅ **Seed script only creates ORBIT admin user** - No MarkLine data  
✅ **Environment variable controls database** - Isolated via .env.local  
✅ **No hardcoded `markline` references** - All use `orbit` or environment variable  
✅ **JWT_SECRET is unique** - Different from MarkLine to prevent token cross-contamination  

## Troubleshooting

### If you see connection errors:
1. Make sure the `orbit` database exists in MongoDB Atlas
2. Verify `.env.local` has the correct database name (`orbit` not `markline`)
3. Check MongoDB Atlas IP whitelist allows your connection
4. Verify your MongoDB user has read/write permissions

### If you see authentication errors:
1. Verify `JWT_SECRET` is set in `.env.local`
2. Make sure `JWT_SECRET` is different from MarkLine's secret
3. Clear browser cookies if you had logged into MarkLine admin panel
4. Try logging in again with ORBIT admin credentials

### To verify you're using the correct database:
- Check MongoDB Atlas → Browse Collections
- You should see `orbit` database with collections
- The `markline` database should remain untouched

## Default Admin Credentials

After seeding:
- **Email**: `admin@orbit.com.sa`
- **Password**: `Abd123#Abd`

**⚠️ Change this password after first login!**







