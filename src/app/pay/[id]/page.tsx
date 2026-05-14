"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CopyButton } from "@/components/ui/CopyButton";
import { PaymentStatusBadge } from "@/components/ui/PaymentStatusBadge";
import { SwitchToARCButton } from "@/components/ui/AddARCButton";
import { USDCBalance } from "@/components/ui/USDCBalance";
import { QRCode } from "@/components/ui/QRCode";
import { PaymentFlashcard, useFlashcardDownload } from "@/components/ui/PaymentFlashcard";
import { ShareModal } from "@/components/ui/ShareModal";
import { PaymentNotFoundEmptyState } from "@/components/ui/EmptyState";
import { ReceiptSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { getPaymentById, updatePayment, markPaymentAsCompleted, markPaymentAsFailed } from "@/lib/payments";
import { openXShare, generatePremiumCaption, copyCaptionToClipboard } from "@/lib/social";
import type { Payment } from "@/lib/types";
import { ARC_CHAIN, USDC_CONTRACT_ADDRESS, erc20Abi } from "@/lib/wagmi";

type PaymentPhase = "loading" | "notfound" | "pending" | "processing" | "completed" | "failed";

function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PaymentPageContent() {
  const params = useParams();
  const paymentId = params.id as string;
  
  const { address: walletAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { showToast } = useToast();

  const [phase, setPhase] = useState<PaymentPhase>("loading");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const flashcardRef = useRef<HTMLDivElement>(null);
  
  const { downloadAsPng } = useFlashcardDownload();
  const hasCompletedRef = useRef(false);
  const hasFailedRef = useRef(false);

  const isOnARC = chainId === ARC_CHAIN.id;

  const { 
    writeContract, 
    data: txData, 
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash: txData,
  });

  const fetchPayment = useCallback(async () => {
    if (!paymentId) {
      setPhase("notfound");
      return;
    }

    const fetchedPayment = await getPaymentById(paymentId);
    
    if (!fetchedPayment) {
      setPhase("notfound");
      return;
    }

    setPayment(fetchedPayment);
    hasCompletedRef.current = false;
    hasFailedRef.current = false;
    
    switch (fetchedPayment.status) {
      case "completed":
        setPhase("completed");
        break;
      case "failed":
        setPhase("failed");
        break;
      case "processing":
        setPhase("processing");
        break;
      default:
        setPhase("pending");
    }
  }, [paymentId]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  useEffect(() => {
    if (txData && payment && payment.status === "pending") {
      setPhase("processing");
      setPayment(prev => prev ? { ...prev, status: "processing" } : null);
    }
  }, [txData, payment]);

  useEffect(() => {
    if (isConfirmed && txData && payment && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      
      markPaymentAsCompleted(payment.id).then((updated) => {
        if (updated) {
          setPayment(updated);
          setPhase("completed");
          showToast("Payment completed successfully!", "success");
        }
      });
    }
  }, [isConfirmed, txData, payment, showToast]);

  useEffect(() => {
    if (writeError && payment && !hasFailedRef.current) {
      hasFailedRef.current = true;
      
      markPaymentAsFailed(payment.id).then((updated) => {
        if (updated) {
          setPayment(updated);
          setPhase("failed");
          showToast("Transaction failed. Please try again.", "error");
        }
      });
    }
  }, [writeError, payment, showToast]);

  const handlePay = async () => {
    if (!isConnected) {
      showToast("Please connect your wallet first", "warning");
      return;
    }

    if (!isOnARC) {
      try {
        await switchChain({ chainId: ARC_CHAIN.id });
      } catch (error) {
        showToast("Please switch to ARC Testnet", "error");
      }
      return;
    }

    if (!payment || !walletAddress) return;

    setIsSubmitting(true);
    try {
      const amountInUSDC = BigInt(Math.floor(parseFloat(payment.amount) * 1e6));
      
      showToast("Preparing USDC transfer...", "info");

      writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: "transfer",
        args: [payment.recipient as `0x${string}`, amountInUSDC],
      });
    } catch (error) {
      showToast("Failed to initiate transaction", "error");
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (!payment) return;
    updatePayment(payment.id, { status: "pending" });
    setPhase("pending");
    setPayment((prev) => prev ? { ...prev, status: "pending" } : null);
    hasCompletedRef.current = false;
    hasFailedRef.current = false;
    resetWrite();
  };

  const handleShareOnX = () => {
    if (!payment) return;
    openXShare({
      amount: payment.amount,
      recipient: payment.recipient,
      txHash: payment.tx_hash || undefined,
      note: payment.note || undefined,
    }, 'premium');
  };

  const handleCopyCaption = async () => {
    if (!payment) return;
    await copyCaptionToClipboard({
      amount: payment.amount,
      recipient: payment.recipient,
      txHash: payment.tx_hash || undefined,
      note: payment.note || undefined,
    }, 'premium');
    showToast("Caption copied!", "success");
  };

  const handleDownloadReceipt = async () => {
    if (flashcardRef.current) {
      await downloadAsPng(flashcardRef.current);
      showToast("Receipt downloaded!", "success");
    }
  };

  const shareCaption = payment ? generatePremiumCaption({
    amount: payment.amount,
    recipient: payment.recipient,
    txHash: payment.tx_hash || undefined,
    note: payment.note || undefined,
  }) : '';

  const isPayable = payment?.status === "pending" || payment?.status === "processing";
  const paymentUrl = payment ? `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${payment.id}` : "";

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <ReceiptSkeleton />
      </div>
    );
  }

  if (phase === "notfound") {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <PaymentNotFoundEmptyState />
        </div>
        <Footer />
      </div>
    );
  }

  if (phase === "completed" && payment) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/5 rounded-full blur-3xl" />
        </div>
        
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-4 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {showFlashcard ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div ref={flashcardRef} className="mx-auto" style={{ width: '320px' }}>
                  <PaymentFlashcard
                    amount={payment.amount}
                    recipient={payment.recipient}
                    txHash={payment.tx_hash || undefined}
                    note={payment.note || undefined}
                    paidAt={payment.paid_at || undefined}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFlashcard(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 transition-all duration-200"
                  >
                    Download PNG
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-6">
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                      >
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <h1 className="text-3xl font-bold text-white mb-2">Payment Complete</h1>
                      <p className="text-white/50">Your USDC has been sent successfully</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/5">
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold text-white mb-2 tracking-tight">
                          {payment.amount} <span className="text-2xl text-cyan-400 font-medium">USDC</span>
                        </div>
                        <div className="text-sm text-white/40">
                          to {formatAddress(payment.recipient)}
                        </div>
                      </div>

                      {payment.note && (
                        <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5">
                          <div className="text-xs text-white/30 uppercase tracking-wider mb-1">Note</div>
                          <div className="text-white">{payment.note}</div>
                        </div>
                      )}

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white/40">Status</span>
                          <span className="text-green-400 font-medium">Confirmed</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/40">Paid</span>
                          <span className="text-white">{formatTimestamp(payment.paid_at)}</span>
                        </div>
                      </div>
                    </div>

                    {payment.tx_hash && (
                      <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                        <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Transaction Hash</div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-cyan-400 font-mono text-sm truncate">
                            {payment.tx_hash}
                          </span>
                          <CopyButton text={payment.tx_hash} />
                        </div>
                      </div>
                    )}

                    <a
                      href={`https://testnet.arcscan.app/tx/${payment.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 mb-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on ARC Explorer
                    </a>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-100 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Share Payment
                  </button>

                  <button
                    onClick={() => setShowFlashcard(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Download Receipt
                  </button>
                </div>

                <ShareModal
                  isOpen={showShareModal}
                  onClose={() => setShowShareModal(false)}
                  caption={shareCaption}
                  onCopyCaption={handleCopyCaption}
                  onShareX={() => {
                    setShowShareModal(false);
                    handleShareOnX();
                  }}
                />
              </>
            )}
          </motion.div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 relative z-10">
        <div className="w-full max-w-md">
          {payment && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <PaymentStatusBadge status={payment.status} size="lg" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {payment.status === "failed" ? "Payment Failed" : "USDC Payment Request"}
                </h1>
                <p className="text-white/50">
                  {isConnected 
                    ? payment.status === "pending" ? "Review and confirm the payment" : ""
                    : "Connect wallet to view payment details"}
                </p>
              </motion.div>

              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <USDCBalance />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-6"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                        <span className="text-black font-bold text-xl">A</span>
                      </div>
                      <div>
                        <div className="text-xs text-white/40 uppercase tracking-wider">Payment Request</div>
                        <div className="text-base font-semibold text-white">ARC Pay</div>
                      </div>
                    </div>
                    {payment.status === "completed" && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400">ARC</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                      {payment.amount} <span className="text-2xl text-cyan-400 font-medium">USDC</span>
                    </div>
                    <div className="text-sm text-white/40">
                      to {formatAddress(payment.recipient)}
                    </div>
                  </div>

                  {payment.note && (
                    <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/5">
                      <div className="text-xs text-white/30 uppercase tracking-wider mb-2 font-medium">For</div>
                      <div className="text-white font-medium">{payment.note}</div>
                    </div>
                  )}

                  <div className="flex justify-center mb-6">
                    <QRCode value={paymentUrl} size={160} />
                  </div>

                  {isPayable && (
                    <motion.button
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      onClick={handlePay}
                      disabled={!isConnected || !isOnARC || isWritePending || isConfirming || isSubmitting}
                      className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                        !isConnected || !isOnARC || isWritePending || isConfirming || isSubmitting
                          ? "bg-white/20 text-white/40 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-cyan-300"
                      }`}
                    >
                      {isWritePending || isConfirming ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-5 h-5 rounded-full border-2 border-current border-t-transparent"
                          />
                          {isWritePending ? "Waiting for wallet..." : "Confirming on ARC..."}
                        </span>
                      ) : !isConnected ? (
                        "Connect Wallet to Pay"
                      ) : !isOnARC ? (
                        "Switch to ARC to Pay"
                      ) : (
                        `Pay ${payment.amount} USDC`
                      )}
                    </motion.button>
                  )}

                  {payment.status === "failed" && (
                    <button
                      onClick={handleRetry}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold text-lg shadow-lg shadow-cyan-500/30"
                    >
                      Try Again
                    </button>
                  )}
                </div>

                <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              </motion.div>

              {!isOnARC && isConnected && isPayable && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 text-center"
                >
                  <SwitchToARCButton className="mx-auto" />
                </motion.div>
              )}

              {(isWritePending || isConfirming) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-6"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent"
                    />
                    <span className="text-cyan-400 font-medium">
                      {isWritePending ? "Waiting for wallet..." : "Confirming USDC on ARC..."}
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${isOnARC ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
                  <span className="text-sm text-white/50">
                    {isOnARC ? "Connected to ARC" : "Wrong network"}
                  </span>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Loading payment...</div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}