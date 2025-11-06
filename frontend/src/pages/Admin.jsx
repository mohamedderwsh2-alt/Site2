import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiUsers, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'
import Card from '../components/Card'
import Button from '../components/Button'

const Admin = () => {
  const [stats, setStats] = useState(null)
  const [pendingDeposits, setPendingDeposits] = useState([])
  const [pendingWithdrawals, setPendingWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('deposits')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, depositsRes, withdrawalsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/deposits/pending'),
        api.get('/admin/withdrawals/pending')
      ])
      
      setStats(statsRes.data)
      setPendingDeposits(depositsRes.data)
      setPendingWithdrawals(withdrawalsRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Access denied or error fetching data')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDeposit = async (depositId) => {
    try {
      await api.post(`/admin/deposits/${depositId}/approve`)
      toast.success('Deposit approved successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to approve deposit')
    }
  }

  const handleApproveWithdrawal = async (withdrawalId) => {
    const txHash = prompt('Enter transaction hash:')
    if (!txHash) return

    try {
      await api.post(`/admin/withdrawals/${withdrawalId}/approve`, { txHash })
      toast.success('Withdrawal approved successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to approve withdrawal')
    }
  }

  const handleRejectWithdrawal = async (withdrawalId) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      await api.post(`/admin/withdrawals/${withdrawalId}/reject`, { reason })
      toast.success('Withdrawal rejected')
      fetchData()
    } catch (error) {
      toast.error('Failed to reject withdrawal')
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
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-400">Platform management and oversight</p>
      </motion.div>

      {/* Platform Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Users</span>
              <FiUsers className="text-xl text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Active Users</span>
              <FiActivity className="text-xl text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.activeUsers}</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Deposits</span>
              <FiTrendingUp className="text-xl text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {stats.totalDeposits.toFixed(2)}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Withdrawals</span>
              <FiDollarSign className="text-xl text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-orange-400">
              {stats.totalWithdrawals.toFixed(2)}
            </p>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'deposits'
              ? 'gradient-crypto'
              : 'glass hover:bg-white/10'
          }`}
        >
          Pending Deposits ({pendingDeposits.length})
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'withdrawals'
              ? 'gradient-crypto'
              : 'glass hover:bg-white/10'
          }`}
        >
          Pending Withdrawals ({pendingWithdrawals.length})
        </button>
      </div>

      {/* Pending Deposits */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          {pendingDeposits.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-400">No pending deposits</p>
            </Card>
          ) : (
            pendingDeposits.map((deposit) => (
              <Card key={deposit._id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full gradient-crypto flex items-center justify-center">
                        <span className="font-bold">
                          {deposit.userId?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold">{deposit.userId?.username}</p>
                        <p className="text-sm text-gray-400">{deposit.userId?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-400">Amount:</span>{' '}
                        <span className="font-bold text-green-400">{deposit.amount} USDT</span>
                      </p>
                      <p>
                        <span className="text-gray-400">Date:</span>{' '}
                        {new Date(deposit.createdAt).toLocaleString()}
                      </p>
                      {deposit.txHash && (
                        <p>
                          <span className="text-gray-400">TX Hash:</span>{' '}
                          <code className="text-xs">{deposit.txHash}</code>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleApproveDeposit(deposit._id)}
                      variant="success"
                      icon={FiCheck}
                      className="text-sm px-4 py-2"
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pending Withdrawals */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          {pendingWithdrawals.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-400">No pending withdrawals</p>
            </Card>
          ) : (
            pendingWithdrawals.map((withdrawal) => (
              <Card key={withdrawal._id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full gradient-crypto flex items-center justify-center">
                        <span className="font-bold">
                          {withdrawal.userId?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold">{withdrawal.userId?.username}</p>
                        <p className="text-sm text-gray-400">{withdrawal.userId?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-400">Amount:</span>{' '}
                        <span className="font-bold text-orange-400">{withdrawal.amount} USDT</span>
                      </p>
                      <p>
                        <span className="text-gray-400">Address:</span>{' '}
                        <code className="text-xs break-all">{withdrawal.walletAddress}</code>
                      </p>
                      <p>
                        <span className="text-gray-400">Date:</span>{' '}
                        {new Date(withdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleApproveWithdrawal(withdrawal._id)}
                      variant="success"
                      icon={FiCheck}
                      className="text-sm px-4 py-2"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectWithdrawal(withdrawal._id)}
                      variant="danger"
                      icon={FiX}
                      className="text-sm px-4 py-2"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Admin
