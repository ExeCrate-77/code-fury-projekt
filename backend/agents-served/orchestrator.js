// orchestrator.js - Runs on your MAIN Backend
import { Sandbox } from 'e2b';

// Store running sandbox connections in memory or database
const sandboxRegistry = new Map();

const AGENT_SERVER_CODE_STRING = "
 
"

export async function deployAgentPersonaSandbox(agentId, personaConfig) {
  // 1. Spawn a dedicated, long-running Linux micro-VM in E2B
  const sandbox = await Sandbox.create({
    apiKey: process.env.E2B_API_KEY,
    timeoutMs: 24 * 60 * 60 * 1000, // Keep running for up to 24 hours
  });

  // 2. Upload the server script to the sandbox filesystem
  await sandbox.files.write('/home/user/agent_server.js', AGENT_SERVER_CODE_STRING);

  // 3. Install dependencies inside the sandbox terminal
  await sandbox.commands.run('npm init -y && npm i express @langchain/openai @langchain/langgraph');

  // 4. Start the agent server in the background inside the sandbox
  await sandbox.commands.run('node /home/user/agent_server.js &');

  // 5. Get the external URL for port 8000 exposed by E2B
  const sandboxHost = sandbox.getHost(8000);
  const sandboxUrl = `https://${sandboxHost}`;

  // 6. Push the persona configuration into the sandbox
  await fetch(`${sandboxUrl}/configure`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personaConfig),
  });

  // Save the mapping: agentId -> sandboxUrl
  sandboxRegistry.set(agentId, sandboxUrl);

  return sandboxUrl;
}

// Proxy incoming API calls to the sandbox hosting the target persona
export async function handleAgentApiCall(agentId, userMessage) {
  const sandboxUrl = sandboxRegistry.get(agentId);

  if (!sandboxUrl) {
    throw new Error('Sandbox for this agent persona is not running.');
  }

  // Forward request directly to the agent running inside the isolated micro-VM
  const response = await fetch(`${sandboxUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  });

  return await response.json();
}