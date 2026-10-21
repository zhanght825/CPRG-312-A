import express from 'express'
import helmet from 'helmet'

import profileRouter from '../views/ProfileView.vue'
import skillsRouter from '../views/SkillsView.vue'
import projectsRouter from '../views/ProjectsView.vue'
import healthRouter from '../views/HealthView.vue'

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
