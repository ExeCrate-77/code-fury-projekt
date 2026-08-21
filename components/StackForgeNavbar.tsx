'use client';

import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Wrench, 
  Terminal, 
  BarChart3, 
  PlusCircle, 
  Coins, 
  ShieldCheck, 
  ArrowUpRight,
  Zap,
  Code2
} from 'lucide-react';

interface StackForgeNavbarProps {
  activeTab: 'marketplace' | 'builder' | 'sandbox' | 'dashboard';
  setActiveTab: (tab: 'marketplace' | 'builder' | 'sandbox' | 'dashboard') => void;
  openNewStackBuilder: () => void;
  userCredits: number;
  onTopUpCredits: () => void;
  activeKeysCount: number;
}

export const StackForgeNavbar: React.FC<StackForgeNavbarProps> = ({
  activeTab,
  setActiveTab,
  openNewStackBuilder,
  userCredits,
  onTopUpCredits,
  activeKeysCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md">
      {/* Top telemetry bar */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1 text-xs border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/60 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            StackForge Engine v2.4 Online (Gemini 2.0 Function Calling)
          </span>
          <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="hidden md:inline">Sandboxed Node VM: <strong className="text-zinc-700 dark:text-zinc-300">Ready</strong></span>
          <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="hidden md:inline">Metered Sub-Cent Billing Protocol</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Credit balance badge */}
          <button
            onClick={onTopUpCredits}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[11px] font-semibold transition-colors"
            title="Click to Top-Up Credits"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Balance: <strong>${userCredits.toFixed(2)}</strong></span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold ml-1">+ Top Up</span>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('marketplace')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-white">
              <Zap className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors fill-amber-400/30" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-300">
                StackForge AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Marketplace
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-none">
              Assemble, Test & Monetize AI Agent Stacks
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
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
            Marketplace
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'builder'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Wrench className="w-4 h-4 text-violet-500" />
            Stack Builder
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sandbox'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-500" />
            Test Sandbox
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
            Consumer & API Keys
            {activeKeysCount > 0 && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded-full">
                {activeKeysCount}
              </span>
            )}
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={openNewStackBuilder}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Build New Stack</span>
            <span className="sm:hidden">Build</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bottom strip */}
      <div className="lg:hidden flex items-center justify-around border-t border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/60">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md ${
            activeTab === 'marketplace' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Market
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md ${
            activeTab === 'builder' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Builder
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md ${
            activeTab === 'sandbox' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Sandbox
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Keys
        </button>
      </div>
    </header>
  );
};
