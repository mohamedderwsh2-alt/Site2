'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { useState } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname if present
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
    setIsOpen(false)
  }

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe size={18} />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
                locale === lang.code ? 'bg-primary-50 text-primary-600' : ''
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
