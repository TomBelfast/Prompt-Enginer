import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputHero } from './components/InputHero';
import { OutputPanel } from './components/OutputPanel';
import { SettingsPanel } from './components/SettingsPanel';
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
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('prompt-history-2026');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
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
    // Scroll smoothly to output
    window.scrollTo({ top: 320, behavior: 'smooth' });
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
    <div className="min-h-screen text-gray-800 dark:text-gray-100 font-sans flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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
        inputHero={
          <InputHero
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
        settingsPanel={
          <SettingsPanel
            options={options}
            onOptionsChange={setOptions}
          />
        }
      />

      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      <footer className="text-center p-5 text-gray-500 dark:text-gray-400 text-xs border-t border-gray-200 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/50 mt-auto">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Prompt Structurizer 2026</span>
            <span>•</span>
            <span>Standard: <strong>Wrzesień 2026</strong></span>
            <span>•</span>
            <span>Silnik: <strong>Gemini 3.8 Flash</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuidelinesOpen(true)}
              className="text-lime-600 dark:text-lime-400 hover:underline font-semibold"
            >
              Wytyczne Prompt Engineeringu
            </button>
            <button
              onClick={handleToggleHistory}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {isHistoryVisible ? 'Ukryj historię' : 'Pokaż historię'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
