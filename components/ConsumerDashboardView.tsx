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
  ShieldCheck, 
  Trash2, 
  PlusCircle, 
  ExternalLink,
  Terminal,
  Activity,
  CreditCard
} from 'lucide-react';
import { ConsumerApiKey, ExecutionLog, AgentStack } from '@/lib/stack-types';
import { topUpCredits } from '@/lib/stacks-store';

interface ConsumerDashboardViewProps {
  apiKeys: ConsumerApiKey[];
  executionLogs: ExecutionLog[];
  userCredits: number;
  onCreditsUpdated: (newCredits: number) => void;
  stacks: AgentStack[];
  onOpenDeployModal: (stack: AgentStack) => void;
}

export const ConsumerDashboardView: React.FC<ConsumerDashboardViewProps> = ({
  apiKeys,
  executionLogs,
  userCredits,
  onCreditsUpdated,
  stacks,
  onOpenDeployModal
}) => {
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'node' | 'typescript'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [selectedStackForCode, setSelectedStackForCode] = useState<string>(stacks[0]?.slug || 'apex-dev-security-sentinel');

  const handleTopUp = (amount: number) => {
    const updated = topUpCredits(amount);
    onCreditsUpdated(updated);
  };

  const copyKey = (keyId: string, keyVal: string) => {
    navigator.clipboard.writeText(keyVal);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const getCodeSnippet = () => {
    const targetStack = stacks.find(s => s.slug === selectedStackForCode || s.id === selectedStackForCode) || stacks[0];
    const stackId = targetStack?.slug || 'apex-dev-security-sentinel';

    switch (selectedLang) {
      case 'curl':
        return `curl -X POST https://api.stackforge.ai/api/v1/stacks/${stackId}/run \\
  -H "Authorization: Bearer sf_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Audit this smart contract withdraw function for reentrancy vectors."
  }'`;

      case 'python':
        return `# StackForge AI Python Client
import requests

url = "https://api.stackforge.ai/api/v1/stacks/${stackId}/run"
headers = {
    "Authorization": "Bearer sf_live_your_api_key_here",
    "Content-Type": "application/json"
}
payload = {
    "prompt": "Audit this smart contract withdraw function for reentrancy vectors."
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

print(f"Agent Response: {data['response']}")
print(f"Latency: {data['telemetry']['latencyMs']}ms | Cost: \${data['telemetry']['costDeductedUsd']}")`;

      case 'node':
        return `// Node.js / Fetch API Example
const res = await fetch('https://api.stackforge.ai/api/v1/stacks/${stackId}/run', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sf_live_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Audit this smart contract withdraw function for reentrancy vectors.'
  })
});

const data = await res.json();
console.log('Response:', data.response);
console.log('Tokens used:', data.telemetry.totalTokens);`;

      case 'typescript':
        return `import { StackForgeClient } from '@stackforge/sdk';

const client = new StackForgeClient({
  apiKey: process.env.STACKFORGE_API_KEY!
});

async function runAudit() {
  const result = await client.stacks.run({
    stackId: '${stackId}',
    prompt: 'Audit this smart contract withdraw function for reentrancy vectors.'
  });

  console.log(result.response);
}`;
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-emerald-500" />
              Consumer & API Key Manager
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Metered Usage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage provisioned stack API keys, monitor real-time token consumption, and integrate external endpoints into your app.
          </p>
        </div>

        {/* Top-up Button Group */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-semibold hidden sm:inline">Add Credits:</span>
          {[10, 25, 50].map((amt) => (
            <button
              key={amt}
              onClick={() => handleTopUp(amt)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-colors"
            >
              +${amt}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Credits Balance</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
            ${userCredits.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Simulated Sandbox Billing
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">API Keys Provisioned</span>
            <KeyRound className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
            {apiKeys.length}
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">
            1,200 req/min default limit
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Calls Metered</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
            {executionLogs.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% Success Rate
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Average Latency</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
            135ms
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">
            Node VM + Gemini Flash
          </span>
        </div>
      </div>

      {/* Provisioned API Keys Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Active API Keys & Tokens
            </h3>
          </div>

          <button
            onClick={() => onOpenDeployModal(stacks[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Provision New Key
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-dashed border-zinc-300 dark:border-zinc-800 space-y-2">
            <KeyRound className="w-8 h-8 text-zinc-400 mx-auto stroke-[1.5]" />
            <p className="text-xs text-zinc-500">No API keys provisioned yet.</p>
            <button
              onClick={() => onOpenDeployModal(stacks[0])}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Generate your first key →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Key Name</th>
                  <th className="pb-3">Agent Stack</th>
                  <th className="pb-3">Key Token</th>
                  <th className="pb-3">Rate Limit</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-medium">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3.5 font-bold text-zinc-900 dark:text-white">{k.keyLabel}</td>
                    <td className="py-3.5 text-zinc-600 dark:text-zinc-400">{k.stackName}</td>
                    <td className="py-3.5 font-mono text-indigo-600 dark:text-indigo-400">
                      {k.rawKey ? `${k.rawKey.slice(0, 14)}...` : `${k.keyPrefix}...`}
                    </td>
                    <td className="py-3.5 text-zinc-500">{k.rateLimit}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {k.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => copyKey(k.id, k.rawKey || k.keyPrefix)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        title="Copy Key"
                      >
                        {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Code Snippet Integration Generator */}
      <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Interactive SDK & REST Integration Snippets
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Stack Target Selector */}
            <select
              value={selectedStackForCode}
              onChange={(e) => setSelectedStackForCode(e.target.value)}
              className="text-xs font-bold bg-zinc-900 text-zinc-200 px-3 py-1.5 rounded-xl border border-zinc-800 outline-none cursor-pointer"
            >
              {stacks.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {(['curl', 'python', 'node', 'typescript'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedLang === lang
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative font-mono text-xs text-indigo-200 bg-zinc-900 p-4 rounded-2xl border border-zinc-800/80 overflow-x-auto">
          <button
            onClick={copySnippet}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </button>
          <pre className="pr-20 leading-relaxed">{getCodeSnippet()}</pre>
        </div>
      </div>

      {/* Execution Usage Logs */}
      {executionLogs.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Recent Metered Execution Logs
            </h3>
            <span className="text-xs text-zinc-400 font-mono">Real-time Telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Prompt Excerpt</th>
                  <th className="pb-3">Latency</th>
                  <th className="pb-3">Tokens</th>
                  <th className="pb-3">Cost</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-mono text-[11px]">
                {executionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 text-zinc-500 font-sans">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="py-3 text-zinc-800 dark:text-zinc-200 truncate max-w-[240px] font-sans">
                      {log.prompt}
                    </td>
                    <td className="py-3 text-emerald-600 dark:text-emerald-400">{log.latencyMs}ms</td>
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">{log.totalTokens}</td>
                    <td className="py-3 text-indigo-600 dark:text-indigo-400 font-bold">${log.costDeducted}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
