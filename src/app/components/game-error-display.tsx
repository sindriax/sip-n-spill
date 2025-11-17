"use client";

import Image from "next/image";
import GradientBackground from "./gradient-background";

interface GameErrorDisplayProps {
  errorMessage: string;
  onGoHome: () => void;
  goHomeText: string;
  imageSrc?: string;
  altText?: string;
}

const GameErrorDisplay: React.FC<GameErrorDisplayProps> = ({
  errorMessage,
  onGoHome,
  goHomeText,
  imageSrc = "/assets/sippin.png",
  altText = "Sip 'n Spill Logo Error",
}) => {
  return (
    <GradientBackground withSparkles>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center text-white font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-[180px] sm:max-w-[250px] mb-6">
          <Image
            src={imageSrc}
            alt={altText}
            width={250}
            height={150}
            className="w-full h-auto"
            priority
          />
        </div>
        <p className="mt-4 text-lg sm:text-xl">{errorMessage}</p>
        <button
          onClick={onGoHome}
          className="mt-6 px-6 py-3 gradient-gold-shine text-stone-800 font-bold rounded-2xl shadow-lg glow-gold hover:scale-105 transition-all duration-150 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFD36E] focus:ring-offset-2 focus:ring-offset-transparent"
        >
          {goHomeText}
        </button>
      </div>
    </GradientBackground>
  );
};

export default GameErrorDisplay;
