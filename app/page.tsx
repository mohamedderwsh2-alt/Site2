'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import LoadingSpinner from '@/components/LoadingSpinner';

const features = [
  {
    icon: TrendingUp,
    title: 'Automated Trading',
    description: 'Bot executes trades every 2 hours, 24/7 automatically',
  },
  {
    icon: Shield,
    title: 'Low Risk',
    description: 'Only 10% of balance used per trade, minimizing exposure',
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Trades completed in under 50 milliseconds',
  },
  {
    icon: Users,
    title: 'Referral Rewards',
    description: 'Earn 5% on deposits + 20% on referral profits',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Crypto Arbitrage</span>
            <br />
            <span className="text-white">Trading Bot</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Earn automated profits by exploiting price differences between Binance and OKX exchanges
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button>
                Get Started <ArrowRight size={20} className="ml-2 inline" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Profit Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
              Profit Calculator
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left">Balance (USDT)</th>
                    <th className="py-3 px-4 text-right">Daily Profit (USDT)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [20, 3],
                    [99, 16.83],
                    [458, 91.60],
                    [1288, 283.36],
                    [4388, 1097.00],
                    [10888, 3048.64],
                    [25888, 8284.16],
                  ].map(([balance, profit], index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold">{balance.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-green-400 font-semibold">
                        +{profit.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6 gradient-text">How Does It Work?</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our trading bot takes advantage of price differences between OKX and Binance exchanges.
              </p>
              <p>
                Every two hours, it analyzes the market automatically. When the price difference exceeds 3%,
                the system executes an instant buy/sell trade.
              </p>
              <p>
                The bot uses only 10% of each user's balance per trade, minimizing risk during market
                fluctuations. Each operation is completed in under 50 milliseconds (0.05 seconds).
              </p>
              <p>
                After each trade, the profits are distributed equally (3%) among all active users.
                A small remaining portion is reserved by the system for bot development and team salaries,
                ensuring continuous and sustainable platform growth.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
