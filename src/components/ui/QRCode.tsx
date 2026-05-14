"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 180, className = "" }: QRCodeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl blur-xl" />
      
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative bg-white rounded-2xl p-4 shadow-2xl"
      >
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          bgColor="transparent"
          fgColor="#0a0a0a"
          imageSettings={{
            src: "/arcpay.png",
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

interface QRCodeCardProps {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}

export function QRCodeCard({ value, size = 160, label, className = "" }: QRCodeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}
    >
      {label && (
        <div className="text-xs text-white/30 uppercase tracking-wider mb-4 text-center">
          {label}
        </div>
      )}
      
      <div className="flex justify-center">
        <QRCode value={value} size={size} />
      </div>
    </motion.div>
  );
}

export function QRCodeWithActions({ value, className = "" }: { value: string; className?: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}
    >
      <div className="flex justify-center mb-4">
        <QRCode value={value} size={140} />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-white/40">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Scan with mobile wallet
      </div>
    </motion.div>
  );
}