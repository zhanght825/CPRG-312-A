<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../lib/api'
import { session } from '../lib/session'
const features = ref([])
const error = ref('')
const username = computed(() => session.user?.username || 'Developer')
onMounted(async () => { try { const r = await api('/dashboard'); features.value = r.features || [] } catch (err) { error.value = err.message } })
</script>
<template>
  <div class="stack">
    <header><p class="eyebrow">YOUR WORKSPACE</p><h1 class="page-title">Welcome, {{ username }}.</h1><p class="muted">Manage your own portfolio and track your projects.</p></header>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="cards">
      <RouterLink class="panel" to="/profile"><h2>Profile →</h2><p>Edit your introduction and links.</p></RouterLink>
      <RouterLink class="panel" to="/skills"><h2>Skills →</h2><p>Organize your technologies.</p></RouterLink>
      <RouterLink class="panel" to="/projects"><h2>Projects →</h2><p>Document your portfolio work.</p></RouterLink>
      <RouterLink class="panel" to="/contact"><h2>Notes →</h2><p>Keep personal notes and messages.</p></RouterLink>
    </div>
    <p class="muted">Role: {{ session.user?.role }} · Available features: {{ features.join(', ') || 'loading' }}</p>
    <RouterLink v-if="session.user?.role === 'admin'" class="btn" to="/admin">Admin area</RouterLink>
  </div>
</template>
<style scoped>.panel { color: inherit; text-decoration:none; } .panel:hover { border-color:#6547ce; } h2{margin:0;} p{color:#606b80;}</style>
