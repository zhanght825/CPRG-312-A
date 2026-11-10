<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api, json } from '../lib/api'
const projects = ref([])
const editingId = ref(null)
const error = ref('')
const form = reactive({ title:'', description:'', technologies:'', image:'', github:'', demo:'', featured:false, order:0 })
function clear() { editingId.value=null; Object.assign(form,{ title:'', description:'', technologies:'', image:'', github:'', demo:'', featured:false, order:0 }) }
function edit(project) { editingId.value=project._id; Object.assign(form, { ...project, technologies:(project.technologies||[]).join(', ') }); window.scrollTo({top:0, behavior:'smooth'}) }
async function load() { try { projects.value=await api('/portfolio/projects') } catch(err) { error.value=err.message } }
async function save() { error.value=''; try { const data={...form, technologies:form.technologies.split(',').map(s=>s.trim()).filter(Boolean), order:Number(form.order)}; await json(editingId.value?'PUT':'POST',editingId.value?`/portfolio/projects/${editingId.value}`:'/portfolio/projects',data); clear(); await load() } catch(err) { error.value=err.message } }
async function remove(id) { if (!confirm('Delete this project?')) return; try { await api(`/portfolio/projects/${id}`,{method:'DELETE'}); await load() } catch(err){error.value=err.message} }
onMounted(load)
</script>
<template>
  <div class="stack">
    <header><p class="eyebrow">SELECTED WORK / CPRG 312</p><h1 class="page-title">Ideas into<br /><span>working software.</span></h1><p class="muted">Exploring the connection between interfaces, APIs, and infrastructure.</p></header>
    <section class="panel"><h2>{{ editingId ? 'Edit project' : 'Add a project' }}</h2><form @submit.prevent="save">
      <div class="cards"><div class="field"><label for="title">Title</label><input id="title" v-model="form.title" required /></div><div class="field"><label for="technologies">Technologies (comma separated)</label><input id="technologies" v-model="form.technologies" /></div><div class="field"><label for="github">GitHub URL</label><input id="github" v-model="form.github" /></div><div class="field"><label for="demo">Demo URL</label><input id="demo" v-model="form.demo" /></div><div class="field"><label for="image">Image URL</label><input id="image" v-model="form.image" /></div><div class="field"><label for="order">Order</label><input id="order" v-model.number="form.order" type="number" /></div></div>
      <div class="field"><label for="description">Description</label><textarea id="description" v-model="form.description" /></div>
      <div class="field"><label><input v-model="form.featured" type="checkbox" style="width:auto" /> Featured project</label></div>
      <div class="inline-actions"><button class="btn" type="submit">{{ editingId ? 'Save project' : 'Add project' }}</button><button v-if="editingId" class="btn ghost" type="button" @click="clear">Cancel</button></div></form></section>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="cards"><article v-for="project in projects" :key="project._id" class="panel"><img v-if="project.image" class="image-card" :src="project.image" alt="Project cover" /><p class="eyebrow">{{ project.featured ? 'FEATURED WORK' : 'PROJECT' }}</p><h2>{{ project.title }}</h2><p class="muted">{{ project.description }}</p><div><span v-for="tech in project.technologies" :key="tech" class="chip">{{ tech }}</span></div><p class="inline-actions"><a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer">Code ↗</a><a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer">Demo ↗</a></p><div class="inline-actions"><button class="btn ghost" @click="edit(project)">Edit</button><button class="btn danger" @click="remove(project._id)">Delete</button></div></article></div>
    <section class="panel"><h2>Three layers. One experience.</h2><div class="cards"><div><h3>Frontend</h3><p class="muted">Responsive portfolio pages built with Vue and Vue Router.</p></div><div><h3>Backend</h3><p class="muted">Express APIs with authentication, permissions and security middleware.</p></div><div><h3>Deployment</h3><p class="muted">Vultr hosting with Nginx and GitHub Actions automation.</p></div></div></section>
  </div>
</template>
<style scoped>h1 span{color:#6547ce}</style>
