import { Router } from 'express'

const router = Router()

// Portfolio data
const portfolios = {
	huitao: {
		name: 'Huitao Zhang',
		program: 'Web Design & Development',
		skills: [
			'HTML',
			'CSS',
			'JavaScript',
			'Vue 3',
		],
		projects: [
			{
				id: 1,
				title: 'Portfolio Website',
				description: 'Personal portfolio built with Vue 3'
			},
			{
				id: 2,
				title: 'Web Security Project',
				description: 'Secure web application using Express'
			}
		]
	},

	cheska: {
		name: 'Francheska Agaton',
		program: 'Web Design & Development',
		skills: [
			'HTML',
			'CSS',
			'JavaScript',
			'UI Design'
		],
		projects: [
			{
				id: 1,
				title: 'Portfolio Website',
				description: 'Personal portfolio project'
			}
		]
	}
}

// Helper function
function getPortfolio(req) {
	const name = String(req.query.name || 'huitao').toLowerCase()

	return portfolios[name]
}

// Route 1: Profile
router.get('/profile', (req, res) => {
	const portfolio = getPortfolio(req)

	if (!portfolio) {
		return res.status(404).json({
			error: 'Profile not found'
		})
	}

	res.json({
		name: portfolio.name,
		program: portfolio.program
	})
})

// Route 2: Skills
router.get('/skills', (req, res) => {
	const portfolio = getPortfolio(req)

	if (!portfolio) {
		return res.status(404).json({
			error: 'Profile not found'
		})
	}

	res.json({
		skills: portfolio.skills
	})
})

// Route 3: Projects
router.get('/projects', (req, res) => {
	const portfolio = getPortfolio(req)

	if (!portfolio) {
		return res.status(404).json({
			error: 'Profile not found'
		})
	}

	res.json({
		projects: portfolio.projects
	})
})

// Route 4: Health check
router.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		message: 'CPRG-312 API is running'
	})
})

export default router
