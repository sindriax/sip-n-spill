"use client";

import type { ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";

interface SettingRowProps {
  label: string;
  value: ReactNode;
  onClick: () => void;
  attention?: boolean;
}

export default function SettingRow({ label, value, onClick, attention = false }: SettingRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border-2 bg-white/10 hover:bg-white/15 transition-colors ${
        attention ? "border-[#FFD36E]/70" : "border-white/10"
      }`}
    >
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-white/70">{label}</span>
      <span className="flex items-center gap-2 min-w-0 text-sm font-bold text-white">
        <span className="flex items-center gap-2 min-w-0 truncate">{value}</span>
        <CaretDown size={14} weight="bold" className="shrink-0 text-white/50" aria-hidden="true" />
      </span>
    </button>
  );
}
