<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { login } from '../lib/session'
import { googleLoginUrl } from '../lib/api'
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref(route.query.error === 'google' ? 'Google login was not completed. Try again.' : '')
async function submit() {
  busy.value = true; error.value = ''
  try { await login(email.value, password.value); await router.replace(String(route.query.next || '/dashboard')) }
  catch (err) { error.value = err.message }
  finally { busy.value = false }
}
</script>
<template>
  <div class="form-card">
    <p class="eyebrow">WELCOME BACK</p>
    <h1 class="page-title">Sign in.</h1>
    <p class="muted">Access your private portfolio and manage your projects.</p>
    <form @submit.prevent="submit">
      <div class="field"><label for="email">Email</label><input id="email" v-model="email" type="email" autocomplete="email" required /></div>
      <div class="field"><label for="password">Password</label><input id="password" v-model="password" type="password" autocomplete="current-password" required /></div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button class="btn" type="submit" :disabled="busy">{{ busy ? 'Signing in...' : 'Login' }}</button>
    </form>
    <p><a class="btn ghost" :href="googleLoginUrl">Continue with Google</a></p>
    <p class="muted">New here? <RouterLink to="/register">Create an account</RouterLink></p>
  </div>
</template>
