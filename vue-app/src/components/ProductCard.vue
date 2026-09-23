<script setup>
defineProps({
  name: { type: String, required: true },
  desc: { type: String, default: '' },
  href: { type: String, required: true },
  image: { type: String, default: '/images/placeholder.svg' },
})
</script>

<template>
  <div class="card reveal flex flex-col">
    <div class="overflow-hidden bg-gray-100">
      <img :src="image" :alt="name" width="600" height="600" loading="lazy" decoding="async" class="w-full h-auto object-contain block">
    </div>
    <div class="p-5 flex flex-col flex-1">
      <h3 class="font-semibold text-[#1A1A2E] mb-2 leading-snug">{{ name }}</h3>
      <p v-if="desc" class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ desc }}</p>
      <RouterLink :to="href" class="text-[#FF6B00] text-sm font-medium hover:underline">View Details &rarr;</RouterLink>
    </div>
  </div>
</template>
