<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api, json } from '../lib/api'
import { session } from '../lib/session'
const form = reactive({ name: '', title: '', bio: '', location: '', website: '', github: '', linkedin: '' })
const editing = ref(false)
const error = ref('')
const notice = ref('')
const loading = ref(true)
async function load() {
  try { const data = await api('/portfolio/profile'); Object.assign(form, { name: session.user?.username || '', title: '', bio: '', location: '', website: '', github: '', linkedin: '' }, data) }
  catch (err) { error.value = err.message }
  finally { loading.value = false }
}
async function save() {
  error.value = ''; notice.value = ''
  try { await json('PUT', '/portfolio/profile', { ...form }); editing.value = false; notice.value = 'Profile saved.' }
  catch (err) { error.value = err.message }
}
onMounted(load)
</script>
<template>
  <div class="stack">
    <section class="panel hero">
      <div><p class="eyebrow">DEVELOPER PORTFOLIO</p><h1 class="page-title">Hi, I'm {{ form.name || session.user?.username }}.<br /><span>{{ form.title || 'I build for the web.' }}</span></h1>
        <p class="muted">{{ form.bio || 'Exploring thoughtful interfaces, reliable APIs, and secure web applications.' }}</p>
        <p v-if="form.location" class="muted">{{ form.location }}</p>
        <div class="inline-actions"><a v-if="form.website" :href="form.website" target="_blank" rel="noopener noreferrer">Website ↗</a><a v-if="form.github" :href="form.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a v-if="form.linkedin" :href="form.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div>
      </div>
      <aside class="identity"><span class="avatar">{{ (form.name || 'HT').slice(0, 2).toUpperCase() }}</span><h2>Developer & Learner</h2><p>Turning new ideas into practical projects, one step at a time.</p></aside>
    </section>
    <section class="panel"><div class="row-top"><div><p class="eyebrow">ABOUT THIS PROJECT</p><h2>From interface to infrastructure.</h2><p class="muted">This portfolio connects a Vue frontend with an Express backend, hosted on Vultr with Nginx.</p></div><button class="btn" @click="editing = !editing">{{ editing ? 'Cancel' : 'Edit profile' }}</button></div>
      <p v-if="notice" class="success">{{ notice }}</p><p v-if="error" class="error">{{ error }}</p>
      <form v-if="editing" class="edit-grid" @submit.prevent="save">
        <div v-for="field in ['name','title','location','website','github','linkedin']" :key="field" class="field"><label :for="field">{{ field }}</label><input :id="field" v-model="form[field]" :required="field === 'name'" /></div>
        <div class="field full"><label for="bio">Biography</label><textarea id="bio" v-model="form.bio" /></div><button class="btn" type="submit">Save changes</button>
      </form>
    </section>
  </div>
</template>
<style scoped>.hero{display:grid;grid-template-columns:1.4fr 1fr;gap:32px}.hero h1 span{color:#6547ce}.identity{background:#efebfc;padding:26px;border-radius:14px}.avatar{display:grid;place-items:center;width:68px;height:68px;background:#6547ce;color:white;border-radius:18px;font-size:24px;font-weight:bold}.edit-grid{margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px}.full{grid-column:1/-1}@media(max-width:700px){.hero,.edit-grid{grid-template-columns:1fr}}</style>
