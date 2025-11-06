# Crypto Trading Bot Platform - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_USDT_WALLET_ADDRESS`: Your USDT wallet address

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features Implemented

✅ Mobile app-like UI with bottom navigation
✅ User authentication (login/register)
✅ Wallet system (deposit/withdraw)
✅ Trading bot purchase system
✅ Profit calculation based on balance tiers
✅ Referral system (5% deposit + 20% profit commission)
✅ Information/articles section
✅ Telegram support integration
✅ Multi-language structure (ready for expansion)

## Bot Trade Execution

The bot trade execution endpoint (`/api/bot/execute-trade`) should be called every 2 hours. You can set this up using:

- **Cron Job** (Linux/Mac):
  ```bash
  0 */2 * * * curl -X POST http://your-domain.com/api/bot/execute-trade
  ```

- **Vercel Cron** (if deploying on Vercel):
  Add to `vercel.json`:
  ```json
  {
    "crons": [{
      "path": "/api/bot/execute-trade",
      "schedule": "0 */2 * * *"
    }]
  }
  ```

- **Node Cron** (Node.js):
  Install `node-cron` and create a cron job script

## Database Management

- View database: `npx prisma studio`
- Reset database: Delete `prisma/dev.db` and run `npx prisma db push`
- Migrations: `npx prisma migrate dev`

## Production Deployment

1. Use PostgreSQL instead of SQLite
2. Set secure environment variables
3. Enable HTTPS
4. Set up bot trade execution cron job
5. Configure proper error logging
6. Set up monitoring

## Notes

- Withdrawal requests require manual processing
- The platform includes both functional and demo/presentation sections
- Multi-language support structure is ready but needs middleware configuration for full implementation
- All user data is stored server-side and persists across devices
