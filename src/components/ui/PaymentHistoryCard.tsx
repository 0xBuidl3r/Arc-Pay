"use client";

import { motion } from "framer-motion";
import { PaymentSession, formatTimestamp, formatAddress } from "@/lib/session";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentHistoryCardProps {
  session: PaymentSession;
  onClick?: () => void;
}

export function PaymentHistoryCard({ session, onClick }: PaymentHistoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            session.status === "completed" ? "bg-green-500/20" :
            session.status === "failed" ? "bg-red-500/20" :
            session.status === "processing" ? "bg-cyan-500/20" :
            "bg-yellow-500/20"
          }`}>
            {session.status === "completed" ? (
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : session.status === "failed" ? (
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : session.status === "processing" ? (
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
              {session.amount} <span className="text-cyan-400 text-lg">USDC</span>
            </div>
            <div className="text-sm text-white/40">
              to {formatAddress(session.recipient)}
            </div>
          </div>
        </div>

        <PaymentStatusBadge status={session.status} size="sm" />
      </div>

      {session.note && (
        <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5">
          <div className="text-xs text-white/30 uppercase tracking-wider mb-1">Note</div>
          <div className="text-white text-sm">{session.note}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-white/30">
          {formatTimestamp(session.paidAt || session.createdAt)}
        </div>

        {session.txHash && (
          <a
            href={`https://testnet.arcscan.app/tx/${session.txHash}`}
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
    </motion.div>
  );
}

export function PaymentHistoryList({
  sessions,
  onPaymentClick,
  emptyMessage = "No payments yet"
}: {
  sessions: PaymentSession[];
  onPaymentClick?: (session: PaymentSession) => void;
  emptyMessage?: string;
}) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-white/40">{emptyMessage}</p>
        <p className="text-white/20 text-sm mt-2">Your payment history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <PaymentHistoryCard
            session={session}
            onClick={() => onPaymentClick?.(session)}
          />
        </motion.div>
      ))}
    </div>
  );
}