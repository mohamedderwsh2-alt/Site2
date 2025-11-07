import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiTrendingUp, FiDollarSign, FiActivity, FiUsers, FiClock } from 'react-icons/fi'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Card from '../components/Card'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 shimmer h-32" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-400">Here's your trading overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">{t('balance')}</span>
            <FiDollarSign className="text-2xl text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            {stats?.balance?.toFixed(2) || '0.00'} USDT
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('totalEarnings')}</span>
            <FiTrendingUp className="text-xl text-blue-400" />
          </div>
          <p className="text-xl font-bold text-blue-400">
            {stats?.totalEarnings?.toFixed(2) || '0.00'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('dailyProfit')}</span>
            <FiActivity className="text-xl text-purple-400" />
          </div>
          <p className="text-xl font-bold text-purple-400">
            {stats?.dailyProfit?.toFixed(2) || '0.00'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('referralEarnings')}</span>
            <FiUsers className="text-xl text-orange-400" />
          </div>
          <p className="text-xl font-bold text-orange-400">
            {stats?.referralEarnings?.toFixed(2) || '0.00'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('activeBot')}</span>
            <FiActivity className="text-xl text-green-400" />
          </div>
          <p className="text-xl font-bold">
            {stats?.hasPurchasedBot ? (
              <span className="text-green-400">Active</span>
            ) : (
              <span className="text-gray-400">Inactive</span>
            )}
          </p>
        </Card>
      </div>

      {/* Recent Trades */}
      {stats?.trades?.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiActivity className="text-purple-400" />
            {t('recentTrades')}
          </h3>
          <div className="space-y-3">
            {stats.trades.slice(0, 5).map((trade, index) => (
              <motion.div
                key={trade._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl glass"
              >
                <div>
                  <p className="font-medium capitalize">{trade.tradeType} on {trade.exchange}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(trade.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">+{trade.profit.toFixed(2)} USDT</p>
                  <p className="text-xs text-gray-400">{trade.executionTime}ms</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      {stats?.transactions?.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiClock className="text-blue-400" />
            {t('recentTransactions')}
          </h3>
          <div className="space-y-3">
            {stats.transactions.slice(0, 5).map((tx, index) => (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl glass"
              >
                <div>
                  <p className="font-medium">{t(tx.type)}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    tx.type === 'withdrawal' || tx.type === 'bot_purchase' 
                      ? 'text-red-400' 
                      : 'text-green-400'
                  }`}>
                    {tx.type === 'withdrawal' || tx.type === 'bot_purchase' ? '-' : '+'}
                    {tx.amount.toFixed(2)} USDT
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {t(tx.status)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* No Bot Message */}
      {!stats?.hasPurchasedBot && (
        <Card gradient className="text-center">
          <FiActivity className="text-5xl mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Start Your Trading Journey</h3>
          <p className="text-white/80 mb-4">
            Purchase a trading bot to start earning automated profits
          </p>
          <a
            href="/bot"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </a>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
