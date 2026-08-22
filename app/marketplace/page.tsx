"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { useCatalog } from "@/lib/use-catalog"
import { AuthGate } from "@/components/auth-gate"
import { PageHeader } from "@/components/field"
import {
  CATALOG_TABS,
  CatalogGrid,
  type CatalogTab,
} from "@/components/catalog"
import type { Agent } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function MarketplacePage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Marketplace"
        sub="Agents / Skills / Models / Tools — browse and reuse"
      />
      <AuthGate>
        <Marketplace />
      </AuthGate>
    </div>
  )
}

function Marketplace() {
  const { token } = useAuth()
  const router = useRouter()
  const { models, skills, tools, agents, loading, error } = useCatalog(token)

  const [tab, setTab] = useState<CatalogTab>("Agents")
  const [search, setSearch] = useState("")

  const counts: Record<CatalogTab, number> = {
    Agents: agents.length,
    Skills: skills.length,
    Models: models.length,
    Tools: tools.length,
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const match = (name: string, extra = "") =>
      !q || (name + " " + extra).toLowerCase().includes(q)
    switch (tab) {
      case "Agents":
        return agents.filter((a) => match(a.name, a.description || ""))
      case "Skills":
        return skills.filter((s) => match(s.name, s.system_prompt))
      case "Models":
        return models.filter((m) => match(m.name, m.provider))
      case "Tools":
        return tools.filter((t) => match(t.name, t.tool_type))
    }
  }, [tab, search, agents, skills, models, tools])

  const tryAgent = (agent: Agent) => router.push(`/?agent=${agent.id}`)

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="border-2 border-destructive p-4 text-xs uppercase tracking-widest text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap border-2 border-foreground">
          {CATALOG_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {t}
              <span
                className={cn(
                  "flex h-4 min-w-4 items-center justify-center px-1 text-[9px]",
                  tab === t
                    ? "bg-primary-foreground/20"
                    : "bg-foreground/10 text-muted-foreground"
                )}
              >
                {counts[t]}
              </span>
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${tab.toLowerCase()}...`}
          aria-label="Search catalog"
          className="glass w-full max-w-xs px-3 py-2.5 text-xs uppercase tracking-widest outline-none placeholder:text-muted-foreground focus-visible:border-primary sm:w-64"
        />
      </div>

      {loading ? (
        <p className="animate-pulse py-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Loading catalog...
        </p>
      ) : (
        <CatalogGrid tab={tab} items={filtered} onTryAgent={tryAgent} />
      )}
    </div>
  )
}
