"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Agent, Model, Skill, Tool } from "@/lib/types"

export function useCatalog(token: string | null) {
  const [models, setModels] = useState<Model[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    Promise.all([
      api<{ data: Model[] }>(token, "/models"),
      api<{ data: Skill[] }>(token, "/skills"),
      api<{ data: Tool[] }>(token, "/tools"),
      api<{ data: Agent[] }>(token, "/agents"),
    ])
      .then(([m, s, t, a]) => {
        setModels(m.data)
        setSkills(s.data)
        setTools(t.data)
        setAgents(a.data)
        setError(null)
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Backend unreachable — is the API running on port 4000?"
        )
      )
      .finally(() => setLoading(false))
  }, [token])

  return { models, skills, tools, agents, loading, error }
}
