"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

interface LogoProps {
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg";
  showLink?: boolean;
  className?: string;
}

const sizes = {
  sm: {
    container: "h-8",
    icon: 32,
    text: "text-lg",
  },
  md: {
    container: "h-10",
    icon: 40,
    text: "text-xl",
  },
  lg: {
    container: "h-12",
    icon: 48,
    text: "text-2xl",
  },
};

export function Logo({ variant = "full", size = "md", showLink = true, className = "" }: LogoProps) {
  const sizeConfig = sizes[size];
  const iconSize = sizeConfig.icon;

  const logoContent = (
    <div className={`flex items-center gap-2 ${sizeConfig.container} ${className}`}>
      {variant !== "text" && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <Image
            src="/arcpay.png"
            alt="ARC Pay Logo"
            width={iconSize}
            height={iconSize}
            className="object-contain"
            priority={size === "lg"}
          />
        </motion.div>
      )}
      
      {variant !== "icon" && (
        <span className={`font-semibold text-white ${sizeConfig.text}`}>
          ARC Pay
        </span>
      )}
    </div>
  );

  if (showLink) {
    return (
      <Link href="/" className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

export function LogoIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={`relative ${className}`}
    >
      <Image
        src="/arcpay.png"
        alt="ARC Pay"
        width={size}
        height={size}
        className="object-contain"
      />
    </motion.div>
  );
}