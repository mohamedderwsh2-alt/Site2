import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiCopy, FiSend, FiDownload, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'

const Wallet = () => {
  const { t } = useTranslation()
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('deposit')
  const [depositAddress, setDepositAddress] = useState('')
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    walletAddress: '',
    password: ''
  })
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDepositAddress()
    fetchWithdrawals()
  }, [])

  const fetchDepositAddress = async () => {
    try {
      const response = await api.get('/wallet/deposit-address')
      setDepositAddress(response.data.address)
    } catch (error) {
      console.error('Error fetching deposit address:', error)
    }
  }

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/wallet/withdrawals')
      setWithdrawals(response.data)
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success(t('codeCopied'))
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    
    if (!withdrawData.amount || !withdrawData.walletAddress || !withdrawData.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (parseFloat(withdrawData.amount) > user.balance) {
      toast.error(t('insufficientBalance'))
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/wallet/withdraw', withdrawData)
      toast.success(t('withdrawalSubmitted'))
      updateUser({ balance: response.data.newBalance })
      setWithdrawData({ amount: '', walletAddress: '', password: '' })
      fetchWithdrawals()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2">{t('wallet')}</h1>
        <p className="text-gray-400">Manage your USDT balance</p>
      </motion.div>

      {/* Balance Card */}
      <Card gradient>
        <p className="text-white/70 mb-2">{t('balance')}</p>
        <p className="text-4xl font-bold mb-4">{user?.balance?.toFixed(2) || '0.00'} USDT</p>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'deposit' 
                ? 'bg-white text-purple-600' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <FiDownload className="inline mr-2" />
            {t('deposit')}
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === 'withdraw' 
                ? 'bg-white text-purple-600' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <FiSend className="inline mr-2" />
            {t('withdraw')}
          </button>
        </div>
      </Card>

      {/* Deposit Section */}
      {activeTab === 'deposit' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <h3 className="text-lg font-bold mb-4">{t('depositAddress')}</h3>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-400 mb-2">USDT (TRC20) Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm break-all">{depositAddress}</code>
                <button
                  onClick={() => copyToClipboard(depositAddress)}
                  className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                >
                  <FiCopy />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <FiAlertCircle className="text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-400 mb-1">Important</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Send only USDT (TRC20) to this address</li>
                  <li>• {t('minimumDeposit')}</li>
                  <li>• Deposits will be credited after admin confirmation</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Withdraw Section */}
      {activeTab === 'withdraw' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <h3 className="text-lg font-bold mb-4">{t('withdraw')}</h3>
            
            <form onSubmit={handleWithdraw} className="space-y-4">
              <Input
                label={t('amount')}
                type="number"
                step="0.01"
                value={withdrawData.amount}
                onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                placeholder={t('enterAmount')}
              />
              
              <Input
                label={t('withdrawalAddress')}
                type="text"
                value={withdrawData.walletAddress}
                onChange={(e) => setWithdrawData({ ...withdrawData, walletAddress: e.target.value })}
                placeholder={t('enterAddress')}
              />
              
              <Input
                label={t('password')}
                type="password"
                value={withdrawData.password}
                onChange={(e) => setWithdrawData({ ...withdrawData, password: e.target.value })}
                placeholder="Confirm with your password"
              />

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
                icon={FiSend}
              >
                {loading ? 'Processing...' : t('confirmWithdrawal')}
              </Button>
            </form>

            <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <FiAlertCircle className="text-blue-400 text-xl flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-400 mb-1">Withdrawal Info</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Withdrawals are processed manually by admin</li>
                  <li>• Processing time: 1-24 hours</li>
                  <li>• Minimum withdrawal: 10 USDT</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Withdrawal History */}
          {withdrawals.length > 0 && (
            <Card>
              <h3 className="text-lg font-bold mb-4">Withdrawal History</h3>
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal._id}
                    className="p-4 rounded-xl glass flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{withdrawal.amount} USDT</p>
                      <p className="text-xs text-gray-400">
                        {new Date(withdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${
                      withdrawal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {t(withdrawal.status)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Wallet
