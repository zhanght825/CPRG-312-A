<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const profile = ref(null)
const error = ref('')

watch(
  () => route.query.name,
  async (name) => {
    profile.value = null
    error.value = ''

    try {
      const response = await fetch(`/api/profile?name=${encodeURIComponent(name || 'huitao')}`)

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      profile.value = await response.json()
    } catch (err) {
      error.value = err.message
    }
  },
  { immediate: true },
)
</script>

<template>
  <section>
    <h2>Profile</h2>
    <p v-if="error">{{ error }}</p>

    <div v-if="profile">
      <p>Name: {{ profile.name }}</p>
      <p>Program: {{ profile.program }}</p>
    </div>
  </section>
</template>
