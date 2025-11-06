import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'gradient-crypto',
    success: 'gradient-success',
    danger: 'gradient-danger',
    warning: 'gradient-warning',
    ghost: 'glass hover:bg-white/10',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        px-6 py-3 rounded-xl font-semibold
        flex items-center justify-center gap-2
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="text-xl" />}
      {children}
    </motion.button>
  )
}

export default Button
