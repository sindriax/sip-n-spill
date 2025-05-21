"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface Rule {
  header: string;
  text: string;
}

interface RulesSectionProps {
  gameRulesTitle: string;
  rules: Rule[];
  showRules: boolean;
  toggleRules: () => void;
}

const rulesContainerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const ruleItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function RulesSection({
  gameRulesTitle,
  rules,
  showRules,
  toggleRules,
}: RulesSectionProps) {
  return (
    <div className="mt-4 md:mt-6 bg-[#ff937d] rounded-lg shadow-lg max-w-md w-full text-left">
      <button
        onClick={toggleRules}
        className="w-full flex justify-between items-center p-4 md:p-5 text-lg md:text-xl font-semibold text-white focus:outline-none rounded-t-lg hover:bg-white/10 active:bg-white/20 transition-colors duration-150"
        aria-expanded={showRules}
        aria-controls="game-rules-list"
      >
        <span>{gameRulesTitle}</span>
        <span
          className={`transform transition-transform duration-200 ${
            showRules ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>
      <AnimatePresence>
        {showRules && (
          <motion.ul
            id="game-rules-list"
            variants={rulesContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-2 text-sm md:text-base text-orange-50 p-4 md:p-5 pt-2 md:pt-3 bg-white/5 rounded-b-lg overflow-hidden"
          >
            {rules.map((rule, index) => (
              <motion.li
                key={index}
                variants={ruleItemVariants}
                className="leading-relaxed"
              >
                {rule.header && (
                  <strong className="block mb-0.5">{rule.header}</strong>
                )}
                {rule.text}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
