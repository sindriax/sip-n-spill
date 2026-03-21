"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Rule {
  header?: string;
  text: string;
}

interface RulesSectionProps {
  gameRulesTitle: string;
  rules: Rule[];
  isOpen: boolean;
  onClose: () => void;
}

function formatText(text: string): (string | React.JSX.Element)[] {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      const boldText = part.slice(1, -1);
      return (
        <strong key={index} className="text-white">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}

export default function RulesSection({
  gameRulesTitle,
  rules,
  isOpen,
  onClose,
}: RulesSectionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 pb-3 bg-[#2a1035]/95 backdrop-blur-md rounded-t-3xl border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{gameRulesTitle}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white/80 hover:text-white"
                aria-label="Close rules"
              >
                ✕
              </button>
            </div>

            {/* Rules List */}
            <ul className="p-5 pt-4 space-y-4">
              {rules.map((rule, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="flex gap-3"
                >
                  {rule.header && (
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold text-white/90">
                      {index + 1}
                    </span>
                  )}
                  <div className="text-sm text-white/80 leading-relaxed">
                    {rule.header && (
                      <strong className="block text-white mb-0.5">
                        {rule.header}
                      </strong>
                    )}
                    {formatText(rule.text)}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
