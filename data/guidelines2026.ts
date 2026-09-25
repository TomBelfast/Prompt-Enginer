export interface GuidelineItem {
  id: string;
  title: string;
  titlePl: string;
  badge: string;
  summary: string;
  summaryPl: string;
  why2026: string;
  why2026Pl: string;
  exampleGood: string;
  exampleBad: string;
}

export const GUIDELINES_2026: GuidelineItem[] = [
  {
    id: 'xml-delimiters',
    title: 'Semantic XML Tag Delimiters',
    titlePl: 'Semantyczne znaczniki XML (<task>, <context>)',
    badge: 'Frontier Standard 2026',
    summary: 'Structure prompt components into clear XML tags (<task>, <context>, <instructions>, <constraints>, <output_format>).',
    summaryPl: 'Organizowanie składowych promptu w znaczniki XML zamiast prostych nagłówków Markdown. Jest to standard dla modeli Gemini 3 i Claude 3.7+.',
    why2026: 'In multi-million-token context windows, XML delimiters eliminate ambiguous instruction borders, prevent prompt injection, and guarantee accurate attention allocation.',
    why2026Pl: 'W modelach z oknami kontekstu rzędu milionów tokenów tagi XML jednoznacznie oddzielają instrukcje od danych wejściowych, zapobiegają wstrzykiwaniu promptów i błędom atencji.',
    exampleGood: `<context>\nUser needs a secure OAuth2 refresh flow in Go.\n</context>\n<instructions>\n1. Implement token rotation with atomic revocation.\n</instructions>`,
    exampleBad: `# Role: Go Dev\nContext: do an oauth2 refresh\nInstructions:\nStep 1: write it`
  },
  {
    id: 'reasoning-deliberation',
    title: 'Reasoning & Deliberation Architecture',
    titlePl: 'Architektura myślenia modeli wnioskujących (Reasoning CoT)',
    badge: 'Gemini 3 / Reasoning Models',
    summary: 'Give explicit guidance for the reasoning phase without naive clichés like "think step by step". Instruct the model to formulate hypotheses, test edge cases, and isolate reasoning.',
    summaryPl: 'Instruowanie fazy namysłu (extended thinking) modelu: formułowanie hipotez, weryfikacja przypadków brzegowych, zamiast przestarzałego "pomyśl krok po kroku".',
    why2026: '2026 frontier models have native internal thinking tokens. Naive "step-by-step" prompts constrain the model artificially. Instead, define what to verify during deliberation.',
    why2026Pl: 'Nowoczesne modele posiadają dedykowane tokeny myślenia (thinkingLevel). Zamiast sztucznego "myśl krok po kroku", określa się kryteria weryfikacji i przypadki brzegowe w fazie namysłu.',
    exampleGood: `<thinking_process>\n- Analyze concurrency race conditions.\n- Verify fallback behavior when network latency exceeds 500ms.\n- Check memory overhead.\n</thinking_process>`,
    exampleBad: `Please think step by step: Step 1, Step 2, Step 3.`
  },
  {
    id: 'negative-guardrails',
    title: 'Negative Guardrails & Anti-Patterns',
    titlePl: 'Ścisłe reguły negatywne i granice (Negative Guardrails)',
    badge: 'Anti-Hallucination',
    summary: 'Explicitly define what the model MUST NOT do, deprecated patterns to avoid, and fallback rules when user input is ambiguous.',
    summaryPl: 'Jednoznaczne wyznaczenie czego model NIE MOŻE robić: zakazane biblioteki, unikanie zgadywania faktów i procedura przy niepełnych danych.',
    why2026: 'Models in 2026 are highly capable but can easily invent plausible assumptions if negative bounds are absent. Negative constraints prevent sycophancy and hallucinations.',
    why2026Pl: 'Bez wyznaczenia granic negatywnych modele mają tendencję do nadinterpretacji i pochlebstw. Reguły negatywne eliminują halucynacje i przestarzałe zależności.',
    exampleGood: `<constraints>\n- DO NOT assume environment variables exist without validation.\n- DO NOT import deprecated SDKs (e.g. gemini-1.5, legacy axios).\n- If user specs are contradictory, list questions before coding.\n</constraints>`,
    exampleBad: `Please make it good and avoid bugs.`
  },
  {
    id: 'cognitive-stance',
    title: 'Direct Cognitive Stance & Anti-Sycophancy',
    titlePl: 'Rygorystyczna postawa kognitywna (Zero Fluff & Anti-Sycophancy)',
    badge: 'Zero AI Slop',
    summary: 'Replace generic flattering roles ("You are a world-class genius...") with concrete behavioral stance: objective, rigorous, concise, non-sycophantic.',
    summaryPl: 'Zastąpienie pochlebnych ról ("Jesteś genialnym ekspertem...") precyzyjną postawą poznawczą: obiektywizm, rygor techniczny, brak zbędnego wstępu i pochlebstw.',
    why2026: 'Flattering role prompts trigger sycophancy (agreeing with flawed user ideas). Modern guidelines instruct rigorous, critique-capable AI personas.',
    why2026Pl: 'Pochlebne persony wywołują w modelach skłonność do potakiwania błędnym założeniom użytkownika. W 2026 roku stawia się na rzeczowy, asertywny rygor inżynierski.',
    exampleGood: `<role_and_stance>\nAct as an adversarial security auditor. Maintain rigorous, non-sycophantic analysis. Prioritize vulnerability discovery over polite reassurance.\n</role_and_stance>`,
    exampleBad: `You are the most amazing, friendly senior engineer with 15 years experience.`
  },
  {
    id: 'typed-contracts',
    title: 'Deterministic Output Contracts',
    titlePl: 'Deterministyczny kontrakt formatu wyjściowego',
    badge: 'Schema Rigor',
    summary: 'Provide strict schemas (JSON Schema, exact markdown table headers, or code-only artifacts) with exact field specifications.',
    summaryPl: 'Precyzyjny schemat oczekiwanych danych (JSON Schema, konkretne kolumny tabeli, wyłącznie kod bez komentarzy wstępnych).',
    why2026: 'Automated pipelines and agent loops in 2026 require zero conversational wrappers around machine-readable outputs.',
    why2026Pl: 'W nowoczesnych pipeline\'ach i pętlach agentowych wyjście musi być bezpośrednio parsowalne przez systemy bez "Sure! Here is your code:".',
    exampleGood: `<output_format>\nReturn exclusively raw JSON matching the schema below. No conversational markdown wrap:\n{\n  "status": "success" | "error",\n  "auditFindings": string[]\n}\n</output_format>`,
    exampleBad: `Format your answer nicely in JSON or a list.`
  },
  {
    id: 'self-verification',
    title: 'Self-Verification & Evaluation Rubric',
    titlePl: 'Wbudowana rubryka samooceny (Self-Verification Rubric)',
    badge: 'Quality Assurance',
    summary: 'Embed an evaluation rubric that the model must mentally or explicitly verify before releasing the final response.',
    summaryPl: 'Wbudowana lista kontrolna, którą model musi zweryfikować przed sfinalizowaniem odpowiedzi, gwarantująca zgodność ze specyfikacją.',
    why2026: 'Adding verification rubrics increases frontier model benchmark accuracy by up to 28% by triggering internal self-correction before token emission.',
    why2026Pl: 'Obecność rubryki weryfikacyjnej zwiększa poprawność odpowiedzi nawet o 28%, aktywując wewnętrzną samokorektę modelu.',
    exampleGood: `<evaluation_rubric>\nBefore outputting, verify:\n1. All edge cases (empty input, null, overflow) are covered.\n2. No deprecated APIs are invoked.\n3. Output strictly matches the schema.\n</evaluation_rubric>`,
    exampleBad: `Double check your work.`
  }
];
