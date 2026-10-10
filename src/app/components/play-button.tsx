"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PlayButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export default function PlayButton({ label, disabled = false, onClick, className = "" }: PlayButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`gradient-gold-shine rounded-[22px] py-2 px-4 border-2 border-white/40 glow-gold transition-opacity disabled:opacity-40 disabled:shadow-none ${className}`}
    >
      <Image src="/assets/lets-play.png" alt="" width={140} height={58} className="w-full h-auto" priority />
    </motion.button>
  );
}
