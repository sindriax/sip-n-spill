"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import locales from "../../locales.json";

type LocaleStrings = {
  pageTitle: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: string[];
  footerText: string;
  restartGame: string;
  backToHome: string;
  loadingQuestions: string;
  noQuestionsLoaded: string;
  loadingSettings: string;
  tapToContinue: string;
  questionProgress: string;
};

type Locales = {
  en: LocaleStrings;
  es: LocaleStrings;
};

const typedLocales: Locales = locales as Locales;

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "es";
  const [gameContent, setGameContent] = useState<LocaleStrings>(
    typedLocales[lang as keyof Locales] || typedLocales.es
  );

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      setGameContent(typedLocales[lang as keyof Locales] || typedLocales.es);
      try {
        const response = await fetch(`/api/questions?lang=${lang}`);
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();
        const loadedQuestions = Array.isArray(data.questions)
          ? data.questions
          : [];
        setQuestions(shuffleArray(loadedQuestions));
      } catch (error) {
        console.error(`Failed to load questions for language: ${lang}`, error);
        try {
          // Fallback to Spanish questions via API
          const fallbackResponse = await fetch("/api/questions?lang=es");
          if (!fallbackResponse.ok) {
            throw new Error(
              `Fallback API responded with status ${fallbackResponse.status}`
            );
          }
          const fallbackData = await fallbackResponse.json();
          const fallbackLoadedQuestions = Array.isArray(fallbackData.questions)
            ? fallbackData.questions
            : [];
          setQuestions(shuffleArray(fallbackLoadedQuestions));
          console.warn(
            "Loaded and shuffled fallback Spanish questions from API."
          );
        } catch (fallbackError) {
          console.error(
            "Failed to load fallback Spanish questions from API:",
            fallbackError
          );
          setQuestions([]);
        }
      }
      setIsLoading(false);
    };

    loadQuestions();
  }, [lang]);

  const handleInteraction = useCallback(() => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  }, [questions.length]);

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
  }, [handleInteraction]);

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
        <div className="p-6 bg-[#FF765D] text-white rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="w-full max-w-[200px] sm:max-w-[250px]">
            <Image
              src="/assets/sip.png"
              alt="Sip 'n Spill Logo"
              width={500}
              height={300}
              layout="responsive"
              priority
            />
          </div>
          <h1 className="sr-only">Sip &apos;n Spill Game</h1>

          <div className="min-h-[100px] flex flex-col justify-center items-center text-center">
            <p className="text-2xl">{questions[currentQuestionIndex]}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4 w-full justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestart();
            }}
            className="px-6 py-3 bg-amber-400 text-stone-800 font-semibold rounded-lg shadow-md hover:bg-amber-300 transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FF765D] w-full sm:w-auto" // Adjusted ring offset and width
          >
            {gameContent.restartGame}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGoHome();
            }}
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

export default function GamePage() {
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
