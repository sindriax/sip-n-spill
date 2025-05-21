"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeaderLogoProps {
  altText: string;
  isAnimating: boolean;
  imageSrc?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({
  altText,
  isAnimating,
  imageSrc = "/assets/sip-round.png",
}) => {
  return (
    <motion.div
      className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-xs"
      animate={
        isAnimating
          ? {
              rotateY: 360,
              scale: 0.8,
              transition: { duration: 0.5, ease: "easeInOut" },
            }
          : {}
      }
    >
      <Image
        src={imageSrc}
        alt={altText}
        width={500}
        height={300}
        className="w-full h-auto"
        priority
      />
    </motion.div>
  );
};

export default HeaderLogo;
