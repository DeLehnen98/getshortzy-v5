# GetShortzy v3.0 - Complete Setup Guide

## 🎯 Overview

This guide will walk you through setting up GetShortzy v3.0 from scratch, including:
- Database configuration (Neon)
- Authentication (Clerk - already configured)
- Background jobs (Inngest)
- Video processing (E2B)
- Domain configuration
- Deployment to Vercel

---

## ✅ Prerequisites

- GitHub account
- Vercel account
- Basic understanding of environment variables

---

## 📦 Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/lehnenf98/getshortzy-v3.git
cd getshortzy-v3

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

---

## 🗄️ Step 2: Set Up Neon Database

### 2.1 Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a new project: `getshortzy-production`

### 2.2 Get Database URL

1. In your Neon project dashboard, click "Connection Details"
2. Copy the connection string (starts with `postgresql://`)
3. Add to `.env.local`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 2.3 Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

---

## 🔐 Step 3: Configure Clerk (Already Done!)

Your Clerk keys are already configured:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cmlnaHQtc3VuYmVhbS0zOS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_hdpFk9OOaSdL4yAPpjptKDD8S7yWdU4bSTyVLGJ35v
```

### Configure Webhooks (Important!)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application: `right-sunbeam-39`
3. Go to "Webhooks" → "Add Endpoint"
4. Add endpoint URL: `https://your-domain.com/api/webhooks/clerk`
5. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Copy the signing secret and add to `.env.local`:

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## ⚡ Step 4: Set Up Inngest (Background Jobs)

### 4.1 Create Inngest Account

1. Go to [inngest.com](https://www.inngest.com)
2. Sign up with GitHub
3. Create a new app: `getshortzy`

### 4.2 Get API Keys

1. In Inngest dashboard, go to "Settings" → "Keys"
2. Copy the Event Key and Signing Key
3. Add to `.env.local`:

```env
INNGEST_EVENT_KEY=your_event_key_here
INNGEST_SIGNING_KEY=your_signing_key_here
```

### 4.3 Configure Inngest Endpoint

1. In Inngest dashboard, go to "Apps" → "Sync"
2. Add your app URL: `https://your-domain.com/api/inngest`
3. Click "Sync App"

---

## 🎬 Step 5: Set Up E2B (Video Processing)

### 5.1 Create E2B Account

1. Go to [e2b.dev](https://e2b.dev)
2. Sign up with GitHub
3. Create a new API key

### 5.2 Add E2B API Key

```env
E2B_API_KEY=your_e2b_api_key_here
```

### 5.3 Alternative: Local FFmpeg (Development)

For local development, you can use FFmpeg instead:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows (use Chocolatey)
choco install ffmpeg
```

Then set:

```env
USE_LOCAL_FFMPEG=true
```

---

## 🤖 Step 6: Configure AI Services

### 6.1 OpenAI API

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add to `.env.local`:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### 6.2 Anthropic API (Optional)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Add to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

---

## 🚀 Step 7: Deploy to Vercel

### 7.1 Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

### 7.2 Set Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all variables from `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Inngest
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# E2B
E2B_API_KEY=...

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 7.3 Deploy

```bash
# Deploy to production
vercel --prod
```

---

## 🌐 Step 8: Configure Custom Domain

### 8.1 Add Domain in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `getshortzy.com`
4. Click "Add"

### 8.2 Update DNS Records

Go to your domain registrar (e.g., Namecheap, GoDaddy) and add:

**For Root Domain (getshortzy.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 8.3 Wait for DNS Propagation

- Usually takes 5-30 minutes
- Check status: `https://dnschecker.org`

---

## 🧪 Step 9: Test the Application

### 9.1 Test Authentication

1. Go to your deployed URL
2. Click "Sign Up"
3. Create an account
4. Verify you can access the dashboard

### 9.2 Test Database

1. Create a test project
2. Check Prisma Studio: `npx prisma studio`
3. Verify project was created in database

### 9.3 Test Video Processing (When Configured)

1. Upload a test video or YouTube URL
2. Check Inngest dashboard for job execution
3. Verify clips are generated

---

## 📊 Step 10: Monitor and Scale

### 10.1 Set Up Monitoring

- **Vercel Analytics**: Automatically enabled
- **Sentry** (Optional): Error tracking
- **LogRocket** (Optional): Session replay

### 10.2 Performance Optimization

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### 10.3 Database Optimization

```sql
-- Add indexes for better performance (already in schema)
-- Monitor slow queries in Neon dashboard
```

---

## 💰 Cost Breakdown

### Free Tier (Development)
- Vercel: Free (Hobby plan)
- Neon: Free (0.5 GB storage)
- Clerk: Free (10,000 MAUs)
- Inngest: Free (50,000 steps/month)
- E2B: Free tier available

**Total: $0/month**

### Production (Recommended)
- Vercel Pro: $20/month
- Neon Scale: $19/month
- Clerk Pro: $25/month (25,000 MAUs)
- Inngest: $20/month (500,000 steps)
- E2B: ~$50/month (usage-based)
- OpenAI: ~$30/month (usage-based)

**Total: ~$164/month**

---

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Build Failures

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Clerk Webhook Issues

1. Check webhook endpoint is accessible
2. Verify signing secret matches
3. Check Clerk dashboard logs

### Inngest Not Triggering

1. Verify endpoint is synced
2. Check Inngest dashboard logs
3. Ensure API keys are correct

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Inngest Documentation](https://www.inngest.com/docs)
- [E2B Documentation](https://e2b.dev/docs)
- [tRPC Documentation](https://trpc.io/docs)

---

## 🎉 You're All Set!

Your GetShortzy platform is now fully configured and ready to generate viral shorts!

### Next Steps:

1. ✅ Customize branding and colors
2. ✅ Add payment integration (Stripe)
3. ✅ Implement analytics dashboard
4. ✅ Add more AI features
5. ✅ Create marketing materials

---

## 🆘 Need Help?

- GitHub Issues: [github.com/lehnenf98/getshortzy-v3/issues](https://github.com/lehnenf98/getshortzy-v3/issues)
- Documentation: Check `/docs` folder
- Community: Join our Discord (coming soon)

---

**Built with ❤️ using Next.js 15, React 19, and modern AI**

