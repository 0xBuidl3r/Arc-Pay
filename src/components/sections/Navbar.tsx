"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Logo } from "../ui/Logo";
import { SocialLinks } from "../ui/SocialIcon";
import { AddARCButton } from "../ui/AddARCButton";
import { USDCBalanceMini } from "../ui/USDCBalance";
import { useAccount } from "wagmi";

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center gap-8">
            <Logo size="md" />

            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/activity"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Activity
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && <USDCBalanceMini />}
            <AddARCButton variant="inline" />
            <SocialLinks size="sm" />
            <ConnectButton
              chainStatus="icon"
              accountStatus="avatar"
              showBalance={false}
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}