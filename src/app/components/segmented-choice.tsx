"use client";

interface Option<T extends string> {
  value: T;
  icon: string;
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
    <fieldset className="w-full flex flex-col items-center gap-3">
      <legend className="text-sm font-semibold text-white/80 uppercase tracking-wider text-center mb-3">{label}</legend>
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
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all ${
                active ? option.activeClass : "bg-white/10 border-transparent hover:bg-white/15"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {option.icon}
              </span>
              <span className="text-sm font-bold text-white">{option.name}</span>
              <span className="text-[11px] text-white/70 text-center leading-tight">{option.description}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
