<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { api, json } from '../lib/api'
const skills = ref([])
const selected = ref('All')
const editingId = ref(null)
const form = reactive({ name: '', category: 'Frontend', level: 'Intermediate', description: '', order: 0 })
const error = ref('')
const categories = computed(() => ['All', ...new Set(skills.value.map(s => s.category || 'Other'))])
const filtered = computed(() => skills.value.filter(s => selected.value === 'All' || s.category === selected.value))
async function load() { try { skills.value = await api('/portfolio/skills') } catch (err) { error.value = err.message } }
function edit(skill) { editingId.value = skill._id; Object.assign(form, { name:skill.name, category:skill.category, level:skill.level, description:skill.description, order:skill.order }) }
function reset() { editingId.value = null; Object.assign(form, { name:'', category:'Frontend', level:'Intermediate', description:'', order:0 }) }
async function save() { error.value = ''; try { await json(editingId.value ? 'PUT' : 'POST', editingId.value ? `/portfolio/skills/${editingId.value}` : '/portfolio/skills', { ...form, order:Number(form.order) }); reset(); await load() } catch (err) { error.value = err.message } }
async function remove(id) { if (!confirm('Delete this skill?')) return; try { await api(`/portfolio/skills/${id}`, { method:'DELETE' }); await load() } catch(err) { error.value = err.message } }
onMounted(load)
</script>
<template>
  <div class="stack">
    <header><p class="eyebrow">MY TOOLKIT</p><h1 class="page-title">The tools behind<br /><span>the things I build.</span></h1><p class="muted">Technologies I am exploring through hands-on projects.</p></header>
    <section class="panel"><h2>{{ editingId ? 'Edit skill' : 'Add a skill' }}</h2><form @submit.prevent="save"><div class="cards"><div class="field"><label for="skill-name">Name</label><input id="skill-name" v-model="form.name" required /></div><div class="field"><label for="skill-category">Category</label><input id="skill-category" v-model="form.category" required /></div><div class="field"><label for="skill-level">Level</label><select id="skill-level" v-model="form.level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div><div class="field"><label for="skill-order">Order</label><input id="skill-order" v-model.number="form.order" type="number" /></div></div><div class="field"><label for="skill-description">Description</label><textarea id="skill-description" v-model="form.description" /></div><div class="inline-actions"><button class="btn" type="submit">{{ editingId ? 'Save skill' : 'Add skill' }}</button><button v-if="editingId" type="button" class="btn ghost" @click="reset">Cancel</button></div></form></section>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="inline-actions"><button v-for="cat in categories" :key="cat" class="btn" :class="selected === cat ? '' : 'ghost'" @click="selected = cat">{{ cat }}</button></div>
    <p class="muted">{{ filtered.length }} skills shown</p>
    <div class="cards"><article v-for="skill in filtered" :key="skill._id" class="panel"><span class="chip">{{ skill.category }}</span><h2>{{ skill.name }}</h2><p class="muted">{{ skill.description }}</p><p class="muted">{{ skill.level }}</p><div class="inline-actions"><button class="btn ghost" @click="edit(skill)">Edit</button><button class="btn danger" @click="remove(skill._id)">Delete</button></div></article></div>
    <p class="muted">Built through practice. Improved through curiosity.</p>
  </div>
</template>
<style scoped>h1 span{color:#6547ce}</style>
