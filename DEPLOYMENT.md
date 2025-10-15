# GetShortzy v3.0 - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites

1. **Neon Database** (https://neon.tech)
2. **Clerk Account** (https://clerk.com)
3. **Inngest Account** (https://inngest.com)
4. **E2B Account** (https://e2b.dev)
5. **OpenAI API Key** (https://platform.openai.com)
6. **Anthropic API Key** (https://console.anthropic.com)

---

## Step 1: Set Up Database

### Create Neon Database

```bash
# 1. Go to https://neon.tech
# 2. Create new project
# 3. Copy connection string
```

### Initialize Database

```bash
cd /home/ubuntu/getshortzy-v3

# Create .env.local
echo 'DATABASE_URL="postgresql://..."' > .env.local

# Push schema
npm run db:push
```

---

## Step 2: Set Up Clerk

### Create Clerk Application

```bash
# 1. Go to https://clerk.com
# 2. Create new application
# 3. Enable Email/Password + Google OAuth
# 4. Copy keys
```

### Configure Clerk

Add to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### Set Up Webhooks

```bash
# 1. Go to Clerk Dashboard → Webhooks
# 2. Add endpoint: https://your-app.vercel.app/api/webhooks/clerk
# 3. Subscribe to: user.created, user.updated, user.deleted
# 4. Copy signing secret
```

Add to `.env.local`:

```env
CLERK_WEBHOOK_SECRET="whsec_..."
```

---

## Step 3: Set Up Inngest

### Create Inngest Account

```bash
# 1. Go to https://inngest.com
# 2. Create new app
# 3. Copy keys
```

Add to `.env.local`:

```env
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."
```

### Register Functions

```bash
# After deployment, go to:
# https://your-app.vercel.app/api/inngest

# Inngest will auto-discover your functions
```

---

## Step 4: Set Up E2B

### Get API Key

```bash
# 1. Go to https://e2b.dev
# 2. Create account
# 3. Get API key
```

Add to `.env.local`:

```env
E2B_API_KEY="..."
```

---

## Step 5: Set Up AI Keys

### OpenAI

```bash
# 1. Go to https://platform.openai.com
# 2. Create API key
```

### Anthropic

```bash
# 1. Go to https://console.anthropic.com
# 2. Create API key
```

Add to `.env.local`:

```env
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

---

## Step 6: Deploy to Vercel

### Push to GitHub

```bash
cd /home/ubuntu/getshortzy-v3

git init
git add .
git commit -m "GetShortzy v3.0 - Production Ready"

# Create GitHub repo and push
gh repo create getshortzy-v3 --public --source=. --push
```

### Deploy to Vercel

```bash
# 1. Go to https://vercel.com/new
# 2. Import getshortzy-v3 repository
# 3. Framework Preset: Next.js
# 4. Root Directory: ./
# 5. Add all environment variables from .env.local
# 6. Deploy!
```

### Environment Variables in Vercel

Set these in Vercel Dashboard → Settings → Environment Variables:

```env
# Database
DATABASE_URL=postgresql://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Inngest
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# E2B
E2B_API_KEY=...

# AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## Step 7: Post-Deployment

### 1. Update Clerk Redirect URLs

```bash
# In Clerk Dashboard → Paths
# Add your Vercel domain:
# https://your-app.vercel.app
```

### 2. Register Inngest Functions

```bash
# Visit: https://your-app.vercel.app/api/inngest
# Inngest will auto-register your functions
```

### 3. Test the App

```bash
# 1. Sign up at https://your-app.vercel.app/sign-up
# 2. Go to dashboard
# 3. Create a project
# 4. Check Inngest dashboard for job status
```

---

## 🧪 Local Development

### Run Locally

```bash
cd /home/ubuntu/getshortzy-v3

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# Initialize database
npm run db:push

# Run dev server
npm run dev
```

### Test Webhooks Locally

```bash
# Install Clerk CLI
npm install -g @clerk/cli

# Forward webhooks
clerk webhooks forward --url http://localhost:3000/api/webhooks/clerk
```

### Test Inngest Locally

```bash
# Install Inngest CLI
npm install -g inngest-cli

# Run Inngest dev server
inngest-cli dev

# Your app will connect automatically
```

---

## 📊 Monitoring

### Clerk Dashboard
- User analytics
- Authentication logs
- Webhook logs

### Inngest Dashboard
- Function runs
- Error tracking
- Performance metrics

### Vercel Dashboard
- Deployment logs
- Function logs
- Analytics

### Neon Dashboard
- Database metrics
- Query performance
- Storage usage

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Check build logs in Vercel
# Common issues:
# - Missing environment variables
# - Prisma schema errors
# - TypeScript errors
```

### Webhooks Not Working

```bash
# Check Clerk webhook logs
# Verify signing secret
# Test endpoint manually
```

### Inngest Functions Not Running

```bash
# Check Inngest dashboard
# Verify API keys
# Check function registration
```

### Database Connection Issues

```bash
# Verify DATABASE_URL
# Check Neon dashboard
# Test connection locally
```

---

## 🎯 Production Checklist

- [ ] Database created and schema pushed
- [ ] Clerk application configured
- [ ] Clerk webhooks set up
- [ ] Inngest account created
- [ ] E2B API key obtained
- [ ] OpenAI API key set
- [ ] Anthropic API key set
- [ ] All environment variables in Vercel
- [ ] GitHub repository created
- [ ] Deployed to Vercel
- [ ] Clerk redirect URLs updated
- [ ] Inngest functions registered
- [ ] Test signup/login
- [ ] Test project creation
- [ ] Test video processing

---

## 🚀 You're Live!

Your GetShortzy v3.0 is now live at:
**https://your-app.vercel.app**

Features:
✅ AI-powered video analysis
✅ Automatic clip generation
✅ Viral score calculation
✅ Background processing
✅ Credit system
✅ Multi-platform optimization

---

**Need help?** Check the README.md or create an issue on GitHub.

