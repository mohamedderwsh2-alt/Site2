import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiActivity, FiShoppingCart, FiClock, FiTrendingUp, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Card from '../components/Card'
import Button from '../components/Button'

const Bot = () => {
  const { t } = useTranslation()
  const { user, updateUser } = useAuthStore()
  const [botStatus, setBotStatus] = useState(null)
  const [profitTable, setProfitTable] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchBotStatus()
    fetchProfitTable()
  }, [])

  const fetchBotStatus = async () => {
    try {
      const response = await api.get('/bot/status')
      setBotStatus(response.data)
    } catch (error) {
      console.error('Error fetching bot status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfitTable = async () => {
    try {
      const response = await api.get('/bot/profit-table')
      setProfitTable(response.data)
    } catch (error) {
      console.error('Error fetching profit table:', error)
    }
  }

  const handlePurchaseBot = async () => {
    if (user.balance < botStatus.botPrice) {
      toast.error(t('insufficientBalance'))
      return
    }

    setPurchasing(true)
    try {
      const response = await api.post('/bot/purchase')
      toast.success(t('botPurchased'))
      updateUser({ 
        balance: response.data.newBalance,
        hasPurchasedBot: true
      })
      fetchBotStatus()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 shimmer h-32" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2">{t('tradingBot')}</h1>
        <p className="text-gray-400">Automated crypto arbitrage trading</p>
      </motion.div>

      {/* Bot Status */}
      {botStatus?.hasPurchasedBot ? (
        <Card gradient>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FiActivity className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('botActive')}</h3>
                <p className="text-sm text-white/70">Trading every 2 hours</p>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/70 mb-1">{t('dailyProfit')}</p>
              <p className="text-2xl font-bold">{botStatus.dailyProfit?.toFixed(2)} USDT</p>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-1">{t('nextTrade')}</p>
              <p className="text-2xl font-bold">{botStatus.nextTradeIn}</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-2xl gradient-crypto flex items-center justify-center mx-auto mb-4">
              <FiActivity className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('purchaseBot')}</h3>
            <p className="text-gray-400 mb-6">
              Start earning automated profits 24/7
            </p>
            <div className="glass rounded-xl p-4 mb-6 inline-block">
              <p className="text-sm text-gray-400 mb-1">{t('botPrice')}</p>
              <p className="text-3xl font-bold text-purple-400">{botStatus.botPrice} USDT</p>
            </div>
            <Button
              onClick={handlePurchaseBot}
              variant="primary"
              disabled={purchasing || user.balance < botStatus.botPrice}
              icon={FiShoppingCart}
              className="mx-auto"
            >
              {purchasing ? 'Processing...' : t('purchaseBot')}
            </Button>
            {user.balance < botStatus.botPrice && (
              <p className="text-sm text-red-400 mt-4">
                {t('insufficientBalance')} - Need {(botStatus.botPrice - user.balance).toFixed(2)} more USDT
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <FiZap className="text-3xl text-yellow-400 mb-3" />
          <h4 className="font-bold mb-1">Lightning Fast</h4>
          <p className="text-sm text-gray-400">Executes trades in under 50ms</p>
        </Card>
        
        <Card>
          <FiTrendingUp className="text-3xl text-green-400 mb-3" />
          <h4 className="font-bold mb-1">3-5% Profit</h4>
          <p className="text-sm text-gray-400">Each trade targets 3-5% gain</p>
        </Card>
        
        <Card>
          <FiClock className="text-3xl text-blue-400 mb-3" />
          <h4 className="font-bold mb-1">24/7 Trading</h4>
          <p className="text-sm text-gray-400">Automated every 2 hours</p>
        </Card>
        
        <Card>
          <FiActivity className="text-3xl text-purple-400 mb-3" />
          <h4 className="font-bold mb-1">Low Risk</h4>
          <p className="text-sm text-gray-400">Uses only 10% per trade</p>
        </Card>
      </div>

      {/* Profit Table */}
      <Card>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-green-400" />
          {t('profitTable')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2">Balance (USDT)</th>
                <th className="text-right py-3 px-2">Daily Profit (USDT)</th>
              </tr>
            </thead>
            <tbody>
              {profitTable.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 font-medium">{row.balance.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right text-green-400 font-bold">
                    {row.dailyProfit.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* How It Works */}
      <Card>
        <h3 className="text-lg font-bold mb-4">{t('howItWorks')}</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl gradient-crypto flex items-center justify-center flex-shrink-0">
              <span className="font-bold">1</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">Price Analysis</h4>
              <p className="text-sm text-gray-400">
                The bot monitors price differences between Binance and OKX exchanges in real-time.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl gradient-crypto flex items-center justify-center flex-shrink-0">
              <span className="font-bold">2</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">Opportunity Detection</h4>
              <p className="text-sm text-gray-400">
                When price difference exceeds 3%, the bot automatically initiates a trade.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl gradient-crypto flex items-center justify-center flex-shrink-0">
              <span className="font-bold">3</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">Instant Execution</h4>
              <p className="text-sm text-gray-400">
                Trades are executed in under 50ms using 10% of your balance for risk management.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl gradient-crypto flex items-center justify-center flex-shrink-0">
              <span className="font-bold">4</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">Profit Distribution</h4>
              <p className="text-sm text-gray-400">
                Profits are distributed equally (3%) among all active users after each successful trade.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Bot
