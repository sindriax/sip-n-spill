"use client";

import Image from "next/image";
import { motion, AnimatePresence, AnimationControls } from "framer-motion";

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
  isTipping,
  cupControls,
  cupAnimationVariants,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-3 sm:p-6 bg-[#FF765D] text-white rounded-xl shadow-xl w-full max-w-md flex flex-col items-center gap-3 sm:gap-6"
    >
      <motion.div
        className="w-full max-w-[150px] sm:max-w-[200px]"
        variants={cupAnimationVariants}
        initial="initial"
        animate={cupControls}
      >
        <Image
          src={isTipping ? "/assets/sippindrippin.png" : "/assets/sippin.png"}
          alt="Sip 'n Spill Logo"
          width={200}
          height={120}
          className="w-full h-auto"
          priority
        />
      </motion.div>
      <h1 className="sr-only">Sip &apos;n Spill Game</h1>
      <div className="min-h-[120px] sm:min-h-[160px] max-h-[180px] sm:max-h-[200px] flex flex-col justify-center items-center text-center w-full bg-[#ff937d] p-3 sm:p-4 rounded-lg shadow-inner overflow-y-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          <motion.p
            key={questionKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl lg:text-2xl px-2 leading-relaxed"
          >
            {question}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionDisplay;
