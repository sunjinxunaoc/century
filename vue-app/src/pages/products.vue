<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getCategories } from '../data/localize'
import PageHero from '../components/PageHero.vue'
import ProductSidebar from '../components/ProductSidebar.vue'
import ProductCard from '../components/ProductCard.vue'
import CtaSection from '../components/CtaSection.vue'
import { useI18n, absoluteUrl } from '../i18n'

const route = useRoute()
const router = useRouter()
const { t, locale, p } = useI18n()

const categories = computed(() => getCategories(locale.value))
const q = ref(typeof route.query.q === 'string' ? route.query.q : '')

const allProducts = computed(() => {
  const out = []
  for (const cat of categories.value) {
    for (const sub of cat.subcategories || []) {
      for (const pdt of sub.products || []) {
        out.push({
          ...pdt,
          href: p(`/products/${cat.slug}/${pdt.slug}/`),
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
  return allProducts.value.filter((pdt) => {
    const hay = `${pdt.name} ${pdt.keywords || ''} ${pdt.tagline || ''} ${pdt.context}`.toLowerCase()
    return terms.value.every((term) => hay.includes(term))
  })
})

const searching = computed(() => terms.value.length > 0)

watch(q, (v) => {
  router.replace({ path: p('/products/'), query: v ? { q: v } : {} })
})

useHead(() => {
  const title = t('seo.products.title')
  const desc = t('seo.products.description')
  const url = absoluteUrl('/products/')
  return {
    title,
    meta: [
      { name: 'description', content: desc },
      { name: 'keywords', content: t('seo.products.keywords') },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: 'https://centurymanufacture.com/images/factory.webp' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://centurymanufacture.com/images/factory.webp' },
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
          name: t('products.heroTitle'),
          url,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: categories.value.map((cat, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: cat.name,
              url: absoluteUrl(`/products/${cat.slug}/`),
            })),
          },
        }),
      },
    ],
  }
})

const catImages = {
  'wheel-balancing-weights': '/images/cards-v2/cat-wheel-balancing-weights.webp',
  'tyre-valves': '/images/cards-v2/cat-tyre-valves.webp',
  'tpms': '/images/cards-v2/cat-tpms.webp',
  'tyre-seal-string': '/images/cards-v2/cat-tyre-seal-string.webp',
  'tyre-patch': '/images/cards-v2/cat-tyre-patch.webp',
  'mushroom-patch-plug': '/images/cards-v2/cat-mushroom-patch-plug.webp',
}
</script>

<template>
  <div>
    <PageHero :title="t('products.heroTitle')" :subtitle="t('products.heroSubtitle')" />
    <section class="py-16">
      <div class="container-app">
        <div class="max-w-xl mx-auto mb-12">
          <label for="product-search" class="sr-only">{{ t('common.searchProducts') }}</label>
          <div class="relative">
            <input
              id="product-search"
              v-model="q"
              type="search"
              :placeholder="t('products.searchPlaceholder')"
              class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 outline-none transition"
            >
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          </div>
        </div>

        <div class="mb-10 rounded-lg bg-gradient-to-r from-[#1A1A2E] to-[#2B2B45] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold mb-1">{{ t('products.catalogTitle') }}</h2>
            <p class="text-gray-300 text-sm">{{ t('products.catalogText') }}</p>
          </div>
          <RouterLink :to="p('/catalog/')" class="btn btn-primary btn-large shrink-0">{{ t('products.catalogCta') }}</RouterLink>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          <ProductSidebar />
          <div class="min-w-0">
            <template v-if="searching">
              <div class="section-header text-left">
                <h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">{{ t('products.searchResults') }}</h2>
                <p class="text-gray-500">{{ t(results.length === 1 ? 'products.resultCountOne' : 'products.resultCountMany', { count: results.length, q }) }}</p>
              </div>
              <div v-if="results.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <ProductCard v-for="pdt in results" :key="pdt.slug" :name="pdt.name" :desc="pdt.tagline" :image="pdt.image" :href="pdt.href" />
              </div>
              <p v-else class="text-gray-500 py-8">
                {{ t('products.noResults') }}
                <RouterLink :to="p('/contact/')" class="text-[#FF6B00] hover:underline">{{ t('products.askTeam') }}</RouterLink>.
              </p>
            </template>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <div v-for="cat in categories" :key="cat.slug" class="card reveal flex flex-col">
                <div class="aspect-[4/3] overflow-hidden bg-[#F6F2EC]">
                  <img :src="catImages[cat.slug]" :alt="cat.name" width="1200" height="900" loading="lazy" decoding="async" class="w-full h-full object-cover">
                </div>
                <div class="p-5 flex flex-col flex-1">
                  <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ cat.name }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{{ cat.tagline }}</p>
                  <RouterLink :to="p(`/products/${cat.slug}/`)" class="text-[#FF6B00] text-sm font-medium hover:underline">{{ t('common.exploreRange') }} &rarr;</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <CtaSection :heading="t('products.ctaHeading')" :text="t('products.ctaText')" />
  </div>
</template>
