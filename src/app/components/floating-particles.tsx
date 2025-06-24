"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FloatingParticles = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const particles = [
    { emoji: "🍺", delay: 0, duration: 10 },
    { emoji: "", delay: 3, duration: 12 },
    { emoji: "🥂", delay: 6, duration: 11 },
  ];

  if (windowSize.width === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-20"
          initial={{
            x: Math.random() * windowSize.width,
            y: windowSize.height + 50,
          }}
          animate={{
            y: -50,
            x: Math.random() * windowSize.width,
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles;
