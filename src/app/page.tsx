"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen } from "@phosphor-icons/react";
import {
  DEFAULT_CONFIG,
  MIN_HOTSEAT_PLAYERS,
  MODES,
  VIBES,
  canStart,
  sanitizeConfig,
  toSearchParams,
  type GameConfig,
  type Vibe,
} from "@/lib/game";
import { detectLanguage, format, getStrings } from "./lib/i18n";
import { MODE_STYLE, VIBE_STYLE } from "./lib/icons";
import type { Icon } from "@phosphor-icons/react";
import { readJson, STORAGE_KEYS, writeJson } from "./lib/storage";
import GradientBackground from "./components/gradient-background";
import HowToPlay from "./components/how-to-play";
import LanguageToggle from "./components/language-toggle";
import PlayButton from "./components/play-button";
import PlayerList from "./components/player-list";
import SegmentedChoice from "./components/segmented-choice";
import SettingRow from "./components/setting-row";
import Sheet from "./components/sheet";

type OpenSheet = "mode" | "vibe" | "players" | "rules" | null;

export default function HomePage() {
  const router = useRouter();
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);
  const [sheet, setSheet] = useState<OpenSheet>(null);
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
  const closeSheet = useCallback(() => setSheet(null), []);

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
    if (!canStart(config)) {
      setSheet("players");
      return;
    }
    if (readJson(STORAGE_KEYS.rulesSeen, false)) {
      startGame();
      return;
    }
    writeJson(STORAGE_KEYS.rulesSeen, true);
    setStartAfterRules(true);
    setSheet("rules");
  };

  const closeRules = useCallback(() => {
    setSheet(null);
    if (startAfterRules) {
      setStartAfterRules(false);
      startGame();
    }
  }, [startAfterRules, startGame]);

  const doneButton = (
    <button
      type="button"
      onClick={closeSheet}
      className="w-full py-3 rounded-2xl gradient-gold-shine text-stone-900 font-extrabold glow-gold active:scale-[0.98] transition-transform"
    >
      {strings.settings.done}
    </button>
  );

  const needsPlayers = config.mode === "hotseat" && config.players.length < MIN_HOTSEAT_PLAYERS;

  return (
    <GradientBackground withSparkles>
      <main className="flex flex-col items-center min-h-screen px-6 pb-6 font-[family-name:var(--font-geist-sans)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center w-full max-w-[400px] gap-6"
        >
          <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mt-12">
            <Image src="/assets/sip-logo.png" alt={strings.title} width={220} height={138} className="w-[220px] h-auto" priority />
          </motion.div>

          <p className="text-lg text-white/90 text-center max-w-[300px] leading-relaxed">{strings.tagline}</p>

          <LanguageToggle value={config.lang} onChange={(lang) => update({ lang })} label={strings.language.label} />

          <PlayButton label={strings.start} onClick={onStart} className="w-full max-w-[220px] mt-2" />

          <div className="w-full flex flex-col gap-2">
            <SettingRow label={strings.settings.mode} value={<ModeValue mode={config.mode} name={strings.modes[config.mode].name} />} onClick={() => setSheet("mode")} />
            {config.mode === "classic" && (
              <SettingRow
                label={strings.settings.vibe}
                value={config.vibes.length === VIBES.length ? strings.vibes.all : config.vibes.map((vibe) => strings.vibes[vibe].name).join(" · ")}
                onClick={() => setSheet("vibe")}
              />
            )}
            {config.mode === "hotseat" && (
              <SettingRow
                label={strings.settings.players}
                value={config.players.length > 0 ? config.players.join(", ") : strings.players.empty}
                onClick={() => setSheet("players")}
                attention={needsPlayers}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setSheet("rules")}
            className="py-2 px-5 rounded-2xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <BookOpen size={18} weight="bold" aria-hidden="true" className="inline-block mr-2 align-[-3px]" />
            {strings.howToPlay}
          </button>
        </motion.div>

        <footer className="text-xs text-white/60 text-center pt-6">
          {format(strings.footer, { year: new Date().getFullYear() })}
        </footer>
      </main>

      <Sheet title={strings.modes.label} isOpen={sheet === "mode"} onClose={closeSheet} closeLabel={strings.settings.close}>
        <SegmentedChoice
          label={strings.modes.label}
          options={MODES.map((mode) => ({
            value: mode,
            icon: <ChoiceIcon icon={MODE_STYLE[mode].Icon} />,
            name: strings.modes[mode].name,
            description: strings.modes[mode].tagline,
            activeClass: MODE_STYLE[mode].activeClass,
          }))}
          selected={[config.mode]}
          onToggle={(mode) => {
            update({ mode });
            closeSheet();
          }}
        />
      </Sheet>

      <Sheet title={strings.vibes.label} isOpen={sheet === "vibe"} onClose={closeSheet} closeLabel={strings.settings.close} footer={doneButton}>
        <SegmentedChoice
          label={strings.vibes.label}
          multiple
          options={VIBES.map((vibe) => ({
            value: vibe,
            icon: <ChoiceIcon icon={VIBE_STYLE[vibe].Icon} />,
            name: strings.vibes[vibe].name,
            description: strings.vibes[vibe].description,
            activeClass: VIBE_STYLE[vibe].activeClass,
          }))}
          selected={config.vibes}
          onToggle={toggleVibe}
        />
        <p className="text-xs text-white/50 text-center mt-3">{strings.vibes.hint}</p>
      </Sheet>

      <Sheet title={strings.players.label} isOpen={sheet === "players"} onClose={closeSheet} closeLabel={strings.settings.close} footer={doneButton}>
        <PlayerList
          players={config.players}
          onChange={(players) => update({ players })}
          strings={strings.players}
          hint={format(strings.players.requiredHint, { min: MIN_HOTSEAT_PLAYERS })}
        />
      </Sheet>

      <HowToPlay mode={config.mode} strings={strings} isOpen={sheet === "rules"} onClose={closeRules} />
    </GradientBackground>
  );
}

function ModeValue({ mode, name }: { mode: GameConfig["mode"]; name: string }) {
  const IconComponent = MODE_STYLE[mode].Icon;
  return (
    <>
      <IconComponent size={18} weight="duotone" aria-hidden="true" className="shrink-0" />
      <span className="truncate">{name}</span>
    </>
  );
}

function ChoiceIcon({ icon: IconComponent }: { icon: Icon }) {
  return <IconComponent size={28} weight="duotone" aria-hidden="true" />;
}
