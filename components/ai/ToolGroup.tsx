import type { AIResponse } from "@/lib/ai-types"
import { ToolChip } from "./ToolChip"

export function ToolGroup({ tools }: { tools: AIResponse["toolCalls"] }) {
  if (tools.length === 0) return null
  return <div className="flex flex-wrap gap-2">{tools.map((tool, index) => <ToolChip key={`${tool.name}-${index}`} name={tool.name} />)}</div>
}