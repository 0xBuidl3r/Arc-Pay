"use client";

import { motion } from "framer-motion";

interface TransactionState {
  status: "idle" | "preparing" | "waiting" | "submitted" | "confirmed" | "success" | "error";
  message: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  state: TransactionState;
  txHash?: string;
  error?: string;
  amount?: string;
  onClose: () => void;
}

export function TransactionModal({
  isOpen,
  state,
  txHash,
  error,
  amount,
  onClose,
}: TransactionModalProps) {
  if (!isOpen) return null;

  const { status, message } = state;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
      >
        <div className="mb-8">
          {status === "preparing" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto rounded-full border-4 border-white/20 border-t-cyan-400"
            />
          )}

          {status === "waiting" && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-20 h-20 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-400 animate-pulse" />
            </motion.div>
          )}

          {status === "submitted" && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-20 h-20 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
          )}

          {status === "confirmed" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
            >
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">
          {status === "preparing" && "Preparing USDC Payment"}
          {status === "waiting" && "Waiting for Confirmation"}
          {status === "submitted" && "Sending USDC"}
          {status === "confirmed" && "USDC Confirmed"}
          {status === "success" && "Payment Successful!"}
          {status === "error" && "Transaction Failed"}
        </h3>

        <p className="text-white/60 mb-6">{message}</p>

        {amount && (status === "submitted" || status === "confirmed" || status === "success") && (
          <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Amount Sent</div>
            <div className="text-2xl font-bold text-white">
              {amount} <span className="text-cyan-400">USDC</span>
            </div>
          </div>
        )}

        {txHash && (
          <div className="bg-white/5 rounded-xl p-3 mb-6">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Transaction Hash</div>
            <div className="text-cyan-400 text-sm font-mono break-all">{txHash.slice(0, 20)}...{txHash.slice(-10)}</div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6">
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}

        {(status === "success" || status === "error") && (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            Close
          </button>
        )}

        {status === "submitted" && (
          <div className="text-sm text-white/40 animate-pulse">
            Waiting for confirmation on ARC...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface PaymentSuccessProps {
  txHash: string;
  amount: string;
  recipient: string;
  onClose: () => void;
}

export function PaymentSuccess({ txHash, amount, recipient, onClose }: PaymentSuccessProps) {
  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30 mb-8"
      >
        <svg className="w-14 h-14 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-3">Payment Complete!</h2>
      
      <p className="text-white/60 mb-8">
        Your USDC payment has been successfully sent on the ARC blockchain.
      </p>

      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 mb-8 border border-white/5">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Payment Details</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Amount</span>
            <span className="text-2xl font-bold text-white">{amount} <span className="text-cyan-400">USDC</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">To</span>
            <span className="text-white font-mono">{formatAddress(recipient)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-3 mb-6">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Transaction Hash</div>
        <div className="text-cyan-400 text-sm font-mono break-all">{txHash}</div>
      </div>

      <div className="space-y-3">
        <a
          href={`https://testnet.arcscan.app/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold hover:from-cyan-400 hover:to-cyan-300 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View on ARC Explorer
        </a>
        
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          Done
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Confirmed on ARC
      </div>
    </motion.div>
  );
}