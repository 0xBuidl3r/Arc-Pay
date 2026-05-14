"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";
import { formatAddress, formatTimestamp } from "@/lib/session";

interface ShareableReceiptProps {
  txHash: string;
  amount: string;
  recipient: string;
  note?: string;
  timestamp?: number;
}

export function ShareableReceipt({ 
  txHash, 
  amount, 
  recipient, 
  note,
  timestamp = Date.now() 
}: ShareableReceiptProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    
    setIsSharing(true);
    try {
      await navigator.share({
        title: `ARC Pay - ${amount} USDC Sent`,
        text: `Paid ${amount} USDC on ARC blockchain. Tx: ${txHash}`,
        url: `https://testnet.arcscan.app/tx/${txHash}`,
      });
    } catch (error) {
      // User cancelled or error
    } finally {
      setIsSharing(false);
    }
  }, [amount, txHash]);

  const handleCopyLink = useCallback(async () => {
    const url = `https://testnet.arcscan.app/tx/${txHash}`;
    await navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [txHash]);

  const handleCopyTxHash = useCallback(async () => {
    await navigator.clipboard.writeText(txHash);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [txHash]);

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      <div className="relative p-8 text-center">
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
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="text-4xl font-bold text-white mb-2">
            {amount} <span className="text-2xl text-cyan-400 font-medium">USDC</span>
          </div>
          <div className="text-sm text-white/40">
            Sent to {formatAddress(recipient)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 mb-6 border border-white/5"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative w-10 h-10">
              <Image
                src="/arcpay.png"
                alt="ARC Pay"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">ARC Pay</div>
              <div className="text-xs text-white/40">Payment Complete</div>
            </div>
          </div>
          <div className="text-xs text-white/30">
            {formatTimestamp(timestamp)}
          </div>
        </motion.div>

        {note && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/5 rounded-xl p-3 mb-6 border border-white/5"
          >
            <div className="text-xs text-white/30 uppercase tracking-wider mb-1">Note</div>
            <div className="text-white font-medium">{note}</div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-3 mb-6 border border-white/5"
        >
          <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Transaction Hash</div>
          <div className="text-cyan-400 text-sm font-mono break-all">{txHash}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              disabled={isSharing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold text-sm hover:from-cyan-400 hover:to-cyan-300 transition-all flex items-center justify-center gap-2"
            >
              {isSharing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 rounded-full border-2 border-current border-t-transparent"
                />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
              Share Receipt
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              {showCopied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>

            <button
              onClick={handleCopyTxHash}
              className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Tx Hash
            </button>
          </div>

          <a
            href={`https://testnet.arcscan.app/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on ARC Explorer
          </a>
        </motion.div>
      </div>

      <div className="px-8 py-4 bg-white/5 border-t border-white/5">
        <div className="flex items-center justify-center gap-3 text-xs text-white/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Verified on ARC
        </div>
      </div>
    </motion.div>
  );
}