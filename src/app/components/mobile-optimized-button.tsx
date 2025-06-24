"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface MobileOptimizedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

const MobileOptimizedButton: React.FC<MobileOptimizedButtonProps> = ({
  onClick,
  children,
  className = "",
  variant = "secondary",
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses =
    "relative w-full py-3 px-4 font-semibold rounded-xl overflow-hidden active:shadow-lg";
  const variantClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-stone-800"
      : "bg-gradient-to-r from-[#FF9D89] to-[#FFB199] text-white";

  return (
    <motion.button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{
        touchAction: "manipulation",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
        initial={{ x: "-100%" }}
        animate={{
          x: isPressed ? "100%" : "-100%",
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      />

      <motion.div
        className={`absolute inset-0 rounded-xl ${
          variant === "primary"
            ? "bg-gradient-to-r from-yellow-300 to-amber-300"
            : "bg-gradient-to-r from-[#FFB199] to-[#FFC4B2]"
        }`}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <span className="relative z-10">{children}</span>

      <motion.div
        className={`absolute inset-0 rounded-xl blur-sm ${
          variant === "primary"
            ? "bg-gradient-to-r from-amber-400 to-yellow-400"
            : "bg-gradient-to-r from-[#FF9D89] to-[#FFB199]"
        }`}
        animate={{
          opacity: isPressed ? 0.4 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </motion.button>
  );
};

export default MobileOptimizedButton;
