"use client";

import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import Image from "next/image";
import locales from "../lib/locales.json";
import GameLoadingIndicator from "../components/game-loading-indicator";
import GameErrorDisplay from "../components/game-error-display";
import QuestionDisplay from "../components/question-display";
import RulesSection from "../components/rules-section";
import GradientBackground from "../components/gradient-background";

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
  nextQuestion: string;
  backToHome: string;
  loadingQuestions: string;
  noQuestionsLoaded: string;
  loadingSettings: string;
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
  const categories = searchParams.get("categories") || searchParams.get("category") || "spicy";
  const mode = searchParams.get("mode");
  const playersParam = searchParams.get("players");
  const players = useMemo(() => {
    if (!playersParam) return [];
    try {
      const parsed = JSON.parse(decodeURIComponent(playersParam));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [playersParam]);
  const [gameContent, setGameContent] = useState<LocaleStrings>(
    typedLocales[lang as keyof Locales] || typedLocales.es
  );
  const cupControls = useAnimation();
  const [isTipping, setIsTipping] = useState(false);

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [questionKey, setQuestionKey] = useState(0);
  const [currentTargetPlayer, setCurrentTargetPlayer] = useState<string>("");
  const [showRules, setShowRules] = useState(false);

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
        let apiUrl = `/api/questions?lang=${lang}`;
        if (mode === "hotseat") {
          apiUrl += `&mode=hotseat`;
        } else {
          apiUrl += `&categories=${categories}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();
        const loadedQuestions = Array.isArray(data.questions)
          ? data.questions
          : [];
        setQuestions(shuffleArray(loadedQuestions));
        setQuestionKey((prevKey) => prevKey + 1);
        if (mode === "hotseat" && players.length > 0) {
          setCurrentTargetPlayer(players[Math.floor(Math.random() * players.length)]);
        }
      } catch (error) {
        console.error(`Failed to load questions for language: ${lang}, categories: ${categories}`, error);
        try {
          let fallbackUrl = `/api/questions?lang=es`;
          if (mode === "hotseat") {
            fallbackUrl += `&mode=hotseat`;
          } else {
            fallbackUrl += `&categories=${categories}`;
          }
          const fallbackResponse = await fetch(fallbackUrl);
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
          if (mode === "hotseat" && players.length > 0) {
            setCurrentTargetPlayer(players[Math.floor(Math.random() * players.length)]);
          }
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
  }, [lang, categories, mode, players]);

  const getCurrentQuestion = useCallback(() => {
    if (questions.length === 0) return "";
    const question = questions[currentQuestionIndex];
    if (mode === "hotseat" && currentTargetPlayer) {
      return question.replaceAll("{player}", currentTargetPlayer);
    }
    return question;
  }, [questions, currentQuestionIndex, mode, currentTargetPlayer]);

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
    if (mode === "hotseat" && players.length > 0) {
      setCurrentTargetPlayer(players[Math.floor(Math.random() * players.length)]);
    }
    await cupControls.start("initial");
    setIsTipping(false);
  }, [questions.length, cupControls, isTipping, mode, players]);

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
              {mode === "hotseat" && currentTargetPlayer
                ? `🎯 ${currentTargetPlayer}`
                : gameContent.pageTitle
              }
            </p>
            <p className="text-sm font-medium text-white/80">
              {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRules(true);
            }}
            className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Show rules"
          >
            <Image
              src="/assets/qs.png"
              alt="Help"
              width={40}
              height={40}
              className="object-contain max-w-[28px] max-h-[28px]"
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
            question={getCurrentQuestion()}
            questionKey={questionKey}
          />
        </div>
        <RulesSection
          gameRulesTitle={gameContent.gameRulesTitle}
          rules={gameContent.rules}
          isOpen={showRules}
          onClose={() => setShowRules(false)}
        />
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
