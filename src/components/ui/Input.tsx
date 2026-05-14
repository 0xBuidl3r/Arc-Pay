"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/70 mb-2">
            {label}
          </label>
        )}
        <div
          className={`relative transition-all duration-200 ${isFocused ? "scale-[1.01]" : ""}`}
        >
          <input
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-white/30 
              transition-all duration-200 ${error ? "border-red-500/50" : isFocused ? "border-cyan-500/50 ring-2 ring-cyan-500/20" : "border-white/10"} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";