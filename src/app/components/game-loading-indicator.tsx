"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface GameLoadingIndicatorProps {
  loadingText: string;
  imageSrc?: string;
  altText?: string;
}

const GameLoadingIndicator: React.FC<GameLoadingIndicatorProps> = ({
  loadingText,
  imageSrc = "/assets/sippin.png",
  altText = "Sip 'n Spill Logo Loading",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-full max-w-[150px] sm:max-w-[200px] mb-6"
      >
        <Image
          src={imageSrc}
          alt={altText}
          width={200}
          height={200}
          className="w-full h-auto"
          priority
        />
      </motion.div>
      <p className="mt-4 text-lg sm:text-xl">{loadingText}</p>
    </div>
  );
};

export default GameLoadingIndicator;
