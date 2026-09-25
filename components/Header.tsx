import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { Theme } from '../App';

interface HeaderProps {
  onToggleHistory: () => void;
  isHistoryVisible: boolean;
  onToggleTheme: () => void;
  currentTheme: Theme;
  onOpenGuidelines: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  isHistoryVisible,
  onToggleTheme,
  currentTheme,
  onOpenGuidelines
}) => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 transition-colors">
      <div className="container mx-auto flex justify-between items-center gap-4">
        {/* Left Side: Theme & Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl text-gray-500 hover:text-lime-600 dark:text-gray-400 dark:hover:text-lime-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={currentTheme === 'dark' ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}
            aria-label={currentTheme === 'dark' ? "Aktywuj tryb jasny" : "Aktywuj tryb ciemny"}
          >
            {currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            onClick={onOpenGuidelines}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500/10 hover:bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30 text-xs font-bold transition-all"
            title="Kliknij, aby przeczytać zaktualizowane wytyczne prompt engineeringu z września 2026 r."
          >
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span>Wytyczne: Wrzesień 2026</span>
          </button>
        </div>
        
        {/* Center: Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-500 via-emerald-500 to-teal-500">
              Prompt Structurizer 2026
            </h1>
            <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Frontier v3.8
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">
            Architektura promptów nowej generacji oparta na standardach Gemini 3 & rozumowania
          </p>
        </div>
        
        {/* Right Side: Guidelines Mobile & History Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuidelines}
            className="sm:hidden p-2 rounded-xl text-lime-600 dark:text-lime-400 bg-lime-500/10 border border-lime-500/20 text-xs font-bold"
            title="Wytyczne 2026"
          >
            2026 ℹ️
          </button>

          <button
            onClick={onToggleHistory}
            className={`p-2.5 rounded-xl transition-all ${
              isHistoryVisible
                ? 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30'
                : 'text-gray-500 hover:text-lime-600 dark:text-gray-400 dark:hover:text-lime-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={isHistoryVisible ? "Ukryj historię" : "Pokaż historię"}
            aria-label={isHistoryVisible ? "Ukryj panel historii" : "Pokaż panel historii"}
          >
            <HistoryIcon />
          </button>
        </div>
      </div>
    </header>
  );
};
