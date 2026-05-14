"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { CopyButton } from "../ui/CopyButton";
import { NetworkStatus } from "../ui/NetworkStatus";
import { USDCBalance } from "../ui/USDCBalance";
import { useToast } from "../ui/Toast";
import { createPayment } from "@/lib/payments";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Payment } from "@/lib/types";
import { USDC_CONTRACT_ADDRESS, erc20Abi } from "@/lib/wagmi";

export function PaymentGenerator() {
  const { address, isConnected } = useAccount();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    note: "",
  });

  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: balance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const handleCreatePayment = async () => {
    if (!formData.amount || !formData.recipient) return;

    if (!isSupabaseConfigured) {
      showToast("Supabase not configured. Check .env.local", "error");
      console.error("Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
      return;
    }

    setIsCreating(true);
    try {
      console.log("Starting payment creation...");
      const payment = await createPayment({
        recipient: formData.recipient,
        amount: formData.amount,
        note: formData.note || undefined,
      });

      if (payment) {
        console.log("Payment created:", payment);
        setCreatedPayment(payment);
        showToast("Payment link created!", "success");
      } else {
        console.error("Payment creation returned null");
        showToast("Failed to create payment link. Check console for details.", "error");
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      showToast("Failed to create payment link", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setCreatedPayment(null);
    setFormData({ recipient: "", amount: "", note: "" });
  };

  const paymentUrl = createdPayment ? `${window.location.origin}/pay/${createdPayment.id}` : "";

  const formatBalance = (rawBalance: bigint | undefined) => {
    if (!rawBalance) return "0.00";
    const formatted = Number(rawBalance) / 1e6;
    return formatted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <section id="payment-generator" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Payment Link
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {createdPayment 
              ? "Your payment link is ready!"
              : "Enter the details below to generate a unique USDC payment link on ARC"
            }
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {createdPayment ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                    >
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Payment Link Created!</h3>
                    <p className="text-white/50">Share this link with the recipient</p>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 mb-6 border border-white/5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-left">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Amount</div>
                        <div className="text-2xl font-bold text-white">
                          {createdPayment.amount} <span className="text-cyan-400">USDC</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Recipient</div>
                        <div className="text-white font-mono text-sm">
                          {createdPayment.recipient.slice(0, 8)}...{createdPayment.recipient.slice(-6)}
                        </div>
                      </div>
                    </div>

                    {createdPayment.note && (
                      <div className="pt-4 border-t border-white/5">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Note</div>
                        <div className="text-white">{createdPayment.note}</div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Payment Link</div>
                    <div className="text-cyan-400 text-sm font-mono break-all mb-4">{paymentUrl}</div>
                    <div className="flex gap-3">
                      <CopyButton text={paymentUrl} />
                      <a
                        href={paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open Link
                      </a>
                    </div>
                  </div>

                  <div className="text-center text-xs text-white/30">
                    Payment ID: <span className="font-mono">{createdPayment.id}</span>
                  </div>
                </CardContent>
              </Card>

              <Button variant="secondary" onClick={handleReset} className="w-full">
                Create Another Payment
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      Payment Details
                    </h3>
                    <NetworkStatus />
                  </div>

                  {isConnected && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <USDCBalance />
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    <Input
                      label="Recipient Wallet Address"
                      placeholder="0x..."
                      value={formData.recipient}
                      onChange={(e) =>
                        setFormData({ ...formData, recipient: e.target.value })
                      }
                    />

                    <Input
                      label="Amount (USDC)"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />

                    <Input
                      label="Note (optional)"
                      placeholder="What's this for?"
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />

                    <div className="pt-4">
                      <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={handleCreatePayment}
                        disabled={!formData.amount || !formData.recipient || isCreating}
                      >
                        {isCreating ? "Creating..." : "Create Payment Link"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isConnected && balance && !createdPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <span className="text-sm text-white/40">
                Your balance: <span className="text-cyan-400">{formatBalance(balance)} USDC</span>
              </span>
            </motion.div>
          )}

          {!isSupabaseConfigured && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center"
            >
              <p className="text-yellow-400 text-sm font-medium">Supabase not configured</p>
              <p className="text-yellow-400/60 text-xs mt-1">Create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}