import { AgentStack, SkillTemplate, ToolDefinition, ConsumerApiKey, ExecutionLog } from './stack-types';

export const STARTER_SKILLS: SkillTemplate[] = [
  {
    id: 'skill-code-sec',
    name: 'Senior Code Architect & Security Auditor',
    slug: 'code-architect',
    description: 'Enforces OWASP top-10 security rules, identifies race conditions, and generates robust unit-tested refactors.',
    category: 'Development',
    promptTemplate: `You are a Principal Software Security Architect.
- Audit all code snippets for reentrancy, injection vectors, memory exhaustion, and race conditions.
- Enforce strict typing, boundary validation, and defensive programming.
- Use the code interpreter tool when you need to verify AST syntax or execute algorithms.`
  },
  {
    id: 'skill-quant-fin',
    name: 'Quantitative Financial Strategist',
    slug: 'quant-finance',
    description: 'Evaluates balance sheets, calculates DCF models, and assesses volatility and margin sensitivities.',
    category: 'Finance',
    promptTemplate: `You are an elite Wall Street Quantitative Strategist.
- Always perform arithmetic and financial calculations using the calculator tool for 100% precision.
- Formulate quantitative alpha indicators and margin sensitivity matrices.
- Disclose underlying assumptions clearly.`
  },
  {
    id: 'skill-clinical-med',
    name: 'Clinical Biomedical Synthesizer',
    slug: 'clinical-biomed',
    description: 'Summarizes diagnostic indicators, checks drug-drug interactions, and structures clinical impressions.',
    category: 'Healthcare',
    promptTemplate: `You are a biomedical clinical assistant.
- Provide structured differential assessments categorized by probability.
- Cite relevant clinical guidelines and use standard medical nomenclature (ICD-10, SNOMED).
- Always include an explicit clinical safety disclaimer for physician review.`
  },
  {
    id: 'skill-data-sql',
    name: 'Data Science & High-Throughput SQL Engineer',
    slug: 'data-engineer',
    description: 'Optimizes Postgres/ClickHouse schemas, builds ETL transformations, and generates complex analytical queries.',
    category: 'Data Science',
    promptTemplate: `You are a Staff Data Platform Engineer.
- Author optimized ANSI SQL queries with proper indexing and partition awareness.
- When transforming datasets, write and test data scripts in the sandboxed code interpreter.
- Prioritize constant memory overhead and streaming execution.`
  },
  {
    id: 'skill-research-agent',
    name: 'Autonomous Research & Fact Synthesizer',
    slug: 'research-agent',
    description: 'Gathers verified citations, synthesizes opposing viewpoints, and extracts key takeaways.',
    category: 'Research',
    promptTemplate: `You are an autonomous research agent.
- Use the web search tool to ground claims in verified sources.
- Synthesize dense technical whitepapers into executive bullet points with source citations.
- Clearly differentiate between empirical facts and speculative projections.`
  }
];

export const AVAILABLE_TOOLS: ToolDefinition[] = [
  {
    id: 'tool-calc',
    name: 'calculator',
    displayName: 'Math & Calculator Engine',
    description: 'High-precision evaluation of arithmetic, statistical, and trigonometric expressions.',
    iconName: 'Calculator',
    enabled: true
  },
  {
    id: 'tool-code',
    name: 'code_interpreter',
    displayName: 'Sandboxed Code Interpreter',
    description: 'Isolated Node.js VM sandbox for running JavaScript/Python algorithms with timeout guards.',
    iconName: 'Code2',
    enabled: true
  },
  {
    id: 'tool-web',
    name: 'web_search',
    displayName: 'Real-Time Web Grounding',
    description: 'Live web index search and scraping for verified real-time sources and citations.',
    iconName: 'Globe',
    enabled: false
  },
  {
    id: 'tool-webhook',
    name: 'custom_webhook',
    displayName: 'Custom REST Webhook',
    description: 'Dispatch authenticated HTTP requests to custom backend microservices or triggers.',
    iconName: 'Webhook',
    enabled: false
  }
];

export const INITIAL_STACKS: AgentStack[] = [
  {
    id: 'stack-apex-dev-sentinel',
    ownerId: 'creator-1',
    ownerName: 'Sarah Lin (Staff Architect)',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    name: 'ApexDev Security Sentinel',
    slug: 'apex-dev-security-sentinel',
    tagline: 'Autonomous AST security auditing, zero-day detection & patch synthesizer',
    description: 'Production-ready AI agent stack combining senior security rules, a sandboxed Node VM for runtime verification, and math precision checks.',
    category: 'Development',
    config: {
      model: 'gemini-2.0-flash',
      temperature: 0.2,
      maxTokens: 1500,
      topP: 0.9,
      systemPrompt: 'You are ApexDev Sentinel, an autonomous security auditor. Perform deep AST analysis, identify vulnerability vectors (CWE/OWASP), and output verified patches.',
      selectedSkillIds: ['skill-code-sec'],
      enabledTools: ['code_interpreter', 'calculator']
    },
    status: 'published',
    pricePerCall: 0.002,
    monthlyPrice: 29,
    callsCount: 148500,
    successRate: 99.9,
    avgLatencyMs: 135,
    rating: 4.95,
    createdAt: '2025-01-10',
    updatedAt: '2025-02-15',
    apiKeyPrefix: 'sf_live_apex'
  },
  {
    id: 'stack-finquant-alpha',
    ownerId: 'creator-2',
    ownerName: 'Marcus Vance (Apex Capital)',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    name: 'FinQuant Alpha Strategist',
    slug: 'finquant-alpha-strategist',
    tagline: 'Real-time financial ratio modeling, SEC 10-K risk audit & DCF synthesizer',
    description: 'Quantitative finance intelligence stack with built-in financial calculator tools, web grounding for SEC filings, and risk modeling formulas.',
    category: 'Finance',
    config: {
      model: 'gemini-1.5-pro',
      temperature: 0.3,
      maxTokens: 2000,
      topP: 0.95,
      systemPrompt: 'You are FinQuant Alpha. Provide rigorous mathematical financial modeling, compute margins and valuations using the calculator, and cite market factors.',
      selectedSkillIds: ['skill-quant-fin'],
      enabledTools: ['calculator', 'web_search']
    },
    status: 'published',
    pricePerCall: 0.0035,
    monthlyPrice: 49,
    callsCount: 92400,
    successRate: 99.7,
    avgLatencyMs: 180,
    rating: 4.91,
    createdAt: '2025-01-18',
    updatedAt: '2025-02-20',
    apiKeyPrefix: 'sf_live_finq'
  },
  {
    id: 'stack-biomed-scribe',
    ownerId: 'creator-3',
    ownerName: 'Dr. Evelyn Vance & Stanford BioLab',
    ownerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    name: 'BioMed Clinical Scribe V2',
    slug: 'biomed-clinical-scribe-v2',
    tagline: 'Differential diagnosis structuring, ICD-10 encoding & clinical protocol synthesis',
    description: 'HIPAA-aware clinical scribe stack fine-tuned for high-accuracy differential diagnosis synthesis, symptom chronology, and drug dosage calculations.',
    category: 'Healthcare',
    config: {
      model: 'gemini-1.5-pro',
      temperature: 0.2,
      maxTokens: 1800,
      topP: 0.9,
      systemPrompt: 'You are BioMed Scribe. Synthesize clinical presentation timelines, categorize differentials by probability, and include protocol guidance.',
      selectedSkillIds: ['skill-clinical-med'],
      enabledTools: ['calculator', 'web_search']
    },
    status: 'published',
    pricePerCall: 0.0045,
    monthlyPrice: 79,
    callsCount: 63100,
    successRate: 99.9,
    avgLatencyMs: 195,
    rating: 4.96,
    createdAt: '2025-01-25',
    updatedAt: '2025-02-18',
    apiKeyPrefix: 'sf_live_biom'
  },
  {
    id: 'stack-omnidata-sql',
    ownerId: 'creator-4',
    ownerName: 'Alex Chen (DataScale)',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    name: 'OmniData SQL Architect',
    slug: 'omnidata-sql-architect',
    tagline: 'High-throughput SQL query generator, schema normalizer & ETL sandbox',
    description: 'Data engineering stack equipped with real-time sandbox execution for testing data aggregation scripts and generating lightning-fast analytical queries.',
    category: 'Data Science',
    config: {
      model: 'gemini-2.0-flash',
      temperature: 0.2,
      maxTokens: 1200,
      topP: 0.9,
      systemPrompt: 'You are OmniData SQL Architect. Generate optimized ANSI SQL with index recommendations and test data manipulation logic in the sandbox.',
      selectedSkillIds: ['skill-data-sql'],
      enabledTools: ['code_interpreter', 'calculator']
    },
    status: 'published',
    pricePerCall: 0.0015,
    monthlyPrice: 19,
    callsCount: 215000,
    successRate: 99.8,
    avgLatencyMs: 110,
    rating: 4.93,
    createdAt: '2025-01-05',
    updatedAt: '2025-02-21',
    apiKeyPrefix: 'sf_live_omni'
  }
];

const LOCAL_STORAGE_STACKS_KEY = 'stackforge_custom_stacks';
const LOCAL_STORAGE_KEYS_KEY = 'stackforge_consumer_keys';
const LOCAL_STORAGE_CREDITS_KEY = 'stackforge_user_credits';
const LOCAL_STORAGE_LOGS_KEY = 'stackforge_execution_logs';

export function getStoredStacks(): AgentStack[] {
  if (typeof window === 'undefined') return INITIAL_STACKS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STACKS_KEY);
    if (!raw) return INITIAL_STACKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STACKS;
  } catch {
    return INITIAL_STACKS;
  }
}

export function saveStackToStorage(stack: AgentStack): AgentStack[] {
  if (typeof window === 'undefined') return INITIAL_STACKS;
  const current = getStoredStacks();
  const index = current.findIndex(s => s.id === stack.id);
  let updated: AgentStack[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = stack;
  } else {
    updated = [stack, ...current];
  }
  localStorage.setItem(LOCAL_STORAGE_STACKS_KEY, JSON.stringify(updated));
  return updated;
}

export function getConsumerKeys(): ConsumerApiKey[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConsumerKey(key: ConsumerApiKey): ConsumerApiKey[] {
  if (typeof window === 'undefined') return [];
  const current = getConsumerKeys();
  const updated = [key, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEYS_KEY, JSON.stringify(updated));
  return updated;
}

export function getUserCredits(): number {
  if (typeof window === 'undefined') return 50.00;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CREDITS_KEY);
    return raw ? parseFloat(raw) : 50.00;
  } catch {
    return 50.00;
  }
}

export function deductUserCredits(amount: number): number {
  if (typeof window === 'undefined') return 50.00;
  const current = getUserCredits();
  const next = Math.max(0, parseFloat((current - amount).toFixed(4)));
  localStorage.setItem(LOCAL_STORAGE_CREDITS_KEY, next.toString());
  return next;
}

export function topUpCredits(amount: number): number {
  if (typeof window === 'undefined') return 50.00;
  const current = getUserCredits();
  const next = parseFloat((current + amount).toFixed(2));
  localStorage.setItem(LOCAL_STORAGE_CREDITS_KEY, next.toString());
  return next;
}

export function getExecutionLogs(): ExecutionLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExecutionLog(log: ExecutionLog): ExecutionLog[] {
  if (typeof window === 'undefined') return [];
  const current = getExecutionLogs();
  const updated = [log, ...current.slice(0, 49)]; // keep latest 50
  localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(updated));
  return updated;
}
