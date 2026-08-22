"use client"

import { useState } from "react"
import type { Model, Skill, Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

export function PersonaBar({
  models,
  skills,
  tools,
  modelId,
  skillId,
  toolIds,
  onModel,
  onSkill,
  onToggleTool,
  onPublish,
}: {
  models: Model[]
  skills: Skill[]
  tools: Tool[]
  modelId: string
  skillId: string
  toolIds: string[]
  onModel: (id: string) => void
  onSkill: (id: string) => void
  onToggleTool: (id: string) => void
  onPublish: () => void
}) {
  const [toolsOpen, setToolsOpen] = useState(false)

  const selectClasses =
    "h-8 appearance-none border border-foreground/15 bg-transparent px-2 pr-7 text-[11px] font-bold uppercase tracking-widest outline-none transition-colors hover:border-foreground/40 focus-visible:border-primary"

  return (
    <div className="glass flex flex-col">
      <div className="flex flex-wrap items-center gap-2 p-2.5">
        <span className="hidden text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground lg:block">
          Persona
        </span>

        <div className="relative">
          <select
            aria-label="Model"
            value={modelId}
            onChange={(e) => onModel(e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled>
              Model
            </option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <Caret />
        </div>

        <div className="relative">
          <select
            aria-label="Skill"
            value={skillId}
            onChange={(e) => onSkill(e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled>
              Skill
            </option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <Caret />
        </div>

        <button
          onClick={() => setToolsOpen((v) => !v)}
          aria-expanded={toolsOpen}
          className={cn(
            "flex h-8 items-center gap-1.5 border px-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors",
            toolIds.length > 0
              ? "border-primary/60 text-primary"
              : "border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          )}
        >
          Tools
          <span
            className={cn(
              "flex size-4 items-center justify-center text-[9px]",
              toolIds.length > 0
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/10"
            )}
          >
            {toolIds.length}
          </span>
        </button>

        <div className="ml-auto">
          <button
            onClick={onPublish}
            className="h-8 border-2 border-primary px-3 text-[11px] font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Publish as API
          </button>
        </div>
      </div>

      {toolsOpen && (
        <div className="flex flex-wrap gap-1.5 border-t border-foreground/10 p-2.5">
          {tools.length === 0 && (
            <span className="text-[11px] text-muted-foreground">
              // No tools available — add one on the Tools page
            </span>
          )}
          {tools.map((t) => {
            const active = toolIds.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => onToggleTool(t.id)}
                aria-pressed={active}
                className={cn(
                  "border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                )}
              >
                {t.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Caret() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[8px] text-muted-foreground"
    >
      ▼
    </span>
  )
}
