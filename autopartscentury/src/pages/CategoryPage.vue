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

useHead({
  title: () => sub.value ? `${sub.value.seoTitle || sub.value.name} - AutoParts Century` : 'Category Not Found',
  meta: [
    { name: 'description', content: () => sub.value?.desc || '' },
    { name: 'keywords', content: () => sub.value?.keywords || '' },
  ],
  link: [{ rel: 'canonical', href: () => `https://autopartscentury.com/products/${route.params.sub}/` }],
})
</script>
