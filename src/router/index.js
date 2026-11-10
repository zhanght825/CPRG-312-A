import { createRouter, createWebHistory } from 'vue-router'
import { loadSession } from '../lib/session'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import SkillsView from '../views/SkillsView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import HealthView from '../views/HealthView.vue'
import ContactView from '../views/ContactView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminView from '../views/AdminView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/profile' },
    { path: '/login', component: LoginView, meta: { public: true } },
    { path: '/register', component: RegisterView, meta: { public: true } },
    { path: '/profile', component: ProfileView },
    { path: '/skills', component: SkillsView },
    { path: '/projects', component: ProjectsView },
    { path: '/health', component: HealthView },
    { path: '/contact', component: ContactView },
    { path: '/dashboard', component: DashboardView },
    { path: '/admin', component: AdminView, meta: { admin: true } },
    { path: '/:pathMatch(.*)*', redirect: '/profile' },
  ],
})
router.beforeEach(async to => {
  const user = await loadSession()
  if (to.meta.public) return user ? '/dashboard' : true
  if (!user) return { path: '/login', query: { next: to.fullPath } }
  if (to.meta.admin && user.role !== 'admin') return '/dashboard'
  return true
})
export default router
