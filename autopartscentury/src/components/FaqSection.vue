<template>
  <div class="space-y-3">
    <div v-for="(faq, i) in faqs" :key="i" class="mi-card overflow-hidden">
      <button
        class="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-[15px] font-medium"
        @click="open = open === i ? -1 : i"
      >
        {{ faq.q }}
        <svg
          class="h-4 w-4 shrink-0 text-muted transition-transform"
          :class="{ 'rotate-180': open === i }"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div v-show="open === i" class="border-t border-black/5 px-6 py-4 text-[14px] leading-relaxed text-muted">
        {{ faq.a }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  faqs: { type: Array, required: true },
})

const open = ref(0)
</script>
