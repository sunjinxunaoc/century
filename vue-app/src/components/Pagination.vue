<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  basePath: { type: String, required: true },
})

function pagePath(page) {
  return page === 1 ? `${props.basePath}/` : `${props.basePath}/page/${page}/`
}

const pages = computed(() => {
  if (props.total <= 7) {
    return Array.from({ length: props.total }, (_, i) => i + 1)
  }
  const current = props.current
  const result = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(props.total - 1, current + 1)
  if (start > 2) result.push('...')
  for (let i = start; i <= end; i++) result.push(i)
  if (end < props.total - 1) result.push('...')
  result.push(props.total)
  return result
})
</script>

<template>
  <nav v-if="total > 1" class="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
    <RouterLink
      v-if="current > 1"
      :to="pagePath(current - 1)"
      class="pagination-link"
      rel="prev"
      aria-label="Previous page"
    >&#8592; Prev</RouterLink>

    <template v-for="(p, i) in pages" :key="i">
      <span v-if="p === '...'" class="px-2 text-gray-400 select-none">&#8230;</span>
      <RouterLink
        v-else
        :to="pagePath(p)"
        class="pagination-link"
        :class="{ 'pagination-link-active': p === current }"
        :aria-current="p === current ? 'page' : undefined"
        :rel="p === current + 1 ? 'next' : undefined"
      >{{ p }}</RouterLink>
    </template>

    <RouterLink
      v-if="current < total"
      :to="pagePath(current + 1)"
      class="pagination-link"
      rel="next"
      aria-label="Next page"
    >Next &#8594;</RouterLink>
  </nav>
</template>

<style scoped>
.pagination-link {
  @apply inline-flex items-center justify-center min-w-10 h-10 px-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-md transition-colors duration-200 hover:border-[#FF6B00] hover:text-[#FF6B00];
}
.pagination-link-active {
  @apply bg-[#FF6B00] border-[#FF6B00] text-white font-semibold hover:bg-orange-600 hover:border-orange-600 hover:text-white cursor-default;
}
</style>
