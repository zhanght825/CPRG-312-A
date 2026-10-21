<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const skills = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const name = route.query.name || 'huitao'
    const response = await fetch(`/api/skills?name=${encodeURIComponent(name)}`)

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    skills.value = data.skills
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <section>
    <h2>Skills</h2>
    <p v-if="error">{{ error }}</p>

    <ul>
      <li v-for="skill in skills" :key="skill">
        {{ skill }}
      </li>
    </ul>
  </section>
</template>
