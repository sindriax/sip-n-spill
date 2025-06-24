"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import locales from "./lib/locales.json";
import Footer from "./components/footer";
import HeaderLogo from "./components/header-logo";
import IntroSection from "./components/intro-section";
import StartGameButton from "./components/start-game-button";
import GameTutorial from "./components/game-tutorial";
import FloatingParticles from "./components/floating-particles";
import MobileOptimizedButton from "./components/mobile-optimized-button";

type LocaleStrings = {
  pageTitle: string;
  pageDescription: string;
  selectLanguage: string;
  startGame: string;
  footerText: string;
  tutorialTitle: string;
  skipTutorial: string;
  nextStep: string;
  prevStep: string;
  finishTutorial: string;
  showTutorial: string;
  tutorialSteps: Array<{
    title: string;
    description: string;
    visual?: string;
  }>;
};

type Locales = {
  en: LocaleStrings;
  es: LocaleStrings;
};

const typedLocales: Locales = locales as Locales;

export default function HomePage() {
  const [language, setLanguage] = useState("en");
  const [content, setContent] = useState<LocaleStrings>(typedLocales.en);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLogoAnimating, setIsLogoAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setContent(typedLocales[language as keyof Locales] || typedLocales.en);
    }
  }, [language, mounted]);

  const handleLanguageSelect = (selectedLang: string) => {
    setLanguage(selectedLang);
  };

  const handleStartGame = () => {
    setIsLogoAnimating(true);
    setTimeout(() => {
      router.push(`/play?lang=${language}`);
    }, 700);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    handleStartGame();
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen p-4 text-center bg-gradient-to-br from-[#FDC03B] via-[#FFD15E] to-[#FFDE7A] font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticles />
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF765D] rounded-full opacity-15"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#FF9D89] rounded-full opacity-20"
          animate={{
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex flex-col gap-4 items-center bg-gradient-to-b from-[#FF765D] to-[#FF6B50] text-white p-6 rounded-2xl shadow-2xl max-w-md w-full my-auto border-2 border-white/20 backdrop-blur-sm"
        whileTap={{ scale: 0.98 }}
      >
        {showTutorial ? (
          <GameTutorial
            onSkipTutorial={handleSkipTutorial}
            onCompleteTutorial={handleCompleteTutorial}
            skipText={content.skipTutorial}
            nextText={content.nextStep}
            prevText={content.prevStep}
            finishText={content.finishTutorial}
            tutorialTitle={content.tutorialTitle}
            tutorialSteps={content.tutorialSteps}
          />
        ) : (
          <>
            <HeaderLogo
              altText={content.pageTitle}
              isAnimating={isLogoAnimating}
            />
            <IntroSection
              pageDescription={content.pageDescription}
              currentLanguage={language}
              onLanguageChange={handleLanguageSelect}
              selectLanguageLabel={content.selectLanguage}
            />
            <StartGameButton
              onClick={handleStartGame}
              label={content.startGame}
            />
            <MobileOptimizedButton
              onClick={handleShowTutorial}
              variant="secondary"
            >
              <span className="flex items-center justify-center gap-2">
                {content.showTutorial}
                <span className="text-sm">📖</span>
              </span>
            </MobileOptimizedButton>
          </>
        )}
      </motion.main>

      <Footer footerText={content.footerText} />
    </div>
  );
}
