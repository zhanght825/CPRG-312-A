<script setup>
import { RouterLink, RouterView } from 'vue-router'

const navigation = [
  { label: 'About', path: '/profile' },
  { label: 'Skills', path: '/skills' },
  { label: 'Projects', path: '/projects' },
  { label: 'Status', path: '/health' },
  { label: 'Contact', path: '/contact' },
]

const year = new Date().getFullYear()
</script>

<template>
  <div class="portfolio">
    <a class="skip-link" href="#main-content"> Skip to content </a>

    <header class="site-header">
      <div class="header-inner">
        <RouterLink to="/profile" class="brand" aria-label="HT home">
          <span class="brand-mark" aria-hidden="true">ht.</span>

          <span class="brand-copy">
            <strong>Developer Portfolio</strong>
            <span>Learn. Build. Improve.</span>
          </span>
        </RouterLink>

        <nav class="navigation" aria-label="Main navigation">
          <RouterLink v-for="item in navigation" :key="item.path" :to="item.path" class="nav-link">
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main id="main-content" class="main-content" tabindex="-1">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-mark" aria-hidden="true">ht.</span>
          <p>Thoughtful code. Continuous learning.</p>
        </div>

        <div class="footer-meta">
          <span>© {{ year }} Developer Portfolio</span>
          <span class="footer-divider" aria-hidden="true">/</span>
          <span>CPRG 312</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.portfolio {
  --color-background: #f6f7fb;
  --color-surface: #ffffff;
  --color-text: #182238;
  --color-muted: #606b80;
  --color-accent: #6547ce;
  --color-accent-soft: #efebfc;
  --color-border: #e2e6ef;

  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  color: var(--color-text);
  background:
    radial-gradient(ellipse at 85% 0%, rgba(101, 71, 206, 0.07), transparent 42%),
    var(--color-background);

  font-family: Inter, 'Segoe UI', 'Microsoft YaHei', sans-serif;

  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
}

:global(#app) {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

.skip-link {
  position: fixed;
  top: 12px;
  left: 16px;
  z-index: 100;
  padding: 10px 18px;
  border-radius: 8px;
  color: #ffffff;
  background: var(--color-text);
  transform: translateY(-160%);
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.header-inner {
  width: min(1120px, calc(100% - 48px));
  min-height: 96px;
  margin-inline: auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: var(--color-text);
  text-decoration: none;
}

.brand-mark {
  width: 46px;
  height: 46px;
  flex-shrink: 0;

  display: grid;
  place-items: center;

  border-radius: 14px;
  color: #ffffff;
  background: var(--color-text);

  font-size: 25px;
  font-weight: 800;
  letter-spacing: -2px;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-copy strong {
  font-size: 14px;
  font-weight: 700;
}

.brand-copy > span {
  color: var(--color-muted);
  font-size: 12px;
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.nav-link {
  padding: 9px 16px;
  border-radius: 9px;

  color: var(--color-muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.nav-link:hover {
  color: var(--color-accent);
  background: #f6f3ff;
}

.nav-link.router-link-active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.brand:focus-visible,
.nav-link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 4px;
}

.main-content {
  flex: 1;
  width: min(1120px, calc(100% - 48px));
  margin-inline: auto;
  padding-block: 64px 80px;
  overflow-wrap: anywhere;
}

.site-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.footer-inner {
  width: min(1120px, calc(100% - 48px));
  min-height: 100px;
  margin-inline: auto;
  padding-block: 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer-mark {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -2px;
}

.footer-brand p {
  margin: 0;
  color: var(--color-muted);
  font-size: 13px;
}

.footer-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  color: var(--color-muted);
  font-size: 12px;
}

.footer-divider {
  color: #afb6c4;
}

@media (max-width: 700px) {
  .header-inner {
    min-height: auto;
    padding-block: 20px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .navigation {
    width: 100%;
  }

  .nav-link {
    flex: 1;
    padding-inline: 10px;
    text-align: center;
  }

  .main-content {
    padding-block: 36px 52px;
  }

  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-link {
    transition: none;
  }
}
</style>
