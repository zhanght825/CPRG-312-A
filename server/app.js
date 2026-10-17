import express from 'express'
import helmet from 'helmet'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const database = JSON.parse(readFileSync(join(here, 'portfolio-data.json'), 'utf8'))
export const app = express()
app.disable('x-powered-by')

// Helmet sends CSP, X-Frame-Options (via frameguard), HSTS and other security headers.
// CSP is restrictive because this API returns JSON, not executable web pages.
app.use(helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'none'"], frameAncestors: ["'none'"],
} }, crossOriginResourcePolicy: { policy: 'same-origin' } }))

const publicCache = (seconds, stale = 0) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${seconds}${stale ? `, stale-while-revalidate=${stale}` : ''}`)
  next()
}
const privateResponse = (req, res, next) => { res.set('Cache-Control', 'no-store'); next() }

function owner(req, res) {
  const name = req.query.name
  if (typeof name !== 'string' || !Object.hasOwn(database, name)) {
    res.set('Cache-Control', 'no-store')
    res.status(400).json({ error: 'Invalid name. Use ?name=huitao or ?name=cheska.' })
    return null
  }
  return database[name]
}

// Five core routes. All successful responses are PUBLIC only; no sessions / private data.
app.get('/api/profile', publicCache(300), (req, res) => {
  const person = owner(req, res); if (!person) return
  res.json(person.profile)
})
app.get('/api/skills', publicCache(3600), (req, res) => {
  const person = owner(req, res); if (!person) return
  res.json(person.skills)
})
app.get('/api/projects', publicCache(300, 60), (req, res) => {
  const person = owner(req, res); if (!person) return
  res.json(person.projects)
})
app.get('/api/projects/:id', publicCache(300), (req, res) => {
  const person = owner(req, res); if (!person) return
  const project = person.projects.find(p => p.id === req.params.id)
  if (!project) return res.set('Cache-Control', 'no-store').status(404).json({ error: 'Project not found.' })
  res.json(project)
})
app.get('/api/posts', publicCache(300), (req, res) => {
  const person = owner(req, res); if (!person) return
  res.json(person.posts)
})

app.get('/api/health', privateResponse, (req, res) => res.json({ status: 'ok' }))
app.use('/api', privateResponse, (req, res) => res.status(404).json({ error: 'API route not found.' }))
app.use((err, req, res, next) => {
  console.error('Request failed:', err.message)
  res.set('Cache-Control', 'no-store').status(500).json({ error: 'Internal server error.' })
})
