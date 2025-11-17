"use client";

import { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  withSparkles?: boolean;
}

export default function GradientBackground({
  children,
  withSparkles = false,
}: GradientBackgroundProps) {
  return (
    <div className="relative min-h-screen gradient-nightlife overflow-hidden">
      {withSparkles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${2 + (i % 4)}px`,
                height: `${2 + (i % 4)}px`,
                left: `${(i * 13) % 100}%`,
                top: `${(i * 17) % 100}%`,
                background:
                  i % 3 === 0
                    ? "#FFD36E"
                    : i % 3 === 1
                    ? "#B864F6"
                    : "#4FF0E8",
                opacity: 0.3 + (i % 3) * 0.1,
                filter: "blur(1px)",
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
