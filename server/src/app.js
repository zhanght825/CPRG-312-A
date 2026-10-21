import express from 'express'
import helmet from 'helmet'
import portfolioRouter from './routes/portfolio.js'

const app = express()

app.use(helmet())
app.use(express.json())

// Register all API routes
app.use('/api', portfolioRouter)

// Handle unknown routes
app.use((req, res) => {
	res.status(404).json({
		error: 'Route not found'
	})
})

export { app }
