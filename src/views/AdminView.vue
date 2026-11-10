<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../lib/api'
const message = ref('Checking permissions...')
const error = ref('')
onMounted(async()=>{try{const r=await api('/admin'); message.value=r.message}catch(err){error.value=err.message}})
</script>
<template><section class="panel"><p class="eyebrow">ADMIN AREA</p><h1 class="page-title">Administration</h1><p v-if="error" class="error">{{ error }}</p><p v-else>{{ message }}</p><p class="muted">User portfolios remain private, including for administrators.</p></section></template>
