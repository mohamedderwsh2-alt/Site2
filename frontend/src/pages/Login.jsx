import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiUser, FiLock, FiActivity } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Input from '../components/Input'
import Button from '../components/Button'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/login', { username, password })
      setAuth(response.data.user, response.data.token)
      toast.success(t('loginSuccess'))
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-crypto mb-4"
          >
            <FiActivity className="text-4xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Crypto Trading Bot</h1>
          <p className="text-gray-400">Binance × OKX Arbitrage</p>
        </div>

        {/* Login Form */}
        <div className="glass rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">{t('login')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('username')}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              icon={FiUser}
            />
            
            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={FiLock}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : t('login')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('dontHaveAccount')}{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="glass rounded-2xl p-4">
            <p className="text-2xl font-bold text-green-400">3-5%</p>
            <p className="text-xs text-gray-400">Profit/Trade</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-2xl font-bold text-blue-400">24/7</p>
            <p className="text-xs text-gray-400">Auto Trading</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-2xl font-bold text-purple-400">50ms</p>
            <p className="text-xs text-gray-400">Execution</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
