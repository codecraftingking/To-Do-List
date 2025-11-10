import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center h-8 w-14 p-1 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className={`${
          theme === 'light' ? 'translate-x-0' : 'translate-x-6'
        } inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out`}
      />
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <SunIcon className={`h-4 w-4 text-yellow-500 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-50' : 'opacity-100'}`} />
        <MoonIcon className={`h-4 w-4 text-slate-400 transition-opacity duration-300 ${theme === 'light' ? 'opacity-50' : 'opacity-100'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;
