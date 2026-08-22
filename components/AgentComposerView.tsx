'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, ArrowUpRight, ShieldCheck, Cpu, Code2, Database } from 'lucide-react';

interface AgentCardProps {
  author: string;
  avatar: string;
  category: string;
  title: string;
  description: string;
  price: string;
  tools: string[];
  model: string;
}

function MarketplaceCard({
  author,
  category,
  title,
  description,
  price,
  tools,
  model,
}: AgentCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* Background Radial Glow */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-all group-hover:bg-indigo-500/20" />

      <div>
        {/* Author Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h4 className="text-sm font-semibold text-white">{author}</h4>
            <span className="text-xs text-zinc-500">{category}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono font-bold text-indigo-400">{price}</span>
            <span className="block text-[10px] text-zinc-500">/ API call</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
            {title}
            <ArrowUpRight className="h-4 w-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Bound Tools & Model */}
      <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
        <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-500 uppercase block">
          Bound LangChain Tools & Model
        </span>
        <div className="flex flex-wrap gap-1.5">
          {tools.map((tool) => (
            <span
              key={tool}
              className="rounded-md border border-white/10 bg-zinc-800/60 px-2 py-0.5 text-[11px] font-mono text-zinc-300"
            >
              {tool}
            </span>
          ))}
          <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-mono text-indigo-300">
            {model}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AgentMarketplaceView() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Development', 'Finance', 'Healthcare', 'Data Science'];

  const agents: AgentCardProps[] = [
    {
      author: 'Sarah Lin (Staff Architect)',
      avatar: '/avatars/sarah.jpg',
      category: 'Development',
      title: 'Sentinel Code Security Agent',
      description: 'Autonomous AST security auditing, zero-day detection & patch synthesizer.',
      price: '$0.002',
      tools: ['code_exec', 'web_search'],
      model: 'Google Gemini 2.5 Flash',
    },
    {
      author: 'Marcus Vance (Apex Capital)',
      avatar: '/avatars/marcus.jpg',
      category: 'Finance',
      title: 'FinQuant Alpha Strategist',
      description: 'Real-time financial ratio modeling, SEC 10-K risk audit & DCF synthesizer.',
      price: '$0.004',
      tools: ['web_search', 'web_scrape'],
      model: 'Google Gemini 2.5 Pro',
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            LangChain.js Composable Agents • Gemini 2.5 • Supabase
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            The Composable Marketplace for{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Autonomous AI Agents
            </span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Discover, test, and integrate production-grade AI agents with transparent tool calling (Code VM, Web Search, Scraping). Deploy with automated per-call billing.
          </p>

          <div className="pt-2">
            <button className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30">
              Compose New Agent
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 p-3 backdrop-blur-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by name, skill category, or creator..."
              className="w-full rounded-xl bg-transparent pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <MarketplaceCard key={agent.title} {...agent} />
          ))}
        </div>

      </div>
    </div>
  );
}