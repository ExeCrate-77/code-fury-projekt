'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Zap, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Split, 
  Sliders, 
  Clock, 
  Layers,
  Coins,
  ShieldCheck,
  Cpu,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { AIModel } from '@/lib/types';

interface PlaygroundSandboxProps {
  models: AIModel[];
  initialModel?: AIModel | null;
}

export const PlaygroundSandbox: React.FC<PlaygroundSandboxProps> = ({
  models,
  initialModel
}) => {
  const defaultModelA = initialModel || models[0] || null;
  const defaultModelB = models[1] || models[0] || null;

  const [isDualMode, setIsDualMode] = useState<boolean>(false);
  const [modelA, setModelA] = useState<AIModel | null>(defaultModelA);
  const [modelB, setModelB] = useState<AIModel | null>(defaultModelB);

  const [prompt, setPrompt] = useState<string>(
    'Analyze this distributed microservice architecture with Kafka, Redis cache, and Postgres. Identify single points of failure and race condition vectors in a high-throughput payment flow.'
  );
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(800);

  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [loadingB, setLoadingB] = useState<boolean>(false);

  const [resultA, setResultA] = useState<any>(null);
  const [resultB, setResultB] = useState<any>(null);

  const [copiedA, setCopiedA] = useState<boolean>(false);
  const [copiedB, setCopiedB] = useState<boolean>(false);

  const PRESETS = [
    {
      title: '🛡️ Security Audit',
      prompt: 'Audit this ERC-4626 vault withdraw function for reentrancy and rounding direction vulnerabilities. Provide patched secure code with nonReentrant guard.',
      category: 'Code'
    },
    {
      title: '🩺 Medical Differential',
      prompt: 'Summarize chest X-ray findings: bilateral diffuse interstitial opacities with perihilar predominance and cardiomegaly. Differential diagnosis and clinical recommendations.',
      category: 'Healthcare'
    },
    {
      title: '📈 Quantitative Finance',
      prompt: 'Extract newly added Supply Chain Risk factors from Nvidia and AMD 10-K disclosures and evaluate gross margin sensitivity to Taiwan foundry wafer pricing.',
      category: 'Finance'
    },
    {
      title: '🔬 Math Reasoning',
      prompt: 'Prove that there are infinitely many primes of the form 4k + 3 using Dirichlet or Euclid-style contradiction.',
      category: 'Reasoning'
    },
    {
      title: '⚡ JSON Extraction',
      prompt: 'Extract customer name, invoice amount, currency, tax ID, line items, and risk score from this raw email text into strict JSON schema.',
      category: 'LLM'
    }
  ];

  const handleRunInference = async () => {
    if (!prompt.trim() || !modelA) return;

    setLoadingA(true);
    setResultA(null);

    const callModel = async (model: AIModel) => {
      const res = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: model.id,
          prompt,
          temperature,
          maxTokens
        })
      });
      return await res.json();
    };

    // Run Model A
    callModel(modelA)
      .then((data) => setResultA(data))
      .catch((err) => setResultA({ error: err.message }))
      .finally(() => setLoadingA(false));

    // Run Model B if in dual mode
    if (isDualMode && modelB) {
      setLoadingB(true);
      setResultB(null);
      callModel(modelB)
        .then((data) => setResultB(data))
        .catch((err) => setResultB({ error: err.message }))
        .finally(() => setLoadingB(false));
    }
  };

  const copyToClipboard = (text: string, isA: boolean) => {
    navigator.clipboard.writeText(text);
    if (isA) {
      setCopiedA(true);
      setTimeout(() => setCopiedA(false), 2000);
    } else {
      setCopiedB(true);
      setTimeout(() => setCopiedB(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-amber-500" />
              Live Interactive Model Playground
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Sandbox
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Test and benchmark model inference latency, token economics, and response quality before deploying production API keys.
          </p>
        </div>

        {/* Dual Mode Toggle */}
        <button
          onClick={() => setIsDualMode(!isDualMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            isDualMode
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
              : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
          }`}
        >
          <Split className="w-4 h-4" />
          {isDualMode ? 'Dual Model Comparison (Active)' : 'Enable Side-by-Side Comparison'}
        </button>
      </div>

      {/* Preset Prompts Quick Bar */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
          Domain-Specific Sample Prompts
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(p.prompt)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 hover:border-indigo-300 transition-all flex-shrink-0"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Input & Hyperparameters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                Prompt & Parameters
              </span>
              <button
                onClick={() => setPrompt('')}
                className="text-[11px] text-zinc-400 hover:text-rose-500 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                User Instruction / Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                placeholder="Enter prompt to execute across selected models..."
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 transition-colors font-mono resize-y"
              />
            </div>

            {/* Hyperparameter Sliders */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Temperature</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Max Tokens</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunInference}
              disabled={loadingA || loadingB || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {loadingA || loadingB ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inferencing Neural Graph...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute {isDualMode ? 'Both Models' : 'Benchmark'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output Windows (8 cols) */}
        <div className={`lg:col-span-8 grid grid-cols-1 ${isDualMode ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {/* Model Window A */}
          <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[420px]">
            {/* Model A Header & Dropdown */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  Model A
                </span>
                <select
                  value={modelA?.id || ''}
                  onChange={(e) => {
                    const found = models.find((m) => m.id === e.target.value);
                    if (found) setModelA(found);
                  }}
                  className="text-xs font-bold bg-transparent text-zinc-900 dark:text-white border-0 outline-none cursor-pointer truncate max-w-[180px]"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                      {m.name} ({m.category})
                    </option>
                  ))}
                </select>
              </div>

              {resultA?.text && (
                <button
                  onClick={() => copyToClipboard(resultA.text, true)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Copy Output"
                >
                  {copiedA ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Model A Telemetry Stats */}
            {resultA && (
              <div className="grid grid-cols-4 gap-1 px-3 py-2 bg-zinc-100/50 dark:bg-zinc-950/50 border-b border-zinc-200/50 dark:border-zinc-800/50 text-[10px] font-mono">
                <div>
                  <span className="text-zinc-400 block">Latency</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{resultA.latencyMs}ms</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Throughput</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">{resultA.tokensPerSec} tok/s</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Est. Cost</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">${resultA.costEstimate}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Tokens</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{resultA.tokensCount}</span>
                </div>
              </div>
            )}

            {/* Output Display Area */}
            <div className="p-4 flex-1 overflow-y-auto text-xs font-mono leading-relaxed bg-zinc-50/30 dark:bg-zinc-950/30 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {loadingA ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  <span>Streaming model tokens...</span>
                </div>
              ) : resultA?.text ? (
                resultA.text
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 py-16 text-center">
                  <Terminal className="w-8 h-8 stroke-[1.5] text-zinc-300 dark:text-zinc-700" />
                  <span>Click <strong>"Execute Benchmark"</strong> to test {modelA?.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Model Window B (Dual Mode) */}
          {isDualMode && (
            <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[420px]">
              {/* Model B Header & Dropdown */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                    Model B
                  </span>
                  <select
                    value={modelB?.id || ''}
                    onChange={(e) => {
                      const found = models.find((m) => m.id === e.target.value);
                      if (found) setModelB(found);
                    }}
                    className="text-xs font-bold bg-transparent text-zinc-900 dark:text-white border-0 outline-none cursor-pointer truncate max-w-[180px]"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {m.name} ({m.category})
                      </option>
                    ))}
                  </select>
                </div>

                {resultB?.text && (
                  <button
                    onClick={() => copyToClipboard(resultB.text, false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    title="Copy Output"
                  >
                    {copiedB ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Model B Telemetry Stats */}
              {resultB && (
                <div className="grid grid-cols-4 gap-1 px-3 py-2 bg-zinc-100/50 dark:bg-zinc-950/50 border-b border-zinc-200/50 dark:border-zinc-800/50 text-[10px] font-mono">
                  <div>
                    <span className="text-zinc-400 block">Latency</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{resultB.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Throughput</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{resultB.tokensPerSec} tok/s</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Est. Cost</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">${resultB.costEstimate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Tokens</span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">{resultB.tokensCount}</span>
                  </div>
                </div>
              )}

              {/* Output Display Area */}
              <div className="p-4 flex-1 overflow-y-auto text-xs font-mono leading-relaxed bg-zinc-50/30 dark:bg-zinc-950/30 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                {loadingB ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                    <span>Streaming model tokens...</span>
                  </div>
                ) : resultB?.text ? (
                  resultB.text
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 py-16 text-center">
                    <Terminal className="w-8 h-8 stroke-[1.5] text-zinc-300 dark:text-zinc-700" />
                    <span>Click <strong>"Execute Both Models"</strong> to test {modelB?.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
