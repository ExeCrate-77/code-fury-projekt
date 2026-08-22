"use client"

import Link from "next/link"
import { LogOut, UserRound } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ModelPicker } from "./ModelPicker"
import type { Model } from "@/lib/types"

export function ChatNavbar({ models, selectedModel, onModelChange, user }: { models: Model[]; selectedModel?: string; onModelChange: (id: string) => void; user: { email?: string } | null }) {
  return <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--ai-border)] bg-[#050505]/90 px-4 backdrop-blur-md sm:px-6"><Link href="/" className="font-mono text-xs font-bold tracking-[0.22em] text-[var(--ai-text)]">AGENT<span className="text-[var(--ai-accent)]">MKT</span></Link><span className="absolute left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--ai-muted)]">Chat</span><div className="flex items-center gap-3"><ModelPicker models={models} value={selectedModel} onChange={onModelChange} /><div className="hidden h-5 w-px bg-[var(--ai-border)] sm:block" />{user ? <button aria-label="Sign out" title={user.email || "Sign out"} onClick={() => supabase.auth.signOut()} className="text-[var(--ai-muted)] hover:text-[var(--ai-accent)]"><UserRound className="h-4 w-4" /></button> : <Link aria-label="Sign in" href="/settings" className="text-[var(--ai-muted)] hover:text-[var(--ai-accent)]"><LogOut className="h-4 w-4" /></Link>}</div></header>
}