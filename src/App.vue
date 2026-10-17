<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { profiles, teamLinks } from './data/portfolios.js'
import './style.css'

// Read the browser GET query string. Only these two values are recognized.
function readName() {
  const params = new URLSearchParams(window.location.search)
  const value = params.get('name')?.trim().toLowerCase()
  return value && Object.hasOwn(profiles, value) ? value : null
}

const selectedName = ref(readName())
const apiProfile = ref(null)
const apiLoading = ref(false)
const apiNotice = ref('')
const projectDetail = ref(null)
const portfolio = computed(() => {
  const fallback = selectedName.value ? profiles[selectedName.value] : null
  return fallback ? { ...fallback, ...(apiProfile.value || {}) } : null
})
const apiPrefix = `${import.meta.env.BASE_URL}api`
async function getJson(endpoint) {
  const response = await fetch(`${apiPrefix}${endpoint}`)
  if (!response.ok) throw new Error(`API responded with ${response.status}`)
  return response.json()
}
async function refreshPortfolio(name) {
  apiProfile.value = null
  apiNotice.value = ''
  projectDetail.value = null
  if (!name) return
  apiLoading.value = true
  try {
    const suffix = `?name=${encodeURIComponent(name)}`
    const [profile, skills, projects, posts] = await Promise.all([
      getJson(`/profile${suffix}`), getJson(`/skills${suffix}`),
      getJson(`/projects${suffix}`), getJson(`/posts${suffix}`),
    ])
    // Preserve presentation-only fields (photos, initials, etc.) from src/data.
    apiProfile.value = { ...profile, focus: skills, projects, notes: posts }
  } catch (error) {
    apiNotice.value = `API unavailable (${error.message}). Showing local preview data.`
  } finally { apiLoading.value = false }
}
async function showProject(id) {
  if (!selectedName.value) return
  projectDetail.value = null
  try { projectDetail.value = await getJson(`/projects/${encodeURIComponent(id)}?name=${encodeURIComponent(selectedName.value)}`) }
  catch (error) { apiNotice.value = `Project detail unavailable (${error.message}).` }
}
const currentYear = new Date().getFullYear()
const mobileMenuOpen = ref(false)
const activeCategory = ref('All')
const projectCategories = computed(() => ['All', ...new Set(portfolio.value?.projects.map(project => project.type) ?? [])])
const visibleProjects = computed(() => portfolio.value?.projects.filter(project => activeCategory.value === 'All' || project.type === activeCategory.value) ?? [])

function setPerson(name) {
  const url = new URL(window.location.href)
  if (name && Object.hasOwn(profiles, name)) url.searchParams.set('name', name)
  else url.searchParams.delete('name')
  url.hash = ''
  window.history.pushState({}, '', url)
  selectedName.value = readName()
  mobileMenuOpen.value = false
  window.scrollTo({ top: 0, behavior: 'instant' })
}
function syncBrowserHistory() { selectedName.value = readName() }
watch(selectedName, (name) => { activeCategory.value = 'All'; mobileMenuOpen.value = false; refreshPortfolio(name) }, { immediate: true })
onMounted(() => window.addEventListener('popstate', syncBrowserHistory))
onUnmounted(() => window.removeEventListener('popstate', syncBrowserHistory))
</script>

<template>
  <div class="site-shell" :class="{ 'person-view': portfolio }">
    <header class="site-header">
      <div class="container nav-row">
        <a class="brand" :href="portfolio ? '?name=' + portfolio.slug : './'" @click.prevent="setPerson(portfolio?.slug ?? null)" aria-label="Portfolio home"><span class="brand-symbol">&lt;/&gt;</span> studi<span class="brand-accent">o.</span></a>
        <span class="nav-caption">WEB DESIGN &amp; DEVELOPMENT</span>
        <button class="mobile-toggle" type="button" :aria-expanded="mobileMenuOpen" aria-controls="site-nav" @click="mobileMenuOpen = !mobileMenuOpen">{{ mobileMenuOpen ? 'Close ✕' : 'Menu ☰' }}</button>
        <nav id="site-nav" class="site-nav" :class="{ open: mobileMenuOpen }" aria-label="Main navigation">
          <template v-if="portfolio">
            <a href="#about" @click="mobileMenuOpen = false">About</a>
            <a href="#work" @click="mobileMenuOpen = false">Work</a>
            <a href="#notes" @click="mobileMenuOpen = false">Notes</a>
            <a href="#contact" @click="mobileMenuOpen = false">Contact</a>
            <button class="switch-link" type="button" @click="setPerson(null)">Both portfolios ↗</button>
          </template>
          <template v-else>
            <button type="button" @click="setPerson('huitao')">Huitao</button>
            <button type="button" @click="setPerson('cheska')">Cheska</button>
            <a href="https://github.com/zhanght825/CPRG-312-A" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </template>
        </nav>
      </div>
    </header>

    <main v-if="!portfolio" class="landing">
      <section class="container landing-intro">
        <div class="eyebrow"><span class="live-dot"></span> CPRG-312 · TEAM PROJECT · 2026</div>
        <h1>Two perspectives.<br><em>One creative journey.</em></h1>
        <p>A shared Web Design &amp; Development project. Choose a name to view that person's individual portfolio, projects and learning notes.</p>
      </section>
      <section class="container team-selection" aria-label="Choose a portfolio">
        <article v-for="(member, i) in teamLinks" :key="member.slug" class="choose-card">
          <button type="button" class="choose-card-button" @click="setPerson(member.slug)" :aria-label="'Open ' + member.name + ' portfolio'">
            <div class="choose-image"><img :src="member.portrait" :alt="member.portraitAlt" :fetchpriority="i === 0 ? 'high' : 'auto'"/><span class="choose-index">0{{ i+1 }}</span></div>
            <div class="choose-info"><span class="micro-heading">PERSONAL PORTFOLIO</span><h2>{{ member.name }}</h2><p>{{ member.description }}</p><span class="choose-action">Explore portfolio <b aria-hidden="true">↗</b></span></div>
          </button>
        </article>
      </section>
      <div class="container sample-note">Portraits are illustrative stock photography, not photos of the named students.</div>
    </main>

    <main v-else :key="portfolio.slug">
      <div v-if="apiLoading" class="container api-status" role="status">Loading public portfolio API…</div>
      <div v-else-if="apiNotice" class="container api-status" role="status">{{ apiNotice }}</div>
      <section class="hero container" id="home">
        <div class="hero-copy">
          <div class="eyebrow"><span class="live-dot"></span> {{ portfolio.label.toUpperCase() }} · 2026</div>
          <div class="hero-overline">HELLO, I'M {{ portfolio.name.toUpperCase() }}</div>
          <h1>{{ portfolio.headline[0] }}<br><em>{{ portfolio.headline[1] }}</em></h1>
          <p>{{ portfolio.intro }}</p>
          <div class="hero-ctas"><a class="primary-btn" href="#work">See my work <span>↗</span></a><a class="plain-btn" href="#about">More about me ↓</a></div>
          <div class="hero-bottom"><span>WEB DESIGN &amp; DEVELOPMENT</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
        <div class="hero-portrait"><img :src="portfolio.portrait" :alt="portfolio.portraitAlt" fetchpriority="high"/><div class="portrait-label"><span class="portrait-initials">{{ portfolio.initials }}</span><span>{{ portfolio.name }}<small>Student portfolio · Placeholder portrait</small></span></div></div>
      </section>

      <section id="about" class="section about-section"><div class="container about-grid"><div><div class="section-kicker">01 / ABOUT</div><h2>Curious by design.<br><em>Driven to create.</em></h2></div><div><p class="body-lead">{{ portfolio.bio }}</p><div class="subheading">FOCUS AREAS</div><div class="skill-chips"><span v-for="skill in portfolio.focus" :key="skill">{{ skill }}</span></div><p class="muted-footnote">Individual skills and accomplishments can be updated as coursework and portfolio work are completed.</p></div></div></section>

      <section id="work" class="section work-section"><div class="container"><div class="section-kicker">02 / SELECTED WORK</div><div class="section-row"><div><h2>Selected projects<span class="dot">.</span></h2><p>Work and concepts from my web design &amp; development journey.</p></div><div class="filters" role="group" aria-label="Filter projects"><button v-for="category in projectCategories" :key="category" type="button" :aria-pressed="activeCategory === category" :class="{ active: activeCategory === category }" @click="activeCategory = category">{{ category }}</button></div></div><div class="project-grid"><article v-for="project in visibleProjects" :key="project.id" class="project-card"><div class="project-image"><img :src="project.image" :alt="project.title + ' illustrative image'" loading="lazy"><span class="project-num">{{ project.index }}</span></div><div class="project-content"><button type="button" class="detail-button" @click="showProject(project.id)">View API project details ↗</button><div class="project-type">{{ project.type }} <span v-if="project.sample">· SAMPLE</span></div><div class="project-heading"><h3>{{ project.title }}</h3><a v-if="project.href" :href="project.href" target="_blank" rel="noopener noreferrer" :aria-label="'Visit ' + project.title">↗</a></div><p>{{ project.description }}</p><div class="tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div></div></article></div><div v-if="projectDetail" class="project-detail" role="status"><button type="button" @click="projectDetail = null">Close ×</button><h3>{{ projectDetail.title }}</h3><p>{{ projectDetail.description }}</p><p>Data loaded from <code>GET /api/projects/:id</code></p></div><p class="muted-footnote">Projects marked SAMPLE are examples, not claims of completed work.</p></div></section>

      <section class="quote-band"><div class="container"><span class="sparkle">✳</span><p>Design with purpose.<br><em>Develop with care.</em></p><span class="tiny-upper">BUILDING BETTER EXPERIENCES FOR THE WEB</span></div></section>

      <section id="notes" class="section notes-section"><div class="container"><div class="section-kicker">03 / JOURNAL</div><h2>Notes from the process<span class="dot">.</span></h2><div class="note-list"><article class="note-row" v-for="(note, i) in portfolio.notes" :key="note.title"><span class="note-counter">0{{i+1}}</span><div><span class="note-type">{{ note.tag }} · PLANNED ARTICLE</span><h3>{{ note.title }}</h3><p>{{ note.description }}</p></div><span class="note-arrow" aria-hidden="true">↗</span></article></div></div></section>

      <section id="contact" class="contact-section"><div class="container contact-content"><div class="section-kicker">04 / CONTACT</div><h2>Let's create<br><em>something meaningful.</em></h2><p>Interested in the project? Explore our shared course repository and follow its progress.</p><a class="light-btn" href="https://github.com/zhanght825/CPRG-312-A" target="_blank" rel="noopener noreferrer">View the project on GitHub ↗</a><p class="contact-small">No contact form or private data collection has been implemented yet.</p></div></section>
    </main>

    <footer class="footer"><div class="container footer-flex"><span><b>&lt;/&gt;</b> studio. — Huitao Zhang &amp; Francheska Agaton</span><span>Web Design &amp; Development · {{ currentYear }}</span><button type="button" @click="setPerson(null)">Choose a portfolio ↑</button></div><p class="container image-credit">Illustrative photography: <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash</a>. Stock portraits do not represent the named students.</p></footer>
  </div>
</template>
