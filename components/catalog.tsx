"use client"

import { Badge } from "@/components/field"
import type { Agent, Model, Skill, Tool } from "@/lib/types"

export type CatalogTab = "Agents" | "Skills" | "Models" | "Tools"
export const CATALOG_TABS: CatalogTab[] = [
  "Agents",
  "Skills",
  "Models",
  "Tools",
]

export function CatalogGrid({
  tab,
  items,
  onTryAgent,
  onApiRequest,
}: {
  tab: CatalogTab
  items: (Agent | Skill | Model | Tool)[]
  onTryAgent?: (agent: Agent) => void
  onApiRequest?: (agent: Agent) => void
}) {
  if (items.length === 0) {
    return (
      <p className="border-2 border-dashed border-border p-12 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        // Nothing here yet — create the first one
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <CatalogCard
          key={item.id}
          tab={tab}
          item={item}
          onTry={
            tab === "Agents" && onTryAgent
              ? () => onTryAgent(item as Agent)
              : undefined
          }
          onApiRequest={tab === "Agents" ? () => onApiRequest?.(item as Agent) : undefined}
        />
      ))}
    </div>
  )
}

function CatalogCard({
  tab,
  item,
  onTry,
  onApiRequest,
}: {
  tab: CatalogTab
  item: Agent | Skill | Model | Tool
  onTry?: () => void
  onApiRequest?: () => void
}) {
  const meta = (() => {
    switch (tab) {
      case "Agents": {
        const a = item as Agent
        return {
          name: a.name,
          meta: `${a.model?.name ?? "?"} / ${a.skill?.name ?? "?"} / ${(a.tools || []).length} tools`,
          badge: a.is_published ? "Published" : "Draft",
          accent: a.is_published,
          price:
            Number(a.price_per_call) > 0 ? `$${a.price_per_call}/call` : "Free",
        }
      }
      case "Skills": {
        const s = item as Skill
        return {
          name: s.name,
          meta:
            s.system_prompt.slice(0, 90) +
            (s.system_prompt.length > 90 ? "..." : ""),
          badge: "Skill",
          accent: false,
        }
      }
      case "Models": {
        const m = item as Model
        return {
          name: m.name,
          meta: `${m.provider}${m.model_name ? " / " + m.model_name : ""}`,
          badge: "Model",
          accent: false,
        }
      }
      case "Tools": {
        const t = item as Tool
        return {
          name: t.name,
          meta: t.tool_type.replace(/_/g, " "),
          badge: "Tool",
          accent: false,
        }
      }
    }
  })()

  return (
    <article className="group glass flex flex-col transition-colors hover:border-primary/50">
      <div className="flex items-center justify-between border-b border-foreground/10 px-3 py-2">
        <Badge variant={meta.accent ? "accent" : "outline"}>{meta.badge}</Badge>
        {meta.price && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {meta.price}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-sans text-lg font-black uppercase leading-tight tracking-tight">
          {meta.name}
        </h3>
        <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
          {meta.meta}
        </p>
        {onTry && (
          <div className="flex flex-wrap gap-2">
          <button
            onClick={onTry}
            className="mt-2 self-start border border-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
          >
            Try agent →
          </button>
          {onApiRequest && <button onClick={onApiRequest} className="ml-2 border border-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">API request</button>}
          </div>
        )}
      </div>
    </article>
  )
}
