export type StackCategory = 
  | 'Development'
  | 'Finance'
  | 'Healthcare'
  | 'Research'
  | 'Productivity'
  | 'Security'
  | 'Data Science';

export type ToolType = 'calculator' | 'code_interpreter' | 'web_search' | 'custom_webhook';

export interface ToolDefinition {
  id: string;
  name: ToolType;
  displayName: string;
  description: string;
  iconName: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface SkillTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: StackCategory;
  promptTemplate: string;
  isCustom?: boolean;
}

export interface StackConfig {
  model: 'gemini-2.0-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash';
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  selectedSkillIds: string[];
  enabledTools: ToolType[];
  webhookUrl?: string;
}

export interface AgentStack {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: StackCategory;
  config: StackConfig;
  status: 'draft' | 'published' | 'archived';
  pricePerCall: number;
  monthlyPrice: number;
  callsCount: number;
  successRate: number;
  avgLatencyMs: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  apiKeyPrefix?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  latencyMs: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  costDeducted: number;
  toolsCalled: Array<{
    toolName: string;
    input: any;
    output: any;
    executionTimeMs: number;
  }>;
  status: 'success' | 'error';
}

export interface ConsumerApiKey {
  id: string;
  stackId: string;
  stackName: string;
  keyLabel: string;
  rawKey?: string; // shown once upon generation
  keyPrefix: string; // e.g. sf_live_89a...
  rateLimit: string;
  status: 'active' | 'revoked';
  totalCalls: number;
  createdAt: string;
  lastUsedAt: string;
}
