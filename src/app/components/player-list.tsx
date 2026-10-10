"use client";

import { useState } from "react";
import { MAX_PLAYERS, normalizePlayerName } from "@/lib/game";
import { format, type Strings } from "../lib/i18n";

interface PlayerListProps {
  players: string[];
  onChange: (players: string[]) => void;
  strings: Strings["players"];
  hint: string;
}

export default function PlayerList({ players, onChange, strings, hint }: PlayerListProps) {
  const [draft, setDraft] = useState("");
  const full = players.length >= MAX_PLAYERS;

  const add = () => {
    const name = normalizePlayerName(draft);
    if (!name || full || players.some((p) => p.toLowerCase() === name.toLowerCase())) return;
    onChange([...players, name]);
    setDraft("");
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={strings.placeholder}
          aria-label={strings.label}
          enterKeyHint="done"
          autoComplete="off"
          disabled={full}
          className="flex-1 min-w-0 bg-white/10 border-2 border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FFD36E]/70 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={full || !draft.trim()}
          className="shrink-0 bg-white/15 hover:bg-white/25 border-2 border-white/15 rounded-xl px-4 py-2.5 text-white font-semibold transition-colors disabled:opacity-40"
        >
          {strings.add}
        </button>
      </form>

      {players.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={strings.label}>
          {players.map((player) => (
            <li key={player} className="flex items-center gap-1.5 bg-white/15 rounded-full pl-3 pr-1.5 py-1 text-sm text-white">
              {player}
              <button
                type="button"
                onClick={() => onChange(players.filter((p) => p !== player))}
                aria-label={format(strings.remove, { name: player })}
                className="w-6 h-6 rounded-full hover:bg-white/20 text-white/70 hover:text-white leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-center text-white/55">
        {players.length > 0 ? format(strings.count, { count: players.length }) : hint}
      </p>
    </div>
  );
}
