"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const lang = searchParams.get("lang") || "es"; // Default to Spanish if no lang is provided

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        // Dynamically import the questions file based on the lang parameter
        const questionsModule = await import(`../../questions_${lang}.json`);
        setQuestions(
          Array.isArray(questionsModule.default) ? questionsModule.default : []
        );
      } catch (error) {
        console.error(`Failed to load questions for language: ${lang}`, error);
        // Fallback to default Spanish questions if the selected language file doesn't exist or fails to load
        try {
          const fallbackQuestionsModule = await import(
            "../../questions_es.json"
          );
          setQuestions(
            Array.isArray(fallbackQuestionsModule.default)
              ? fallbackQuestionsModule.default
              : []
          );
          console.warn("Loaded fallback Spanish questions.");
        } catch (fallbackError) {
          console.error(
            "Failed to load fallback Spanish questions:",
            fallbackError
          );
          setQuestions([]); // Set to empty if fallback also fails
        }
      }
      setIsLoading(false);
    };

    loadQuestions();
  }, [lang]);

  const handleInteraction = useCallback(() => {
    // Wrapped with useCallback
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  }, [questions.length]); // Dependency is questions.length

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
  };

  const handleGoHome = () => {
    router.push("/");
  };

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
  }, [handleInteraction]); // Dependency is now handleInteraction

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-rose-500 text-orange-50 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold">Sip &apos;n Spill</h1>
        <p className="mt-4 text-xl">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-rose-500 text-orange-50 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold">Sip &apos;n Spill</h1>
        <p className="mt-4 text-xl">
          No questions loaded. Please check the questions file for the selected
          language ({lang}).
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-rose-500 text-orange-50 font-[family-name:var(--font-geist-sans)] cursor-pointer"
      onClick={handleInteraction}
    >
      <main className="flex flex-col gap-8 items-center w-full px-4">
        <h1 className="text-4xl font-bold text-orange-50">Sip &apos;n Spill</h1>
        <div className="p-6 bg-orange-50 text-rose-700 rounded-lg shadow-md min-h-[200px] flex flex-col justify-center items-center w-full max-w-md">
          <p className="text-2xl">{questions[currentQuestionIndex]}</p>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-amber-400 text-stone-800 font-semibold rounded-lg shadow-md hover:bg-amber-300 transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-rose-500"
          >
            Restart
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-stone-700 text-orange-50 font-semibold rounded-lg shadow-md hover:bg-stone-600 transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-rose-500"
          >
            Back to Home
          </button>
        </div>
      </main>
      <footer className="mt-8 text-sm text-orange-100">
        <p>Tap the screen or press Space/Enter to continue.</p>
        <p>
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </footer>
    </div>
  );
}

// Wrap GameContent with Suspense for useSearchParams
export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading language settings...</div>}>
      <GameContent />
    </Suspense>
  );
}
