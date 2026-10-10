import { BeerStein, Crosshair, Fire, Heart, Pepper, Sunglasses, type Icon } from "@phosphor-icons/react";
import type { Mode, Vibe } from "@/lib/game";

interface ChoiceStyle {
  Icon: Icon;
  activeClass: string;
}

export const MODE_STYLE: Record<Mode, ChoiceStyle> = {
  classic: { Icon: BeerStein, activeClass: "bg-gradient-to-b from-amber-500/40 to-orange-600/40 border-amber-400/60" },
  hotseat: { Icon: Crosshair, activeClass: "bg-gradient-to-b from-yellow-500/40 to-red-500/40 border-yellow-400/60" },
  date: { Icon: Heart, activeClass: "bg-gradient-to-b from-pink-500/40 to-rose-600/40 border-pink-400/60" },
};

export const VIBE_STYLE: Record<Vibe, ChoiceStyle> = {
  chill: { Icon: Sunglasses, activeClass: "bg-gradient-to-b from-cyan-500/40 to-blue-500/40 border-cyan-400/60" },
  spicy: { Icon: Pepper, activeClass: "bg-gradient-to-b from-orange-500/40 to-pink-500/40 border-orange-400/60" },
  unhinged: { Icon: Fire, activeClass: "bg-gradient-to-b from-red-600/40 to-purple-600/40 border-red-500/60" },
};
