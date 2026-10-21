<script setup>
import { computed, ref } from 'vue'
const selected = ref('All')
const categories = ['All', 'Frontend', 'Backend', 'Deployment']
const skills = [
  { name: 'Vue.js', group: 'Frontend', text: 'Components, reactive state, and page navigation.' },
  { name: 'HTML & CSS', group: 'Frontend', text: 'Accessible structure and responsive layouts.' },
  { name: 'JavaScript', group: 'Frontend', text: 'Interactive behavior and API requests.' },
  { name: 'Express', group: 'Backend', text: 'Routing, middleware, and JSON APIs.' },
  { name: 'Web Security', group: 'Backend', text: 'HTTPS, Helmet, and security headers.' },
  { name: 'HTTP Caching', group: 'Backend', text: 'Cache-Control, ETags, and revalidation.' },
  { name: 'Nginx', group: 'Deployment', text: 'Reverse proxying and TLS configuration.' },
  {
    name: 'GitHub Actions',
    group: 'Deployment',
    text: 'Automated builds and deployment workflows.',
  },
  { name: 'Ubuntu & Vultr', group: 'Deployment', text: 'Cloud hosting and server administration.' },
]
const filtered = computed(() =>
  skills.filter((s) => selected.value === 'All' || s.group === selected.value),
)
</script>

<template>
  <div class="skills">
    <header>
      <p class="label">MY TOOLKIT</p>
      <h1>The tools behind<br /><span>the things I build.</span></h1>
      <p class="intro">Technologies I am exploring through hands-on projects.</p>
    </header>
    <div class="filters" role="group" aria-label="Filter skills">
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        :aria-pressed="selected === item"
        @click="selected = item"
      >
        {{ item }}
      </button>
    </div>
    <p class="count" role="status">{{ filtered.length }} skills shown</p>
    <div class="grid">
      <article v-for="skill in filtered" :key="skill.name">
        <span class="category">{{ skill.group }}</span>
        <h2>{{ skill.name }}</h2>
        <p>{{ skill.text }}</p>
      </article>
    </div>
    <footer>Built through practice. Improved through curiosity.</footer>
  </div>
</template>

<style scoped>
.skills {
  color: #182238;
}
.label {
  color: #6547ce;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
}
h1 {
  margin: 20px 0;
  font-size: clamp(36px, 4.8vw, 58px);
  line-height: 1.12;
  letter-spacing: -0.05em;
}
h1 span {
  color: #6547ce;
}
.intro {
  color: #606b80;
  line-height: 1.8;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
}
button {
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid #e2e6ef;
  border-radius: 9px;
  color: #606b80;
  background: white;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
button:hover {
  border-color: #6547ce;
}
button[aria-pressed='true'] {
  color: white;
  background: #6547ce;
  border-color: #6547ce;
}
button:focus-visible {
  outline: 3px solid #6547ce;
  outline-offset: 4px;
}
.count {
  margin: 18px 0;
  color: #606b80;
  font-size: 12px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
article {
  padding: 26px;
  border: 1px solid #e2e6ef;
  border-radius: 15px;
  background: white;
}
.category {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 5px;
  color: #6547ce;
  background: #efebfc;
  font-size: 10px;
  font-weight: 650;
}
h2 {
  margin: 22px 0 12px;
  font-size: 20px;
  letter-spacing: -0.03em;
}
article p {
  margin: 0;
  color: #606b80;
  font-size: 13px;
  line-height: 1.8;
}
footer {
  margin-top: 36px;
  padding-top: 22px;
  border-top: 1px solid #e2e6ef;
  color: #606b80;
  font-size: 13px;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 550px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
