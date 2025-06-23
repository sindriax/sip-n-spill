"use client";

import { motion } from "framer-motion";

interface GameControlsProps {
  onGoNext: () => void;
  onGoHome: () => void;
  nextQuestionText: string;
  backToHomeText: string;
  isNextButtonDisabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onGoNext,
  onGoHome,
  nextQuestionText,
  backToHomeText,
  isNextButtonDisabled,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full max-w-md justify-center">
      <motion.button
        whileHover={{
          scale: 1.08,
          rotateZ: 1,
          boxShadow: "0px 15px 30px rgba(255, 147, 125, 0.4)",
          backgroundColor: "#ff8a65",
        }}
        whileTap={{
          scale: 0.92,
          rotateZ: -1,
          boxShadow: "0px 8px 15px rgba(255, 147, 125, 0.3)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onGoNext();
        }}
        className={`px-6 py-3 sm:px-8 sm:py-4 bg-[#FF765D] text-white font-bold rounded-2xl shadow-2xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-[#FDC03B] w-full sm:w-auto text-lg sm:text-xl transform hover:shadow-orange-500/25 ${
          isNextButtonDisabled ? "opacity-60 cursor-not-allowed grayscale" : ""
        }`}
        disabled={isNextButtonDisabled}
      >
        <span className="flex items-center justify-center gap-2">
          <span className="text-2xl">🍺</span>
          <span>{nextQuestionText}</span>
          <span className="text-xl">→</span>
        </span>
      </motion.button>
      <motion.button
        whileHover={{
          scale: 1.08,
          rotateZ: -1,
          boxShadow: "0px 15px 30px rgba(120, 113, 108, 0.4)",
          backgroundColor: "#57534e",
        }}
        whileTap={{
          scale: 0.92,
          rotateZ: 1,
          boxShadow: "0px 8px 15px rgba(120, 113, 108, 0.3)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onGoHome();
        }}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-stone-600 text-white font-bold rounded-2xl shadow-2xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-[#FDC03B] w-full sm:w-auto text-lg sm:text-xl transform hover:shadow-stone-500/25"
      >
        <span className="flex items-center justify-center gap-2">
          <span className="text-2xl">🏠</span>
          <span>{backToHomeText}</span>
        </span>
      </motion.button>
    </div>
  );
};

export default GameControls;
