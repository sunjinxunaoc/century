<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  href: { type: String, required: true },
  image: { type: String, default: '' },
})
</script>

<template>
  <div class="card reveal flex flex-col p-6 text-center">
    <div v-if="image" class="mx-auto mb-4 h-32 w-full flex items-center justify-center">
      <img :src="image" :alt="title" loading="lazy" decoding="async" class="max-h-32 w-auto max-w-full object-contain">
    </div>
    <div v-else class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">&#9672;</div>
    <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ desc }}</p>
    <RouterLink :to="href" class="text-[#FF6B00] text-sm font-medium hover:underline">View Details &rarr;</RouterLink>
  </div>
</template>
