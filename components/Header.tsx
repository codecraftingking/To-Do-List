import React from 'react';
import { CheckCircleIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
  return (
    <header className="flex justify-between items-center animate-slide-in">
      <div className="flex items-center gap-3">
        <CheckCircleIcon className="h-9 w-9 text-indigo-500" />
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white tracking-tight">
              Gemini To-Do
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                Your smart assistant for staying organized.
            </p>
        </div>
      </div>
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
    </header>
  );
};

export default Header;
