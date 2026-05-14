"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";

interface PaymentFlashcardProps {
  amount: string;
  recipient: string;
  txHash?: string;
  note?: string;
  paidAt?: string;
}

function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(timestamp?: string): string {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function PaymentFlashcard({ 
  amount, 
  recipient, 
  txHash, 
  note,
  paidAt 
}: PaymentFlashcardProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-black font-bold text-xl">A</span>
              </div>
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Payment Receipt</div>
                <div className="text-base font-semibold text-white">ARC Pay</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Confirmed</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">
              {amount} <span className="text-2xl text-cyan-400 font-medium">USDC</span>
            </div>
            <div className="text-base text-zinc-400">
              to {formatAddress(recipient)}
            </div>
          </div>

          {note && (
            <div className="bg-zinc-800/40 rounded-xl p-3 mb-5 border border-zinc-700/30">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Note</div>
              <div className="text-white font-medium">"{note}"</div>
            </div>
          )}

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Status</span>
              <span className="text-green-400 font-medium">Paid on ARC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Time</span>
              <span className="text-zinc-300">{formatTimestamp(paidAt)}</span>
            </div>
            {txHash && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Transaction</span>
                <span className="text-cyan-400 font-mono text-xs">{formatAddress(txHash)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        
        <div className="px-6 py-4 bg-zinc-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className="text-xs text-zinc-500">Powered by ARC Network</span>
          </div>
          <span className="text-xs text-zinc-600 font-mono">arcpay.xyz</span>
        </div>
      </div>
    </div>
  );
}

export function PaymentFlashcardPreview({ 
  amount, 
  recipient, 
  txHash, 
  note,
  paidAt 
}: PaymentFlashcardProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <PaymentFlashcard 
        amount={amount}
        recipient={recipient}
        txHash={txHash}
        note={note}
        paidAt={paidAt}
      />
    </div>
  );
}

export function useFlashcardDownload() {
  const downloadAsPng = async (element: HTMLDivElement): Promise<void> => {
    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a',
        filter: (node) => {
          if (node.classList?.contains('no-export')) return false;
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `arc-pay-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download flashcard:', error);
    }
  };

  return { downloadAsPng };
}