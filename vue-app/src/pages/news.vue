<script setup>
import PageHero from '../components/PageHero.vue'
import ArticleCard from '../components/ArticleCard.vue'
import CtaSection from '../components/CtaSection.vue'
import { articles } from '../data/articles'
import { useHead } from '@unhead/vue'

useHead({
  title: 'News & Product Guides | Century Auto Parts',
  meta: [
    { name: 'description', content: 'Latest news and product guides from Century Auto Parts - wheel weight guides, tyre valve guides, TPMS maintenance, tyre repair tips and ordering information.' },
    { property: 'og:title', content: 'News & Product Guides | Century Auto Parts' },
    { property: 'og:description', content: 'Latest news and product guides from Century Auto Parts - wheel weight guides, tyre valve guides, TPMS maintenance, tyre repair tips and ordering information.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://centurymanufacture.com/news/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'canonical', href: 'https://centurymanufacture.com/news/' },
  ],
})
</script>

<template>
  <div>
    <PageHero title="News" subtitle="Industry insights & product guides from Century Auto Parts" />
    <section class="py-16">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">Latest Articles</h2>
          <p class="section-subtitle">Practical guides and industry knowledge for tyre repair professionals and importers</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard v-for="a in articles" :key="a.slug" :article="a" />
        </div>
      </div>
    </section>
    <CtaSection heading="Questions About Our Products?" text="Contact our team for advice and factory-direct pricing." />
  </div>
</template>
