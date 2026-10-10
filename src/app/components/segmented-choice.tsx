"use client";

import type { ReactNode } from "react";

interface Option<T extends string> {
  value: T;
  icon: ReactNode;
  name: string;
  description: string;
  activeClass: string;
}

interface SegmentedChoiceProps<T extends string> {
  label: string;
  options: Option<T>[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  multiple?: boolean;
}

export default function SegmentedChoice<T extends string>({ label, options, selected, onToggle, multiple = false }: SegmentedChoiceProps<T>) {
  return (
    <fieldset className="w-full">
      <legend className="sr-only">{label}</legend>
      <div className="w-full flex gap-2" role={multiple ? "group" : "radiogroup"} aria-label={label}>
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={active}
              onClick={() => onToggle(option.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all ${
                active ? `${option.activeClass} text-white` : "bg-white/10 border-transparent text-white/70 hover:bg-white/15"
              }`}
            >
              <span aria-hidden="true">{option.icon}</span>
              <span className="text-sm font-bold text-white">{option.name}</span>
              <span className="text-[11px] text-white/70 text-center leading-tight">{option.description}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
