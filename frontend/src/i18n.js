import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Auth
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      referralCode: 'Referral Code (Optional)',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      
      // Navigation
      dashboard: 'Dashboard',
      wallet: 'Wallet',
      tradingBot: 'Trading Bot',
      referral: 'Referral',
      profile: 'Profile',
      articles: 'Articles',
      admin: 'Admin',
      
      // Dashboard
      balance: 'Balance',
      totalEarnings: 'Total Earnings',
      dailyProfit: 'Daily Profit',
      referralEarnings: 'Referral Earnings',
      activeBot: 'Active Bot',
      nextTrade: 'Next Trade',
      recentTrades: 'Recent Trades',
      recentTransactions: 'Recent Transactions',
      
      // Wallet
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      depositAddress: 'Deposit Address',
      depositInstructions: 'Send USDT (TRC20) to this address',
      withdrawalAddress: 'Withdrawal Address',
      amount: 'Amount',
      enterAmount: 'Enter amount',
      enterAddress: 'Enter your USDT address',
      confirmWithdrawal: 'Confirm Withdrawal',
      minimumDeposit: 'Minimum deposit: 20 USDT',
      
      // Bot
      purchaseBot: 'Purchase Bot',
      botPrice: 'Bot Price',
      profitTable: 'Profit Table',
      howItWorks: 'How It Works',
      botActive: 'Bot Active',
      botInactive: 'Bot Inactive',
      startTrading: 'Start Trading',
      
      // Referral
      myReferralCode: 'My Referral Code',
      copyCode: 'Copy Code',
      referralStats: 'Referral Statistics',
      totalReferrals: 'Total Referrals',
      commission: 'Commission',
      yourReferrals: 'Your Referrals',
      
      // Profile
      accountSettings: 'Account Settings',
      walletAddress: 'Wallet Address',
      language: 'Language',
      saveChanges: 'Save Changes',
      
      // Transaction types
      trade_profit: 'Trading Profit',
      bot_purchase: 'Bot Purchase',
      referral_commission: 'Referral Commission',
      referral_profit: 'Referral Profit Share',
      
      // Status
      pending: 'Pending',
      completed: 'Completed',
      rejected: 'Rejected',
      
      // Messages
      loginSuccess: 'Login successful!',
      registerSuccess: 'Registration successful!',
      depositSubmitted: 'Deposit request submitted',
      withdrawalSubmitted: 'Withdrawal request submitted',
      botPurchased: 'Trading bot purchased successfully!',
      codeCopied: 'Code copied to clipboard!',
      profileUpdated: 'Profile updated successfully!',
      
      // Errors
      invalidCredentials: 'Invalid credentials',
      userExists: 'User already exists',
      insufficientBalance: 'Insufficient balance',
      invalidReferralCode: 'Invalid referral code',
      
      // Articles
      readMore: 'Read More',
      support: 'Support',
      joinTelegram: 'Join our Telegram group for support',
    }
  },
  es: {
    translation: {
      // Auth
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      username: 'Nombre de Usuario',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      referralCode: 'Código de Referido (Opcional)',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      dontHaveAccount: '¿No tienes cuenta?',
      
      // Navigation
      dashboard: 'Panel',
      wallet: 'Billetera',
      tradingBot: 'Bot de Trading',
      referral: 'Referidos',
      profile: 'Perfil',
      articles: 'Artículos',
      admin: 'Admin',
      
      // Dashboard
      balance: 'Saldo',
      totalEarnings: 'Ganancias Totales',
      dailyProfit: 'Ganancia Diaria',
      referralEarnings: 'Ganancias por Referidos',
      activeBot: 'Bot Activo',
      nextTrade: 'Próximo Trade',
      recentTrades: 'Trades Recientes',
      recentTransactions: 'Transacciones Recientes',
      
      // Wallet
      deposit: 'Depositar',
      withdraw: 'Retirar',
      depositAddress: 'Dirección de Depósito',
      depositInstructions: 'Enviar USDT (TRC20) a esta dirección',
      withdrawalAddress: 'Dirección de Retiro',
      amount: 'Cantidad',
      enterAmount: 'Ingrese la cantidad',
      enterAddress: 'Ingrese su dirección USDT',
      confirmWithdrawal: 'Confirmar Retiro',
      minimumDeposit: 'Depósito mínimo: 20 USDT',
      
      // Bot
      purchaseBot: 'Comprar Bot',
      botPrice: 'Precio del Bot',
      profitTable: 'Tabla de Ganancias',
      howItWorks: 'Cómo Funciona',
      botActive: 'Bot Activo',
      botInactive: 'Bot Inactivo',
      startTrading: 'Comenzar Trading',
      
      // Referral
      myReferralCode: 'Mi Código de Referido',
      copyCode: 'Copiar Código',
      referralStats: 'Estadísticas de Referidos',
      totalReferrals: 'Total de Referidos',
      commission: 'Comisión',
      yourReferrals: 'Tus Referidos',
      
      // Profile
      accountSettings: 'Configuración de Cuenta',
      walletAddress: 'Dirección de Billetera',
      language: 'Idioma',
      saveChanges: 'Guardar Cambios',
      
      // Transaction types
      trade_profit: 'Ganancia de Trading',
      bot_purchase: 'Compra de Bot',
      referral_commission: 'Comisión por Referido',
      referral_profit: 'Ganancia Compartida',
      
      // Status
      pending: 'Pendiente',
      completed: 'Completado',
      rejected: 'Rechazado',
      
      // Messages
      loginSuccess: '¡Inicio de sesión exitoso!',
      registerSuccess: '¡Registro exitoso!',
      depositSubmitted: 'Solicitud de depósito enviada',
      withdrawalSubmitted: 'Solicitud de retiro enviada',
      botPurchased: '¡Bot de trading comprado exitosamente!',
      codeCopied: '¡Código copiado al portapapeles!',
      profileUpdated: '¡Perfil actualizado exitosamente!',
      
      // Errors
      invalidCredentials: 'Credenciales inválidas',
      userExists: 'El usuario ya existe',
      insufficientBalance: 'Saldo insuficiente',
      invalidReferralCode: 'Código de referido inválido',
      
      // Articles
      readMore: 'Leer Más',
      support: 'Soporte',
      joinTelegram: 'Únete a nuestro grupo de Telegram para soporte',
    }
  },
  tr: {
    translation: {
      // Auth
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap',
      username: 'Kullanıcı Adı',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifre Tekrar',
      referralCode: 'Referans Kodu (Opsiyonel)',
      alreadyHaveAccount: 'Zaten hesabınız var mı?',
      dontHaveAccount: 'Hesabınız yok mu?',
      
      // Navigation
      dashboard: 'Ana Sayfa',
      wallet: 'Cüzdan',
      tradingBot: 'Trading Bot',
      referral: 'Referans',
      profile: 'Profil',
      articles: 'Makaleler',
      admin: 'Yönetici',
      
      // Dashboard
      balance: 'Bakiye',
      totalEarnings: 'Toplam Kazanç',
      dailyProfit: 'Günlük Kar',
      referralEarnings: 'Referans Kazançları',
      activeBot: 'Aktif Bot',
      nextTrade: 'Sonraki İşlem',
      recentTrades: 'Son İşlemler',
      recentTransactions: 'Son Hareketler',
      
      // Wallet
      deposit: 'Yatır',
      withdraw: 'Çek',
      depositAddress: 'Yatırma Adresi',
      depositInstructions: 'Bu adrese USDT (TRC20) gönderin',
      withdrawalAddress: 'Çekim Adresi',
      amount: 'Miktar',
      enterAmount: 'Miktar girin',
      enterAddress: 'USDT adresinizi girin',
      confirmWithdrawal: 'Çekimi Onayla',
      minimumDeposit: 'Minimum yatırım: 20 USDT',
      
      // Bot
      purchaseBot: 'Bot Satın Al',
      botPrice: 'Bot Fiyatı',
      profitTable: 'Kar Tablosu',
      howItWorks: 'Nasıl Çalışır',
      botActive: 'Bot Aktif',
      botInactive: 'Bot Pasif',
      startTrading: 'İşleme Başla',
      
      // Referral
      myReferralCode: 'Referans Kodum',
      copyCode: 'Kodu Kopyala',
      referralStats: 'Referans İstatistikleri',
      totalReferrals: 'Toplam Referans',
      commission: 'Komisyon',
      yourReferrals: 'Referanslarınız',
      
      // Profile
      accountSettings: 'Hesap Ayarları',
      walletAddress: 'Cüzdan Adresi',
      language: 'Dil',
      saveChanges: 'Değişiklikleri Kaydet',
      
      // Transaction types
      trade_profit: 'İşlem Karı',
      bot_purchase: 'Bot Satın Alma',
      referral_commission: 'Referans Komisyonu',
      referral_profit: 'Referans Kar Payı',
      
      // Status
      pending: 'Beklemede',
      completed: 'Tamamlandı',
      rejected: 'Reddedildi',
      
      // Messages
      loginSuccess: 'Giriş başarılı!',
      registerSuccess: 'Kayıt başarılı!',
      depositSubmitted: 'Yatırma talebi gönderildi',
      withdrawalSubmitted: 'Çekim talebi gönderildi',
      botPurchased: 'Trading bot başarıyla satın alındı!',
      codeCopied: 'Kod panoya kopyalandı!',
      profileUpdated: 'Profil başarıyla güncellendi!',
      
      // Errors
      invalidCredentials: 'Geçersiz kimlik bilgileri',
      userExists: 'Kullanıcı zaten mevcut',
      insufficientBalance: 'Yetersiz bakiye',
      invalidReferralCode: 'Geçersiz referans kodu',
      
      // Articles
      readMore: 'Devamını Oku',
      support: 'Destek',
      joinTelegram: 'Destek için Telegram grubumuz katılın',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
