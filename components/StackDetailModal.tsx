'use client';

import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  KeyRound, 
  Check, 
  Copy, 
  Cpu, 
  Calculator, 
  Code2, 
  Globe, 
  Webhook, 
  Wrench, 
  Star, 
  CheckCircle2, 
  FileCode2, 
  Code,
  Zap
} from 'lucide-react';
import { AgentStack } from '@/lib/stack-types';

interface StackDetailModalProps {
  stack: AgentStack | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSandbox: (stack: AgentStack) => void;
  onOpenDeploy: (stack: AgentStack) => void;
}

export const StackDetailModal: React.FC<StackDetailModalProps> = ({
  stack,
  isOpen,
  onClose,
  onOpenSandbox,
  onOpenDeploy
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'config' | 'code'>('overview');
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'node'>('curl');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !stack) return null;

  const getCodeSnippet = () => {
    switch (selectedLang) {
      case 'curl':
        return `curl -X POST https://api.stackforge.ai/api/v1/stacks/${stack.slug}/run \\
  -H "Authorization: Bearer sf_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Execute task according to stack directives."
  }'`;

      case 'python':
        return `import requests

res = requests.post(
    "https://api.stackforge.ai/api/v1/stacks/${stack.slug}/run",
    headers={"Authorization": "Bearer sf_live_your_key_here"},
    json={"prompt": "Execute task according to stack directives."}
)
print(res.json())`;

      case 'node':
        return `const res = await fetch("https://api.stackforge.ai/api/v1/stacks/${stack.slug}/run", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sf_live_your_key_here",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ prompt: "Execute task according to stack directives." })
});
const data = await res.json();
console.log(data);`;
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3.5">
            <img
              src={stack.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={stack.ownerName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {stack.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {stack.category}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Created by <strong>{stack.ownerName}</strong> • ${stack.pricePerCall}/call
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSandbox(stack);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
            >
              <Terminal className="w-4 h-4 text-amber-500" />
              Sandbox
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenDeploy(stack);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
            >
              <KeyRound className="w-4 h-4" />
              Get API Key
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 my-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === 'overview'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Overview & Tools
          </button>
          <button
            onClick={() => setSelectedTab('config')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === 'config'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            JSONB Config Schema
          </button>
          <button
            onClick={() => setSelectedTab('code')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === 'code'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Code Integration
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {selectedTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Description
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {stack.description}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Active Tools
              </span>
              <div className="flex flex-wrap gap-2">
                {stack.config.enabledTools.map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    {t === 'calculator' && <Calculator className="w-3.5 h-3.5 text-amber-500" />}
                    {t === 'code_interpreter' && <Code2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {t === 'web_search' && <Globe className="w-3.5 h-3.5 text-blue-500" />}
                    {t === 'custom_webhook' && <Webhook className="w-3.5 h-3.5 text-purple-500" />}
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                System Prompt Directive
              </span>
              <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                {stack.config.systemPrompt}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: CONFIG */}
        {selectedTab === 'config' && (
          <div className="p-4 rounded-2xl bg-zinc-950 text-indigo-200 font-mono text-xs overflow-x-auto border border-zinc-800">
            <pre>{JSON.stringify(stack.config, null, 2)}</pre>
          </div>
        )}

        {/* TAB 3: CODE */}
        {selectedTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                {(['curl', 'python', 'node'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setSelectedLang(l)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      selectedLang === l ? 'bg-indigo-600 text-white' : 'text-zinc-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative p-4 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
              <button
                onClick={copySnippet}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <pre className="pr-16 leading-relaxed">{getCodeSnippet()}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
