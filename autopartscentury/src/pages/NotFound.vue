<template>
  <div class="container-mi flex flex-col items-center py-24 text-center">
    <div class="mb-4 text-6xl font-bold text-brand">404</div>
    <h1 class="mb-2 text-2xl font-bold">Page Not Found</h1>
    <p class="mb-8 text-[14px] text-muted">The page you are looking for does not exist.</p>
    <router-link to="/" class="rounded-sm bg-brand px-8 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-dark">
      Back to Home
    </router-link>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
useHead({
  title: '404 Not Found - Century AutoParts',
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})
</script>
