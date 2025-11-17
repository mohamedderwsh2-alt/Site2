'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-white',
    outline: 'border border-white/20 hover:bg-white/5 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`
        px-6 py-3 rounded-xl font-semibold transition-all
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
