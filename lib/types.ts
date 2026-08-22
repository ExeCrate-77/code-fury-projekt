export interface Model {
  id: string
  creator_id: string
  name: string
  provider: string
  base_url: string | null
  model_name: string | null
  is_public: boolean
  created_at: string
}

export interface Skill {
  id: string
  creator_id: string
  name: string
  system_prompt: string
  is_public: boolean
  created_at: string
}

export interface Tool {
  id: string
  creator_id: string
  name: string
  tool_type: string
  schema_config: Record<string, unknown>
  is_public: boolean
  created_at: string
}

export interface Agent {
  id: string
  creator_id: string
  name: string
  description: string | null
  model_id: string
  skill_id: string
  is_published: boolean
  price_per_call: number | string
  created_at: string
  model?: Model
  skill?: Skill
  tools?: Tool[]
}

export interface ApiKey {
  id: string
  label: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
}

export interface DashboardSummary {
  published_agents: number
  total_calls: number
  successful_calls: number
  total_revenue: number
}

export interface DashboardAgent {
  id: string
  name: string
  description: string | null
  is_published: boolean
  price_per_call: number | string
  created_at: string
  usage: { total: number; successful: number }
  revenue: number
}

export interface UsageLog {
  id: string
  agent_id: string | null
  status: string
  latency_ms: number
  created_at: string
}

export interface ChatToolCall {
  name: string
  args: unknown
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  toolCalls?: ChatToolCall[]
}

export type ModelCategory =
  | 'LLM'
  | 'Vision'
  | 'Audio'
  | 'Code'
  | 'Healthcare'
  | 'Finance'
  | 'Reasoning'
  | 'Multimodal';

export interface ModelCreator {
  name: string;
  avatar: string;
  verified: boolean;
  organization: string;
  modelsCount?: number;
}

export interface ModelPricing {
  inputPer1k: number;
  outputPer1k: number;
  monthlyPro: number;
  freeTierTokens: number;
  pricingType: 'free' | 'usage' | 'subscription' | 'hybrid';
}

export interface ModelBenchmarks {
  mmlu: number;
  humanEval: number;
  gsm8k: number;
  costEfficiency: number;
  safetyRating: number;
  latencyScore: number;
}

export interface SamplePrompt {
  title: string;
  prompt: string;
  expectedOutput: string;
}

export interface AIModel {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ModelCategory;
  creator: ModelCreator;
  parameters: string;
  architecture: string;
  quantization: string[];
  contextWindow: number;
  latencyMs: number;
  tokensPerSec: number;
  pricing: ModelPricing;
  benchmarks: ModelBenchmarks;
  ratings: {
    average: number;
    count: number;
  };
  downloadsOrCalls: number;
  license: string;
  status: 'online' | 'beta' | 'maintenance';
  supportedLanguages: string[];
  tags: string[];
  endpointUrl: string;
  huggingFaceUrl?: string;
  createdAt: string;
  samplePrompts: SamplePrompt[];
}

export interface GeneratedApiKey {
  id: string;
  key: string;
  name: string;
  modelId: string;
  modelName: string;
  tier: 'Free Sandbox' | 'Pay-As-You-Go' | 'Enterprise Dedicated';
  createdAt: string;
  lastUsed: string;
  requestsCount: number;
  rateLimit: string;
  status: 'active' | 'revoked';
}

export interface ModelDeploymentOrder {
  id: string;
  modelId: string;
  modelName: string;
  tier: string;
  price: number;
  billingCycle: string;
  apiKey: string;
  createdAt: string;
}