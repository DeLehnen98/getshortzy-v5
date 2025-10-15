# GetShortzy v3.0 🎬✨

**AI-Powered Video Shorts Generator**

Transform long-form videos into viral short-form content for TikTok, YouTube Shorts, and Instagram Reels using advanced AI.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Features

### Core Features
- ✅ **AI Video Analysis** - GPT-4o and Claude analyze videos to find viral moments
- ✅ **Auto Clip Generation** - Automatically creates optimized short clips
- ✅ **Viral Score Prediction** - AI-calculated viral potential for each clip
- ✅ **Multi-Platform Support** - TikTok, YouTube Shorts, Instagram Reels
- ✅ **Smart Captions** - Auto-generated trendy captions and effects
- ✅ **YouTube Import** - Direct import from YouTube URLs
- ✅ **Batch Processing** - Process multiple videos at once

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Clerk
- **API**: tRPC v11 (Type-safe)
- **Background Jobs**: Inngest
- **Video Processing**: E2B Sandboxes
- **AI**: OpenAI GPT-4o, Anthropic Claude
- **Deployment**: Vercel

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- GitHub account
- Vercel account

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/lehnenf98/getshortzy-v3.git
cd getshortzy-v3
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 3. Set Up Environment Variables

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your credentials:

\`\`\`env
# Database
DATABASE_URL="postgresql://..."

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Inngest (Background Jobs)
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# E2B (Video Processing)
E2B_API_KEY="..."

# AI Services
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
\`\`\`

### 4. Set Up Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get deployed in 15 minutes
- **[Complete Setup Guide](./SETUP_GUIDE.md)** - Full configuration walkthrough
- **[Domain Setup](./DOMAIN_SETUP.md)** - Configure custom domain
- **[API Documentation](./docs/API.md)** - tRPC API reference

---

## 🏗️ Project Structure

\`\`\`
getshortzy-v3/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Dashboard pages
│   │   └── api/               # API routes
│   ├── server/                # Server-side code
│   │   ├── api/               # tRPC routers
│   │   ├── db.ts              # Prisma client
│   │   └── inngest/           # Background jobs
│   ├── lib/                   # Utilities
│   │   ├── trpc/              # tRPC client
│   │   └── video-processor.ts # Video processing
│   └── middleware.ts          # Clerk middleware
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── docs/                      # Documentation
\`\`\`

---

## 🎯 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lehnenf98/getshortzy-v3)

1. Click the button above
2. Configure environment variables
3. Deploy!

### Manual Deployment

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
\`\`\`

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

---

## 🔧 Configuration

### Database (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to \`DATABASE_URL\` in environment variables

### Authentication (Clerk)

1. Create account at [clerk.com](https://clerk.com)
2. Create application
3. Copy API keys
4. Add to environment variables

### Background Jobs (Inngest)

1. Create account at [inngest.com](https://inngest.com)
2. Create app
3. Copy API keys
4. Add to environment variables

### Video Processing (E2B)

1. Create account at [e2b.dev](https://e2b.dev)
2. Create API key
3. Add to environment variables

---

## 💰 Pricing

### Free Tier (Perfect for Testing)
- Vercel: Free
- Neon: Free (0.5GB)
- Clerk: Free (10,000 MAUs)
- Inngest: Free (50,000 steps/month)

**Total: $0/month**

### Production (Recommended)
- Vercel Pro: $20/month
- Neon Scale: $19/month
- Clerk Pro: $25/month
- Inngest: $20/month
- E2B: ~$50/month
- OpenAI: ~$30/month

**Total: ~$164/month**

---

## 🛠️ Development

### Available Scripts

\`\`\`bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma Client

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
\`\`\`

### Tech Stack Details

- **Next.js 15**: Latest features, App Router, Server Components
- **React 19**: New features, improved performance
- **Tailwind CSS v4**: Utility-first styling
- **tRPC v11**: End-to-end type safety
- **Prisma**: Type-safe database ORM
- **Clerk**: Complete authentication solution
- **Inngest**: Reliable background jobs

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Clerk for authentication
- All open-source contributors

---

## 📞 Support

- **Documentation**: Check the \`/docs\` folder
- **Issues**: [GitHub Issues](https://github.com/lehnenf98/getshortzy-v3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lehnenf98/getshortzy-v3/discussions)

---

## 🗺️ Roadmap

- [x] Core video processing
- [x] AI-powered clip generation
- [x] Multi-platform support
- [ ] Stripe payment integration
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] API for developers
- [ ] Mobile app (React Native)

---

## ⭐ Show Your Support

If you find this project helpful, please give it a star on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/lehnenf98/getshortzy-v3?style=social)](https://github.com/lehnenf98/getshortzy-v3)

---

**Built with ❤️ using Next.js 15, React 19, and cutting-edge AI**

🚀 **[Get Started Now](./QUICK_START.md)** | 📖 **[Read the Docs](./SETUP_GUIDE.md)** | 🌐 **[Live Demo](https://getshortzy-v3.vercel.app)**
