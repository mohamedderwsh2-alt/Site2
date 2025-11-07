import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ children, className = '', gradient = false, glass = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        ${glass ? 'glass' : 'bg-slate-800/50'} 
        ${gradient ? 'gradient-crypto' : ''} 
        rounded-2xl p-6 
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

export default Card
