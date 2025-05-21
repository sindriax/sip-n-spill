"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import locales from "./lib/locales.json";
import RulesSection, { Rule } from "./components/rules-section";
import Footer from "./components/footer";
import HeaderLogo from "./components/header-logo";
import IntroSection from "./components/intro-section";
import StartGameButton from "./components/start-game-button";

type LocaleStrings = {
  pageTitle: string;
  pageDescription: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: Rule[];
  footerText: string;
};

type Locales = {
  en: LocaleStrings;
  es: LocaleStrings;
};

const typedLocales: Locales = locales as Locales;

export default function HomePage() {
  const [language, setLanguage] = useState("en");
  const [content, setContent] = useState<LocaleStrings>(typedLocales.en);
  const [showRules, setShowRules] = useState(false);
  const [isLogoAnimating, setIsLogoAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setContent(typedLocales[language as keyof Locales] || typedLocales.en);
  }, [language]);

  const handleLanguageSelect = (selectedLang: string) => {
    setLanguage(selectedLang);
  };

  const handleStartGame = () => {
    setIsLogoAnimating(true);
    setTimeout(() => {
      router.push(`/play?lang=${language}`);
    }, 700);
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4 text-center bg-[#FDC03B] font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col gap-4 items-center bg-[#FF765D] text-white p-6 md:p-10 rounded-lg shadow-2xl max-w-md w-full my-auto hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-300 ease-out"
      >
        <HeaderLogo altText={content.pageTitle} isAnimating={isLogoAnimating} />
        <IntroSection
          pageDescription={content.pageDescription}
          currentLanguage={language}
          onLanguageChange={handleLanguageSelect}
          selectLanguageLabel={content.selectLanguage}
        />
        <StartGameButton onClick={handleStartGame} label={content.startGame} />
        <RulesSection
          gameRulesTitle={content.gameRulesTitle}
          rules={content.rules}
          showRules={showRules}
          toggleRules={toggleRules}
        />
      </motion.main>

      <Footer footerText={content.footerText} />
    </div>
  );
}
