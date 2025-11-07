import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiBook, FiArrowRight, FiMessageCircle } from 'react-icons/fi'
import Card from '../components/Card'

const articles = [
  {
    id: 'how-bot-works',
    title: 'How Does the Bot Generate Profit?',
    description: 'Learn how our trading bot takes advantage of price differences between OKX and Binance exchanges.',
    icon: '🤖',
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'getting-started',
    title: 'Getting Started Guide',
    description: 'Everything you need to know to start earning with automated trading.',
    icon: '🚀',
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'referral-program',
    title: 'Maximize Referral Earnings',
    description: 'Learn how to build passive income through our referral system.',
    icon: '💰',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'security',
    title: 'Security & Safety',
    description: 'Understanding how we keep your funds and data secure.',
    icon: '🔒',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Common questions and answers about the platform.',
    icon: '❓',
    color: 'from-pink-500 to-red-500'
  },
  {
    id: 'strategies',
    title: 'Trading Strategies',
    description: 'Deep dive into our arbitrage trading methodology.',
    icon: '📊',
    color: 'from-indigo-500 to-blue-500'
  }
]

const Articles = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2">{t('articles')}</h1>
        <p className="text-gray-400">Learn how to maximize your earnings</p>
      </motion.div>

      {/* Support Card */}
      <Card gradient>
        <div className="flex items-center gap-4">
          <FiMessageCircle className="text-4xl" />
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{t('support')}</h3>
            <p className="text-sm text-white/80">{t('joinTelegram')}</p>
          </div>
          <a
            href="https://t.me/yourtelegramgroup"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Join
          </a>
        </div>
      </Card>

      {/* Articles Grid */}
      <div className="grid gap-4">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/articles/${article.id}`}>
              <Card className="hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${article.color} flex items-center justify-center text-3xl`}>
                    {article.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-400">{article.description}</p>
                  </div>
                  <FiArrowRight className="text-2xl text-gray-400" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-blue-400 mb-1">12</p>
          <p className="text-xs text-gray-400">Trades/Day</p>
        </Card>
        
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-400 mb-1">3-5%</p>
          <p className="text-xs text-gray-400">Per Trade</p>
        </Card>
        
        <Card className="text-center">
          <p className="text-3xl font-bold text-purple-400 mb-1">50ms</p>
          <p className="text-xs text-gray-400">Execution</p>
        </Card>
      </div>
    </div>
  )
}

export default Articles
