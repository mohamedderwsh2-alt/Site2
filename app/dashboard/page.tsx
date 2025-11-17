'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Bot, Activity, Clock } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { calculateDailyProfit, BOT_PRICE } from '@/lib/profitCalculator';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchUserData();
      fetchTrades();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades?limit=10');
      const data = await response.json();
      setTrades(data.trades);
    } catch (error) {
      console.error('Failed to load trades');
    }
  };

  const handlePurchaseBot = async () => {
    if (!user) return;

    if (user.balance < BOT_PRICE) {
      toast.error('Insufficient balance. Please deposit first.');
      return;
    }

    setPurchasing(true);

    try {
      const response = await fetch('/api/bot/purchase', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Bot purchased successfully!');
        fetchUserData();
      } else {
        toast.error(data.error || 'Failed to purchase bot');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setPurchasing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (!user) return null;

  const dailyProfit = calculateDailyProfit(user.balance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pb-24">
      <MobileNav />
      
      <div className="max-w-md mx-auto px-4 pt-20">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
            <p className="text-gray-400">Here's your trading overview</p>
          </Card>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20">
              <Wallet size={24} className="mb-2 text-blue-400" />
              <p className="text-sm text-gray-400 mb-1">Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(user.balance)} USDT</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20">
              <TrendingUp size={24} className="mb-2 text-green-400" />
              <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(user.totalEarnings)} USDT</p>
            </Card>
          </motion.div>
        </div>

        {/* Daily Profit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-orange-600/20 to-pink-600/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity size={24} className="text-orange-400" />
                <h3 className="font-semibold">Daily Profit</h3>
              </div>
              <Clock size={20} className="text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-orange-400 mb-1">
              +{formatCurrency(dailyProfit)} USDT
            </p>
            <p className="text-sm text-gray-400">
              {user.balance >= 20 ? 'Earning every 2 hours' : 'Minimum balance: 20 USDT'}
            </p>
          </Card>
        </motion.div>

        {/* Bot Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  user.hasPurchasedBot 
                    ? 'bg-green-600/20' 
                    : 'bg-gray-600/20'
                }`}>
                  <Bot size={24} className={user.hasPurchasedBot ? 'text-green-400' : 'text-gray-400'} />
                </div>
                <div>
                  <h3 className="font-semibold">Trading Bot</h3>
                  <p className={`text-sm ${user.hasPurchasedBot ? 'text-green-400' : 'text-gray-400'}`}>
                    {user.hasPurchasedBot ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              {user.hasPurchasedBot && (
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              )}
            </div>
            
            {!user.hasPurchasedBot && (
              <>
                <p className="text-gray-400 mb-4">
                  Purchase the trading bot for {BOT_PRICE} USDT to start earning automated profits every 2 hours.
                </p>
                <Button
                  onClick={handlePurchaseBot}
                  disabled={purchasing || user.balance < BOT_PRICE}
                  fullWidth
                >
                  {purchasing ? 'Purchasing...' : `Purchase Bot (${BOT_PRICE} USDT)`}
                </Button>
                {user.balance < BOT_PRICE && (
                  <p className="text-sm text-red-400 mt-2 text-center">
                    Insufficient balance. Please deposit first.
                  </p>
                )}
              </>
            )}
            
            {user.hasPurchasedBot && user.botPurchaseDate && (
              <p className="text-sm text-gray-400">
                Active since {formatDate(new Date(user.botPurchaseDate))}
              </p>
            )}
          </Card>
        </motion.div>

        {/* Recent Trades */}
        {trades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity size={20} />
                Recent Trades
              </h3>
              <div className="space-y-3">
                {trades.map((trade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  >
                    <div>
                      <p className="font-semibold text-green-400">
                        +{formatCurrency(trade.profitAmount)} USDT
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(new Date(trade.timestamp))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Balance</p>
                      <p className="font-semibold">{formatCurrency(trade.balanceAfterTrade)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
