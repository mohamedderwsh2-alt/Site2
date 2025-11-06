'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [statsRes, withdrawalsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/withdrawals?status=pending'),
      ]);

      if (!statsRes.ok || !withdrawalsRes.ok) {
        toast.error('Unauthorized access');
        router.push('/dashboard');
        return;
      }

      const statsData = await statsRes.json();
      const withdrawalsData = await withdrawalsRes.json();

      setStats(statsData);
      setWithdrawals(withdrawalsData.withdrawals);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (transactionId: string, newStatus: 'completed' | 'rejected') => {
    setProcessing(transactionId);

    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Withdrawal ${newStatus} successfully`);
        fetchData();
      } else {
        toast.error('Failed to update withdrawal');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setProcessing(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage your platform</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
              <Users size={32} className="mb-3 text-blue-400" />
              <p className="text-sm text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats.users.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.users.active} active
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20">
              <DollarSign size={32} className="mb-3 text-green-400" />
              <p className="text-sm text-gray-400 mb-1">Total Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.finances.totalBalance)}</p>
              <p className="text-xs text-gray-500 mt-1">USDT</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20">
              <TrendingUp size={32} className="mb-3 text-purple-400" />
              <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.finances.totalEarnings)}</p>
              <p className="text-xs text-gray-500 mt-1">USDT</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20">
              <Activity size={32} className="mb-3 text-orange-400" />
              <p className="text-sm text-gray-400 mb-1">Trades (24h)</p>
              <p className="text-3xl font-bold">{stats.trades.last24h}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.trades.total} total
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Financial Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Financial Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 mb-2">Total Deposits</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(stats.finances.totalDeposits)} USDT
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Total Withdrawals</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(stats.finances.totalWithdrawals)} USDT
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Net Flow</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(stats.finances.totalDeposits - stats.finances.totalWithdrawals)} USDT
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Pending Withdrawals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Pending Withdrawals</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-600/20">
                <AlertCircle size={16} className="text-yellow-400" />
                <span className="text-sm font-semibold">{withdrawals.length} pending</span>
              </div>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No pending withdrawals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <motion.div
                    key={withdrawal._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{withdrawal.userId.name}</h3>
                          <span className="px-2 py-1 rounded-full bg-yellow-600/20 text-yellow-400 text-xs font-semibold">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{withdrawal.userId.email}</p>
                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <p>
                            <span className="text-gray-400">Amount:</span>{' '}
                            <span className="font-bold text-green-400">
                              {formatCurrency(withdrawal.amount)} USDT
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-400">Date:</span>{' '}
                            <span className="font-semibold">
                              {formatDate(new Date(withdrawal.createdAt))}
                            </span>
                          </p>
                        </div>
                        <div className="mt-2 p-3 bg-black/30 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Wallet Address:</p>
                          <p className="font-mono text-sm break-all">{withdrawal.walletAddress}</p>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Button
                          onClick={() => handleWithdrawal(withdrawal._id, 'completed')}
                          disabled={processing === withdrawal._id}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleWithdrawal(withdrawal._id, 'rejected')}
                          disabled={processing === withdrawal._id}
                          variant="danger"
                          className="flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
