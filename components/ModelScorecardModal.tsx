'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Cpu, 
  Code, 
  Copy, 
  Check, 
  KeyRound, 
  ExternalLink, 
  Layers,
  Terminal,
  Activity,
  Award
} from 'lucide-react';
import { AIModel } from '@/lib/types';

interface ModelScorecardModalProps {
  model: AIModel | null;
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (model: AIModel) => void;
  onOpenPlayground: (model: AIModel) => void;
}

export const ModelScorecardModal: React.FC<ModelScorecardModalProps> = ({
  model,
  isOpen,
  onClose,
  onDeploy,
  onOpenPlayground
}) => {
  const [selectedLang, setSelectedLang] = useState<'python' | 'curl' | 'typescript' | 'langchain'>('python');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !model) return null;

  const getCodeSnippet = () => {
    switch (selectedLang) {
      case 'python':
        return `# NexusAI Python SDK Client
from nexusai import NexusClient

client = NexusClient(api_key="nx_live_your_key_here")

response = client.models.generate(
    model="${model.id}",
    prompt="Explain quantum entanglement in 2 sentences.",
    temperature=0.7,
    max_tokens=500
)

print(response.text)
print(f"Latency: {response.latency_ms}ms | Cost: \${response.cost_estimate}")`;

      case 'curl':
        return `curl -X POST https://api.nexusai.market/v1/models/${model.id}/chat \\
  -H "Authorization: Bearer nx_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explain quantum entanglement in 2 sentences.",
    "temperature": 0.7,
    "max_tokens": 500
  }'`;

      case 'typescript':
        return `// Next.js / TypeScript Fetch Integration
const res = await fetch('https://api.nexusai.market/v1/models/${model.id}/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer nx_live_your_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Explain quantum entanglement in 2 sentences.',
    temperature: 0.7,
    max_tokens: 500
  })
});

const data = await res.json();
console.log(data.text);`;

      case 'langchain':
        return `from langchain_community.chat_models import ChatNexusAI

chat = ChatNexusAI(
    model="${model.id}",
    nexus_api_key="nx_live_your_key_here",
    temperature=0.7
)

messages = [
    ("system", "You are an elite reasoning assistant."),
    ("human", "Solve this complex equation step by step.")
]

response = chat.invoke(messages)
print(response.content)`;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <img
              src={model.creator.avatar}
              alt={model.creator.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                  {model.name}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {model.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                Created by <strong className="text-zinc-700 dark:text-zinc-300">{model.creator.name}</strong> • {model.creator.organization}
                {model.creator.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenPlayground(model);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <Terminal className="w-4 h-4 text-amber-500" />
              Live Sandbox
            </button>
            <button
              onClick={() => {
                onClose();
                onDeploy(model);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              Deploy Model
            </button>
          </div>
        </div>

        {/* Description & Overview */}
        <div className="my-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description & Model Summary</h4>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {model.description}
          </p>
        </div>

        {/* Benchmark Evaluation Scorecard Grid */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" />
              Transparent Evaluation Scorecard & Benchmarks
            </h4>
            <span className="text-[11px] text-zinc-500 font-mono">Independent Audited Metrics</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">MMLU General Score</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                  {model.benchmarks.mmlu}%
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold">Tier 1</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${model.benchmarks.mmlu}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">HumanEval (Code)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {model.benchmarks.humanEval}%
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">0-shot pass@1</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${model.benchmarks.humanEval}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">GSM8K (Math & Logic)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {model.benchmarks.gsm8k}%
                </span>
                <span className="text-[10px] text-amber-500 font-medium">Verified CoT</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${model.benchmarks.gsm8k}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Inference Latency</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono flex items-center gap-1">
                  <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  {model.latencyMs}ms
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">{model.tokensPerSec} tok/s</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Cost Efficiency Index</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                  {model.benchmarks.costEfficiency}/100
                </span>
                <span className="text-[10px] text-cyan-500 font-medium">Eco Score</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${model.benchmarks.costEfficiency}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Safety & Alignment</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {model.benchmarks.safetyRating}%
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold">Audited</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${model.benchmarks.safetyRating}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Specs */}
        <div className="my-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Hardware & Technical Specifications
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Architecture</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-1 block truncate">
                {model.architecture}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Context Window</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-1 block">
                {model.contextWindow.toLocaleString()} tokens
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Quantization Formats</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-1 block truncate">
                {model.quantization.join(', ')}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-semibold">License</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block truncate">
                {model.license}
              </span>
            </div>
          </div>
        </div>

        {/* Code SDK Integration Generator */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                1-Click SDK Integration Snippets
              </h4>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
              {(['python', 'curl', 'typescript', 'langchain'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-all ${
                    selectedLang === lang
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl bg-zinc-950 text-zinc-100 p-4 font-mono text-xs overflow-x-auto border border-zinc-800">
            <button
              onClick={copyCode}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <pre className="pr-20 leading-relaxed">{getCodeSnippet()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
