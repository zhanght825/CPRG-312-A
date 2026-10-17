import test from 'node:test'
import assert from 'node:assert/strict'
import { app } from '../app.js'
import http from 'node:http'

// Bind only to localhost, choose an ephemeral port, and close after each check.
async function request(path) {
  const server = http.createServer(app)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}${path}`)
    return { response, body: await response.json() }
  } finally { await new Promise(resolve => server.close(resolve)) }
}

test('both public profiles have correct owners and cache policy', async () => {
  for (const [slug, fullName] of [['huitao','Huitao Zhang'], ['cheska','Francheska Agaton']]) {
    const {response,body} = await request(`/api/profile?name=${slug}`)
    assert.equal(response.status, 200)
    assert.equal(body.name, fullName)
    assert.equal(response.headers.get('cache-control'), 'public, max-age=300')
    assert.ok(response.headers.get('content-security-policy'))
    assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN') // Helmet default
  }
})
test('all five routes return useful data and expected cache headers', async () => {
  const cases = [
    ['/api/skills?name=huitao', 'public, max-age=3600'],
    ['/api/projects?name=cheska', 'public, max-age=300, stale-while-revalidate=60'],
    ['/api/projects/portfolio?name=huitao', 'public, max-age=300'],
    ['/api/posts?name=cheska', 'public, max-age=300'],
  ]
  for (const [path, cache] of cases) {
    const {response,body} = await request(path)
    assert.equal(response.status, 200, path)
    assert.equal(response.headers.get('cache-control'), cache, path)
    assert.ok(body)
  }
})
test('bad owner and missing project never receive public-cache policy', async () => {
  for (const path of ['/api/profile?name=other', '/api/projects/nope?name=huitao']) {
    const {response} = await request(path)
    assert.ok([400,404].includes(response.status))
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
})
