"use client";

interface FooterProps {
  footerText: string;
}

export default function Footer({ footerText }: FooterProps) {
  return (
    <footer className="w-full mt-2 sm:mt-6 text-xs text-stone-800 p-2 sm:p-3 text-center">
      <p>{footerText.replace("{year}", new Date().getFullYear().toString())}</p>
    </footer>
  );
}
