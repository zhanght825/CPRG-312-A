# CPRG-312 Phase 2 · Portfolio Authentication & Authorization

A Vue 3 / Express / MongoDB Atlas portfolio with local and Google login, JWT access tokens, rotating refresh tokens, CSRF protection, protected routes and per-user portfolio ownership.

## What stays from Phase 1

The original visual language, headings, navigation and `/profile`, `/skills`, `/projects`, `/health`, `/contact` paths remain. The original hard-coded skills/project content is in `server/scripts/seed-portfolio.js` so it can be imported for an existing registered user. Each user must initialize their own portfolio: no other user's data is visible through the API.

## Requirements

Node.js matching root `package.json` engines, npm, MongoDB Atlas database access, existing Nginx HTTPS site, Google Cloud OAuth Web client for SSO.

## Install locally (Windows PowerShell or Ubuntu)

At project root:

```bash
npm install
cd server
npm install
cp .env.example .env
```

On Windows PowerShell use `Copy-Item .env.example .env` instead of `cp` if preferred.

Edit `server/.env` with your own `DB_CONNECTION`, `SESSION_SECRET`, `JWT_SECRET`. Generate independent secrets with `openssl rand -hex 32`. Never commit secrets. For local testing set `NODE_ENV=development`, `PORT=3002`.

Two terminals:

```bash
cd server
npm run dev
```

```bash
npm run dev
```

Frontend: `http://localhost:5173/cprg-312/`. API: `http://127.0.0.1:3002/api/health`. Vite proxies `/api` to the API. For Google OAuth on the production domain use a deployed HTTPS callback and update `GOOGLE_CALLBACK_URL` + the **identical** Authorized redirect URI in Google Cloud.

## Existing Phase 1 content

Create/login to an account, then once only:

```bash
cd server
node scripts/seed-portfolio.js your-email@example.com
```

This imports the previous self-introduction, skill names, Phase 1 project description into that account only, and never overwrites existing entries. For other accounts, use their own personal content. The former Phase 1 example content for another team member must be imported by that person's own account, not shared via an admin view.

To promote an existing user (local administrative action, do not expose as API):

```bash
node scripts/make-admin.js your-email@example.com
```

## Authentication

- Local registration with Argon2id password hashing.
- Google OAuth 2.0 using Passport (only enabled when all Google environment fields are provided).
- HTTP-only `accessToken` cookie (JWT, 15 minutes), HTTP-only `refreshToken` cookie (random token, 7 days, SHA-256 hash stored in MongoDB). Rotation on refresh and revocation on logout.
- MongoDB-backed Session for Google state and CSRF. Session ID regenerated on sign-in.
- CSRF token required in `x-csrf-token` for every unsafe `/api` request; obtained with `GET /api/auth/csrf` (session bound).
- IP rate limit and temporary account lock after failed local logins.
- Current DB role checked by `ensureAdmin` (not blindly trusting token role).

## Permissions

`GET /api/profile` and `GET /api/dashboard` require authentication. `GET /api/admin` requires `admin`. All `/api/portfolio/*` and `/api/contact/*` require login. Portfolio, Skills, Projects and private notes filter by `owner: req.user._id` for reads and modifications. Users cannot supply `owner`. Admin also cannot view others' portfolios through these routes.

## API summary

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/google`, `GET /api/auth/google/callback`
- `GET /api/auth/csrf`, `POST /api/auth/refresh`, `POST /api/auth/logout`
- `GET /api/profile`, `GET /api/dashboard`, `GET /api/admin`
- `GET, PUT /api/portfolio/profile`
- `GET, POST /api/portfolio/skills`, `PUT, DELETE /api/portfolio/skills/:id`
- `GET, POST /api/portfolio/projects`, `PUT, DELETE /api/portfolio/projects/:id`
- `GET, POST /api/contact/messages` (private notes, not a public contact form)
- `GET /api/health`

## Production deployment (Vultr)

1. Back up `/var/www/html/cprg-312` and the current API systemd service configuration. **Do not overwrite the working Phase 1 service before testing**.
2. Copy `server/` to `/opt/cprg-312-phase2/server/`; create its `.env`; run `npm install` inside that directory.
3. Set `NODE_ENV=production`, `APP_BASE_PATH=/cprg-312`, `PORT=3002`, Atlas secrets and `GOOGLE_CALLBACK_URL=https://huitaoz.top/cprg-312/api/auth/google/callback`.
4. Confirm `node` executable location with `which node`; adjust `deploy/cprg312-phase2.service` `ExecStart` if needed. Use systemd service, or start directly for smoke testing.
5. Merge `deploy/nginx-location.conf` carefully into your existing HTTPS server block; pay attention to prior `location` clauses that may take precedence. Run `sudo nginx -t` then reload.
6. Build Vue with `npm run build`, back up old public directory, then copy `dist/` contents to `/var/www/html/cprg-312/`.
7. Confirm HTTPS cookies are `Secure`, `HttpOnly`, `SameSite=Lax`, and session-cookie and refresh-cookie paths match `/cprg-312/`.
8. Test registration, local login, Google login, unauthorized/forbidden, refresh, logout and attempts to access another user's document IDs.

**Important:** `GOOGLE_CLIENT_SECRET`, DB password, JWT secret and Session secret are NEVER included. `server/.env` and the original ZIP's `server/certs/localhost-key.pem` have been excluded from this delivery. Rotate exposed secrets if they were committed or shared earlier.

## Phase 2 reflection and demonstration

Review the original assignment sections A–G. Record a short demonstration of registration, local login, Google SSO, ordinary vs admin access, private profile editing, refresh and logout. Explain how you tested CSRF (403 without the token), JWT expiry, role restrictions and cross-user ID protection. Document actual observed results rather than assuming the features work on your server.

## Limitations

- Password reset via verified email is not configured; it needs a real email provider and token-expiry flow. This is a remaining assignment consideration, not a working feature.
- The Vue health view remains close to the Phase 1 implementation.
- Contact page now stores private notes; a public contact form requires a separate public-facing design with recipient and spam controls.
- Existing MongoDB documents without an `owner` field need deliberate migration; do not automatically assign them to the first account.
- This is a course project. A production security review and integration test on your real infrastructure are still required.
