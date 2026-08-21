export type ModelProvider = 'google_gemini' | 'openai_compatible' | 'anthropic' | 'custom_endpoint';

export interface ModelEntity {
  id: string;
  name: string;
  provider: ModelProvider;
  endpointUrl?: string;
  apiKeyEncrypted?: string;
  params: {
    model_name: string;
    temperature: number;
    max_output_tokens: number;
    top_p: number;
  };
  is_builtin: boolean;
  createdAt?: string;
}

export interface SkillEntity {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  input_schema: Record<string, any>;
  version: number;
  category: string;
  is_public: boolean;
  createdAt?: string;
}

export type ToolTypeEnum = 'web_search' | 'web_scrape' | 'code_exec' | 'http_call' | 'custom';

export interface ToolEntity {
  id: string;
  name: string;
  description: string;
  input_schema: Record<string, any>;
  tool_type: ToolTypeEnum;
  webhook_url?: string;
  code_snippet?: string;
  is_builtin: boolean;
  createdAt?: string;
}

export interface AgentEntity {
  id: string;
  ownerId?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  skill_id: string;
  model_id: string;
  tool_ids: string[];
  is_published: boolean;
  api_key?: string;
  price_per_call: number;
  pricing_model: 'per_call' | 'subscription' | 'free';
  monthly_price?: number;
  calls_count: number;
  success_rate: number;
  avg_latency_ms: number;
  rating: number;
  creator_name: string;
  creator_avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentRunEntity {
  id: string;
  agent_id: string;
  caller_id?: string;
  input: { prompt: string };
  output: { text: string };
  tools_called: Array<{
    tool_name: string;
    input: any;
    output: any;
    latency_ms: number;
  }>;
  tokens_used: number;
  prompt_tokens: number;
  completion_tokens: number;
  latency_ms: number;
  cost: number;
  status: 'success' | 'error';
  created_at: string;
}
