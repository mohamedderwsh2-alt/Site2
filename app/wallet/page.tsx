'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { Copy, Check, ArrowDown, ArrowUp } from 'lucide-react'
import { motion } from 'framer-motion'

// Note: In production, set NEXT_PUBLIC_USDT_WALLET_ADDRESS in your .env file
// For now, using a placeholder that should be replaced
const USDT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_USDT_WALLET_ADDRESS || '0xYourFixedUSDTWalletAddressHere'

export default function WalletPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [copied, setCopied] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [withdrawPassword, setWithdrawPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    const tab = searchParams.get('tab')
    if (tab === 'withdraw') {
      setActiveTab('withdraw')
    }

    fetchBalance()
  }, [status, router, searchParams])

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/user/data')
      const data = await response.json()
      if (data.success) {
        setBalance(data.user.wallet?.balance || 0)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(USDT_WALLET_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Deposit failed')
      } else {
        setSuccess('Deposit recorded successfully!')
        setDepositAmount('')
        fetchBalance()
      }
    } catch (err) {
      setError('Deposit failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (parseFloat(withdrawAmount) > balance) {
      setError('Insufficient balance')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          walletAddress: withdrawAddress,
          password: withdrawPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Withdrawal failed')
      } else {
        setSuccess('Withdrawal request submitted. It will be processed manually.')
        setWithdrawAmount('')
        setWithdrawAddress('')
        setWithdrawPassword('')
        fetchBalance()
      }
    } catch (err) {
      setError('Withdrawal failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Balance Card */}
        <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <p className="text-primary-100 text-sm mb-2">Available Balance</p>
          <h2 className="text-4xl font-bold">{balance.toFixed(2)} USDT</h2>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'deposit'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'withdraw'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Withdraw
          </button>
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

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-4">
              <ArrowDown className="text-green-600" size={24} />
              <h3 className="text-xl font-semibold">Deposit USDT</h3>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  USDT Wallet Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={USDT_WALLET_ADDRESS}
                    readOnly
                    className="input-field flex-1 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check size={20} className="text-green-600" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Send USDT to this address. Your deposit will be credited after confirmation.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Processing...' : 'Record Deposit'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-4">
              <ArrowUp className="text-red-600" size={24} />
              <h3 className="text-xl font-semibold">Withdraw USDT</h3>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {balance.toFixed(2)} USDT
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your USDT Wallet Address
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="0x..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Password
                </label>
                <input
                  type="password"
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Withdrawal requests are processed manually. 
                Please allow 24-48 hours for processing.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  )
}
