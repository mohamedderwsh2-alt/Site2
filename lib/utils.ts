import { v4 as uuidv4 } from 'uuid';

export function generateReferralCode(): string {
  return uuidv4().substring(0, 8).toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function truncateAddress(address: string, length: number = 10): string {
  if (address.length <= length) return address;
  return `${address.substring(0, length / 2)}...${address.substring(address.length - length / 2)}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters
  return password.length >= 8;
}

export function validateUSDTAddress(address: string): boolean {
  // Basic validation for USDT TRC20 address (starts with T and is 34 characters)
  return /^T[a-zA-Z0-9]{33}$/.test(address);
}
