"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

export function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1400) }
  return <section className="overflow-hidden border border-[var(--ai-border)] bg-[#090a08]"><header className="flex items-center justify-between border-b border-[var(--ai-border)] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[var(--ai-muted)]"><span>{language}</span><button aria-label="Copy code" className="flex items-center gap-1.5 hover:text-[var(--ai-accent)]" onClick={copy}>{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? "Copied" : "Copy"}</button></header><pre className="overflow-x-auto p-4 text-xs leading-6 text-[#d8e4bb]"><code>{code}</code></pre></section>
}