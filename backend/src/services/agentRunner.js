import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'
import { buildChatModel } from './modelFactory.js'
import { buildTools } from './toolFactory.js'

function toLangChainMessages(history, current) {
  const mapped = [...history, ...current].map((m) => {
    if (typeof m === 'string') return new HumanMessage(m)
    if (m.role === 'assistant') return new AIMessage(m.content)
    if (m.role === 'system') return new SystemMessage(m.content)
    return new HumanMessage(m.content)
  })
  return mapped
}

/**
 * Builds a LangGraph React agent on the fly from a config
 * ({ model, skill, tools } rows from the DB) and runs it.
 */
export async function runAgent(config, messages, history = []) {
  const llm = buildChatModel(config.model)
  const tools = await buildTools(config.tools || [])

  const agent = createReactAgent({
    llm,
    tools,
    prompt: new SystemMessage(config.skill.system_prompt),
  })

  const result = await agent.invoke({
    messages: toLangChainMessages(history, messages),
  }, { recursionLimit: 25 })

  const outputMessages = result.messages || []
  const toolCalls = outputMessages.flatMap((m) =>
    (m.tool_calls || []).map((tc) => ({ name: tc.name, args: tc.args })),
  )
  const lastAi = [...outputMessages].reverse().find((m) => m._getType() === 'ai')

  return {
    output: lastAi?.content || '',
    toolCalls,
  }
}
