"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import locales from "../locales.json";
interface Rule {
  header: string;
  text: string;
}
interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

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
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSelectedOption =
    languageOptions.find((opt) => opt.code === language) || languageOptions[0];

  useEffect(() => {
    setContent(typedLocales[language as keyof Locales] || typedLocales.en);
  }, [language]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLanguageSelect = (selectedLang: string) => {
    setLanguage(selectedLang);
    setIsLangDropdownOpen(false);
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

  const rulesContainerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const ruleItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4 text-center bg-[#FDC03B] font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col gap-4 items-center bg-[#FF765D] text-white p-6 md:p-10 rounded-lg shadow-2xl max-w-md w-full my-auto hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-300 ease-out"
      >
        <motion.div
          className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-xs"
          animate={
            isLogoAnimating
              ? {
                  rotateY: 360,
                  scale: 0.8,
                  transition: { duration: 0.5, ease: "easeInOut" },
                }
              : {}
          }
        >
          <Image
            src="/assets/sip-round.png"
            alt={content.pageTitle}
            width={500}
            height={300}
            className="w-full h-auto"
            priority
          />
        </motion.div>
        <h1 className="sr-only">{content.pageTitle}</h1>
        <div className="flex flex-col gap-3 items-center w-full">
          <p className="text-lg md:text-xl font-semibold text-orange-100 pb-1 md:pb-2">
            {content.pageDescription}
          </p>

          {/* Language Dropdown */}
          <div className="relative w-full max-w-xs mt-2 mb-2" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#FF765D] transition-colors duration-150"
              aria-haspopup="listbox"
              aria-expanded={isLangDropdownOpen}
              aria-label={content.selectLanguage}
            >
              <span className="flex items-center">
                <span className="mr-2 text-2xl">
                  {currentSelectedOption.flag}
                </span>
                {currentSelectedOption.name}
              </span>
              <span
                className={`transform transition-transform duration-200 ${
                  isLangDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.ul
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute mt-1 w-full bg-[#ff937d] rounded-md shadow-lg z-10 overflow-hidden ring-1 ring-black ring-opacity-5"
                  role="listbox"
                >
                  {languageOptions.map((option) => (
                    <li
                      key={option.code}
                      onClick={() => handleLanguageSelect(option.code)}
                      className={`px-4 py-3 text-left text-sm md:text-base cursor-pointer hover:bg-white/10 transition-colors duration-150 ${
                        language === option.code
                          ? "font-semibold bg-white/5"
                          : "font-normal"
                      }`}
                      role="option"
                      aria-selected={language === option.code}
                    >
                      <span className="mr-3 text-xl">{option.flag}</span>
                      {option.name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
        <button
          onClick={handleStartGame}
          className="px-6 py-3 md:px-10 md:py-4 bg-amber-400 text-stone-800 font-semibold rounded-lg text-lg md:text-2xl shadow-lg hover:bg-amber-300 transition-all duration-150 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FF765D] w-full max-w-xs"
        >
          {content.startGame}
        </button>
        <div className="mt-4 md:mt-6 bg-[#ff937d] rounded-lg shadow-lg max-w-md w-full text-left">
          <button
            onClick={toggleRules}
            className="w-full flex justify-between items-center p-4 md:p-5 text-lg md:text-xl font-semibold text-white focus:outline-none rounded-t-lg hover:bg-white/10 active:bg-white/20 transition-colors duration-150"
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
          <AnimatePresence>
            {showRules && (
              <motion.ul
                id="game-rules-list"
                variants={rulesContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-2 text-sm md:text-base text-orange-50 p-4 md:p-5 pt-2 md:pt-3 bg-white/5 rounded-b-lg overflow-hidden"
              >
                {content.rules.map((rule, index) => (
                  <motion.li
                    key={index}
                    variants={ruleItemVariants}
                    className="leading-relaxed"
                  >
                    {rule.header && (
                      <strong className="block mb-0.5">{rule.header}</strong>
                    )}
                    {rule.text}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      <footer className="w-full mt-6 text-xs text-stone-800 p-3 text-center">
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
