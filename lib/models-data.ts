import { AIModel } from './types';

export const INITIAL_MODELS: AIModel[] = [
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro Ultra',
    slug: 'gemini-1-5-pro-ultra',
    tagline: '2M context multi-modal reasoning engine with long-range coherence',
    description: 'High-capability multimodal foundation model optimized for complex reasoning, multi-turn dialogue, deep code synthesis, and native audio/video understanding.',
    category: 'Multimodal',
    creator: {
      name: 'Google DeepMind Core',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'Google DeepMind',
      modelsCount: 14
    },
    parameters: 'MoE ~1.2T',
    architecture: 'Sparse Mixture of Experts (MoE)',
    quantization: ['FP16', 'INT8'],
    contextWindow: 2000000,
    latencyMs: 340,
    tokensPerSec: 88,
    pricing: {
      inputPer1k: 0.00125,
      outputPer1k: 0.005,
      monthlyPro: 49,
      freeTierTokens: 100000,
      pricingType: 'hybrid'
    },
    benchmarks: {
      mmlu: 91.8,
      humanEval: 84.6,
      gsm8k: 93.5,
      costEfficiency: 86,
      safetyRating: 98,
      latencyScore: 89
    },
    ratings: {
      average: 4.94,
      count: 2840
    },
    downloadsOrCalls: 849000,
    license: 'Commercial API License',
    status: 'online',
    supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Hindi', 'Chinese', '100+ others'],
    tags: ['Multimodal', '2M-Context', 'Reasoning', 'Vision', 'Audio'],
    endpointUrl: 'https://api.nexusai.market/v1/gemini-1-5-pro/chat',
    huggingFaceUrl: 'https://huggingface.co/google/gemini-1.5-pro',
    createdAt: '2025-01-15',
    samplePrompts: [
      {
        title: 'Deep System Architecture Audit',
        prompt: 'Analyze this distributed microservice architecture with Kafka, Redis cache, and Postgres. Identify single points of failure and race condition vectors in a high-throughput payment flow.',
        expectedOutput: '### Critical Architectural Vulnerabilities Identified\n\n1. **Kafka Partition Rebalancing Lockup**: Under burst payment load, consumer group rebalance pauses processing for ~1.8s.\n2. **Redis Dual-Write Cache Desync**: Lacks transactional idempotency keys, risking double-debit anomalies during DB failovers.\n3. **Postgres Connection Saturation**: Pooling capped at 120 conn/node, causing cascade 504 gateway timeouts.'
      },
      {
        title: 'Multimodal Chart & Data Extraction',
        prompt: 'Extract the CAGR and EBITDA margins across Q1-Q4 from the quarterly earnings report chart and compute variance against consensus estimates.',
        expectedOutput: '• **FY CAGR**: 23.4% (Consensus: 21.0% | +240 bps beat)\n• **Q4 EBITDA Margin**: 34.2% (FY peak, driven by cloud infra gross margin expansion)\n• **Variance**: Revenue beat by $42M; OpEx normalized at 18.1%.'
      }
    ]
  },
  {
    id: 'deepseek-r1-distill',
    name: 'DeepSeek R1 Distill 70B',
    slug: 'deepseek-r1-distill-70b',
    tagline: 'State-of-the-art open reasoning & math model with step-by-step CoT verification',
    description: 'Reinforcement learning distilled reasoning engine with deep mathematical proof verification, competitive with top tier reasoning systems at 1/10th the inference cost.',
    category: 'Reasoning',
    creator: {
      name: 'DeepSeek Research Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'DeepSeek AI',
      modelsCount: 8
    },
    parameters: '70.6B Dense',
    architecture: 'Transformer Decoder with Deep RL',
    quantization: ['FP16', 'INT8', 'AWQ 4-bit', 'GGUF Q4_K_M'],
    contextWindow: 128000,
    latencyMs: 510,
    tokensPerSec: 64,
    pricing: {
      inputPer1k: 0.00055,
      outputPer1k: 0.00219,
      monthlyPro: 29,
      freeTierTokens: 250000,
      pricingType: 'usage'
    },
    benchmarks: {
      mmlu: 90.4,
      humanEval: 82.1,
      gsm8k: 95.8,
      costEfficiency: 96,
      safetyRating: 92,
      latencyScore: 78
    },
    ratings: {
      average: 4.91,
      count: 1950
    },
    downloadsOrCalls: 620000,
    license: 'MIT Open Source',
    status: 'online',
    supportedLanguages: ['English', 'Chinese', 'Python', 'Rust', 'C++', 'MathTeX'],
    tags: ['Reasoning', 'Math', 'Coding', 'Open-Weights', 'CoT'],
    endpointUrl: 'https://api.nexusai.market/v1/deepseek-r1/completions',
    huggingFaceUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
    createdAt: '2025-01-22',
    samplePrompts: [
      {
        title: 'Mathematical Proof & Number Theory',
        prompt: 'Prove that there are infinitely many primes of the form 4k + 3 using Dirichlet or Euclid-style contradiction.',
        expectedOutput: '<think>\nLet us assume by contradiction that there are only finitely many primes of the form 4k + 3: p1, p2, ..., pn.\nConsider N = 4(p1 * p2 * ... * pn) - 1...\n</think>\n\n### Proof by Contradiction\n1. Assume $S = \\{p_1, p_2, \\dots, p_k\\}$ is the finite set of all primes $\\equiv 3 \\pmod 4$.\n2. Construct integer $N = 4\\prod_{i=1}^k p_i - 1 = 4M - 1 \\equiv 3 \\pmod 4$.\n3. Since $N$ is odd and not divisible by 2, all prime factors of $N$ are odd.\n4. Every odd prime is $\\equiv 1$ or $\\equiv 3 \\pmod 4$. If all prime factors were $\\equiv 1 \\pmod 4$, their product $N$ would be $\\equiv 1 \\pmod 4$, a direct contradiction since $N \\equiv 3 \\pmod 4$.\n5. Hence, $N$ must have at least one prime factor $q \\equiv 3 \\pmod 4$.\n6. However, $q$ cannot be in our set $S$, because $N \\equiv -1 \\pmod{p_i}$ for every $p_i \\in S$.\n7. Therefore, a new prime exists, proving infinitely many primes $\\equiv 3 \\pmod 4$. $\\blacksquare$'
      }
    ]
  },
  {
    id: 'biomed-vision-70b',
    name: 'BioMed Diagnostics V3',
    slug: 'biomed-diagnostics-v3',
    tagline: 'HIPAA-compliant multimodal pathology, MRI segmentation & EHR assistant',
    description: 'Clinical grade vision-language model fine-tuned on 45M de-identified radiology, DICOM scans, histology slides, and medical literature with differential diagnosis assistance.',
    category: 'Healthcare',
    creator: {
      name: 'Dr. Evelyn Vance & BioHealth Lab',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'Stanford BioHealth Labs',
      modelsCount: 4
    },
    parameters: '72B Multimodal',
    architecture: 'Contrastive Vision-Language Transformer',
    quantization: ['FP16', 'BFloat16'],
    contextWindow: 64000,
    latencyMs: 420,
    tokensPerSec: 52,
    pricing: {
      inputPer1k: 0.0035,
      outputPer1k: 0.012,
      monthlyPro: 149,
      freeTierTokens: 25000,
      pricingType: 'subscription'
    },
    benchmarks: {
      mmlu: 88.2,
      humanEval: 68.0,
      gsm8k: 84.1,
      costEfficiency: 82,
      safetyRating: 99.4,
      latencyScore: 84
    },
    ratings: {
      average: 4.88,
      count: 730
    },
    downloadsOrCalls: 142000,
    license: 'Custom Clinical Research License',
    status: 'online',
    supportedLanguages: ['English', 'German', 'Medical SNOMED CT', 'ICD-10', 'DICOM'],
    tags: ['Healthcare', 'Radiology', 'Pathology', 'Differential Diagnosis', 'HIPAA'],
    endpointUrl: 'https://api.nexusai.market/v1/biomed/analyze',
    createdAt: '2024-11-10',
    samplePrompts: [
      {
        title: 'Radiology Report Synthesis',
        prompt: 'Summarize chest X-ray findings: bilateral diffuse interstitial opacities with perihilar predominance and cardiomegaly. Differential diagnosis and clinical recommendations.',
        expectedOutput: '### Clinical Impression & Differential\n\n1. **Primary Finding**: Cardiogenic Pulmonary Edema vs. Atypical Interstitial Pneumonitis.\n2. **Cardiomegaly**: Cardiothoracic ratio > 0.55 indicating left ventricular dilation/hypertrophy.\n3. **Recommendations**:\n   - Check serum NT-proBNP and arterial blood gases immediately.\n   - Administer IV loop diuretics (furosemide) if hemodynamically stable.\n   - Urgent Echocardiogram (TTE) for ejection fraction assessment.'
      }
    ]
  },
  {
    id: 'codesentinel-pro-34b',
    name: 'CodeSentinel Pro 34B',
    slug: 'codesentinel-pro-34b',
    tagline: 'Autonomous static security auditing, refactoring & zero-day exploit detector',
    description: 'Specialized code intelligence LLM trained on 10M+ CVE exploits, AST parse trees, and secure kernel implementations. Generates verified patches with unit regression tests.',
    category: 'Code',
    creator: {
      name: 'HexGuard Security Team',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'HexGuard Security',
      modelsCount: 6
    },
    parameters: '34B Code-Dense',
    architecture: 'StarCoder2 / RoPE Extension',
    quantization: ['FP16', 'INT8', 'INT4'],
    contextWindow: 65536,
    latencyMs: 220,
    tokensPerSec: 110,
    pricing: {
      inputPer1k: 0.0004,
      outputPer1k: 0.0016,
      monthlyPro: 39,
      freeTierTokens: 200000,
      pricingType: 'usage'
    },
    benchmarks: {
      mmlu: 84.5,
      humanEval: 91.2,
      gsm8k: 88.0,
      costEfficiency: 94,
      safetyRating: 97,
      latencyScore: 95
    },
    ratings: {
      average: 4.96,
      count: 3120
    },
    downloadsOrCalls: 915000,
    license: 'Apache-2.0',
    status: 'online',
    supportedLanguages: ['TypeScript', 'Rust', 'Go', 'Python', 'Solidity', 'C/C++', 'SQL'],
    tags: ['Code', 'Security', 'Vulnerability Audit', 'Refactoring', 'Solidity'],
    endpointUrl: 'https://api.nexusai.market/v1/codesentinel/scan',
    huggingFaceUrl: 'https://huggingface.co/hexguard/codesentinel-34b',
    createdAt: '2024-12-05',
    samplePrompts: [
      {
        title: 'Solidity Reentrancy & Flash Loan Guard',
        prompt: 'Audit this ERC-4626 vault withdraw function for reentrancy and rounding direction vulnerabilities. Provide patched secure code.',
        expectedOutput: '```solidity\n// VULNERABILITY DETECTED: CWE-670 Insecure State Update Before External Call\n// FIX: ReentrancyGuard nonReentrant modifier + Check-Effects-Interactions pattern\n\nfunction withdraw(uint256 assets, address receiver, address owner)\n    public virtual override nonReentrant returns (uint256 shares) {\n    shares = previewWithdraw(assets);\n    if (msg.sender != owner) {\n        _spendAllowance(owner, msg.sender, shares);\n    }\n    // 1. Effects: Burn shares first\n    _burn(owner, shares);\n    // 2. Interaction: Transfer token to receiver\n    SafeERC20.safeTransfer(IERC20(asset()), receiver, assets);\n    emit Withdraw(msg.sender, receiver, owner, assets, shares);\n}\n```'
      }
    ]
  },
  {
    id: 'finquant-alpha-27b',
    name: 'FinQuant Alpha Realtime',
    slug: 'finquant-alpha-27b',
    tagline: 'High-frequency market sentiment, SEC 10-K breakdown & macro forecasting',
    description: 'Quantitative finance intelligence model trained on Wall Street feeds, earning call audio transcripts, Bloomberg datasets, and Federal Reserve meeting minutes.',
    category: 'Finance',
    creator: {
      name: 'Apex Quantitative Labs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'Apex Capital AI',
      modelsCount: 3
    },
    parameters: '27B Mixture',
    architecture: 'FinBERT-MoE Transformer',
    quantization: ['FP16', 'INT8'],
    contextWindow: 128000,
    latencyMs: 190,
    tokensPerSec: 125,
    pricing: {
      inputPer1k: 0.0018,
      outputPer1k: 0.0075,
      monthlyPro: 89,
      freeTierTokens: 50000,
      pricingType: 'hybrid'
    },
    benchmarks: {
      mmlu: 86.4,
      humanEval: 76.8,
      gsm8k: 92.4,
      costEfficiency: 89,
      safetyRating: 94,
      latencyScore: 96
    },
    ratings: {
      average: 4.87,
      count: 1410
    },
    downloadsOrCalls: 480000,
    license: 'Commercial Enterprise',
    status: 'online',
    supportedLanguages: ['English', 'SEC XBRL', 'JSON-LD', 'Python Pandas'],
    tags: ['Finance', 'Quantitative', 'SEC 10-K', 'Sentiment', 'Forecasting'],
    endpointUrl: 'https://api.nexusai.market/v1/finquant/predict',
    createdAt: '2025-01-08',
    samplePrompts: [
      {
        title: 'SEC 10-K Risk Factor Synthesis',
        prompt: 'Extract newly added Supply Chain Risk factors from Nvidia and AMD 10-K disclosures and evaluate gross margin sensitivity to Taiwan foundry wafer pricing.',
        expectedOutput: '### Quantitative Risk Matrix\n\n1. **Wafer Price Elasticity**: Every +5% increase in 3nm/2nm substrate pricing compresses gross margins by **~48 basis points** if ASP pass-through is delayed by 1 quarter.\n2. **Concentration Metric**: 88% of advanced CoWoS packaging capacity concentrated in single geographic quadrant.\n3. **Hedge Recommendation**: Long semiconductor volatility straddles ahead of quarterly Capex reallocation cycles.'
      }
    ]
  },
  {
    id: 'whisper-ultra-audio-v3',
    name: 'WhisperUltra Multilingual V3',
    slug: 'whisper-ultra-v3',
    tagline: 'Sub-100ms real-time audio transcription, speaker diarization & tonal sentiment',
    description: 'Ultra-low latency speech foundation model capable of streaming speech-to-text in 118 languages with automated timestamp alignment, noise suppression, and speaker separation.',
    category: 'Audio',
    creator: {
      name: 'OpenAcoustics Foundation',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'OpenAcoustics',
      modelsCount: 5
    },
    parameters: '1.8B Audio-Encoder/Decoder',
    architecture: 'Conformer-CTC Streaming',
    quantization: ['FP16', 'INT8', 'ONNX Mobile'],
    contextWindow: 32000,
    latencyMs: 95,
    tokensPerSec: 210,
    pricing: {
      inputPer1k: 0.0001,
      outputPer1k: 0.0003,
      monthlyPro: 19,
      freeTierTokens: 500000,
      pricingType: 'usage'
    },
    benchmarks: {
      mmlu: 79.2,
      humanEval: 62.0,
      gsm8k: 71.0,
      costEfficiency: 99,
      safetyRating: 98,
      latencyScore: 99
    },
    ratings: {
      average: 4.93,
      count: 2450
    },
    downloadsOrCalls: 1200000,
    license: 'MIT Open Source',
    status: 'online',
    supportedLanguages: ['118 Languages', 'Regional Dialects', 'Phonetic IPA'],
    tags: ['Audio', 'Speech-to-Text', 'Diarization', 'Streaming', 'Sub-100ms'],
    endpointUrl: 'https://api.nexusai.market/v1/whisper/stream',
    huggingFaceUrl: 'https://huggingface.co/openai/whisper-large-v3',
    createdAt: '2024-10-18',
    samplePrompts: [
      {
        title: 'Meeting Diarization & Action Item Capture',
        prompt: 'Transcribe 4-speaker debate audio buffer with speaker separation, micro-pauses, and synthesize bulleted decisions.',
        expectedOutput: '[00:01.20] Speaker 1 (CTO): "Let us lock the Q3 latency target at 120ms."\n[00:04.85] Speaker 2 (Lead Architect): "Agreed, we will swap Triton kernels for FlashAttention-3."\n[00:09.10] Speaker 3 (PM): "I will update the sprint board."\n\n🎯 **Action Items Logged**:\n• Deploy FlashAttention-3 kernels by Friday.\n• Measure baseline throughput across A100/H100 clusters.'
      }
    ]
  },
  {
    id: 'omnivision-4k-diffusion',
    name: 'OmniVision 4K Diffusion Pro',
    slug: 'omnivision-4k-diffusion',
    tagline: 'High-fidelity text-to-image & video diffusion with cinematic lighting and typography',
    description: 'Next-gen diffusion transformer (DiT) architecture rendering photorealistic textures, exact English text rendering, complex multi-subject spatial consistency, and 4K upscaling.',
    category: 'Vision',
    creator: {
      name: 'Aetheria Art Systems',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'Aetheria Collective',
      modelsCount: 7
    },
    parameters: '16B DiT',
    architecture: 'Diffusion Transformer (DiT-XL/2)',
    quantization: ['FP16', 'BFloat16'],
    contextWindow: 16000,
    latencyMs: 1400,
    tokensPerSec: 35,
    pricing: {
      inputPer1k: 0.004,
      outputPer1k: 0.018,
      monthlyPro: 69,
      freeTierTokens: 10000,
      pricingType: 'subscription'
    },
    benchmarks: {
      mmlu: 77.0,
      humanEval: 54.0,
      gsm8k: 65.0,
      costEfficiency: 79,
      safetyRating: 96,
      latencyScore: 71
    },
    ratings: {
      average: 4.90,
      count: 1680
    },
    downloadsOrCalls: 530000,
    license: 'Commercial Creative License',
    status: 'online',
    supportedLanguages: ['English', 'Visual Style Tokens', 'Photographic Metadata'],
    tags: ['Vision', 'Diffusion', '4K-Rendering', 'Photorealism', 'Typography'],
    endpointUrl: 'https://api.nexusai.market/v1/omnivision/generate',
    createdAt: '2024-12-28',
    samplePrompts: [
      {
        title: 'Cinematic Product Mockup Prompt',
        prompt: 'Futuristic frosted glass quantum computer chip on a matte obsidian pedestal, glowing cyan superconductor circuits, volumetric caustic reflections, macro 85mm f/1.4 lens depth.',
        expectedOutput: '🎨 Rendering Pipeline Triggered: OmniVision-DiT (50 steps, Euler Ancestral)\nResolution: 3840 x 2160 (4K UHD)\nLighting Model: Physical Raytraced Subsurface Scattering\n[Generated Asset Link ready in cloud bucket storage: /artifacts/quantum_chip_4k.png]'
      }
    ]
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash Turbo',
    slug: 'gemini-1-5-flash-turbo',
    tagline: 'Ultra-fast sub-200ms lightweight multimodal powerhouse for high-volume apps',
    description: 'Engineered for high frequency, cost-constrained production apps requiring extreme speed, 1M context analysis, structured JSON extraction, and high throughput.',
    category: 'LLM',
    creator: {
      name: 'Google DeepMind Core',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      verified: true,
      organization: 'Google DeepMind',
      modelsCount: 14
    },
    parameters: 'MoE ~140B',
    architecture: 'High-Throughput Transformer MoE',
    quantization: ['FP16', 'INT8'],
    contextWindow: 1000000,
    latencyMs: 145,
    tokensPerSec: 185,
    pricing: {
      inputPer1k: 0.000075,
      outputPer1k: 0.0003,
      monthlyPro: 15,
      freeTierTokens: 1000000,
      pricingType: 'free'
    },
    benchmarks: {
      mmlu: 85.1,
      humanEval: 78.9,
      gsm8k: 88.6,
      costEfficiency: 99.8,
      safetyRating: 97,
      latencyScore: 98
    },
    ratings: {
      average: 4.92,
      count: 4200
    },
    downloadsOrCalls: 1950000,
    license: 'Commercial API License',
    status: 'online',
    supportedLanguages: ['100+ Languages', 'JSON Schema', 'Python', 'SQL'],
    tags: ['Ultra-Fast', 'Sub-200ms', '1M-Context', 'Cost-Efficient', 'JSON-Mode'],
    endpointUrl: 'https://api.nexusai.market/v1/gemini-flash/chat',
    huggingFaceUrl: 'https://huggingface.co/google/gemini-1.5-flash',
    createdAt: '2025-01-20',
    samplePrompts: [
      {
        title: 'Structured JSON Schema Extraction',
        prompt: 'Extract customer name, invoice amount, currency, tax ID, line items, and risk score from this raw email text into strict JSON format.',
        expectedOutput: '{\n  "invoice_number": "INV-2026-8941",\n  "customer": "AcroTech Dynamics Corp",\n  "currency": "USD",\n  "subtotal": 14250.00,\n  "tax_amount": 1140.00,\n  "total": 15390.00,\n  "risk_assessment": {\n    "score": 0.02,\n    "flag": "LOW_RISK",\n    "sanctions_check": "PASSED"\n  }\n}'
      }
    ]
  }
];

const LOCAL_STORAGE_MODELS_KEY = 'nexusai_marketplace_models';
const LOCAL_STORAGE_KEYS_KEY = 'nexusai_generated_api_keys';
const LOCAL_STORAGE_ORDERS_KEY = 'nexusai_deployment_orders';

export function getStoredModels(): AIModel[] {
  if (typeof window === 'undefined') return INITIAL_MODELS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MODELS_KEY);
    if (!raw) return INITIAL_MODELS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MODELS;
  } catch {
    return INITIAL_MODELS;
  }
}

export function saveModelToStorage(newModel: AIModel): AIModel[] {
  if (typeof window === 'undefined') return INITIAL_MODELS;
  const current = getStoredModels();
  const updated = [newModel, ...current.filter(m => m.id !== newModel.id)];
  localStorage.setItem(LOCAL_STORAGE_MODELS_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredApiKeys(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveApiKeyToStorage(newKey: any): any[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredApiKeys();
  const updated = [newKey, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEYS_KEY, JSON.stringify(updated));
  return updated;
}
