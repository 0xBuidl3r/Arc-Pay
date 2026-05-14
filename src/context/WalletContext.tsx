"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { ARC_CHAIN } from "@/lib/wagmi";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface WalletContextType {
  isConnected: boolean;
  isOnCorrectChain: boolean;
  chainId: number | null;
  showNetworkWarning: boolean;
  setShowNetworkWarning: (show: boolean) => void;
  toast: ToastProps | null;
  showToast: (message: string, type: ToastProps["type"]) => void;
  hideToast: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isOnCorrectChain: true,
  chainId: null,
  showNetworkWarning: false,
  setShowNetworkWarning: () => {},
  toast: null,
  showToast: () => {},
  hideToast: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);

  const isOnCorrectChain = chainId === ARC_CHAIN.id;

  useEffect(() => {
    if (isConnected && !isOnCorrectChain) {
      setShowNetworkWarning(true);
    } else {
      setShowNetworkWarning(false);
    }
  }, [isConnected, isOnCorrectChain]);

  const showToast = useCallback((message: string, type: ToastProps["type"]) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isOnCorrectChain,
        chainId,
        showNetworkWarning,
        setShowNetworkWarning,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
      
      <AnimatePresence>
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </AnimatePresence>
    </WalletContext.Provider>
  );
}

function ToastNotification({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastProps["type"];
  onClose: () => void;
}) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-cyan-500",
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className={`${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
        {icons[type]}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}