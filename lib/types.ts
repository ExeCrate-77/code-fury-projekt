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
