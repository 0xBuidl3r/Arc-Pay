"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useAccount, useChainId } from "wagmi";
import { ARC_CHAIN } from "@/lib/wagmi";

interface PaymentCardProps {
  amount: string;
  recipient: string;
  note: string;
  paymentUrl?: string;
  showQRCode?: boolean;
  variant?: "preview" | "full";
  onPay?: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

export function PaymentCard({
  amount,
  recipient,
  note,
  paymentUrl = "",
  showQRCode = true,
  variant = "preview",
  onPay,
  disabled = false,
  isProcessing = false,
}: PaymentCardProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const formatAddress = (address: string) => {
    if (!address) return "0x0000...0000";
    if (address.length <= 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const displayAmount = amount || "0";
  const displayRecipient = formatAddress(recipient);
  const displayNote = note || "Payment";

  const isOnARC = chainId === ARC_CHAIN.id;
  const isFull = variant === "full";

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (!isConnected) return "Connect Wallet to Pay";
    if (!isOnARC) return "Switch to ARC to Pay";
    return `Pay ${displayAmount} USDC`;
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-transparent rounded-3xl blur-2xl" />
      
      <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl opacity-50" />
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-12 h-12"
              >
                <Image
                  src="/arcpay.png"
                  alt="ARC Pay"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </motion.div>
              <div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Payment Request</div>
                <div className="text-lg font-semibold text-white">ARC Pay</div>
              </div>
            </div>

            {isOnARC && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">ARC</span>
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <motion.div
              key={displayAmount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight"
            >
              {displayAmount} <span className="text-3xl text-cyan-400 font-medium">USDC</span>
            </motion.div>
            
            <motion.div
              key={`recipient-${displayRecipient}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-white/40"
            >
              to {displayRecipient}
            </motion.div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-2 font-medium">For</div>
            <motion.div
              key={`note-${displayNote}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white text-lg font-medium"
            >
              {displayNote}
            </motion.div>
          </div>

          {showQRCode && (
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl blur-xl" />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="relative bg-white rounded-2xl p-4 shadow-2xl"
                >
                  <QRCodeSVG
                    value={paymentUrl || "https://arcpay.app/pay?amount=0"}
                    size={140}
                    level="H"
                    bgColor="transparent"
                    fgColor="#0a0a0a"
                  />
                </motion.div>
              </div>
            </div>
          )}

          {isFull && paymentUrl && (
            <div className="mb-6">
              <div className="text-xs text-white/30 uppercase tracking-wider mb-2 font-medium">Payment Link</div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-white/60 text-sm font-mono truncate">{paymentUrl}</div>
              </div>
            </div>
          )}

          <motion.button
            whileHover={disabled || isProcessing ? {} : { scale: 1.02 }}
            whileTap={disabled || isProcessing ? {} : { scale: 0.98 }}
            onClick={onPay}
            disabled={disabled || isProcessing}
            className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 ${
              disabled || isProcessing
                ? "bg-white/20 text-white/40 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-cyan-300"
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 rounded-full border-2 border-current border-t-transparent"
                />
                Processing...
              </span>
            ) : (
              getButtonText()
            )}
          </motion.button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Powered by ARC Blockchain
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
    </motion.div>
  );
}