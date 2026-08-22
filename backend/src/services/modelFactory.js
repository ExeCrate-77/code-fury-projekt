import { ChatOpenAI } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatGoogle } from '@langchain/google'

/**
 * Turns a `models` row into a LangChain chat model instance.
 * Providers: openai, anthropic, gemini, ollama, custom (OpenAI-compatible endpoint).
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

    case 'gemini':
      return new ChatGoogle({
        model: model_name || 'gemini-2.5-flash',
        apiKey: api_key || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
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

/**
 * Resolves a model row to an OpenAI-compatible endpoint + key.
 * Used by the E2B hosted runtime, which runs a dependency-free
 * tool-calling loop against /chat/completions inside the sandbox.
 * Returns null for providers without an OpenAI-compatible surface.
 */
export function resolveOpenAICompatible(model) {
  const { provider, model_name, base_url, api_key } = model

  switch (provider) {
    case 'openai':
      return {
        base_url: base_url || 'https://api.openai.com/v1',
        api_key: api_key || process.env.OPENAI_API_KEY || '',
        model_name: model_name || 'gpt-4o-mini',
      }
    case 'ollama':
      return {
        base_url: base_url || 'http://localhost:11434/v1',
        api_key: api_key || 'ollama',
        model_name: model_name || 'llama3',
      }
    case 'custom':
      return base_url
        ? { base_url, api_key: api_key || 'custom', model_name: model_name || 'default' }
        : null
    default:
      return null
  }
}
