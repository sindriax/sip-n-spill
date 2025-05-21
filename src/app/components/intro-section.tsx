"use client";

import LanguagePicker from "./language-picker";

interface IntroSectionProps {
  pageDescription: string;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  selectLanguageLabel: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  pageDescription,
  currentLanguage,
  onLanguageChange,
  selectLanguageLabel,
}) => {
  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <p className="text-lg md:text-xl font-semibold text-orange-100 pb-1 md:pb-2">
        {pageDescription}
      </p>
      <LanguagePicker
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        selectLanguageLabel={selectLanguageLabel}
      />
    </div>
  );
};

export default IntroSection;
