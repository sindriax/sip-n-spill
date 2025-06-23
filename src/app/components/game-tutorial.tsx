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
      className="flex flex-col gap-6 w-full max-w-md text-center"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{tutorialTitle}</h2>
        <button
          onClick={onSkipTutorial}
          className="px-3 py-1 bg-[#FF9D89] bg-opacity-20 text-white rounded-full text-sm font-medium hover:bg-opacity-30 transition-all"
        >
          {skipText}
        </button>
      </div>

      <div className="bg-[#FF9D89] rounded-lg p-6 min-h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">
              {tutorialSteps[currentStep].visual}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              {tutorialSteps[currentStep].title}
            </h3>
            <p className="text-white leading-relaxed">
              {tutorialSteps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center relative min-h-[44px]">
        <div className="absolute left-0">
          {!isFirstStep && (
            <button
              onClick={goToPrev}
              className="px-4 py-2 bg-[#FF9D89] text-white rounded-lg font-semibold hover:bg-[#FF8A73] transition-colors"
            >
              {prevText}
            </button>
          )}
        </div>

        <div className="flex gap-2 mx-auto">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-white shadow-lg"
                  : "bg-white bg-opacity-20 border border-white border-opacity-30"
              }`}
            />
          ))}
        </div>

        <div className="absolute right-0">
          <button
            onClick={goToNext}
            className="px-4 py-2 bg-[#FDC03B] text-stone-800 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            {isLastStep ? finishText : nextText}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
