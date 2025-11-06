'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Bot, Zap, TrendingUp, CheckCircle } from 'lucide-react'
import { calculateDailyProfit } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function BotPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [purchaseAmount, setPurchaseAmount] = useState('5')
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setPurchasing(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/bot/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: purchaseAmount }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Purchase failed')
      } else {
        setSuccess('Bot purchased successfully!')
        fetchUserData()
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError('Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
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
  const hasActiveBot = userData.botPurchase?.isActive || false
  const dailyProfit = calculateDailyProfit(balance)

  if (hasActiveBot) {
    return (
      <AppLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white text-center">
            <CheckCircle size={64} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bot Active</h2>
            <p className="text-green-100">
              Your trading bot is running and generating profits
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Bot Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Purchase Amount:</span>
                <span className="font-semibold">
                  {userData.botPurchase?.purchaseAmount?.toFixed(2)} USDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold">{balance.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Profit:</span>
                <span className="font-semibold text-green-600">
                  {dailyProfit.toFixed(2)} USDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trade Frequency:</span>
                <span className="font-semibold">Every 2 hours</span>
              </div>
            </div>
          </div>

          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">
              How It Works
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Bot analyzes price differences between Binance and OKX
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Executes trades every 2 hours automatically
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Profits are added to your balance automatically
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Each trade uses only 10% of your balance (low risk)
              </li>
            </ul>
          </div>
        </motion.div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="card text-center">
          <Bot size={64} className="mx-auto mb-4 text-primary-600" />
          <h2 className="text-2xl font-bold mb-2">Purchase Trading Bot</h2>
          <p className="text-gray-600">
            Start earning passive income with our automated trading bot
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Profit Calculator</h3>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your Balance</p>
              <p className="text-2xl font-bold">{balance.toFixed(2)} USDT</p>
            </div>
            {balance >= 5 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 mb-1">Estimated Daily Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  {dailyProfit.toFixed(2)} USDT
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Based on current balance • 12 trades per day
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Purchase Bot</h3>
          <form onSubmit={handlePurchase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Amount (Minimum: 5 USDT)
              </label>
              <input
                type="number"
                step="0.01"
                min="5"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Available Balance: {balance.toFixed(2)} USDT
              </p>
            </div>

            {balance < parseFloat(purchaseAmount) && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                Insufficient balance. Please deposit more USDT.
              </div>
            )}

            <button
              type="submit"
              disabled={purchasing || balance < parseFloat(purchaseAmount)}
              className="btn-primary w-full"
            >
              {purchasing ? 'Processing...' : 'Purchase Bot'}
            </button>
          </form>
        </div>

        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={20} className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">Features</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              Automated trading every 2 hours
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              Low risk (uses only 10% per trade)
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              Instant profit distribution
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              No manual intervention required
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Profit Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Balance</th>
                  <th className="text-right py-2 px-2">Daily Profit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { balance: 20, profit: 3.0 },
                  { balance: 99, profit: 16.83 },
                  { balance: 458, profit: 91.6 },
                  { balance: 1288, profit: 283.36 },
                  { balance: 4388, profit: 1097.0 },
                  { balance: 10888, profit: 3048.64 },
                  { balance: 25888, profit: 8284.16 },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-2">{row.balance.toFixed(2)} USDT</td>
                    <td className="text-right py-2 px-2 font-semibold text-green-600">
                      {row.profit.toFixed(2)} USDT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  )
}
