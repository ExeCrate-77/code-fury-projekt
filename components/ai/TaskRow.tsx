import { Check, Circle, LoaderCircle } from "lucide-react"

export function TaskRow({ title, status }: { title: string; status: "todo" | "active" | "complete" }) {
  const Icon = status === "complete" ? Check : status === "active" ? LoaderCircle : Circle
  return <div className="flex items-center gap-2 text-sm text-[var(--ai-muted)]"><Icon className={`h-3.5 w-3.5 ${status === "complete" ? "text-[var(--ai-accent)]" : status === "active" ? "animate-spin text-[var(--ai-accent)]" : ""}`} />{title}</div>
}