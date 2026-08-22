"use client"

type OrbState = "idle" | "thinking" | "streaming" | "tool" | "error"

export function AIOrb({ state = "idle", size = "md" }: { state?: OrbState; size?: "sm" | "md" }) {
  return (
    <span aria-label={`AI ${state}`} className={`ai-orb ai-orb-${state} ${size === "sm" ? "scale-75 origin-left" : ""}`} role="img">
      <span className="ai-orb-core" />
    </span>
  )
}