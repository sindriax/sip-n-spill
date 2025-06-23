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
          scale: 1.05,
          boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
        }}
        whileTap={{
          scale: 0.95,
          boxShadow: "0px 5px 10px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onGoNext();
        }}
        className={`px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-400 text-stone-800 font-semibold rounded-lg shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FDC03B] w-full sm:w-auto text-base sm:text-lg ${
          isNextButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isNextButtonDisabled}
      >
        {nextQuestionText}
      </motion.button>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
        }}
        whileTap={{
          scale: 0.95,
          boxShadow: "0px 5px 10px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onGoHome();
        }}
        className="px-5 py-2.5 sm:px-6 sm:py-3 bg-stone-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-[#FDC03B] w-full sm:w-auto text-base sm:text-lg"
      >
        {backToHomeText}
      </motion.button>
    </div>
  );
};

export default GameControls;
