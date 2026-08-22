import { ChevronDown, Cpu } from "lucide-react"
import type { Model } from "@/lib/types"

const providerLabel = (provider: string) => provider.toLowerCase().includes("google") ? "Google" : provider.toLowerCase().includes("anthropic") ? "Anthropic" : provider.toLowerCase().includes("openai") ? "OpenAI" : provider

export function ModelPicker({ models, value, onChange }: { models: Model[]; value?: string; onChange: (id: string) => void }) {
  return <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--ai-muted)]"><Cpu className="h-3.5 w-3.5 text-[var(--ai-accent)]" /><span className="hidden sm:inline">Model</span><span className="relative"><select aria-label="Select model" className="max-w-[145px] appearance-none bg-transparent py-1 pr-5 text-[11px] normal-case tracking-normal text-[var(--ai-text)] outline-none" value={value || ""} onChange={(event) => onChange(event.target.value)}><option className="bg-[#0c0d0b]" value="" disabled>Select model</option>{models.map((model) => <option className="bg-[#0c0d0b]" key={model.id} value={model.id}>{providerLabel(model.provider)} / {model.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--ai-muted)]" /></span></label>
}