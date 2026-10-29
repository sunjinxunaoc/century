<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { tagBySlug, getHubTags } from '../data/localize'
import PageHero from '../components/PageHero.vue'
import ArticleCard from '../components/ArticleCard.vue'
import CtaSection from '../components/CtaSection.vue'
import { useI18n, absoluteUrl } from '../i18n'

const route = useRoute()
const { t, locale, p } = useI18n()

const tag = computed(() => tagBySlug(route.params.slug, locale.value))
const list = computed(() => tag.value?.articles || [])
const others = computed(() => getHubTags(locale.value).filter((item) => item.slug !== route.params.slug))

useHead(() => {
  if (!tag.value) {
    return { title: t('tag.notFoundTitle') }
  }
  const url = absoluteUrl(`/news/tag/${tag.value.slug}/`)
  const title = t('tag.title', { name: tag.value.name })
  const desc = t('tag.description', { name: tag.value.name })
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
    link: [
      { rel: 'canonical', href: url },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description: desc,
          url,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: list.value.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: a.title,
              url: absoluteUrl(`/news/${a.slug}/`),
            })),
          },
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('common.home'), item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: t('nav.news'), item: absoluteUrl('/news/') },
            { '@type': 'ListItem', position: 3, name: tag.value.name, item: url },
          ],
        }),
      },
    ],
  }
})
</script>

<template>
  <div v-if="tag">
    <PageHero :title="tag.name" :subtitle="t('tag.heroSubtitle', { count: list.length, name: tag.name })" />
    <section class="py-16">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ t('tag.articlesTitle', { name: tag.name }) }}</h2>
          <p class="section-subtitle">{{ t('tag.articlesSub') }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard v-for="a in list" :key="a.slug" :article="a" />
        </div>

        <div v-if="others.length" class="mt-16">
          <h2 class="section-title mb-5">{{ t('tag.browseOther') }}</h2>
          <div class="flex flex-wrap gap-3">
            <RouterLink
              v-for="item in others"
              :key="item.slug"
              :to="p(`/news/tag/${item.slug}/`)"
              class="tag hover:bg-orange-100 transition"
            >{{ item.name }} ({{ item.articles.length }})</RouterLink>
          </div>
        </div>
      </div>
    </section>
    <CtaSection :heading="t('tag.ctaHeading')" :text="t('tag.ctaText')" />
  </div>

  <div v-else class="container-app py-24 text-center">
    <h1 class="text-2xl font-bold text-[#1A1A2E] mb-4">{{ t('tag.notFound') }}</h1>
    <RouterLink :to="p('/news/')" class="btn btn-primary">{{ t('tag.backToNews') }}</RouterLink>
  </div>
</template>
