import React from 'react';
import { ComplianceScorecard } from '../types/prompt';

interface ComplianceScorecardViewProps {
  scorecard: ComplianceScorecard;
  explanation: string;
}

export const ComplianceScorecardView: React.FC<ComplianceScorecardViewProps> = ({ scorecard, explanation }) => {
  const criteriaList = Object.entries(scorecard.criteria);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30';
    if (score >= 70) return 'text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-950/40 border-lime-500/30';
    return 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30';
  };

  return (
    <div className="p-4 space-y-4">
      {/* Overview Banner */}
      <div className="bg-gradient-to-br from-lime-500/10 via-emerald-500/10 to-transparent p-4 rounded-xl border border-lime-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400">
                Audyt Zgodności / Compliance Audit
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-lime-500/20 text-lime-700 dark:text-lime-300">
                Standard: Wrzesień 2026
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              Wynik Inżynierii Promptu: {scorecard.overallScore}/100
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {scorecard.summary || explanation}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-emerald-500">
                {scorecard.overallScore}%
              </div>
              <span className="text-[11px] text-gray-500 font-medium">Frontier Ready</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mt-3">
          <div 
            className="bg-gradient-to-r from-lime-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, Math.max(0, scorecard.overallScore))}%` }}
          />
        </div>
      </div>

      {/* 6 Core Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {criteriaList.map(([key, item]) => (
          <div 
            key={key}
            className={`p-3.5 rounded-xl border transition-all ${getScoreColor(item.score)}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                {item.label}
              </h4>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold">
                  {item.score}%
                </span>
                <span className={`w-2 h-2 rounded-full ${item.pass ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.details}
            </p>
          </div>
        ))}
      </div>

      {/* Why this matters card */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-gray-700 dark:text-gray-300">💡 Standardy Frontier 2026: </span>
        Modele najnowszej generacji (Gemini 3.8 / Pro) najlepiej przetwarzają prompty o ścisłych granicach XML, z jednoznaczną instrukcją myślenia hipotez i brakiem pustych pochlebstw.
      </div>
    </div>
  );
};
