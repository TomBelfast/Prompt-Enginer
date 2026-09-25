import React, { useState } from 'react';
import { SparkleIcon } from './icons/SparkleIcon';
import { PromptFramework, PromptOptions, TargetModel } from '../types/prompt';

interface InputPanelProps {
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
    idea: 'Autonomiczny agent finansowy, który analizuje kwartalne raporty spółek giełdowych, wywołuje zewnętrzne narzędzia kalkulacyjne i zwraca wyłącznie zwalidowany JSON.',
    framework: 'agentic_tool' as PromptFramework,
  },
  {
    title: 'Wnioskowanie & Algorytmika (CoT)',
    idea: 'Algorytm optymalizacji tras w grafie skierowanym o niskiej latencji, uwzględniający dynamiczne wagi krawędzi i rygorystyczne przypadki brzegowe.',
    framework: 'reasoning_cot' as PromptFramework,
  },
  {
    title: 'Executive ROCCE+ Strategia',
    idea: 'Strategia wejścia na rynek B2B SaaS dla platformy AI devtools w Europie, analiza konkurencji, ograniczenia prawne AI Act i wskaźniki KPI.',
    framework: 'rocce_plus' as PromptFramework,
  }
];

export const InputPanel: React.FC<InputPanelProps> = ({
  value,
  onValueChange,
  options,
  onOptionsChange,
  onGenerate,
  isLoading,
  onOpenGuidelines
}) => {
  const [touched, setTouched] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isInvalid = touched && !value.trim();
  const isDisabled = isLoading || !value.trim();

  const handleFrameworkChange = (framework: PromptFramework) => {
    onOptionsChange({ ...options, framework });
  };

  const handleModelChange = (targetModel: TargetModel) => {
    onOptionsChange({ ...options, targetModel });
  };

  const handleToggleOption = (key: keyof PromptOptions) => {
    onOptionsChange({
      ...options,
      [key]: !options[key]
    });
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    onValueChange(preset.idea);
    onOptionsChange({
      ...options,
      framework: preset.framework
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/80 flex flex-col h-full overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700/80 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
              Koncepcja Promptu / User Idea
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30">
              Sep 2026 Engine
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Wpisz prostą ideę, a model przekształci ją w prompt klasy produkcyjnej.
          </p>
        </div>

        <button
          onClick={onOpenGuidelines}
          className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1 bg-lime-500/10 px-2.5 py-1 rounded-lg border border-lime-500/20 transition-all hover:bg-lime-500/20"
          title="Zobacz wytyczne promptowania na wrzesień 2026"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Wytyczne 2026
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col overflow-y-auto space-y-4">
        {/* Presets */}
        <div>
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
            Szybkie szablony (Wzorce 2026):
          </span>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.title}
                onClick={() => applyPreset(preset)}
                className="text-left p-2 rounded-lg text-xs bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 hover:border-lime-500/50 hover:bg-lime-50/30 dark:hover:bg-lime-950/20 text-gray-700 dark:text-gray-300 transition-all group"
              >
                <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-lime-600 dark:group-hover:text-lime-400">
                  {preset.title}
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                  {preset.idea}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-grow flex flex-col min-h-[140px]">
          <textarea
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="np. Aplikacja backendowa w Node.js do autoryzacji sesji użytkowników z zabezpieczeniem przed replay-attack i logowaniem incydentów do CloudWatch..."
            className={`w-full flex-grow bg-gray-50 dark:bg-gray-900/70 border rounded-xl p-3.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none transition-all duration-200 resize-none ${
              isInvalid
                ? 'border-red-500 ring-2 ring-red-500/40'
                : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400'
            }`}
            rows={5}
            aria-invalid={isInvalid}
          />
          {isInvalid && (
            <p className="text-red-500 text-xs mt-1">
              Wprowadź pomysł, aby wygenerować profesjonalny prompt.
            </p>
          )}
        </div>

        {/* Framework Selector (2026 Standards) */}
        <div>
          <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
            Architektura Frameworku (Standard 2026):
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFrameworkChange('frontier_xml')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                options.framework === 'frontier_xml'
                  ? 'bg-lime-500/10 border-lime-500 dark:bg-lime-500/20 text-lime-800 dark:text-lime-200 ring-1 ring-lime-500'
                  : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between">
                <span>Frontier XML Tagged</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-lime-500/20 font-mono">2026 Std</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                Semantyczne tagi (&lt;task&gt;, &lt;constraints&gt;) dla Gemini 3 i Claude 3.7+
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleFrameworkChange('reasoning_cot')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                options.framework === 'reasoning_cot'
                  ? 'bg-lime-500/10 border-lime-500 dark:bg-lime-500/20 text-lime-800 dark:text-lime-200 ring-1 ring-lime-500'
                  : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between">
                <span>Deep Reasoning (CoT)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 font-mono text-blue-600 dark:text-blue-300">STEM/Logic</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                Faza deliberacji myślenia, hipotezy, testy przypadków brzegowych
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleFrameworkChange('agentic_tool')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                options.framework === 'agentic_tool'
                  ? 'bg-lime-500/10 border-lime-500 dark:bg-lime-500/20 text-lime-800 dark:text-lime-200 ring-1 ring-lime-500'
                  : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between">
                <span>Agentic & Tool-Use</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 font-mono text-purple-600 dark:text-purple-300">Agents</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                Autonomiczne pętle, wywołania funkcji, rygorystyczny kontrakt JSON
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleFrameworkChange('rocce_plus')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                options.framework === 'rocce_plus'
                  ? 'bg-lime-500/10 border-lime-500 dark:bg-lime-500/20 text-lime-800 dark:text-lime-200 ring-1 ring-lime-500'
                  : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between">
                <span>Executive ROCCE+</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 font-mono text-amber-600 dark:text-amber-300">Business</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                Rola, Cel, Kontekst, Ograniczenia, Ewaluacja (zero-fluff)
              </p>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced 2026 Directives */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-900/40">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-2.5 px-3 flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>⚙️ Zaawansowane Dyrektywy 2026 ({Object.values(options).filter(v => v === true).length} aktywne)</span>
            </span>
            <span className="font-mono text-gray-400 text-xs">{showAdvanced ? '▲ Zwiń' : '▼ Rozwiń'}</span>
          </button>

          {showAdvanced && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2.5 text-xs">
              {/* Target Model */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Model docelowy:
                </label>
                <select
                  value={options.targetModel}
                  onChange={(e) => handleModelChange(e.target.value as TargetModel)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-1.5 text-xs text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-lime-500"
                >
                  <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Najszybszy Frontier)</option>
                  <option value="gemini-3.1-pro-preview">Google Gemini 3.1 Pro (Głębokie wnioskowanie)</option>
                  <option value="universal">Universal Frontier 2026 (Uniwersalny)</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Język wygenerowanego promptu:
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'auto', label: 'Automatyczny (Zgodny z ideą)' },
                    { id: 'pl', label: 'Polski (PL)' },
                    { id: 'en', label: 'English (EN)' }
                  ].map(l => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => onOptionsChange({ ...options, language: l.id as any })}
                      className={`px-2 py-1 rounded text-[11px] border font-medium ${
                        options.language === l.id
                          ? 'bg-lime-500 text-gray-900 border-lime-500 font-bold'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeXmlTags}
                    onChange={() => handleToggleOption('includeXmlTags')}
                    className="w-3.5 h-3.5 rounded text-lime-600 focus:ring-lime-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                    Semantyczne znaczniki XML (<code className="text-[10px] bg-gray-200 dark:bg-gray-800 px-1 rounded">&lt;context&gt;</code>, <code className="text-[10px] bg-gray-200 dark:bg-gray-800 px-1 rounded">&lt;task&gt;</code>)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeReasoningPhase}
                    onChange={() => handleToggleOption('includeReasoningPhase')}
                    className="w-3.5 h-3.5 rounded text-lime-600 focus:ring-lime-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                    Faza namysłu / instrukcje deliberacji (<code className="text-[10px] bg-gray-200 dark:bg-gray-800 px-1 rounded">&lt;thinking_process&gt;</code>)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeNegativeConstraints}
                    onChange={() => handleToggleOption('includeNegativeConstraints')}
                    className="w-3.5 h-3.5 rounded text-lime-600 focus:ring-lime-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                    Negatywne guardraile & anty-halucynacje (Czego model NIE może robić)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeFewShot}
                    onChange={() => handleToggleOption('includeFewShot')}
                    className="w-3.5 h-3.5 rounded text-lime-600 focus:ring-lime-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                    Wzorzec kanoniczny Few-Shot (Input/Output z przypadkiem brzegowym)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeVerificationRubric}
                    onChange={() => handleToggleOption('includeVerificationRubric')}
                    className="w-3.5 h-3.5 rounded text-lime-600 focus:ring-lime-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                    Wbudowana rubryka samoweryfikacji (Checklist przed wygenerowaniem)
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Submit */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-900/30">
        <button
          onClick={onGenerate}
          disabled={isDisabled}
          className="w-full bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 text-gray-900 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-lime-300 hover:to-emerald-400 shadow-lg shadow-lime-500/20 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generowanie struktury wg wytycznych 2026...</span>
            </>
          ) : (
            <>
              <SparkleIcon />
              <span>Strukturyzuj wg Wytycznych Wrzesień 2026</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
