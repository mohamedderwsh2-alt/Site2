## ArbiPulse · Mobile-Native Crypto E-Commerce

ArbiPulse is a multilingual, app-like e-commerce experience for purchasing a Binance ↔ OKX arbitrage bot, monitoring two-hour trade cycles, and managing wallet activity in USDT. The project mixes production-ready flows (auth, wallet requests, referral accounting) with rich demo sections for product storytelling.

### Highlights

- **App-shell UX** with glassmorphism, animated landing pages, and bottom navigation.
- **Authentication & Sessions** via NextAuth + Prisma (credential login, secure registration, referral codes).
- **Wallet Operations** to request deposits/withdrawals, display static USDT address, and track request history.
- **Trading Bot Simulation** that accrues profits every two hours based on a configurable profit table.
- **Referral Engine** with 5% deposit bonuses and 20% profit sharing, plus reward history.
- **Internationalization** (English & Turkish) using `next-intl` with locale-prefixed routes and typed navigation helpers.
- **Content Hub** for educational articles, support links, and profit reference tables.

### Tech Stack

- Next.js 16 (App Router, TypeScript, Tailwind 4)
- Prisma ORM with SQLite (swap to Postgres by updating `DATABASE_URL`)
- NextAuth credential provider
- next-intl for i18n, Framer Motion for hero animations, lucide-react icons

### Project Structure

```
src/
  app/
    [locale]/...       # Locale-aware routes (landing, auth, dashboard sections)
    api/               # Auth + registration handlers
  components/          # Shared UI primitives (dashboard shell, providers, copy buttons)
  lib/                 # Prisma client, auth config, profit simulation
  messages/            # Translation catalogs (en, tr)
  util/                # Env + i18n helpers
```

### Prerequisites

- Node.js 18+
- SQLite (bundled) or alternative database reachable by Prisma

### Setup & Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="replace-me"
   NEXTAUTH_URL="http://localhost:3000"
   TELEGRAM_SUPPORT_URL="https://t.me/your_support_group"
   USDT_WALLET_ADDRESS="TRC20_WALLET_ADDRESS"
   ```

3. Initialize the database:

   ```bash
   npx prisma migrate deploy
   # or during development
   npx prisma migrate dev
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000/en` (English) or `http://localhost:3000/tr` (Turkish).

### Useful Scripts

- `npm run lint` – ESLint checks
- `npm run build` – Production build (Next.js + TypeScript)
- `npm run dev` – Local development
- `npx prisma studio` – Inspect database records

### Database Models

Prisma models cover users, bot profit entries, deposit/withdraw requests, and referral rewards. Update `prisma/schema.prisma` to expand financial logic or move to another provider.

### Testing Notes

- Linting (`npm run lint`) and production build (`npm run build`) must pass before deployment.
- `createDemoTopUp` server action seeds demo funds without on-chain deposits; label clearly in UI.
- Background profit simulation runs lazily on server requests via `processBotCyclesForUser`.

### Deployment

1. Set environment variables on your host (e.g., Vercel).
2. Run `npm run build` during CI/CD.
3. Apply Prisma migrations in your deployment pipeline.

---

ArbiPulse is designed as a showcase combining polished front-end storytelling with operational workflows. Extend it with real blockchain integrations, admin dashboards, or payment providers as you evolve the product.
