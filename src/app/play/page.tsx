"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import Image from "next/image";
import locales from "../lib/locales.json";
import GameLoadingIndicator from "../components/game-loading-indicator";
import GameErrorDisplay from "../components/game-error-display";
import QuestionDisplay from "../components/question-display";
import GradientBackground from "../components/gradient-background";
import GameTutorial from "../components/game-tutorial";

interface Rule {
  header: string;
  text: string;
}

interface TutorialStep {
  title: string;
  description: string;
  visual?: string;
}

type LocaleStrings = {
  pageTitle: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: Rule[];
  footerText: string;
  nextQuestion: string;
  backToHome: string;
  loadingQuestions: string;
  noQuestionsLoaded: string;
  loadingSettings: string;
  questionProgress: string;
  tutorialTitle: string;
  skipTutorial: string;
  nextStep: string;
  prevStep: string;
  finishTutorial: string;
  showTutorial: string;
  tutorialSteps: TutorialStep[];
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
  const [showTutorial, setShowTutorial] = useState(false);

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

  const progress = questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  if (showTutorial) {
    return (
      <GradientBackground withSparkles>
        <div className="flex flex-col min-h-screen text-white font-[family-name:var(--font-geist-sans)] items-center justify-center px-6">
          <GameTutorial
            onSkipTutorial={() => setShowTutorial(false)}
            onCompleteTutorial={() => setShowTutorial(false)}
            skipText={gameContent.skipTutorial}
            nextText={gameContent.nextStep}
            prevText={gameContent.prevStep}
            finishText={gameContent.finishTutorial}
            tutorialTitle={gameContent.tutorialTitle}
            tutorialSteps={gameContent.tutorialSteps}
          />
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground withSparkles>
      <div className="flex flex-col min-h-screen text-white font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center justify-between px-6 pt-12 pb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGoHome();
            }}
            className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Go back"
          >
            <Image
              src="/assets/sippin.png"
              alt="Back"
              width={40}
              height={40}
              className="object-contain"
            />
          </button>

          <div className="flex-1 flex flex-col items-center gap-1">
            <p className="text-lg font-bold text-white text-center">
              {gameContent.pageTitle}
            </p>
            <p className="text-sm font-medium text-white/80">
              {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTutorial(true);
            }}
            className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Show tutorial"
          >
            <Image
              src="/assets/qs.png"
              alt="Help"
              width={28}
              height={28}
              className="object-contain"
            />
          </button>
        </div>

        <div className="px-6 pb-4">
          <div className="h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className="flex-1 flex items-center justify-center px-6 cursor-pointer"
          onClick={handleInteraction}
        >
          <QuestionDisplay
            question={questions[currentQuestionIndex]}
            questionKey={questionKey}
            isTipping={isTipping}
            cupControls={cupControls}
            cupAnimationVariants={cupAnimationVariants}
          />
        </div>
      </div>
    </GradientBackground>
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
