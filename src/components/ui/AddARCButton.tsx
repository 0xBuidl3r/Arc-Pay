"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { ARC_CHAIN } from "@/lib/wagmi";
import { useWallet } from "@/context/WalletContext";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

interface AddARCButtonProps {
  variant?: "primary" | "secondary" | "inline";
  className?: string;
  showLabel?: boolean;
}

export function AddARCButton({ variant = "primary", className = "", showLabel = true }: AddARCButtonProps) {
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { showToast } = useWallet();

  const [isAdding, setIsAdding] = useState(false);

  const handleAddNetwork = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      showToast("No wallet detected. Please install a wallet like MetaMask.", "warning");
      return;
    }

    setIsAdding(true);

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${ARC_CHAIN.id.toString(16)}`,
            chainName: ARC_CHAIN.name,
            rpcUrls: ["https://rpc.testnet.arc.network"],
            blockExplorerUrls: ["https://testnet.arcscan.app"],
            nativeCurrency: {
              name: "USDC",
              symbol: "USDC",
              decimals: 18,
            },
          },
        ],
      });

      showToast("ARC Testnet added successfully!", "success");
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };

      if (err.code === 4902) {
        try {
          await switchChain({ chainId: ARC_CHAIN.id });
          showToast("Switched to ARC Testnet", "success");
        } catch {
          showToast("Could not switch to ARC. Please try manually.", "error");
        }
      } else if (err.code === 4001) {
        showToast("Please approve the network addition in your wallet.", "warning");
      } else {
        showToast("Failed to add ARC Testnet. Please try again.", "error");
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  if (variant === "inline") {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddNetwork}
        disabled={isAdding}
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full hover:bg-cyan-500/20 transition-all ${className}`}
      >
        <svg className={`w-4 h-4 text-cyan-400 ${isAdding ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="text-xs text-cyan-400 font-medium">
          {isAdding ? "Adding..." : "Add ARC"}
        </span>
      </motion.button>
    );
  }

  if (variant === "secondary") {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddNetwork}
        disabled={isAdding}
        className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all ${className}`}
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
          <span className="text-black text-xs font-bold">A</span>
        </div>
        <span className="text-white font-medium text-sm">
          {isAdding ? "Adding ARC..." : "Add ARC Testnet"}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAddNetwork}
      disabled={isAdding}
      className={`inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border border-cyan-500/30 rounded-xl hover:from-cyan-500/30 hover:to-cyan-400/20 transition-all shadow-lg shadow-cyan-500/10 ${className}`}
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-md">
        <span className="text-black font-bold text-lg">A</span>
      </div>
      <div className="text-left">
        <div className="text-white font-semibold text-sm">
          {isAdding ? "Adding ARC..." : "Add ARC Testnet"}
        </div>
        {showLabel && (
          <div className="text-white/50 text-xs">
            Connect to ARC network
          </div>
        )}
      </div>
    </motion.button>
  );
}

export function SwitchToARCButton({ className = "" }: { className?: string }) {
  const { switchChain } = useSwitchChain();
  const { showToast } = useWallet();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async () => {
    setIsSwitching(true);
    try {
      await switchChain({ chainId: ARC_CHAIN.id });
      showToast("Switched to ARC Testnet", "success");
    } catch (error) {
      showToast("Could not switch. Please add ARC Testnet manually.", "warning");
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSwitch}
      disabled={isSwitching}
      className={`inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-xl hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/30 ${className}`}
    >
      <svg className={`w-5 h-5 ${isSwitching ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      <span>{isSwitching ? "Switching..." : "Switch to ARC"}</span>
    </motion.button>
  );
}

export function NetworkWarningModal({
  onAddNetwork,
  onDismiss,
}: {
  onAddNetwork: () => void;
  onDismiss: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setIsAdding(true);
    await onAddNetwork();
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-6"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center mb-6"
        >
          <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-3">
          Wrong Network
        </h3>

        <p className="text-white/60 mb-6">
          Please switch to <span className="text-cyan-400 font-semibold">ARC Testnet</span> to make USDC payments on the ARC blockchain.
        </p>

        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-left">
              <div className="text-white/40 text-xs mb-1">Network</div>
              <div className="text-white font-medium">ARC Testnet</div>
            </div>
            <div className="text-left">
              <div className="text-white/40 text-xs mb-1">Chain ID</div>
              <div className="text-white font-mono">5042002</div>
            </div>
            <div className="text-left">
              <div className="text-white/40 text-xs mb-1">Currency</div>
              <div className="text-cyan-400 font-medium">USDC</div>
            </div>
            <div className="text-left">
              <div className="text-white/40 text-xs mb-1">Explorer</div>
              <div className="text-white text-xs">arcscan.app</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold text-lg hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 rounded-full border-2 border-current border-t-transparent"
                />
                Adding...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add ARC Testnet
              </>
            )}
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-3 text-white/60 hover:text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}