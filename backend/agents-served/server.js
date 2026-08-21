// agent_server.js - Runs INSIDE the E2B Sandbox
import express from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

const app = express();
app.use(express.json());

let activeAgent = null;

// Initialize or update the agent persona stack inside the VM
app.post('/configure', (req, res) => {
  const { systemPrompt, modelName, apiKey } = req.body;

  const llm = new ChatOpenAI({
    modelName: modelName || 'gpt-4o',
    apiKey: apiKey || process.env.OPENAI_API_KEY,
  });

  // Build the complete LangChain agent instance inside the sandbox memory
  activeAgent = createReactAgent({
    llm,
    tools: [], // Add your tools here
    messageModifier: systemPrompt,
  });

  return res.json({ status: 'Persona initialized successfully inside sandbox' });
});

// Chat interface endpoint exposed by the sandbox micro-VM
app.post('/chat', async (req, res) => {
  if (!activeAgent) {
    return res.status(400).json({ error: 'Agent persona not initialized' });
  }

  try {
    const { message } = req.body;
    const result = await activeAgent.invoke({
      messages: [{ role: 'user', content: message }],
    });

    const reply = result.messages[result.messages.length - 1].content;
    return res.json({ response: reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(8000, () => console.log('E2B Agent Sandbox Server active on port 8000'));