import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { StructuredPrompt } from '../types/prompt';
import { ComplianceScorecardView } from './ComplianceScorecardView';
import { PromptSandboxModal } from './PromptSandboxModal';

interface OutputPanelProps {
  prompt: StructuredPrompt | null;
  isLoading: boolean;
  error: string | null;
  onOpenGuidelines: () => void;
}

type ActiveTab = 'full' | 'compact' | 'audit';

export const OutputPanel: React.FC<OutputPanelProps> = ({
  prompt,
  isLoading,
  error,
  onOpenGuidelines
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('full');
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    setActiveTab('full');
  }, [prompt]);

  const getCurrentText = () => {
    if (!prompt) return '';
    return activeTab === 'compact' ? prompt.compact : prompt.full;
  };

  const handleCopy = () => {
    const contentToCopy = getCurrentText();
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
    }
  };

  const handleExport = () => {
    const contentToExport = getCurrentText();
    if (!contentToExport) return;

    const blob = new Blob([contentToExport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeTab === 'compact' ? 'system-prompt-2026.md' : 'frontier-prompt-2026.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-full border-4 border-lime-500/20 border-t-lime-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-lime-500">2026</span>
            </div>
          </div>
          <p className="text-base font-bold text-gray-800 dark:text-gray-100">
            Architektura Promptu Frontier 2026...
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Model analizuje granice XML, postawę kognitywną, instrukcje fazy myślenia (deliberation) oraz reguły negatywne.
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base font-bold">Wystąpił błąd podczas generowania</p>
          <p className="text-xs mt-1 max-w-md bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
        </div>
      );
    }

    if (!prompt) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              Twój ustrukturyzowany prompt pojawi się tutaj
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Wybierz szablon lub wpisz ideę po lewej stronie, aby przekształcić ją według standardów na wrzesień 2026 r.
            </p>
          </div>
          <button
            onClick={onOpenGuidelines}
            className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline"
          >
            Sprawdź, co wyróżnia wytyczne z września 2026 →
          </button>
        </div>
      );
    }

    if (activeTab === 'audit') {
      return (
        <div className="w-full h-full overflow-y-auto">
          <ComplianceScorecardView 
            scorecard={prompt.scorecard} 
            explanation={prompt.explanation} 
          />
        </div>
      );
    }

    const contentToDisplay = activeTab === 'full' ? prompt.full : prompt.compact;
    const charCount = contentToDisplay.length;
    const approxTokens = Math.round(charCount / 4);

    return (
      <div className="w-full h-full flex flex-col">
        {/* Metric bar */}
        <div className="px-4 py-2 bg-gray-50/80 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span>Długość: <strong className="text-gray-700 dark:text-gray-300">{charCount}</strong> znaków</span>
            <span>Estymowane tokeny: <strong className="text-gray-700 dark:text-gray-300">~{approxTokens}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Wynik audytu: {prompt.scorecard.overallScore}/100
            </span>
          </div>
        </div>

        {/* Markdown output */}
        <div className="flex-grow overflow-y-auto p-4 text-xs font-mono text-gray-800 dark:text-gray-200 leading-relaxed bg-white dark:bg-gray-900/40">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => <h1 className="text-base font-bold mb-2 pb-1 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" {...props} />,
              h2: ({ ...props }) => <h2 className="text-sm font-bold mt-3 mb-1 text-gray-900 dark:text-gray-100" {...props} />,
              h3: ({ ...props }) => <h3 className="text-xs font-bold mt-2 text-gray-800 dark:text-gray-200" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 pl-1 text-gray-700 dark:text-gray-300" {...props} />,
              p: ({ ...props }) => <p className="mb-2" {...props} />,
              strong: ({ ...props }) => <strong className="font-bold text-lime-600 dark:text-lime-400" {...props} />,
              code: ({ ...props }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[11px] text-lime-700 dark:text-lime-300" {...props} />,
              pre: ({ ...props }) => <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-[11px] my-2" {...props} />,
            }}
          >
            {contentToDisplay}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800/60 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/80 flex flex-col h-full overflow-hidden transition-all duration-300">
        {/* Top Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700/80 flex flex-wrap justify-between items-center gap-2 bg-gray-50/50 dark:bg-gray-900/30">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                Ustrukturyzowany Prompt 2026
              </h2>
              {prompt && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Ocena: {prompt.scorecard.overallScore}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Optymalizowany pod modele Gemini 3 & rozumowanie frontierowe.
            </p>
          </div>

          {prompt && !isLoading && (
            <div className="flex items-center gap-2">
              {/* Test in Sandbox button */}
              <button
                onClick={() => setIsSandboxOpen(true)}
                className="bg-lime-500/10 hover:bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all"
                title="Przetestuj prompt na żywo w modelu Gemini"
              >
                <svg className="w-3.5 h-3.5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Testuj (Sandbox)</span>
              </button>

              <button
                onClick={handleCopy}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <CopyIcon />
                <span>{copied ? 'Skopiowano!' : 'Kopiuj'}</span>
              </button>

              <button
                onClick={handleExport}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all"
                title="Pobierz jako plik .md"
              >
                <DownloadIcon />
                <span>Pobierz</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        {prompt && !isLoading && !error && (
          <div className="px-4 pt-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('full')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'full'
                    ? 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Pełny Prompt (XML/Markdown)
              </button>

              <button
                onClick={() => setActiveTab('compact')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'compact'
                    ? 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                System Instruction / Compact
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'audit'
                    ? 'bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/30'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span>Audyt Wytycznych 2026</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-mono">
                  {prompt.scorecard.overallScore}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Main Display Area */}
        <div className="flex-grow min-h-[240px] relative overflow-hidden">
          {renderContent()}
        </div>
      </div>

      {/* Sandbox modal */}
      {prompt && (
        <PromptSandboxModal
          isOpen={isSandboxOpen}
          onClose={() => setIsSandboxOpen(false)}
          systemPrompt={activeTab === 'compact' ? prompt.compact : prompt.full}
        />
      )}
    </>
  );
};
