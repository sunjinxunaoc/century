<template>
  <div class="bg-page pb-14">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'Tyre Valves' }]" />

    <section class="container-mi">
      <div class="mi-card mb-6 p-8">
        <h1 class="mb-3 text-3xl font-bold">Tyre Valves</h1>
        <p class="mb-5 max-w-3xl text-[15px] leading-relaxed text-muted">{{ category.intro }}</p>
        <ul class="grid gap-2 sm:grid-cols-2">
          <li v-for="(h, i) in category.highlights" :key="i" class="flex items-start gap-2 text-[13px] text-muted">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            {{ h }}
          </li>
        </ul>
      </div>

      <div v-for="sub in subcategories" :key="sub.slug" class="mb-8">
        <div class="mb-3 flex items-end justify-between">
          <div>
            <h2 class="text-[22px] font-semibold">{{ sub.name }}</h2>
            <p class="mt-1 text-[13px] text-muted">{{ sub.desc }}</p>
          </div>
          <router-link :to="`/products/${sub.slug}`" class="shrink-0 text-[13px] text-muted transition-colors hover:text-brand">
            View All &rarr;
          </router-link>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <ProductCard v-for="p in sub.products" :key="p.slug" :product="p" :sub-slug="sub.slug" />
        </div>
      </div>
    </section>

    <section class="container-mi mt-4 max-w-3xl">
      <h2 class="mb-6 text-center text-[24px] font-semibold">Frequently Asked Questions</h2>
      <FaqSection :faqs="category.faqs" />
    </section>

    <CtaSection class="mt-14" />
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { category, subcategories } from '../data/products'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import ProductCard from '../components/ProductCard.vue'
import FaqSection from '../components/FaqSection.vue'
import CtaSection from '../components/CtaSection.vue'

useHead({
  title: `${category.seoTitle} - Century AutoParts`,
  meta: [
    { name: 'description', content: category.intro },
    { name: 'keywords', content: category.keywords },
    { property: 'og:title', content: category.seoTitle },
    { property: 'og:description', content: category.tagline },
  ],
  link: [{ rel: 'canonical', href: 'https://autopartscentury.com/products/' }],
})
</script>
