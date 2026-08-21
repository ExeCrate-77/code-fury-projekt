'use client';

import React, { useState, useEffect } from 'react';
import { StackForgeNavbar } from '@/components/StackForgeNavbar';
import { StackMarketplaceView } from '@/components/StackMarketplaceView';
import { StackBuilderView } from '@/components/StackBuilderView';
import { SandboxTestView } from '@/components/SandboxTestView';
import { ConsumerDashboardView } from '@/components/ConsumerDashboardView';
import { DeployStackKeyModal } from '@/components/DeployStackKeyModal';
import { StackDetailModal } from '@/components/StackDetailModal';
import { AgentStack, ConsumerApiKey, ExecutionLog, StackConfig } from '@/lib/stack-types';
import { 
  getStoredStacks, 
  getConsumerKeys, 
  getUserCredits, 
  getExecutionLogs,
  topUpCredits
} from '@/lib/stacks-store';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'builder' | 'sandbox' | 'dashboard'>('marketplace');
  const [stacks, setStacks] = useState<AgentStack[]>([]);
  const [apiKeys, setApiKeys] = useState<ConsumerApiKey[]>([]);
  const [userCredits, setUserCredits] = useState<number>(50.00);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);

  // Selected modals
  const [selectedStackForSandbox, setSelectedStackForSandbox] = useState<AgentStack | null>(null);
  const [selectedStackForDeploy, setSelectedStackForDeploy] = useState<AgentStack | null>(null);
  const [selectedStackForDetail, setSelectedStackForDetail] = useState<AgentStack | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Load from store on mount
  useEffect(() => {
    setStacks(getStoredStacks());
    setApiKeys(getConsumerKeys());
    setUserCredits(getUserCredits());
    setExecutionLogs(getExecutionLogs());
  }, []);

  const handleOpenDeploy = (stack: AgentStack) => {
    setSelectedStackForDeploy(stack);
    setIsDeployModalOpen(true);
  };

  const handleOpenDetail = (stack: AgentStack) => {
    setSelectedStackForDetail(stack);
    setIsDetailModalOpen(true);
  };

  const handleSelectStackForSandbox = (stack: AgentStack) => {
    setSelectedStackForSandbox(stack);
    setActiveTab('sandbox');
  };

  const handleTestDraftInSandbox = (draftConfig: StackConfig, stackName: string) => {
    const tempStack: AgentStack = {
      id: `draft_${Date.now()}`,
      ownerId: 'current_creator',
      ownerName: 'Your Draft Stack',
      name: stackName || 'Draft Stack',
      slug: 'draft-stack',
      tagline: 'Draft configured stack in sandbox',
      description: 'Currently testing draft configuration',
      category: 'Development',
      config: draftConfig,
      status: 'draft',
      pricePerCall: 0.002,
      monthlyPrice: 29,
      callsCount: 0,
      successRate: 100,
      avgLatencyMs: 120,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSelectedStackForSandbox(tempStack);
    setActiveTab('sandbox');
  };

  const handleStackPublished = (newStack: AgentStack) => {
    setStacks((prev) => [newStack, ...prev.filter(s => s.id !== newStack.id)]);
    setSelectedStackForSandbox(newStack);
    setActiveTab('marketplace');
  };

  const handleKeyGenerated = (newKey: ConsumerApiKey) => {
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleCreditsUpdated = (newCredits: number) => {
    setUserCredits(newCredits);
    setExecutionLogs(getExecutionLogs());
  };

  const handleTopUpCredits = () => {
    const updated = topUpCredits(25);
    setUserCredits(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Universal Navigation Header */}
      <StackForgeNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNewStackBuilder={() => setActiveTab('builder')}
        userCredits={userCredits}
        onTopUpCredits={handleTopUpCredits}
        activeKeysCount={apiKeys.length}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <StackMarketplaceView
            stacks={stacks}
            onSelectStackForSandbox={handleSelectStackForSandbox}
            onOpenDeployModal={handleOpenDeploy}
            onOpenDetailModal={handleOpenDetail}
            onNavigateToBuilder={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'builder' && (
          <StackBuilderView
            onStackPublished={handleStackPublished}
            onTestInSandbox={handleTestDraftInSandbox}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxTestView
            stacks={stacks}
            selectedStack={selectedStackForSandbox}
            onSelectStack={setSelectedStackForSandbox}
            userCredits={userCredits}
            onCreditsUpdated={handleCreditsUpdated}
          />
        )}

        {activeTab === 'dashboard' && (
          <ConsumerDashboardView
            apiKeys={apiKeys}
            executionLogs={executionLogs}
            userCredits={userCredits}
            onCreditsUpdated={handleCreditsUpdated}
            stacks={stacks}
            onOpenDeployModal={handleOpenDeploy}
          />
        )}
      </main>

      {/* Deploy / Generate Key Modal */}
      <DeployStackKeyModal
        stack={selectedStackForDeploy}
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onKeyGenerated={handleKeyGenerated}
      />

      {/* Stack Detail & Inspection Modal */}
      <StackDetailModal
        stack={selectedStackForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenSandbox={handleSelectStackForSandbox}
        onOpenDeploy={handleOpenDeploy}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-8 px-4 sm:px-8 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-extrabold text-zinc-900 dark:text-white">StackForge AI Marketplace</span>
            <p className="text-[11px] mt-0.5">The Open Protocol for Autonomous Agent Stacks & Tool Grounding</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js 16 (App Router)</span>
            <span>•</span>
            <span>Gemini 2.0 Function Calling</span>
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
