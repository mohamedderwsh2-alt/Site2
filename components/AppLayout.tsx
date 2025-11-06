'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Wallet, TrendingUp, Users, Info, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: TrendingUp, label: 'Bot', path: '/bot' },
  { icon: Users, label: 'Referrals', path: '/referrals' },
  { icon: Info, label: 'Info', path: '/info' },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container pb-20">
      <header className="bg-primary-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">CryptoBot</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      <main className="p-4">{children}</main>
      <BottomNavigation />
    </div>
  )
}
