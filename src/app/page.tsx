"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import locales from "../locales.json";

type LocaleStrings = {
  pageTitle: string;
  pageDescription: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: string[];
  footerText: string;
};

type Locales = {
  en: LocaleStrings;
  es: LocaleStrings;
};

const typedLocales: Locales = locales as Locales;

const FlagButton = ({
  lang,
  currentLang,
  children,
  onClick,
}: {
  lang: string;
  currentLang: string;
  children: React.ReactNode;
  onClick: (lang: string) => void;
}) => (
  <button
    onClick={() => onClick(lang)}
    className={`text-4xl p-2 rounded-full transition-all duration-200 ease-in-out ${
      currentLang === lang
        ? "ring-2 ring-offset-2 ring-amber-400 ring-offset-[#FF765D] scale-110"
        : "opacity-70 hover:opacity-100 hover:scale-110"
    }`}
    aria-label={`Select ${lang === "en" ? "English" : "Spanish"}`}
  >
    {children}
  </button>
);

export default function HomePage() {
  const [language, setLanguage] = useState("en");
  const [content, setContent] = useState<LocaleStrings>(typedLocales.en);
  const [showRules, setShowRules] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setContent(typedLocales[language as keyof Locales] || typedLocales.en);
  }, [language]);

  const handleLanguageSelect = (selectedLang: string) => {
    setLanguage(selectedLang);
  };

  const handleStartGame = () => {
    router.push(`/play?lang=${language}`);
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4 sm:p-8 text-center bg-[#FDC03B] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 sm:gap-6 items-center bg-[#FF765D] text-white p-6 sm:p-10 rounded-lg shadow-xl max-w-lg w-full mt-auto mb-auto">
        {" "}
        <div className="w-full max-w-xs sm:max-w-sm">
          <Image
            src="/assets/sip.png"
            alt={content.pageTitle}
            width={500}
            height={300}
            layout="responsive"
            priority
          />
        </div>
        <h1 className="sr-only">{content.pageTitle}</h1>
        <div className="flex flex-col gap-3 items-center">
          <p className="text-lg sm:text-xl font-semibold text-orange-100 pb-2">
            {content.pageDescription}
          </p>
          <p className="text-md sm:text-lg font-medium text-orange-100">
            {content.selectLanguage}
          </p>
          <div className="flex gap-4">
            <FlagButton
              lang="en"
              currentLang={language}
              onClick={handleLanguageSelect}
            >
              🇬🇧
            </FlagButton>
            <FlagButton
              lang="es"
              currentLang={language}
              onClick={handleLanguageSelect}
            >
              🇪🇸
            </FlagButton>
          </div>
        </div>
        <button
          onClick={handleStartGame}
          className="px-8 py-3 sm:px-10 sm:py-4 bg-amber-400 text-stone-800 font-semibold rounded-lg text-xl sm:text-2xl shadow-md hover:bg-amber-300 transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FF765D]"
        >
          {content.startGame}
        </button>
        <div className="mt-4 sm:mt-6 bg-[#ff937d] rounded-lg max-w-md w-full text-left">
          {" "}
          <button
            onClick={toggleRules}
            className="w-full flex justify-between items-center p-4 sm:p-6 text-xl sm:text-2xl font-semibold text-white focus:outline-none"
            aria-expanded={showRules}
            aria-controls="game-rules-list"
          >
            <span>{content.gameRulesTitle}</span>
            <span
              className={`transform transition-transform duration-200 ${
                showRules ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
          {showRules && (
            <ul
              id="game-rules-list"
              className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-orange-50 p-4 sm:p-6 pt-0"
            >
              {content.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="w-full mt-8 sm:mt-12 text-xs text-stone-800 p-4 text-center">
        {" "}
        <p>
          {content.footerText.replace(
            "{year}",
            new Date().getFullYear().toString()
          )}
        </p>
      </footer>
    </div>
  );
}
