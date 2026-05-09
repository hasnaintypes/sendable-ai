# sendable-web

> Frontend application for Sendable AI — an autonomous outreach platform that discovers prospects, researches them, and sends personalized emails on your behalf.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-FF5722?style=flat-square&logo=convex&logoColor=white)](https://convex.dev/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-4A90E2?style=flat-square)](https://better-auth.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## What This Repo Is

This is the Next.js frontend and Convex backend for Sendable AI. It handles:

- All user-facing UI (campaigns, leads, inbox, analytics, settings)
- Authentication via Better Auth
- Real-time data sync via Convex
- Communicates with the agent backend via REST API (`sendable-api`)

**This repo does not contain AI agents, background jobs, or the prospect dataset.** Those live in [`sendable-api`](https://github.com/hasnaintypes/sendable-api).

---

## System Architecture (Brief)

```
sendable-web (this repo)          sendable-api (separate repo)
─────────────────────────         ────────────────────────────
Next.js + Convex                  FastAPI + Inngest + Neon
     │                                      │
     │  REST calls (JWT)  ──────────────►   │
     │                                      │
     │  ◄── writes back via Convex HTTP ─── │
     │                                      │
Convex Cloud ◄────────────────────────── Convex HTTP actions
```

For full system architecture see the architecture document in the project docs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Product Backend | Convex (real-time database + serverless functions) |
| Auth | Better Auth (email/password, OAuth, 2FA, magic links) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Email (transactional) | Resend + Nodemailer SMTP fallback |
| Animations | Framer Motion |
| Logging | BetterStack / Logtail (production) |
| Language | TypeScript (strict mode) |
| Package Manager | pnpm |

---

## Project Structure

```
sendable-web/
├── convex/                         # Convex serverless backend
│   ├── betterAuth/                 # Better Auth adapter + schema
│   │   ├── adapter.ts
│   │   ├── auth.ts
│   │   └── schema.ts
│   ├── auth/                       # Auth helpers, queries, mutations
│   ├── emails/                     # Transactional email service
│   │   ├── email.tsx               # Send actions (Resend + SMTP fallback)
│   │   └── templates/              # React Email templates
│   ├── campaigns/                  # Campaign queries + mutations
│   ├── prospects/                  # Campaign prospect queries + mutations
│   ├── drafts/                     # Draft queries + mutations
│   ├── jobStatus/                  # Live job status + campaign logs
│   ├── leads/                      # Lead management queries + mutations
│   ├── sequences/                  # Sequence + sequence step mutations
│   ├── usage/                      # Usage counter queries + mutations
│   ├── notifications/              # Notification queries + mutations
│   ├── connectedInboxes/           # Inbox connection queries + mutations
│   ├── userPreferences/            # Profile + preferences
│   ├── users/                      # User schema + queries
│   ├── lib/
│   │   └── logger.ts               # Backend logger
│   ├── http.ts                     # Convex HTTP actions (receives FastAPI writes)
│   └── schema.ts                   # Root schema
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   │   ├── import/
│   │   │   │   └── segments/
│   │   │   ├── campaigns/
│   │   │   │   ├── new/
│   │   │   │   ├── templates/
│   │   │   │   ├── sequences/
│   │   │   │   └── [id]/
│   │   │   │       └── prospect/[pid]/
│   │   │   ├── inbox/
│   │   │   │   ├── interested/
│   │   │   │   └── pending/
│   │   │   ├── analytics/
│   │   │   │   ├── campaigns/
│   │   │   │   ├── scoring/
│   │   │   │   └── reports/
│   │   │   └── settings/
│   │   │       ├── profile/
│   │   │       ├── security/
│   │   │       ├── inboxes/
│   │   │       ├── billing/
│   │   │       └── notifications/
│   │   ├── (unauth)/               # Public routes
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── verify-email/
│   │   │   ├── forget-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-2fa/
│   │   ├── api/
│   │   │   └── auth/[...all]/      # Better Auth handler
│   │   ├── docs/                   # Internal docs viewer
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── auth/                   # Sign in, sign up, reset, 2FA forms
│   │   ├── campaigns/              # Campaign creation, list, live view
│   │   ├── leads/                  # Lead list, import, segments
│   │   ├── inbox/                  # Message inbox, reply management
│   │   ├── analytics/              # Analytics charts and reports
│   │   ├── editor/                 # Tiptap email draft editor
│   │   ├── dialogs/                # Modal dialogs
│   │   ├── layout/                 # AppSidebar, AppHeader, Footer
│   │   ├── pages/                  # Route-level page components
│   │   ├── providers/              # ConvexClientProvider, ThemeProvider
│   │   ├── shared/                 # Logo, UserMenu, CommandMenu, NotificationCenter
│   │   └── ui/                     # shadcn/ui primitives
│   │
│   ├── hooks/                      # Custom React hooks
│   │
│   └── lib/
│       ├── auth/
│       │   ├── client.ts           # Better Auth browser client
│       │   └── server.ts           # Better Auth server helpers
│       ├── api.ts                  # Typed HTTP client for sendable-api calls
│       ├── logger.ts               # Frontend logger
│       └── utils.ts
│
└── public/
    └── icons/                      # Logo, provider SVGs
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x
- A [Convex](https://convex.dev/) account
- `sendable-api` running locally (for campaign features)

### 1. Clone and install

```bash
git clone https://github.com/hasnaintypes/sendable-web.git
cd sendable-web
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`. See [Environment Variables](#environment-variables) below.

### 3. Start development

```bash
pnpm dev
```

Starts Next.js and Convex simultaneously. Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### `.env.local` (Next.js)

| Variable | Required | Description |
|---|---|---|
| `CONVEX_DEPLOYMENT` | Yes | Convex deployment identifier |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex cloud WebSocket URL |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Yes | Convex HTTP actions URL |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public app URL e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Yes | `sendable-api` base URL e.g. `http://localhost:8000` |

### Convex Dashboard Environment Variables

Set these in your [Convex dashboard](https://dashboard.convex.dev/) under **Settings > Environment Variables**.

| Variable | Required | Description |
|---|---|---|
| `SITE_URL` | Yes | App URL — used for auth redirect URLs and email links |
| `BETTER_AUTH_SECRET` | Yes | Auth encryption secret (`openssl rand -base64 32`) |
| `RESEND_API_KEY` | Yes | Resend API key for transactional emails |
| `EMAIL_PROVIDER` | No | `"resend"` (default) or `"smtp"` |
| `SMTP_HOST` | If SMTP | SMTP server hostname |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_USER` | If SMTP | SMTP username |
| `SMTP_PASS` | If SMTP | SMTP password |
| `SMTP_SECURE` | No | `"true"` for TLS |
| `SMTP_FROM_NAME` | No | Sender name (default: `Sendable`) |
| `SMTP_FROM_EMAIL` | No | Sender email |
| `RESEND_VERIFIED_RECIPIENT` | No | Restrict to one address (Resend free tier) |
| `LOGTAIL_SOURCE_TOKEN` | No | BetterStack token for production logging |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret |

### Local email setup

For local development use [Mailpit](https://mailpit.axllent.org/):

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
```

---

## Scripts

```bash
pnpm dev            # Start Next.js + Convex dev server
pnpm build          # Production build
pnpm lint           # ESLint + TypeScript checks
pnpm format         # Prettier format
pnpm format:check   # Check formatting without writing
```

---

## Authentication

| Feature | Status |
|---|---|
| Email / password sign-up and sign-in | ✅ Active |
| Email verification | ✅ Active |
| Password reset | ✅ Active |
| Two-factor authentication (TOTP) | ✅ Active |
| Magic link login | ✅ Active |
| OTP verification | ✅ Active |
| Session management and revocation | ✅ Active |
| Google OAuth | ✅ Ready (env vars needed) |
| GitHub OAuth | ✅ Ready (env vars needed) |
| Gmail inbox OAuth (for sending) | 🔧 In progress |

> Gmail inbox OAuth for outreach sending is separate from sign-in OAuth. It is configured in Settings → Connected Inboxes and handled via `sendable-api`.

---

## Convex HTTP Actions

`convex/http.ts` exposes HTTP endpoints that `sendable-api` calls to write data back into Convex after agent jobs complete. These are not called by the frontend directly.

Endpoints include:
- `POST /convex/campaigns/update-status`
- `POST /convex/campaigns/append-log`
- `POST /convex/prospects/update`
- `POST /convex/drafts/create`
- `POST /convex/usage/increment`
- `POST /convex/notifications/create`

All require a `CONVEX_DEPLOY_KEY` bearer token set in `sendable-api`'s environment. They are not publicly accessible.

---

## Related Repos

| Repo | Description |
|---|---|
| [`sendable-api`](https://github.com/hasnaintypes/sendable-api) | FastAPI agent backend — prospect discovery, research, email generation, sending |

---

## License

Proprietary. All rights reserved.