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
- **Two-Factor Auth** - TOTP-based 2FA with backup codes and email OTP

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (React 19, App Router) |
| **Backend** | [Convex](https://convex.dev/) (real-time database + serverless functions) |
| **Auth** | [Better Auth](https://better-auth.com/) (email/password, OAuth, 2FA, magic links) |
| **Email** | [Resend](https://resend.com/) + [Nodemailer](https://nodemailer.com/) SMTP fallback |
| **UI** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Logging** | [BetterStack / Logtail](https://betterstack.com/logs) (production) |
| **Language** | TypeScript (strict mode, full-stack type safety) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x
- A free [Convex](https://convex.dev/) account

### 1. Clone & Install

```bash
git clone https://github.com/hasnaintypes/sendable-ai.git
cd sendable-ai
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values. See [Environment Variables](#environment-variables) for details.

Set the same variables in your [Convex dashboard](https://dashboard.convex.dev/) under **Settings > Environment Variables**.

### 3. Start Development

```bash
pnpm dev
```

This starts Next.js + Convex simultaneously. Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
sendable-ai/
├── convex/                       # Backend (Convex serverless)
│   ├── auth/                     # Auth helpers, queries, mutations
│   ├── betterAuth/               # Better Auth schema & config
│   ├── emails/                   # Email service + React Email templates
│   │   ├── email.tsx             # Send actions (Resend + SMTP fallback)
│   │   └── templates/            # Email templates (BaseLayout, Verify, Reset, etc.)
│   ├── lib/                      # Shared backend utilities
│   │   └── logger.ts             # Logger (console local, BetterStack production)
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
│       ├── logger.ts             # Frontend logger (dev console, prod silent)
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
pnpm lint             # ESLint + TypeScript checks
pnpm format           # Prettier format
pnpm format:check     # Check formatting
```

---

## Environment Variables

| Variable | Required | Where | Description |
|----------|----------|-------|-------------|
| `CONVEX_DEPLOYMENT` | Yes | `.env.local` | Convex deployment identifier |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Both | Convex cloud URL |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Yes | Both | Convex HTTP actions URL |
| `SITE_URL` | Yes | Convex | App URL (used for auth origins and email links) |
| `NEXT_PUBLIC_SITE_URL` | Yes | `.env.local` | Public app URL |
| `BETTER_AUTH_SECRET` | Yes | Convex | Auth encryption secret (`openssl rand -base64 32`) |
| `RESEND_API_KEY` | Yes | Convex | Resend API key for production emails |
| `EMAIL_PROVIDER` | No | Convex | `"resend"` (default) or `"smtp"` |
| `SMTP_HOST` | If SMTP | Convex | SMTP server hostname |
| `SMTP_PORT` | No | Convex | SMTP port (default: `587`) |
| `SMTP_USER` | If SMTP | Convex | SMTP username |
| `SMTP_PASS` | If SMTP | Convex | SMTP password |
| `SMTP_SECURE` | No | Convex | `"true"` for TLS (default: `false`) |
| `SMTP_FROM_NAME` | No | Convex | Sender name (default: `Sendable`) |
| `SMTP_FROM_EMAIL` | No | Convex | Sender email (default: `onboarding@resend.dev`) |
| `RESEND_VERIFIED_RECIPIENT` | No | Convex | Restrict Resend to one email (free tier) |
| `LOGTAIL_SOURCE_TOKEN` | No | Convex | BetterStack source token for production logging |
| `GITHUB_CLIENT_ID` | No | Convex | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | Convex | GitHub OAuth client secret |
| `GOOGLE_CLIENT_ID` | No | Convex | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Convex | Google OAuth client secret |
| `SLACK_CLIENT_ID` | No | Convex | Slack OAuth client ID |
| `SLACK_CLIENT_SECRET` | No | Convex | Slack OAuth client secret |

**"Both"** = set in both `.env.local` and Convex dashboard. **"Convex"** = Convex dashboard only.

### Email setup for development

For local development, set `EMAIL_PROVIDER=smtp` and use [Mailpit](https://mailpit.axllent.org/) or [Mailtrap](https://mailtrap.io/):

```bash
# Mailpit (local SMTP catcher)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
```

---

## Authentication

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
- Password strength validation with real-time requirements checklist
- 2FA disable requires password confirmation
- Account linking restricted to same-email only
- User lookup queries require authentication
- CSRF protection via framework defaults (Convex + Better Auth)
- File uploads validated for type and size (2MB max, image types only)
- Structured logging with no PII in production logs (BetterStack)
- Environment variables validated with descriptive error messages

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

```bash
git checkout -b feature/your-feature
# Make changes
pnpm lint              # Verify before committing
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
- [BetterStack](https://betterstack.com/) - Production logging
