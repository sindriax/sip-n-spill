"use client";

import Image from "next/image";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#FDC03B] text-stone-800 font-[family-name:var(--font-geist-sans)]">
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
        className="mt-6 px-6 py-3 bg-amber-400 text-stone-800 font-semibold rounded-lg shadow-lg hover:bg-amber-300 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FDC03B]"
      >
        {goHomeText}
      </button>
    </div>
  );
};

export default GameErrorDisplay;
