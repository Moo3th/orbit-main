# ORBIT - Smart Technical Solutions

A modern Next.js application for ORBIT, a leading Saudi company providing smart technical solutions including SMS platforms, WhatsApp Business API, HR management systems, and government portals.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 🌐 Multi-language support (English/Arabic)
- 🔐 Admin panel for content management
- 📱 Portfolio showcase
- 💼 Client management system
- 📝 Service management
- 💬 Testimonials and FAQs
- 📧 Contact forms and inquiries

## Tech Stack

- **Framework**: Next.js 16
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion, GSAP
- **Rich Text**: TipTap editor

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.example and configure:
# - MONGODB_URI
# - JWT_SECRET

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Database Setup

**⚠️ IMPORTANT**: ORBIT uses a separate database from MarkLine. See [ORBIT_DATABASE_SETUP.md](./ORBIT_DATABASE_SETUP.md) for detailed setup instructions.

Quick setup:
1. Create `orbit` database in MongoDB Atlas
2. Update `.env.local` with `MONGODB_URI=.../orbit?appName=...`
3. Seed initial data:

```bash
# Start dev server first
npm run dev

# Then in another terminal:
node scripts/init-db.js
# Or visit POST /api/seed endpoint
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment to Vercel:
1. Push code to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin panel
│   │   └── ...
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   ├── models/           # MongoDB models
│   └── ...
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## License

Private project - All rights reserved

