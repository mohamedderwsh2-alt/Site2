'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react'
import { calculateDailyProfit } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/data')
      const data = await response.json()
      if (data.success) {
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userData) return null

  const balance = userData.wallet?.balance || 0
  const dailyProfit = calculateDailyProfit(balance)
  const hasActiveBot = userData.botPurchase?.isActive || false

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Balance Card */}
        <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-100 text-sm">Total Balance</p>
              <h2 className="text-4xl font-bold mt-1">
                {balance.toFixed(2)} USDT
              </h2>
            </div>
            <Wallet size={48} className="opacity-80" />
          </div>
          <div className="pt-4 border-t border-primary-500">
            <div className="flex justify-between">
              <div>
                <p className="text-primary-100 text-sm">Total Earned</p>
                <p className="text-xl font-semibold">
                  {userData.wallet?.totalEarned?.toFixed(2) || '0.00'} USDT
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Profit Card */}
        {hasActiveBot && (
          <div className="card border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Daily Profit</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {dailyProfit.toFixed(2)} USDT
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  Bot is active • Trading every 2 hours
                </p>
              </div>
              <TrendingUp size={32} className="text-green-500" />
            </div>
          </div>
        )}

        {/* Bot Status */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Trading Bot Status</h3>
          {hasActiveBot ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">Active</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Purchase Amount: {userData.botPurchase?.purchaseAmount?.toFixed(2)} USDT</p>
                <p className="mt-1">
                  Last Trade:{' '}
                  {userData.botPurchase?.lastTradeAt
                    ? new Date(userData.botPurchase.lastTradeAt).toLocaleString()
                    : 'No trades yet'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">No active trading bot</p>
              <button
                onClick={() => router.push('/bot')}
                className="btn-primary"
              >
                Purchase Bot
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/wallet?tab=deposit')}
            className="card hover:shadow-lg transition-shadow text-center"
          >
            <DollarSign size={32} className="mx-auto mb-2 text-primary-600" />
            <p className="font-medium">Deposit</p>
          </button>
          <button
            onClick={() => router.push('/wallet?tab=withdraw')}
            className="card hover:shadow-lg transition-shadow text-center"
          >
            <Wallet size={32} className="mx-auto mb-2 text-primary-600" />
            <p className="font-medium">Withdraw</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {userData.recentTransactions?.length > 0 ? (
              userData.recentTransactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{tx.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        tx.type === 'deposit' || tx.type === 'profit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}
                      {tx.amount.toFixed(2)} USDT
                    </p>
                    <p className="text-xs text-gray-500">{tx.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  )
}
