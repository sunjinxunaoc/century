<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[560px] border-collapse text-[13px]">
      <thead>
        <tr class="bg-page">
          <th v-for="h in spec.headers" :key="h" class="border border-black/10 px-4 py-3 text-left font-semibold">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in spec.rows" :key="i" class="transition-colors hover:bg-page/60">
          <td v-for="(cell, j) in row" :key="j" class="border border-black/10 px-4 py-3" :class="j === 0 ? 'font-medium text-brand' : 'text-muted'">
            <router-link
              v-if="j === 0 && linkFor(cell)"
              :to="linkFor(cell)"
              class="text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand"
            >{{ cell }}</router-link>
            <template v-else>{{ cell }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { findProductByModel } from '../data/products'

defineProps({
  spec: { type: Object, required: true },
})

const route = useRoute()

function linkFor(cell) {
  const hit = findProductByModel(cell)
  if (!hit) return null
  if (hit.sub === route.params.sub && hit.slug === route.params.slug) return null
  return `/products/${hit.sub}/${hit.slug}/`
}
</script>
