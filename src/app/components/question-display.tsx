"use client";

import { motion, AnimatePresence } from "framer-motion";

interface QuestionDisplayProps {
  question: string;
  questionKey: number;
}

const CORNERS = ["top-2 left-2", "top-2 right-2 -scale-x-100", "bottom-2 left-2 rotate-180", "bottom-2 right-2 rotate-180 -scale-x-100"];

export default function QuestionDisplay({ question, questionKey }: QuestionDisplayProps) {
  return (
    <div className="w-full h-[62vh] max-h-[640px] flex items-center justify-center" style={{ perspective: "1000px" }}>
      <AnimatePresence mode="wait">
        <motion.article
          key={questionKey}
          initial={{ opacity: 0, rotateY: 70, scale: 0.96 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: -70, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full max-w-[420px] h-full gradient-pink-orange rounded-[32px] p-4"
          style={{ boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(76, 0, 115, 0.8)" }}
        >
          <div className="relative w-full h-full border-[3px] border-white/60 rounded-3xl px-6 py-10 flex flex-col items-center justify-center gap-3 bg-white/5">
            {CORNERS.map((corner) => (
              <span key={corner} aria-hidden="true" className={`absolute ${corner} text-[26px] opacity-85`}>
                🍸
              </span>
            ))}
            <p className="text-[clamp(1.5rem,6vw,2rem)] font-extrabold text-white text-center leading-[1.25]" style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.15)" }}>
              {question}
            </p>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
