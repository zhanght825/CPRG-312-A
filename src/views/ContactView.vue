<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api, json } from '../lib/api'
const form = reactive({ subject:'', message:'' })
const messages = ref([])
const error = ref('')
const notice = ref('')
async function load() { try { messages.value=await api('/contact/messages') } catch(err) { error.value=err.message } }
async function save() { error.value=''; notice.value=''; try { await json('POST','/contact/messages',{...form}); form.subject=''; form.message='';notice.value='Note saved.';await load() } catch(err){error.value=err.message} }
onMounted(load)
</script>
<template>
  <div class="stack"><header><p class="eyebrow">GET IN TOUCH</p><h1 class="page-title">Let's start<br />a conversation.</h1><p class="muted">For project ideas, questions, and collaboration. This page also keeps your private notes in MongoDB.</p></header>
    <section class="panel"><h2>New note</h2><form @submit.prevent="save"><div class="field"><label for="subject">Subject</label><input id="subject" v-model="form.subject" maxlength="200" required /></div><div class="field"><label for="message">Message</label><textarea id="message" v-model="form.message" maxlength="5000" required /></div><p v-if="error" class="error">{{ error }}</p><p v-if="notice" class="success">{{ notice }}</p><button class="btn">Save note</button></form></section>
    <section class="panel"><h2>My notes</h2><p v-if="messages.length === 0" class="muted">No notes yet.</p><article v-for="msg in messages" :key="msg._id" class="note"><h3>{{ msg.subject }}</h3><p>{{ msg.message }}</p><small>{{ new Date(msg.createdAt).toLocaleString() }}</small></article></section>
  </div>
</template>
<style scoped>.note{padding:17px 0;border-bottom:1px solid #e2e6ef}.note p{white-space:pre-wrap;color:#606b80}</style>
