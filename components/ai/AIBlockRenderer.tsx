import type { AIBlock } from "@/lib/ai-types"
import { ApprovalCard } from "./ApprovalCard"
import { CodeBlock } from "./CodeBlock"
import { ContextCard } from "./ContextCard"
import { DataTable } from "./DataTable"
import { InsightCard } from "./InsightCard"
import { RecommendationCard } from "./RecommendationCard"
import { StreamingText } from "./StreamingText"
import { TaskRow } from "./TaskRow"
import { ThinkingBlock } from "./ThinkingBlock"
import { ToolChip } from "./ToolChip"

export function AIBlockRenderer({ block }: { block: AIBlock }) {
  switch (block.type) {
    case "text": return <StreamingText content={block.content} />
    case "thinking": return <ThinkingBlock label={block.label} active={block.status !== "complete"} />
    case "tool": return <ToolChip name={block.name} status={block.status} />
    case "recommendation": return <RecommendationCard {...block} />
    case "insight": return <InsightCard {...block} />
    case "table": return <DataTable {...block} />
    case "code": return <CodeBlock {...block} />
    case "approval": return <ApprovalCard {...block} />
    case "task": return <TaskRow {...block} />
    case "context": return <ContextCard {...block} />
  }
}