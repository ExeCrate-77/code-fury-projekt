'use client';

import React from 'react';
import { 
  CheckCircle, 
  Zap, 
  Clock, 
  Cpu, 
  Terminal, 
  KeyRound, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight,
  BarChart2,
  Lock,
  DownloadCloud
} from 'lucide-react';
import { AIModel } from '@/lib/types';

interface ModelCardProps {
  model: AIModel;
  onOpenScorecard: (model: AIModel) => void;
  onTestInPlayground: (model: AIModel) => void;
  onDeploy: (model: AIModel) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onOpenScorecard,
  onTestInPlayground,
  onDeploy
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Multimodal': return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
      case 'LLM': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Reasoning': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Code': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Healthcare': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'Finance': return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'Vision': return 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20';
      case 'Audio': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      default: return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 p-5 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300">
      {/* Top row: Creator & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <img 
              src={model.creator.avatar} 
              alt={model.creator.name} 
              className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700" 
            />
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[130px]">
                {model.creator.organization}
              </span>
              {model.creator.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
              )}
            </div>
          </div>

          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(model.category)}`}>
            {model.category}
          </span>
        </div>

        {/* Model Title & Tagline */}
        <div className="space-y-1.5 cursor-pointer" onClick={() => onOpenScorecard(model)}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              {model.name}
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {model.tagline}
          </p>
        </div>

        {/* Hardware & Metric Spec Grid */}
        <div className="grid grid-cols-3 gap-2 my-4 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-[11px]">
          <div className="space-y-0.5">
            <span className="text-zinc-400 block text-[10px] uppercase font-medium">Params</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{model.parameters}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-zinc-400 block text-[10px] uppercase font-medium">Latency</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-emerald-500" />
              {model.latencyMs}ms
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-zinc-400 block text-[10px] uppercase font-medium">Context</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {model.contextWindow >= 1000000 ? `${model.contextWindow / 1000000}M` : `${model.contextWindow / 1000}k`}
            </span>
          </div>
        </div>

        {/* Benchmarks mini progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
              MMLU Benchmark
            </span>
            <span className="font-bold text-zinc-900 dark:text-white font-mono">
              {model.benchmarks.mmlu}%
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" 
              style={{ width: `${model.benchmarks.mmlu}%` }}
            />
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {model.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              #{tag}
            </span>
          ))}
          {model.tags.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              +{model.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Pricing & Action Buttons */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">
              Pricing Tier
            </span>
            <div className="text-xs font-extrabold text-zinc-900 dark:text-white">
              {model.pricing.pricingType === 'free' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Free Tier</span>
              ) : model.pricing.pricingType === 'subscription' ? (
                <span>${model.pricing.monthlyPro}<span className="text-[10px] font-normal text-zinc-400">/mo Pro</span></span>
              ) : (
                <span>${model.pricing.inputPer1k}<span className="text-[10px] font-normal text-zinc-400">/1k tokens</span></span>
              )}
            </div>
          </div>

          <button
            onClick={() => onOpenScorecard(model)}
            className="text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Scorecard & Docs →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onTestInPlayground(model)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            Sandbox
          </button>

          <button
            onClick={() => onDeploy(model)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Get API Key
          </button>
        </div>
      </div>
    </div>
  );
};
