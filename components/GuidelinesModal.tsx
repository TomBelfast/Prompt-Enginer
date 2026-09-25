import React, { useState } from 'react';
import { GUIDELINES_2026 } from '../data/guidelines2026';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'pl' | 'en'>('pl');
  const [expandedId, setExpandedId] = useState<string>('xml-delimiters');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guidelines-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30">
                Wrzesień 2026 / Sep 2026 Standard
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Gemini 3 & Frontier Models</span>
            </div>
            <h2 id="guidelines-title" className="text-xl font-bold text-gray-900 dark:text-white mt-1">
              {lang === 'pl' 
                ? 'Standardy i Wytyczne Prompt Engineeringu (Wrzesień 2026)' 
                : 'Frontier Prompt Engineering Guidelines (September 2026)'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex bg-gray-200 dark:bg-gray-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setLang('pl')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === 'pl' 
                    ? 'bg-white dark:bg-gray-700 text-lime-600 dark:text-lime-300 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                PL
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === 'en' 
                    ? 'bg-white dark:bg-gray-700 text-lime-600 dark:text-lime-300 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Zamknij"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Introduction Banner */}
        <div className="bg-lime-500/10 dark:bg-lime-950/30 border-b border-lime-500/20 px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
          <p>
            {lang === 'pl' ? (
              <>
                <strong>Co zmieniło się w promptowaniu we wrześniu 2026?</strong> Wczesne podejścia ("You are an expert", naiwne "think step by step") powodowały pochlebstwa (sycophancy) i gubienie wątku w milionowych oknach kontekstu. Nowe wytyczne opierają się na <strong>semantycznych znacznikach XML</strong>, <strong>instrukcjach fazy namysłu (deliberation)</strong>, <strong>ścisłych regułach negatywnych</strong> oraz <strong>kontraktach schematów wyjściowych</strong>.
              </>
            ) : (
              <>
                <strong>What shifted in prompt engineering by September 2026?</strong> Early approaches ("You are an expert", naive "think step-by-step") produce sycophancy and context-drift. Modern guidelines mandate <strong>semantic XML tags</strong>, <strong>reasoning phase deliberation</strong>, <strong>negative guardrails</strong>, and <strong>strict output contracts</strong>.
              </>
            )}
          </p>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-6 space-y-4 flex-grow">
          {GUIDELINES_2026.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                key={item.id}
                className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900/40 transition-all hover:border-lime-500/40"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {item.badge}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                      {lang === 'pl' ? item.titlePl : item.title}
                    </h3>
                  </div>
                  <span className="text-gray-400 text-sm font-mono">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-5 space-y-4 border-t border-gray-200 dark:border-gray-800 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {lang === 'pl' ? 'Podsumowanie wytycznej:' : 'Summary:'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {lang === 'pl' ? item.summaryPl : item.summary}
                      </p>
                    </div>

                    <div className="bg-blue-50/60 dark:bg-blue-950/20 border-l-4 border-blue-500 p-3 rounded-r-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1 text-xs uppercase tracking-wider">
                        {lang === 'pl' ? 'Dlaczego to kluczowe we wrześniu 2026?' : 'Why is this critical in 2026?'}
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200 text-xs leading-relaxed">
                        {lang === 'pl' ? item.why2026Pl : item.why2026}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
                        <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 block mb-1">
                          ✓ {lang === 'pl' ? 'Zalecany wzorzec 2026' : 'Recommended 2026 Pattern'}
                        </span>
                        <pre className="text-xs text-emerald-900 dark:text-emerald-200 font-mono whitespace-pre-wrap overflow-x-auto">
                          {item.exampleGood}
                        </pre>
                      </div>

                      <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-500/30 rounded-lg p-3">
                        <span className="text-xs font-bold uppercase text-red-700 dark:text-red-400 block mb-1">
                          ✕ {lang === 'pl' ? 'Przestarzały antywzorzec' : 'Deprecated Anti-Pattern'}
                        </span>
                        <pre className="text-xs text-red-900 dark:text-red-200 font-mono whitespace-pre-wrap overflow-x-auto">
                          {item.exampleBad}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Opracowane zgodnie ze standardami Google Gemini 3 i frontier AI (09.2026).</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-lime-500 to-emerald-500 text-gray-900 font-bold rounded-lg hover:from-lime-400 hover:to-emerald-400 transition-all"
          >
            {lang === 'pl' ? 'Zrozumiałem, zamknij' : 'Got it, close'}
          </button>
        </div>
      </div>
    </div>
  );
};
