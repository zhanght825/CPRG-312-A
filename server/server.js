import https from 'node:https'
import http from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { app } from './app.js'

const here = dirname(fileURLToPath(import.meta.url))
const mode = process.env.SERVER_MODE || 'https-local'
if (mode === 'https-local') {
  // Local-only HTTPS required for Phase 1: https://localhost:3000
  const options = {
    key: readFileSync(join(here, 'certs/localhost-key.pem')),
    cert: readFileSync(join(here, 'certs/localhost-cert.pem')),
  }
  https.createServer(options, app).listen(3000, '127.0.0.1', () => {
    console.log('Local HTTPS: https://localhost:3000/api/profile?name=huitao')
  })
} else if (mode === 'nginx-proxy') {
  // Production: Nginx handles TLS; backend HTTP is ONLY on loopback.
  http.createServer(app).listen(3001, '127.0.0.1', () => {
    console.log('Express behind HTTPS Nginx at 127.0.0.1:3001')
  })
} else {
  console.error('SERVER_MODE must be https-local or nginx-proxy')
  process.exitCode = 1
}
