'use client';

import { Sparkles, LayoutGrid, Cpu, Play, BarChart3, Plus } from 'lucide-react';

export interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userCredits?: number;
  onTopUpCredits?: () => void;
  activeKeysCount?: number;
  openComposer?: () => void;
}

export function AgentForgeNavbar({
  activeTab = 'marketplace',
  setActiveTab,
  userCredits = 50.00,
  onTopUpCredits,
  activeKeysCount = 0,
  openComposer,
}: NavbarProps) {
  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: LayoutGrid },
    { id: 'composer', label: 'Agent Composer', icon: Cpu },
    { id: 'playground', label: 'Playground', icon: Play },
    { id: 'analytics', label: `Analytics & Keys ${activeKeysCount ? `(${activeKeysCount})` : ''}`, icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight">AgentForge</span>
              <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-mono text-indigo-400">
                LANGCHAIN
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">Marketplace for Composable AI Agents</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/60 p-1 backdrop-blur-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab && setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action & Balance */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onTopUpCredits}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-mono transition-colors hover:border-white/20"
          >
            <span className="text-zinc-500">Balance:</span>
            <span className="text-emerald-400 font-bold">${typeof userCredits === 'number' ? userCredits.toFixed(2) : userCredits}</span>
            <span className="text-[10px] text-indigo-400 underline ml-1">+ Top Up</span>
          </button>

          <button
            onClick={() => openComposer ? openComposer() : (setActiveTab && setActiveTab('composer'))}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Compose Agent
          </button>
        </div>

      </div>
    </header>
  );
}

export default AgentForgeNavbar;