<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories } from '../data/products'
import PageHero from '../components/PageHero.vue'
import ProductSidebar from '../components/ProductSidebar.vue'
import ProductCard from '../components/ProductCard.vue'
import CtaSection from '../components/CtaSection.vue'
import { useHead } from '@unhead/vue'

const route = useRoute()
const router = useRouter()

const q = ref(typeof route.query.q === 'string' ? route.query.q : '')

const allProducts = computed(() => {
  const out = []
  for (const cat of categories) {
    for (const sub of cat.subcategories || []) {
      for (const p of sub.products || []) {
        out.push({
          ...p,
          href: `/products/${cat.slug}/${p.slug}/`,
          context: `${cat.name} / ${sub.name}`,
        })
      }
    }
  }
  return out
})

const terms = computed(() => q.value.toLowerCase().split(/\s+/).filter(Boolean))

const results = computed(() => {
  if (!terms.value.length) return []
  return allProducts.value.filter(p => {
    const hay = `${p.name} ${p.keywords || ''} ${p.tagline || ''} ${p.context}`.toLowerCase()
    return terms.value.every(t => hay.includes(t))
  })
})

const searching = computed(() => terms.value.length > 0)

watch(q, (v) => {
  router.replace({ path: '/products/', query: v ? { q: v } : {} })
})

useHead(() => {
  const title = 'Tyre Repair Products | Wheel Weights, Valves & TPMS - Century Auto Parts'
  const desc = 'Browse our complete range of tyre repair products - wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs.'
  const url = 'https://centurymanufacture.com/products/'
  return {
    title,
    meta: [
      { name: 'description', content: desc },
      { name: 'keywords', content: 'tyre repair products, wheel balancing weights, tyre valves, TPMS, tyre seal string, tyre patch, mushroom patch plug' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Tyre Repair Products',
          url,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: categories.map((cat, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: cat.name,
              url: `https://centurymanufacture.com/products/${cat.slug}/`,
            })),
          },
        }),
      },
    ],
  }
})

const catImages = {
  'wheel-balancing-weights': '/images/wheel weight.webp',
  'tyre-valves': '/images/tire valve.webp',
  'tpms': '/images/TPMS Valve.webp',
  'tyre-seal-string': '/images/tire seal.webp',
  'tyre-patch': '/images/tire patch.webp',
  'mushroom-patch-plug': '/images/mushroom patch plug.webp',
}
</script>

<template>
  <div>
    <PageHero title="Our Products" subtitle="Complete Tire Repair Solutions for Global Markets" />
    <section class="py-16">
      <div class="container-app">
        <div class="max-w-xl mx-auto mb-12">
          <label for="product-search" class="sr-only">Search products</label>
          <div class="relative">
            <input
              id="product-search"
              v-model="q"
              type="search"
              placeholder="Search products - e.g. adhesive wheel weight, TR414, TPMS..."
              class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 outline-none transition"
            >
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          </div>
        </div>

        <div class="mb-10 rounded-lg bg-gradient-to-r from-[#1A1A2E] to-[#2B2B45] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold mb-1">Get the Full Product Catalog 2026</h2>
            <p class="text-gray-300 text-sm">Specs, sizes and packing details for all our tyre repair products. Free PDF download.</p>
          </div>
          <RouterLink to="/catalog/" class="btn btn-primary btn-large shrink-0">Download Catalog</RouterLink>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          <ProductSidebar />
          <div class="min-w-0">
            <template v-if="searching">
              <div class="section-header text-left">
                <h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">Search results</h2>
                <p class="text-gray-500">{{ results.length }} product{{ results.length === 1 ? '' : 's' }} matching "{{ q }}"</p>
              </div>
              <div v-if="results.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <ProductCard v-for="p in results" :key="p.slug" :name="p.name" :desc="p.tagline" :image="p.image" :href="p.href" />
              </div>
              <p v-else class="text-gray-500 py-8">
                No products matched your search. Try a shorter term such as "wheel weight", "valve" or "TPMS", or
                <RouterLink to="/contact/" class="text-[#FF6B00] hover:underline">ask our team</RouterLink>.
              </p>
            </template>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <div v-for="cat in categories" :key="cat.slug" class="card reveal flex flex-col">
                <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img :src="catImages[cat.slug]" :alt="cat.name" width="800" height="600" loading="lazy" decoding="async" class="w-full h-full object-cover">
                </div>
                <div class="p-5 flex flex-col flex-1">
                  <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ cat.name }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ cat.tagline }}</p>
                  <RouterLink :to="`/products/${cat.slug}/`" class="text-[#FF6B00] text-sm font-medium hover:underline">Explore Range &rarr;</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <CtaSection heading="Need a Custom Solution?" text="Contact us for OEM/ODM services and custom product development." />
  </div>
</template>
