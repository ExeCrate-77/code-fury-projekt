import { Sandbox } from '@e2b/code-interpreter'

const PERSISTENT_TTL_MS = 24 * 60 * 60 * 1000 // 24h cap per PRD

// agentId -> { url, sandbox, expiresAt } registry for persistent mode
const persistentSandboxes = new Map()

/**
 * Short-lived mode: fresh sandbox per call, killed after output returns.
 * Used by the code_execution tool from chat/execute endpoints.
 */
export async function runCodeInSandbox(code, language = 'python') {
  const sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY })
  try {
    const execution = await sandbox.runCode(code, { language })
    return {
      results: execution.results?.map((r) => r.text ?? String(r)) || [],
      stdout: execution.logs?.stdout?.map((l) => l.line) || [],
      stderr: execution.logs?.stderr?.map((l) => l.line) || [],
      error: execution.error ? String(execution.error) : null,
    }
  } catch (err) {
    return { results: [], stdout: [], stderr: [String(err.message)], error: String(err.message) }
  } finally {
    await sandbox.kill().catch(() => {})
  }
}

/**
 * Persistent mode: reuse (or spin up) a long-running sandbox for a
 * published agent. Returns the sandbox HTTPS URL; capped at 24h then re-spun.
 */
export async function getPersistentSandbox(agentId) {
  const existing = persistentSandboxes.get(agentId)
  if (existing && existing.expiresAt > Date.now()) {
    return existing.url
  }
  if (existing) {
    await existing.sandbox.kill().catch(() => {})
    persistentSandboxes.delete(agentId)
  }

  const sandbox = await Sandbox.create({
    apiKey: process.env.E2B_API_KEY,
    timeoutMs: PERSISTENT_TTL_MS,
  })
  const url = sandbox.getHost(8000)

  persistentSandboxes.set(agentId, {
    url: `https://${url}`,
    sandbox,
    expiresAt: Date.now() + PERSISTENT_TTL_MS,
  })

  return `https://${url}`
}

export async function stopPersistentSandbox(agentId) {
  const entry = persistentSandboxes.get(agentId)
  if (entry) {
    await entry.sandbox.kill().catch(() => {})
    persistentSandboxes.delete(agentId)
  }
}

export function listPersistentSandboxes() {
  return [...persistentSandboxes.entries()].map(([agentId, e]) => ({
    agent_id: agentId,
    url: e.url,
    expires_at: new Date(e.expiresAt).toISOString(),
  }))
}
