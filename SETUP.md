# Quick Setup Guide

## Prerequisites Checklist
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed or cloud instance ready
- [ ] npm or yarn installed
- [ ] Git installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend

1. Copy the environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `backend/.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crypto-trading-platform
JWT_SECRET=your_secure_random_secret_key_here
ADMIN_WALLET_ADDRESS=YOUR_USDT_TRC20_WALLET_ADDRESS_HERE
NODE_ENV=development
```

**Important**: 
- Change `JWT_SECRET` to a random secure string
- Add your real USDT (TRC20) wallet address for `ADMIN_WALLET_ADDRESS`

### 3. Start MongoDB

**Option A - Local MongoDB:**
```bash
# Start MongoDB service
# Linux/Mac:
sudo systemctl start mongod
# or
mongod

# Windows:
# Start MongoDB as a Windows Service from Services panel
```

**Option B - MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` with your connection string

### 4. Run the Application

From the workspace root directory:

```bash
# Option 1: Run both frontend and backend together
npm run dev

# Option 2: Run separately in different terminals
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### 6. Create Your First User

1. Open http://localhost:3000 in your browser
2. Click "Register"
3. Fill in the registration form
4. You're ready to use the platform!

## Admin Setup

To access admin features:

1. Open `backend/routes/admin.js`
2. Find line 9:
```javascript
if (user.email !== 'admin@example.com') {
```
3. Replace `'admin@example.com'` with your admin user's email
4. Register/login with that email
5. Navigate to `/admin` in the app

## Testing the Platform

### Test User Journey:
1. **Register** a new account
2. **Login** with your credentials
3. View the **Dashboard**
4. Check **Wallet** section for deposit address
5. Try **Bot** section to see bot information
6. Check **Referral** page for your referral code
7. Update **Profile** settings

### Test Admin Features:
1. Login with admin account
2. Navigate to Admin panel
3. Create test deposit/withdrawal requests
4. Approve/reject them from admin panel

## Common Issues and Solutions

### Issue: MongoDB Connection Error
**Solution**: 
- Check if MongoDB is running: `sudo systemctl status mongod`
- Verify MONGODB_URI in .env is correct
- For cloud MongoDB, check network access whitelist

### Issue: Port Already in Use
**Solution**:
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env to different number
```

### Issue: Frontend Can't Connect to Backend
**Solution**:
- Ensure backend is running on port 5000
- Check proxy settings in `frontend/vite.config.js`
- Verify no CORS errors in browser console

### Issue: JWT/Authentication Errors
**Solution**:
- Clear browser localStorage
- Verify JWT_SECRET is set in .env
- Restart backend server

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes reflect immediately
- Backend: Nodemon restarts server on file changes

### Database GUI
View your MongoDB data easily:
- **MongoDB Compass**: https://www.mongodb.com/products/compass
- **Studio 3T**: https://studio3t.com/
- Connect using your MONGODB_URI

### API Testing
Test API endpoints with:
- **Postman**: https://www.postman.com/
- **Thunder Client** (VS Code extension)
- **curl** commands

Example curl test:
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Add real USDT wallet address
- [ ] Enable HTTPS
- [ ] Set up proper domain
- [ ] Configure CORS properly
- [ ] Set up backup system for database
- [ ] Add monitoring and logging
- [ ] Review security settings
- [ ] Test all features thoroughly

## Next Steps

1. **Customize the Platform**:
   - Update branding and colors
   - Modify profit table if needed
   - Add your Telegram support link

2. **Add Real Trading**:
   - Integrate Binance API
   - Integrate OKX API
   - Implement real arbitrage logic

3. **Enhance Security**:
   - Add 2FA
   - Implement rate limiting
   - Add captcha on registration

4. **Scale the Platform**:
   - Add caching (Redis)
   - Implement load balancing
   - Optimize database queries

## Support

If you encounter issues:
1. Check this guide
2. Review error logs in terminal
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

Happy trading! 🚀
