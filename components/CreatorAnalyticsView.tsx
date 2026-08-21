'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  KeyRound, 
  Coins, 
  Copy, 
  Check, 
  Code, 
  Clock, 
  Zap, 
  TrendingUp, 
  Activity, 
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import { AgentEntity, AgentRunEntity } from '@/lib/agentforge-types';
import { addCredits } from '@/lib/agentforge-store';

interface CreatorAnalyticsViewProps {
  agents: AgentEntity[];
  runs: AgentRunEntity[];
  userCredits: number;
  onCreditsUpdated: (c: number) => void;
  onOpenDeployModal: (agent: AgentEntity) => void;
}

export const CreatorAnalyticsView: React.FC<CreatorAnalyticsViewProps> = ({
  agents,
  runs,
  userCredits,
  onCreditsUpdated,
  onOpenDeployModal
}) => {
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'node'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [selectedAgentSlug, setSelectedAgentSlug] = useState<string>(agents[0]?.slug || 'sentinel-code-security-agent');

  const totalCalls = runs.length || 18;
  const totalRevenue = (totalCalls * 0.0025).toFixed(4);

  const getCodeSnippet = () => {
    switch (selectedLang) {
      case 'curl':
        return `curl -X POST https://api.agentforge.ai/api/v1/agents/${selectedAgentSlug}/run \\
  -H "Authorization: Bearer af_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Audit this smart contract token swap logic for reentrancy."
  }'`;

      case 'python':
        return `# AgentForge Python Client
import requests

url = "https://api.agentforge.ai/api/v1/agents/${selectedAgentSlug}/run"
headers = {
    "Authorization": "Bearer af_live_your_api_key_here",
    "Content-Type": "application/json"
}
payload = {
    "prompt": "Audit this smart contract token swap logic for reentrancy."
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;

      case 'node':
        return `// Next.js / Node.js Fetch Example
const res = await fetch("https://api.agentforge.ai/api/v1/agents/${selectedAgentSlug}/run", {
  method: "POST",
  headers: {
    "Authorization": "Bearer af_live_your_api_key_here",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ prompt: "Audit this smart contract token swap logic for reentrancy." })
});
const data = await res.json();
console.log(data.response);`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-emerald-500" />
              Creator Analytics & Monetization Hub
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Metered Settlement
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor API calls served, estimated revenue earned, provisioned keys, and real-time execution logs.
          </p>
        </div>

        {/* Credit Top-up */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-semibold hidden sm:inline">Add Balance:</span>
          {[10, 25, 50].map((amt) => (
            <button
              key={amt}
              onClick={() => onCreditsUpdated(addCredits(amt))}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-colors"
            >
              +${amt}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Total Calls Today</span>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">{totalCalls}</div>
          <span className="text-[11px] text-emerald-500 font-semibold">100% Success SLA</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Estimated Revenue</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">${totalRevenue}</div>
          <span className="text-[11px] text-zinc-400">Sub-cent metered</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Credits Balance</span>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">${userCredits.toFixed(2)}</div>
          <span className="text-[11px] text-amber-500 font-semibold">Simulated Billing</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Published Agents</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{agents.length}</div>
          <span className="text-[11px] text-zinc-400">Active Endpoints</span>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              External REST API Code Snippets
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedAgentSlug}
              onChange={(e) => setSelectedAgentSlug(e.target.value)}
              className="text-xs font-bold bg-zinc-900 text-zinc-200 px-3 py-1.5 rounded-xl border border-zinc-800 outline-none"
            >
              {agents.map(a => <option key={a.id} value={a.slug}>{a.name}</option>)}
            </select>

            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {(['curl', 'python', 'node'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLang(l)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${selectedLang === l ? 'bg-indigo-600 text-white' : 'text-zinc-400'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative font-mono text-xs text-indigo-200 bg-zinc-900 p-4 rounded-2xl border border-zinc-800/80 overflow-x-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText(getCodeSnippet());
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? 'Copied' : 'Copy'}
          </button>
          <pre className="pr-20 leading-relaxed">{getCodeSnippet()}</pre>
        </div>
      </div>
    </div>
  );
};
