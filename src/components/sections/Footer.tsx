"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "../ui/Logo";
import { SocialLinks } from "../ui/SocialIcon";
import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState(2024);
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start gap-4"
          >
            <Logo size="sm" showLink={false} />
            <p className="text-sm text-white/40 max-w-xs text-center lg:text-left">
              Premium USDC payments on the ARC blockchain
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Built on ARC
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-xs text-white/30 mb-2">Connect with us</div>
            <SocialLinks size="md" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center lg:items-end gap-4"
          >
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/activity" className="hover:text-white transition-colors">
                Activity
              </Link>
            </div>
            <div className="text-xs text-white/30">
              © {year} ARC Pay. All rights reserved.
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}