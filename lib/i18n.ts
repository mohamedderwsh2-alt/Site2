export const languages = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  ar: 'العربية',
  ru: 'Русский',
  pt: 'Português',
};

export const defaultLanguage = 'en';

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.deposit': 'Deposit',
    'nav.withdraw': 'Withdraw',
    'nav.referral': 'Referral',
    'nav.support': 'Support',
    'nav.logout': 'Logout',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.referralCode': 'Referral Code (Optional)',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    
    // Dashboard
    'dashboard.balance': 'Balance',
    'dashboard.totalEarnings': 'Total Earnings',
    'dashboard.dailyProfit': 'Daily Profit',
    'dashboard.botStatus': 'Bot Status',
    'dashboard.active': 'Active',
    'dashboard.inactive': 'Inactive',
    'dashboard.purchaseBot': 'Purchase Bot',
    'dashboard.recentTrades': 'Recent Trades',
    'dashboard.tradeHistory': 'Trade History',
    
    // Bot
    'bot.title': 'Trading Bot',
    'bot.price': 'Bot Price: 5 USDT',
    'bot.description': 'Purchase the trading bot to start earning automated profits every 2 hours',
    'bot.purchase': 'Purchase Bot',
    'bot.purchased': 'Bot Purchased',
    'bot.insufficientBalance': 'Insufficient Balance',
    
    // Deposit
    'deposit.title': 'Deposit USDT',
    'deposit.walletAddress': 'Deposit Address',
    'deposit.instructions': 'Send USDT (TRC20) to the address above',
    'deposit.copyAddress': 'Copy Address',
    'deposit.important': 'Important: Only send USDT TRC20 to this address',
    
    // Withdraw
    'withdraw.title': 'Withdraw USDT',
    'withdraw.amount': 'Amount',
    'withdraw.address': 'USDT Wallet Address',
    'withdraw.password': 'Account Password',
    'withdraw.submit': 'Request Withdrawal',
    'withdraw.minAmount': 'Minimum withdrawal: 10 USDT',
    'withdraw.processing': 'Withdrawals are processed manually within 24 hours',
    
    // Referral
    'referral.title': 'Referral Program',
    'referral.yourCode': 'Your Referral Code',
    'referral.copyCode': 'Copy Code',
    'referral.earn5': 'Earn 5% on deposits',
    'referral.earn20': 'Earn 20% on profits',
    'referral.totalEarned': 'Total Referral Earnings',
    'referral.referredUsers': 'Referred Users',
    
    // Support
    'support.title': 'Support',
    'support.telegram': 'Join Telegram Group',
    'support.articles': 'Help Articles',
    
    // Profit Table
    'profitTable.title': 'Profit Calculator',
    'profitTable.balance': 'Balance (USDT)',
    'profitTable.dailyProfit': 'Daily Profit (USDT)',
    
    // Common
    'common.loading': 'Loading...',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.success': 'Success',
    'common.error': 'Error',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.deposit': 'Depositar',
    'nav.withdraw': 'Retirar',
    'nav.referral': 'Referidos',
    'nav.support': 'Soporte',
    'nav.logout': 'Salir',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.referralCode': 'Código de Referido (Opcional)',
    'auth.alreadyHaveAccount': '¿Ya tienes cuenta?',
    'auth.dontHaveAccount': '¿No tienes cuenta?',
    
    // Dashboard
    'dashboard.balance': 'Saldo',
    'dashboard.totalEarnings': 'Ganancias Totales',
    'dashboard.dailyProfit': 'Ganancia Diaria',
    'dashboard.botStatus': 'Estado del Bot',
    'dashboard.active': 'Activo',
    'dashboard.inactive': 'Inactivo',
    'dashboard.purchaseBot': 'Comprar Bot',
    'dashboard.recentTrades': 'Operaciones Recientes',
    'dashboard.tradeHistory': 'Historial de Operaciones',
    
    // Bot
    'bot.title': 'Bot de Trading',
    'bot.price': 'Precio del Bot: 5 USDT',
    'bot.description': 'Compra el bot de trading para comenzar a ganar ganancias automáticas cada 2 horas',
    'bot.purchase': 'Comprar Bot',
    'bot.purchased': 'Bot Comprado',
    'bot.insufficientBalance': 'Saldo Insuficiente',
    
    // Deposit
    'deposit.title': 'Depositar USDT',
    'deposit.walletAddress': 'Dirección de Depósito',
    'deposit.instructions': 'Envía USDT (TRC20) a la dirección de arriba',
    'deposit.copyAddress': 'Copiar Dirección',
    'deposit.important': 'Importante: Solo envía USDT TRC20 a esta dirección',
    
    // Withdraw
    'withdraw.title': 'Retirar USDT',
    'withdraw.amount': 'Cantidad',
    'withdraw.address': 'Dirección de Billetera USDT',
    'withdraw.password': 'Contraseña de la Cuenta',
    'withdraw.submit': 'Solicitar Retiro',
    'withdraw.minAmount': 'Retiro mínimo: 10 USDT',
    'withdraw.processing': 'Los retiros se procesan manualmente en 24 horas',
    
    // Referral
    'referral.title': 'Programa de Referidos',
    'referral.yourCode': 'Tu Código de Referido',
    'referral.copyCode': 'Copiar Código',
    'referral.earn5': 'Gana 5% en depósitos',
    'referral.earn20': 'Gana 20% en ganancias',
    'referral.totalEarned': 'Ganancias Totales por Referidos',
    'referral.referredUsers': 'Usuarios Referidos',
    
    // Support
    'support.title': 'Soporte',
    'support.telegram': 'Unirse al Grupo de Telegram',
    'support.articles': 'Artículos de Ayuda',
    
    // Profit Table
    'profitTable.title': 'Calculadora de Ganancias',
    'profitTable.balance': 'Saldo (USDT)',
    'profitTable.dailyProfit': 'Ganancia Diaria (USDT)',
    
    // Common
    'common.loading': 'Cargando...',
    'common.submit': 'Enviar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.success': 'Éxito',
    'common.error': 'Error',
  },
};

export function translate(key: string, lang: string = defaultLanguage): string {
  const langTranslations = translations[lang as keyof typeof translations] || translations[defaultLanguage];
  return langTranslations[key as keyof typeof langTranslations] || key;
}
