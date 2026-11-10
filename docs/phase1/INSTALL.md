# Install Phase 1 into your existing CPRG-312-A repository

**Do not unzip over your entire repository.** This package contains only the files to add/replace.

## 1. Copy from this package

- Copy `src/App.vue`, `src/style.css`, and `src/data/portfolios.js` over your existing files.
- Copy the **entire** `server/` directory into your repository root.
- Copy `README.md`, `nginx-location-example.conf`, and this `INSTALL.md` into the repo root.
- Append `.gitignore-additions.txt` contents to your existing root `.gitignore`.
- **Preserve** existing root `package.json`, `package-lock.json`, `.github/workflows/deploy.yml`, and your Git remotes.

## 2. Adjust your existing Vite config (typically `vite.config.js`)

Keep all existing plugins and aliases. Add `base` and `server.proxy` under the object passed to `defineConfig`:

```js
base: '/cprg-312/',
server: {
  proxy: {
    '/cprg-312/api': {
      target: 'https://127.0.0.1:3000',
      changeOrigin: true,
      secure: false, // ONLY because local Express uses a self-signed test cert
      rewrite: path => path.replace(/^\/cprg-312/, ''),
    },
  },
},
```

`secure: false` is **only for Vite's local development proxy**; never disable verification for public internet connections. If you already have `base` or `server` keys, merge instead of duplicating.

Check that `src/main.js` does not import old `src/assets/main.css` if it conflicts with the included `src/style.css` (which `App.vue` imports).

## 3. Install backend and create local certificate

```bash
cd server
npm install
bash generate-local-cert.sh
npm test
npm start
```

Open another terminal:

```bash
curl -k -i 'https://localhost:3000/api/profile?name=huitao'
```

If running the backend on Vultr instead of your own computer, `localhost` refers to Vultr. Use VS Code Remote-SSH port forwarding or `ssh -L 3000:127.0.0.1:3000 ...` to browse from your laptop.

## 4. Run frontend locally

From the repository root (new terminal):

```bash
npm ci
npm run dev
```

Browse the development URL printed by Vite, including its base path, for example:

- `http://localhost:5173/cprg-312/`
- `http://localhost:5173/cprg-312/?name=huitao`
- `http://localhost:5173/cprg-312/?name=cheska`

Frontend fetches the four collection routes and fetches `/api/projects/:id` when you click **View API project details**. If the API is down, it clearly states that fallback preview data is displayed.

## 5. Production release

```bash
npm run build
git add src server README.md INSTALL.md nginx-location-example.conf .gitignore
git commit -m 'Implement Phase 1 HTTPS API Helmet and caching'
git push origin master
```

**Your existing GitHub Actions deploys the Vue frontend only.** For production API deployment follow README section 7. Don't assume API has deployed just because the workflow turned green.
