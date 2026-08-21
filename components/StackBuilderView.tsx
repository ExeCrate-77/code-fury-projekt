'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  Cpu, 
  Sliders, 
  Terminal, 
  Globe, 
  Code2, 
  Calculator, 
  Webhook, 
  Plus, 
  Check, 
  ArrowRight, 
  Coins, 
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentStack, SkillTemplate, StackCategory, ToolType, StackConfig } from '@/lib/stack-types';
import { STARTER_SKILLS, AVAILABLE_TOOLS, saveStackToStorage } from '@/lib/stacks-store';

interface StackBuilderViewProps {
  onStackPublished: (newStack: AgentStack) => void;
  onTestInSandbox: (draftConfig: StackConfig, stackName: string) => void;
}

export const StackBuilderView: React.FC<StackBuilderViewProps> = ({
  onStackPublished,
  onTestInSandbox
}) => {
  // Form State
  const [name, setName] = useState('Sentinel Security Scribe');
  const [tagline, setTagline] = useState('Autonomous vulnerability scanner & AST patch synthesizer with Node VM testing');
  const [description, setDescription] = useState('A production-grade AI agent stack equipped with security auditing rules, automated calculation tools, and a sandboxed runtime for verifying patches.');
  const [category, setCategory] = useState<StackCategory>('Development');
  const [pricePerCall, setPricePerCall] = useState<number>(0.002);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(29);

  // Model Config
  const [model, setModel] = useState<'gemini-2.0-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash'>('gemini-2.0-flash');
  const [temperature, setTemperature] = useState<number>(0.2);
  const [maxTokens, setMaxTokens] = useState<number>(1500);
  const [topP, setTopP] = useState<number>(0.95);

  // Skills & System Prompt
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(['skill-code-sec']);
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(
    STARTER_SKILLS[0]?.promptTemplate || 'You are an autonomous AI Agent Stack on StackForge AI.'
  );

  // Tools
  const [enabledTools, setEnabledTools] = useState<ToolType[]>(['code_interpreter', 'calculator']);
  const [webhookUrl, setWebhookUrl] = useState<string>('https://api.myapp.com/v1/agent-webhook');

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Handle skill toggle
  const toggleSkill = (skill: SkillTemplate) => {
    let nextIds: string[];
    if (selectedSkillIds.includes(skill.id)) {
      nextIds = selectedSkillIds.filter(id => id !== skill.id);
    } else {
      nextIds = [...selectedSkillIds, skill.id];
      // Append prompt template
      setCustomSystemPrompt(prev => `${prev}\n\n${skill.promptTemplate}`.trim());
    }
    setSelectedSkillIds(nextIds);
  };

  // Handle tool toggle
  const toggleTool = (tool: ToolType) => {
    if (enabledTools.includes(tool)) {
      setEnabledTools(enabledTools.filter(t => t !== tool));
    } else {
      setEnabledTools([...enabledTools, tool]);
    }
  };

  // Current JSON Config
  const currentConfig: StackConfig = {
    model,
    temperature,
    maxTokens,
    topP,
    systemPrompt: customSystemPrompt,
    selectedSkillIds,
    enabledTools,
    webhookUrl: enabledTools.includes('custom_webhook') ? webhookUrl : undefined
  };

  const handlePublish = () => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newStack: AgentStack = {
      id: `stack-${Date.now()}`,
      ownerId: 'creator-current-user',
      ownerName: 'You (Creator)',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      name: name || 'Custom Agent Stack',
      slug: slug || `stack-${Date.now()}`,
      tagline: tagline || 'Custom assembled agent stack with tools',
      description: description || 'Built with StackForge AI Builder.',
      category,
      config: currentConfig,
      status: 'published',
      pricePerCall,
      monthlyPrice,
      callsCount: 1,
      successRate: 100,
      avgLatencyMs: model === 'gemini-2.0-flash' ? 120 : 190,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      apiKeyPrefix: `sf_live_${slug.slice(0, 5)}`
    };

    saveStackToStorage(newStack);
    onStackPublished(newStack);

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
              <Wrench className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Stack Builder & Studio
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Visual Assembly
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Assemble skills, AI model parameters, and autonomous server-side tools into a monetizable agent stack with instant REST endpoint deployment.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onTestInSandbox(currentConfig, name)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
            Test in Sandbox
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Publish & Generate API
          </button>
        </div>
      </div>

      {/* 4-Step Nav Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { step: 1, title: '1. Identity & Pricing', desc: 'Metadata & Monitization' },
          { step: 2, title: '2. Skills & Persona', desc: 'Templates & System Prompt' },
          { step: 3, title: '3. Model & Params', desc: 'Gemini 2.0 & Hyperparameters' },
          { step: 4, title: '4. Autonomous Tools', desc: 'Code VM, Calc, Web Search' }
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step as any)}
            className={`p-3 rounded-2xl text-left border transition-all ${
              activeStep === s.step
                ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-500/20'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <span className={`text-xs font-bold block ${activeStep === s.step ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-900 dark:text-white'}`}>
              {s.title}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5 truncate">
              {s.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Main Builder Form + Live Config Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {/* STEP 1: IDENTITY & PRICING */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Step 1: Stack Identity & Monetization Pricing
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Stack Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ApexDev Security Sentinel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Brief 1-sentence value proposition..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Development">Development & Security</option>
                  <option value="Finance">Quantitative Finance</option>
                  <option value="Healthcare">Healthcare & Biomedical</option>
                  <option value="Data Science">Data Science & SQL</option>
                  <option value="Research">Research & Grounding</option>
                  <option value="Productivity">Productivity & Automation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Price per API Call ($)
                  </label>
                  <input
                    type="number"
                    step="0.0005"
                    min="0.0005"
                    value={pricePerCall}
                    onChange={(e) => setPricePerCall(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-400">Default: $0.002 / call</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Monthly Pro Tier ($/mo)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-400">Optional subscription rate</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS & PERSONA */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Step 2: Skills Library & Custom System Persona
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Pick from Verified Skill Prompt Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STARTER_SKILLS.map((skill) => {
                    const isSelected = selectedSkillIds.includes(skill.id);
                    return (
                      <div
                        key={skill.id}
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-violet-50/60 dark:bg-violet-950/30 border-violet-500 ring-2 ring-violet-500/20'
                            : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                            {skill.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {skill.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Custom System Prompt (Directives & Invariants)
                </label>
                <textarea
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  rows={8}
                  placeholder="Define custom behavior, tool usage guidelines, response formatting, and domain rules..."
                  className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono resize-y"
                />
              </div>
            </div>
          )}

          {/* STEP 3: MODEL & HYPERPARAMETERS */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                Step 3: AI Foundation Model & Hyperparameters
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Base LLM Engine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', desc: 'Recommended: Sub-120ms latency + native tool calling' },
                    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: '2M context window + deep multi-step reasoning' },
                    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'High-throughput cost-optimized inference' }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setModel(m.id as any)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        model === m.id
                          ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">{m.name}</span>
                        {model === m.id && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Temperature (Creativity vs Determinism)</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Max Output Tokens</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="4000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AUTONOMOUS TOOLS */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-500" />
                Step 4: Enable Server-Side Function Calling Tools
              </h3>

              <div className="space-y-3">
                {AVAILABLE_TOOLS.map((t) => {
                  const isEnabled = enabledTools.includes(t.name);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTool(t.name)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isEnabled
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          {t.name === 'calculator' && <Calculator className="w-4 h-4 text-amber-500" />}
                          {t.name === 'code_interpreter' && <Code2 className="w-4 h-4 text-emerald-500" />}
                          {t.name === 'web_search' && <Globe className="w-4 h-4 text-blue-500" />}
                          {t.name === 'custom_webhook' && <Webhook className="w-4 h-4 text-purple-500" />}
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">{t.displayName}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {t.description}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 ${
                        isEnabled ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-400'
                      }`}>
                        {isEnabled && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {enabledTools.includes('custom_webhook') && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Webhook Destination Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://api.yourdomain.com/v1/agent-event"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* Navigation between steps */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {activeStep > 1 ? (
              <button
                onClick={() => setActiveStep((activeStep - 1) as any)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ← Back
              </button>
            ) : <div />}

            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep((activeStep + 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Publish Stack
              </button>
            )}
          </div>
        </div>

        {/* Live Config JSON & API Route Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Live Supabase Stack Config
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                JSONB Schema
              </span>
            </div>

            {/* Formatted JSON */}
            <div className="font-mono text-[11px] leading-relaxed overflow-x-auto text-indigo-200 max-h-[380px] scrollbar-thin">
              <pre>{JSON.stringify(currentConfig, null, 2)}</pre>
            </div>

            {/* Generated API Endpoint Preview */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                Provisioned External Endpoint
              </span>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300 truncate">
                POST /api/v1/stacks/{name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/run
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
