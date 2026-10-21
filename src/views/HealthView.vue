<script setup>
import { ref, onMounted } from 'vue'

const health = ref(null)
const error = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/api/health')

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    health.value = await response.json()
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <section>
    <h2>Server Health</h2>
    <p v-if="error">{{ error }}</p>

    <div v-if="health">
      <p>Status: {{ health.status }}</p>
      <p>{{ health.message }}</p>
    </div>
  </section>
</template>
