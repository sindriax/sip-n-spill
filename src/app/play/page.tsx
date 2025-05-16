"use client";

import { useState, useEffect } from "react";
// Ensure your tsconfig.json has "resolveJsonModule": true under compilerOptions
import questionsData from "../../questions.json";

// Explicitly type the imported questions
const questions: string[] = Array.isArray(questionsData) ? questionsData : [];

export default function GamePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleInteraction = () => {
    if (questions.length === 0) return; // Don't do anything if there are no questions
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  // Handle keyboard events for spacebar and enter
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === "Enter") {
        handleInteraction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold">Sip &apos;n Spill</h1>
        <p className="mt-4 text-xl">
          No questions loaded. Please check the questions file.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-8 text-center font-[family-name:var(--font-geist-sans)] cursor-pointer"
      onClick={handleInteraction} // Added onClick for tap functionality
    >
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-bold">Sip &apos;n Spill</h1>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[200px] flex flex-col justify-center items-center w-full max-w-md">
          <p className="text-2xl">{questions[currentQuestionIndex]}</p>
        </div>
      </main>
      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Tap the screen or press Space/Enter to continue.</p>
        <p>
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </footer>
    </div>
  );
}
