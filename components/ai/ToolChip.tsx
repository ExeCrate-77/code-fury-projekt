import { Check, CircleAlert, LoaderCircle } from "lucide-react"

export function ToolChip({ name, status = "complete" }: { name: string; status?: "running" | "complete" | "error" }) {
  const Icon = status === "running" ? LoaderCircle : status === "error" ? CircleAlert : Check
  return <span className="inline-flex items-center gap-1.5 border border-[var(--ai-border)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ai-muted)]"><Icon className={`h-3 w-3 ${status === "running" ? "animate-spin text-[var(--ai-accent)]" : status === "error" ? "text-red-400" : "text-[var(--ai-accent)]"}`} />{name.replace(/[_-]/g, " ")}</span>
}