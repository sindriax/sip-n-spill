import Link from "next/link";
import Image from "next/image";
import GradientBackground from "./components/gradient-background";

export default function NotFound() {
  return (
    <GradientBackground withSparkles>
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-white font-[family-name:var(--font-geist-sans)]">
        <Image src="/assets/sippin.png" alt="" width={200} height={200} className="w-[140px] h-auto mb-6" priority />
        <h1 className="text-2xl font-bold">This page spilled.</h1>
        <p className="text-white/70 mt-1">Esta página no existe.</p>
        <Link
          href="/"
          className="mt-8 inline-block py-3 px-8 rounded-2xl gradient-gold-shine text-stone-900 font-extrabold glow-gold active:scale-[0.98] transition-transform"
        >
          Sip &apos;n Spill
        </Link>
      </main>
    </GradientBackground>
  );
}
