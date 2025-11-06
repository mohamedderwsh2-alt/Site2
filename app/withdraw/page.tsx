'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUpCircle, AlertTriangle } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import { MIN_WITHDRAWAL } from '@/lib/profitCalculator';
import toast from 'react-hot-toast';

export default function WithdrawPage() {
  const { status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: '',
    password: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setUser(data.user);
      if (data.user.withdrawalAddress) {
        setFormData(prev => ({ ...prev, walletAddress: data.user.withdrawalAddress }));
      }
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal amount is ${MIN_WITHDRAWAL} USDT`);
      return;
    }

    if (amount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!formData.walletAddress.match(/^T[a-zA-Z0-9]{33}$/)) {
      toast.error('Invalid USDT TRC20 wallet address');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          walletAddress: formData.walletAddress,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Withdrawal request submitted successfully!');
        setFormData({ amount: '', walletAddress: formData.walletAddress, password: '' });
        fetchUserData();
      } else {
        toast.error(data.error || 'Withdrawal failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
              <ArrowUpCircle size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Withdraw USDT</h1>
              <p className="text-gray-400">TRC20 Network</p>
            </div>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <p className="text-sm text-gray-400 mb-1">Available Balance</p>
            <p className="text-3xl font-bold">{formatCurrency(user.balance)} USDT</p>
          </Card>
        </motion.div>

        {/* Withdrawal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Amount (USDT)"
                type="number"
                step="0.01"
                min={MIN_WITHDRAWAL}
                max={user.balance}
                placeholder={`Min: ${MIN_WITHDRAWAL} USDT`}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />

              <Input
                label="USDT Wallet Address (TRC20)"
                type="text"
                placeholder="TYourUSDTWalletAddressHere..."
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                required
              />

              <Input
                label="Account Password"
                type="password"
                placeholder="Enter your password to confirm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Request Withdrawal'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card>
            <h3 className="font-semibold mb-4">Withdrawal Information</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p>Minimum withdrawal: <strong className="text-white">{MIN_WITHDRAWAL} USDT</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p>Network: <strong className="text-white">TRC20</strong> (TRON)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p>Processing time: <strong className="text-white">Within 24 hours</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">•</span>
                <p>Withdrawals are processed manually for security</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-yellow-600/10 border-yellow-600/20">
            <div className="flex gap-3">
              <AlertTriangle size={24} className="text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-2">Important</h3>
                <p className="text-sm text-gray-300">
                  Please double-check your wallet address before submitting. Withdrawals sent to 
                  incorrect addresses cannot be recovered.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
