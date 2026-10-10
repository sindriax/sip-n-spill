"use client";

import type { Mode } from "@/lib/game";
import type { Strings } from "../lib/i18n";
import Sheet from "./sheet";

interface HowToPlayProps {
  mode: Mode;
  strings: Strings;
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlay({ mode, strings, isOpen, onClose }: HowToPlayProps) {
  return (
    <Sheet
      title={strings.rules.title}
      subtitle={strings.modes[mode].name}
      isOpen={isOpen}
      onClose={onClose}
      closeLabel={strings.rules.close}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl gradient-gold-shine text-stone-900 font-extrabold glow-gold active:scale-[0.98] transition-transform"
        >
          {strings.rules.gotIt}
        </button>
      }
    >
      <ol className="space-y-5">
        {strings.rules[mode].map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-full gradient-gold-shine text-stone-900 font-extrabold flex items-center justify-center">
              {index + 1}
            </span>
            <div>
              <h3 className="font-bold text-white">{step.title}</h3>
              <p className="text-sm text-white/75 leading-relaxed">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}
