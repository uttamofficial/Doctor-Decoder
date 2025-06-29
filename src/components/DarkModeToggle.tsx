import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: (isDarkMode: boolean) => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(!isDarkMode)}
      className="flex items-center gap-2 py-2 px-4 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-opacity-100 dark:hover:bg-opacity-100 hover:shadow-medium transition-all duration-300 font-medium text-gray-700 dark:text-gray-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Sun 
          className={`w-5 h-5 text-yellow-500 absolute transition-all duration-300 ${
            isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`} 
        />
        <Moon 
          className={`w-5 h-5 text-blue-400 absolute transition-all duration-300 ${
            isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`} 
        />
      </div>
      <span className="text-lg">
        {isDarkMode ? '🌙' : '🌞'}
      </span>
    </button>
  );
};

export default DarkModeToggle;