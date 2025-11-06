# Crypto Trading Bot Platform

A modern e-commerce website that simulates a cryptocurrency trading bot platform with mobile app-like interface.

## Features

- **Mobile App-like UI**: App-style menus, smooth transitions, and interactive elements
- **User Authentication**: Secure login and registration system
- **Wallet System**: Deposit and withdraw USDT functionality
- **Trading Bot**: Purchase and manage automated trading bots
- **Profit System**: Automated profit calculation based on balance tiers
- **Referral System**: Earn commissions from referrals (5% deposit + 20% profit)
- **Multi-language Support**: Ready for internationalization
- **Information Articles**: Educational content about the platform
- **Telegram Support**: Integration with Telegram support group

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prisma** with SQLite for database
- **NextAuth.js** for authentication
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update:
- `DATABASE_URL` - SQLite database path
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your application URL
- `USDT_WALLET_ADDRESS` - Fixed USDT wallet address for deposits

3. Initialize database:
```bash
npx prisma generate
npx prisma db push
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── wallet/           # Wallet (deposit/withdraw)
│   ├── bot/              # Bot purchase page
│   ├── referrals/        # Referral system
│   ├── info/             # Information articles
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/           # Reusable components
├── lib/                 # Utility functions
└── prisma/              # Database schema
```

## Key Features Explained

### Profit Calculation
Profits are calculated based on balance tiers:
- Balance 20 USDT → Daily Profit: 3.00 USDT
- Balance 99 USDT → Daily Profit: 16.83 USDT
- Balance 458 USDT → Daily Profit: 91.60 USDT
- And so on...

The bot executes trades every 2 hours (12 trades per day).

### Referral System
- **5% Deposit Commission**: Instant commission when someone deposits using your referral code
- **20% Profit Commission**: Ongoing commission from referred users' profits

### Bot Trade Execution
The bot trade execution endpoint (`/api/bot/execute-trade`) should be called every 2 hours via a cron job or scheduled task. This simulates the automated trading process.

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
USDT_WALLET_ADDRESS="0xYourFixedUSDTWalletAddressHere"
```

## Database Schema

- **User**: User accounts with referral codes
- **Wallet**: User wallet balances
- **Transaction**: All transactions (deposit, withdraw, profit, purchase)
- **BotPurchase**: Trading bot purchases
- **ReferralEarning**: Referral commission records

## Notes

- This is a demonstration/presentation platform
- Some features are visual/demo-only as specified
- Withdrawal requests require manual processing
- Bot trades need to be executed via scheduled job (every 2 hours)

## License

Private project
