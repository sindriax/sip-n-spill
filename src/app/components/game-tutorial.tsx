"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TutorialStep {
  title: string;
  description: string;
  visual?: string;
}

interface GameTutorialProps {
  onSkipTutorial: () => void;
  onCompleteTutorial: () => void;
  skipText: string;
  nextText: string;
  prevText: string;
  finishText: string;
  tutorialTitle: string;
  tutorialSteps: TutorialStep[];
}

export default function GameTutorial({
  onSkipTutorial,
  onCompleteTutorial,
  skipText,
  nextText,
  prevText,
  finishText,
  tutorialTitle,
  tutorialSteps,
}: GameTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteTutorial();
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:gap-6 w-full max-w-md text-center px-2"
    >
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{tutorialTitle}</h2>
        <button
          onClick={onSkipTutorial}
          className="px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-white/20 active:bg-white/30 transition-all touch-manipulation flex-shrink-0"
        >
          {skipText}
        </button>
      </div>

      <div className="bg-[#260046] rounded-lg p-4 sm:p-6 min-h-[280px] sm:min-h-[300px] flex flex-col justify-center border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center px-2"
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
              {tutorialSteps[currentStep].visual}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              {tutorialSteps[currentStep].title}
            </h3>
            <p className="text-sm sm:text-base text-white leading-relaxed">
              {tutorialSteps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center relative min-h-[44px] gap-2">
        <div className="absolute left-0">
          {!isFirstStep && (
            <button
              onClick={goToPrev}
              className="px-3 sm:px-4 py-1.5 sm:py-2 gradient-neon-pink text-white rounded-lg text-sm sm:text-base font-semibold hover:scale-105 active:scale-95 transition-all duration-150 touch-manipulation"
            >
              {prevText}
            </button>
          )}
        </div>

        <div className="flex gap-1.5 sm:gap-2 mx-auto">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-white shadow-lg glow-gold"
                  : "bg-white bg-opacity-20 border border-white border-opacity-30"
              }`}
            />
          ))}
        </div>

        <div className="absolute right-0">
          <button
            onClick={goToNext}
            className="px-3 sm:px-4 py-1.5 sm:py-2 gradient-gold-shine text-stone-800 rounded-lg text-sm sm:text-base font-semibold hover:scale-105 active:scale-95 transition-all duration-150 glow-gold touch-manipulation"
          >
            {isLastStep ? finishText : nextText}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
