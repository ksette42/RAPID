# RAPID — Complete Guide
### Read · Analyze · Patch · Implement · Document

---

## Table of Contents

1. [What is RAPID?](#1-what-is-rapid)
2. [How the App Works — Step by Step](#2-how-the-app-works--step-by-step)
3. [Application Architecture](#3-application-architecture)
4. [Local Development Setup](#4-local-development-setup)
5. [Testing the App](#5-testing-the-app)
6. [Going Live — Production Deployment](#6-going-live--production-deployment)
7. [Observability & Monitoring](#7-observability--monitoring)
8. [Go-to-Market Checklist](#8-go-to-market-checklist)
9. [Full Stack Reference](#9-full-stack-reference)

---

## 1. What is RAPID?

RAPID is an AI-powered full-stack application — available as both a **web app** (Next.js) and a **mobile app** (Expo React Native) — that analyzes any type of code, database schema, dashboard, or data pattern to surface actionable improvements focused on two things:

- **Cost savings** — reduce your cloud bill, database spend, and infrastructure waste
- **Reliability** — identify single points of failure, race conditions, and architectural weaknesses before they hit production

The name describes the exact pipeline the app follows:

| Letter | Stage | What Happens |
|--------|-------|-------------|
| **R** | Read | Accept any code file or pasted snippet in 50+ languages |
| **A** | Analyze | AI engine scans for anti-patterns, inefficiencies, and vulnerabilities |
| **P** | Patch | Generates precise before/after code diffs with dollar savings per change |
| **I** | Implement | Applies changes only with your explicit approval — never automatically |
| **D** | Document | Auto-generates technical reports for every analysis and change |

---

## 2. How the App Works — Step by Step

### Step 1 — R: Read (Input)

You give RAPID something to analyze. There are two input methods:

**Option A — Drag and drop a file**
Any source file works: `.py`, `.ts`, `.go`, `.sql`, `.tf`, `.yaml`, `.json`, `.java`, `.rs`, `.php`, and more. The app reads the file extension and content to detect the programming language automatically.

**Option B — Paste code directly**
Copy and paste a snippet, a full file, a SQL query, an API spec, a Terraform config — anything text-based.

You also select the **analysis type** before running:

| Type | What You're Analyzing |
|------|-----------------------|
| Source Code | JavaScript, Python, Go, Rust, Java, C#, PHP, and 45+ more |
| Database Schema | SQL schemas, query plans, migration files, index definitions |
| Dashboard / Metrics | Grafana JSON exports, metric configs, monitoring data |
| API Definition | OpenAPI/Swagger specs, REST endpoint definitions |
| Infrastructure | Terraform, Kubernetes YAML, Docker Compose, Helm charts |
| General Data | Any structured or semi-structured data pattern |

Nothing leaves the page until you click **Run Analysis**.

---

### Step 2 — A: Analyze (The Engine)

Once you click Run, the backend processes the input through several layers:

**Language Detection**
Pattern matching on file content identifies the language even without an extension. Examples:
- `SELECT`, `INSERT`, `CREATE TABLE` → SQL
- `func main()` + `package main` → Go
- `interface` + `: string` type annotations → TypeScript
- `def `, `import `, `print(` → Python
- `resource "` + `provider "` → Terraform

**Pattern Scanning**
The engine scans for known anti-patterns that cost money or reduce reliability:

| Pattern Found | Impact | Estimated Saving |
|--------------|--------|-----------------|
| `SELECT *` usage | Excess data transfer | $100–400/month |
| N+1 query loops | Database overload | $200–600/month |
| No connection pooling | Connection overhead | $100–300/month |
| Missing cache layer | Redundant DB reads | $200–500/month |
| Synchronous file I/O | Event loop blocking | $50–150/month |
| No circuit breaker | Cascade failure risk | Availability cost |
| Chained `.filter().map()` | Wasted CPU cycles | Performance cost |
| Hardcoded credentials | Security + ops risk | Compliance cost |
| Queries without indexes | Slow table scans | $100–400/month |
| Uncleaned timers | Memory leaks | Stability cost |

**Scoring**
Three scores are computed and stored per analysis:

- **Reliability Score** (0–100) — how fault-tolerant and resilient the code is
- **Performance Score** (0–100) — how efficiently it uses compute and I/O
- **Estimated Cost Savings** ($/month) — sum of all identified saving opportunities

**Persistence**
The analysis, all scores, the raw content, and every generated suggestion are saved to your PostgreSQL database and associated with your account.

---

### Step 3 — P: Patch (Suggestions)

The analysis produces a prioritized list of **Suggestions** — each one is a concrete, actionable improvement with a before/after code diff:

```
┌──────────────────────────────────────────────────────────────┐
│  [HIGH PRIORITY]  [COST SAVING]               Save $300/mo  │
│                                                              │
│  Replace SELECT * with specific columns                      │
│                                                              │
│  Selecting all columns increases data transfer by 3–5x.     │
│  Use specific column names to reduce bandwidth and DB cost.  │
│                                                              │
│  BEFORE:                                                     │
│    SELECT * FROM users WHERE id = ?                          │
│                                                              │
│  AFTER:                                                      │
│    SELECT id, name, email FROM users WHERE id = ?            │
│                                                              │
│  Estimated effort: 1–2 hours                                 │
└──────────────────────────────────────────────────────────────┘
```

Every suggestion includes:

- **Priority level** — Critical / High / Medium / Low
- **Category** — Cost Saving / Performance / Reliability / Security / Maintainability / Scalability
- **Estimated monthly savings** in dollars
- **Estimated implementation effort** (hours)
- **Before/after code diff** showing exactly what to change

Suggestions are sorted by priority first, then estimated impact. The total pending savings figure at the top of the Suggestions page shows the cumulative dollar amount you would save per month if all pending suggestions were implemented.

---

### Step 4 — I: Implement (Permission Gate)

This is the most critical design decision in RAPID: **nothing is ever changed automatically**.

Every change goes through a two-step approval workflow:

```
Suggestion Generated
        ↓
  You review the suggestion
  (read the description and diff)
        ↓
   ┌────────────┐
   │  Approve   │ ──→ Queued for Implementation
   │  Dismiss   │ ──→ Archived, nothing happens
   └────────────┘
        ↓ (if Approved)
  You review again in Implementation tab
  (view full before/after diff)
        ↓
   ┌────────────┐
   │   Apply    │ ──→ Change recorded as Applied ──→ Can Rollback
   │   Cancel   │ ──→ Remains queued, no action
   └────────────┘
```

Every action is timestamped and stored:
- When the suggestion was generated
- When you approved it
- When you applied it
- When you rolled it back (if ever)

The **diff viewer** opens a side-by-side comparison of the original code and the suggested replacement before you commit to anything.

**You remain in full control at every step.**

---

### Step 5 — D: Document (Auto-generation)

Every time an analysis runs, RAPID automatically generates a **technical report** in Markdown format and saves it to your Documentation library:

```markdown
# Analysis Report: payment-service.ts

## Overview
- Language: TypeScript
- Analysis Type: CODE
- Date: March 31, 2026
- Reliability Score: 72/100
- Performance Score: 68/100

## Cost Savings Opportunity
Estimated potential savings: $1,240/month

## Suggestions Summary
1. Replace SELECT * with specific columns (HIGH) — Cost Saving
2. Add database connection pooling (HIGH) — Performance
3. Implement circuit breaker pattern (HIGH) — Reliability
4. Enable gzip compression (LOW) — Cost Saving

## Recommendations
Review each suggestion in the Suggestions tab and approve
implementations as needed.
```

Documents are:
- Stored in your account indefinitely
- Searchable by title and content
- Exportable as Markdown files
- Viewable in the Documentation tab of the dashboard

They form a permanent audit trail — you can always look back at what was found, what was approved, what was changed, and when.

---

### The Complete Flow in One Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      You                                 │
│         Upload a file  OR  Paste code                    │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   RAPID Engine                           │
│  1. Detect language                                      │
│  2. Scan for anti-patterns                               │
│  3. Compute reliability, performance & savings scores    │
│  4. Generate suggestions with diffs                      │
│  5. Save everything to your database                     │
│  6. Auto-generate technical report                       │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Your Dashboard                          │
│  - Review suggestions sorted by priority                 │
│  - See total potential monthly savings                   │
│  - Approve or dismiss each suggestion                    │
│  - View before/after diff for each change                │
│  - Click Apply when ready (your explicit permission)     │
│  - Rollback any applied change at any time               │
│  - Read auto-generated documentation                     │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Application Architecture

### Web App (`/web`)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, Server Components) |
| Styling | Tailwind CSS + custom Radix UI component library |
| Authentication | NextAuth.js v4 |
| Database | PostgreSQL + Prisma ORM |
| Payments | Stripe (subscriptions + webhooks) |
| Language | TypeScript |

### Mobile App (`/mobile`)

| Layer | Technology |
|-------|-----------|
| Framework | Expo + React Native |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind (Tailwind for React Native) |
| State | Zustand |
| Language | TypeScript |

### Database Schema (Key Models)

| Model | Purpose |
|-------|---------|
| `User` | Account with role (USER / ADMIN) |
| `Account` / `Session` | NextAuth OAuth tokens and sessions |
| `Subscription` | Stripe customer ID, plan, billing period |
| `Analysis` | Code submission with scores and raw content |
| `Suggestion` | Individual improvement with diff, priority, savings |
| `Implementation` | Approval audit trail with timestamps |
| `Document` | Auto-generated markdown documentation |
| `ApiKey` | Programmatic access keys |

### Subscription Plans

| Plan | Price | Analyses | Key Features |
|------|-------|----------|-------------|
| Free | $0 | 5/month | Basic analysis, 10 suggestions/analysis |
| Starter | $9/mo | 50/month | All languages, API access, priority processing |
| Pro | $29/mo | Unlimited | Dashboard analysis, auto-implementation, team features |
| Enterprise | $99/mo | Unlimited | SSO, SLA, dedicated support, audit logs |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Run new analysis, save results, auto-generate doc |
| `/api/suggestions/[id]` | PATCH | Approve / dismiss / implement a suggestion |
| `/api/implement/[id]` | POST | Apply or rollback an implementation |
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/portal` | POST | Open Stripe billing portal |
| `/api/stripe/webhook` | POST | Handle all Stripe lifecycle events |
| `/api/api-keys` | POST/GET | Create and list API keys |
| `/api/api-keys/[id]` | DELETE | Revoke an API key |
| `/api/auth/register` | POST | Email/password registration |
| `/api/users/profile` | PATCH | Update user profile |

---

## 4. Local Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- PostgreSQL (local or cloud — see Section 6.1 for cloud options)
- Git

### Step 1 — Clone and Install

```bash
git clone https://github.com/your-org/RAPID.git
cd RAPID

# Install web app dependencies
cd web
npm install

# Install mobile app dependencies
cd ../mobile
npm install
```

### Step 2 — Configure Environment Variables

```bash
cd web
cp .env.example .env.local
```

Open `web/.env.local` and fill in each value:

```env
# PostgreSQL — local example
DATABASE_URL="postgresql://rapid_user:rapid_password@localhost:5432/rapid_db"

# NextAuth — generate secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-minimum-32-characters"

# Google OAuth (from console.cloud.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (from github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Stripe (from dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3 — Set Up the Database

**If using local PostgreSQL:**

```bash
# Start PostgreSQL
sudo service postgresql start

# Create user and database
sudo -u postgres psql -c "CREATE USER rapid_user WITH PASSWORD 'rapid_password' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE rapid_db OWNER rapid_user;"
```

**Push the schema and seed demo data:**

```bash
cd web

# Create all tables from Prisma schema
npx prisma db push

# Load demo data (creates demo@rapid.dev / demo1234! with PRO plan)
npx tsx prisma/seed.ts
```

### Step 4 — Start the Dev Server

```bash
cd web
npm run dev
# App runs at http://localhost:3000
```

### Step 5 — Start the Mobile App

```bash
cd mobile
echo "EXPO_PUBLIC_API_URL=http://localhost:3000" > .env
npm start
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for browser
# Or scan the QR code with the Expo Go app on your phone
```

### Demo Account

After seeding, use these credentials to log in immediately:

| Field | Value |
|-------|-------|
| Email | demo@rapid.dev |
| Password | demo1234! |
| Plan | PRO |
| Pre-loaded | 1 analysis with suggestions and documentation |

---

## 5. Testing the App

### 5.1 Set Up Real OAuth Credentials

**Google OAuth**

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web Application**
6. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy the Client ID and Client Secret into `.env.local`

**GitHub OAuth**

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret into `.env.local`

---

### 5.2 Set Up Stripe for Local Testing

**Install the Stripe CLI** — [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (via Scoop)
scoop install stripe

# Linux
wget -qO- https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe

# Authenticate
stripe login
```

**Create subscription products and prices:**

```bash
# Create Starter product and price ($9/month)
STARTER_PRODUCT=$(stripe products create --name="RAPID Starter" --json | jq -r '.id')
stripe prices create \
  --product=$STARTER_PRODUCT \
  --unit-amount=900 \
  --currency=usd \
  --recurring[interval]=month

# Create Pro product and price ($29/month)
PRO_PRODUCT=$(stripe products create --name="RAPID Pro" --json | jq -r '.id')
stripe prices create \
  --product=$PRO_PRODUCT \
  --unit-amount=2900 \
  --currency=usd \
  --recurring[interval]=month

# Create Enterprise product and price ($99/month)
ENT_PRODUCT=$(stripe products create --name="RAPID Enterprise" --json | jq -r '.id')
stripe prices create \
  --product=$ENT_PRODUCT \
  --unit-amount=9900 \
  --currency=usd \
  --recurring[interval]=month
```

Copy the `price_xxx` IDs into your `.env.local`.

**Forward webhooks to your local server:**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# This prints a webhook signing secret — add it to .env.local:
# STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Test card numbers:**

| Card Number | Behavior |
|------------|---------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Card declined |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |

Use any future expiry date and any 3-digit CVC.

---

### 5.3 Manual Testing Checklist

Work through this entire flow before considering the app ready:

**Authentication**
```
☐ Sign up with email/password (new account)
☐ Sign in with Google OAuth
☐ Sign in with GitHub OAuth
☐ Sign out and sign back in
☐ Verify session persists on page refresh
☐ Verify unauthenticated users are redirected from /dashboard to /auth/signin
```

**Core Analysis Flow**
```
☐ Paste a JavaScript snippet → Run Analysis
☐ Paste a Python snippet → Run Analysis
☐ Paste a SQL query → Run Analysis
☐ Upload a .ts or .go file via drag-and-drop
☐ Upload a Terraform .tf file
☐ Verify language is auto-detected correctly
☐ Verify three scores appear: Reliability, Performance, Cost Savings
☐ Verify suggestions are generated with priorities and diffs
☐ Verify analysis appears in History tab
☐ Click into analysis detail page (/dashboard/analyze/[id])
```

**Suggestions Workflow**
```
☐ Open Suggestions tab — pending suggestions appear
☐ Expand a suggestion to see before/after code diff
☐ Approve a suggestion → it moves to Approved tab
☐ Dismiss a suggestion → it moves to Dismissed tab
☐ Verify total pending savings updates correctly
☐ Filter suggestions by category (Cost Saving, Reliability, etc.)
```

**Implementation Workflow**
```
☐ Go to Implementation tab — approved suggestion is listed
☐ Click "View Diff" — before/after dialog opens correctly
☐ Click "Apply" — status changes to Completed
☐ Click "Rollback" — status reverts, suggestion returns to Pending
☐ Verify every action is timestamped correctly
```

**Documentation**
```
☐ Open Documentation tab — auto-generated report is listed
☐ Click a document to open the full report
☐ Verify content matches the analysis that generated it
☐ Search works and filters documents correctly
```

**Analytics**
```
☐ Open Analytics tab
☐ Charts render correctly (bar chart, line chart, pie chart)
☐ Key metrics (total savings, avg reliability score) display correctly
```

**Billing & Stripe**
```
☐ Open Billing page — current plan (Free) shown
☐ Click Upgrade to Pro → Stripe Checkout opens
☐ Complete payment with test card 4242 4242 4242 4242
☐ Verify redirect back to /dashboard/billing?success=true
☐ Verify plan badge in header changes to PRO
☐ Click Manage Billing → Stripe Portal opens
☐ Cancel subscription in portal → verify downgrade to Free in app
☐ Verify webhook events appear in Stripe CLI output
```

**Plan Limits**
```
☐ On Free plan: run 5 analyses
☐ Attempt 6th analysis — verify error message about limit
☐ Upgrade to Pro — verify unlimited analyses work
```

**API Keys**
```
☐ Generate a new API key — it appears once, copy it
☐ Attempting to view key again shows masked value only
☐ Make a test API call using the key (curl example in the page)
☐ Delete the key — verify it disappears from the list
```

**Settings**
```
☐ Update display name → save → refresh — name persists
☐ Email field is read-only (correct behavior)
```

---

### 5.4 Automated Testing (Recommended)

Install Playwright for end-to-end testing:

```bash
cd web
npm install -D @playwright/test
npx playwright install
```

Create `web/tests/auth.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('user can sign in with email and see dashboard', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.fill('#email', 'demo@rapid.dev');
  await page.fill('#password', 'demo1234!');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome back');
});

test('analysis runs and returns suggestions', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.fill('#email', 'demo@rapid.dev');
  await page.fill('#password', 'demo1234!');
  await page.click('button[type=submit]');
  await page.waitForURL('/dashboard');

  await page.goto('/dashboard/analyze');
  await page.fill('input[placeholder*="title"]', 'Test Analysis');
  await page.fill('textarea', 'SELECT * FROM users WHERE id = 1');
  await page.click('button:has-text("Run Analysis")');
  await expect(page.locator('text=Analysis Results')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Suggestions')).toBeVisible();
});

test('suggestion approve flow works', async ({ page }) => {
  // sign in first...
  await page.goto('/dashboard/suggestions');
  const approveBtn = page.locator('button:has-text("Approve")').first();
  if (await approveBtn.isVisible()) {
    await approveBtn.click();
    await expect(page.locator('text=Suggestion Approved')).toBeVisible();
  }
});
```

Run tests:

```bash
npx playwright test
npx playwright test --ui          # visual mode
npx playwright test --headed      # watch browser
```

---

## 6. Going Live — Production Deployment

### 6.1 Choose a Database Host

| Provider | Free Tier | Connection String Format | Best For |
|----------|-----------|--------------------------|---------|
| **[Neon](https://neon.tech)** | 512MB, 1 project | `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require` | Next.js serverless (recommended) |
| **[Supabase](https://supabase.com)** | 500MB, 2 projects | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres` | If you also want realtime/auth features |
| **[Railway](https://railway.app)** | $5 credit/month | `postgresql://postgres:pass@xxx.railway.app:5432/railway` | Easiest full-stack setup |
| **[Render](https://render.com)** | 90-day free trial | `postgresql://user:pass@xxx.render.com/db` | Good for persistent always-on servers |

**Recommended: Neon** — best Prisma and Next.js compatibility, true serverless connections, free branching for staging/production environments.

**Setup with Neon:**

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project named `rapid`
3. Copy the connection string from the dashboard
4. Run:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma db push
   DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
   ```

---

### 6.2 Choose a Deployment Platform

| Platform | Best For | Free Tier | Deploy Method |
|----------|----------|-----------|---------------|
| **[Vercel](https://vercel.com)** | Next.js (built by same team) | Generous hobby tier | Git push |
| **[Railway](https://railway.app)** | Full-stack with DB in one place | $5/month credit | Git push or CLI |
| **[Render](https://render.com)** | Predictable pricing, no cold starts | 750 hours/month | Git push |
| **[Fly.io](https://fly.io)** | Docker-based, global edge | 3 shared VMs | `fly deploy` |

**Recommended: Vercel** — zero-config Next.js deployment, automatic preview deployments on every PR, global CDN, and edge functions built in.

---

### 6.3 Deploy to Vercel

**Option A — Via CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from the web/ directory
cd web
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: your account
# - Link to existing project: No
# - Project name: rapid-web
# - Directory: ./  (you're already in web/)
# - Override settings: No
```

**Option B — Via GitHub (recommended for ongoing deployment):**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Set **Root Directory** to `web`
4. Framework Preset: **Next.js** (auto-detected)
5. Click **Deploy**

Every `git push` to `main` will automatically trigger a redeployment.

**Set environment variables in Vercel dashboard:**

Go to your project → **Settings → Environment Variables** and add every variable from your `.env.local` file. Critical ones to update for production:

```
NEXTAUTH_URL          → https://your-app.vercel.app
NEXT_PUBLIC_APP_URL   → https://your-app.vercel.app
DATABASE_URL          → your Neon/Supabase connection string
NEXTAUTH_SECRET       → run: openssl rand -base64 32
```

All Stripe and OAuth values carry over from local (but OAuth redirect URLs need updating — see Section 6.4).

---

### 6.4 Update OAuth Redirect URLs for Production

**Google:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → Your project → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add to Authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

**GitHub:**
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update Authorization callback URL:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```

---

### 6.5 Set Up Stripe Webhook for Production

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Update `STRIPE_WEBHOOK_SECRET` in your Vercel environment variables

---

### 6.6 Add a Custom Domain

**Purchase a domain** — recommended registrars:

| Registrar | Cost | Notes |
|-----------|------|-------|
| [Namecheap](https://namecheap.com) | ~$10/year | Good prices, easy UI |
| [Cloudflare](https://cloudflare.com/products/registrar) | At-cost pricing | Best if using Cloudflare DNS (recommended) |
| [Google Domains / Squarespace](https://domains.squarespace.com) | ~$12/year | Simple interface |

**Connect to Vercel:**

1. In your Vercel project → **Settings → Domains**
2. Add your domain (e.g. `app.rapid.dev`)
3. Vercel provides the DNS records to add

**Add DNS records at your registrar:**

```
# If using Cloudflare (recommended):
Type: CNAME
Name: app  (or @ for root domain)
Target: cname.vercel-dns.com
Proxy: Orange cloud OFF (DNS only) for Vercel to manage SSL
```

**Update environment variables after domain is live:**

```
NEXTAUTH_URL          → https://app.rapid.dev
NEXT_PUBLIC_APP_URL   → https://app.rapid.dev
```

Also update your Google and GitHub OAuth callback URLs to use the custom domain.

**SSL/HTTPS** is handled automatically by Vercel — no configuration needed.

---

### 6.7 Switch Stripe from Test to Live Mode

When you're ready to charge real money:

1. In Stripe Dashboard, toggle from **Test** to **Live** mode
2. Create new products and prices in Live mode (same process as test)
3. Update these env vars in Vercel with **Live** keys:
   ```
   STRIPE_SECRET_KEY                → sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY → pk_live_...
   STRIPE_WEBHOOK_SECRET            → new whsec_... from live webhook endpoint
   STRIPE_STARTER_PRICE_ID         → new price_... from live mode
   STRIPE_PRO_PRICE_ID             → new price_... from live mode
   STRIPE_ENTERPRISE_PRICE_ID      → new price_... from live mode
   ```
4. Create a new webhook endpoint in Stripe Live mode pointing to your production URL

---

## 7. Observability & Monitoring

### 7.1 Error Tracking — Sentry

[Sentry](https://sentry.io) catches runtime errors and sends you alerts. Free tier includes 5,000 errors/month.

```bash
cd web
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to `.env.local`:
```env
SENTRY_DSN="https://xxx@sentry.io/xxx"
```

You'll receive email (or Slack) notifications when users encounter errors, complete with stack traces, user session replays, and affected user counts.

---

### 7.2 Product Analytics — PostHog

[PostHog](https://posthog.com) tracks user behavior. Free up to 1 million events/month. Open source and self-hostable.

```bash
npm install posthog-js
```

Add to your `Providers` component:

```typescript
import posthog from 'posthog-js';
posthog.init('phc_xxx', { api_host: 'https://app.posthog.com' });
```

Track key events:
- Which analysis types are most popular
- How many users go from Analysis → Approve Suggestion → Apply
- Where users drop off in the upgrade funnel
- Feature usage: API keys, documentation exports

---

### 7.3 Uptime Monitoring

**[UptimeRobot](https://uptimerobot.com)** — free tier monitors 50 URLs, checks every 5 minutes, sends SMS/email alerts.

**[Better Uptime](https://betteruptime.com)** — more polished, includes a public status page you can host at `status.rapid.dev`.

Setup:
1. Add a monitor for `https://your-app.vercel.app`
2. Add a monitor for `https://your-app.vercel.app/api/auth/session` (tests the full auth stack)
3. Configure SMS or email alert on downtime

---

### 7.4 Database Monitoring

**Neon dashboard** — provides query counts, connection pool utilization, and storage usage for free.

**[Prisma Pulse](https://prisma.io/pulse)** — real-time database change monitoring, useful for debugging subscription webhooks.

For query performance analysis at scale, **pgAnalyze** identifies slow queries and missing indexes automatically.

---

### 7.5 Transactional Email

RAPID currently redirects password reset and confirmation flows through NextAuth. To send branded emails, integrate a transactional email provider:

| Provider | Free Tier | Notes |
|----------|-----------|-------|
| **[Resend](https://resend.com)** | 3,000 emails/month | Best DX, built for Next.js |
| **[SendGrid](https://sendgrid.com)** | 100 emails/day | Industry standard |
| **[Postmark](https://postmarkapp.com)** | 100 emails/month | Best deliverability |

Install Resend:

```bash
npm install resend
```

Configure in NextAuth email provider for magic link sign-in, password resets, and subscription confirmations.

---

## 8. Go-to-Market Checklist

### Before You Share the Link

**Infrastructure**
```
☐ Production PostgreSQL database live (Neon or Supabase)
☐ Schema pushed to production database (prisma db push)
☐ Deployed to Vercel and accessible via URL
☐ SSL certificate active (automatic via Vercel)
☐ All environment variables set in Vercel dashboard
☐ Stripe webhook pointing to production URL
☐ OAuth apps updated with production callback URLs
☐ NEXTAUTH_URL set to production domain
```

**Testing in Production Environment**
```
☐ Sign up with a real Google account on production
☐ Run a real analysis on the live app
☐ Complete a Stripe checkout with test card
☐ Verify webhook fires and plan upgrades in the app
☐ Verify email/password sign up and sign in work
☐ Test on mobile browser (responsive layout)
```

**Legal Requirements**
```
☐ Privacy Policy page live (required by Google OAuth and Stripe)
☐ Terms of Service page live
☐ Cookie consent banner (required in EU/UK — use cookieyes.com or similar)
☐ Company name and address in footer
```

**Reliability**
```
☐ Uptime monitoring configured (UptimeRobot)
☐ Error tracking active (Sentry)
☐ At least one admin account that isn't your personal account
☐ Database backups enabled (Neon provides automatic daily backups)
```

### When Ready to Charge Real Money

```
☐ Switch Stripe from Test mode to Live mode
☐ Update all Stripe env vars to live versions (sk_live_, pk_live_)
☐ Create production Stripe webhook with live signing secret
☐ Verify a real payment processes end-to-end
☐ Verify subscription cancellation flow works
☐ Set up Stripe payout schedule (bank account linked)
```

---

## 9. Full Stack Reference

### All Tools Used and Their Costs

| Layer | Tool | Website | Cost |
|-------|------|---------|------|
| Web Framework | Next.js 14 | nextjs.org | Free (open source) |
| Mobile Framework | Expo + React Native | expo.dev | Free (open source) |
| Hosting | Vercel | vercel.com | Free (hobby tier) |
| Database | Neon PostgreSQL | neon.tech | Free (512MB) |
| ORM | Prisma | prisma.io | Free (open source) |
| Auth | NextAuth.js | next-auth.js.org | Free (open source) |
| Payments | Stripe | stripe.com | 2.9% + 30¢ per transaction |
| Domain + DNS | Cloudflare | cloudflare.com | ~$10/year (domain only) |
| Error Tracking | Sentry | sentry.io | Free (5K errors/month) |
| Product Analytics | PostHog | posthog.com | Free (1M events/month) |
| Uptime Monitoring | UptimeRobot | uptimerobot.com | Free (50 monitors) |
| Transactional Email | Resend | resend.com | Free (3K emails/month) |
| Local Webhook Testing | Stripe CLI | stripe.com/docs/stripe-cli | Free |
| E2E Testing | Playwright | playwright.dev | Free (open source) |
| CI/CD | GitHub Actions + Vercel | — | Free (public repos) |

**Total cost to launch: ~$10/year** (just the domain name)

---

### Fastest Path to Live (30-Minute Checklist)

For getting the app deployed as quickly as possible:

```bash
# 1. Create a Neon database at neon.tech (2 min)
#    Copy the connection string

# 2. Push the schema to production
cd web
DATABASE_URL="postgresql://..." npx prisma db push

# 3. Deploy to Vercel
vercel

# 4. Set environment variables in Vercel dashboard (5 min)
#    DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, all Stripe keys

# 5. Update Google and GitHub OAuth redirect URLs (3 min)

# 6. Create Stripe webhook pointing to production URL (2 min)

# 7. Share the URL
```

Everything else — custom domain, monitoring, email, analytics — can be added after your first users are on the platform.

---

### Useful Commands Reference

```bash
# Development
npm run dev                          # Start dev server
npx prisma studio                    # Visual database browser
npx prisma db push                   # Sync schema to DB (no migration files)
npx prisma migrate dev               # Create migration files (production-ready)
npx tsx prisma/seed.ts               # Load demo data

# Testing
npx playwright test                  # Run all E2E tests
npx playwright test --ui             # Visual test runner
npx playwright codegen localhost:3000 # Record tests by clicking

# Stripe
stripe login                         # Authenticate CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook  # Forward webhooks
stripe trigger payment_intent.succeeded  # Trigger test event

# Deployment
vercel                               # Deploy to preview
vercel --prod                        # Deploy to production
vercel env pull                      # Pull env vars from Vercel to local
vercel logs                          # View production logs

# Security
openssl rand -base64 32              # Generate NEXTAUTH_SECRET
```

---

*Document version 1.0 — Generated March 31, 2026*
*RAPID — Read, Analyze, Patch, Implement & Document*
