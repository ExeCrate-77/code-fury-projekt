'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Wrench, 
  Play, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Code2, 
  Globe, 
  FileText, 
  Webhook, 
  Loader2,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { ModelEntity, SkillEntity, ToolEntity } from '@/lib/agentforge-types';
import { saveModel, saveSkill, saveTool } from '@/lib/agentforge-store';
import { executeCodeInterpreter, executeWebSearch } from '@/lib/sandbox-executor';
import { executeWebScraper } from '@/lib/agentforge-langchain-engine';

interface EntityCrudIsolationViewProps {
  models: ModelEntity[];
  skills: SkillEntity[];
  tools: ToolEntity[];
  onModelsUpdated: (m: ModelEntity[]) => void;
  onSkillsUpdated: (s: SkillEntity[]) => void;
  onToolsUpdated: (t: ToolEntity[]) => void;
}

export const EntityCrudIsolationView: React.FC<EntityCrudIsolationViewProps> = ({
  models,
  skills,
  tools,
  onModelsUpdated,
  onSkillsUpdated,
  onToolsUpdated
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'models' | 'skills' | 'tools'>('skills');

  // Isolation Tester State
  const [testInput, setTestInput] = useState<string>('Test isolation execution with boundary parameters.');
  const [testOutput, setTestOutput] = useState<any>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);

  // New Skill Modal / Form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillPrompt, setNewSkillPrompt] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [showSkillForm, setShowSkillForm] = useState(false);

  // Selected Entity for Isolation
  const [selectedSkill, setSelectedSkill] = useState<SkillEntity>(skills[0]);
  const [selectedTool, setSelectedTool] = useState<ToolEntity>(tools[0]);
  const [selectedModel, setSelectedModel] = useState<ModelEntity>(models[0]);

  // Test Skill in Isolation
  const handleTestSkill = async () => {
    setTestLoading(true);
    setTestOutput(null);
    try {
      const res = await fetch('/api/sandbox/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            model: 'gemini-2.0-flash',
            temperature: 0.2,
            maxTokens: 1000,
            topP: 0.95,
            systemPrompt: selectedSkill.system_prompt,
            selectedSkillIds: [],
            enabledTools: []
          },
          prompt: testInput
        })
      });
      const data = await res.json();
      setTestOutput(data);
    } catch (e: any) {
      setTestOutput({ error: e.message });
    } finally {
      setTestLoading(false);
    }
  };

  // Test Tool in Isolation
  const handleTestTool = async () => {
    setTestLoading(true);
    setTestOutput(null);
    const start = Date.now();
    try {
      let res: any;
      if (selectedTool.tool_type === 'code_exec') {
        res = executeCodeInterpreter(testInput || 'console.log("Isolated code run!"); Math.sqrt(144);', 'javascript');
      } else if (selectedTool.tool_type === 'web_search') {
        res = await executeWebSearch(testInput || 'Next.js 16 LangChain function calling');
      } else if (selectedTool.tool_type === 'web_scrape') {
        res = await executeWebScraper('https://docs.agentforge.ai');
      } else {
        res = { status: 200, message: `Tool ${selectedTool.name} dispatched.` };
      }
      setTestOutput({
        tool: selectedTool.name,
        result: res,
        latency_ms: Date.now() - start
      });
    } catch (e: any) {
      setTestOutput({ error: e.message });
    } finally {
      setTestLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !newSkillPrompt.trim()) return;
    const newSkill: SkillEntity = {
      id: `skill_${Date.now()}`,
      name: newSkillName,
      description: newSkillDesc || 'Custom Skill persona',
      system_prompt: newSkillPrompt,
      input_schema: { type: 'object', properties: { prompt: { type: 'string' } } },
      version: 1,
      category: 'Custom',
      is_public: true,
      createdAt: new Date().toISOString()
    };
    const updated = saveSkill(newSkill);
    onSkillsUpdated(updated);
    setNewSkillName('');
    setNewSkillPrompt('');
    setNewSkillDesc('');
    setShowSkillForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
              <Wrench className="w-7 h-7 text-blue-500" />
              Models, Skills & Tools Registry
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Isolation Testing
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage granular building blocks with versioning and test individual components in isolation before composing into full agents.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => { setActiveSubTab('skills'); setTestOutput(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'skills' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'
            }`}
          >
            Skills ({skills.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('tools'); setTestOutput(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'tools' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'
            }`}
          >
            Tools ({tools.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('models'); setTestOutput(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'models' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'
            }`}
          >
            Models ({models.length})
          </button>
        </div>
      </div>

      {/* Main Registry + Isolation Runner Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Registry List (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Registered {activeSubTab.toUpperCase()}
            </h3>

            {activeSubTab === 'skills' && (
              <button
                onClick={() => setShowSkillForm(!showSkillForm)}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Skill
              </button>
            )}
          </div>

          {/* New Skill Form */}
          {showSkillForm && activeSubTab === 'skills' && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-zinc-900 dark:text-white block">Create New Skill Persona</span>
              <input
                type="text"
                placeholder="Skill Name (e.g. Legal Compliance Auditor)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-zinc-950 border text-xs text-zinc-900 dark:text-white outline-none"
              />
              <textarea
                placeholder="System Prompt Directives..."
                value={newSkillPrompt}
                onChange={(e) => setNewSkillPrompt(e.target.value)}
                rows={4}
                className="w-full p-2 rounded-xl bg-white dark:bg-zinc-950 border text-xs text-zinc-900 dark:text-white outline-none font-mono"
              />
              <button
                onClick={handleAddSkill}
                className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Save Skill
              </button>
            </div>
          )}

          {/* List Items */}
          <div className="space-y-3">
            {activeSubTab === 'skills' && skills.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSkill(s)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedSkill?.id === s.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{s.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      v{s.version}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">{s.category}</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">{s.description}</p>
              </div>
            ))}

            {activeSubTab === 'tools' && tools.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTool(t)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTool?.id === t.id
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">{t.name}</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {t.tool_type}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.description}</p>
              </div>
            ))}

            {activeSubTab === 'models' && models.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedModel?.id === m.id
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">{m.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{m.provider}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  model_name: {m.params.model_name} • temp: {m.params.temperature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Isolation Runner Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Isolation Test Sandbox: {activeSubTab === 'skills' ? selectedSkill?.name : activeSubTab === 'tools' ? selectedTool?.name : selectedModel?.name}
                </h4>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-400 font-semibold">
                {activeSubTab === 'tools' && selectedTool?.tool_type === 'code_exec' ? 'Sample JS Code' : 'Test Input Prompt'}
              </label>
              <textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none font-mono resize-y"
              />
            </div>

            <button
              onClick={activeSubTab === 'skills' ? handleTestSkill : handleTestTool}
              disabled={testLoading}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2"
            >
              {testLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running in Isolation...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Isolation Test</span>
                </>
              )}
            </button>

            {/* Test Output */}
            {testOutput && (
              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                  Isolation Output
                </span>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-60 scrollbar-thin">
                  <pre>{typeof testOutput === 'object' ? JSON.stringify(testOutput, null, 2) : testOutput}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
