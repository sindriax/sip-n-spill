"use client";

import { motion, AnimatePresence, AnimationControls } from "framer-motion";
import { useState, useEffect } from "react";

interface QuestionDisplayProps {
  question: string;
  questionKey: number;
  isTipping: boolean;
  cupControls: AnimationControls;
  cupAnimationVariants: {
    initial: { rotate: number; x: number; y: number };
    tip: {
      rotate: number[];
      x: number[];
      y: number[];
      transition: { duration: number; ease: string };
    };
  };
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionKey,
}) => {
  const [displayedQuestion, setDisplayedQuestion] = useState(question);
  const [flipRotation, setFlipRotation] = useState(0);

  useEffect(() => {
    setFlipRotation(90);
    const timer = setTimeout(() => {
      setDisplayedQuestion(question);
      setFlipRotation(0);
    }, 150);
    return () => clearTimeout(timer);
  }, [question]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: flipRotation
      }}
      transition={{ duration: 0.15 }}
      className="w-full h-full max-h-[75vh] sm:max-h-[70vh] flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.98 }}
        className="w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] h-full max-h-[600px] sm:max-h-[650px] gradient-pink-orange rounded-[24px] sm:rounded-[32px] p-3 sm:p-4 shadow-2xl"
        style={{
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(76, 0, 115, 0.8)"
        }}
      >
        <div className="relative w-full h-full border-[2px] sm:border-[3px] border-white/60 rounded-[20px] sm:rounded-3xl p-6 sm:p-8 flex items-center justify-center bg-white/5">
          <div className="absolute top-2 left-2 text-[20px] sm:text-[24px] md:text-[28px] opacity-85">🍸</div>
          <div className="absolute top-2 right-2 text-[20px] sm:text-[24px] md:text-[28px] opacity-85 scale-x-[-1]">
            🍸
          </div>
          <div
            className="absolute bottom-2 left-2 text-[20px] sm:text-[24px] md:text-[28px] opacity-85"
            style={{ transform: "rotate(180deg)" }}
          >
            🍸
          </div>
          <div
            className="absolute bottom-2 right-2 text-[20px] sm:text-[24px] md:text-[28px] opacity-85"
            style={{ transform: "rotate(180deg) scaleX(-1)" }}
          >
            🍸
          </div>

          <div className="flex-1 flex items-center justify-center py-6 sm:py-8 overflow-y-auto max-h-full">
            <AnimatePresence mode="wait">
              <motion.p
                key={questionKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center leading-[1.3] sm:leading-[1.35] px-2 sm:px-4"
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {displayedQuestion}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionDisplay;
