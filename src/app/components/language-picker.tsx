"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const languageOptions: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

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

interface LanguagePickerProps {
  currentLanguage: string;
  onLanguageChange: (selectedLang: string) => void;
  selectLanguageLabel: string;
}

export default function LanguagePicker({
  currentLanguage,
  onLanguageChange,
  selectLanguageLabel,
}: LanguagePickerProps) {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSelectedOption =
    languageOptions.find((opt) => opt.code === currentLanguage) ||
    languageOptions[0];

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

  const handleSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsLangDropdownOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs mt-2 mb-2" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#FF765D] transition-colors duration-150"
        aria-haspopup="listbox"
        aria-expanded={isLangDropdownOpen}
        aria-label={selectLanguageLabel}
      >
        <span className="flex items-center">
          <span className="mr-2 text-2xl">{currentSelectedOption.flag}</span>
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
                onClick={() => handleSelect(option.code)}
                className={`px-4 py-3 text-left text-sm md:text-base cursor-pointer hover:bg-white/10 transition-colors duration-150 ${
                  currentLanguage === option.code
                    ? "font-semibold bg-white/5"
                    : "font-normal"
                }`}
                role="option"
                aria-selected={currentLanguage === option.code}
              >
                <span className="mr-3 text-xl">{option.flag}</span>
                {option.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
