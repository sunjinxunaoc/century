<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getArticles, getHubTags, NEWS_PER_PAGE } from '../data/localize'
import PageHero from '../components/PageHero.vue'
import ArticleCard from '../components/ArticleCard.vue'
import Pagination from '../components/Pagination.vue'
import CtaSection from '../components/CtaSection.vue'
import { useI18n, absoluteUrl } from '../i18n'

const route = useRoute()
const { t, locale, p } = useI18n()

const articles = computed(() => getArticles(locale.value))
const hubTags = computed(() => getHubTags(locale.value))

const totalPages = computed(() => Math.max(1, Math.ceil(articles.value.length / NEWS_PER_PAGE)))
const currentPage = computed(() => {
  const page = parseInt(route.params.page, 10)
  return Math.min(totalPages.value, Math.max(1, isNaN(page) ? 1 : page))
})
const pageArticles = computed(() => {
  const start = (currentPage.value - 1) * NEWS_PER_PAGE
  return articles.value.slice(start, start + NEWS_PER_PAGE)
})

useHead(() => {
  const isPaged = totalPages.value > 1 && currentPage.value > 1
  const title = isPaged
    ? t('news.seoTitlePaged', { page: currentPage.value })
    : t('news.seoTitle')
  const desc = isPaged
    ? t('news.seoDescriptionPaged', { page: currentPage.value })
    : t('news.seoDescription')
  const url = isPaged
    ? absoluteUrl(`/news/page/${currentPage.value}/`)
    : absoluteUrl('/news/')

  const link = [{ rel: 'canonical', href: url }]
  if (totalPages.value > 1) {
    if (currentPage.value > 1) {
      link.push({
        rel: 'prev',
        href: currentPage.value === 2
          ? absoluteUrl('/news/')
          : absoluteUrl(`/news/page/${currentPage.value - 1}/`),
      })
    }
    if (currentPage.value < totalPages.value) {
      link.push({ rel: 'next', href: absoluteUrl(`/news/page/${currentPage.value + 1}/`) })
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
      { property: 'og:image', content: 'https://centurymanufacture.com/images/factory.webp' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://centurymanufacture.com/images/factory.webp' },
    ],
    link,
  }
})
</script>

<template>
  <div>
    <PageHero :title="t('news.heroTitle')" :subtitle="t('news.heroSubtitle')" />
    <section class="py-16">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ t('news.latest') }}</h2>
          <p class="section-subtitle">{{ t('news.latestSub') }}</p>
        </div>
        <div class="flex flex-wrap justify-center gap-3 mb-10">
          <RouterLink
            v-for="tag in hubTags"
            :key="tag.slug"
            :to="p(`/news/tag/${tag.slug}/`)"
            class="tag hover:bg-orange-100 transition"
          >{{ tag.name }} ({{ tag.articles.length }})</RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard v-for="a in pageArticles" :key="a.slug" :article="a" />
        </div>
        <Pagination :current="currentPage" :total="totalPages" :base-path="p('/news')" />
      </div>
    </section>
    <CtaSection :heading="t('news.ctaHeading')" :text="t('news.ctaText')" />
  </div>
</template>
