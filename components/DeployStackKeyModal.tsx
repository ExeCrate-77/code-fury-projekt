'use client';

import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Check, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentStack, ConsumerApiKey } from '@/lib/stack-types';
import { saveConsumerKey } from '@/lib/stacks-store';

interface DeployStackKeyModalProps {
  stack: AgentStack | null;
  isOpen: boolean;
  onClose: () => void;
  onKeyGenerated: (newKey: ConsumerApiKey) => void;
}

export const DeployStackKeyModal: React.FC<DeployStackKeyModalProps> = ({
  stack,
  isOpen,
  onClose,
  onKeyGenerated
}) => {
  const [keyLabel, setKeyLabel] = useState('Production Microservice Integration');
  const [rateTier, setRateTier] = useState<'Standard' | 'High-Throughput' | 'Dedicated'>('Standard');
  const [generatedKey, setGeneratedKey] = useState<ConsumerApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !stack) return null;

  const handleGenerate = () => {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const fullKey = `sf_live_${stack.slug.slice(0, 4)}_${randomHex}`;

    const newKeyObj: ConsumerApiKey = {
      id: `key_${Date.now()}`,
      stackId: stack.id,
      stackName: stack.name,
      keyLabel: keyLabel || `${stack.name} Client Key`,
      rawKey: fullKey,
      keyPrefix: fullKey.slice(0, 18),
      rateLimit: rateTier === 'Standard' ? '1,200 req/min' : rateTier === 'High-Throughput' ? '5,000 req/min' : '20,000 req/min (Dedicated)',
      status: 'active',
      totalCalls: 0,
      createdAt: new Date().toISOString(),
      lastUsedAt: 'Just now'
    };

    saveConsumerKey(newKeyObj);
    setGeneratedKey(newKeyObj);
    onKeyGenerated(newKeyObj);

    // Confetti
    try {
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const copyKey = () => {
    if (!generatedKey?.rawKey) return;
    navigator.clipboard.writeText(generatedKey.rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetModal = () => {
    setGeneratedKey(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={resetModal}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!generatedKey ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Provision Stack API Key
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Deploy authenticated access for <strong>{stack.name}</strong> (${stack.pricePerCall}/call)
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Key Label / Project Name
              </label>
              <input
                type="text"
                value={keyLabel}
                onChange={(e) => setKeyLabel(e.target.value)}
                placeholder="e.g. Production Backend Service"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Throughput & Rate Limit Tier
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'Standard', rate: '1,200 req/min', desc: 'Default metered' },
                  { id: 'High-Throughput', rate: '5,000 req/min', desc: 'Burst load tier' },
                  { id: 'Dedicated', rate: '20,000 req/min', desc: 'Dedicated node' }
                ].map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setRateTier(t.id as any)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      rateTier === t.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <span className="font-bold text-zinc-900 dark:text-white block">{t.id}</span>
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 block mt-0.5">{t.rate}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleGenerate}
                className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate Production Key
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                API Key Provisioned!
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Access token for <strong>{stack.name}</strong> is live and ready for deployment.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 text-white border border-zinc-800 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>SECRET KEY TOKEN</span>
                <span className="text-emerald-400 font-bold">STATUS: ACTIVE</span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                <span className="truncate">{generatedKey.rawKey}</span>
                <button
                  onClick={copyKey}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex-shrink-0 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
              <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Make sure to copy your key now. You can also view and manage it anytime in your <strong>Consumer & API Keys Dashboard</strong>.
              </span>
            </div>

            <button
              onClick={resetModal}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              Done & View Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
