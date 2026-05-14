"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div 
      className={`bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
  );
}

export function PaymentCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="w-24 h-4 mb-2" />
            <Skeleton className="w-20 h-6" />
          </div>
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>

      <div className="text-center mb-8">
        <Skeleton className="w-48 h-16 mx-auto mb-2" />
        <Skeleton className="w-32 h-4 mx-auto" />
      </div>

      <Skeleton className="w-full h-16 rounded-2xl mb-6" />

      <div className="flex justify-center mb-6">
        <Skeleton className="w-36 h-36 rounded-2xl" />
      </div>

      <Skeleton className="w-full h-14 rounded-2xl" />
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="w-32 h-7 mb-2" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <Skeleton className="w-full h-12 rounded-xl" />
    </div>
  );
}

export function PaymentFormSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="w-40 h-4 mb-2" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <div>
        <Skeleton className="w-32 h-4 mb-2" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <div>
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <Skeleton className="w-full h-12 rounded-xl" />
    </div>
  );
}

export function ReceiptSkeleton() {
  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-8 text-center">
      <Skeleton className="w-24 h-24 rounded-full mx-auto mb-8" />
      
      <Skeleton className="w-48 h-8 mx-auto mb-4" />
      <Skeleton className="w-32 h-4 mx-auto mb-8" />

      <div className="bg-white/5 rounded-2xl p-6 mb-6">
        <Skeleton className="w-40 h-10 mx-auto mb-4" />
        <Skeleton className="w-64 h-4 mx-auto mb-4" />
        <Skeleton className="w-48 h-4 mx-auto" />
      </div>

      <Skeleton className="w-full h-16 rounded-2xl mb-4" />
      <Skeleton className="w-full h-12 rounded-xl" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="w-20 h-4 mb-2" />
          <Skeleton className="w-24 h-8" />
        </div>
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}