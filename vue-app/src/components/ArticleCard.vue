<script setup>
defineProps({
  article: { type: Object, required: true },
})
</script>

<template>
  <div class="card reveal flex flex-col">
    <div class="aspect-[4/3] overflow-hidden bg-gray-100">
      <img :src="article.img" :alt="article.title" width="800" height="450" loading="lazy" decoding="async" class="w-full h-full object-cover">
    </div>
    <div class="p-5 flex flex-col flex-1">
      <div class="flex flex-wrap gap-1.5 mb-2">
        <span v-for="t in article.tags" :key="t" class="tag">{{ t }}</span>
      </div>
      <h3 class="font-semibold text-[#1A1A2E] mb-2 leading-snug">{{ article.title }}</h3>
      <div class="text-xs text-gray-400 mb-3">{{ article.date }}</div>
      <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ article.desc }}</p>
      <RouterLink :to="`/news/${article.slug}/`" class="text-[#FF6B00] text-sm font-medium hover:underline">Read More &rarr;</RouterLink>
    </div>
  </div>
</template>
