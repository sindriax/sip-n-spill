"use client";

import { LANGUAGES, type Language } from "@/lib/game";

const LABELS: Record<Language, { flag: string; code: string; name: string }> = {
  en: { flag: "🇺🇸", code: "EN", name: "English" },
  es: { flag: "🇪🇸", code: "ES", name: "Español" },
};

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
          aria-label={LABELS[lang].name}
          onClick={() => onChange(lang)}
          className={`flex items-center gap-2 py-1.5 px-4 rounded-xl min-w-[72px] transition-all ${
            value === lang ? "bg-white/25 text-white" : "text-white/60 hover:text-white/80"
          }`}
        >
          <span aria-hidden="true">{LABELS[lang].flag}</span>
          <span className="text-sm font-bold">{LABELS[lang].code}</span>
        </button>
      ))}
    </div>
  );
}
