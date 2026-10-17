# CPRG-312-A — Individual Portfolio Frontend (Vue 3)

This package is a **drop-in replacement for the existing Vue 3 + Vite frontend**, not a new full project. It uses a GET query parameter named `name` to choose between two separate portfolios that share reusable components.

## URLs

- Selector / entry page: `https://huitaoz.top/cprg-312/`
- Huitao Zhang: `https://huitaoz.top/cprg-312/?name=huitao`
- Francheska Agaton: `https://huitaoz.top/cprg-312/?name=cheska`

Only `huitao` and `cheska` are recognized. An absent or invalid `name` shows the selector. Changing the URL using browser Back/Forward also switches the visible page. Portfolio links are created in the browser without requiring server-side rewrites.

## Install into existing project

1. On your computer open the **existing** `CPRG-312-A` folder in VS Code (must contain `package.json`).
2. Back up `src/App.vue` and any existing custom stylesheet.
3. Copy supplied `src/App.vue` and `src/style.css` into your project's `src/` folder (replace where necessary).
4. Copy `src/data/portfolios.js` into your project's `src/data/` folder (create that directory if it does not exist).
5. Open `src/main.js` and **remove** its default `import './assets/main.css'` if present, to avoid starter styles conflicting. The supplied `App.vue` imports `./style.css` itself.
6. Do **not** delete `package.json`, `package-lock.json`, `.github/workflows/deploy.yml`, `vite.config.js` or other existing project files.
7. Run `npm ci`, `npm run dev` and test the three URLs on `http://localhost:5173/` (use the exact local URL Vite prints).
8. Run `npm run build`. If successful, commit and push to `master`; GitHub Actions builds and deploys `dist/` to `/var/www/html/cprg-312/`.

```bash
npm ci
npm run dev
# in another terminal, after checking locally:
npm run build
git add src/App.vue src/style.css src/data/portfolios.js src/main.js
git commit -m "Create separate Huitao and Cheska portfolios"
git push origin master
```

**Vite deployment path:** If the website is served from `/cprg-312/`, `vite.config.js` needs `base: '/cprg-312/'`. Keep the existing working GitHub Actions workflow; it already uploads only `dist/`.

## Edit the content later

All public content is configured in `src/data/portfolios.js` under `profiles.huitao` and `profiles.cheska`:
- `name`, `intro`, `bio`, `headline`, `portrait` and `focus` control each person's separate view.
- `projects` and `notes` are completely separate arrays for each person.
- Example projects and planned articles are clearly marked. Replace samples with completed work.

For the later Express assignment, the query names can also be mapped to routes such as `GET /api/profile?name=huitao` or `GET /api/profile?name=cheska`, while keeping this frontend design.

## Photo source and accuracy

Stock illustrations are linked from Unsplash. The male and female photos **are not photos of Huitao Zhang or Francheska Agaton**. Use your own photos with permission before implying otherwise. Photos are public visual assets, not user profile verification.

## Scope

This package implements the frontend only. It does NOT implement Express, HTTPS for Express, Helmet, API cache policies, backend authentication, or a functional contact form. These are separate requirements in CPRG-312 Phase 1 and later phases. Never put certificates, passwords, API secrets or personal private data into `src/data/portfolios.js`.
