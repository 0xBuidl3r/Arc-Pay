"use client";

import { motion } from "framer-motion";
import { PaymentStatus } from "@/lib/session";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const statusConfig = {
  pending: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Pending",
  },
  processing: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    icon: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-3 h-3 rounded-full border border-current border-t-transparent"
      />
    ),
    label: "Processing",
  },
  completed: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    label: "Completed",
  },
  failed: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    label: "Failed",
  },
  expired: {
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    text: "text-gray-400",
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Expired",
  },
};

export function PaymentStatusBadge({ status, size = "md", showIcon = true }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  const isProcessing = status === "processing";

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.border} ${config.text} ${sizes[size]}`}
    >
      {showIcon && (
        <span className={isProcessing ? "" : ""}>
          {config.icon}
        </span>
      )}
      {config.label}
    </motion.span>
  );
}

interface PaymentStatusBannerProps {
  status: PaymentStatus;
}

export function PaymentStatusBanner({ status }: PaymentStatusBannerProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border ${config.bg} ${config.border}`}
    >
      <span className={config.text}>{config.icon}</span>
      <span className={`font-medium ${config.text}`}>
        {status === "pending" && "Awaiting Payment"}
        {status === "processing" && "Processing Payment..."}
        {status === "completed" && "Payment Completed"}
        {status === "failed" && "Payment Failed"}
        {status === "expired" && "Payment Expired"}
      </span>
    </motion.div>
  );
}