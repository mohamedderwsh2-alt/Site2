import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiCopy, FiUsers, FiDollarSign, FiShare2, FiGift } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Card from '../components/Card'

const Referral = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [referralInfo, setReferralInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReferralInfo()
  }, [])

  const fetchReferralInfo = async () => {
    try {
      const response = await api.get('/referral/info')
      setReferralInfo(response.data)
    } catch (error) {
      console.error('Error fetching referral info:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = () => {
    const referralLink = `${window.location.origin}/register?ref=${referralInfo.referralCode}`
    navigator.clipboard.writeText(referralLink)
    toast.success(t('codeCopied'))
  }

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}/register?ref=${referralInfo.referralCode}`
    const text = `Join me on Crypto Trading Bot and start earning passive income! Use my referral code: ${referralInfo.referralCode}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Crypto Trading Bot',
          text: text,
          url: referralLink
        })
      } catch (error) {
        copyReferralCode()
      }
    } else {
      copyReferralCode()
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
        <h1 className="text-2xl font-bold mb-2">{t('referral')}</h1>
        <p className="text-gray-400">Invite friends and earn commissions</p>
      </motion.div>

      {/* Referral Code Card */}
      <Card gradient>
        <div className="text-center">
          <FiGift className="text-4xl mx-auto mb-4 opacity-80" />
          <h3 className="text-lg font-semibold mb-2">{t('myReferralCode')}</h3>
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <code className="text-3xl font-bold tracking-wider">
              {referralInfo?.referralCode}
            </code>
          </div>
          <div className="flex gap-3">
            <button
              onClick={copyReferralCode}
              className="flex-1 px-4 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <FiCopy />
              {t('copyCode')}
            </button>
            <button
              onClick={shareReferral}
              className="flex-1 px-4 py-3 bg-white/20 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <FiShare2 />
              Share
            </button>
          </div>
        </div>
      </Card>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('totalReferrals')}</span>
            <FiUsers className="text-2xl text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400">
            {referralInfo?.referralCount || 0}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('referralEarnings')}</span>
            <FiDollarSign className="text-2xl text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            {referralInfo?.referralEarnings?.toFixed(2) || '0.00'}
          </p>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <h3 className="text-lg font-bold mb-4">How Referrals Work</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold">5%</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">Instant Commission</h4>
              <p className="text-sm text-gray-400">
                Earn 5% instantly when your referral makes their first deposit.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold">20%</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">Passive Income</h4>
              <p className="text-sm text-gray-400">
                Earn 20% of your referral's trading profits automatically, forever.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl gradient-warning flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold">∞</span>
            </div>
            <div>
              <h4 className="font-bold mb-1">Unlimited Referrals</h4>
              <p className="text-sm text-gray-400">
                There's no limit to how many people you can refer. The more you invite, the more you earn!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Referred Users */}
      {referralInfo?.referredUsers?.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiUsers className="text-purple-400" />
            {t('yourReferrals')}
          </h3>
          <div className="space-y-3">
            {referralInfo.referredUsers.map((referredUser, index) => (
              <motion.div
                key={referredUser._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl glass"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-crypto flex items-center justify-center">
                    <span className="font-bold">{referredUser.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium">{referredUser.username}</p>
                    <p className="text-xs text-gray-400">
                      Joined {new Date(referredUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">
                    {referredUser.totalEarnings?.toFixed(2) || '0.00'} USDT
                  </p>
                  <p className="text-xs text-gray-400">Total Earnings</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* No Referrals Message */}
      {referralInfo?.referralCount === 0 && (
        <Card className="text-center py-8">
          <FiUsers className="text-5xl mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-bold mb-2">No Referrals Yet</h3>
          <p className="text-gray-400 mb-6">
            Start inviting friends and earning passive income!
          </p>
          <button
            onClick={shareReferral}
            className="px-6 py-3 gradient-crypto rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <FiShare2 />
            Share Your Link
          </button>
        </Card>
      )}

      {/* Example Earnings */}
      <Card>
        <h3 className="text-lg font-bold mb-4">Earnings Example</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-gray-400 mb-2">Scenario 1: Initial Deposit</p>
            <p className="text-sm">
              Your friend deposits <span className="font-bold text-green-400">100 USDT</span>
            </p>
            <p className="text-sm">
              You earn: <span className="font-bold text-green-400">5 USDT (5%)</span> instantly
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-sm text-gray-400 mb-2">Scenario 2: Monthly Profits</p>
            <p className="text-sm">
              Your friend earns <span className="font-bold text-purple-400">300 USDT</span> in a month
            </p>
            <p className="text-sm">
              You earn: <span className="font-bold text-purple-400">60 USDT (20%)</span> passively
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-gray-400 mb-2">Scenario 3: Multiple Referrals</p>
            <p className="text-sm">
              10 friends each earn <span className="font-bold text-blue-400">100 USDT/month</span>
            </p>
            <p className="text-sm">
              You earn: <span className="font-bold text-blue-400">200 USDT/month (20%)</span> passively
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Referral
