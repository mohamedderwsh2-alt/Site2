import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiClock } from 'react-icons/fi'
import Card from '../components/Card'

const articleContent = {
  'how-bot-works': {
    title: 'How Does the Bot Generate Profit?',
    date: 'Updated: November 2024',
    icon: '🤖',
    content: [
      {
        type: 'text',
        content: 'Our trading bot takes advantage of price differences between OKX and Binance exchanges. Here\'s how it works:'
      },
      {
        type: 'heading',
        content: 'Automated Market Analysis'
      },
      {
        type: 'text',
        content: 'Every two hours, our bot analyzes the market automatically. It monitors cryptocurrency prices on both OKX and Binance exchanges in real-time, looking for profitable opportunities.'
      },
      {
        type: 'heading',
        content: 'Price Difference Detection'
      },
      {
        type: 'text',
        content: 'When the price difference between the two exchanges exceeds 3%, the system recognizes this as a trading opportunity. This price difference (also called arbitrage) is what generates profit.'
      },
      {
        type: 'heading',
        content: 'Lightning-Fast Execution'
      },
      {
        type: 'text',
        content: 'The bot uses only 10% of each user\'s balance per trade, minimizing risk during market fluctuations. Each operation is completed in under 50 milliseconds (0.05 seconds), ensuring we capture the profit before the price difference disappears.'
      },
      {
        type: 'heading',
        content: 'Profit Distribution'
      },
      {
        type: 'text',
        content: 'After each trade, the profits are distributed equally (3%) among all active users. A small remaining portion is reserved by the system for bot development and team salaries, ensuring continuous and sustainable platform growth.'
      },
      {
        type: 'callout',
        content: 'This strategy has been proven effective in the cryptocurrency market for years. By automating the process, we remove human error and emotion from trading.'
      }
    ]
  },
  'getting-started': {
    title: 'Getting Started Guide',
    date: 'Updated: November 2024',
    icon: '🚀',
    content: [
      {
        type: 'heading',
        content: 'Step 1: Register Your Account'
      },
      {
        type: 'text',
        content: 'Create your account using your email and a secure password. If you have a referral code, enter it to start earning bonuses immediately.'
      },
      {
        type: 'heading',
        content: 'Step 2: Make Your First Deposit'
      },
      {
        type: 'text',
        content: 'Navigate to the Wallet section and deposit USDT (TRC20) to the provided address. Minimum deposit is 20 USDT. Your deposit will be credited after admin confirmation.'
      },
      {
        type: 'heading',
        content: 'Step 3: Purchase the Trading Bot'
      },
      {
        type: 'text',
        content: 'Once your deposit is confirmed, go to the Trading Bot section and purchase the bot for 5 USDT. This is a one-time purchase that gives you lifetime access to automated trading.'
      },
      {
        type: 'heading',
        content: 'Step 4: Start Earning'
      },
      {
        type: 'text',
        content: 'That\'s it! Your bot is now active and will start trading every 2 hours automatically. You can track your earnings in real-time from the Dashboard.'
      },
      {
        type: 'callout',
        content: 'Pro Tip: The more balance you maintain, the higher your daily profits. Check the profit table in the Bot section to see potential earnings.'
      }
    ]
  },
  'referral-program': {
    title: 'Maximize Referral Earnings',
    date: 'Updated: November 2024',
    icon: '💰',
    content: [
      {
        type: 'text',
        content: 'Our referral program is designed to reward you for spreading the word about our platform. Here\'s everything you need to know:'
      },
      {
        type: 'heading',
        content: '5% Instant Commission'
      },
      {
        type: 'text',
        content: 'When someone registers using your referral code and makes their first deposit, you immediately earn 5% of their deposit amount. This is instant and automatically credited to your balance.'
      },
      {
        type: 'heading',
        content: '20% Passive Income Forever'
      },
      {
        type: 'text',
        content: 'This is where the real magic happens. You will receive 20% of all future trading profits earned by your referrals, automatically and forever. This creates a truly passive income stream.'
      },
      {
        type: 'heading',
        content: 'Unlimited Referrals'
      },
      {
        type: 'text',
        content: 'There\'s no limit to how many people you can refer. Build a network of active traders and watch your passive income grow exponentially.'
      },
      {
        type: 'heading',
        content: 'Best Practices'
      },
      {
        type: 'text',
        content: '1. Share your referral link on social media\n2. Explain the benefits clearly to potential referrals\n3. Help your referrals get started to ensure they become active traders\n4. Be transparent about how the system works'
      },
      {
        type: 'callout',
        content: 'Example: If you refer 10 people who each earn 100 USDT per month, you earn 200 USDT per month in passive income (20% of 1000 USDT total).'
      }
    ]
  },
  'security': {
    title: 'Security & Safety',
    date: 'Updated: November 2024',
    icon: '🔒',
    content: [
      {
        type: 'text',
        content: 'Your security is our top priority. Here\'s how we keep your funds and data safe:'
      },
      {
        type: 'heading',
        content: 'Password Protection'
      },
      {
        type: 'text',
        content: 'All passwords are hashed using industry-standard bcrypt encryption. We never store your password in plain text.'
      },
      {
        type: 'heading',
        content: 'Secure Withdrawals'
      },
      {
        type: 'text',
        content: 'Withdrawals require password confirmation and are manually reviewed by our admin team before processing. This two-step verification protects against unauthorized access.'
      },
      {
        type: 'heading',
        content: 'Data Protection'
      },
      {
        type: 'text',
        content: 'All data is stored securely on our servers with regular backups. We use HTTPS encryption for all communications between your device and our servers.'
      },
      {
        type: 'heading',
        content: 'Best Practices for Users'
      },
      {
        type: 'text',
        content: '1. Use a strong, unique password\n2. Never share your password with anyone\n3. Enable two-factor authentication if available\n4. Verify withdrawal addresses carefully before confirming\n5. Log out when using shared devices'
      },
      {
        type: 'callout',
        content: 'Important: Our team will NEVER ask for your password. If someone claiming to be from our team asks for your password, it\'s a scam. Report it immediately.'
      }
    ]
  },
  'faq': {
    title: 'Frequently Asked Questions',
    date: 'Updated: November 2024',
    icon: '❓',
    content: [
      {
        type: 'heading',
        content: 'How much can I earn?'
      },
      {
        type: 'text',
        content: 'Your earnings depend on your balance. Check the profit table in the Bot section for detailed projections. Generally, higher balances generate proportionally higher daily profits.'
      },
      {
        type: 'heading',
        content: 'Is this safe?'
      },
      {
        type: 'text',
        content: 'Yes. The bot uses only 10% of your balance per trade, significantly reducing risk. Additionally, arbitrage trading is one of the safest forms of cryptocurrency trading.'
      },
      {
        type: 'heading',
        content: 'How long does it take to withdraw?'
      },
      {
        type: 'text',
        content: 'Withdrawals are processed manually within 1-24 hours. This ensures security and allows us to verify each transaction.'
      },
      {
        type: 'heading',
        content: 'Can I cancel my bot subscription?'
      },
      {
        type: 'text',
        content: 'The bot is a one-time purchase of 5 USDT with lifetime access. There\'s no subscription or recurring fees.'
      },
      {
        type: 'heading',
        content: 'What happens if a trade loses money?'
      },
      {
        type: 'text',
        content: 'Our bot only executes trades when a profitable price difference is detected (3%+). The risk of loss is minimal, but the 10% per-trade limit protects your balance if market conditions change rapidly.'
      },
      {
        type: 'heading',
        content: 'Can I withdraw my initial deposit?'
      },
      {
        type: 'text',
        content: 'Yes, you can withdraw your entire balance at any time, including your initial deposit and all earnings.'
      }
    ]
  },
  'strategies': {
    title: 'Trading Strategies',
    date: 'Updated: November 2024',
    icon: '📊',
    content: [
      {
        type: 'text',
        content: 'Understanding our trading methodology helps you make informed decisions about your investment.'
      },
      {
        type: 'heading',
        content: 'Arbitrage Trading Explained'
      },
      {
        type: 'text',
        content: 'Arbitrage is the practice of buying a cryptocurrency on one exchange where the price is lower, and simultaneously selling it on another exchange where the price is higher. The difference in price is your profit.'
      },
      {
        type: 'heading',
        content: 'Why Price Differences Exist'
      },
      {
        type: 'text',
        content: 'Different exchanges have different levels of supply and demand at any given moment. This creates temporary price discrepancies that our bot exploits.'
      },
      {
        type: 'heading',
        content: 'Risk Management'
      },
      {
        type: 'text',
        content: 'We use several risk management techniques:\n\n• Only 10% of balance per trade\n• Minimum 3% price difference requirement\n• Lightning-fast execution (50ms)\n• Diversified trading across multiple cryptocurrencies\n• Real-time monitoring and automatic shutdown in extreme volatility'
      },
      {
        type: 'heading',
        content: 'Performance Optimization'
      },
      {
        type: 'text',
        content: 'Our bot is constantly optimized for:\n\n• Speed: Sub-50ms execution ensures we capture profits\n• Reliability: 99.9% uptime with redundant systems\n• Efficiency: Minimal fees and maximum profit capture\n• Scalability: Can handle unlimited users simultaneously'
      },
      {
        type: 'callout',
        content: 'The combination of arbitrage trading and automated execution creates a unique opportunity for consistent profits with minimal risk.'
      }
    ]
  }
}

const Article = () => {
  const { id } = useParams()
  const article = articleContent[id]

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <Link to="/articles" className="text-purple-400 hover:text-purple-300">
          <FiArrowLeft className="inline mr-2" />
          Back to Articles
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <FiArrowLeft />
          Back to Articles
        </Link>
      </motion.div>

      <Card>
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{article.icon}</div>
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <FiClock />
            {article.date}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          {article.content.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {block.type === 'heading' && (
                <h2 className="text-2xl font-bold mt-8 mb-4">{block.content}</h2>
              )}
              {block.type === 'text' && (
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {block.content}
                </p>
              )}
              {block.type === 'callout' && (
                <div className="p-6 rounded-2xl gradient-crypto">
                  <p className="text-white leading-relaxed">{block.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-center py-6">
          <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
          <p className="text-gray-400 mb-4">Join our Telegram community for support</p>
          <a
            href="https://t.me/yourtelegramgroup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 gradient-crypto rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Join Telegram
          </a>
        </div>
      </Card>
    </div>
  )
}

export default Article
