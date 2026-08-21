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
