'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowDownCircle, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function DepositPage() {
  const { status } = useSession();
  const router = useRouter();
  const [depositAddress, setDepositAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchDepositAddress();
    }
  }, [status, router]);

  const fetchDepositAddress = async () => {
    try {
      const response = await fetch('/api/deposit');
      const data = await response.json();
      setDepositAddress(data.depositAddress);
    } catch (error) {
      toast.error('Failed to load deposit address');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pb-24">
      <MobileNav />
      
      <div className="max-w-md mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <ArrowDownCircle size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Deposit USDT</h1>
              <p className="text-gray-400">TRC20 Network</p>
            </div>
          </div>
        </motion.div>

        {/* Deposit Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <h3 className="font-semibold mb-4">Deposit Address</h3>
            
            <div className="bg-white/5 rounded-xl p-4 mb-4 break-all font-mono text-sm">
              {depositAddress}
            </div>

            <Button
              onClick={handleCopy}
              fullWidth
              variant={copied ? 'secondary' : 'primary'}
            >
              {copied ? (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} className="mr-2" />
                  Copy Address
                </>
              )}
            </Button>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-400" />
              Important Instructions
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold">1.</span>
                <p>Only send <strong className="text-white">USDT</strong> to this address</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold">2.</span>
                <p>Use <strong className="text-white">TRC20 network</strong> only</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold">3.</span>
                <p>Your balance will be updated automatically after network confirmation</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold">4.</span>
                <p>Minimum deposit: <strong className="text-white">10 USDT</strong></p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-red-600/10 border-red-600/20">
            <div className="flex gap-3">
              <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Warning</h3>
                <p className="text-sm text-gray-300">
                  Sending any other cryptocurrency or using a different network will result in 
                  permanent loss of funds. We cannot recover incorrectly sent funds.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <h3 className="font-semibold mb-4">Deposit Process</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold">Send USDT</p>
                  <p className="text-sm text-gray-400">Transfer from your wallet</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold">Network Confirmation</p>
                  <p className="text-sm text-gray-400">Usually takes 1-3 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold">Balance Updated</p>
                  <p className="text-sm text-gray-400">Funds available immediately</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
