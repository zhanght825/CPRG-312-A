# CPRG-312-A — Phase 1: Secure HTTPS Portfolio API

**Team:** Huitao Zhang and Francheska Agaton  
**Program:** Web Design & Development  
**Live Vue page:** https://huitaoz.top/cprg-312/  
**Portfolio views:** `?name=huitao` and `?name=cheska`  
**Repository:** https://github.com/zhanght825/CPRG-312-A

> This is a Phase 1 implementation template. Do not claim HTTPS, Nginx proxying, or test results are complete until you have actually verified them in your environment. Public portraits and sample projects are placeholders.

## 1. Assignment scope

- Part A: Developer Portfolio and Project Showcase with two separate public portfolio views.
- Part B: Local HTTPS Express server using an OpenSSL self-signed certificate; production HTTPS is terminated by existing Nginx and its trusted certificate.
- Part C: Express and Helmet HTTP security headers (including Content-Security-Policy and X-Frame-Options).
- Part D: Five core API routes with explicit cache policies (table below).
- Part E: Local HTTPS/browser/curl validation and automated API checks.
- Part F: This README documents decisions, setup, tests, and reflections.

## 2. Frontend setup

The `src/` files in this package are an **overlay** for your existing Vue 3 + Vite repository. Keep your existing root `package.json`, `package-lock.json`, `.github/workflows/deploy.yml`, router, and Vite plugins. Follow `INSTALL.md` to add files without deleting your current project settings.

```bash
npm ci
npm run dev
npm run build
```

Set Vite `base: '/cprg-312/'` for production under a subpath. To call local Express through the Vite dev server, add the Vite proxy in `INSTALL.md`.

## 3. Express local HTTPS setup

Requires Node.js >= 22.18 and OpenSSL. From the project root:

```bash
cd server
npm install
bash generate-local-cert.sh
npm start
```

Express HTTPS listens **only on 127.0.0.1:3000**. Open a local browser at `https://localhost:3000/api/profile?name=huitao`. Because the local certificate is self-signed, the browser will warn; this is expected **for local testing only**. Test using:

```bash
curl -k -i 'https://localhost:3000/api/profile?name=huitao'
curl -k -i 'https://localhost:3000/api/projects?name=cheska'
curl -k -i 'https://localhost:3000/api/projects/portfolio?name=huitao'
```

`-k` disables certificate verification and must **only** be used for this local test. Never commit `server/certs/` or any private keys.

**SSL reflection:** We chose OpenSSL self-signed TLS for isolated Express development because it is reproducible without publishing port 3000 or distributing production private keys. The published website instead uses the existing Nginx HTTPS configuration and a trusted domain certificate. For local HTTPS, we accept the browser warning only in our development environment. Verify the actual production certificate and renewal before claiming they are configured.

## 4. Five routes, cache policies, and security reasons

All URLs accept `name=huitao` or `name=cheska`. Only public, curated information is returned.

| Method & route                   | Purpose                                   | `Cache-Control`                                  | Rationale                                        |
| -------------------------------- | ----------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| `GET /api/profile?name=...`      | Public bio, display name and introduction | `public, max-age=300`                            | Public content; allow a 5-minute cache           |
| `GET /api/skills?name=...`       | Skills and focus areas                    | `public, max-age=3600`                           | Changes infrequently; 1-hour cache               |
| `GET /api/projects?name=...`     | Portfolio project listing                 | `public, max-age=300, stale-while-revalidate=60` | Briefly serve stale public data while refreshing |
| `GET /api/projects/:id?name=...` | Individual project details                | `public, max-age=300`                            | Public details, refreshed within 5 minutes       |
| `GET /api/posts?name=...`        | Learning notes / planned posts            | `public, max-age=300`                            | Public editorial data only                       |

There is an additional `GET /api/health` diagnostics endpoint with `Cache-Control: no-store`.
Invalid names, missing projects, and errors return `no-store` to avoid caching errors. Public caches are **not** suitable for login data, user sessions, private drafts, or contact submissions; add `Cache-Control: no-store` if later phases introduce sensitive responses. Cookie/session authentication belongs to Phase 2.

**Caching reflection:** Longer caching lowers repeated requests but delays updates. Skills can tolerate a 1-hour delay; projects and posts use 5 minutes. `stale-while-revalidate=60` can improve perceived responsiveness when supported by a cache. There is no cache of personal or private information. A request-specific `?name=` query keeps each public portfolio URL distinct.

## 5. Security headers

`server/app.js` uses Helmet for CSP and other security headers. The API uses a restrictive `default-src 'none'` policy because JSON endpoints do not need scripts/styles; `frame-ancestors 'none'` prevents embedding API responses. Helmet also sends `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and other protections. Helmet's HSTS header is effective when delivered over HTTPS; when a reverse proxy is used, test the final HTTPS response headers as well as the backend.

**Headers reflection:** Security headers reduce common browser-side risks such as clickjacking, MIME-type sniffing, and unintended resource loading. They complement—but do not replace—authorization, input validation and secure cookies in later phases.

## 6. Testing evidence

Run after installing dependencies:

```bash
cd server && npm test
```

Also collect screenshots or terminal output of:

```bash
curl -k -I 'https://localhost:3000/api/profile?name=huitao' # NOTE: HEAD works automatically for GET routes
curl -k -i 'https://localhost:3000/api/profile?name=other'
curl -I 'https://huitaoz.top/cprg-312/'
```

Check `Content-Security-Policy`, `X-Frame-Options`, `Cache-Control`, response codes, and the certificate details in the browser. The production `/cprg-312/api/` path is only available after deploying Express and configuring Nginx.

## 7. Production deployment (separate from existing Vue CI)

The existing GitHub Actions workflow deploys **only Vue `dist/`**. It does not install or restart Express. To expose the API publicly:

1. Put the server code in a non-public directory on Vultr, for example `/home/zhanght/CPRG-312-A/server` (not inside `/var/www/html/cprg-312`).
2. Install server dependencies with `cd server && npm ci` once `server/package-lock.json` is committed.
3. Run the backend under systemd or another supervisor with `SERVER_MODE=nginx-proxy`, listening only on `127.0.0.1:3001`. An editable service example is included.
4. Add the location rule from `nginx-location-example.conf` **inside the existing HTTPS virtual host**, check with `sudo nginx -t`, then reload Nginx.
5. Test `curl -i https://huitaoz.top/cprg-312/api/profile?name=huitao` and check its HTTP headers.

Do not publish port 3001 to the internet. The browser→Nginx connection is encrypted with HTTPS; Nginx→Express uses loopback HTTP on the same server. For an explicit direct-HTTPS Express demonstration, use `https://localhost:3000` mode.

## 8. Lessons learned / team reflection (complete after testing)

- **Challenge encountered:** [Describe an actual SSL, reverse proxy, Vue base URL or CSP issue.]
- **Resolution:** [Commands/configuration changes used and their observed results.]
- **Trade-off:** Public cache improves performance but changes may not appear until the cache expires.
- **Next phase:** Secure authentication, authorization, session management and `no-store` private responses.

## 9. References and attribution

- Express: https://expressjs.com/
- Helmet: https://helmetjs.github.io/
- MDN Cache-Control: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
- MDN CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- Node.js HTTPS: https://nodejs.org/api/https.html
- OpenSSL: https://www.openssl.org/
- Example photos: Unsplash (https://unsplash.com/license); portraits are illustrations and not the named students.
- AI assistance: [Document any code generation/editing assistance as required by your instructor or SAIT guidance.]
