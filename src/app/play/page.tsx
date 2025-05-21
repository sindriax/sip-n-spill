"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import locales from "../../locales.json";
import GameLoadingIndicator from "../components/game-loading-indicator";
import GameErrorDisplay from "../components/game-error-display";
import QuestionDisplay from "../components/question-display";
import GameControls from "../components/game-controls";

interface Rule {
  header: string;
  text: string;
}

type LocaleStrings = {
  pageTitle: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: Rule[];
  footerText: string;
  previousQuestion: string;
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

const cupAnimationVariants = {
  initial: { rotate: 0, x: 0, y: 0 },
  tip: {
    rotate: [0, 15, 0],
    x: [0, 5, 0],
    y: [0, -2, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "es";
  const [gameContent, setGameContent] = useState<LocaleStrings>(
    typedLocales[lang as keyof Locales] || typedLocales.es
  );
  const cupControls = useAnimation();
  const [isTipping, setIsTipping] = useState(false);

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [questionKey, setQuestionKey] = useState(0);

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
        setQuestionKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error(`Failed to load questions for language: ${lang}`, error);
        try {
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
          setQuestionKey((prevKey) => prevKey + 1);
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

  const handleInteraction = useCallback(async () => {
    if (questions.length === 0 || isTipping) return;

    setIsTipping(true);
    await cupControls.start("tip");
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % questions.length;
      setQuestionKey((prevKey) => {
        return prevKey + 1;
      });
      return nextIndex;
    });
    await cupControls.start("initial");
    setIsTipping(false);
  }, [questions.length, cupControls, isTipping]);

  const handleGoBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setQuestionKey((prevKey) => prevKey + 1);
    }
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
    return <GameLoadingIndicator loadingText={gameContent.loadingQuestions} />;
  }

  if (questions.length === 0) {
    return (
      <GameErrorDisplay
        errorMessage={gameContent.noQuestionsLoaded.replace("{lang}", lang)}
        onGoHome={handleGoHome}
        goHomeText={gameContent.backToHome}
      />
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen p-4 sm:p-6 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)] cursor-pointer"
      onClick={handleInteraction}
    >
      <main className="flex flex-col gap-6 items-center w-full px-2 sm:px-4 my-auto">
        <QuestionDisplay
          question={questions[currentQuestionIndex]}
          questionKey={questionKey}
          isTipping={isTipping}
          cupControls={cupControls}
          cupAnimationVariants={cupAnimationVariants}
        />
        <GameControls
          onGoBack={handleGoBack}
          onGoHome={handleGoHome}
          previousQuestionText={gameContent.previousQuestion}
          backToHomeText={gameContent.backToHome}
          isBackButtonDisabled={currentQuestionIndex === 0}
        />
      </main>
      <footer className="w-full mt-4 sm:mt-6 text-xs sm:text-sm text-stone-700 p-3 sm:p-4 text-center">
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
        <GameLoadingIndicator
          loadingText={initialContent.loadingSettings}
          altText="Sip 'n Spill Logo Loading Settings"
        />
      }
    >
      <GameContent />
    </Suspense>
  );
}
