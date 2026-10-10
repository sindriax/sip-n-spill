"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { fromSearchParams, parseLanguage } from "@/lib/game";
import { format, getStrings } from "../lib/i18n";
import { loadDeck, shuffle } from "../lib/deck";
import { useWakeLock } from "../lib/use-wake-lock";
import GameLoadingIndicator from "../components/game-loading-indicator";
import GameErrorDisplay from "../components/game-error-display";
import GradientBackground from "../components/gradient-background";
import HowToPlay from "../components/how-to-play";
import QuestionDisplay from "../components/question-display";

type Status = "loading" | "error" | "ready";

const SWIPE_THRESHOLD = 80;

function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const config = useMemo(() => fromSearchParams(searchParams), [searchParams]);
  const strings = getStrings(config.lang);

  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const [deck, setDeck] = useState<string[]>([]);
  const [turnOrder, setTurnOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [rulesOpen, setRulesOpen] = useState(false);

  useWakeLock(status === "ready");

  useEffect(() => {
    document.documentElement.lang = config.lang;
  }, [config.lang]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    loadDeck(config)
      .then((questions) => {
        if (cancelled) return;
        setDeck(shuffle(questions));
        setTurnOrder(shuffle(config.players));
        setIndex(0);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [config, attempt]);

  const finished = status === "ready" && index >= deck.length;
  const currentPlayer = turnOrder.length > 0 ? turnOrder[index % turnOrder.length] : null;

  const next = useCallback(() => {
    navigator.vibrate?.(8);
    setIndex((current) => Math.min(current + 1, deck.length));
  }, [deck.length]);

  const previous = useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  const reshuffle = () => {
    setDeck(shuffle(deck));
    setTurnOrder(shuffle(turnOrder));
    setIndex(0);
  };

  useEffect(() => {
    if (status !== "ready" || finished || rulesOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === "Enter") {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, finished, rulesOpen, next]);

  const goHome = () => router.push("/");

  if (status === "loading") return <GameLoadingIndicator loadingText={strings.game.loading} />;

  if (status === "error") {
    return (
      <GameErrorDisplay
        message={strings.game.loadFailed}
        primary={{ label: strings.game.retry, onClick: () => setAttempt((n) => n + 1) }}
        secondary={{ label: strings.game.home, onClick: goHome }}
      />
    );
  }

  if (finished) {
    return (
      <GameErrorDisplay
        message={strings.game.deckEmpty}
        detail={format(strings.game.deckEmptyHint, { count: deck.length })}
        primary={{ label: strings.game.shuffleAgain, onClick: reshuffle }}
        secondary={{ label: strings.game.home, onClick: goHome }}
      />
    );
  }

  const question = config.mode === "hotseat" && currentPlayer ? deck[index].replaceAll("{player}", currentPlayer) : deck[index];
  const turnLabel = currentPlayer ? format(strings.game.hotseatTurn, { name: currentPlayer }) : strings.modes[config.mode].name;

  return (
    <GradientBackground withSparkles>
      <div className="flex flex-col min-h-screen text-white font-[family-name:var(--font-geist-sans)]">
        <header className="flex items-center justify-between gap-3 px-5 pt-10 pb-4">
          <button
            type="button"
            onClick={goHome}
            aria-label={strings.game.back}
            className="shrink-0 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <Image src="/assets/sippin.png" alt="" width={36} height={36} className="object-contain" />
          </button>

          <div className="flex-1 min-w-0 flex flex-col items-center">
            <p className="text-base font-bold text-center truncate max-w-full" aria-live="polite">
              {turnLabel}
            </p>
            <p className="text-xs font-medium text-white/60 tabular-nums">
              {index + 1} / {deck.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            aria-label={strings.game.rules}
            className="shrink-0 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <Image src="/assets/qs.png" alt="" width={26} height={26} className="object-contain" />
          </button>
        </header>

        <div className="px-5">
          <div className="h-1 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full bg-white/80 rounded-full transition-[width] duration-300" style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
          </div>
        </div>

        <motion.div
          role="button"
          tabIndex={0}
          aria-label={strings.game.tapForNext}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          dragSnapToOrigin
          onTap={next}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD) next();
            else if (info.offset.x > SWIPE_THRESHOLD) previous();
          }}
          className="flex-1 flex items-center justify-center px-5 py-4 cursor-pointer select-none touch-pan-y focus:outline-none"
        >
          <QuestionDisplay question={question} questionKey={index} />
        </motion.div>

        <p className="text-center text-xs text-white/50 pb-6">{strings.game.tapForNext}</p>

        <HowToPlay mode={config.mode} strings={strings} isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
      </div>
    </GradientBackground>
  );
}

export default function PlayPage() {
  const lang = parseLanguage(typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("lang"));
  return (
    <Suspense fallback={<GameLoadingIndicator loadingText={getStrings(lang).game.loading} />}>
      <Game />
    </Suspense>
  );
}

