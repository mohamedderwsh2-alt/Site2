# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_USDT_WALLET_ADDRESS="0xYourFixedUSDTWalletAddressHere"
```

## Important Notes:

1. **NEXTAUTH_SECRET**: Generate a random secret key. You can use:
   ```bash
   openssl rand -base64 32
   ```

2. **NEXT_PUBLIC_USDT_WALLET_ADDRESS**: This is the fixed USDT wallet address that will be displayed to users for deposits. Replace with your actual wallet address.

3. **DATABASE_URL**: For SQLite (default), use `file:./dev.db`. For PostgreSQL in production, use:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

4. **NEXTAUTH_URL**: In production, change this to your actual domain URL.

## Production Deployment

For production, make sure to:
- Use a secure database (PostgreSQL recommended)
- Set strong NEXTAUTH_SECRET
- Update NEXTAUTH_URL to your production domain
- Set up proper environment variables in your hosting platform
- Configure SSL/HTTPS
