"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image"; // Import the Next.js Image component
import locales from "../../locales.json"; // Import the locales

// Define a type for your locale strings for better type safety
type LocaleStrings = {
  pageTitle: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: string[];
  footerText: string;
  restartGame: string; // Added
  backToHome: string; // Added
  loadingQuestions: string; // Added
  noQuestionsLoaded: string; // Added
  loadingSettings: string; // Added
  tapToContinue: string; // Added
  questionProgress: string; // Added
};

// Define a type for the entire locales object
type Locales = {
  en: LocaleStrings;
  es: LocaleStrings;
  // Add other languages here if needed
};

const typedLocales: Locales = locales as Locales;

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const lang = searchParams.get("lang") || "es"; // Default to Spanish if no lang is provided
  const [gameContent, setGameContent] = useState<LocaleStrings>(
    typedLocales[lang as keyof Locales] || typedLocales.es
  );

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setGameContent(typedLocales[lang as keyof Locales] || typedLocales.es); // Update content based on lang
      try {
        // Dynamically import the questions file based on the lang parameter
        const questionsModule = await import(`../../questions_${lang}.json`);
        const loadedQuestions = Array.isArray(questionsModule.default)
          ? questionsModule.default
          : [];
        setQuestions(shuffleArray(loadedQuestions)); // Shuffle questions here
      } catch (error) {
        console.error(`Failed to load questions for language: ${lang}`, error);
        // Fallback to default Spanish questions if the selected language file doesn't exist or fails to load
        try {
          const fallbackQuestionsModule = await import(
            "../../questions_es.json"
          );
          const fallbackLoadedQuestions = Array.isArray(
            fallbackQuestionsModule.default
          )
            ? fallbackQuestionsModule.default
            : [];
          setQuestions(shuffleArray(fallbackLoadedQuestions)); // Shuffle fallback questions too
          console.warn("Loaded and shuffled fallback Spanish questions.");
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
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-[200px] sm:max-w-[250px] mb-8">
          <Image
            src="/assets/sip.png"
            alt="Sip 'n Spill Logo"
            width={500}
            height={300}
            layout="responsive"
            priority
          />
        </div>
        <p className="mt-4 text-xl">{gameContent.loadingQuestions}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-[200px] sm:max-w-[250px] mb-8">
          <Image
            src="/assets/sip.png"
            alt="Sip 'n Spill Logo"
            width={500}
            height={300}
            layout="responsive"
            priority
          />
        </div>
        <p className="mt-4 text-xl">
          {gameContent.noQuestionsLoaded.replace("{lang}", lang)}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen p-8 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)] cursor-pointer"
      onClick={handleInteraction}
    >
      <main className="flex flex-col gap-8 items-center w-full px-4 mt-auto mb-auto">
        {/* Main content card: Logo and Question */}
        <div className="p-6 bg-[#FF765D] text-white rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="w-full max-w-[200px] sm:max-w-[250px]">
            <Image
              src="/assets/sip.png" // Path to your logo in the public folder
              alt="Sip 'n Spill Logo" // Alt text for the logo
              width={500} // Specify a base width for the image
              height={300} // Specify a base height for the image
              layout="responsive" // Make the image responsive
              priority // Prioritize loading the logo
            />
          </div>
          {/* Visually hidden h1 for SEO and accessibility */}
          <h1 className="sr-only">Sip &apos;n Spill Game</h1>

          {/* Question Text Area */}
          <div className="min-h-[100px] flex flex-col justify-center items-center text-center">
            <p className="text-2xl">{questions[currentQuestionIndex]}</p>
          </div>
        </div>

        {/* Buttons container */}
        <div className="flex gap-4 mt-4 w-full justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestart();
            }} // Added stopPropagation
            className="px-6 py-3 bg-amber-400 text-stone-800 font-semibold rounded-lg shadow-md hover:bg-amber-300 transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FF765D] w-full sm:w-auto" // Adjusted ring offset and width
          >
            {gameContent.restartGame}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGoHome();
            }} // Added stopPropagation
            className="px-6 py-3 bg-stone-700 text-white font-semibold rounded-lg shadow-md hover:bg-stone-600 transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-[#FF765D] w-full sm:w-auto" // Adjusted ring offset, text color, and width
          >
            {gameContent.backToHome}
          </button>
        </div>
      </main>
      <footer className="w-full mt-6 sm:mt-8 text-sm text-stone-700 p-4 text-center">
        <p>{gameContent.tapToContinue}</p>
        <p>
          {gameContent.questionProgress
            .replace("{current}", (currentQuestionIndex + 1).toString())
            .replace("{total}", questions.length.toString())}
        </p>
      </footer>
    </div>
  );
}

// Wrap GameContent with Suspense for useSearchParams
export default function GamePage() {
  // Determine initial language for Suspense fallback text
  // This is a bit of a workaround as Suspense fallback doesn't have access to URL params directly
  // It will show English by default or Spanish if that's the only/primary expected non-English lang.
  // A more robust solution might involve a global state or context for language.
  const initialLang =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("lang") || "es"
      : "es";
  const initialContent =
    typedLocales[initialLang as keyof Locales] || typedLocales.es;

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
          <div className="w-full max-w-[200px] sm:max-w-[250px] mb-8">
            <Image
              src="/assets/sip.png"
              alt="Sip 'n Spill Logo"
              width={500}
              height={300}
              layout="responsive"
              priority
            />
          </div>
          <p className="mt-4 text-xl">{initialContent.loadingSettings}</p>
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}
