import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { testPromptInSandbox } from '../services/geminiService';

interface PromptSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
}

export const PromptSandboxModal: React.FC<PromptSandboxModalProps> = ({
  isOpen,
  onClose,
  systemPrompt
}) => {
  const [testInput, setTestInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunTest = async () => {
    setIsRunning(true);
    setError(null);
    const start = performance.now();

    try {
      const output = await testPromptInSandbox(systemPrompt, testInput);
      setSandboxOutput(output);
      setExecutionTime(Math.round(performance.now() - start));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd podczas uruchamiania testu w piaskownicy Gemini.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sandbox-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-lime-500/20 text-lime-600 dark:text-lime-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <h2 id="sandbox-title" className="text-lg font-bold text-gray-900 dark:text-white">
                Live Prompt Sandbox (Gemini 3.8 Flash)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Przetestuj wygenerowany prompt w środowisku wykonawczym i zweryfikuj odpowiedź modelu.
              </p>
            </div>
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

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {/* Active Prompt Preview */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Aktywny Prompt (Struktura 2026):
            </label>
            <div className="max-h-36 overflow-y-auto bg-gray-50 dark:bg-gray-950/70 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-700 dark:text-gray-300">
              <pre className="whitespace-pre-wrap">{systemPrompt}</pre>
            </div>
          </div>

          {/* Test Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Przykładowe dane wejściowe dla promptu (Opcjonalne):
            </label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Wprowadź przykładowy problem, fragment kodu lub pytanie, na które prompt ma odpowiedzieć..."
              className="w-full h-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Trigger Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Silnik testowy: <strong className="text-lime-600 dark:text-lime-400">gemini-3.8-flash</strong>
            </span>
            <button
              onClick={handleRunTest}
              disabled={isRunning}
              className="bg-gradient-to-r from-lime-500 to-emerald-500 text-gray-900 font-bold text-xs py-2.5 px-5 rounded-lg flex items-center gap-2 hover:from-lime-400 hover:to-emerald-400 transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Wykonywanie w modelu Gemini...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Uruchom Test Promptu
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Sandbox Output */}
          {sandboxOutput && (
            <div className="border border-lime-500/30 bg-gray-50/70 dark:bg-gray-950/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Odpowiedź modelu Gemini 3.8 Flash
                </span>
                {executionTime && (
                  <span className="text-[11px] text-gray-400 font-mono">
                    Czas: {executionTime} ms
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-800 dark:text-gray-200 prose prose-xs dark:prose-invert max-w-none pt-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {sandboxOutput}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
