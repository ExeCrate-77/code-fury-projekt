import express from 'express'
import cors from 'cors'

import modelsRouter from './routes/models.js'
import skillsRouter from './routes/skills.js'
import toolsRouter from './routes/tools.js'
import agentsRouter from './routes/agents.js'
import apiKeysRouter from './routes/apiKeys.js'
import chatRouter from './routes/chat.js'
import executeRouter from './routes/execute.js'
import dashboardRouter from './routes/dashboard.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/v1/models', modelsRouter)
app.use('/api/v1/skills', skillsRouter)
app.use('/api/v1/tools', toolsRouter)
app.use('/api/v1/agents', executeRouter)
app.use('/api/v1/agents', agentsRouter)
app.use('/api/v1/api-keys', apiKeysRouter)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/dashboard', dashboardRouter)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))
app.use(errorHandler)

export default app
