<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  headingTag: { type: String, default: 'h1' },
})
</script>

<template>
  <section class="relative bg-gradient-to-br from-[#1A1A2E] via-[#2B2B45] to-[#4A2B1A] text-white overflow-hidden">
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="container-app relative py-20 md:py-24 text-center">
      <component :is="headingTag" class="text-4xl md:text-5xl font-bold mb-4">{{ title }}</component>
      <p v-if="subtitle" class="text-lg text-gray-300 max-w-2xl mx-auto">{{ subtitle }}</p>
    </div>
  </section>
</template>
