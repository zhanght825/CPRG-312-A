<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projects = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const name = route.query.name || 'huitao'
    const response = await fetch(`/api/projects?name=${encodeURIComponent(name)}`)

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    projects.value = data.projects
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <section>
    <h2>Projects</h2>
    <p v-if="error">{{ error }}</p>

    <article v-for="project in projects" :key="project.id">
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
    </article>
  </section>
</template>
