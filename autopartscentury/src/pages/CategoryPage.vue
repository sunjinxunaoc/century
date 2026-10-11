<template>
  <div v-if="sub" class="bg-page pb-14">
    <BreadcrumbNav :items="[
      { label: 'Home', to: '/' },
      { label: 'Tyre Valves', to: '/products' },
      { label: sub.name },
    ]" />

    <section class="container-mi">
      <div class="mi-card mb-6 p-8">
        <h1 class="mb-3 text-3xl font-bold">{{ sub.name }}</h1>
        <p class="mb-5 max-w-3xl text-[15px] leading-relaxed text-muted">{{ sub.desc }}</p>
        <ul v-if="sub.highlights" class="grid gap-2 sm:grid-cols-2">
          <li v-for="(h, i) in sub.highlights" :key="i" class="flex items-start gap-2 text-[13px] text-muted">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            {{ h }}
          </li>
        </ul>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <ProductCard v-for="p in sub.products" :key="p.slug" :product="p" :sub-slug="sub.slug" />
      </div>
    </section>

    <section v-if="compareRows.length >= 3" class="container-mi mt-10">
      <div class="mi-card p-6 lg:p-10">
        <h2 class="mb-2 text-[20px] font-semibold">{{ sub.name }} - Size Comparison Table</h2>
        <p class="mb-4 text-[13px] text-muted">All models in this category with key dimensions. Click a model number for full details.</p>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[560px] border-collapse text-[13px]">
            <thead>
              <tr class="bg-page">
                <th class="border border-black/10 px-4 py-3 text-left font-semibold">Model</th>
                <th class="border border-black/10 px-4 py-3 text-left font-semibold">A (mm)</th>
                <th class="border border-black/10 px-4 py-3 text-left font-semibold">B (mm)</th>
                <th class="border border-black/10 px-4 py-3 text-left font-semibold">Bend Angle</th>
                <th class="border border-black/10 px-4 py-3 text-left font-semibold">Rim Hole</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in compareRows" :key="i" class="transition-colors hover:bg-page/60">
                <td class="border border-black/10 px-4 py-3 font-medium">
                  <router-link :to="`/products/${sub.slug}/${row.slug}/`" class="text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:decoration-brand">{{ row.model }}</router-link>
                </td>
                <td class="border border-black/10 px-4 py-3 text-muted">{{ row.a }}</td>
                <td class="border border-black/10 px-4 py-3 text-muted">{{ row.b }}</td>
                <td class="border border-black/10 px-4 py-3 text-muted">{{ row.angle }}</td>
                <td class="border border-black/10 px-4 py-3 text-muted">{{ row.rim }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section v-if="sub.faqs" class="container-mi mt-12 max-w-3xl">
      <h2 class="mb-6 text-center text-[24px] font-semibold">Frequently Asked Questions</h2>
      <FaqSection :faqs="sub.faqs" />
    </section>

    <CtaSection class="mt-14" :title="`Need ${sub.name}?`" />
  </div>

  <div v-else class="container-mi py-24 text-center">
    <h1 class="mb-4 text-2xl font-bold">Category Not Found</h1>
    <router-link to="/products" class="text-brand hover:underline">Back to all tyre valves</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getSubcategory } from '../data/products'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import ProductCard from '../components/ProductCard.vue'
import FaqSection from '../components/FaqSection.vue'
import CtaSection from '../components/CtaSection.vue'

const route = useRoute()
const sub = computed(() => getSubcategory(route.params.sub))

const compareRows = computed(() => {
  if (!sub.value) return []
  const rows = []
  for (const p of sub.value.products) {
    if (!p.spec || !p.spec.headers) continue
    const model = p.name.split(' ')[0]
    const row = p.spec.rows.find(r => String(r[0]).replace(/\s*\(.*?\)\s*/g, '') === model)
    if (!row) continue
    const col = (re) => {
      const idx = p.spec.headers.findIndex(h => re.test(h))
      return idx > 0 ? String(row[idx] ?? '—') : '—'
    }
    rows.push({
      slug: p.slug,
      model,
      a: col(/^A\b/),
      b: col(/^B\b/),
      angle: col(/°|angle/i),
      rim: col(/rim/i),
    })
  }
  return rows.filter(r => [r.a, r.b, r.angle, r.rim].some(v => v !== '—'))
})

useHead({
  title: () => sub.value ? `${sub.value.seoTitle || sub.value.name} - AutoParts Century` : 'Category Not Found',
  meta: [
    { name: 'description', content: () => sub.value?.desc || '' },
    { name: 'keywords', content: () => sub.value?.keywords || '' },
  ],
  link: [{ rel: 'canonical', href: () => `https://autopartscentury.com/products/${route.params.sub}/` }],
  script: [
    {
      type: 'application/ld+json',
      children: () => sub.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: sub.value.name,
        description: sub.value.desc,
        url: `https://autopartscentury.com/products/${sub.value.slug}/`,
        isPartOf: { '@type': 'WebSite', name: 'AutoParts Century', url: 'https://autopartscentury.com/' },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: sub.value.products.length,
          itemListElement: sub.value.products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            url: `https://autopartscentury.com/products/${sub.value.slug}/${p.slug}/`,
          })),
        },
      }) : '{}',
    },
  ],
})
</script>
