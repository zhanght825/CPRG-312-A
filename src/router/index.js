import express from 'express'
import helmet from 'helmet'

import profileRouter from './routes/profile.js'
import skillsRouter from './routes/skills.js'
import projectsRouter from './routes/projects.js'
import healthRouter from './routes/health.js'

const app = express()

app.use(helmet())
app.use(express.json())

// Register routes
app.use('/api/profile', profileRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/health', healthRouter)

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		error: 'Route not found'
	})
})

export { app }
