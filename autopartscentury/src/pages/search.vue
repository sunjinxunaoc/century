<template>
  <div class="bg-page pb-14">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Search' }]" />

    <section class="container-mi">
      <div class="mi-card mb-6 p-8">
        <h1 class="mb-3 text-3xl font-bold">Search</h1>
        <div class="relative max-w-xl">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            v-model="q"
            type="search"
            placeholder="Search tyre valves, e.g. TR414, EX50P, valve cap"
            class="w-full rounded-sm border border-black/10 bg-page py-2.5 pl-9 pr-3 text-[14px] outline-none transition-colors focus:border-brand focus:bg-white"
          />
        </div>

        <p v-if="q && !results.length" class="mt-4 text-[14px] text-muted">
          No products found for "{{ q }}". Try a model number like TR414, PVR30 or a keyword like "snap-in".
        </p>
        <p v-else-if="q" class="mt-4 text-[14px] text-muted">
          {{ results.length }} product{{ results.length > 1 ? 's' : '' }} found for "{{ q }}"
        </p>
        <div v-else class="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <span>Popular:</span>
          <button
            v-for="t in popular"
            :key="t"
            class="rounded-full border border-black/10 px-3 py-1 transition-colors hover:border-brand hover:text-brand"
            @click="q = t"
          >{{ t }}</button>
        </div>
      </div>

      <div v-if="results.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <ProductCard v-for="p in results" :key="p.slug" :product="p" :sub-slug="p.sub" />
      </div>
    </section>

    <CtaSection class="mt-14" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { allProducts } from '../data/products'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import ProductCard from '../components/ProductCard.vue'
import CtaSection from '../components/CtaSection.vue'

const route = useRoute()
const router = useRouter()
const q = ref(String(route.query.q || ''))
const popular = ['TR414', 'TR552', 'EX50P', 'VC-8 cap', 'valve core', 'tractor']

watch(q, v => {
  router.replace({ query: v ? { q: v } : {} }).catch(() => {})
})

watch(() => route.query.q, v => {
  if (String(v || '') !== q.value) q.value = String(v || '')
})

const results = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return []
  return allProducts().filter(p =>
    p.name.toLowerCase().includes(s) ||
    (p.keywords || '').toLowerCase().includes(s) ||
    (p.tagline || '').toLowerCase().includes(s)
  )
})

useHead({
  title: 'Product Search - Century AutoParts',
  meta: [
    { name: 'robots', content: 'noindex, follow' },
    { name: 'description', content: 'Search tyre valves by model number or keyword: snap-in valves, clamp-in valves, truck and bus valves, agricultural valves, valve extensions, caps and cores.' },
  ],
})
</script>
