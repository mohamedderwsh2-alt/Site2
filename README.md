# 🚀 Crypto Trading Bot Platform

A modern, mobile-first e-commerce platform for automated cryptocurrency arbitrage trading between Binance and OKX exchanges. Built with Next.js 14, TypeScript, and featuring a sleek mobile app-style interface.

## ✨ Features

### 🎯 Core Features
- **Automated Trading Bot**: Executes trades every 2 hours, 24/7
- **Real-time Profit Tracking**: Live dashboard with earnings visualization
- **Multi-language Support**: English, Spanish, Chinese, Arabic, Russian, Portuguese
- **Referral System**: Earn 5% on deposits + 20% on referral profits
- **Secure Authentication**: NextAuth with MongoDB session management
- **Admin Panel**: Comprehensive dashboard for managing users and withdrawals

### 💎 User Features
- Beautiful mobile app-style interface with smooth animations
- Real-time balance and earnings tracking
- Deposit/Withdraw USDT (TRC20)
- Trading bot purchase (5 USDT one-time)
- Referral code system with commission tracking
- Transaction history
- Support center with Telegram integration

### 🔐 Security Features
- Password-protected withdrawals
- Secure session management
- MongoDB database with encrypted passwords
- Manual withdrawal verification

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **State Management**: React Hooks
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd crypto-trading-bot-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/crypto-trading-bot

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# USDT Wallet Configuration
DEPOSIT_WALLET_ADDRESS=TYourUSDTWalletAddressHere123456789

# Telegram Support
TELEGRAM_GROUP_URL=https://t.me/your_support_group

# Admin Configuration
ADMIN_EMAIL=admin@example.com
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Profit Tiers

The platform operates on a tiered profit system:

| Balance (USDT) | Daily Profit (USDT) |
|----------------|---------------------|
| 20             | 3.00                |
| 99             | 16.83               |
| 458            | 91.60               |
| 1,288          | 283.36              |
| 4,388          | 1,097.00            |
| 10,888         | 3,048.64            |
| 25,888         | 8,284.16            |

## 🤖 Automated Profit Distribution

### Running the Cron Job

The platform includes an automated profit distribution system that runs every 2 hours:

```bash
node scripts/profit-cron.js
```

### Setting Up Automated Execution

**Using cron (Linux/Mac)**:

```bash
crontab -e
```

Add the following line to run every 2 hours:

```
0 */2 * * * cd /path/to/your/project && /usr/bin/node scripts/profit-cron.js >> /var/log/crypto-bot-cron.log 2>&1
```

**Using Windows Task Scheduler**:
1. Open Task Scheduler
2. Create a new task
3. Set trigger to run every 2 hours
4. Set action to run: `node C:\path\to\your\project\scripts\profit-cron.js`

**Using PM2** (recommended for production):

```bash
npm install -g pm2
pm2 start scripts/profit-cron.js --cron "0 */2 * * *" --name "crypto-bot-cron"
pm2 save
pm2 startup
```

## 👥 User Roles

### Regular Users
- Register and login
- Purchase trading bot
- Deposit/Withdraw USDT
- View earnings and transactions
- Generate referral codes
- Track referral earnings

### Admin Users
- Access admin panel at `/admin`
- View platform statistics
- Manage withdrawal requests
- Approve/Reject transactions
- View all users

To become an admin, set your email in the `ADMIN_EMAIL` environment variable.

## 📱 Mobile-First Design

The platform is designed with a mobile-first approach:
- Responsive design for all screen sizes
- Touch-optimized interactions
- Bottom navigation bar
- Slide-out menu
- Smooth page transitions
- Glass morphism effects

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (via NextAuth)

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/bot/purchase` - Purchase trading bot
- `GET /api/deposit` - Get deposit address
- `POST /api/withdraw` - Request withdrawal
- `GET /api/transactions` - Get transaction history
- `GET /api/trades` - Get trade history
- `GET /api/referral` - Get referral data

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users list
- `GET /api/admin/withdrawals` - Withdrawal requests
- `PATCH /api/admin/withdrawals` - Approve/Reject withdrawals

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
    },
  },
}
```

### Adding Languages

Add translations in `lib/i18n.ts`:

```typescript
export const translations = {
  en: { /* English translations */ },
  es: { /* Spanish translations */ },
  // Add your language here
};
```

### Modifying Profit Tiers

Edit `lib/profitCalculator.ts`:

```typescript
export const profitTiers = [
  { minBalance: 20, dailyProfit: 3.00 },
  // Add your tiers here
];
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env.local`
- For MongoDB Atlas, whitelist your IP address

### NextAuth Errors
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t crypto-trading-bot .
docker run -p 3000:3000 crypto-trading-bot
```

### Manual Deployment

```bash
npm run build
npm start
```

## 🔒 Security Recommendations

1. **Change Default Values**:
   - Generate a strong `NEXTAUTH_SECRET`
   - Use a secure admin email
   - Update USDT wallet address

2. **Production Setup**:
   - Use HTTPS only
   - Enable CORS restrictions
   - Set secure cookie flags
   - Implement rate limiting
   - Regular security audits

3. **Database**:
   - Use MongoDB Atlas with authentication
   - Enable encryption at rest
   - Regular backups
   - Restrict network access

## 📝 Additional Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation guide
- **[FEATURES.md](FEATURES.md)** - Complete features documentation

## 📝 License

This project is private and proprietary.

## 🤝 Support

For support and questions:
- Join our Telegram group (set in environment)
- Email: your-support@email.com

## 🎯 Roadmap

- [ ] Email notifications
- [ ] SMS verification
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] API for third-party integrations

## ⚠️ Disclaimer

This platform is for educational purposes. Cryptocurrency trading carries risks. Always do your own research and invest responsibly.

---

Made with ❤️ using Next.js and TypeScript
