"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { formatAddress, formatTimestamp } from "@/lib/session";

interface PaymentReceiptProps {
  txHash: string;
  amount: string;
  recipient: string;
  note?: string;
  timestamp?: number | null;
  onDone: () => void;
  onShare?: () => void;
}

export function PaymentReceipt({
  txHash,
  amount,
  recipient,
  note,
  timestamp,
  onDone,
  onShare,
}: PaymentReceiptProps) {
  const displayTimestamp = timestamp || Date.now();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      <div className="relative p-8 text-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30 mb-8"
        >
          <svg className="w-14 h-14 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-white/50">Your USDC has been sent on ARC</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/5"
        >
          <div className="text-xs text-white/30 uppercase tracking-wider mb-4">Amount Sent</div>
          <div className="text-5xl font-bold text-white mb-6">
            {amount} <span className="text-3xl text-cyan-400 font-medium">USDC</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="text-left">
              <div className="text-xs text-white/40 mb-1">Recipient</div>
              <div className="text-white font-mono">{formatAddress(recipient)}</div>
            </div>
            <div className="text-left">
              <div className="text-xs text-white/40 mb-1">Time</div>
              <div className="text-white">{formatTimestamp(displayTimestamp)}</div>
            </div>
          </div>

          {note && (
            <div className="mt-4 pt-4 border-t border-white/5 text-left">
              <div className="text-xs text-white/40 mb-1">Note</div>
              <div className="text-white">{note}</div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white/5 rounded-xl p-4 border border-white/5"
        >
          <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Transaction Hash</div>
          <div className="text-cyan-400 text-sm font-mono break-all">{txHash}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-3"
        >
          <a
            href={`https://testnet.arcscan.app/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold text-lg hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on ARC Explorer
          </a>

          <div className="flex gap-3">
            {onShare && (
              <button
                onClick={onShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            )}
            <button
              onClick={onDone}
              className={`${onShare ? "flex-1" : "w-full"} py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all`}
            >
              Done
            </button>
          </div>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Confirmed on ARC
        </div>
      </div>

      <div className="px-8 py-4 bg-white/5 border-t border-white/5">
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/arcpay.png"
            alt="ARC Pay"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="text-white/50 text-sm">Powered by ARC Pay</span>
        </div>
      </div>
    </motion.div>
  );
}

interface PendingReceiptProps {
  amount: string;
  recipient: string;
  note?: string;
  onCancel: () => void;
}

export function PendingReceipt({
  amount,
  recipient,
  note,
  onCancel,
}: PendingReceiptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      <div className="relative p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto rounded-full border-4 border-white/20 border-t-cyan-400 mb-8"
        />

        <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
        <p className="text-white/50 mb-8">Please wait while we confirm your transaction...</p>

        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/5">
          <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Sending</div>
          <div className="text-4xl font-bold text-white mb-4">
            {amount} <span className="text-2xl text-cyan-400 font-medium">USDC</span>
          </div>
          <div className="text-sm text-white/40">
            to {formatAddress(recipient)}
          </div>
        </div>

        <button
          onClick={onCancel}
          className="mt-8 w-full py-3 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

interface FailedReceiptProps {
  amount: string;
  recipient: string;
  error?: string;
  onRetry: () => void;
  onDone: () => void;
}

export function FailedReceipt({
  amount,
  recipient,
  error,
  onRetry,
  onDone,
}: FailedReceiptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      <div className="relative p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-8"
        >
          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
        <p className="text-white/50 mb-6">Your transaction could not be completed.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}

        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/5 mb-8">
          <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Amount</div>
          <div className="text-3xl font-bold text-white">
            {amount} <span className="text-xl text-cyan-400 font-medium">USDC</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold text-lg hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/30"
          >
            Try Again
          </button>
          <button
            onClick={onDone}
            className="w-full py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </motion.div>
  );
}