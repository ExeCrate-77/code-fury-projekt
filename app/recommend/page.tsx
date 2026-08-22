"use client"

import { AuthGate } from "@/components/auth-gate"
import { PageHeader } from "@/components/field"
import { AgentRecommender } from "@/components/agent-recommender"
import { useAuth } from "@/lib/use-auth"

export default function RecommendPage() {
  const { token } = useAuth()
  return <div><PageHeader title="Find your agent" sub="Compose the right model, skill and tools for the job" /><AuthGate><AgentRecommender token={token} /></AuthGate></div>
}
