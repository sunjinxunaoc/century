<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { articles, hubTags, NEWS_PER_PAGE } from '../data/articles'
import PageHero from '../components/PageHero.vue'
import ArticleCard from '../components/ArticleCard.vue'
import Pagination from '../components/Pagination.vue'
import CtaSection from '../components/CtaSection.vue'

const route = useRoute()

const totalPages = computed(() => Math.max(1, Math.ceil(articles.length / NEWS_PER_PAGE)))
const currentPage = computed(() => {
  const p = parseInt(route.params.page, 10)
  return Math.min(totalPages.value, Math.max(1, isNaN(p) ? 1 : p))
})
const pageArticles = computed(() => {
  const start = (currentPage.value - 1) * NEWS_PER_PAGE
  return articles.slice(start, start + NEWS_PER_PAGE)
})

useHead(() => {
  const isPaged = totalPages.value > 1 && currentPage.value > 1
  const title = isPaged
    ? `News & Product Guides - Page ${currentPage.value} | Century Auto Parts`
    : 'News & Product Guides | Century Auto Parts'
  const desc = 'Latest news and product guides from Century Auto Parts - wheel weight guides, tyre valve guides, TPMS maintenance, tyre repair tips and ordering information.'
  const url = isPaged
    ? `https://centurymanufacture.com/news/page/${currentPage.value}/`
    : 'https://centurymanufacture.com/news/'

  const link = [{ rel: 'canonical', href: url }]
  if (totalPages.value > 1) {
    if (currentPage.value > 1) {
      link.push({
        rel: 'prev',
        href: currentPage.value === 2
          ? 'https://centurymanufacture.com/news/'
          : `https://centurymanufacture.com/news/page/${currentPage.value - 1}/`,
      })
    }
    if (currentPage.value < totalPages.value) {
      link.push({ rel: 'next', href: `https://centurymanufacture.com/news/page/${currentPage.value + 1}/` })
    }
  }

  return {
    title,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link,
  }
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
        <div class="flex flex-wrap justify-center gap-3 mb-10">
          <RouterLink
            v-for="t in hubTags"
            :key="t.slug"
            :to="`/news/tag/${t.slug}/`"
            class="tag hover:bg-orange-100 transition"
          >{{ t.name }} ({{ t.articles.length }})</RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard v-for="a in pageArticles" :key="a.slug" :article="a" />
        </div>
        <Pagination :current="currentPage" :total="totalPages" base-path="/news" />
      </div>
    </section>
    <CtaSection heading="Questions About Our Products?" text="Contact our team for advice and factory-direct pricing." />
  </div>
</template>
