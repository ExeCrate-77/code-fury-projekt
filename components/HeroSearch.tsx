'use client';

import React from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  Code2, 
  Activity, 
  TrendingUp, 
  BrainCircuit, 
  Eye, 
  Volume2, 
  Zap, 
  CheckCircle2,
  X
} from 'lucide-react';
import { ModelCategory } from '@/lib/types';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  pricingFilter: string;
  setPricingFilter: (filter: string) => void;
  totalModelsCount: number;
}

const CATEGORIES: Array<{ id: string; label: string; icon: any; color: string }> = [
  { id: 'ALL', label: 'All Models', icon: Layers, color: 'text-indigo-500' },
  { id: 'Multimodal', label: 'Multimodal', icon: Sparkles, color: 'text-violet-500' },
  { id: 'LLM', label: 'LLMs', icon: BrainCircuit, color: 'text-blue-500' },
  { id: 'Reasoning', label: 'Deep Reasoning', icon: Zap, color: 'text-amber-500' },
  { id: 'Code', label: 'Code & Security', icon: Code2, color: 'text-emerald-500' },
  { id: 'Healthcare', label: 'Healthcare', icon: Activity, color: 'text-rose-500' },
  { id: 'Finance', label: 'Quantitative Finance', icon: TrendingUp, color: 'text-cyan-500' },
  { id: 'Vision', label: 'Vision & Diffusion', icon: Eye, color: 'text-fuchsia-500' },
  { id: 'Audio', label: 'Speech & Audio', icon: Volume2, color: 'text-orange-500' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
  pricingFilter,
  setPricingFilter,
  totalModelsCount
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-8 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950">
      {/* Background glow dots */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badges and Main Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Discover, Benchmark & Deploy 100+ Specialized AI Weights</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-zinc-500 dark:text-zinc-400">Live Webhook Endpoints</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
            The Open Marketplace for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
              Verified AI Models
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Direct access to specialized foundation models, domain fine-tunes, and zero-day inference APIs. Evaluate benchmarks side-by-side in our live sandbox before deploying.
          </p>
        </div>

        {/* Search Bar & Primary Filter Controls */}
        <div className="mt-8 max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200 dark:border-zinc-800">
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models by name, creator, architecture, or tags (e.g. '70B', 'medical', 'security', 'vision')..."
                className="w-full pl-11 pr-10 py-2.5 text-sm bg-transparent border-0 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 pt-2 sm:pt-0 sm:pl-3">
              <span className="text-xs text-zinc-400 whitespace-nowrap hidden sm:inline">Sort:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full sm:w-auto text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 py-2 px-3 rounded-xl border-0 outline-none cursor-pointer"
              >
                <option value="popular">🔥 Most Popular</option>
                <option value="mmlu">🏆 Highest MMLU Score</option>
                <option value="latency">⚡ Lowest Latency</option>
                <option value="cost">💰 Cost: Low to High</option>
                <option value="newest">✨ Newest First</option>
              </select>
            </div>
          </div>

          {/* Secondary filter pills (Pricing & Status) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium mr-1">Pricing Model:</span>
              {['all', 'free', 'usage', 'subscription'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPricingFilter(p)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                    pricingFilter === p
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {p === 'all' ? 'All Tiers' : p === 'usage' ? 'Pay-as-you-go' : p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Showing <strong>{totalModelsCount}</strong> verified model endpoints</span>
            </div>
          </div>

          {/* Category Horizontal Scrolling Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin pt-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.color}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
