'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Zap, 
  Layers, 
  Wrench, 
  Terminal, 
  KeyRound, 
  Code2, 
  Calculator, 
  Globe, 
  Webhook, 
  CheckCircle, 
  Star, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Coins
} from 'lucide-react';
import { AgentStack, StackCategory } from '@/lib/stack-types';

interface StackMarketplaceViewProps {
  stacks: AgentStack[];
  onSelectStackForSandbox: (stack: AgentStack) => void;
  onOpenDeployModal: (stack: AgentStack) => void;
  onOpenDetailModal: (stack: AgentStack) => void;
  onNavigateToBuilder: () => void;
}

const CATEGORIES: Array<{ id: string; label: string }> = [
  { id: 'ALL', label: 'All Stacks' },
  { id: 'Development', label: 'Development & Security' },
  { id: 'Finance', label: 'Quantitative Finance' },
  { id: 'Healthcare', label: 'Healthcare & Biomedical' },
  { id: 'Data Science', label: 'Data Science & SQL' },
  { id: 'Research', label: 'Research & Grounding' },
];

export const StackMarketplaceView: React.FC<StackMarketplaceViewProps> = ({
  stacks,
  onSelectStackForSandbox,
  onOpenDeployModal,
  onOpenDetailModal,
  onNavigateToBuilder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'latency' | 'rating' | 'cost'>('popular');

  const filteredStacks = stacks
    .filter((s) => {
      const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.callsCount - a.callsCount;
      if (sortBy === 'latency') return a.avgLatencyMs - b.avgLatencyMs;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'cost') return a.pricePerCall - b.pricePerCall;
      return 0;
    });

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'calculator': return <Calculator className="w-3.5 h-3.5 text-amber-500" />;
      case 'code_interpreter': return <Code2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'web_search': return <Globe className="w-3.5 h-3.5 text-blue-500" />;
      case 'custom_webhook': return <Webhook className="w-3.5 h-3.5 text-purple-500" />;
      default: return <Wrench className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getToolLabel = (toolName: string) => {
    switch (toolName) {
      case 'calculator': return 'Math Engine';
      case 'code_interpreter': return 'Code VM';
      case 'web_search': return 'Web Grounding';
      case 'custom_webhook': return 'REST Webhook';
      default: return toolName;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-10 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Assemble • Test with Function Calling • Monetize as APIs</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-zinc-500 dark:text-zinc-400">Gemini 2.0 Powered</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            The Marketplace for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500">
              Autonomous AI Agent Stacks
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Discover production-grade agent stacks equipped with sandboxed code execution, precision math engines, and real-time grounding. Integrate any stack into your application with 1 line of code.
          </p>

          {/* Quick CTA row */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToBuilder}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              Build & Monetize Your Stack
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agent stacks by name, skill, creator, or tools..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-transparent border-0 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-zinc-200 dark:border-zinc-800 pt-2 sm:pt-0 sm:pl-3">
            <span className="text-xs text-zinc-400 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 py-1.5 px-3 rounded-xl border-0 outline-none cursor-pointer"
            >
              <option value="popular">🔥 Most Calls Served</option>
              <option value="latency">⚡ Lowest Latency</option>
              <option value="rating">⭐ Highest Rating</option>
              <option value="cost">💰 Lowest Price / Call</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Scrolling Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Stacks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredStacks.map((stack) => (
            <div
              key={stack.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header: Creator & Pricing Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={stack.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                      alt={stack.ownerName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                        {stack.ownerName}
                      </span>
                      <span className="text-[10px] text-zinc-400">{stack.category}</span>
                    </div>
                  </div>

                  {/* Pricing tag */}
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                      ${stack.pricePerCall.toFixed(3)}
                    </span>
                    <span className="text-[10px] text-zinc-400 block leading-none">/ API call</span>
                  </div>
                </div>

                {/* Stack Title & Tagline */}
                <div 
                  className="space-y-1 cursor-pointer"
                  onClick={() => onOpenDetailModal(stack)}
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    {stack.name}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {stack.tagline}
                  </p>
                </div>

                {/* Enabled Tools Row */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                    Equipped Autonomous Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.config.enabledTools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
                      >
                        {getToolIcon(tool)}
                        <span>{getToolLabel(tool)}</span>
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      <Cpu className="w-3 h-3" />
                      {stack.config.model}
                    </span>
                  </div>
                </div>

                {/* Trust Signals & Telemetry Bar */}
                <div className="grid grid-cols-4 gap-2 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 text-[11px] font-mono">
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase font-sans">Calls Served</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {stack.callsCount >= 1000 ? `${(stack.callsCount / 1000).toFixed(1)}k` : stack.callsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase font-sans">Success Rate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{stack.successRate}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase font-sans">Avg Latency</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{stack.avgLatencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase font-sans">Rating</span>
                    <span className="font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {stack.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectStackForSandbox(stack)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-500" />
                  Test in Sandbox
                </button>

                <button
                  onClick={() => onOpenDeployModal(stack)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Get API Key & Code
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
