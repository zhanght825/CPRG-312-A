const API_BASE = import.meta.env.PROD ? '/cprg-312/api' : '/api'
let csrfToken = null
let csrfPromise = null
let refreshPromise = null

export function setCsrfToken(value) { csrfToken = value || null }
export function resetCsrfToken() { csrfToken = null }
async function fetchCsrf() {
  if (!csrfPromise) {
    csrfPromise = fetch(`${API_BASE}/auth/csrf`, { credentials: 'include' })
      .then(async response => {
        if (!response.ok) throw new Error('Unable to start a session')
        const data = await response.json()
        csrfToken = data.csrfToken
        return csrfToken
      }).finally(() => { csrfPromise = null })
  }
  return csrfPromise
}
async function request(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const changed = !['GET', 'HEAD', 'OPTIONS'].includes(method)
  if (changed && !csrfToken) await fetchCsrf()
  const headers = new Headers(options.headers || {})
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (changed) headers.set('x-csrf-token', csrfToken)
  return fetch(`${API_BASE}${path}`, { ...options, credentials: 'include', headers })
}
export async function api(path, options = {}) {
  let response = await request(path, options)
  // After a session is regenerated or expired, the cached CSRF value may be stale.
  if (response.status === 403 && !['GET', 'HEAD', 'OPTIONS'].includes((options.method || 'GET').toUpperCase())) {
    const data = await response.clone().json().catch(() => null)
    if (data?.message === 'Invalid CSRF token') {
      resetCsrfToken()
      await fetchCsrf()
      response = await request(path, options)
    }
  }
  if (response.status === 401 && !path.startsWith('/auth/')) {
    if (!refreshPromise) {
      refreshPromise = request('/auth/refresh', { method: 'POST' }).finally(() => { refreshPromise = null })
    }
    const refreshed = await refreshPromise
    if (refreshed.ok) response = await request(path, options)
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const error = new Error(data.message || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  if (response.status === 204) return null
  return response.json()
}
export const json = (method, path, payload) => api(path, { method, body: JSON.stringify(payload) })
export const googleLoginUrl = `${API_BASE}/auth/google`
