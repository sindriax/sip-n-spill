"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import locales from "../locales.json"; // Import the locales

// Define a type for your locale strings for better type safety
type LocaleStrings = {
  pageTitle: string;
  selectLanguage: string;
  startGame: string;
  gameRulesTitle: string;
  rules: string[];
  footerText: string;
};

// Define a type for the entire locales object
type Locales = {
  en: LocaleStrings;
  es: LocaleStrings;
  // Add other languages here if needed
};

const typedLocales: Locales = locales as Locales;

// Helper component for flags to avoid direct string manipulation in JSX for language codes
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
        ? "ring-2 ring-offset-2 ring-amber-500 ring-offset-orange-50 scale-110" // Updated ring color
        : "opacity-70 hover:opacity-100 hover:scale-110"
    }`}
    aria-label={`Select ${lang === "en" ? "English" : "Spanish"}`} // Accessibility
  >
    {children}
  </button>
);

export default function HomePage() {
  const [language, setLanguage] = useState("en"); // Default language to English ("en")
  const [content, setContent] = useState<LocaleStrings>(typedLocales.en);
  const [showRules, setShowRules] = useState(false); // State to control rules visibility
  const router = useRouter();

  useEffect(() => {
    // Update content when language changes
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-center bg-rose-500 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 sm:gap-10 items-center bg-orange-50 text-rose-700 p-6 sm:p-10 rounded-lg shadow-xl max-w-lg w-full">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-rose-800">
          {content.pageTitle}
        </h1>

        <div className="flex flex-col gap-3 items-center">
          <p className="text-md sm:text-lg font-medium text-rose-600">
            {content.selectLanguage}
          </p>
          <div className="flex gap-4">
            <FlagButton
              lang="en"
              currentLang={language}
              onClick={handleLanguageSelect}
            >
              🇺🇸
            </FlagButton>
            <FlagButton
              lang="es"
              currentLang={language}
              onClick={handleLanguageSelect}
            >
              🇪🇸
            </FlagButton>
            {/* Add more FlagButtons here if needed, e.g., for French:
            <FlagButton lang="fr" currentLang={language} onClick={handleLanguageSelect}>
              🇫🇷
            </FlagButton> */}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="px-8 py-3 sm:px-10 sm:py-4 bg-amber-400 text-stone-800 font-semibold rounded-lg text-xl sm:text-2xl shadow-md hover:bg-amber-300 transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-orange-50"
        >
          {content.startGame}
        </button>

        <div className="mt-4 sm:mt-6 bg-rose-100 rounded-lg max-w-md w-full text-left">
          <button
            onClick={toggleRules}
            className="w-full flex justify-between items-center p-4 sm:p-6 text-xl sm:text-2xl font-semibold text-rose-700 focus:outline-none"
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
              className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-rose-600 p-4 sm:p-6 pt-0"
            >
              {content.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="mt-8 sm:mt-12 text-xs text-orange-100">
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
