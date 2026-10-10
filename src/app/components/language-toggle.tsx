"use client";

import { LANGUAGES, type Language } from "@/lib/game";

const NAMES: Record<Language, string> = { en: "English", es: "Español" };

interface LanguageToggleProps {
  value: Language;
  onChange: (lang: Language) => void;
  label: string;
}

export default function LanguageToggle({ value, onChange, label }: LanguageToggleProps) {
  return (
    <div className="flex gap-1 bg-white/10 rounded-2xl p-1" role="radiogroup" aria-label={label}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          role="radio"
          aria-checked={value === lang}
          aria-label={NAMES[lang]}
          onClick={() => onChange(lang)}
          className={`py-1.5 px-5 rounded-xl text-sm font-bold tracking-wide transition-all ${
            value === lang ? "bg-white/25 text-white" : "text-white/60 hover:text-white/80"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
