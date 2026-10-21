import { createRouter, createWebHistory } from 'vue-router'

import ProfileView from '../views/ProfileView.vue'
import SkillsView from '../views/SkillsView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import HealthView from '../views/HealthView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),

	routes: [
		{
			path: '/',
			redirect: '/profile'
		},
		{
			path: '/profile',
			component: ProfileView
		},
		{
			path: '/skills',
			component: SkillsView
		},
		{
			path: '/projects',
			component: ProjectsView
		},
		{
			path: '/health',
			component: HealthView
		}
	]
})

export default router
