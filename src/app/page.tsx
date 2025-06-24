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
    <div className="flex flex-col items-center justify-between min-h-screen p-4 text-center bg-[#FDC03B] font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col gap-4 items-center bg-[#FF765D] text-white p-6 md:p-10 rounded-lg shadow-2xl max-w-md w-full my-auto hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-300 ease-out"
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
            <button
              onClick={handleShowTutorial}
              className="w-full py-3 px-4 bg-[#FF9D89] text-white rounded-lg font-semibold hover:bg-[#FF8A73] transition-colors"
            >
              {content.showTutorial}
            </button>
          </>
        )}
      </motion.main>

      <Footer footerText={content.footerText} />
    </div>
  );
}
