import React from 'react';

interface MainLayoutProps {
  isHistoryVisible: boolean;
  historyPanel: React.ReactNode;
  inputHero: React.ReactNode;
  outputPanel: React.ReactNode;
  settingsPanel: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  isHistoryVisible, 
  historyPanel, 
  inputHero, 
  outputPanel,
  settingsPanel
}) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Column: Top Input -> Button -> Output -> Settings */}
        <div className={isHistoryVisible ? "lg:col-span-8 xl:col-span-9 space-y-6" : "lg:col-span-12 space-y-6"}>
          {/* 1. TOP: Pole wpisania promptu wraz z przyciskiem generowania */}
          <div>
            {inputHero}
          </div>

          {/* 2. MIDDLE: Wynik (Ustrukturyzowany Prompt / Podgląd / Audyt 2026) */}
          <div className="min-h-[460px]">
            {outputPanel}
          </div>

          {/* 3. BOTTOM: Reszta ustawień (Architektura, Model, Zaawansowane dyrektywy 2026) */}
          <div>
            {settingsPanel}
          </div>
        </div>

        {/* Side Panel: Historia (chowana / rozwijana przyciskiem w nagłówku) */}
        {isHistoryVisible && (
          <aside className="lg:col-span-4 xl:col-span-3 sticky top-20">
            {historyPanel}
          </aside>
        )}
      </div>
    </main>
  );
};
