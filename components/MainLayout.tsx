
import React from 'react';

interface MainLayoutProps {
  isHistoryVisible: boolean;
  historyPanel: React.ReactNode;
  inputPanel: React.ReactNode;
  outputPanel: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  isHistoryVisible, 
  historyPanel, 
  inputPanel, 
  outputPanel 
}) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {isHistoryVisible && (
        <div className="lg:col-span-4 flex flex-col">
          {historyPanel}
        </div>
      )}
      <div className={isHistoryVisible ? "lg:col-span-4 flex flex-col" : "lg:col-span-6 flex flex-col"}>
        {inputPanel}
      </div>
      <div className={isHistoryVisible ? "lg:col-span-4 flex flex-col" : "lg:col-span-6 flex flex-col"}>
        {outputPanel}
      </div>
    </main>
  );
};