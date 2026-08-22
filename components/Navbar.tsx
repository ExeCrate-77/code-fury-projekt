'use client';

import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Terminal, 
  KeyRound, 
  PlusCircle, 
  BarChart3, 
  Search, 
  ShieldCheck, 
  ExternalLink,
  Zap,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'marketplace' | 'playground' | 'creator' | 'dashboard';
  setActiveTab: (tab: 'marketplace' | 'playground' | 'creator' | 'dashboard') => void;
  openCreatorModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeKeysCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openCreatorModal,
  searchQuery,
  setSearchQuery,
  activeKeysCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      {/* Top micro ticker */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1 text-xs border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Neural Mesh Active (8 Clusters Online)
          </span>
          <span className="hidden md:inline text-zinc-400">•</span>
          <span className="hidden md:inline">Global Avg Latency: <strong className="text-zinc-700 dark:text-zinc-300">142ms</strong></span>
          <span className="hidden md:inline text-zinc-400">•</span>
          <span className="hidden md:inline">Zero-Markup Pricing Protocol</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
            Next.js 16 • Supabase • Gemini API
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('marketplace')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400">
                NexusAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Marketplace
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-none">
              Open Model Bazaar & Benchmark Sandbox
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'marketplace'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            Explore Models
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'playground'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-500" />
            Live Playground
            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded-full border border-amber-500/20">
              Gemini
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            Buyer Dashboard
            {activeKeysCount > 0 && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded-full">
                {activeKeysCount} Keys
              </span>
            )}
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCreatorModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Publish Model</span>
            <span className="sm:hidden">Publish</span>
          </button>
        </div>
      </div>

      {/* Mobile nav pills */}
      <div className="lg:hidden flex items-center justify-around border-t border-zinc-200 dark:border-zinc-800 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md ${
            activeTab === 'marketplace' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Models
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md ${
            activeTab === 'playground' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Playground
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Dashboard
        </button>
      </div>
    </header>
  );
};
