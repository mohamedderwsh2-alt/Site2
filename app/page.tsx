'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../app/globals.css'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const languages = {
    en: {
      title: 'Crypto Trading Bot',
      subtitle: 'Automated Profit Generation',
      login: 'Login',
      register: 'Register',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      balance: 'Balance',
      profit: 'Daily Profit',
      referral: 'Referral',
      support: 'Support',
    },
    ar: {
      title: 'بوت تداول العملات المشفرة',
      subtitle: 'توليد الأرباح الآلي',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      deposit: 'إيداع',
      withdraw: 'سحب',
      balance: 'الرصيد',
      profit: 'الربح اليومي',
      referral: 'الإحالة',
      support: 'الدعم',
    },
    es: {
      title: 'Bot de Trading Cripto',
      subtitle: 'Generación Automática de Beneficios',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      deposit: 'Depositar',
      withdraw: 'Retirar',
      balance: 'Balance',
      profit: 'Beneficio Diario',
      referral: 'Referido',
      support: 'Soporte',
    },
    fr: {
      title: 'Bot de Trading Crypto',
      subtitle: 'Génération Automatique de Profit',
      login: 'Connexion',
      register: 'Inscription',
      deposit: 'Dépôt',
      withdraw: 'Retrait',
      balance: 'Solde',
      profit: 'Profit Quotidien',
      referral: 'Parrainage',
      support: 'Support',
    },
  }

  const t = languages[currentLanguage as keyof typeof languages]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-app"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-app"
                >
                  {t.register}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  setIsAuthenticated(false)
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-app"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <Dashboard t={t} />
        ) : (
          <LandingPage t={t} setShowLogin={setShowLogin} setShowRegister={setShowRegister} />
        )}
      </main>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          t={t}
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setIsAuthenticated(true)
            setShowLogin(false)
          }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <RegisterModal
          t={t}
          onClose={() => setShowRegister(false)}
          onSuccess={() => {
            setIsAuthenticated(true)
            setShowRegister(false)
          }}
        />
      )}
    </div>
  )
}

function LandingPage({ t, setShowLogin, setShowRegister }: any) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {t.subtitle}
        </h2>
        <p className="text-xl text-slate-400 mb-8">
          Automated trading bot that generates profits every 2 hours
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowLogin(true)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold transition-app"
          >
            {t.login}
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold transition-app"
          >
            {t.register}
          </button>
        </div>
      </div>

      {/* Profit Table */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-slate-700">
        <h3 className="text-2xl font-bold mb-6 text-center">Profit Calculator</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4">Balance (USDT)</th>
                <th className="text-right py-3 px-4">Daily Profit (USDT)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { balance: 20.0, profit: 3.0 },
                { balance: 99.0, profit: 16.83 },
                { balance: 458.0, profit: 91.6 },
                { balance: 1288.0, profit: 283.36 },
                { balance: 4388.0, profit: 1097.0 },
                { balance: 10888.0, profit: 3048.64 },
                { balance: 25888.0, profit: 8284.16 },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-app">
                  <td className="py-3 px-4 font-semibold">{row.balance.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-green-400 font-semibold">
                    {row.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
        <h3 className="text-2xl font-bold mb-4">How Does the Bot Generate Profit?</h3>
        <div className="space-y-4 text-slate-300">
          <p>
            Our trading bot takes advantage of price differences between OKX and Binance.
          </p>
          <p>
            Every two hours, it analyzes the market automatically. When the price difference
            between the two exchanges exceeds 3%, the system executes an instant buy/sell trade.
          </p>
          <p>
            The bot uses only 10% of each user's balance per trade, minimizing risk during
            market fluctuations.
          </p>
          <p>
            Each operation is completed in under 50 milliseconds (0.05 seconds). After each trade,
            the profits are distributed equally (3%) among all active users.
          </p>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ t }: any) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [balance, setBalance] = useState(0)
  const [dailyProfit, setDailyProfit] = useState(0)
  const [referralCode, setReferralCode] = useState('REF123456')

  // Calculate daily profit based on balance
  const calculateDailyProfit = (bal: number) => {
    const table = [
      { balance: 20.0, profit: 3.0 },
      { balance: 99.0, profit: 16.83 },
      { balance: 458.0, profit: 91.6 },
      { balance: 1288.0, profit: 283.36 },
      { balance: 4388.0, profit: 1097.0 },
      { balance: 10888.0, profit: 3048.64 },
      { balance: 25888.0, profit: 8284.16 },
    ]
    
    for (let i = table.length - 1; i >= 0; i--) {
      if (bal >= table[i].balance) {
        return table[i].profit
      }
    }
    return (bal * 0.15) // Default 15% for balances below 20 USDT
  }

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      const data = JSON.parse(userData)
      setBalance(data.balance || 0)
      setDailyProfit(calculateDailyProfit(data.balance || 0))
      setReferralCode(data.referralCode || 'REF123456')
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Bottom Navigation (Mobile App Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-40 md:hidden">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: '📊', label: t.balance },
            { id: 'deposit', icon: '💰', label: t.deposit },
            { id: 'withdraw', icon: '💸', label: t.withdraw },
            { id: 'referral', icon: '👥', label: t.referral },
            { id: 'support', icon: '💬', label: t.support },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 transition-app ${
                activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4 mb-8">
        {[
          { id: 'dashboard', label: t.balance },
          { id: 'deposit', label: t.deposit },
          { id: 'withdraw', label: t.withdraw },
          { id: 'referral', label: t.referral },
          { id: 'support', label: t.support },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg transition-app ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mb-24 md:mb-8">
        {activeTab === 'dashboard' && (
          <DashboardTab balance={balance} dailyProfit={dailyProfit} />
        )}
        {activeTab === 'deposit' && <DepositTab />}
        {activeTab === 'withdraw' && <WithdrawTab balance={balance} />}
        {activeTab === 'referral' && <ReferralTab referralCode={referralCode} />}
        {activeTab === 'support' && <SupportTab t={t} />}
      </div>
    </div>
  )
}

function DashboardTab({ balance, dailyProfit }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Your Balance</h2>
        <div className="text-5xl font-bold mb-2">{balance.toFixed(2)} USDT</div>
        <div className="text-blue-100">Daily Profit: +{dailyProfit.toFixed(2)} USDT</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Recent Trades</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="font-semibold">Trade #{i}</div>
                  <div className="text-sm text-slate-400">2 hours ago</div>
                </div>
                <div className="text-green-400 font-bold">+{(dailyProfit / 12).toFixed(2)} USDT</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Bot Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="px-3 py-1 bg-green-600 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Next Trade</span>
              <span className="font-semibold">In 1h 45m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Trades</span>
              <span className="font-semibold">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DepositTab() {
  const [copied, setCopied] = useState(false)
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Deposit USDT</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Wallet Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={walletAddress}
              readOnly
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-app"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <p className="text-yellow-200 text-sm">
            ⚠️ Only send USDT (TRC20) to this address. Sending other cryptocurrencies may result in permanent loss.
          </p>
        </div>
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <p className="text-blue-200 text-sm">
            💡 After sending USDT, your balance will be updated automatically within 10 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}

function WithdrawTab({ balance }: any) {
  const [walletAddress, setWalletAddress] = useState('')
  const [password, setPassword] = useState('')
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send a request to the server
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setWalletAddress('')
      setPassword('')
      setAmount('')
    }, 3000)
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Withdraw USDT</h2>
      {submitted ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold mb-2">Withdrawal Request Submitted</h3>
          <p className="text-slate-400">
            Your withdrawal request has been sent. It will be processed manually within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Available Balance</label>
            <div className="text-2xl font-bold text-green-400">{balance.toFixed(2)} USDT</div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Withdrawal Amount (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={balance}
              min={10}
              step="0.01"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Your USDT Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your TRC20 USDT address"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Account Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition-app"
          >
            Submit Withdrawal Request
          </button>
        </form>
      )}
    </div>
  )
}

function ReferralTab({ referralCode }: any) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Referral Program</h2>
        <p className="text-purple-100 mb-6">
          Earn 5% commission on deposits and 20% of their future profits!
        </p>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-200 mb-1">Your Referral Code</div>
              <div className="text-2xl font-bold font-mono">{referralCode}</div>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-app"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Commission Structure</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
              <span>Deposit Commission</span>
              <span className="font-bold text-green-400">5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
              <span>Profit Share</span>
              <span className="font-bold text-green-400">20%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Your Earnings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Referrals</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Commission</span>
              <span className="font-bold text-green-400">0.00 USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Profit Share</span>
              <span className="font-bold text-green-400">0.00 USDT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SupportTab({ t }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold mb-6">Support & Information</h2>
        <div className="space-y-6">
          <a
            href="https://t.me/your_support_group"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-app"
          >
            <span className="text-3xl">💬</span>
            <div>
              <div className="font-semibold text-lg">Telegram Support Group</div>
              <div className="text-blue-100 text-sm">Join our community for help</div>
            </div>
          </a>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">How Does the Bot Generate Profit?</h3>
            <div className="space-y-4 text-slate-300">
              <p>
                Our trading bot takes advantage of price differences between OKX and Binance.
                Every two hours, it analyzes the market automatically.
              </p>
              <p>
                When the price difference between the two exchanges exceeds 3%, the system executes
                an instant buy/sell trade. The bot uses only 10% of each user's balance per trade,
                minimizing risk during market fluctuations.
              </p>
              <p>
                Each operation is completed in under 50 milliseconds (0.05 seconds). After each trade,
                the profits are distributed equally (3%) among all active users. A small remaining portion
                is reserved by the system for bot development and team salaries, ensuring continuous and
                sustainable platform growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginModal({ t, onClose, onSuccess }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would authenticate with the server
    const token = 'demo_token_' + Date.now()
    localStorage.setItem('token', token)
    localStorage.setItem('userData', JSON.stringify({
      email,
      balance: 0,
      referralCode: 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    }))
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Login</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-app"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

function RegisterModal({ t, onClose, onSuccess }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    // In a real app, this would register with the server
    const token = 'demo_token_' + Date.now()
    localStorage.setItem('token', token)
    localStorage.setItem('userData', JSON.stringify({
      email,
      balance: 0,
      referralCode: 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    }))
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Register</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Referral Code (Optional)</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-app"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
