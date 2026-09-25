export type PromptFramework = 
  | 'frontier_xml'      // Semantic XML Tag Delimiters (Gemini 3 / Claude Standard)
  | 'reasoning_cot'     // Deep Reasoning & Extended Deliberation
  | 'agentic_tool'      // Agentic Execution & Tool Schema Contract
  | 'rocce_plus';       // Role, Objective, Context, Constraints, Evaluation

export type TargetModel = 
  | 'gemini-3.8-flash'
  | 'gemini-3.1-pro-preview'
  | 'universal';

export interface PromptOptions {
  framework: PromptFramework;
  targetModel: TargetModel;
  includeXmlTags: boolean;
  includeReasoningPhase: boolean;
  includeNegativeConstraints: boolean;
  includeFewShot: boolean;
  includeVerificationRubric: boolean;
  language: 'auto' | 'pl' | 'en';
}

export interface ComplianceScorecard {
  overallScore: number; // 0 - 100
  criteria: {
    semanticTagging: { pass: boolean; score: number; label: string; details: string };
    cognitiveStance: { pass: boolean; score: number; label: string; details: string };
    negativeConstraints: { pass: boolean; score: number; label: string; details: string };
    reasoningDeliberation: { pass: boolean; score: number; label: string; details: string };
    outputContract: { pass: boolean; score: number; label: string; details: string };
    verificationRubric: { pass: boolean; score: number; label: string; details: string };
  };
  summary: string;
}

export interface StructuredPrompt {
  full: string;
  compact: string;
  framework: PromptFramework;
  options: PromptOptions;
  scorecard: ComplianceScorecard;
  explanation: string;
  guidelinesVersion: string;
}

export interface HistoryItem {
  id: string;
  userInput: string;
  structuredPrompt: StructuredPrompt;
  timestamp: number;
}
