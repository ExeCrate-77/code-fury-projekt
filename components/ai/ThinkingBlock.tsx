import { AIOrb } from "./AIOrb"

export function ThinkingBlock({ label = "Thinking", active = true }: { label?: string; active?: boolean }) {
  return <div className="flex items-center gap-2 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ai-muted)]"><AIOrb state={active ? "thinking" : "idle"} size="sm" /><span>{label}{active ? "..." : " complete"}</span></div>
}