"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import GradientBackground from "./gradient-background";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <GradientBackground>
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white font-[family-name:var(--font-geist-sans)]">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
              <p className="text-white/70 mb-6">
                The party hit a snag. Don&apos;t worry, it happens to the best of us!
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-red-500/20 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm font-mono text-red-300 break-words">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="w-full py-3 px-6 rounded-2xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </GradientBackground>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
