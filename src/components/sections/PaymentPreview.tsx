"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

interface PaymentPreviewProps {
  amount: string;
  recipient: string;
  note: string;
}

export function PaymentPreview({ amount, recipient, note }: PaymentPreviewProps) {
  const formatAddress = (address: string) => {
    if (!address) return "0x0000...0000";
    if (address.length <= 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const displayAmount = amount || "0";
  const displayRecipient = formatAddress(recipient);
  const displayNote = note || "Payment";

  return (
    <motion.div
      className="relative"
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 rounded-3xl blur-xl" />
      
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <span className="text-black font-bold text-2xl">A</span>
            </div>
            <div>
              <div className="text-sm text-white/50">Payment Request</div>
              <div className="text-lg font-semibold text-white">ARC Pay</div>
            </div>
          </div>

          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayAmount}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-5xl md:text-6xl font-bold text-white mb-2"
              >
                {displayAmount} <span className="text-3xl text-cyan-400">USDC</span>
              </motion.div>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={displayRecipient}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/50 text-sm"
              >
                to {displayRecipient}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-2">For</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={displayNote}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-white text-lg"
              >
                {displayNote}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="bg-white rounded-2xl p-4">
              <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {[...Array(25)].map((_, i) => {
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    const filled = [
                      [1, 0, 1, 0, 1],
                      [0, 1, 0, 1, 0],
                      [1, 0, 1, 0, 1],
                      [0, 1, 0, 1, 0],
                      [1, 0, 1, 0, 1],
                    ][row][col];
                    return (
                      <rect
                        key={i}
                        x={col * 18 + 4}
                        y={row * 18 + 4}
                        width={14}
                        height={14}
                        fill={filled ? "#000" : "#fff"}
                        rx={2}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Pay {displayAmount} USDC
          </Button>

          <div className="mt-6 text-center text-xs text-white/30">
            Powered by ARC Blockchain
          </div>
        </div>
      </div>
    </motion.div>
  );
}