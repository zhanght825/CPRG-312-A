<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { register } from '../lib/session'
const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)
async function submit() {
  busy.value = true; error.value = ''
  try { await register(username.value, email.value, password.value); await router.push('/login') }
  catch (err) { error.value = err.message }
  finally { busy.value = false }
}
</script>
<template>
  <div class="form-card">
    <p class="eyebrow">CREATE AN ACCOUNT</p><h1 class="page-title">Start your portfolio.</h1>
    <p class="muted">Your profile, skills and projects are private to your account.</p>
    <form @submit.prevent="submit">
      <div class="field"><label for="username">Username</label><input id="username" v-model="username" minlength="3" maxlength="50" required autocomplete="username" /></div>
      <div class="field"><label for="email">Email</label><input id="email" v-model="email" type="email" autocomplete="email" required /></div>
      <div class="field"><label for="password">Password (at least 8 characters)</label><input id="password" v-model="password" type="password" minlength="8" autocomplete="new-password" required /></div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button class="btn" type="submit" :disabled="busy">{{ busy ? 'Creating...' : 'Register' }}</button>
    </form>
    <p class="muted">Have an account? <RouterLink to="/login">Login</RouterLink></p>
  </div>
</template>
