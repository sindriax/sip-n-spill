"use client";

import Image from "next/image";
import GradientBackground from "./gradient-background";
import PrimaryButton from "./primary-button";

interface Action {
  label: string;
  onClick: () => void;
}

interface GameErrorDisplayProps {
  message: string;
  detail?: string;
  primary: Action;
  secondary?: Action;
}

export default function GameErrorDisplay({ message, detail, primary, secondary }: GameErrorDisplayProps) {
  return (
    <GradientBackground withSparkles>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-white font-[family-name:var(--font-geist-sans)]">
        <Image src="/assets/sippin.png" alt="" width={200} height={200} className="w-[160px] h-auto mb-6" priority />
        <p className="text-xl font-bold max-w-[320px]">{message}</p>
        {detail && <p className="mt-2 text-white/70">{detail}</p>}
        <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-[260px]">
          <PrimaryButton onClick={primary.onClick} className="w-full">
            {primary.label}
          </PrimaryButton>
          {secondary && (
            <button
              type="button"
              onClick={secondary.onClick}
              className="w-full py-3 rounded-2xl bg-white/15 hover:bg-white/25 font-semibold transition-colors"
            >
              {secondary.label}
            </button>
          )}
        </div>
      </div>
    </GradientBackground>
  );
}
