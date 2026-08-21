'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Zap, 
  Layers, 
  Terminal, 
  KeyRound, 
  Code2, 
  Globe, 
  FileText, 
  Webhook, 
  Star, 
  ArrowUpRight,
  ShieldCheck,
  Bot,
  Coins
} from 'lucide-react';
import { AgentEntity, ModelEntity, SkillEntity, ToolEntity } from '@/lib/agentforge-types';

interface AgentMarketplaceViewProps {
  agents: AgentEntity[];
  models: ModelEntity[];
  skills: SkillEntity[];
  tools: ToolEntity[];
  onSelectAgentForPlayground: (agent: AgentEntity) => void;
  onOpenDeployModal: (agent: AgentEntity) => void;
  onOpenDetailModal: (agent: AgentEntity) => void;
  onNavigateToComposer: () => void;
}

export const AgentMarketplaceView: React.FC<AgentMarketplaceViewProps> = ({
  agents,
  models,
  skills,
  tools,
  onSelectAgentForPlayground,
  onOpenDeployModal,
  onOpenDetailModal,
  onNavigateToComposer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const filteredAgents = agents.filter(a => {
    const skill = skills.find(s => s.id === a.skill_id);
    const matchesTag = selectedTag === 'ALL' || skill?.category === selectedTag;
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.creator_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-10 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>LangChain.js Composable Agents • Gemini 2.5 • Supabase Postgres</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            The Composable Marketplace for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500">
              Autonomous AI Agents
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Discover, test, and integrate production-grade AI agents with transparent tool calling (Code VM, Web Search, Scraping). Deploy with automated per-call billing.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToComposer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4" />
              Compose New Agent
            </button>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by name, skill category, or creator..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-transparent border-0 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['ALL', 'Development', 'Finance', 'Healthcare', 'Data Science'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAgents.map((agent) => {
            const skill = skills.find(s => s.id === agent.skill_id);
            const model = models.find(m => m.id === agent.model_id);
            const agentTools = tools.filter(t => agent.tool_ids.includes(t.id) || agent.tool_ids.includes(t.name));

            return (
              <div
                key={agent.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top Creator & Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={agent.creator_avatar}
                        alt={agent.creator_name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                      />
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white block">{agent.creator_name}</span>
                        <span className="text-[10px] text-zinc-400">{skill?.category || 'General'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        ${agent.price_per_call.toFixed(3)}
                      </span>
                      <span className="text-[10px] text-zinc-400 block leading-none">/ API call</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1 cursor-pointer" onClick={() => onOpenDetailModal(agent)}>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                      {agent.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {agent.tagline}
                    </p>
                  </div>

                  {/* Bound Tools */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      Bound LangChain Tools & Model
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {agentTools.map(t => (
                        <span key={t.id} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                          {t.name}
                        </span>
                      ))}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {model?.name || 'Gemini 2.5'}
                      </span>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="grid grid-cols-4 gap-2 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-[11px] font-mono">
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-sans">Calls</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {agent.calls_count >= 1000 ? `${(agent.calls_count / 1000).toFixed(1)}k` : agent.calls_count}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-sans">Success</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{agent.success_rate}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-sans">Latency</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{agent.avg_latency_ms}ms</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-sans">Rating</span>
                      <span className="font-bold text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {agent.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectAgentForPlayground(agent)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    Playground
                  </button>

                  <button
                    onClick={() => onOpenDeployModal(agent)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Get API Key
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
