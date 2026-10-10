"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  DEFAULT_CONFIG,
  MIN_HOTSEAT_PLAYERS,
  MODES,
  VIBES,
  canStart,
  sanitizeConfig,
  toSearchParams,
  type GameConfig,
  type Mode,
  type Vibe,
} from "@/lib/game";
import { detectLanguage, format, getStrings } from "./lib/i18n";
import { readJson, STORAGE_KEYS, writeJson } from "./lib/storage";
import GradientBackground from "./components/gradient-background";
import HowToPlay from "./components/how-to-play";
import LanguageToggle from "./components/language-toggle";
import PlayerList from "./components/player-list";
import PrimaryButton from "./components/primary-button";
import SegmentedChoice from "./components/segmented-choice";

const MODE_STYLE: Record<Mode, { icon: string; activeClass: string }> = {
  classic: { icon: "🍻", activeClass: "bg-gradient-to-b from-amber-500/40 to-orange-600/40 border-amber-400/60" },
  hotseat: { icon: "🎯", activeClass: "bg-gradient-to-b from-yellow-500/40 to-red-500/40 border-yellow-400/60" },
  date: { icon: "💕", activeClass: "bg-gradient-to-b from-pink-500/40 to-rose-600/40 border-pink-400/60" },
};

const VIBE_STYLE: Record<Vibe, { icon: string; activeClass: string }> = {
  chill: { icon: "😎", activeClass: "bg-gradient-to-b from-cyan-500/40 to-blue-500/40 border-cyan-400/60" },
  spicy: { icon: "🌶️", activeClass: "bg-gradient-to-b from-orange-500/40 to-pink-500/40 border-orange-400/60" },
  unhinged: { icon: "🔥", activeClass: "bg-gradient-to-b from-red-600/40 to-purple-600/40 border-red-500/60" },
};

const reveal = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

export default function HomePage() {
  const router = useRouter();
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [startAfterRules, setStartAfterRules] = useState(false);

  useEffect(() => {
    const saved = readJson<Partial<GameConfig> | null>(STORAGE_KEYS.setup, null);
    setConfig(saved ? sanitizeConfig(saved) : { ...DEFAULT_CONFIG, lang: detectLanguage() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJson(STORAGE_KEYS.setup, config);
  }, [config, hydrated]);

  useEffect(() => {
    document.documentElement.lang = config.lang;
  }, [config.lang]);

  const strings = getStrings(config.lang);
  const update = (patch: Partial<GameConfig>) => setConfig((current) => ({ ...current, ...patch }));

  const toggleVibe = (vibe: Vibe) =>
    update({
      vibes: config.vibes.includes(vibe)
        ? config.vibes.length === 1
          ? config.vibes
          : config.vibes.filter((v) => v !== vibe)
        : VIBES.filter((v) => v === vibe || config.vibes.includes(v)),
    });

  const startGame = useCallback(() => {
    router.push(`/play?${toSearchParams(config)}`);
  }, [config, router]);

  const onStart = () => {
    if (!canStart(config)) return;
    if (readJson(STORAGE_KEYS.rulesSeen, false)) {
      startGame();
      return;
    }
    writeJson(STORAGE_KEYS.rulesSeen, true);
    setStartAfterRules(true);
    setRulesOpen(true);
  };

  const closeRules = useCallback(() => {
    setRulesOpen(false);
    if (startAfterRules) {
      setStartAfterRules(false);
      startGame();
    }
  }, [startAfterRules, startGame]);

  const ready = canStart(config);

  return (
    <GradientBackground withSparkles>
      <main className="flex flex-col items-center min-h-screen px-6 pb-6 font-[family-name:var(--font-geist-sans)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center w-full max-w-[400px] gap-5"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-10"
          >
            <Image src="/assets/sip-logo.png" alt={strings.title} width={220} height={138} className="w-[180px] h-auto" priority />
          </motion.div>

          <p className="text-white/90 text-center max-w-[300px] leading-relaxed">{strings.tagline}</p>

          <LanguageToggle value={config.lang} onChange={(lang) => update({ lang })} label={strings.language.label} />

          <SegmentedChoice
            label={strings.modes.label}
            options={MODES.map((mode) => ({
              value: mode,
              icon: MODE_STYLE[mode].icon,
              name: strings.modes[mode].name,
              description: strings.modes[mode].tagline,
              activeClass: MODE_STYLE[mode].activeClass,
            }))}
            selected={[config.mode]}
            onToggle={(mode) => update({ mode })}
          />

          <AnimatePresence initial={false}>
            {config.mode === "classic" && (
              <motion.div key="vibes" {...reveal} className="w-full overflow-hidden">
                <SegmentedChoice
                  label={strings.vibes.label}
                  multiple
                  options={VIBES.map((vibe) => ({
                    value: vibe,
                    icon: VIBE_STYLE[vibe].icon,
                    name: strings.vibes[vibe].name,
                    description: strings.vibes[vibe].description,
                    activeClass: VIBE_STYLE[vibe].activeClass,
                  }))}
                  selected={config.vibes}
                  onToggle={toggleVibe}
                />
                <p className="text-xs text-white/50 text-center mt-2">{strings.vibes.hint}</p>
              </motion.div>
            )}

            {config.mode !== "date" && (
              <motion.section key="players" {...reveal} className="w-full overflow-hidden">
                <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider text-center mb-3">{strings.players.label}</h2>
                <PlayerList
                  players={config.players}
                  onChange={(players) => update({ players })}
                  strings={strings.players}
                  hint={
                    config.mode === "hotseat"
                      ? format(strings.players.requiredHint, { min: MIN_HOTSEAT_PLAYERS })
                      : strings.players.optionalHint
                  }
                />
              </motion.section>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            className="py-2 px-5 rounded-2xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            📖 {strings.howToPlay}
          </button>
        </motion.div>

        <div className="sticky bottom-0 w-full flex justify-center pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] -mx-6 px-6 bg-gradient-to-t from-[#260046] via-[#260046]/90 to-transparent">
          <PrimaryButton onClick={onStart} disabled={!ready} className="w-full max-w-[280px]">
            {strings.start}
          </PrimaryButton>
        </div>

        <footer className="text-xs text-white/60 text-center pt-2">
          {format(strings.footer, { year: new Date().getFullYear() })}
        </footer>
      </main>

      <HowToPlay mode={config.mode} strings={strings} isOpen={rulesOpen} onClose={closeRules} />
    </GradientBackground>
  );
}
