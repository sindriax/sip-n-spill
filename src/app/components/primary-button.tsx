"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";

type PrimaryButtonProps = ComponentProps<typeof motion.button>;

export default function PrimaryButton({ className = "", disabled, children, ...props }: PrimaryButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      disabled={disabled}
      className={`gradient-gold-shine text-stone-900 text-xl font-extrabold rounded-2xl py-4 px-8 border-2 border-white/40 glow-gold transition-opacity disabled:opacity-40 disabled:shadow-none ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
