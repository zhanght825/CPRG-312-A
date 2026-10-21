# Developer Portfolio and Project Showcase

**Course:** CPRG 312  
**Phase:** 1 — Establishing a Secure HTTPS Server  
**Team:** Huitao Zhang and Francheska (Cheska) Agaton  
**Live application:** https://huitaoz.top/cprg-312/

## Project Overview

This application is a developer portfolio and project showcase. It presents developer profiles, skills, project information, and public contact details. The frontend uses Vue and Vue Router, while the backend uses Express to provide JSON APIs. A service-status endpoint supports operational checks.

Phase 1 focuses on HTTPS, security-related HTTP headers, and deliberate caching policies. The backend selects portfolio data using the `name` query parameter, supporting `huitao` and `cheska`. When omitted, the parameter defaults to `huitao`.

## Team Contributions

- **Cheska:** Generated the public and private keys for the backend certificate setup.
- **Huitao:** Coordinated application integration, frontend troubleshooting, backend route and cache-policy updates, and deployment configuration.

Both team members should review this contribution summary before submission to ensure that it accurately represents their work.

## Technology and Hosting

| Component | Technology or service |
| --- | --- |
| Frontend | Vue, Vue Router, Vite |
| Backend | Node.js, Express |
| Security headers | Helmet |
| Cloud hosting | Vultr cloud server |
| Operating system | Ubuntu 24 |
| Reverse proxy | Nginx |
| Domain | huitaoz.top |
| Domain registrar | NameSilo |
| Public certificate management | Certbot |
| Backend certificate generation | OpenSSL |
| Deployment automation | GitHub Actions |

Nginx routes incoming application requests to the Express backend. The frontend is deployed under `/cprg-312/`. GitHub Actions updates the frontend and backend when the configured deployment workflow is triggered. The workflow stored in `.github/workflows/` is the source of truth for its trigger, commands, and deployment steps.

## Installation and Configuration

### 1. Obtain the project

Clone this GitHub repository using its Code button URL, then open the cloned project folder. Install Git, Node.js compatible with the project dependencies, npm, and OpenSSL. The production server also uses Nginx and Certbot.

### 2. Install dependencies

From the directory containing the frontend package.json:

```bash
npm ci
```

If installing a separate backend package, run `npm ci` in that package directory as well. If no package-lock.json exists, use `npm install` and commit the resulting lockfile.

### 3. Configure the frontend

The production Vite configuration must use the `/cprg-312/` base path. Vue Router should use `createWebHistory(import.meta.env.BASE_URL)`. Register the router with `app.use(router)` before calling `app.mount()`.

```bash
npm run dev
npm run build
```

The first command starts frontend development; the second generates production assets in `dist/`. The Vite development server is separate from the Express HTTPS server. API requests must reach Express through the configured development proxy or deployed Nginx mapping.

### 4. Configure backend HTTPS

Generate a development certificate or use the existing backend certificate configuration. Generate a local self-signed certificate:

```bash
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -sha256 -nodes -keyout certs/localhost-key.pem -out certs/localhost-cert.pem -days 30 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Configure the backend HTTPS entry point to read the matching private key and certificate and pass the Express application to `https.createServer`. Start the actual backend entry point from its directory; where it is named server.js, use:

```bash
node server.js
```

For the assignment local test, configure the backend to listen on port 3000 and visit `https://localhost:3000`. Use an API path if no root-page handler exists. A local self-signed certificate produces a trust warning unless explicitly trusted. Only accept the known local development certificate.

Certificate paths, listening ports, and production process commands must match the checked-in server configuration and deployment workflow. Keep private keys outside public asset directories and out of Git.

### 5. Deploy

Push changes to the branch used by the existing GitHub Actions workflow. Review the workflow result, then verify the deployed application in the browser. Nginx must route frontend navigation and API requests correctly; an API request must not fall through to the Vue HTML page.

## HTTPS and Certificate Decisions

The public website uses Certbot-managed certificates. The Express backend certificate was generated using OpenSSL, with Cheska responsible for the key pair. Certbot manages certificate issuance and renewal; Nginx and Node.js use certificate files to establish TLS connections.

The browser-to-Nginx connection and the Nginx-to-Express connection are separate connections. An HTTPS website address alone does not prove that the upstream connection uses HTTPS. When forwarding to the HTTPS backend, Nginx must use the matching protocol and port and verify the certificate against the trusted certificate or CA and expected identity.

A domain certificate for `huitaoz.top` does not automatically validate `localhost`. Backend and local certificate names must match the names used by clients. Renewal also requires the consuming services to load the updated certificate.

### Reflection: Why these methods?

We selected Certbot for the public domain because browser trust and manageable certificate renewal are important for a publicly accessible application. We used OpenSSL for the backend certificate to gain practical experience with key generation and HTTPS configuration. This combination lets us explore both public certificate management and application-level TLS setup. A self-signed certificate still supports encryption and has a digital signature, but clients need an explicit basis for trusting its identity. OpenSSL is not limited to self-signed certificates; it can also create signing requests for a CA.

Long certificate validity is not automatically a security advantage. Private-key protection, correct identity validation, renewal, and loading updated certificates are all important parts of the configuration.

## Security Headers

Helmet is registered before the backend routes using `app.use(helmet())`. It adds defensive response headers. Exact values should be read from the installed Helmet version and any explicit overrides.

| Header or policy | Security benefit |
| --- | --- |
| Content-Security-Policy | Limits permitted resource sources, reducing opportunities for injected content to execute. |
| X-Frame-Options and CSP frame-ancestors | Restrict framing and help mitigate clickjacking. |
| X-Content-Type-Options | Prevents browsers from guessing an unexpected MIME type. |
| Referrer-Policy | Controls information disclosed in referrer headers. |
| Strict-Transport-Security, where enabled | Instructs browsers to use HTTPS for subsequent requests during the policy lifetime. |

### Reflection: Why these headers?

TLS protects traffic in transit; headers influence how browsers handle the returned content. A suitable CSP restricts unneeded resource sources, framing restrictions reduce clickjacking risk, and MIME and referrer controls reduce unnecessary exposure. These measures complement input validation and future access controls rather than replacing them.

Helmet only affects responses passing through Express. If Nginx serves frontend HTML directly, appropriate document headers must be configured there as well. CSP attached to a JSON API response does not secure a separate frontend document.

### Reflection: Configuration challenge

An important design issue was distinguishing certificate management from the service actually providing HTTPS. Certbot management at Nginx does not itself configure Express HTTPS. The backend therefore needs its own certificate-loading configuration, and the proxy protocol must agree with the backend listener. A related lesson is to inspect actual responses rather than assume that installing Helmet secures every response produced by both servers.

## API Routes and Cache Policies

The router provides the following five GET endpoints. Paths below assume the router is mounted at `/api`; the public Nginx mapping adds the project prefix where configured.

| Endpoint | Purpose | Cache-Control |
| --- | --- | --- |
| `/api/profile?name=huitao` | Developer name and program | `public, max-age=60, must-revalidate` |
| `/api/contact?name=huitao` | Public email and phone | `public, max-age=60, must-revalidate` |
| `/api/skills?name=huitao` | Technical skills | `public, max-age=300` |
| `/api/projects?name=huitao` | Project list and descriptions | `public, max-age=300, stale-while-revalidate=60` |
| `/api/health` | Basic current API status | `no-store` |

The content endpoints also accept `name=cheska`. An unknown portfolio returns HTTP 404 with `Cache-Control: no-store`. A default no-store policy is set before routes, and successful public-content responses explicitly opt into caching. A final application-level 404 handler should also retain no-store.

The first four endpoints deliver portfolio content. Health is an operational endpoint used by the service-status page; it is not a substitute for authentication or a comprehensive security assessment.

### Reflection: Cache choices and trade-offs

- **Profile:** A 60-second freshness period reduces repeated transfers while allowing changes to appear relatively quickly. After expiry, must-revalidate prohibits using a stale response without successful validation.
- **Contact:** Contact information also uses a short 60-second period because outdated email or phone details can inconvenience visitors. Only contact data intended for public disclosure belongs in this response.
- **Skills:** Skills change relatively infrequently, so five minutes of freshness offers a reasonable performance benefit with limited impact from delayed updates.
- **Projects:** Five minutes of freshness reduces repeated loading. Supporting caches may use the response for another 60 seconds while revalidating in the background. The trade-off is that a visitor may briefly see older project information.
- **Health:** no-store avoids displaying a stored response as a current service check. The result still only reflects what the health handler actually tests.
- **404 responses:** no-store avoids retaining an obsolete error when the requested resource later becomes available.

These headers control browser and intermediary caching; they do not create an application database or memory cache. `no-cache` permits storage but requires validation, whereas `no-store` prohibits storage. The frontend need not cache API responses itself for HTTP caching to work.

The `name` query parameter creates distinct request URLs for the two developers. Caches must preserve that distinction. Public cache policies are inappropriate for private, authenticated, or cookie-dependent data. These responses contain only intentionally public portfolio information.

## Testing and Verification

The team reports that the application is working after completing the implementation and resolving frontend issues. The commands below provide reproducible checks; this README does not invent command output, certificate expiry dates, or automated test counts.

### Build and proxy configuration

```bash
npm run build
sudo nginx -t
```

Confirm successful completion, check the deployed page, and use browser DevTools to verify that JavaScript and CSS load without errors. Refresh nested frontend pages to check the SPA routing configuration.

### API and cache headers

If Nginx maps the API under `/cprg-312/api/`, run:

```bash
curl -i "https://huitaoz.top/cprg-312/api/profile?name=huitao"
curl -i "https://huitaoz.top/cprg-312/api/contact?name=cheska"
curl -i "https://huitaoz.top/cprg-312/api/skills?name=huitao"
curl -i "https://huitaoz.top/cprg-312/api/projects?name=cheska"
curl -i "https://huitaoz.top/cprg-312/api/health"
curl -i "https://huitaoz.top/cprg-312/api/profile?name=missing"
```

Check the expected JSON, status codes, and cache policies from the table. Verify that the two developer names select different data. The missing profile should return 404 and no-store. A 200 HTML response at an API URL indicates incorrect routing, not a successful API check.

Inspect security headers on both API responses and the frontend HTML. When investigating browser cache reuse, leave DevTools Disable cache unchecked. The status page uses a fresh request and should not be used to demonstrate public-content cache reuse.

### Local HTTPS

For the example local certificate, test the backend with:

```bash
curl --cacert certs/localhost-cert.pem -i https://localhost:3000/api/health
```

Use the actual local certificate path and backend route. Explicit certificate trust checks the certificate instead of bypassing validation. Compare direct backend results with public proxy results to distinguish backend errors from Nginx mapping problems.

### Certificate renewal

```bash
sudo certbot certificates
systemctl list-timers --all '*certbot*'
sudo certbot renew --dry-run
```

A certificate listing shows managed certificates, not proof of automatic renewal. A timer confirms scheduling, while a successful dry run verifies the renewal procedure under current conditions. Also verify certificate loading after renewal. Ordinary dry runs do not execute deploy hooks by default. These Certbot checks do not renew a separately generated OpenSSL backend certificate.

Retain actual build output, response-header captures, and renewal results as supporting evidence. A working page alone does not establish that all TLS and caching checks passed.

## Lessons Learned

1. **Separate frontend and backend routing.** Vue components must be registered with Vue Router. They cannot be used as Express middleware. Mixing them caused import and build failures.
2. **Install Vue plugins before mounting.** The router must be registered on the Vue application before mount; otherwise routing components can fail at runtime.
3. **Inspect copied source files.** Incomplete pasted CSS introduced invalid words and missing braces. Smaller replacements and direct inspection helped locate the errors.
4. **Keep deployment paths consistent.** Vite, Vue Router, frontend API URLs, and Nginx need compatible paths for deployment under `/cprg-312/`.
5. **Select data using the correct key.** Contact details are retrieved by portfolio name. An expression such as `portfolios[email, phone]` does not select by two fields; the same name-based lookup should serve profile and contact data.
6. **Verify configuration at the response level.** Successful deployment and dependency installation are not sufficient evidence of security headers, certificate validation, or cache behavior.

## References and Attribution

- Node.js HTTPS: https://nodejs.org/api/https.html
- Express documentation: https://expressjs.com/
- Helmet documentation: https://helmetjs.github.io/
- OpenSSL req: https://docs.openssl.org/master/man1/openssl-req/
- Certbot user guide: https://eff-certbot.readthedocs.io/en/stable/using.html
- Nginx proxy module: https://nginx.org/en/docs/http/ngx_http_proxy_module.html
- MDN Cache-Control: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
- Vue Router: https://router.vuejs.org/
- Vite deployment guide: https://vite.dev/guide/static-deploy

ChatGPT provided the frontend code and assisted with organizing the project documentation.

This documentation is based on the assignment brief, code shared during development, and deployment details reported by the team. Exact commands for the repository layout and production services are defined by the final source and workflow files.

## Submission

Submit the GitHub repository link through Brightspace. Include source code, package manifests and lockfiles, this README, and any supporting verification evidence. Keep private keys, credentials, environment secrets, and node_modules out of the repository.
