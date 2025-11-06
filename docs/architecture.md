## Project Overview

This document outlines the architecture for a mobile-inspired e-commerce web application focused on selling a cryptocurrency arbitrage trading bot. The experience must blend native-app styling with the breadth of a desktop web platform.

### Goals

- Deliver an app-like interface with smooth transitions, bottom navigation, and touch-friendly controls.
- Provide a fully functional user dashboard including authentication, wallet management, referrals, and bot earnings.
- Support partially static/visual sections (e.g., marketing funnels) for presentation demos.
- Localize content for multiple languages out of the box.
- Model core trading bot economics: two-hour trade cycles with fixed profit rates and referral commissions.

## High-Level Architecture

### Technology Stack

- **Frontend & Backend:** Next.js 14 (App Router, TypeScript, React Server Components)
- **Styling & UI:** Tailwind CSS, Radix UI primitives, Framer Motion for transitions, Tabler Icons
- **State & Data:** React Query for client-side mutations/queries, Zustand for ephemeral UI state
- **Internationalization:** `next-intl` with namespaced translations (initially English and Turkish)
- **Authentication:** NextAuth.js (Credentials provider with password hashing via bcrypt)
- **Database Layer:** Prisma ORM backed by SQLite in development, easily switchable to PostgreSQL in production
- **Background Jobs:** Edge-safe API route triggered by cron or manual invocation to simulate two-hour trade cycles
- **Payments:** On-chain USDT wallet address display (static); withdrawal requests captured for manual fulfillment
- **Deployment:** Vercel/Node hosting with environment-configurable database URL and secrets

### Core Modules

- **App Shell & Navigation**
  - Mobile-first layout with fixed bottom navigation and modal overlays.
  - Responsive gradients, glassmorphism, and micro-interactions to emulate a native app feel.

- **Authentication & Session Management**
  - Registration with referral code entry and automatic referral linkage.
  - Login via email/password (optional OTP/2FA hook left for future work).
  - Secure session handling through NextAuth cookies.

- **User Wallet**
  - Balance tracking in USDT.
  - Deposit instructions featuring a static central wallet address and QR code.
  - Withdrawal request form capturing amount, destination address, and password confirmation.
  - Admin-facing APIs to approve/deny withdrawal requests (initial manual flow).

- **Trading Bot Engine (Simulated)**
  - Configurable fixed profit table based on balance tiers (see requirements).
  - Two-hour cycle job calculates profit slices per user, records trade log entries, and updates balance.
  - Profit logs exposed in dashboard timeline with exchange arbitrage storytelling.

- **Referral System**
  - Unique referral code per user (claimable after registration).
  - Immediate 5% deposit bonus credited to referrer.
  - Ongoing 20% profit share distributed each cycle.
  - Referral tree visualization highlighting direct invitations.

- **Content & Support**
  - CMS-like markdown articles stored in database and editable via admin route (MVP: file-based).
  - Dedicated Telegram support CTA integrated with deep link.

- **Admin Console (Phase 2)**
  - Protected route for processing manual withdrawals, auditing deposits, and pausing trading bot.

## Data Model Sketch

- `User`: id, email, passwordHash, displayName, locale, balance, referralCode, referredById, createdAt
- `Session` / NextAuth tables
- `Deposit`: id, userId, amount, txHash(optional), status, createdAt
- `WithdrawalRequest`: id, userId, amount, address, status, processedAt, adminNote
- `EarningCycle`: id, runAt, cycleIndex, totalVolume
- `EarningEntry`: id, cycleId, userId, grossAmount, referralPayout, netAmount, balanceSnapshot
- `ReferralPayout`: id, sourceUserId, recipientUserId, cycleId, amount, type (deposit|profit)
- `Article`: id, slug, title, contentMarkdown, locale, published

## API Surface (MVP)

- `POST /api/auth/register` – create user, hash password, link referral.
- `POST /api/auth/login` – credential-based authentication.
- `POST /api/wallet/deposit` – log deposit intent.
- `POST /api/wallet/withdraw` – submit withdrawal request.
- `GET /api/wallet/summary` – balances, pending actions.
- `POST /api/trading/run-cycle` – trigger profit distribution (cron-safe, requires admin key).
- `GET /api/referrals` – fetch referral tree and earnings summary.
- `GET /api/articles` – serve localized marketing content.

## Trading Profit Algorithm

1. Determine user's daily profit rate via tiered table. Convert to per-cycle share (daily profit ÷ 12 cycles).
2. Calculate cycle profit for each user, considering only active balances.
3. Credit user balance with cycle profit (net of referral obligations).
4. Distribute 20% of the profit to each user's referrer (if any).
5. Log earnings entries and referral payouts for transparency.

## Internationalization Strategy

- Use `next-intl` middleware to detect locale based on path prefix (`/en`, `/tr`, etc.).
- Store translations in `/messages/{locale}.json` with segmentation per module.
- Provide toggle in the app shell allowing quick language switching.

## Development Milestones

1. **Scaffold & Tooling** – Initialize Next.js project, add Tailwind, Prisma, NextAuth, next-intl, testing setup.
2. **Auth & Data Layer** – Define Prisma schema, migrations, authentication flows.
3. **Wallet & Referral Logic** – Implement deposit/withdraw/commission APIs and data models.
4. **Trading Simulation** – Build cycle runner, profit computation, timeline UI.
5. **UI/UX Polish** – Mobile app shell, transitions, marketing pages, article content.
6. **Localization** – Translate critical flows and marketing copy to at least two languages.
7. **Docs & Deployment** – Provide environment config, seed scripts, and README instructions.

## Testing Approach

- Unit tests with Vitest for business logic (profit calculations, referral commissions).
- Integration tests for API routes using Next.js test utilities or Supertest.
- Component tests with Playwright or Cypress for key flows (login, deposit, referral share display).

## Open Questions

- Should deposits auto-credit balances or wait for admin confirmation with blockchain verification?
- Are there additional regional compliance constraints for USDT handling?
- Should referrals support multi-level (beyond direct) incentives?

This plan will guide the subsequent implementation milestones.
