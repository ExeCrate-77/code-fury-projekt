'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Sliders, 
  Cpu, 
  Wrench, 
  Calculator, 
  Code2, 
  Globe, 
  Webhook, 
  Loader2, 
  Coins, 
  Clock, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { AgentStack, StackConfig, ExecutionLog } from '@/lib/stack-types';
import { deductUserCredits, saveExecutionLog } from '@/lib/stacks-store';

interface SandboxTestViewProps {
  stacks: AgentStack[];
  selectedStack: AgentStack | null;
  onSelectStack: (stack: AgentStack) => void;
  userCredits: number;
  onCreditsUpdated: (newCredits: number) => void;
}

export const SandboxTestView: React.FC<SandboxTestViewProps> = ({
  stacks,
  selectedStack,
  onSelectStack,
  userCredits,
  onCreditsUpdated
}) => {
  const currentStack = selectedStack || stacks[0] || null;

  const [prompt, setPrompt] = useState<string>(
    'Audit this smart contract token distribution logic and calculate the exact basis-point slippage tolerance if 15,000 units are swapped.'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedTools, setExpandedTools] = useState<Record<number, boolean>>({ 0: true });

  const PRESETS = [
    {
      title: '🛡️ Code VM & Math Audit',
      prompt: 'Verify this arithmetic algorithm in the code interpreter, check for overflow vulnerabilities, and calculate the asymptotic upper bound.'
    },
    {
      title: '📈 DCF Margin & Growth Calculation',
      prompt: 'Calculate the 5-year discounted cash flow with a 12% hurdle rate and 8.5% terminal growth on an initial free cash flow of $4,500,000.'
    },
    {
      title: '🩺 Clinical Differential Synthesis',
      prompt: 'Synthesize differential diagnoses for acute epigastric pain radiating to the back with elevated serum lipase (>3x upper limit). Citing standard protocols.'
    },
    {
      title: '⚡ SQL Performance Optimization',
      prompt: 'Optimize a high-throughput time-series aggregation query on 50M records and execute sample transformation in the code sandbox.'
    }
  ];

  const handleExecute = async () => {
    if (!prompt.trim() || !currentStack) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/sandbox/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: currentStack.config,
          prompt,
          pricePerCall: currentStack.pricePerCall
        })
      });

      const data = await res.json();
      setResult(data);

      if (data.costDeducted) {
        const nextCredits = deductUserCredits(data.costDeducted);
        onCreditsUpdated(nextCredits);

        // Save execution log
        const newLog: ExecutionLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          prompt,
          response: data.text || '',
          latencyMs: data.latencyMs || 0,
          totalTokens: data.totalTokens || 0,
          promptTokens: data.promptTokens || 0,
          completionTokens: data.completionTokens || 0,
          costDeducted: data.costDeducted || 0.002,
          toolsCalled: data.toolsCalled || [],
          status: 'success'
        };
        saveExecutionLog(newLog);
      }
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleToolExpand = (index: number) => {
    setExpandedTools(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-amber-500" />
              Live Stack Testing Sandbox
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Server-Side Tool Calling
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Test multi-turn tool calling loops with sandboxed Node VM execution, precision calculator, and web grounding.
          </p>
        </div>

        {/* Selected Stack Dropdown */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-xs font-semibold text-zinc-400 pl-2">Active Stack:</span>
          <select
            value={currentStack?.id || ''}
            onChange={(e) => {
              const found = stacks.find(s => s.id === e.target.value);
              if (found) onSelectStack(found);
            }}
            className="text-xs font-bold bg-transparent text-zinc-900 dark:text-white border-0 outline-none cursor-pointer pr-2"
          >
            {stacks.map(s => (
              <option key={s.id} value={s.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                {s.name} (${s.pricePerCall}/call)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Stack Specs Badge Strip */}
      {currentStack && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{currentStack.name}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-zinc-500">{currentStack.config.model}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              ${currentStack.pricePerCall}/call
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 font-medium mr-1">Active Tools:</span>
            {currentStack.config.enabledTools.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Domain Preset Prompts */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Preset Test Prompts
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(p.prompt)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200 dark:border-zinc-800 transition-all flex-shrink-0"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Execution Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Input & Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-indigo-500" />
                Prompt Payload
              </span>
              <button
                onClick={() => setPrompt('')}
                className="text-[11px] text-zinc-400 hover:text-rose-500"
              >
                Clear
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              placeholder="Enter your prompt to execute against the active agent stack..."
              className="w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono resize-y"
            />

            <button
              onClick={handleExecute}
              disabled={loading || !prompt.trim() || !currentStack}
              className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing Function-Calling Loop...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Agent Stack</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Telemetry & Tool Invocation Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[460px]">
            {/* Telemetry Header */}
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  Agent Execution Response
                </span>
              </div>

              {result?.text && (
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {/* Metrics Bar */}
            {result && !result.error && (
              <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-zinc-100/60 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-mono">
                <div>
                  <span className="text-zinc-400 block text-[9px] uppercase font-sans">Latency</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.latencyMs}ms</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[9px] uppercase font-sans">Tokens</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{result.totalTokens}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[9px] uppercase font-sans">Cost Deducted</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">${result.costDeducted}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[9px] uppercase font-sans">Tools Invoked</span>
                  <span className="font-bold text-amber-500">{result.toolsCalled?.length || 0}</span>
                </div>
              </div>
            )}

            {/* Tool Calls Accordion Timeline */}
            {result?.toolsCalled && result.toolsCalled.length > 0 && (
              <div className="p-3 bg-amber-500/5 border-b border-amber-500/20 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block">
                  ⚙️ Server-Side Tool Invocations ({result.toolsCalled.length})
                </span>

                {result.toolsCalled.map((t: any, idx: number) => (
                  <div key={idx} className="rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs font-mono">
                    <div 
                      onClick={() => toggleToolExpand(idx)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
                        {expandedTools[idx] ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                        <span className="text-indigo-600 dark:text-indigo-400">{t.toolName}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{t.executionTimeMs}ms</span>
                    </div>

                    {expandedTools[idx] && (
                      <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] space-y-1.5">
                        <div>
                          <span className="text-zinc-400 block text-[10px]">Input Arguments:</span>
                          <pre className="p-1.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                            {JSON.stringify(t.input, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px]">Tool Output / Return Value:</span>
                          <pre className="p-1.5 rounded bg-zinc-50 dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                            {JSON.stringify(t.output, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Final Text Output */}
            <div className="p-5 flex-1 overflow-y-auto text-xs font-mono leading-relaxed bg-zinc-50/20 dark:bg-zinc-950/20 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  <span>Synthesizing agent pipeline & tool returns...</span>
                </div>
              ) : result?.text ? (
                result.text
              ) : result?.error ? (
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
                  Execution Error: {result.error}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 py-16 text-center">
                  <Terminal className="w-8 h-8 stroke-[1.5] text-zinc-300 dark:text-zinc-700" />
                  <span>Click <strong>"Execute Agent Stack"</strong> to run {currentStack?.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
