"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface StartGameButtonProps {
  onClick: () => void;
  label: string;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({
  onClick,
  label,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className="relative w-full px-6 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-stone-800 font-bold rounded-xl text-lg shadow-lg overflow-hidden active:shadow-xl"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{
        touchAction: "manipulation",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12"
        initial={{ x: "-100%" }}
        animate={{
          x: isPressed ? "100%" : "-100%",
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300 to-amber-300"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {label}
        <motion.span
          className="text-xl"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🍻
        </motion.span>
      </span>

      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 blur-sm"
        animate={{
          opacity: isPressed ? 0.3 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </motion.button>
  );
};

export default StartGameButton;
