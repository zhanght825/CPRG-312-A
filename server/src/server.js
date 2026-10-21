import https from 'node:https'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { app } from './app.js'

const here = dirname(fileURLToPath(import.meta.url))

const PORT = Number(process.env.PORT || 3000)

const options = {
  key: readFileSync(join(here, '../certs/localhost-key.pem')),
  cert: readFileSync(join(here, '../certs/localhost-cert.pem')),
}

https.createServer(options, app).listen(PORT, '127.0.0.1', () => {
  console.log(`Express HTTPS server: https://localhost:${PORT}`)
})
