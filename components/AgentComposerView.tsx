'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  Cpu, 
  Check, 
  Plus, 
  Code2, 
  Globe, 
  FileText, 
  Webhook, 
  Coins, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentEntity, ModelEntity, SkillEntity, ToolEntity } from '@/lib/agentforge-types';
import { saveAgent } from '@/lib/agentforge-store';

interface AgentComposerViewProps {
  models: ModelEntity[];
  skills: SkillEntity[];
  tools: ToolEntity[];
  onAgentComposed: (newAgent: AgentEntity) => void;
  onTestInPlayground: (agent: AgentEntity) => void;
}

export const AgentComposerView: React.FC<AgentComposerViewProps> = ({
  models,
  skills,
  tools,
  onAgentComposed,
  onTestInPlayground
}) => {
  // Composer selections
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || 'model-gemini-2-5-flash');
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || 'skill-code-architect');
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(['tool-code-exec', 'tool-web-search']);

  // Agent Metadata
  const [name, setName] = useState('Sentinel Code Sec Pro');
  const [tagline, setTagline] = useState('Autonomous AST security auditing, zero-day detector & verified patch synthesizer');
  const [description, setDescription] = useState('An intelligent LangChain-orchestrated agent combining OWASP code security directives, sandboxed Node VM execution, and real-time documentation search.');
  const [pricePerCall, setPricePerCall] = useState<number>(0.002);
  const [pricingModel, setPricingModel] = useState<'per_call' | 'subscription' | 'free'>('per_call');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(29);

  const toggleTool = (toolId: string) => {
    if (selectedToolIds.includes(toolId)) {
      setSelectedToolIds(selectedToolIds.filter(id => id !== toolId));
    } else {
      setSelectedToolIds([...selectedToolIds, toolId]);
    }
  };

  const handleComposeAndPublish = () => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const apiKey = `af_live_${slug.slice(0, 8)}_${randomHex}`;

    const newAgent: AgentEntity = {
      id: `agent-${Date.now()}`,
      name: name || 'Custom Assembled Agent',
      slug: slug || `agent-${Date.now()}`,
      tagline: tagline || 'Custom composed agent stack',
      description: description || 'Assembled via AgentForge Composer.',
      skill_id: selectedSkillId,
      model_id: selectedModelId,
      tool_ids: selectedToolIds,
      is_published: true,
      api_key: apiKey,
      price_per_call: pricePerCall,
      pricing_model: pricingModel,
      monthly_price: monthlyPrice,
      calls_count: 1,
      success_rate: 100,
      avg_latency_ms: selectedModelId.includes('pro') ? 175 : 115,
      rating: 5.0,
      creator_name: 'You (Creator)',
      creator_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    saveAgent(newAgent);
    onAgentComposed(newAgent);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];
  const selectedSkill = skills.find(s => s.id === selectedSkillId) || skills[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
              <Wrench className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Agent Composer
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              1 Skill + 1 Model + N Tools
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Pick a foundation model, attach a skill prompt persona, and bind autonomous tools into a monetizable agent.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleComposeAndPublish}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Publish Agent & Generate API
          </button>
        </div>
      </div>

      {/* 3-Column Assembly Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: PICK MODEL */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-500" />
              1. Pick Base Model
            </span>
            <span className="text-[10px] font-mono text-zinc-400">1 Selected</span>
          </div>

          <div className="space-y-2.5">
            {models.map((m) => {
              const isSelected = selectedModelId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{m.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-mono">
                    {m.provider} • temp: {m.params.temperature}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: PICK SKILL */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-500" />
              2. Pick Skill Persona
            </span>
            <span className="text-[10px] font-mono text-zinc-400">1 Selected</span>
          </div>

          <div className="space-y-2.5">
            {skills.map((s) => {
              const isSelected = selectedSkillId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSkillId(s.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-violet-50/60 dark:bg-violet-950/30 border-violet-500 ring-2 ring-violet-500/20'
                      : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">{s.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-600" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: ATTACH TOOLS */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-500" />
              3. Attach Tools (1..N)
            </span>
            <span className="text-[10px] font-mono text-zinc-400">{selectedToolIds.length} Attached</span>
          </div>

          <div className="space-y-2.5">
            {tools.map((t) => {
              const isSelected = selectedToolIds.includes(t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTool(t.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">{t.name}</span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">{t.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                    isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-400'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metadata & Monetization Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
          Agent Identity & Pricing Model
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Agent Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pricing Model</label>
            <select
              value={pricingModel}
              onChange={(e: any) => setPricingModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="per_call">Per-Call Metered</option>
              <option value="subscription">Monthly Subscription</option>
              <option value="free">100% Free Tier</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Price per Call ($)</label>
            <input
              type="number"
              step="0.0005"
              min="0"
              value={pricePerCall}
              onChange={(e) => setPricePerCall(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Monthly Pro Rate ($/mo)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
