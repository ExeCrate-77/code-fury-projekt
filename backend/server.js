import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import app from './src/app.js'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Agent Marketplace API running on port ${PORT}`)
})
