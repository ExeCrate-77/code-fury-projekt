import { ChatOpenAI } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'

/**
 * Turns a `models` row into a LangChain chat model instance.
 * Providers: openai, anthropic, ollama, custom (OpenAI-compatible endpoint).
 */
export function buildChatModel(model) {
  const { provider, model_name, base_url, api_key } = model

  switch (provider) {
    case 'openai':
      return new ChatOpenAI({
        model: model_name || 'gpt-4o-mini',
        apiKey: api_key || process.env.OPENAI_API_KEY,
      })

    case 'anthropic':
      return new ChatAnthropic({
        model: model_name || 'claude-sonnet-4-5',
        apiKey: api_key || process.env.ANTHROPIC_API_KEY,
      })

    case 'ollama':
      return new ChatOpenAI({
        model: model_name || 'llama3',
        apiKey: api_key || 'ollama',
        configuration: { baseURL: base_url || 'http://localhost:11434/v1' },
      })

    case 'custom':
    default:
      if (!base_url) throw new Error(`Custom model "${model.name}" is missing base_url`)
      return new ChatOpenAI({
        model: model_name || 'default',
        apiKey: api_key || 'custom',
        configuration: { baseURL: base_url },
      })
  }
}
