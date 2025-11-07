# Crypto Trading Bot E-Commerce Platform

A full-stack cryptocurrency trading bot platform with automated arbitrage trading between Binance and OKX exchanges. Features include user authentication, wallet management, referral system, and multi-language support with a mobile-app-like interface.

## 🚀 Features

### User Features
- **Authentication System**: Secure registration and login with JWT tokens
- **Trading Bot**: Automated arbitrage trading every 2 hours
- **Wallet Management**: 
  - USDT (TRC20) deposits and withdrawals
  - Real-time balance tracking
  - Transaction history
- **Referral Program**:
  - 5% instant commission on referral deposits
  - 20% passive income from referral's trading profits
  - Unlimited referrals
- **Multi-Language Support**: English, Spanish, Turkish
- **Mobile-First UI**: App-like interface with smooth animations
- **Real-Time Statistics**: Track earnings, trades, and referrals

### Admin Features
- Approve/reject deposit requests
- Process withdrawal requests
- Platform statistics dashboard
- User management

## 📋 Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Framer Motion for animations
- i18next for internationalization
- Zustand for state management
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Node-Cron for scheduled trading

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd workspace
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

5. **Configure environment variables**

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crypto-trading-platform
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_WALLET_ADDRESS=YOUR_USDT_TRC20_WALLET_ADDRESS
NODE_ENV=development
```

6. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# Linux/Mac
mongod

# Or if using a cloud service, ensure your MONGODB_URI is correct
```

7. **Run the application**

From the root directory:
```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Usage

### For Users

1. **Register**: Create an account with email and password
2. **Deposit**: Send USDT (TRC20) to the provided address
3. **Purchase Bot**: Buy the trading bot for 5 USDT
4. **Earn**: Bot trades automatically every 2 hours
5. **Refer**: Share your referral code to earn commissions

### For Admin

To access admin features:
1. Change the admin email check in `backend/routes/admin.js`
2. Replace `'admin@example.com'` with your admin user's email
3. Login with your admin account
4. Access the `/admin` route

## 💰 Profit Table

| Balance (USDT) | Daily Profit (USDT) |
|----------------|---------------------|
| 20.00          | 3.00               |
| 99.00          | 16.83              |
| 458.00         | 91.60              |
| 1288.00        | 283.36             |
| 4388.00        | 1097.00            |
| 10888.00       | 3048.64            |
| 25888.00       | 8284.16            |

## 🔧 Configuration

### Changing the Bot Price
Edit `backend/routes/bot.js`:
```javascript
const BOT_PRICE = 5; // Change this value
```

### Modifying Trade Frequency
Edit `backend/server.js`:
```javascript
// Current: Every 2 hours
cron.schedule('0 */2 * * *', () => {
  executeTradingCycle();
});

// Example: Every hour
cron.schedule('0 * * * *', () => {
  executeTradingCycle();
});
```

### Adding More Languages
1. Add translations to `frontend/src/i18n.js`
2. Add language option to `frontend/src/pages/Profile.jsx`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/transactions` - Get transactions
- `GET /api/users/trades` - Get trade history

### Wallet
- `GET /api/wallet/deposit-address` - Get deposit address
- `POST /api/wallet/deposit` - Submit deposit
- `POST /api/wallet/withdraw` - Request withdrawal
- `GET /api/wallet/withdrawals` - Get withdrawal requests

### Bot
- `POST /api/bot/purchase` - Purchase trading bot
- `GET /api/bot/status` - Get bot status
- `GET /api/bot/profit-table` - Get profit table

### Referral
- `GET /api/referral/info` - Get referral information
- `GET /api/referral/earnings` - Get referral earnings
- `GET /api/referral/validate/:code` - Validate referral code

### Admin
- `GET /api/admin/deposits/pending` - Get pending deposits
- `POST /api/admin/deposits/:id/approve` - Approve deposit
- `GET /api/admin/withdrawals/pending` - Get pending withdrawals
- `POST /api/admin/withdrawals/:id/approve` - Approve withdrawal
- `POST /api/admin/withdrawals/:id/reject` - Reject withdrawal
- `GET /api/admin/stats` - Get platform statistics

## 🎨 Customization

### Changing Colors
Edit `frontend/src/index.css` - modify gradient classes:
```css
.gradient-crypto {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
}
```

### Modifying Animations
Edit animation settings in components using Framer Motion:
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

## 🔒 Security Considerations

1. **Change JWT Secret**: Use a strong, random secret in production
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` files
4. **Database**: Secure your MongoDB instance
5. **Admin Access**: Implement proper role-based authentication
6. **Withdrawals**: Manual review prevents unauthorized transactions

## 📝 Important Notes

- This is a demonstration platform. Real trading requires proper exchange API integration.
- The trading bot simulates trades. For production, integrate with actual exchange APIs.
- Deposits and withdrawals require manual admin approval for security.
- The profit calculations are based on the predefined table.
- Always comply with local cryptocurrency regulations.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify MongoDB is accessible

### Frontend Not Loading
- Check if backend is running on port 5000
- Clear browser cache
- Check console for errors

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration settings
- Clear localStorage in browser

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Support

For support and questions:
- Join our Telegram group (configure link in the app)
- Check the Articles section for documentation
- Review FAQ in the platform

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder
3. Set environment variables in hosting platform

### Backend Deployment (Heroku/Railway/VPS)
1. Set up MongoDB (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy backend
4. Update frontend API URL

## 🔄 Future Enhancements

- Real exchange API integration
- Two-factor authentication
- Advanced analytics dashboard
- Mobile native apps
- Automated withdrawal processing
- More cryptocurrency pairs
- Advanced referral tiers

---

Built with ❤️ for the crypto community
