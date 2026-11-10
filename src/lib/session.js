import { reactive } from 'vue'
import { api, json, resetCsrfToken, setCsrfToken } from './api'
export const session = reactive({ user: null, ready: false })
let sessionPromise = null
export async function loadSession() {
  if (sessionPromise) return sessionPromise
  sessionPromise = (async () => {
    try {
      const data = await api('/profile')
      session.user = data.user
    } catch { session.user = null }
    finally { session.ready = true }
    return session.user
  })().finally(() => { sessionPromise = null })
  return sessionPromise
}
export async function login(email, password) {
  const data = await json('POST', '/auth/login', { email, password })
  session.user = data.user
  setCsrfToken(data.csrfToken)
  session.ready = true
  return data
}
export async function register(username, email, password) {
  return json('POST', '/auth/register', { username, email, password })
}
export async function logout() {
  try { await api('/auth/logout', { method: 'POST' }) }
  finally { session.user = null; session.ready = true; resetCsrfToken() }
}
