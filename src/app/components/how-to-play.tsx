"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Mode } from "@/lib/game";
import type { Strings } from "../lib/i18n";

interface HowToPlayProps {
  mode: Mode;
  strings: Strings;
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlay({ mode, strings, isOpen, onClose }: HowToPlayProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const steps = strings.rules[mode];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-to-play-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#1d0638] border border-white/15 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="sticky top-0 flex items-center justify-between px-6 pt-5 pb-3 bg-[#1d0638]/95 backdrop-blur-md border-b border-white/10">
              <div>
                <h2 id="how-to-play-title" className="text-xl font-bold text-white">
                  {strings.rules.title}
                </h2>
                <p className="text-xs uppercase tracking-wider text-white/60">{strings.modes[mode].name}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={strings.rules.close}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              >
                ✕
              </button>
            </header>

            <ol className="px-6 py-5 space-y-5">
              {steps.map((step, index) => (
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

            <div className="px-6 pb-8 sm:pb-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl gradient-gold-shine text-stone-900 font-extrabold glow-gold active:scale-[0.98] transition-transform"
              >
                {strings.rules.gotIt}
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
