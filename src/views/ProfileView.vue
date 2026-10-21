<script setup>
import { RouterLink } from 'vue-router'
const stack = ['Vue.js', 'Express', 'Nginx', 'GitHub Actions']
</script>

<template>
  <div class="profile">
    <section class="hero">
      <div>
        <p class="label">DEVELOPER PORTFOLIO</p>
        <h1>Hi, I'm Huitao.<br /><span>I build for the web.</span></h1>
        <p class="intro">
          Exploring thoughtful interfaces, reliable APIs, and secure web applications.
        </p>
        <RouterLink class="button" to="/projects">Explore projects ↗</RouterLink>
        <div class="tags">
          <span v-for="item in stack" :key="item">{{ item }}</span>
        </div>
      </div>
      <aside class="card">
        <div class="avatar">HT</div>
        <h2>Developer & Learner</h2>
        <p>Turning new ideas into practical projects, one step at a time.</p>
        <hr />
        <small>CURRENT FOCUS</small>
        <h3>Secure web development</h3>
        <a href="https://huitaoz.top">huitaoz.top ↗</a>
      </aside>
    </section>
    <section class="about">
      <p class="label">ABOUT THIS PROJECT</p>
      <h2>From interface to infrastructure.</h2>
      <p>
        This portfolio connects a Vue frontend with an Express backend, hosted on Vultr with Nginx
        and automated deployment through GitHub Actions.
      </p>
      <RouterLink to="/skills">Explore my toolkit →</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.profile {
  color: #182238;
}
.hero {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: center;
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
h2 {
  font-size: 25px;
  letter-spacing: -0.03em;
}
p {
  color: #606b80;
  line-height: 1.85;
}
.intro {
  max-width: 500px;
  margin-bottom: 26px;
}
a {
  color: #6547ce;
  text-underline-offset: 4px;
}
.button {
  display: inline-block;
  padding: 13px 20px;
  border-radius: 9px;
  background: #6547ce;
  color: white;
  text-decoration: none;
}
.button:hover {
  background: #5236b3;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 26px;
}
.tags span {
  padding: 5px 10px;
  border: 1px solid #e2e6ef;
  border-radius: 6px;
  font-size: 11px;
}
.card {
  padding: 30px;
  border: 1px solid #e2e6ef;
  border-radius: 18px;
  background: white;
  box-shadow: 0 16px 40px #18223808;
}
.avatar {
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 22px;
  color: #6547ce;
  background: #efebfc;
  font-size: 27px;
  font-weight: 750;
}
.card p {
  font-size: 14px;
}
hr {
  margin: 24px 0;
  border: 0;
  border-top: 1px solid #e2e6ef;
}
small {
  color: #606b80;
  font-size: 10px;
  letter-spacing: 0.1em;
}
h3 {
  margin: 10px 0 18px;
  font-size: 17px;
}
.about {
  margin-top: 48px;
  padding: 30px;
  border: 1px solid #ded7f2;
  border-radius: 16px;
  background: #efebfc;
}
.about p {
  max-width: 760px;
}
a:focus-visible {
  outline: 3px solid #6547ce;
  outline-offset: 4px;
}
@media (max-width: 750px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .card,
  .about {
    padding: 24px;
  }
}
</style>
