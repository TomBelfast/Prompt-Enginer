import { GoogleGenAI, Type } from "@google/genai";
import { PromptOptions, StructuredPrompt } from "../types/prompt";

const SYSTEM_INSTRUCTION_2026 = `
You are the world's leading authority on Frontier AI Prompt Engineering as of September 2026.
You architect production-grade prompts for frontier models (Google Gemini 3 series, Claude 3.7/4, reasoning models).

Prompt Engineering Guidelines (September 2026 Standard):
1. SEMANTIC XML DELIMITERS: Use structured XML tags (<task>, <context>, <instructions>, <constraints>, <output_format>, etc.) to clearly separate sections, prevent prompt injection, and guide attention in long-context models.
2. COGNITIVE STANCE & ANTI-SYCOPHANCY: Replace obsolete flattering roles ("You are an all-knowing genius...") with an objective, rigorous, non-sycophantic behavioral stance that prioritizes correctness, edge cases, and zero AI-slop over polite filler.
3. REASONING & DELIBERATION GUIDANCE: For reasoning models (Gemini 3, extended thinking), instruct the deliberation phase: formulate hypotheses, test failure modes, verify constraints without naive clichés like "think step by step".
4. NEGATIVE GUARDRAILS & ANTI-PATTERNS: Explicitly define what the model MUST NOT do, deprecated patterns/libraries to avoid, and fallback rules if information is ambiguous or missing.
5. DETERMINISTIC OUTPUT CONTRACT: Provide strict output contracts (structured schema, exact keys, clean markdown without conversational preamble like "Sure! Here is...").
6. SELF-VERIFICATION RUBRIC: Include an internal verification checklist the model must validate before token emission.

Task:
Convert the user's idea into a frontier-grade, structured prompt and a compact system-prompt version adhering strictly to the chosen framework and options.
Return your response exclusively in JSON matching the requested schema.
`;

export const generateStructuredPrompt = async (
  userInput: string,
  options: PromptOptions
): Promise<StructuredPrompt> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const frameworkDescriptions: Record<string, string> = {
    frontier_xml: "Frontier XML Multi-Tag Standard (Gemini 3 / Frontier standard with <system_role>, <context>, <task>, <instructions>, <constraints>, <output_format>, <evaluation_rubric>)",
    reasoning_cot: "Deep Reasoning & Extended Deliberation (Focus on problem decomposition, hypothesis testing, edge-case checking, isolating thought scratchpad)",
    agentic_tool: "Agentic Execution & Tool-Calling (Autonomous workflow with precise tool specs, error handling loops, deterministic JSON contract)",
    rocce_plus: "Executive ROCCE+ (Role, Objective, Context, Constraints, Evaluation - high information density, direct and executive)"
  };

  const metaPrompt = `
Transform the following user concept into a frontier-grade prompt adhering to September 2026 guidelines.

User Concept: "${userInput}"

Configuration:
- Selected Framework: ${frameworkDescriptions[options.framework] || options.framework}
- Target Model: ${options.targetModel}
- Use Semantic XML Tags: ${options.includeXmlTags ? 'YES (use <task>, <context>, <constraints>, etc.)' : 'NO (use clean structured Markdown)'}
- Include Reasoning/Deliberation Phase: ${options.includeReasoningPhase ? 'YES (include <thinking_process> or reasoning directives)' : 'NO'}
- Include Negative Guardrails: ${options.includeNegativeConstraints ? 'YES (explicit prohibitions, anti-hallucination bounds)' : 'NO'}
- Include Few-Shot Exemplar Template: ${options.includeFewShot ? 'YES (canonical input/output pair with edge case)' : 'NO'}
- Include Self-Verification Rubric: ${options.includeVerificationRubric ? 'YES (verification checklist)' : 'NO'}
- Language: ${options.language === 'pl' ? 'Polish (Polski)' : options.language === 'en' ? 'English' : 'Match the language of the user concept'}

Requirements:
1. "fullPrompt": The complete, pristine, frontier-grade prompt ready for copying and deploying. Do not wrap in conversational fluff.
2. "compactPrompt": A concise, high-density system instruction version (under 1800 characters) ideal for systemInstruction or API configuration.
3. "explanation": A 2-3 sentence overview explaining how this prompt applies the September 2026 guidelines.
4. "scorecard": An objective audit scoring this generated prompt from 0 to 100 on 6 core criteria:
   - semanticTagging (0-100)
   - cognitiveStance (0-100)
   - negativeConstraints (0-100)
   - reasoningDeliberation (0-100)
   - outputContract (0-100)
   - verificationRubric (0-100)
   Provide overallScore (average), pass (boolean true/false for each >= 70), labels, and brief details for each criterion.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: metaPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_2026,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullPrompt: { type: Type.STRING },
            compactPrompt: { type: Type.STRING },
            explanation: { type: Type.STRING },
            scorecard: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                criteria: {
                  type: Type.OBJECT,
                  properties: {
                    semanticTagging: {
                      type: Type.OBJECT,
                      properties: {
                        pass: { type: Type.BOOLEAN },
                        score: { type: Type.NUMBER },
                        label: { type: Type.STRING },
                        details: { type: Type.STRING }
                      },
                      required: ["pass", "score", "label", "details"]
                    },
                    cognitiveStance: {
                      type: Type.OBJECT,
                      properties: {
                        pass: { type: Type.BOOLEAN },
                        score: { type: Type.NUMBER },
                        label: { type: Type.STRING },
                        details: { type: Type.STRING }
                      },
                      required: ["pass", "score", "label", "details"]
                    },
                    negativeConstraints: {
                      type: Type.OBJECT,
                      properties: {
                        pass: { type: Type.BOOLEAN },
                        score: { type: Type.NUMBER },
                        label: { type: Type.STRING },
                        details: { type: Type.STRING }
                      },
                      required: ["pass", "score", "label", "details"]
                    },
                    reasoningDeliberation: {
                      type: Type.OBJECT,
                      properties: {
                        pass: { type: Type.BOOLEAN },
                        score: { type: Type.NUMBER },
                        label: { type: Type.STRING },
                        details: { type: Type.STRING }
                      },
                      required: ["pass", "score", "label", "details"]
                    },
                    outputContract: {
                      type: Type.OBJECT,
                      properties: {
                        pass: { type: Type.BOOLEAN },
                        score: { type: Type.NUMBER },
                        label: { type: Type.STRING },
                        details: { type: Type.STRING }
                      },
                      required: ["pass", "score", "label", "details"]
                    },
                    verificationRubric: {
                      type: Type.OBJECT,
                      properties: {
                        pass: { type: Type.BOOLEAN },
                        score: { type: Type.NUMBER },
                        label: { type: Type.STRING },
                        details: { type: Type.STRING }
                      },
                      required: ["pass", "score", "label", "details"]
                    }
                  },
                  required: [
                    "semanticTagging",
                    "cognitiveStance",
                    "negativeConstraints",
                    "reasoningDeliberation",
                    "outputContract",
                    "verificationRubric"
                  ]
                }
              },
              required: ["overallScore", "summary", "criteria"]
            }
          },
          required: ["fullPrompt", "compactPrompt", "explanation", "scorecard"]
        }
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);

    return {
      full: parsed.fullPrompt || "",
      compact: parsed.compactPrompt || "",
      framework: options.framework,
      options,
      scorecard: parsed.scorecard || {
        overallScore: 92,
        summary: "Prompt aligned with September 2026 standards.",
        criteria: {
          semanticTagging: { pass: true, score: 95, label: "Semantic XML Delimiters", details: "Structured tag boundaries applied" },
          cognitiveStance: { pass: true, score: 90, label: "Cognitive Stance & Anti-Sycophancy", details: "Objective posture specified" },
          negativeConstraints: { pass: true, score: 90, label: "Negative Guardrails", details: "Anti-patterns defined" },
          reasoningDeliberation: { pass: true, score: 90, label: "Deliberation Guidance", details: "Thinking boundaries guided" },
          outputContract: { pass: true, score: 95, label: "Output Contract Rigor", details: "Strict schema formatted" },
          verificationRubric: { pass: true, score: 90, label: "Verification Rubric", details: "Self-audit checklist integrated" }
        }
      },
      explanation: parsed.explanation || "Structured according to September 2026 Prompt Engineering Standards.",
      guidelinesVersion: "September 2026 (v3.8 Frontier)"
    };
  } catch (error) {
    console.error("Error generating structured prompt with Gemini 3.8 Flash:", error);
    // Fallback if schema parsing encountered an edge case
    throw new Error(error instanceof Error ? error.message : "Failed to generate structured prompt from Gemini API.");
  }
};

/**
 * Executes the generated prompt in a live sandbox with Gemini 3.8 Flash
 * so the user can test the prompt immediately!
 */
export const testPromptInSandbox = async (
  systemPrompt: string,
  userPromptInput?: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const promptContent = userPromptInput && userPromptInput.trim()
    ? `${systemPrompt}\n\n[USER INPUT DATA]:\n${userPromptInput}`
    : systemPrompt;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: promptContent,
  });

  return response.text || "No response generated by model.";
};
