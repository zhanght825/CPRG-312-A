<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const expanded = ref(false)
const stack = ['Vue.js', 'Express', 'Nginx', 'Certbot']
const layers = [
  { name: 'Frontend', text: 'Responsive portfolio pages built with Vue and Vue Router.' },
  { name: 'Backend', text: 'Express APIs focused on HTTPS, security headers, and caching.' },
  { name: 'Deployment', text: 'Vultr hosting with Nginx and GitHub Actions automation.' },
]
</script>

<template>
  <div class="projects">
    <header>
      <p class="eyebrow">SELECTED WORK / 001</p>
      <h1>Ideas into<br /><span>working software.</span></h1>
      <p class="intro">Exploring the connection between interfaces, APIs, and infrastructure.</p>
    </header>

    <article class="featured">
      <div class="art" aria-hidden="true">
        <span class="art-label">DEVELOPER PORTFOLIO</span>
        <strong>&lt;ht /&gt;</strong>
        <span>DESIGN · DEVELOP · DEPLOY</span>
      </div>
      <div class="content">
        <p class="eyebrow">CPRG 312 · PHASE 1</p>
        <h2>Developer Portfolio</h2>
        <p>A personal space to share my work and explore secure web development.</p>
        <ul class="tags">
          <li v-for="item in stack" :key="item">{{ item }}</li>
        </ul>
        <button
          type="button"
          :aria-expanded="expanded"
          aria-controls="details"
          @click="expanded = !expanded"
        >
          {{ expanded ? 'Hide details −' : 'Project details +' }}
        </button>
        <div v-show="expanded" id="details" class="details">
          <p>
            Hosted on Vultr with Ubuntu 24. Nginx forwards requests to Express, while Certbot
            manages certificates.
          </p>
          <p>
            GitHub Actions deploys frontend and backend updates. Phase 1 focuses on HTTPS, Helmet,
            and cache policies.
          </p>
        </div>
      </div>
    </article>

    <section aria-labelledby="layers-heading">
      <p class="eyebrow">THE IMPLEMENTATION</p>
      <h2 id="layers-heading">Three layers. One experience.</h2>
      <div class="grid">
        <article v-for="(layer, index) in layers" :key="layer.name" class="card">
          <span class="number">0{{ index + 1 }}</span>
          <h3>{{ layer.name }}</h3>
          <p>{{ layer.text }}</p>
        </article>
      </div>
    </section>

    <footer>
      <p>Always learning. Always building.</p>
      <RouterLink to="/skills">Explore my toolkit →</RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.projects {
  display: grid;
  gap: 48px;
  color: #182238;
}
.eyebrow {
  color: #6547ce;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
}
h1 {
  margin: 18px 0;
  font-size: clamp(36px, 5vw, 60px);
  line-height: 1.1;
  letter-spacing: -0.05em;
}
h1 span {
  color: #6547ce;
}
h2 {
  margin: 12px 0 20px;
  font-size: 28px;
  letter-spacing: -0.035em;
  line-height: 1.25;
}
h3 {
  margin: 20px 0 10px;
  font-size: 19px;
}
p {
  color: #606b80;
  line-height: 1.8;
}
.intro {
  max-width: 580px;
  font-size: 16px;
}
.featured {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  border: 1px solid #e2e6ef;
  border-radius: 18px;
  background: white;
}
.art {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  color: #6547ce;
  background: linear-gradient(135deg, #e8e0fa, #f0f3fc);
}
.art strong {
  align-self: center;
  padding-block: 40px;
  font: 700 clamp(42px, 6vw, 76px) monospace;
  letter-spacing: -0.08em;
}
.art > span {
  font-size: 10px;
  letter-spacing: 0.12em;
}
.content {
  min-width: 0;
  padding: 32px;
}
.content > p {
  font-size: 14px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0;
  padding: 0;
  list-style: none;
}
.tags li {
  padding: 5px 9px;
  border-radius: 6px;
  color: #6547ce;
  background: #efebfc;
  font-size: 11px;
}
button {
  min-height: 44px;
  padding: 12px 18px;
  border: 0;
  border-radius: 9px;
  color: white;
  background: #6547ce;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
button:hover {
  background: #5236b3;
}
.details {
  margin-top: 22px;
  padding-top: 10px;
  border-top: 1px solid #e2e6ef;
  font-size: 13px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.card {
  padding: 26px;
  border: 1px solid #e2e6ef;
  border-radius: 14px;
  background: white;
}
.number {
  color: #6547ce;
  font: 700 13px monospace;
}
.card p {
  margin: 0;
  font-size: 13px;
}
footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e2e6ef;
  font-size: 13px;
}
footer a {
  color: #6547ce;
  font-weight: 600;
  text-underline-offset: 4px;
}
button:focus-visible,
a:focus-visible {
  outline: 3px solid #6547ce;
  outline-offset: 4px;
}
@media (max-width: 750px) {
  .featured,
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .art {
    min-height: 240px;
  }
  .content {
    padding: 24px;
  }
}
</style>
