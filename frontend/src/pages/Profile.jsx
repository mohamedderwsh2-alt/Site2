import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiUser, FiMail, FiMapPin, FiGlobe, FiSave } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'

const Profile = () => {
  const { t, i18n } = useTranslation()
  const { user, updateUser } = useAuthStore()
  const [formData, setFormData] = useState({
    walletAddress: user?.walletAddress || '',
    language: i18n.language
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await api.put('/users/me', formData)
      updateUser(response.data)
      i18n.changeLanguage(formData.language)
      toast.success(t('profileUpdated'))
    } catch (error) {
      toast.error('Failed to update profile')
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
        <h1 className="text-2xl font-bold mb-2">{t('profile')}</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </motion.div>

      {/* Profile Header */}
      <Card gradient>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-4xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-white/70">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Account Info */}
      <Card>
        <h3 className="text-lg font-bold mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl glass">
            <FiUser className="text-xl text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="font-medium">{user?.username}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl glass">
            <FiMail className="text-xl text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl glass">
            <FiMapPin className="text-xl text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Referral Code</p>
              <p className="font-mono font-bold text-purple-400">{user?.referralCode}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Form */}
      <Card>
        <h3 className="text-lg font-bold mb-4">{t('accountSettings')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('walletAddress')}
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            placeholder="Your USDT (TRC20) address"
            icon={FiMapPin}
          />
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <FiGlobe className="inline mr-2" />
              {t('language')}
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
            icon={FiSave}
          >
            {loading ? 'Saving...' : t('saveChanges')}
          </Button>
        </form>
      </Card>

      {/* Account Stats */}
      <Card>
        <h3 className="text-lg font-bold mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl glass text-center">
            <p className="text-2xl font-bold text-green-400">{user?.balance?.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Current Balance</p>
          </div>
          
          <div className="p-4 rounded-xl glass text-center">
            <p className="text-2xl font-bold text-blue-400">{user?.totalEarnings?.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Total Earnings</p>
          </div>
          
          <div className="p-4 rounded-xl glass text-center">
            <p className="text-2xl font-bold text-purple-400">{user?.referralCount || 0}</p>
            <p className="text-sm text-gray-400">Referrals</p>
          </div>
          
          <div className="p-4 rounded-xl glass text-center">
            <p className="text-2xl font-bold text-orange-400">{user?.referralEarnings?.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Referral Earnings</p>
          </div>
        </div>
      </Card>

      {/* Member Since */}
      <Card>
        <div className="text-center py-4">
          <p className="text-gray-400 mb-2">Member Since</p>
          <p className="text-xl font-bold">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Profile
