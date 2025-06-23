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
      className="w-full px-6 py-3 bg-amber-400 text-stone-800 font-semibold rounded-lg text-lg shadow-lg hover:bg-amber-300 transition-all duration-150 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FF765D]"
    >
      {label}
    </button>
  );
};

export default StartGameButton;
