<script setup>
import { onMounted, ref } from 'vue'

const contact = ref(null)
const loading = ref(false)
const error = ref('')
const endpoint = `${import.meta.env.BASE_URL}api/contact`

async function loadContact() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error('Request failed.')
    const data = await response.json()
    if (typeof data.email !== 'string' || typeof data.phone !== 'string') {
      throw new Error('Invalid contact data.')
    }
    contact.value = { email: data.email, phone: data.phone }
  } catch {
    error.value = 'Unable to load contact details. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(loadContact)
</script>

<template>
  <section class="contact">
    <p class="label">GET IN TOUCH</p>
    <h1>Let's start<br /><span>a conversation.</span></h1>
    <p class="intro">For project ideas, questions, and collaboration.</p>

    <p v-if="loading" role="status">Loading contact details…</p>
    <div v-else-if="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="loadContact">Try again</button>
    </div>

    <div v-else-if="contact" class="grid">
      <article>
        <span class="icon" aria-hidden="true">@</span>
        <h2>Email</h2>
        <p>Send me a message.</p>
        <a :href="'mailto:' + encodeURIComponent(contact.email)">
          {{ contact.email }}
        </a>
      </article>
      <article>
        <span class="icon" aria-hidden="true">☎</span>
        <h2>Phone</h2>
        <p>Get in touch by phone.</p>
        <a :href="'tel:' + contact.phone.replace(/[^+\d]/g, '')">
          {{ contact.phone }}
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.contact {
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
  font-size: clamp(36px, 5vw, 60px);
  line-height: 1.12;
  letter-spacing: -0.05em;
}
h1 span {
  color: #6547ce;
}
.intro {
  color: #606b80;
  line-height: 1.85;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 36px;
}
article {
  min-width: 0;
  padding: 30px;
  border: 1px solid #e2e6ef;
  border-radius: 16px;
  background: white;
}
.icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  color: #6547ce;
  background: #efebfc;
  font-size: 24px;
}
h2 {
  margin: 22px 0 12px;
  font-size: 23px;
}
article p {
  color: #606b80;
  font-size: 14px;
}
a {
  display: inline-block;
  padding-block: 10px;
  color: #6547ce;
  overflow-wrap: anywhere;
  text-underline-offset: 4px;
}
button {
  padding: 12px 18px;
  border: 0;
  border-radius: 8px;
  background: #6547ce;
  color: white;
  font: inherit;
  cursor: pointer;
}
button:hover {
  background: #5236b3;
}
a:focus-visible,
button:focus-visible {
  outline: 3px solid #6547ce;
  outline-offset: 4px;
}
@media (max-width: 650px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
