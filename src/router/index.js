import express from 'express'
import helmet from 'helmet'

import profileRouter from '../views/ProfileView.js'
import skillsRouter from '../views/SkillsView.js'
import projectsRouter from '../views/ProjectsView.js'
import healthRouter from '../views/HealthView.js'

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
