'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Copy, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ReferralPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchReferralData();
    }
  }, [status, router]);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral');
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (data?.referralCode) {
      navigator.clipboard.writeText(data.referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (!data) return null;

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
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Referral Program</h1>
              <p className="text-gray-400">Earn passive income</p>
            </div>
          </div>
        </motion.div>

        {/* Referral Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20">
            <h3 className="font-semibold mb-3">Your Referral Code</h3>
            <div className="bg-white/10 rounded-xl p-4 mb-3 text-center">
              <p className="text-3xl font-bold tracking-wider">{data.referralCode}</p>
            </div>
            <Button
              onClick={handleCopy}
              fullWidth
              variant={copied ? 'secondary' : 'primary'}
            >
              {copied ? (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} className="mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
              <TrendingUp size={24} className="mb-2 text-blue-400" />
              <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(data.totalCommission)} USDT</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20">
              <Users size={24} className="mb-2 text-green-400" />
              <p className="text-sm text-gray-400 mb-1">Referred Users</p>
              <p className="text-2xl font-bold">{data.referralCount}</p>
            </Card>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card>
            <h3 className="font-semibold mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">5%</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Initial Deposit Commission</p>
                  <p className="text-sm text-gray-400">
                    Earn 5% instantly when your referral makes their first deposit
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">20%</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Ongoing Profit Commission</p>
                  <p className="text-sm text-gray-400">
                    Earn 20% of all profits generated by your referrals, forever
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Example Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-yellow-400" />
              Example Earnings
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Referral deposits 100 USDT</span>
                <span className="text-green-400 font-bold">+5 USDT</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Referral earns 50 USDT/day</span>
                <span className="text-green-400 font-bold">+10 USDT/day</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Your monthly passive income</span>
                <span className="text-green-400 font-bold">+300 USDT/month</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Referrals List */}
        {data.referrals && data.referrals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <h3 className="font-semibold mb-4">Your Referrals</h3>
              <div className="space-y-3">
                {data.referrals.map((referral: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{referral.user.name}</p>
                        <p className="text-xs text-gray-400">
                          Joined {formatDate(new Date(referral.user.createdAt))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">
                          +{formatCurrency(referral.totalCommission)} USDT
                        </p>
                        <p className="text-xs text-gray-400">Total earned</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Deposit: {formatCurrency(referral.depositCommission)} USDT</span>
                      <span>Profit: {formatCurrency(referral.profitCommission)} USDT</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {data.referrals && data.referrals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="text-center py-8">
              <Users size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No referrals yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Share your referral code to start earning!
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
