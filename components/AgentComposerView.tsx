'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  UserCheck, 
  Wrench, 
  Sparkles, 
  Check 
} from 'lucide-react';

// Props Interface to satisfy app/page.tsx
interface AgentComposerViewProps {
  models?: any[];
  skills?: any[];
  tools?: any[];
  onAgentComposed?: (agent: any) => void;
  onTestInPlayground?: (agent: any) => void;
}

// Reusable Inner Card Component
interface ComposerCardProps {
  title: string;
  subtitle: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  badgeColor?: 'indigo' | 'amber' | 'emerald';
}

function ComposerCard({
  title,
  subtitle,
  description,
  selected,
  onClick,
  badgeColor = 'indigo',
}: ComposerCardProps) {
  const borderColors = {
    indigo: 'hover:border-indigo-500/50 border-indigo-500 bg-indigo-500/10 shadow-indigo-500/10',
    amber: 'hover:border-amber-500/50 border-amber-500 bg-amber-500/10 shadow-amber-500/10',
    emerald: 'hover:border-emerald-500/50 border-emerald-500 bg-emerald-500/10 shadow-emerald-500/10',
  };

  const activeColor = borderColors[badgeColor];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
        selected
          ? `${activeColor} shadow-lg`
          : 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/80'
      }`}
    >
      {/* Background Radial Ambient Glow when selected */}
      {selected && (
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            {title}
          </h4>
          <span className="font-mono text-xs text-zinc-500">{subtitle}</span>
        </div>

        {/* Checkmark Indicator */}
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
            selected
              ? 'border-indigo-500 bg-indigo-500 text-white'
              : 'border-zinc-700 bg-zinc-800/50 group-hover:border-zinc-500'
          }`}
        >
          {selected && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>

      {description && (
        <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}

export default function AgentComposerView({
  models,
  skills,
  tools,
  onAgentComposed,
  onTestInPlayground,
}: AgentComposerViewProps) {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [selectedSkill, setSelectedSkill] = useState('code-architect');
  const [selectedTools, setSelectedTools] = useState<string[]>(['code_exec', 'web_search']);

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handlePublish = () => {
    if (onAgentComposed) {
      onAgentComposed({
        model: selectedModel,
        skill: selectedSkill,
        tools: selectedTools,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-xs font-mono font-medium text-indigo-400">
                1 Skill + 1 Model + N Tools
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Agent Composer
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Pick a foundation model, attach a skill persona, and bind autonomous tools into a monetizable agent.
            </p>
          </div>

          <button 
            onClick={handlePublish}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30"
          >
            <Sparkles className="h-4 w-4" /> Publish Agent & Generate API
          </button>
        </div>

        {/* 3-Column Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Models */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-mono font-bold tracking-wider text-amber-400 flex items-center gap-2">
                <Cpu className="h-4 w-4" /> 1. PICK BASE MODEL
              </h3>
              <span className="text-xs text-zinc-500">1 Selected</span>
            </div>
            
            <div className="space-y-3">
              <ComposerCard
                title="Google Gemini 2.5 Flash"
                subtitle="google_gemini • temp: 0.2"
                selected={selectedModel === 'gemini-2.5-flash'}
                onClick={() => setSelectedModel('gemini-2.5-flash')}
                badgeColor="amber"
              />
              <ComposerCard
                title="Google Gemini 2.5 Pro"
                subtitle="google_gemini • temp: 0.3"
                selected={selectedModel === 'gemini-2.5-pro'}
                onClick={() => setSelectedModel('gemini-2.5-pro')}
                badgeColor="amber"
              />
              <ComposerCard
                title="OpenAI-Compatible Gateway"
                subtitle="openai_compatible • temp: 0.2"
                selected={selectedModel === 'openai-gateway'}
                onClick={() => setSelectedModel('openai-gateway')}
                badgeColor="amber"
              />
            </div>
          </div>

          {/* Column 2: Personas */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-mono font-bold tracking-wider text-indigo-400 flex items-center gap-2">
                <UserCheck className="h-4 w-4" /> 2. PICK SKILL PERSONA
              </h3>
              <span className="text-xs text-zinc-500">1 Selected</span>
            </div>

            <div className="space-y-3">
              <ComposerCard
                title="Senior Code Architect & OWASP Auditor"
                subtitle="Persona: Security & Refactoring"
                description="Enforces OWASP Top 10 security standards, analyzes AST flows, and writes secure unit-tested TypeScript/Python refactors."
                selected={selectedSkill === 'code-architect'}
                onClick={() => setSelectedSkill('code-architect')}
                badgeColor="indigo"
              />
              <ComposerCard
                title="Quantitative Financial Modeling"
                subtitle="Persona: DCF & Volatility Analysis"
                description="Evaluates balance sheets, DCF models, and volatility/margin sensitivity matrices with mathematical rigor."
                selected={selectedSkill === 'fin-modeling'}
                onClick={() => setSelectedSkill('fin-modeling')}
                badgeColor="indigo"
              />
              <ComposerCard
                title="Biomedical Clinical Synthesizer"
                subtitle="Persona: Medical Insights"
                description="Summarizes diagnostic indicators, checks drug-drug interactions, and structures clinical impressions."
                selected={selectedSkill === 'clinical-synth'}
                onClick={() => setSelectedSkill('clinical-synth')}
                badgeColor="indigo"
              />
              <ComposerCard
                title="High-Throughput SQL & Data Platform"
                subtitle="Persona: Database Optimization"
                description="Optimizes Postgres/ClickHouse schemas, builds ETL transformations, and generates complex analytical queries."
                selected={selectedSkill === 'sql-platform'}
                onClick={() => setSelectedSkill('sql-platform')}
                badgeColor="indigo"
              />
            </div>
          </div>

          {/* Column 3: Tools */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                <Wrench className="h-4 w-4" /> 3. ATTACH TOOLS (1..N)
              </h3>
              <span className="text-xs text-zinc-500">{selectedTools.length} Attached</span>
            </div>

            <div className="space-y-3">
              <ComposerCard
                title="code_exec"
                subtitle="Isolated Node.js VM Sandbox"
                description="Isolated Node.js VM sandbox for executing JavaScript/Python algorithms with timeout and memory guards."
                selected={selectedTools.includes('code_exec')}
                onClick={() => toggleTool('code_exec')}
                badgeColor="emerald"
              />
              <ComposerCard
                title="web_search"
                subtitle="Live Index Search & Scraping"
                description="Live web index search and scraping for verified real-time sources, API documentation, and citations."
                selected={selectedTools.includes('web_search')}
                onClick={() => toggleTool('web_search')}
                badgeColor="emerald"
              />
              <ComposerCard
                title="web_scrape"
                subtitle="DOM Text Extraction"
                description="Extracts clean text content and metadata from any public URL."
                selected={selectedTools.includes('web_scrape')}
                onClick={() => toggleTool('web_scrape')}
                badgeColor="emerald"
              />
              <ComposerCard
                title="http_call"
                subtitle="REST Webhook Dispatcher"
                description="Dispatches authenticated HTTP/REST webhooks with custom JSON payloads."
                selected={selectedTools.includes('http_call')}
                onClick={() => toggleTool('http_call')}
                badgeColor="emerald"
              />
            </div>
          </div>

        </div>

        {/* Footer Configuration Section */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-mono font-bold tracking-wider text-zinc-300">
            AGENT IDENTITY & PRICING MODEL
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Agent Name</label>
              <input 
                type="text" 
                placeholder="e.g. CodeRefine Pro" 
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Tagline</label>
              <input 
                type="text" 
                placeholder="e.g. Autonomous OWASP Code Auditor" 
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}