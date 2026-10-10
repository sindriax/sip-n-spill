"use client";

import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import ErrorBoundary from "./error-boundary";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>{children}</ErrorBoundary>
    </MotionConfig>
  );
}
