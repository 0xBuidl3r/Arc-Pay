"use client";

import { motion } from "framer-motion";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { USDC_CONTRACT_ADDRESS, erc20Abi, ARC_CHAIN } from "@/lib/wagmi";

interface USDCBalanceProps {
  className?: string;
  showLabel?: boolean;
}

export function USDCBalance({ className = "", showLabel = true }: USDCBalanceProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { data: balance, isLoading } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && address !== undefined && chainId === ARC_CHAIN.id,
    },
  });

  const formatBalance = (rawBalance: bigint | undefined) => {
    if (!rawBalance) return "0.00";
    const formatted = Number(rawBalance) / 1e6;
    return formatted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!isConnected) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <span className="text-black font-bold text-lg">$</span>
            </div>
            <div>
              {showLabel && (
                <div className="text-xs text-white/40 uppercase tracking-wider">USDC Balance</div>
              )}
              {isLoading ? (
                <div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold text-white">
                  {formatBalance(balance)}
                  <span className="text-sm text-cyan-400 ml-1">USDC</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/30">ARC</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function USDCBalanceMini() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { data: balance, isLoading } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && address !== undefined && chainId === ARC_CHAIN.id,
    },
  });

  const formatBalance = (rawBalance: bigint | undefined) => {
    if (!rawBalance) return "0.00";
    const formatted = Number(rawBalance) / 1e6;
    return formatted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!isConnected) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
      <span className="text-cyan-400 font-bold">$</span>
      {isLoading ? (
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
      ) : (
        <span className="text-white text-sm font-medium">{formatBalance(balance)} USDC</span>
      )}
    </div>
  );
}