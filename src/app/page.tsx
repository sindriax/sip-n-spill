"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import locales from "./lib/locales.json";
import GameTutorial from "./components/game-tutorial";
import GradientBackground from "./components/gradient-background";

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
    router.push(`/play?lang=${language}`);
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

  const renderSubtitle = () => {
    const parts = content.pageDescription.split(/(SIP|SPILL|BEBER|REVELAR)/g);
    return (
      <p className="text-lg text-white text-center opacity-95 max-w-[300px] leading-relaxed mb-8">
        {parts.map((part, index) => {
          if (
            part === "SIP" ||
            part === "SPILL" ||
            part === "BEBER" ||
            part === "REVELAR"
          ) {
            return (
              <span key={index} className="font-extrabold text-xl text-[#F0478C]">
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <GradientBackground withSparkles>
      <div className="flex flex-col items-center min-h-screen p-6 font-[family-name:var(--font-geist-sans)]">
        {showTutorial ? (
          <div className="flex-1 flex items-center justify-center w-full max-w-md">
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
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center w-full max-w-[400px]"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center mt-20 mb-4"
            >
              <Image
                src="/assets/sip-logo.png"
                alt={content.pageTitle}
                width={250}
                height={157}
                className="w-[250px] h-auto"
                priority
              />
            </motion.div>

            {renderSubtitle()}

            <div className="w-full flex flex-col items-center gap-4 mb-8">
              <div className="flex gap-2 bg-white/10 rounded-2xl p-1">
                <button
                  onClick={() => handleLanguageSelect("en")}
                  className={`flex items-center justify-center gap-2 py-1 px-4 rounded-xl min-w-[70px] transition-all ${
                    language === "en"
                      ? "bg-white/25"
                      : "bg-transparent opacity-70"
                  }`}
                >
                  <span className="text-lg">🇺🇸</span>
                  <span
                    className={`text-sm font-semibold text-white ${
                      language === "en" ? "opacity-100 font-bold" : "opacity-70"
                    }`}
                  >
                    EN
                  </span>
                </button>
                <button
                  onClick={() => handleLanguageSelect("es")}
                  className={`flex items-center justify-center gap-2 py-1 px-4 rounded-xl min-w-[70px] transition-all ${
                    language === "es"
                      ? "bg-white/25"
                      : "bg-transparent opacity-70"
                  }`}
                >
                  <span className="text-lg">🇪🇸</span>
                  <span
                    className={`text-sm font-semibold text-white ${
                      language === "es" ? "opacity-100 font-bold" : "opacity-70"
                    }`}
                  >
                    ES
                  </span>
                </button>
              </div>

              <button
                onClick={handleShowTutorial}
                className="flex items-center justify-center gap-2 py-2 px-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-all"
              >
                <span className="text-lg">📖</span>
                <span className="text-sm font-semibold text-white opacity-85">
                  {content.showTutorial}
                </span>
              </button>
            </div>

            <motion.button
              onClick={handleStartGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-[220px] relative mt-8"
            >
              <div className="gradient-gold-shine rounded-[20px] py-2 px-3 glow-gold border-2 border-white/40">
                <div className="relative">
                  <Image
                    src="/assets/lets-play.png"
                    alt={content.startGame}
                    width={140}
                    height={58}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-[20px] pointer-events-none" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        <footer className="text-xs text-white/70 text-center py-4">
          <p>
            {content.footerText.replace(
              "{year}",
              new Date().getFullYear().toString()
            )}
          </p>
        </footer>
      </div>
    </GradientBackground>
  );
}
