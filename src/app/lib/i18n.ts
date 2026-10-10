import locales from "./locales.json";
import type { Language } from "@/lib/game";

export type Strings = (typeof locales)["en"];

export function getStrings(lang: Language): Strings {
  return locales[lang];
}

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

export function detectLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}
