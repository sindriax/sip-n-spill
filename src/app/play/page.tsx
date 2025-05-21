"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import locales from "../../locales.json";

// Define the structure for a single rule to match locales.json
interface Rule {
  header: string;
  text: string;
}

type LocaleStrings = {
  pageTitle: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: Rule[]; // Updated to use the Rule interface
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
    if (questions.length === 0) return;

    setIsTipping(true);
    await cupControls.start("tip");
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % questions.length;
      setQuestionKey((prevKey) => {
        setIsTipping(false);
        return prevKey + 1;
      });
      return nextIndex;
    });
  }, [questions.length, cupControls]);

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setQuestionKey((prevKey) => prevKey + 1);
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full max-w-[150px] sm:max-w-[200px] mb-6"
        >
          <Image
            src="/assets/sippin.png"
            alt="Sip 'n Spill Logo Loading"
            width={200}
            height={200}
            className="w-full h-auto"
            priority
          />
        </motion.div>
        <p className="mt-4 text-lg sm:text-xl">
          {gameContent.loadingQuestions}
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-[180px] sm:max-w-[250px] mb-6">
          <Image
            src="/assets/sippin.png"
            alt="Sip 'n Spill Logo Error"
            width={250}
            height={150}
            className="w-full h-auto"
            priority
          />
        </div>
        <p className="mt-4 text-lg sm:text-xl">
          {gameContent.noQuestionsLoaded.replace("{lang}", lang)}
        </p>
        <button
          onClick={handleGoHome}
          className="mt-6 px-6 py-3 bg-amber-400 text-stone-800 font-semibold rounded-lg shadow-lg hover:bg-amber-300 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FDC03B]"
        >
          {gameContent.backToHome}
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen p-4 sm:p-6 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)] cursor-pointer"
      onClick={handleInteraction}
    >
      <main className="flex flex-col gap-6 items-center w-full px-2 sm:px-4 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-4 sm:p-6 bg-[#FF765D] text-white rounded-xl shadow-xl w-full max-w-md flex flex-col items-center gap-4 sm:gap-6"
        >
          <motion.div
            className="w-full max-w-[150px] sm:max-w-[200px]"
            variants={cupAnimationVariants}
            initial="initial"
            animate={cupControls}
          >
            <Image
              src={
                isTipping ? "/assets/sippindrippin.png" : "/assets/sippin.png"
              }
              alt="Sip 'n Spill Logo"
              width={200}
              height={120}
              className="w-full h-auto"
              priority
            />
          </motion.div>
          <h1 className="sr-only">Sip &apos;n Spill Game</h1>

          <div className="min-h-[80px] sm:min-h-[100px] flex flex-col justify-center items-center text-center w-full bg-[#ff937d] p-3 sm:p-4 rounded-lg shadow-inner">
            <AnimatePresence mode="wait">
              <motion.p
                key={questionKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl px-2"
              >
                {questions[currentQuestionIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full max-w-md justify-center">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{
              scale: 0.95,
              boxShadow: "0px 5px 10px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRestart();
            }}
            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-400 text-stone-800 font-semibold rounded-lg shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FDC03B] w-full sm:w-auto text-base sm:text-lg"
          >
            {gameContent.restartGame}
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{
              scale: 0.95,
              boxShadow: "0px 5px 10px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleGoHome();
            }}
            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-stone-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-[#FDC03B] w-full sm:w-auto text-base sm:text-lg"
          >
            {gameContent.backToHome}
          </motion.button>
        </div>
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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
          <div className="w-full max-w-[150px] sm:max-w-[200px] mb-6">
            <Image
              src="/assets/sippin.png"
              alt="Sip 'n Spill Logo Loading Settings"
              width={200}
              height={120}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="mt-4 text-lg sm:text-xl">
            {initialContent.loadingSettings}
          </p>
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}
