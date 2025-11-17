'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, BookOpen, ExternalLink, Shield, Zap, TrendingUp } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

const articles = [
  {
    icon: HelpCircle,
    title: 'How Does the Bot Generate Profit?',
    content: `Our trading bot takes advantage of price differences between OKX and Binance exchanges. 
    Every two hours, it analyzes the market automatically. When the price difference between the two 
    exchanges exceeds 3%, the system executes an instant buy/sell trade.`,
  },
  {
    icon: Shield,
    title: 'Risk Management',
    content: `The bot uses only 10% of each user's balance per trade, minimizing risk during market 
    fluctuations. This conservative approach ensures your capital is protected while still generating 
    consistent profits.`,
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    content: `Each operation is completed in under 50 milliseconds (0.05 seconds). This lightning-fast 
    execution ensures we capture the best arbitrage opportunities before they disappear.`,
  },
  {
    icon: TrendingUp,
    title: 'Profit Distribution',
    content: `After each trade, the profits are distributed equally (3%) among all active users. 
    A small remaining portion is reserved by the system for bot development and team salaries, 
    ensuring continuous and sustainable platform growth.`,
  },
];

export default function SupportPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleTelegramClick = () => {
    const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL || 'https://t.me/your_support_group';
    window.open(telegramUrl, '_blank');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pb-24">
      <MobileNav />
      
      <div className="max-w-md mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <HelpCircle size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Support & Help</h1>
              <p className="text-gray-400">We're here to help</p>
            </div>
          </div>
        </motion.div>

        {/* Telegram Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Telegram Support</h3>
                <p className="text-sm text-gray-400">Get instant help from our team</p>
              </div>
            </div>
            <Button
              onClick={handleTelegramClick}
              fullWidth
            >
              Join Telegram Group
              <ExternalLink size={16} className="ml-2" />
            </Button>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              Quick Facts
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p><strong className="text-white">Bot Price:</strong> 5 USDT (one-time)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p><strong className="text-white">Trade Frequency:</strong> Every 2 hours (12x per day)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p><strong className="text-white">Minimum Balance:</strong> 20 USDT to start earning</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p><strong className="text-white">Minimum Withdrawal:</strong> 10 USDT</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p><strong className="text-white">Network:</strong> USDT TRC20</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Help Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Help Articles</h2>
          <div className="space-y-4">
            {articles.map((article, index) => {
              const Icon = article.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card hover>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {article.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-1">Is my money safe?</p>
                <p className="text-sm text-gray-400">
                  Yes, only 10% of your balance is used per trade, and all funds remain in your account.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">How long does withdrawal take?</p>
                <p className="text-sm text-gray-400">
                  Withdrawals are processed manually within 24 hours for security purposes.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Can I stop the bot?</p>
                <p className="text-sm text-gray-400">
                  You can withdraw your funds at any time. The bot will continue to generate profits as long as you maintain the minimum balance.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">What if I refer friends?</p>
                <p className="text-sm text-gray-400">
                  You'll earn 5% of their initial deposit instantly, plus 20% of all their future profits permanently.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
