# 📦 Installation Guide

## Step-by-Step Setup Instructions

### 1. System Requirements

- **Node.js**: Version 18.0 or higher
- **MongoDB**: Version 5.0 or higher
- **npm**: Version 9.0 or higher
- **Operating System**: Windows, macOS, or Linux

### 2. Install Node.js

#### Windows/macOS
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install MongoDB

#### Option A: Local Installation

**Windows**:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run installer
3. Start MongoDB service

**macOS**:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux**:
```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string
5. Use in `.env.local` file

### 4. Clone and Install Project

```bash
# Clone the repository
git clone <your-repo-url>
cd crypto-trading-bot-platform

# Install dependencies
npm install
```

### 5. Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
# MongoDB - Choose one:
# Local:
MONGODB_URI=mongodb://localhost:27017/crypto-trading-bot
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crypto-trading-bot

# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here

# Your domain
NEXTAUTH_URL=http://localhost:3000

# Your USDT TRC20 wallet address
DEPOSIT_WALLET_ADDRESS=TYourActualWalletAddressHere

# Your Telegram group link
TELEGRAM_GROUP_URL=https://t.me/your_group

# Admin email for admin panel access
ADMIN_EMAIL=admin@yourdomain.com
```

### 6. Generate NextAuth Secret

**Linux/macOS**:
```bash
openssl rand -base64 32
```

**Windows PowerShell**:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`.

### 7. Start Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### 8. Create Admin Account

1. Go to [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
2. Register with the email you set in `ADMIN_EMAIL`
3. Login and visit [http://localhost:3000/admin](http://localhost:3000/admin)

### 9. Setup Automated Profit Distribution

#### Option A: Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the cron job
pm2 start scripts/profit-cron.js --cron "0 */2 * * *" --name "crypto-bot-cron"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions shown
```

#### Option B: Using System Cron (Linux/macOS)

```bash
# Edit crontab
crontab -e

# Add this line (adjust path to your project):
0 */2 * * * cd /full/path/to/crypto-trading-bot-platform && node scripts/profit-cron.js >> /var/log/crypto-bot.log 2>&1
```

#### Option C: Windows Task Scheduler

1. Open "Task Scheduler"
2. Click "Create Task"
3. Name: "Crypto Bot Profit Distribution"
4. Triggers: New trigger → Daily → Repeat every 2 hours
5. Actions: New action → Start a program
   - Program: `node`
   - Arguments: `C:\full\path\to\crypto-trading-bot-platform\scripts\profit-cron.js`
   - Start in: `C:\full\path\to\crypto-trading-bot-platform`

### 10. Verify Installation

1. **Check MongoDB Connection**:
   - Visit dashboard after login
   - If data loads, MongoDB is working

2. **Check Profit Cron**:
   ```bash
   # Test manually
   node scripts/profit-cron.js
   ```

3. **Check All Features**:
   - ✅ Register new user
   - ✅ Login
   - ✅ View dashboard
   - ✅ Purchase bot (need balance first)
   - ✅ View deposit address
   - ✅ Check referral code
   - ✅ Access admin panel (with admin email)

## 🐛 Common Issues

### Issue: MongoDB Connection Failed

**Solution**:
```bash
# Check if MongoDB is running
# Linux/macOS:
sudo systemctl status mongod

# Windows: Check Services app for MongoDB

# Restart MongoDB
# Linux/macOS:
sudo systemctl restart mongod

# Windows: Restart from Services
```

### Issue: Port 3000 Already in Use

**Solution**:
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process using port 3000
# Linux/macOS:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: NextAuth Configuration Error

**Solution**:
- Ensure `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your domain
- Clear browser cookies
- Restart dev server

### Issue: Module Not Found

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📱 Mobile Testing

### Local Network Testing

1. Find your local IP:
   ```bash
   # Linux/macOS:
   ifconfig | grep "inet "
   
   # Windows:
   ipconfig
   ```

2. Update `.env.local`:
   ```env
   NEXTAUTH_URL=http://192.168.1.XXX:3000
   ```

3. Access from phone: `http://192.168.1.XXX:3000`

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Custom Server

```bash
# Build
npm run build

# Copy files to server
# - .next/
# - public/
# - package.json
# - node_modules/

# On server:
npm install --production
npm start
```

## 📝 Next Steps

After installation:

1. **Customize Branding**:
   - Edit `app/layout.tsx` for site title
   - Update colors in `tailwind.config.ts`
   - Add your logo

2. **Setup Telegram Group**:
   - Create Telegram group
   - Add group link to `.env.local`

3. **Get USDT Wallet**:
   - Create TRC20 USDT wallet
   - Add address to `.env.local`

4. **Test Everything**:
   - Create test accounts
   - Test all features
   - Verify cron job runs

5. **Go Live**:
   - Deploy to production
   - Setup monitoring
   - Announce to users

## 💡 Tips

- Use MongoDB Atlas for easier setup
- Use PM2 for process management
- Enable MongoDB backups
- Monitor logs regularly
- Keep dependencies updated

---

Need help? Check the main README.md or contact support!