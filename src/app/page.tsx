"use client";

import { motion } from "framer-motion";
import { Navbar, Hero, PaymentGenerator, Features, Footer } from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <Navbar />
        <main>
          <Hero />
          <PaymentGenerator />
          <Features />
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}