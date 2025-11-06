'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="border-4 border-white/20 border-t-white rounded-full"
      style={{ width: size, height: size }}
    />
  );
}
