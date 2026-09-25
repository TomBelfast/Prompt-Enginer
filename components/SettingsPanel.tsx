import React, { useState } from 'react';
import { PromptFramework, PromptOptions, TargetModel } from '../types/prompt';

interface SettingsPanelProps {
  options: PromptOptions;
  onOptionsChange: (options: PromptOptions) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  options,
  onOptionsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const activeDirectivesCount = [
    options.includeXmlTags,
    options.includeReasoningPhase,
    options.includeNegativeConstraints,
    options.includeFewShot,
    options.includeVerificationRubric
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-all">
      {/* Header bar that can be toggled */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left bg-gray-50/70 dark:bg-gray-800/40 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                Ustawienia Architektury Promptu & Opcje Zaawansowane
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-lime-500/20 text-lime-700 dark:text-lime-300">
                {options.framework.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Dostosuj framework architektoniczny (XML, CoT, Agentic, ROCCE+), model docelowy i reguły walidacji ({activeDirectivesCount} aktywnych reguł).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <span className="hidden sm:inline font-mono">{isOpen ? 'Zwiń ustawienia' : 'Rozwiń ustawienia'}</span>
          <span className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-800 font-mono text-xs">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-5 border-t border-gray-200 dark:border-gray-800 space-y-5 animate-fadeIn">
          {/* Framework Selector */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-2">
              Wybierz Framework Inżynieryjny:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleFrameworkChange('frontier_xml')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.framework === 'frontier_xml'
                    ? 'bg-lime-500/10 border-lime-500 text-lime-900 dark:text-lime-100 ring-2 ring-lime-500/30'
                    : 'bg-gray-50 dark:bg-gray-950/40 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Frontier XML Tagged</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-lime-500/20 font-mono font-bold">2026 Std</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Semantyczne tagi (&lt;task&gt;, &lt;constraints&gt;) – standard dla Gemini 3 i Claude 3.7+
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleFrameworkChange('reasoning_cot')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.framework === 'reasoning_cot'
                    ? 'bg-lime-500/10 border-lime-500 text-lime-900 dark:text-lime-100 ring-2 ring-lime-500/30'
                    : 'bg-gray-50 dark:bg-gray-950/40 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Deep Reasoning (CoT)</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-300 font-mono font-bold">STEM</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Faza deliberacji myślenia, hipotezy, testy przypadków brzegowych
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleFrameworkChange('agentic_tool')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.framework === 'agentic_tool'
                    ? 'bg-lime-500/10 border-lime-500 text-lime-900 dark:text-lime-100 ring-2 ring-lime-500/30'
                    : 'bg-gray-50 dark:bg-gray-950/40 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Agentic & Tool-Use</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono font-bold">Agents</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Autonomiczne pętle, wywołania funkcji, rygorystyczny kontrakt JSON
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleFrameworkChange('rocce_plus')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.framework === 'rocce_plus'
                    ? 'bg-lime-500/10 border-lime-500 text-lime-900 dark:text-lime-100 ring-2 ring-lime-500/30'
                    : 'bg-gray-50 dark:bg-gray-950/40 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Executive ROCCE+</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-bold">Business</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Rola, Cel, Kontekst, Ograniczenia, Ewaluacja (zero-fluff)
                </p>
              </button>
            </div>
          </div>

          {/* Model & Language Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-800">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-1.5">
                Model Docelowy:
              </label>
              <select
                value={options.targetModel}
                onChange={(e) => handleModelChange(e.target.value as TargetModel)}
                className="w-full bg-gray-50 dark:bg-gray-950/70 border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lime-500"
              >
                <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Szybki & Frontier Standard)</option>
                <option value="gemini-3.1-pro-preview">Google Gemini 3.1 Pro (Głębokie rozumowanie)</option>
                <option value="universal">Universal Frontier 2026 (Uniwersalny pod dowolny LLM)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-1.5">
                Język Promptu:
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'auto', label: 'Automatyczny' },
                  { id: 'pl', label: 'Polski (PL)' },
                  { id: 'en', label: 'English (EN)' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onOptionsChange({ ...options, language: l.id as any })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs border font-medium transition-all ${
                      options.language === l.id
                        ? 'bg-lime-500 text-gray-950 border-lime-500 font-bold shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-950/40 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Checkboxes for 2026 Directives */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-2.5">
              Zaawansowane Reguły & Dyrektywy 2026:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-lime-500/50">
                <input
                  type="checkbox"
                  checked={options.includeXmlTags}
                  onChange={() => handleToggleOption('includeXmlTags')}
                  className="mt-0.5 w-4 h-4 rounded text-lime-600 focus:ring-lime-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">
                    Semantyczne Tagi XML
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Wymusza &lt;context&gt;, &lt;task&gt;, &lt;constraints&gt;
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-lime-500/50">
                <input
                  type="checkbox"
                  checked={options.includeReasoningPhase}
                  onChange={() => handleToggleOption('includeReasoningPhase')}
                  className="mt-0.5 w-4 h-4 rounded text-lime-600 focus:ring-lime-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">
                    Faza Myślenia (Deliberation)
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Instrukcje fazy namysłu i stawiania hipotez
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-lime-500/50">
                <input
                  type="checkbox"
                  checked={options.includeNegativeConstraints}
                  onChange={() => handleToggleOption('includeNegativeConstraints')}
                  className="mt-0.5 w-4 h-4 rounded text-lime-600 focus:ring-lime-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">
                    Reguły Negatywne (Guardrails)
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Czego model nie może robić + anty-halucynacje
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-lime-500/50">
                <input
                  type="checkbox"
                  checked={options.includeFewShot}
                  onChange={() => handleToggleOption('includeFewShot')}
                  className="mt-0.5 w-4 h-4 rounded text-lime-600 focus:ring-lime-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">
                    Wzorzec Few-Shot Kanoniczny
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Przykłady wejście/wyjście z przypadkiem brzegowym
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-lime-500/50">
                <input
                  type="checkbox"
                  checked={options.includeVerificationRubric}
                  onChange={() => handleToggleOption('includeVerificationRubric')}
                  className="mt-0.5 w-4 h-4 rounded text-lime-600 focus:ring-lime-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">
                    Rubryka Samoweryfikacji
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Lista kontrolna sprawdzana przed zwróceniem wyniku
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
