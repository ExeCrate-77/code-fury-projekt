export type AIBlock =
  | { type: "text"; content: string }
  | { type: "thinking"; label?: string; status?: "active" | "complete" }
  | { type: "tool"; name: string; status: "running" | "complete" | "error" }
  | { type: "recommendation"; title: string; description?: string; confidence?: number }
  | { type: "insight"; title: string; value: string; description?: string; progress?: number }
  | { type: "table"; columns: string[]; rows: unknown[][] }
  | { type: "code"; language: string; code: string }
  | { type: "approval"; title: string; description: string }
  | { type: "task"; title: string; status: "todo" | "active" | "complete" }
  | { type: "context"; title: string; content: string }

export interface AIResponse {
  blocks: AIBlock[]
  toolCalls: { name: string; args?: unknown }[]
}