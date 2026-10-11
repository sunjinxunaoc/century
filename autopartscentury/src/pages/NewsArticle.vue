<template>
  <div v-if="article" class="bg-page pb-14">
    <BreadcrumbNav :items="[{ label: 'Home', to: '/' }, { label: 'News', to: '/news' }, { label: article.title }]" />

    <section class="container-mi max-w-4xl">
      <div class="mi-card p-8 sm:p-10">
        <div class="mb-2 text-[12px] text-muted">{{ article.date }}</div>
        <h1 class="mb-6 text-2xl font-bold leading-snug sm:text-3xl">{{ article.title }}</h1>
        <img :src="article.image" :alt="article.title" class="mb-8 w-full rounded-md object-cover" loading="eager" />

        <div v-for="(s, i) in article.sections" :key="i" class="mb-6">
          <h2 class="mb-2 text-[18px] font-semibold text-ink">{{ s.h2 }}</h2>
          <p v-for="(p, j) in s.paras" :key="j" class="text-[14px] leading-relaxed text-muted">{{ p }}</p>
        </div>

        <div class="mt-8 rounded-md bg-page p-5 text-[14px]">
          <span class="font-medium text-ink">Looking for a factory-direct tyre valve supplier?</span>
          <router-link to="/contact" class="ml-2 font-medium text-brand hover:underline">Contact us for a quote within 24 hours &rarr;</router-link>
        </div>
      </div>

      <section class="mt-10">
        <h2 class="mb-6 text-[22px] font-semibold">Frequently Asked Questions</h2>
        <FaqSection :faqs="article.faqs" />
      </section>
    </section>

    <CtaSection class="mt-14" />
  </div>
  <NotFound v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { getArticle } from '../data/news'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import FaqSection from '../components/FaqSection.vue'
import CtaSection from '../components/CtaSection.vue'
import NotFound from './NotFound.vue'

const route = useRoute()
const article = computed(() => getArticle(route.params.slug))

useHead({
  title: () => article.value ? `${article.value.seoTitle} - AutoParts Century` : 'News - AutoParts Century',
  meta: [
    { name: 'description', content: () => article.value?.desc || '' },
    { name: 'keywords', content: () => article.value?.keywords || '' },
    { property: 'og:title', content: () => article.value?.seoTitle || '' },
    { property: 'og:description', content: () => article.value?.desc || '' },
    { property: 'og:image', content: () => article.value ? `https://autopartscentury.com${article.value.image}` : '' },
  ],
  link: [{ rel: 'canonical', href: () => `https://autopartscentury.com/news/${route.params.slug}/` }],
  script: [
    {
      type: 'application/ld+json',
      children: () => article.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.value.title,
        description: article.value.desc,
        image: `https://autopartscentury.com${article.value.image}`,
        datePublished: article.value.date,
        dateModified: article.value.date,
        author: { '@type': 'Organization', name: 'AutoParts Century', url: 'https://autopartscentury.com/' },
        publisher: {
          '@type': 'Organization',
          name: 'AutoParts Century',
          url: 'https://autopartscentury.com/',
          logo: { '@type': 'ImageObject', url: 'https://autopartscentury.com/images/logo/logo-icon-transparent.png' },
        },
        mainEntityOfPage: `https://autopartscentury.com/news/${article.value.slug}/`,
      }) : '{}',
    },
  ],
})
</script>
