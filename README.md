# RAPID — Read, Analyze, Patch, Implement & Document

RAPID is a full-stack AI-powered application (web + mobile) that analyzes any type of code, database schemas, dashboards, or data patterns to surface actionable improvements focused on **cost savings** and **reliability**.

## Architecture

```
/
├── web/          # Next.js 14 web application
└── mobile/       # Expo React Native mobile application
```

## Web App (`/web`)

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom UI components
- **Auth**: NextAuth.js v4 (Google, GitHub, Email/Password)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe (subscriptions + webhooks)
- **Language**: TypeScript

### Features
1. **Read** — Upload any file or paste code (50+ languages supported)
2. **Analyze** — AI-powered engine detects inefficiencies, anti-patterns, cost leaks
3. **Patch** — Generates precise before/after code diffs
4. **Implement** — One-click implementation with explicit client approval required
5. **Document** — Auto-generates technical docs for every change

### Key Modules
| Route | Description |
|-------|-------------|
| `/` | Landing page with features, pricing |
| `/auth/signin` | Sign in (OAuth + credentials) |
| `/auth/signup` | Create account |
| `/dashboard` | Overview with stats and recent activity |
| `/dashboard/analyze` | Upload/paste code for analysis |
| `/dashboard/suggestions` | Review and approve improvements |
| `/dashboard/implementation` | Track and apply approved changes |
| `/dashboard/documentation` | Auto-generated docs |
| `/dashboard/analytics` | Charts and metrics |
| `/dashboard/billing` | Stripe subscription management |
| `/dashboard/api-keys` | API key management |
| `/dashboard/settings` | Profile and preferences |

### Pricing Plans
| Plan | Price | Analyses | Features |
|------|-------|----------|---------|
| Free | $0 | 5/month | Basic analysis |
| Starter | $9/mo | 50/month | All languages, API access |
| Pro | $29/mo | Unlimited | Full features, team collaboration |
| Enterprise | $99/mo | Unlimited | SSO, SLA, dedicated support |

## Mobile App (`/mobile`)

### Tech Stack
- **Framework**: Expo + React Native
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for React Native)
- **State**: Zustand
- **Language**: TypeScript

### Screens
| Screen | Description |
|--------|-------------|
| Auth | Sign in/up with demo mode |
| Home | Dashboard with stats and recent analyses |
| Analyze | Code paste + AI analysis |
| Suggestions | Review and approve improvements |
| Documents | View auto-generated documentation |
| Settings | Profile, notifications, billing |

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (free tier: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
- Stripe account (for payments)
- Google/GitHub OAuth apps (for social login)

### Web App Setup

```bash
cd web

# Copy env file
cp .env.example .env.local

# Fill in your environment variables
# DATABASE_URL, NEXTAUTH_SECRET, GOOGLE/GITHUB credentials, STRIPE keys

# Install dependencies
npm install

# Push database schema
npx prisma db push

# Seed demo data (optional)
npm run db:seed

# Start development server
npm run dev
```

### Mobile App Setup

```bash
cd mobile

# Copy env file
cp .env.example .env

# EXPO_PUBLIC_API_URL=http://localhost:3000 (or your deployed URL)

# Install dependencies
npm install

# Start Expo development server
npm start
# Press 'i' for iOS simulator, 'a' for Android, 'w' for web
```

## Environment Variables

### Web (`web/.env.local`)

```env
# PostgreSQL
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-min-32-chars"

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."
```

### Mobile (`mobile/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Database Schema

Key models:
- **User** — NextAuth user with role and subscription
- **Analysis** — Code/data analysis with scores
- **Suggestion** — Improvement recommendations with status tracking
- **Implementation** — Approved and applied changes
- **Document** — Auto-generated documentation
- **Subscription** — Stripe billing info
- **ApiKey** — Programmatic API access

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Run new analysis |
| `/api/suggestions/[id]` | PATCH | Approve/dismiss suggestion |
| `/api/implement/[id]` | POST | Apply/rollback implementation |
| `/api/stripe/checkout` | POST | Create Stripe checkout |
| `/api/stripe/portal` | POST | Open billing portal |
| `/api/stripe/webhook` | POST | Handle Stripe events |
| `/api/api-keys` | POST/GET | Manage API keys |

## Stripe Webhook Events

The webhook handler at `/api/stripe/webhook` handles:
- `checkout.session.completed` → Activate subscription
- `invoice.payment_succeeded` → Renew subscription
- `invoice.payment_failed` → Mark as past due
- `customer.subscription.deleted` → Downgrade to Free
- `customer.subscription.updated` → Update plan

## Demo Account

After seeding the database, use:
- **Email**: demo@rapid.dev
- **Password**: demo1234!
- **Plan**: PRO
