"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense, useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { PaymentStatusBadge } from "@/components/ui/PaymentStatusBadge";
import { getAllPayments } from "@/lib/payments";
import type { Payment, PaymentStatus } from "@/lib/types";
import { useAccount } from "wagmi";

function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActivityContent() {
  const { isConnected } = useAccount();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllPayments(100);
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 px-6 py-24 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-3">Payment Activity</h1>
            <p className="text-white/50">Track your USDC payments on ARC</p>
          </motion.div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-white/50 mb-6">Connect your wallet to view payment history</p>
              <p className="text-sm text-white/30">Use the "Connect Wallet" button in the navigation bar</p>
            </motion.div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-4 border-white/20 border-t-cyan-400"
              />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-6 overflow-x-auto pb-2"
              >
                {(["all", "completed", "pending", "processing", "failed"] as const).map((f) => {
                  const count = f === "all" 
                    ? payments.length 
                    : payments.filter((p) => p.status === f).length;
                  
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                        filter === f
                          ? "bg-cyan-500 text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      <span className="ml-2 opacity-60">({count})</span>
                    </button>
                  );
                })}
              </motion.div>

              {filteredPayments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-white/40">
                    {filter === "all" ? "No payments yet" : `No ${filter} payments`}
                  </p>
                  <p className="text-white/20 text-sm mt-2">Your payment history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/pay/${payment.id}`}
                        className="block bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              payment.status === "completed" ? "bg-green-500/20" :
                              payment.status === "failed" ? "bg-red-500/20" :
                              payment.status === "processing" ? "bg-cyan-500/20" :
                              "bg-yellow-500/20"
                            }`}>
                              {payment.status === "completed" ? (
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : payment.status === "failed" ? (
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : payment.status === "processing" ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent"
                                />
                              ) : (
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-white">
                                {payment.amount} <span className="text-cyan-400 text-lg">USDC</span>
                              </div>
                              <div className="text-sm text-white/40">
                                to {formatAddress(payment.recipient)}
                              </div>
                            </div>
                          </div>

                          <PaymentStatusBadge status={payment.status} size="sm" />
                        </div>

                        {payment.note && (
                          <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5">
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-1">Note</div>
                            <div className="text-white text-sm">{payment.note}</div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-white/30">
                            {formatTimestamp(payment.paid_at || payment.created_at)}
                          </div>

                          {payment.tx_hash && (
                            <a
                              href={`https://testnet.arcscan.app/tx/${payment.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span className="group-hover/link:underline">View on Explorer</span>
                            </a>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Loading activity...</div>
      </div>
    }>
      <ActivityContent />
    </Suspense>
  );
}