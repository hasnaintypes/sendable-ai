# Sendable

> AI-powered email outreach platform for sales teams, recruiters, and professionals who need personalized cold emails at scale.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-FF5722?style=flat-square&logo=convex&logoColor=white)](https://convex.dev/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-4A90E2?style=flat-square)](https://better-auth.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## Overview

Sendable generates hyper-personalized outreach emails using AI. It automates audience research, intent-based email generation, and multi-step follow-up sequences so you can focus on closing deals instead of writing cold emails.

### Key Capabilities

- **AI Email Generation** - One-click personalized emails with optimized subject lines, body copy, and CTAs
- **Intent-Based Engine** - Automatically adapts tone and messaging for sales, recruiting, or networking contexts
- **Audience Research** - AI scans prospect web presence and surfaces personalization hooks
- **Smart Follow-ups** - Automated multi-step sequences that keep conversations going
- **Rich Editor** - Dual Markdown/WYSIWYG editor with inline AI rewrites and version history
- **Session Management** - Real-time session tracking with browser detection and revocation
- **Two-Factor Auth** - TOTP-based 2FA with backup codes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (React 19, App Router) |
| **Backend** | [Convex](https://convex.dev/) (real-time database + serverless functions) |
| **Auth** | [Better Auth](https://better-auth.com/) (email/password, OAuth, 2FA, magic links) |
| **Email** | [Resend](https://resend.com/) (transactional emails) |
| **UI** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Language** | TypeScript (strict mode, full-stack type safety) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x (recommended) or npm
- A free [Convex](https://convex.dev/) account

### 1. Clone & Install

```bash
git clone https://github.com/hasnaintypes/sendable-ai.git
cd sendable-ai
pnpm install
```

### 2. Configure Environment

Create `.env.local` in the project root:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=<your_convex_deployment_url>

# Auth
BETTER_AUTH_SECRET=<generate_a_random_secret>
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=<your_resend_api_key>

# OAuth (optional - commented out in code until configured)
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# SLACK_CLIENT_ID=
# SLACK_CLIENT_SECRET=
```

Set the same variables in your [Convex dashboard](https://dashboard.convex.dev/) under Environment Variables.

### 3. Start Development

```bash
pnpm dev
```

This starts the Next.js dev server and Convex backend simultaneously. Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
sendable-ai/
├── convex/                       # Backend (Convex serverless)
│   ├── auth/                     # Auth helpers, queries, mutations
│   ├── betterAuth/               # Better Auth schema & config
│   ├── emails/                   # Email templates (React Email)
│   ├── todos/                    # Example CRUD module
│   ├── userPreferences/          # User profile & notification prefs
│   │   ├── schema.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── upload.ts             # Profile image upload via Convex storage
│   ├── users/                    # User schema (extends Better Auth)
│   └── schema.ts                 # Root schema (composes all tables)
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authenticated routes (dashboard, settings)
│   │   ├── (unauth)/             # Public routes (sign-in, sign-up, etc.)
│   │   └── layout.tsx            # Root layout (providers, font, theme)
│   │
│   ├── components/
│   │   ├── auth/                 # Auth forms (sign-in, sign-up, reset, 2FA)
│   │   ├── dialogs/              # Modal dialogs (delete account, 2FA, change email)
│   │   ├── layout/               # Shell components (AppHeader, AppSidebar, Footer)
│   │   ├── pages/                # Route-specific components
│   │   │   ├── (auth)/settings/  # Settings tab sections
│   │   │   └── (unauth)/home/    # Landing page sections
│   │   ├── providers/            # React context providers
│   │   ├── shared/               # Shared components (Logo, UserMenu, ThemeSwitcher)
│   │   └── ui/                   # shadcn/ui primitives
│   │
│   └── lib/
│       ├── auth/                 # Auth client (browser) & server helpers
│       └── utils.ts              # Utility functions
│
├── public/
│   └── icons/                    # Browser icons, logo, social provider SVGs
│
└── package.json
```

---

## Scripts

```bash
pnpm dev              # Start dev server (Next.js + Convex)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm tsc --noEmit     # Type check (frontend)
pnpm tsc -p convex    # Type check (backend)
```

---

## Authentication

Sendable uses [Better Auth](https://better-auth.com/) integrated with Convex for a full-featured auth system:

| Feature | Status |
|---------|--------|
| Email/password sign-up & sign-in | Active |
| Email verification | Active |
| Password reset flow | Active |
| Two-factor authentication (TOTP) | Active |
| Magic link login | Active |
| OTP verification | Active |
| Session management & revocation | Active |
| Rate limiting (10 req/60s) | Active |
| OAuth (GitHub, Google, Slack) | Ready (env vars needed) |

---

## Security

- Rate limiting on all auth endpoints (10 requests per 60-second window)
- Password strength validation with real-time feedback
- 2FA disable requires password confirmation
- Account linking restricted to same-email only
- OAuth env vars validated at startup (descriptive errors on missing config)
- CSRF protection via framework defaults (Convex + Better Auth)
- File uploads validated for type and size (2MB max, image types only)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

```bash
# Quick start
git checkout -b feature/your-feature
# Make changes
pnpm lint && pnpm tsc --noEmit   # Verify before committing
git commit -m "feat: describe your change"
git push origin feature/your-feature
# Open a Pull Request
```

---

## License

This project is proprietary. All rights reserved.

---

## Acknowledgments

- [Convex](https://convex.dev/) - Real-time backend
- [Better Auth](https://better-auth.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Next.js](https://nextjs.org/) - React framework
- [Resend](https://resend.com/) - Email delivery
