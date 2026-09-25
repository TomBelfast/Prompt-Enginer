import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { MainLayout } from './components/MainLayout';
import { GuidelinesModal } from './components/GuidelinesModal';
import { generateStructuredPrompt } from './services/geminiService';
import { HistoryItem, PromptOptions, StructuredPrompt } from './types/prompt';

export type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const DEFAULT_OPTIONS: PromptOptions = {
  framework: 'frontier_xml',
  targetModel: 'gemini-3.8-flash',
  includeXmlTags: true,
  includeReasoningPhase: true,
  includeNegativeConstraints: true,
  includeFewShot: true,
  includeVerificationRubric: true,
  language: 'auto',
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [options, setOptions] = useState<PromptOptions>(DEFAULT_OPTIONS);
  const [structuredPrompt, setStructuredPrompt] = useState<StructuredPrompt | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(true);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('prompt-history-2026');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        // Fallback check for older history
        const legacy = localStorage.getItem('prompt-history');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Wprowadź pomysł na prompt, aby rozpocząć strukturyzację.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateStructuredPrompt(userInput, options);
      setStructuredPrompt(result);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        userInput,
        structuredPrompt: result,
        timestamp: Date.now(),
      };

      setHistory(prevHistory => {
        const updatedHistory = [newHistoryItem, ...prevHistory];
        try {
          localStorage.setItem('prompt-history-2026', JSON.stringify(updatedHistory));
        } catch (error) {
          console.error("Failed to save history to localStorage", error);
        }
        return updatedHistory;
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd. Sprawdź klucz API i spróbuj ponownie.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, options]);
  
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setUserInput(item.userInput);
    setStructuredPrompt(item.structuredPrompt);
    if (item.structuredPrompt.options) {
      setOptions(item.structuredPrompt.options);
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('prompt-history-2026');
      localStorage.removeItem('prompt-history');
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  }, []);

  const handleToggleHistory = () => {
    setIsHistoryVisible(prev => !prev);
  };
  
  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 font-sans flex flex-col bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <Header 
        onToggleHistory={handleToggleHistory} 
        isHistoryVisible={isHistoryVisible}
        onToggleTheme={handleToggleTheme}
        currentTheme={theme}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
      />

      <MainLayout
        isHistoryVisible={isHistoryVisible}
        historyPanel={
          <HistoryPanel 
            history={history} 
            onSelect={handleSelectHistory} 
            onClear={handleClearHistory} 
          />
        }
        inputPanel={
          <InputPanel
            value={userInput}
            onValueChange={setUserInput}
            options={options}
            onOptionsChange={setOptions}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            onOpenGuidelines={() => setIsGuidelinesOpen(true)}
          />
        }
        outputPanel={
          <OutputPanel
            prompt={structuredPrompt}
            isLoading={isLoading}
            error={error}
            onOpenGuidelines={() => setIsGuidelinesOpen(true)}
          />
        }
      />

      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-xs border-t border-gray-200 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/50">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Standard Inżynierii Promptów: <strong>Wrzesień 2026</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Silnik: <strong>Google Gemini 3.8 Flash</strong></span>
          <span className="hidden sm:inline">•</span>
          <button
            onClick={() => setIsGuidelinesOpen(true)}
            className="text-lime-600 dark:text-lime-400 hover:underline font-semibold"
          >
            Zobacz pełny przewodnik wytycznych
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
