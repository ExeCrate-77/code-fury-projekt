import type { AIBlock } from "@/lib/ai-types"
import { AIOrb } from "./AIOrb"
import { AIBlockRenderer } from "./AIBlockRenderer"

export function AIMessage({ blocks, state = "idle" }: { blocks: AIBlock[]; state?: "idle" | "thinking" | "streaming" | "tool" | "error" }) {
  return <article className="flex gap-3"><AIOrb state={state} size="sm" /><div className="min-w-0 flex-1 space-y-4 pt-1">{blocks.map((block, index) => <AIBlockRenderer block={block} key={`${block.type}-${index}`} />)}</div></article>
}