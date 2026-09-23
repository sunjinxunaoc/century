<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { tagBySlug, hubTags } from '../data/articles'
import PageHero from '../components/PageHero.vue'
import ArticleCard from '../components/ArticleCard.vue'
import CtaSection from '../components/CtaSection.vue'

const route = useRoute()
const tag = computed(() => tagBySlug(route.params.slug))
const list = computed(() => tag.value?.articles || [])
const others = computed(() => hubTags.filter(t => t.slug !== route.params.slug))

useHead(() => {
  if (!tag.value) {
    return { title: 'Topic Not Found | Century Auto Parts' }
  }
  const url = `https://centurymanufacture.com/news/tag/${tag.value.slug}/`
  const title = `${tag.value.name} Articles & Guides | Century Auto Parts`
  const desc = `Guides and articles about ${tag.value.name.toLowerCase()} from Century Auto Parts - practical factory-direct knowledge for tyre shops, distributors and importers.`
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
              url: `https://centurymanufacture.com/news/${a.slug}/`,
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
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://centurymanufacture.com/' },
            { '@type': 'ListItem', position: 2, name: 'News', item: 'https://centurymanufacture.com/news/' },
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
    <PageHero :title="tag.name" :subtitle="`${list.length} articles about ${tag.name.toLowerCase()} from Century Auto Parts`" />
    <section class="py-16">
      <div class="container-app">
        <div class="section-header">
          <h2 class="section-title">{{ tag.name }} Articles</h2>
          <p class="section-subtitle">Practical guides for tyre professionals, distributors and importers</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard v-for="a in list" :key="a.slug" :article="a" />
        </div>

        <div v-if="others.length" class="mt-16">
          <h2 class="section-title mb-5">Browse Other Topics</h2>
          <div class="flex flex-wrap gap-3">
            <RouterLink
              v-for="t in others"
              :key="t.slug"
              :to="`/news/tag/${t.slug}/`"
              class="tag hover:bg-orange-100 transition"
            >{{ t.name }} ({{ t.articles.length }})</RouterLink>
          </div>
        </div>
      </div>
    </section>
    <CtaSection heading="Need a Factory-Direct Quote?" text="Contact our team for pricing, samples and OEM packaging." />
  </div>

  <div v-else class="container-app py-24 text-center">
    <h1 class="text-2xl font-bold text-[#1A1A2E] mb-4">Topic not found</h1>
    <RouterLink to="/news/" class="btn btn-primary">Back to News</RouterLink>
  </div>
</template>
