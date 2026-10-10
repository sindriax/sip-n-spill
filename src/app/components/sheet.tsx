"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SheetProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Sheet({ title, subtitle, isOpen, onClose, closeLabel, children, footer }: SheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#1d0638] border border-white/15 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="sticky top-0 z-10 flex items-center justify-between px-6 pt-5 pb-3 bg-[#1d0638]/95 backdrop-blur-md border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                {subtitle && <p className="text-xs uppercase tracking-wider text-white/60">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
              >
                ✕
              </button>
            </header>

            <div className="px-6 py-5">{children}</div>

            {footer && <div className="px-6 pb-8 sm:pb-6">{footer}</div>}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
