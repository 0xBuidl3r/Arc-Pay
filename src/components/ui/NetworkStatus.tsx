"use client";

import { motion } from "framer-motion";
import { useAccount, useChainId } from "wagmi";
import { ARC_CHAIN } from "@/lib/wagmi";

interface NetworkStatusProps {
  className?: string;
}

export function NetworkStatus({ className = "" }: NetworkStatusProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isOnARC = chainId === ARC_CHAIN.id;
  const isUnsupported = isConnected && chainId && chainId !== ARC_CHAIN.id;

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full ${className}`}
      >
        <div className="w-2 h-2 rounded-full bg-white/30" />
        <span className="text-xs text-white/50">Not connected</span>
      </motion.div>
    );
  }

  if (isUnsupported) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full ${className}`}
      >
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        <span className="text-xs text-yellow-400">Wrong network</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-xs text-green-400">Connected to ARC</span>
    </motion.div>
  );
}