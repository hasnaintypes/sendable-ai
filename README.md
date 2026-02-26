# 📧 Sendable.ai

> **AI-powered cold email outreach platform** that automates lead generation, personalized email campaigns, and intelligent response tracking for sales teams.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-FF5722?style=for-the-badge&logo=convex&logoColor=white)](https://convex.dev/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-4A90E2?style=for-the-badge)](https://better-auth.com)

---

## Features

### **Lead Management**
-  **Centralized Lead Database** - Store and manage leads with company, role, source, and enrichment metadata
-  **CSV Import** - Bulk import leads from CSV files with validation
-  **Domain-Based Discovery** - Automatically find leads from target companies
-  **Tagging & Segmentation** - Organize leads by niche, industry, or custom tags
-  **Lead Scoring** - Automatic scoring based on engagement and sentiment trends

### **Email Campaigns**
- **AI-Powered Email Generation** - Personalized cold emails based on intent, tone, and audience
- **Multi-Step Sequences** - Create automated follow-up campaigns with scheduled intervals
- **Per-Campaign AI Instructions** - Test different sales angles and messaging strategies
- **A/B Testing** - Compare message effectiveness across campaigns
- **Rate Limiting & Warm-up** - Built-in safeguards to maintain sender reputation

### **Inbox Integration**
- **Connected Inbox** - Gmail and Outlook integration for seamless sending
- **Reply Syncing** - Automatic detection and threading of conversations
- **Conversation Threading** - Track full conversation history per lead
- **Sentiment Analysis** - AI-powered detection of positive, neutral, or negative responses
- **Intent Detection** - Identify interested leads automatically

### **Response Management**
- **Manual Reply Editor** - Full control with AI-assisted drafting (no auto-replies)
- **Tracking Dashboard** - Monitor replies, interested leads, and conversions
- **Smart Alerts** - Get notified when reply rates or sentiment dip
- **AI Reply Assistance** - Get suggestions while maintaining human touch

### **Analytics & Insights**
- **Sales Funnel Dashboard** - Visualize sent → opened → replied → interested pipeline
- **Performance Analytics** - Track metrics by campaign, niche, role, and message type
- **Monthly Reports** - Automated insights on targeting and copy effectiveness
- **Conversion Tracking** - Monitor leads from first contact to close
- **Deep Analysis** - Identify high-performing niches and messaging patterns

### **Background Jobs**
- **Automated Sending** - Cron-based scheduling for emails and follow-ups
- **Research Automation** - Enrich lead data in the background
- **Research Caching** - Reuse data to reduce costs and improve speed
- **Inbox Sync** - Continuous reply monitoring and conversation updates

---

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (React 19, App Router)
- **Backend**: [Convex](https://convex.dev/) (Realtime database + serverless functions)
- **Authentication**: [Better Auth](https://better-auth.com) (Email/Password, OAuth, 2FA)
- **Email**: [Resend](https://resend.com/) for transactional emails
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **TypeScript**: Full type safety across frontend and backend
- **AI Integration**: Gemini/Anthropic for personalization and analysis

---

## Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **Convex Account** ([Sign up free](https://convex.dev))
- **Gmail/Outlook API** credentials (for inbox integration)
- **Resend API Key** for emails
- **Gemini API Key** for AI features

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hasnaintypes/sendable-ai.git
cd sendable-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Better Auth
BETTER_AUTH_SECRET=your_secret_here
SITE_URL=https://localhost:3000

# OAuth Providers (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
RESEND_API_KEY=your_resend_api_key

# AI
OPENAI_API_KEY=your_openai_api_key
```

### 4. Initialize Convex Database

If running for the first time:

```bash
npx convex dev --once
```

### 5. Run the Development Server

```bash
npm run dev
```

This will start:
- **Frontend**: https://localhost:3000 (Next.js with HTTPS)
- **Backend**: Convex dev server with live reload
- **Type Checking**: Automatic on file changes

Open [https://localhost:3000](https://localhost:3000) in your browser.

---

## Project Structure

```
sendable-ai/
├── convex/                    # Backend (Convex)
│   ├── auth/                  # Authentication logic
│   ├── betterAuth/           # Better Auth configuration
│   ├── emails/               # Email templates
│   ├── todos/                # Example CRUD operations
│   ├── users/                # User management
│   └── schema.ts             # Database schema
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authenticated routes
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   └── settings/    # User settings
│   │   ├── (unauth)/        # Public routes
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── forget-password/
│   │   │   └── reset-password/
│   │   └── api/             # API routes
│   ├── components/           # React components
│   │   ├── auth/            # Auth-related components
│   │   ├── layout/          # Layout components
│   │   ├── ui/              # shadcn/ui components
│   │   └── providers/       # Context providers
│   └── lib/                 # Utilities
│       ├── auth/            # Auth client & server
│       └── utils.ts         # Helper functions
├── public/                   # Static assets
└── package.json
```

---

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server (frontend + backend + type checking)
pnpm build            # Build for production
pnpm lint             # Run ESLint on frontend and backend

# Convex
npx convex dev           # Start Convex backend only
npx convex deploy        # Deploy to production

# Type Checking
tsc --noEmit            # Check types without building
```

---

## Authentication Features

- Email/Password authentication
- Email verification
- Password reset flow
- Two-factor authentication (2FA)
- OAuth (GitHub, Google)
- Magic link login
- OTP verification
- Session management
- Protected routes

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Acknowledgments

- [Convex](https://convex.dev/) - Real-time backend platform
- [Better Auth](https://better-auth.com) - Modern authentication library
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Next.js](https://nextjs.org/) - React framework

---

## Contact

For questions or feedback, reach out via [GitHub Issues](https://github.com/hasnaintypes/sendable-ai/issues).

---

