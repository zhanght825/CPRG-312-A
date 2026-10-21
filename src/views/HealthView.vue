<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const endpoint = `${import.meta.env.BASE_URL}api/health`
const state = ref('idle')
const message = ref('Run a check to contact the API.')
const response = ref('')
const checkedAt = ref('')
const duration = ref(null)
const httpStatus = ref(null)

let controller
let checking = false

const labels = {
  idle: 'Not checked',
  loading: 'Checking API',
  success: 'API responded',
  error: 'Check failed',
}

const label = computed(() => labels[state.value])

async function checkHealth() {
  if (checking) return
  checking = true
  state.value = 'loading'
  message.value = 'Waiting for a JSON response from the server.'
  response.value = ''
  duration.value = null
  httpStatus.value = null

  controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  const started = performance.now()

  try {
    const result = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    })

    httpStatus.value = result.status

    if (!result.ok) {
      throw new Error(`The server returned HTTP ${result.status}.`)
    }

    const type = result.headers.get('content-type') || ''
    if (!type.includes('application/json')) {
      throw new Error('Expected JSON. Check the API path and Nginx routing.')
    }

    const data = await result.json()
    response.value = JSON.stringify(data, null, 2)
    state.value = 'success'
    message.value = 'The endpoint returned valid JSON. Review its health details below.'
  } catch (error) {
    state.value = 'error'
    message.value =
      error.name === 'AbortError'
        ? 'The request exceeded the 10-second timeout.'
        : error.message || 'Unable to reach the API.'
  } finally {
    clearTimeout(timer)
    duration.value = Math.round(performance.now() - started)
    checkedAt.value = new Date().toLocaleTimeString('en-US')
    checking = false
  }
}

onMounted(checkHealth)
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <div class="health-page">
    <header>
      <p class="eyebrow">SERVICE STATUS</p>
      <h1>A closer look<br /><span>behind the interface.</span></h1>
      <p class="intro">Check the connection between this page and the backend API.</p>
    </header>

    <section class="status-card" aria-labelledby="status-heading">
      <div class="status-top">
        <div role="status" aria-live="polite">
          <p class="badge" :class="state">{{ label }}</p>
          <h2 id="status-heading">Backend connection</h2>
          <p class="message">{{ message }}</p>
        </div>
        <button type="button" :disabled="state === 'loading'" @click="checkHealth">
          {{ state === 'loading' ? 'Checking…' : 'Check again ↗' }}
        </button>
      </div>

      <dl class="metrics">
        <div>
          <dt>HTTP status</dt>
          <dd>{{ httpStatus ?? '—' }}</dd>
        </div>
        <div>
          <dt>Request duration</dt>
          <dd>{{ duration === null ? '—' : `${duration} ms` }}</dd>
        </div>
        <div>
          <dt>Last checked</dt>
          <dd>{{ checkedAt || '—' }}</dd>
        </div>
      </dl>

      <div class="endpoint">
        <span>GET</span>
        <code>{{ endpoint }}</code>
      </div>
    </section>

    <section class="response-card" aria-labelledby="response-heading">
      <div class="response-heading">
        <h2 id="response-heading">Server response</h2>
        <span>JSON</span>
      </div>
      <pre v-if="response"><code>{{ response }}</code></pre>
      <p v-else class="empty">
        {{ state === 'loading' ? 'Waiting for the server…' : 'No JSON response available.' }}
      </p>
    </section>

    <aside class="note">
      <h2>What this check tells you</h2>
      <p>
        A successful check confirms that this endpoint returned valid JSON. It does not verify every
        service, certificate renewal, or security setting. Request duration includes network and
        response processing time.
      </p>
    </aside>
  </div>
</template>

<style scoped>
.health-page {
  display: grid;
  gap: 30px;
  color: #182238;
}
.eyebrow {
  color: #6547ce;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.15em;
}
h1 {
  margin: 18px 0;
  font-size: clamp(36px, 4.6vw, 58px);
  letter-spacing: -0.05em;
  line-height: 1.12;
}
h1 span {
  color: #6547ce;
}
.intro {
  max-width: 580px;
  margin-bottom: 12px;
  color: #606b80;
  line-height: 1.8;
}
.status-card,
.response-card {
  overflow: hidden;
  border: 1px solid #e2e6ef;
  border-radius: 16px;
  background: white;
}
.status-card {
  padding: 30px;
}
.status-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}
.badge {
  display: inline-block;
  margin: 0 0 16px;
  padding: 5px 10px;
  border-radius: 6px;
  background: #edf0f5;
  color: #546176;
  font-size: 11px;
  font-weight: 700;
}
.badge.success {
  color: #236950;
  background: #e9f5ee;
}
.badge.error {
  color: #a33143;
  background: #fcecf0;
}
.badge.loading {
  color: #6547ce;
  background: #efebfc;
}
h2 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.03em;
}
.message {
  max-width: 560px;
  margin: 12px 0 0;
  color: #606b80;
  font-size: 14px;
  line-height: 1.8;
}
button {
  flex-shrink: 0;
  min-height: 44px;
  padding: 11px 18px;
  border: 0;
  border-radius: 9px;
  color: white;
  background: #6547ce;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
button:hover:not(:disabled) {
  background: #5236b3;
}

button:disabled {
  opacity: 0.65;
  cursor: wait;
}

button:focus-visible {
  outline: 3px solid #6547ce;
  outline-offset: 4px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin: 28px 0;
  padding-block: 24px;
  border-block: 1px solid #e2e6ef;
}

.metrics dt {
  margin-bottom: 8px;
  color: #606b80;
  font-size: 12px;
}

.metrics dd {
  margin: 0;
  font-size: 20px;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.endpoint {
  display: flex;
  align-items: center;
  gap: 12px;
}

.endpoint > span {
  color: #236950;
  font-size: 11px;
  font-weight: 750;
}

.endpoint code {
  color: #606b80;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.response-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 22px 26px;
  border-bottom: 1px solid #e2e6ef;
}

.response-heading h2 {
  font-size: 17px;
}

.response-heading > span {
  color: #606b80;
  font: 11px monospace;
}

pre {
  max-height: 360px;
  overflow: auto;
  margin: 0;
  padding: 26px;
  color: #ded7fa;
  background: #1b2337;
  font-size: 13px;
  line-height: 1.8;
}

.empty {
  margin: 0;
  padding: 32px 26px;
  color: #606b80;
  font-size: 13px;
}

.note {
  padding: 24px;
  border: 1px solid #ded7f2;
  border-radius: 12px;
  background: #f0ecfa;
}

.note h2 {
  font-size: 16px;
}

.note p {
  margin: 10px 0 0;
  color: #606b80;
  font-size: 13px;
  line-height: 1.85;
}

@media (max-width: 650px) {
  .status-card {
    padding: 22px;
  }

  .status-top {
    flex-direction: column;
  }

  .metrics {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
