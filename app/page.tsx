'use client';

import React, { useState, useEffect } from 'react';
import { AgentForgeNavbar } from '@/components/AgentForgeNavbar';
import { AgentMarketplaceView } from '@/components/AgentMarketplaceView';
import { AgentComposerView } from '@/components/AgentComposerView';
import { EntityCrudIsolationView } from '@/components/EntityCrudIsolationView';
import { AgentPlaygroundView } from '@/components/AgentPlaygroundView';
import { CreatorAnalyticsView } from '@/components/CreatorAnalyticsView';
import { DeployStackKeyModal } from '@/components/DeployStackKeyModal';
import { StackDetailModal } from '@/components/StackDetailModal';
import { AgentEntity, ModelEntity, SkillEntity, ToolEntity, AgentRunEntity } from '@/lib/agentforge-types';
import { 
  getStoredAgents, 
  getStoredModels, 
  getStoredSkills, 
  getStoredTools, 
  getStoredRuns, 
  getUserCredits,
  addCredits
} from '@/lib/agentforge-store';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'composer' | 'crud' | 'playground' | 'analytics'>('marketplace');

  // Entities State
  const [agents, setAgents] = useState<AgentEntity[]>([]);
  const [models, setModels] = useState<ModelEntity[]>([]);
  const [skills, setSkills] = useState<SkillEntity[]>([]);
  const [tools, setTools] = useState<ToolEntity[]>([]);
  const [runs, setRuns] = useState<AgentRunEntity[]>([]);
  const [userCredits, setUserCredits] = useState<number>(50.00);

  // Modals & Selected Agent
  const [selectedAgent, setSelectedAgent] = useState<AgentEntity | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    setAgents(getStoredAgents());
    setModels(getStoredModels());
    setSkills(getStoredSkills());
    setTools(getStoredTools());
    setRuns(getStoredRuns());
    setUserCredits(getUserCredits());
  }, []);

  const handleOpenDeploy = (agent: AgentEntity) => {
    setSelectedAgent(agent);
    setIsDeployModalOpen(true);
  };

  const handleOpenDetail = (agent: AgentEntity) => {
    setSelectedAgent(agent);
    setIsDetailModalOpen(true);
  };

  const handleSelectAgentForPlayground = (agent: AgentEntity) => {
    setSelectedAgent(agent);
    setActiveTab('playground');
  };

  const handleAgentComposed = (newAgent: AgentEntity) => {
    setAgents(prev => [newAgent, ...prev.filter(a => a.id !== newAgent.id)]);
    setSelectedAgent(newAgent);
    setActiveTab('marketplace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Universal Navigation Header */}
      <AgentForgeNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userCredits={userCredits}
        onTopUpCredits={() => setUserCredits(addCredits(25))}
        activeKeysCount={agents.filter(a => a.api_key).length}
        openComposer={() => setActiveTab('composer')}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <AgentMarketplaceView
            agents={agents}
            models={models}
            skills={skills}
            tools={tools}
            onSelectAgentForPlayground={handleSelectAgentForPlayground}
            onOpenDeployModal={handleOpenDeploy}
            onOpenDetailModal={handleOpenDetail}
            onNavigateToComposer={() => setActiveTab('composer')}
          />
        )}

        {activeTab === 'composer' && (
          <AgentComposerView
            models={models}
            skills={skills}
            tools={tools}
            onAgentComposed={handleAgentComposed}
            onTestInPlayground={handleSelectAgentForPlayground}
          />
        )}

        {activeTab === 'crud' && (
          <EntityCrudIsolationView
            models={models}
            skills={skills}
            tools={tools}
            onModelsUpdated={setModels}
            onSkillsUpdated={setSkills}
            onToolsUpdated={setTools}
          />
        )}

        {activeTab === 'playground' && (
          <AgentPlaygroundView
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
            models={models}
            skills={skills}
            tools={tools}
            userCredits={userCredits}
            onCreditsUpdated={setUserCredits}
          />
        )}

        {activeTab === 'analytics' && (
          <CreatorAnalyticsView
            agents={agents}
            runs={runs}
            userCredits={userCredits}
            onCreditsUpdated={setUserCredits}
            onOpenDeployModal={handleOpenDeploy}
          />
        )}
      </main>

      {/* Key Generation Modal */}
      {selectedAgent && (
        <DeployStackKeyModal
          stack={{
            id: selectedAgent.id,
            ownerId: 'creator',
            ownerName: selectedAgent.creator_name,
            name: selectedAgent.name,
            slug: selectedAgent.slug,
            tagline: selectedAgent.tagline,
            description: selectedAgent.description,
            category: 'Development',
            config: {
              model: 'gemini-2.0-flash',
              temperature: 0.2,
              maxTokens: 2048,
              topP: 0.95,
              systemPrompt: '',
              selectedSkillIds: [],
              enabledTools: []
            },
            status: 'published',
            pricePerCall: selectedAgent.price_per_call,
            monthlyPrice: selectedAgent.monthly_price || 29,
            callsCount: selectedAgent.calls_count,
            successRate: selectedAgent.success_rate,
            avgLatencyMs: selectedAgent.avg_latency_ms,
            rating: selectedAgent.rating,
            createdAt: selectedAgent.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }}
          isOpen={isDeployModalOpen}
          onClose={() => setIsDeployModalOpen(false)}
          onKeyGenerated={(key) => {
            // Update agent key
            setAgents(prev => prev.map(a => a.id === selectedAgent.id ? { ...a, api_key: key.rawKey } : a));
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-8 px-4 sm:px-8 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-zinc-900 dark:text-white">AgentForge AI Marketplace</span>
            <p className="text-[11px] mt-0.5">LangChain.js Orchestrated Multi-Tool Composable Agent Platform</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js 14 / 16 (App Router)</span>
            <span>•</span>
            <span>Google Gemini 2.5 ReAct</span>
            <span>•</span>
            <span>Supabase Postgres + RLS</span>
            <span>•</span>
            <span>Sandboxed Node VM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
