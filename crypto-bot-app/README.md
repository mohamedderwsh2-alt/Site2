## FluxArb Mobile Commerce

FluxArb Mobile is a mobile-first e-commerce experience for selling a cryptocurrency arbitrage bot. The interface emulates a native app with bottom navigation, smooth transitions, multilingual support (EN/TR), and a blend of functional wallet actions and demo-only market visualisations.

### Highlights

- **App-like UI:** Animated screen transitions, bottom navigation, and card-driven layouts optimised for 390px viewport widths.
- **Authentication & Sessions:** Email/password registration, referral capture, and session handling via NextAuth (JWT strategy).
- **Wallet Flows:** Submit deposit intents to a fixed USDT address, request withdrawals with password confirmation, view transaction history.
- **Automated Profit Engine:** Deterministic two-hour trade simulation that compounds balance, logs trades, and applies referral revenue sharing (5% on deposits, 20% on profits).
- **Referral Hub:** Unique referral codes, instant/shareable copy actions, and passive income analytics.
- **Knowledge Centre:** Multilingual articles, profit tier tables, and interactive strategy breakdown for presentations.

### Tech Stack

- Next.js 16 (App Router, React 19)
- TypeScript + Tailwind CSS v4
- Prisma ORM (SQLite)
- NextAuth credentials provider
- Bcrypt for password hashing
- Framer Motion for transitions
- Lucide icons, date-fns utilities, SWR for client fetches

### Prerequisites

- Node.js 20+
- npm (or pnpm/yarn, adjust commands accordingly)

### Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Generate a secure `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`).

3. Adjust `NEXT_PUBLIC_USDT_ADDRESS`, and optionally set `ADMIN_EMAIL`/`ADMIN_PASSWORD` for the seed script.

### Install & Database

```bash
npm install
npx prisma migrate dev --name init --skip-generate   # already run in repo, rerun if schema changes
npm run seed                                        # optional: bootstrap an admin user
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`. Authentication-protected screens redirect to `/login` while unauthenticated. Use the admin credentials from `.env` (or seed output) to sign in, promote deposits, and explore the admin routes.

### Admin Utilities

- Confirm deposits: `POST /api/admin/deposits/:id/confirm`
- Update withdrawal status: `POST /api/admin/withdrawals/:id/status` with `{ status: "APPROVED" | "REJECTED" | "PAID", note? }`

These endpoints require an authenticated admin session. Use browser devtools or a REST client with cookies to invoke them during demos.

### Testing Notes

- Profit simulation runs automatically whenever protected data endpoints load. To see compounding profits, adjust the system clock or tweak `runTradingCyclesForUser` logic.
- Deposit requests remain pending until confirmed via the admin endpoint. Upon confirmation, user balances, deposits, and referral rewards update atomically.
- Withdrawal requests immediately reserve funds; marking them `REJECTED` refunds the user.

### Building & Deployment

```bash
npm run build
npm run start
```

The app is production-ready for container hosting or platforms such as Vercel. Ensure environment variables are mirrored in the deployment target.

### Structure Overview

- `src/app/(auth)/*` – public auth screens and layout
- `src/app/(protected)/app/*` – authenticated mobile shell and tab content
- `src/lib` – Prisma client, trading engine, profit math, and utilities
- `src/components/dashboard` – tab-specific client components
- `prisma/schema.prisma` – database schema (users, wallets, trades, referrals)

### Seed User

Run `npm run seed` to create an admin account. Credentials appear in the console (defaults defined in `.env.example`). The admin can confirm deposits and update withdrawal status during demos.

Enjoy showcasing FluxArb! For questions or support, join the Telegram channel referenced inside the app.
