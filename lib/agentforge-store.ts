import { ModelEntity, SkillEntity, ToolEntity, AgentEntity, AgentRunEntity } from './agentforge-types';

export const BUILTIN_MODELS: ModelEntity[] = [
  {
    id: 'model-gemini-2-5-flash',
    name: 'Google Gemini 2.5 Flash',
    provider: 'google_gemini',
    params: {
      model_name: 'gemini-2.5-flash',
      temperature: 0.2,
      max_output_tokens: 2048,
      top_p: 0.95
    },
    is_builtin: true,
    createdAt: '2025-01-01'
  },
  {
    id: 'model-gemini-2-5-pro',
    name: 'Google Gemini 2.5 Pro',
    provider: 'google_gemini',
    params: {
      model_name: 'gemini-2.5-pro',
      temperature: 0.3,
      max_output_tokens: 4096,
      top_p: 0.95
    },
    is_builtin: true,
    createdAt: '2025-01-01'
  },
  {
    id: 'model-openai-compat',
    name: 'OpenAI-Compatible Gateway',
    provider: 'openai_compatible',
    endpointUrl: 'https://api.openai.com/v1/chat/completions',
    params: {
      model_name: 'gpt-4o-mini',
      temperature: 0.2,
      max_output_tokens: 2048,
      top_p: 1.0
    },
    is_builtin: true,
    createdAt: '2025-01-01'
  }
];

export const BUILTIN_SKILLS: SkillEntity[] = [
  {
    id: 'skill-code-architect',
    name: 'Senior Code Architect & OWASP Auditor',
    description: 'Enforces OWASP Top 10 security standards, analyzes AST flows, and writes secure unit-tested TypeScript/Python refactors.',
    system_prompt: `You are a Principal Software Security Architect.
- Audit all code snippets for reentrancy, injection vectors, memory exhaustion, and race conditions.
- Enforce strict typing, boundary validation, and defensive programming.
- Use the code_exec tool when you need to verify AST syntax or execute algorithms.`,
    input_schema: { type: 'object', properties: { prompt: { type: 'string' } } },
    version: 2,
    category: 'Development',
    is_public: true,
    createdAt: '2025-01-10'
  },
  {
    id: 'skill-quant-finance',
    name: 'Quantitative Financial Modeling',
    description: 'Evaluates balance sheets, DCF models, and volatility/margin sensitivity matrices with mathematical rigor.',
    system_prompt: `You are an elite Wall Street Quantitative Strategist.
- Always perform arithmetic and financial calculations using precision methods.
- Formulate quantitative alpha indicators and margin sensitivity matrices.
- Disclose underlying assumptions clearly.`,
    input_schema: { type: 'object', properties: { prompt: { type: 'string' } } },
    version: 1,
    category: 'Finance',
    is_public: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'skill-clinical-scribe',
    name: 'Biomedical Clinical Synthesizer',
    description: 'Summarizes diagnostic indicators, checks drug-drug interactions, and structures clinical impressions.',
    system_prompt: `You are a biomedical clinical assistant.
- Provide structured differential assessments categorized by probability.
- Cite relevant clinical guidelines and use standard medical nomenclature (ICD-10, SNOMED).
- Always include an explicit clinical safety disclaimer for physician review.`,
    input_schema: { type: 'object', properties: { prompt: { type: 'string' } } },
    version: 1,
    category: 'Healthcare',
    is_public: true,
    createdAt: '2025-01-20'
  },
  {
    id: 'skill-data-engineer',
    name: 'High-Throughput SQL & Data Platform',
    description: 'Optimizes Postgres/ClickHouse schemas, builds ETL transformations, and generates complex analytical queries.',
    system_prompt: `You are a Staff Data Platform Engineer.
- Author optimized ANSI SQL queries with proper indexing and partition awareness.
- When transforming datasets, write and test data scripts in the sandboxed code interpreter.
- Prioritize constant memory overhead and streaming execution.`,
    input_schema: { type: 'object', properties: { prompt: { type: 'string' } } },
    version: 2,
    category: 'Data Science',
    is_public: true,
    createdAt: '2025-01-05'
  }
];

export const BUILTIN_TOOLS: ToolEntity[] = [
  {
    id: 'tool-code-exec',
    name: 'code_exec',
    description: 'Isolated Node.js VM sandbox for executing JavaScript/Python algorithms with timeout and memory guards.',
    input_schema: {
      type: 'object',
      properties: { code: { type: 'string', description: 'Executable script' } },
      required: ['code']
    },
    tool_type: 'code_exec',
    is_builtin: true,
    createdAt: '2025-01-01'
  },
  {
    id: 'tool-web-search',
    name: 'web_search',
    description: 'Live web index search and scraping for verified real-time sources, API documentation, and citations.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search term' } },
      required: ['query']
    },
    tool_type: 'web_search',
    is_builtin: true,
    createdAt: '2025-01-01'
  },
  {
    id: 'tool-web-scrape',
    name: 'web_scrape',
    description: 'Extracts clean text content and metadata from any public URL.',
    input_schema: {
      type: 'object',
      properties: { url: { type: 'string', description: 'Webpage URL' } },
      required: ['url']
    },
    tool_type: 'web_scrape',
    is_builtin: true,
    createdAt: '2025-01-01'
  },
  {
    id: 'tool-http-call',
    name: 'http_call',
    description: 'Dispatches authenticated HTTP/REST webhooks with custom JSON payloads.',
    input_schema: {
      type: 'object',
      properties: { url: { type: 'string' }, method: { type: 'string', enum: ['GET', 'POST'] }, payload: { type: 'string' } },
      required: ['url']
    },
    tool_type: 'http_call',
    is_builtin: true,
    createdAt: '2025-01-01'
  }
];

export const BUILTIN_AGENTS: AgentEntity[] = [
  {
    id: 'agent-sentinel-code-sec',
    name: 'Sentinel Code Security Agent',
    slug: 'sentinel-code-security-agent',
    tagline: 'Autonomous AST security auditing, zero-day detection & patch synthesizer',
    description: 'Production-ready AI agent combining OWASP security directives, an isolated Node VM sandbox for runtime verification, and web search grounding.',
    skill_id: 'skill-code-architect',
    model_id: 'model-gemini-2-5-flash',
    tool_ids: ['tool-code-exec', 'tool-web-search'],
    is_published: true,
    api_key: 'af_live_sentinel_89f021ac',
    price_per_call: 0.002,
    pricing_model: 'per_call',
    monthly_price: 29,
    calls_count: 182400,
    success_rate: 99.9,
    avg_latency_ms: 125,
    rating: 4.96,
    creator_name: 'Sarah Lin (Staff Architect)',
    creator_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10'
  },
  {
    id: 'agent-finquant-alpha',
    name: 'FinQuant Alpha Strategist',
    slug: 'finquant-alpha-strategist',
    tagline: 'Real-time financial ratio modeling, SEC 10-K risk audit & DCF synthesizer',
    description: 'Quantitative finance intelligence agent with built-in math calculation, web grounding for SEC filings, and risk modeling formulas.',
    skill_id: 'skill-quant-finance',
    model_id: 'model-gemini-2-5-pro',
    tool_ids: ['tool-web-search', 'tool-web-scrape'],
    is_published: true,
    api_key: 'af_live_finquant_41d9e2ba',
    price_per_call: 0.0035,
    pricing_model: 'per_call',
    monthly_price: 49,
    calls_count: 98100,
    success_rate: 99.7,
    avg_latency_ms: 175,
    rating: 4.92,
    creator_name: 'Marcus Vance (Apex Capital)',
    creator_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-01-18'
  },
  {
    id: 'agent-biomed-scribe',
    name: 'BioMed Clinical Scribe V2',
    slug: 'biomed-clinical-scribe-v2',
    tagline: 'Differential diagnosis structuring, ICD-10 encoding & clinical protocol synthesis',
    description: 'Clinical scribe agent equipped with biomedical literature search, differential categorization, and ICD-10 formatting.',
    skill_id: 'skill-clinical-scribe',
    model_id: 'model-gemini-2-5-pro',
    tool_ids: ['tool-web-search', 'tool-web-scrape'],
    is_published: true,
    api_key: 'af_live_biomed_77e012fa',
    price_per_call: 0.0045,
    pricing_model: 'subscription',
    monthly_price: 79,
    calls_count: 68400,
    success_rate: 99.9,
    avg_latency_ms: 190,
    rating: 4.98,
    creator_name: 'Dr. Evelyn Vance & BioLab',
    creator_avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-01-25'
  },
  {
    id: 'agent-omnidata-sql',
    name: 'OmniData SQL Architect',
    slug: 'omnidata-sql-architect',
    tagline: 'High-throughput SQL query generator, schema normalizer & ETL sandbox',
    description: 'Data engineering agent equipped with real-time sandbox execution for testing data aggregation scripts and generating lightning-fast analytical queries.',
    skill_id: 'skill-data-engineer',
    model_id: 'model-gemini-2-5-flash',
    tool_ids: ['tool-code-exec'],
    is_published: true,
    api_key: 'af_live_omnidata_99c34510',
    price_per_call: 0.0015,
    pricing_model: 'per_call',
    monthly_price: 19,
    calls_count: 245000,
    success_rate: 99.8,
    avg_latency_ms: 110,
    rating: 4.94,
    creator_name: 'Alex Chen (DataScale)',
    creator_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-01-05'
  }
];

// Local Storage Keys
const KEY_MODELS = 'agentforge_models';
const KEY_SKILLS = 'agentforge_skills';
const KEY_TOOLS = 'agentforge_tools';
const KEY_AGENTS = 'agentforge_agents';
const KEY_RUNS = 'agentforge_runs';
const KEY_CREDITS = 'agentforge_credits';

export function getStoredModels(): ModelEntity[] {
  if (typeof window === 'undefined') return BUILTIN_MODELS;
  try {
    const raw = localStorage.getItem(KEY_MODELS);
    return raw ? JSON.parse(raw) : BUILTIN_MODELS;
  } catch {
    return BUILTIN_MODELS;
  }
}

export function saveModel(model: ModelEntity): ModelEntity[] {
  if (typeof window === 'undefined') return BUILTIN_MODELS;
  const current = getStoredModels();
  const updated = [model, ...current.filter(m => m.id !== model.id)];
  localStorage.setItem(KEY_MODELS, JSON.stringify(updated));
  return updated;
}

export function getStoredSkills(): SkillEntity[] {
  if (typeof window === 'undefined') return BUILTIN_SKILLS;
  try {
    const raw = localStorage.getItem(KEY_SKILLS);
    return raw ? JSON.parse(raw) : BUILTIN_SKILLS;
  } catch {
    return BUILTIN_SKILLS;
  }
}

export function saveSkill(skill: SkillEntity): SkillEntity[] {
  if (typeof window === 'undefined') return BUILTIN_SKILLS;
  const current = getStoredSkills();
  const updated = [skill, ...current.filter(s => s.id !== skill.id)];
  localStorage.setItem(KEY_SKILLS, JSON.stringify(updated));
  return updated;
}

export function getStoredTools(): ToolEntity[] {
  if (typeof window === 'undefined') return BUILTIN_TOOLS;
  try {
    const raw = localStorage.getItem(KEY_TOOLS);
    return raw ? JSON.parse(raw) : BUILTIN_TOOLS;
  } catch {
    return BUILTIN_TOOLS;
  }
}

export function saveTool(tool: ToolEntity): ToolEntity[] {
  if (typeof window === 'undefined') return BUILTIN_TOOLS;
  const current = getStoredTools();
  const updated = [tool, ...current.filter(t => t.id !== tool.id)];
  localStorage.setItem(KEY_TOOLS, JSON.stringify(updated));
  return updated;
}

export function getStoredAgents(): AgentEntity[] {
  if (typeof window === 'undefined') return BUILTIN_AGENTS;
  try {
    const raw = localStorage.getItem(KEY_AGENTS);
    return raw ? JSON.parse(raw) : BUILTIN_AGENTS;
  } catch {
    return BUILTIN_AGENTS;
  }
}

export function saveAgent(agent: AgentEntity): AgentEntity[] {
  if (typeof window === 'undefined') return BUILTIN_AGENTS;
  const current = getStoredAgents();
  const updated = [agent, ...current.filter(a => a.id !== agent.id)];
  localStorage.setItem(KEY_AGENTS, JSON.stringify(updated));
  return updated;
}

export function getStoredRuns(): AgentRunEntity[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_RUNS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRunLog(run: AgentRunEntity): AgentRunEntity[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredRuns();
  const updated = [run, ...current.slice(0, 49)];
  localStorage.setItem(KEY_RUNS, JSON.stringify(updated));
  return updated;
}

export function getUserCredits(): number {
  if (typeof window === 'undefined') return 50.00;
  try {
    const raw = localStorage.getItem(KEY_CREDITS);
    return raw ? parseFloat(raw) : 50.00;
  } catch {
    return 50.00;
  }
}

export function deductCredits(amt: number): number {
  if (typeof window === 'undefined') return 50.00;
  const curr = getUserCredits();
  const next = Math.max(0, parseFloat((curr - amt).toFixed(4)));
  localStorage.setItem(KEY_CREDITS, next.toString());
  return next;
}

export function addCredits(amt: number): number {
  if (typeof window === 'undefined') return 50.00;
  const curr = getUserCredits();
  const next = parseFloat((curr + amt).toFixed(2));
  localStorage.setItem(KEY_CREDITS, next.toString());
  return next;
}
