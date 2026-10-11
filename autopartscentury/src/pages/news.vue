<template>
  <div class="bg-page pb-14">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'News' }]" />

    <section class="container-mi">
      <div class="mi-card mb-6 p-8">
        <h1 class="mb-3 text-3xl font-bold">News & Insights</h1>
        <p class="max-w-3xl text-[15px] leading-relaxed text-muted">
          Buying guides, quality standards and industry insights for tyre valve importers, wholesalers and distributors.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <router-link
          v-for="a in articles"
          :key="a.slug"
          :to="`/news/${a.slug}`"
          class="mi-card group flex flex-col overflow-hidden p-0"
        >
          <div class="h-44 overflow-hidden">
            <img :src="a.image" :alt="a.title" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="flex flex-1 flex-col p-6">
            <div class="mb-2 text-[12px] text-muted">{{ a.date }}</div>
            <h2 class="mb-2 text-[18px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand">{{ a.title }}</h2>
            <p class="mb-4 flex-1 text-[13px] leading-relaxed text-muted">{{ a.excerpt }}</p>
            <div class="text-[13px] font-medium text-brand">Read More &rarr;</div>
          </div>
        </router-link>
      </div>
    </section>

    <CtaSection class="mt-14" />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { articles } from '../data/news'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import CtaSection from '../components/CtaSection.vue'

useHead({
  title: 'News & Insights - Century AutoParts',
  meta: [
    { name: 'description', content: 'Tyre valve buying guides, quality standards and industry insights for importers and distributors: wholesale, bulk purchasing, supplier verification and OEM tips.' },
    { name: 'keywords', content: 'tyre valves manufacturer, tubeless tire valves wholesale, auto tire valve stems bulk, auto tire valve stems supplier' },
  ],
  link: [{ rel: 'canonical', href: 'https://autopartscentury.com/news/' }],
})
</script>
