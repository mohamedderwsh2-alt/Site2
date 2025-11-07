import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  FiHome, FiCreditCard, FiActivity, FiUsers, 
  FiUser, FiBook, FiMenu, FiX, FiLogOut 
} from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()

  const navItems = [
    { path: '/', icon: FiHome, label: t('dashboard') },
    { path: '/wallet', icon: FiCreditCard, label: t('wallet') },
    { path: '/bot', icon: FiActivity, label: t('tradingBot') },
    { path: '/referral', icon: FiUsers, label: t('referral') },
    { path: '/profile', icon: FiUser, label: t('profile') },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-crypto flex items-center justify-center">
              <FiActivity className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Crypto Bot</h1>
              <p className="text-xs text-gray-400">Binance × OKX</p>
            </div>
          </div>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl glass hover:bg-white/10 transition-colors"
          >
            {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </header>

      {/* Side Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-slate-900 z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl glass hover:bg-white/10"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="glass rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full gradient-crypto flex items-center justify-center">
                    <span className="text-lg font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{user?.username}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? 'gradient-crypto text-white'
                        : 'glass hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="text-xl" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                <Link
                  to="/articles"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-white/10 transition-all"
                >
                  <FiBook className="text-xl" />
                  <span className="font-medium">{t('articles')}</span>
                </Link>
              </nav>

              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-danger hover:opacity-90 transition-opacity"
              >
                <FiLogOut />
                <span className="font-medium">{t('logout')}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="text-2xl" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout
