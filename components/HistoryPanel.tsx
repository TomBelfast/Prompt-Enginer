import React from 'react';
import { HistoryItem } from '../types/prompt';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  const getFrameworkLabel = (fw?: string) => {
    switch (fw) {
      case 'frontier_xml': return 'Frontier XML';
      case 'reasoning_cot': return 'Reasoning CoT';
      case 'agentic_tool': return 'Agentic Tool';
      case 'rocce_plus': return 'Executive ROCCE+';
      default: return 'Standard 2026';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/80 flex flex-col h-full max-h-[calc(100vh-140px)] overflow-hidden transition-all duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700/80 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Historia Promptów</h2>
            <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {history.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Twoje wcześniejsze wersje promptów.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Wyczyść całą historię"
            aria-label="Wyczyść całą historię"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-3 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 text-center px-4 py-8">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Brak zapisanych promptów</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Wygenerowane prompty pojawią się na tej liście.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 rounded-xl bg-gray-50/80 dark:bg-gray-900/50 hover:bg-lime-50/50 dark:hover:bg-lime-950/20 border border-gray-200/60 dark:border-gray-800 hover:border-lime-500/40 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-lime-500/10 text-lime-700 dark:text-lime-300 border border-lime-500/20">
                      {getFrameworkLabel(item.structuredPrompt?.framework)}
                    </span>
                    {item.structuredPrompt?.scorecard?.overallScore && (
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.structuredPrompt.scorecard.overallScore}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-lime-600 dark:group-hover:text-lime-400">
                    {item.userInput}
                  </p>
                  {item.structuredPrompt?.full && (
                    <p className="text-[11px] text-gray-400 mt-1 truncate font-mono">
                      {item.structuredPrompt.full.substring(0, 70)}...
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
