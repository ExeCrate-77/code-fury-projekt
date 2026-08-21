import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { runCodeInSandbox } from './sandbox.js'

/**
 * Turns `tools` rows into LangChain tool instances.
 * tool_type: code_execution | web_scraping | web_search | custom
 */
export async function buildTools(toolRows) {
  return toolRows.map((row) => {
    switch (row.tool_type) {
      case 'code_execution':
        return codeExecutionTool()
      case 'web_search':
        return webSearchTool(row)
      case 'web_scraping':
        return webScrapingTool(row)
      case 'custom':
      default:
        return customHttpTool(row)
    }
  })
}

function codeExecutionTool() {
  return tool(
    async ({ code, language }) => {
      const result = await runCodeInSandbox(code, language || 'python')
      return JSON.stringify(result)
    },
    {
      name: 'code_execution',
      description:
        'Execute Python or JavaScript code in an isolated E2B sandbox and return stdout, stderr and results.',
      schema: z.object({
        code: z.string().describe('The source code to execute'),
        language: z.enum(['python', 'js']).default('python').describe('Language runtime to use'),
      }),
    },
  )
}

function webSearchTool(row) {
  const apiKey = row.schema_config?.api_key || process.env.TAVILY_API_KEY
  return tool(
    async ({ query }) => {
      if (!apiKey) return JSON.stringify({ error: 'Tavily API key not configured' })
      const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, query, max_results: 5 }),
      })
      const data = await resp.json()
      return JSON.stringify(data.results || data)
    },
    {
      name: row.name.replace(/\s+/g, '_').toLowerCase(),
      description: row.schema_config?.description || 'Search the web for current information.',
      schema: z.object({ query: z.string().describe('Search query') }),
    },
  )
}

function webScrapingTool(row) {
  const apiKey = row.schema_config?.api_key || process.env.FIRECRAWL_API_KEY
  return tool(
    async ({ url }) => {
      if (!apiKey) return JSON.stringify({ error: 'Firecrawl API key not configured' })
      const resp = await fetch(`https://api.firecrawl.dev/v1/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ url, formats: ['markdown'] }),
      })
      const data = await resp.json()
      return JSON.stringify(data.data || data)
    },
    {
      name: row.name.replace(/\s+/g, '_').toLowerCase(),
      description: row.schema_config?.description || 'Scrape a URL and return its content as markdown.',
      schema: z.object({ url: z.string().url().describe('URL to scrape') }),
    },
  )
}

function customHttpTool(row) {
  const cfg = row.schema_config || {}
  return tool(
    async (args) => {
      if (!cfg.endpoint) return JSON.stringify({ error: 'Custom tool has no endpoint configured' })
      const resp = await fetch(cfg.endpoint, {
        method: cfg.method || 'POST',
        headers: { 'Content-Type': 'application/json', ...(cfg.headers || {}) },
        body: JSON.stringify(args),
      })
      const text = await resp.text()
      return text.slice(0, 4000)
    },
    {
      name: row.name.replace(/\s+/g, '_').toLowerCase(),
      description: cfg.description || `Custom tool: ${row.name}`,
      schema: z.record(z.string(), z.unknown()).describe('Free-form arguments forwarded to the endpoint'),
    },
  )
}
