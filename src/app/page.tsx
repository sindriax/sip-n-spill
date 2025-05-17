"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function HomePage() {
  const [language, setLanguage] = useState("es"); // Default language to Spanish ("es")
  const router = useRouter(); // Initialize router

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleStartGame = () => {
    // Navigate to the play page with the selected language as a query parameter
    router.push(`/play?lang=${language}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-br from-purple-600 to-blue-500 text-white font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 items-center bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-2xl">
        <h1 className="text-6xl font-bold tracking-tight">Sip &apos;n Spill</h1>

        <div className="flex flex-col gap-4 items-center">
          <label htmlFor="language-select" className="text-lg font-medium">
            Select Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="px-4 py-2 rounded-md bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-white focus:outline-none"
          >
            <option value="es" className="text-black">
              Español
            </option>
            <option value="en" className="text-black">
              English
            </option>
            <option value="fr" className="text-black">
              Français
            </option>
            {/* Add more languages as needed */}
          </select>
        </div>

        {/* Updated button to call handleStartGame */}
        <button
          onClick={handleStartGame}
          className="px-10 py-4 bg-yellow-400 text-purple-700 font-semibold rounded-lg text-2xl shadow-lg hover:bg-yellow-300 transition-colors duration-150 ease-in-out transform hover:scale-105"
        >
          Start Game
        </button>

        <div className="mt-6 p-6 bg-white/5 rounded-lg max-w-md text-left">
          <h2 className="text-2xl font-semibold mb-3 text-center">
            Game Rules
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Player one silently reads the first question to themselves.</li>
            <li>
              Player one then points to each player and guesses whether they
              have done what the question describes.
            </li>
            <li>
              After guessing for all players, player one reads the question
              aloud.
            </li>
            <li>
              Any player who has done what the question describes takes a sip of
              their drink.
            </li>

            <li>Player one passes the phone to the person on their right.</li>
            <li>The next player taps the screen to reveal a new question.</li>
            <li>The next player silently reads the question to themselves.</li>
            <li>
              Continue until all questions have been answered or you decide to
              stop.
            </li>
            <li>Most importantly: have fun and drink responsibly!</li>
          </ul>
        </div>
      </main>

      <footer className="mt-12 text-xs text-white/70">
        <p>
          &copy; {new Date().getFullYear()} Sip &apos;n Spill. Created with fun.
        </p>
      </footer>
    </div>
  );
}
