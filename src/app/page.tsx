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

export default function HomePage() {
  const [language, setLanguage] = useState("en"); // Default language to English ("en")
  const [content, setContent] = useState<LocaleStrings>(typedLocales.en);
  const router = useRouter();

  useEffect(() => {
    // Update content when language changes
    setContent(typedLocales[language as keyof Locales] || typedLocales.en);
  }, [language]);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleStartGame = () => {
    router.push(`/play?lang=${language}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-purple-600 to-blue-500 text-white font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 items-center bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-2xl">
        <h1 className="text-6xl font-bold tracking-tight">
          {content.pageTitle}
        </h1>

        <div className="flex flex-col gap-4 items-center">
          <label htmlFor="language-select" className="text-lg font-medium">
            {content.selectLanguage}
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="px-4 py-2 rounded-md bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white focus:outline-none"
          >
            <option value="en" className="text-black">
              English
            </option>
            <option value="es" className="text-black">
              Español
            </option>
            {/* <option value="fr" className="text-black">
              Français
            </option> */}
            {/* Add more languages as needed */}
          </select>
        </div>

        <button
          onClick={handleStartGame}
          className="px-10 py-4 bg-yellow-400 text-purple-700 font-semibold rounded-lg text-2xl shadow-lg hover:bg-yellow-300 transition-colors duration-150 ease-in-out transform hover:scale-105"
        >
          {content.startGame}
        </button>

        <div className="mt-6 p-6 bg-white/5 rounded-lg max-w-md text-left">
          <h2 className="text-2xl font-semibold mb-3 text-center">
            {content.gameRulesTitle}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            {content.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="mt-12 text-xs text-white/70">
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
