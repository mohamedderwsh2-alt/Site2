# Crypto Trading Bot Platform

A modern e-commerce platform that simulates a cryptocurrency trading bot system. The platform features a mobile-app-like interface with authentication, wallet management, referral system, and multi-language support.

## Features

- 🎨 **Mobile-App-Like Interface**: App-style navigation, smooth transitions, and interactive elements
- 🌍 **Multi-Language Support**: English, Arabic, Spanish, and French
- 🔐 **Authentication System**: Login and registration with secure token-based authentication
- 💰 **Wallet System**: Deposit and withdraw USDT functionality
- 🤖 **Trading Bot Simulation**: Automated profit calculation based on balance tiers
- 👥 **Referral System**: Earn 5% commission on deposits and 20% of future profits
- 📱 **Responsive Design**: Mobile-first approach with bottom navigation for mobile devices
- 💬 **Support Section**: Telegram integration and informational articles

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/workspace
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Main page
├── lib/
│   └── utils.ts      # Utility functions
├── public/           # Static assets
└── package.json      # Dependencies
```

## Features Overview

### Profit Calculation

The platform uses a tiered profit system based on user balance:

| Balance (USDT) | Daily Profit (USDT) |
|----------------|---------------------|
| 20.00          | 3.00               |
| 99.00          | 16.83              |
| 458.00         | 91.60              |
| 1288.00        | 283.36             |
| 4388.00        | 1097.00            |
| 10888.00       | 3048.64            |
| 25888.00       | 8284.16            |

### Referral System

- **Deposit Commission**: 5% of referred user's deposit
- **Profit Share**: 20% of referred user's ongoing profits

### Wallet System

- **Deposit**: Fixed USDT wallet address (TRC20)
- **Withdraw**: User submits withdrawal request with wallet address and password

## Technology Stack

- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing

## Notes

- This is a demo/presentation platform. In production, you would need:
  - Database integration (PostgreSQL, MongoDB, etc.)
  - Real blockchain transaction verification
  - Secure password storage
  - Email verification
  - Rate limiting
  - Proper error handling and logging

## License

ISC
