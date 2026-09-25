import React, { useState } from 'react';
import { SparkleIcon } from './icons/SparkleIcon';
import { PromptFramework, PromptOptions, TargetModel } from '../types/prompt';

interface InputHeroProps {
  value: string;
  onValueChange: (value: string) => void;
  options: PromptOptions;
  onOptionsChange: (options: PromptOptions) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onOpenGuidelines: () => void;
}

const PRESETS = [
  {
    title: 'Architektura Go & OAuth2 (XML)',
    idea: 'Zaprojektuj bezpieczną architekturę rotacji tokenów OAuth2 z natychmiastowym unieważnianiem w Go, z obsługą wyścigów wątków i fallbackiem do cache.',
    framework: 'frontier_xml' as PromptFramework,
  },
  {
    title: 'Agent Finansowy & API Tools',
    idea: 'Autonomiczny agent finansowy analizujący raporty spółek giełdowych, wywołujący narzędzia kalkulacyjne i zwracający wyłącznie zwalidowany JSON.',
    framework: 'agentic_tool' as PromptFramework,
  },
  {
    title: 'Wnioskowanie & Algorytmika (CoT)',
    idea: 'Algorytm optymalizacji tras w grafie skierowanym o niskiej latencji, uwzględniający dynamiczne wagi krawędzi i rygorystyczne przypadki brzegowe.',
    framework: 'reasoning_cot' as PromptFramework,
  },
  {
    title: 'Executive ROCCE+ Strategia',
    idea: 'Strategia wejścia na rynek B2B SaaS dla platformy AI devtools w Europie, analiza konkurencji, ograniczenia AI Act i metryki KPI.',
    framework: 'rocce_plus' as PromptFramework,
  }
];

export const InputHero: React.FC<InputHeroProps> = ({
  value,
  onValueChange,
  options,
  onOptionsChange,
  onGenerate,
  isLoading,
  onOpenGuidelines
}) => {
  const [touched, setTouched] = useState(false);
  const isInvalid = touched && !value.trim();
  const isDisabled = isLoading || !value.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to generate immediately
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isDisabled) {
        onGenerate();
      }
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    onValueChange(preset.idea);
    onOptionsChange({
      ...options,
      framework: preset.framework
    });
  };

  return (
    <section className="bg-white dark:bg-gray-900/90 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 transition-all">
      {/* Top Header of the Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
              Wprowadź pomysł na prompt
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30">
              Wrzesień 2026 Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Wpisz ideę w prostych słowach, a silnik przekształci ją w profesjonalny prompt klasy produkcyjnej.
          </p>
        </div>

        <button
          onClick={onOpenGuidelines}
          type="button"
          className="self-start sm:self-auto text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1.5 bg-lime-500/10 px-3 py-1.5 rounded-xl border border-lime-500/20 transition-all hover:bg-lime-500/20"
        >
          <svg className="w-4 h-4 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Wytyczne Promptowania 2026</span>
        </button>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={handleKeyDown}
          placeholder="np. Aplikacja backendowa w Node.js do autoryzacji sesji użytkowników z zabezpieczeniem przed replay-attack i logowaniem incydentów do CloudWatch... (lub naciśnij Ctrl + Enter)"
          className={`w-full min-h-[120px] sm:min-h-[130px] bg-gray-50 dark:bg-gray-950/70 border rounded-2xl p-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-200 resize-y shadow-inner ${
            isInvalid
              ? 'border-red-500 ring-2 ring-red-500/40'
              : 'border-gray-300 dark:border-gray-700/80 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/30'
          }`}
          rows={4}
          aria-invalid={isInvalid}
        />
        {isInvalid && (
          <p className="text-red-500 text-xs mt-1.5 font-medium">
            Proszę wpisać pomysł na prompt, aby rozpocząć strukturyzację.
          </p>
        )}
      </div>

      {/* Quick Suggestions / Presets */}
      <div className="mt-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-2">
          Szybkie przykłady:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 hover:border-lime-500/50 hover:bg-lime-50/30 dark:hover:bg-lime-950/20 text-gray-700 dark:text-gray-300 transition-all group"
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 truncate">
                {preset.title}
              </div>
              <div className="text-[11px] text-gray-400 truncate mt-0.5">
                {preset.idea}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Big Action Button directly underneath */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span>Skrót: <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px] font-mono text-gray-700 dark:text-gray-300">Ctrl + Enter</kbd></span>
          <span>•</span>
          <span>Silnik: <strong className="text-lime-600 dark:text-lime-400">Gemini 3.8 Flash</strong></span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isDisabled}
          type="button"
          className="w-full sm:w-auto min-w-[280px] bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 text-gray-950 font-black py-3 px-6 rounded-xl flex items-center justify-center gap-2.5 hover:from-lime-300 hover:to-emerald-400 shadow-lg shadow-lime-500/25 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm sm:text-base cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generowanie struktury promptu...</span>
            </>
          ) : (
            <>
              <SparkleIcon />
              <span>Strukturyzuj Prompt (Wrzesień 2026)</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
