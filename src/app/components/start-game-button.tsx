"use client";

interface StartGameButtonProps {
  onClick: () => void;
  label: string;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({
  onClick,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 md:px-10 md:py-4 bg-amber-400 text-stone-800 font-semibold rounded-lg text-lg md:text-2xl shadow-lg hover:bg-amber-300 transition-all duration-150 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FF765D] w-full max-w-xs"
    >
      {label}
    </button>
  );
};

export default StartGameButton;
