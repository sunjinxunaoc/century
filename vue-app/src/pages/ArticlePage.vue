<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { articles, findArticle, hubTags, tagSlug } from '../data/articles'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import CtaSection from '../components/CtaSection.vue'

const route = useRoute()
const article = computed(() => findArticle(route.params.slug))

const hubTagSlugs = new Set(hubTags.map(t => t.slug))
const isHubTag = (name) => hubTagSlugs.has(tagSlug(name))

const crumbs = computed(() => [
  { label: 'Home', path: '/' },
  { label: 'News', path: '/news' },
  { label: article.value?.title || '' },
])

useHead(() => {
  const url = `https://centurymanufacture.com/news/${route.params.slug}/`
  const scripts = []
  if (article.value) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.value.title,
        description: article.value.desc,
        image: article.value.img ? `https://centurymanufacture.com${article.value.img}` : undefined,
        datePublished: article.value.dateISO,
        author: { '@id': 'https://centurymanufacture.com/#organization' },
        publisher: { '@id': 'https://centurymanufacture.com/#organization' },
        mainEntityOfPage: url,
      }),
    })
  }
  if (article.value?.faq?.length) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.value.faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }),
    })
  }
  scripts.push({
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.value.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        item: c.path ? `https://centurymanufacture.com${c.path}${c.path.endsWith('/') ? '' : '/'}` : url,
      })),
    }),
  })
  return {
    title: `${article.value?.title || 'News'} | Century Auto Parts`,
    meta: [
      { name: 'description', content: article.value?.desc || '' },
      { property: 'og:title', content: `${article.value?.title || 'News'} | Century Auto Parts` },
      { property: 'og:description', content: article.value?.desc || '' },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `https://centurymanufacture.com${article.value?.img || '/images/factory.webp'}` },
      { property: 'og:image:alt', content: article.value?.imgAlt || 'Century Auto Parts' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: `https://centurymanufacture.com${article.value?.img || '/images/factory.webp'}` },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
    script: scripts,
  }
})
</script>

<template>
  <div v-if="article">
    <section class="relative bg-gradient-to-br from-[#1A1A2E] via-[#2B2B45] to-[#4A2B1A] text-white">
      <div class="container-app py-20 md:py-24 text-center">
        <div class="text-3xl md:text-4xl font-bold mb-4">News</div>
        <p class="text-gray-300">Industry insights & product guides from Century Auto Parts</p>
      </div>
    </section>

    <article class="py-14">
      <div class="container-app max-w-4xl">
        <BreadcrumbNav :items="crumbs" />

        <header class="mb-8">
          <div class="flex flex-wrap gap-1.5 mb-3">
            <template v-for="t in article.tags" :key="t">
              <RouterLink v-if="isHubTag(t)" :to="`/news/tag/${tagSlug(t)}/`" class="tag hover:bg-orange-100 transition">{{ t }}</RouterLink>
              <span v-else class="tag">{{ t }}</span>
            </template>
          </div>
          <h1 class="text-3xl font-bold text-[#1A1A2E] leading-tight mb-4">{{ article.title }}</h1>
          <div class="text-sm text-gray-400">{{ article.date }} &middot; By Century Auto Parts</div>
        </header>

        <div class="rounded-lg overflow-hidden shadow-card mb-10">
          <img :src="article.img" :alt="article.imgAlt" width="1600" height="686" fetchpriority="high" decoding="async" class="w-full aspect-[21/9] object-cover">
        </div>

        <div class="article-content" v-html="article.content"></div>

        <div v-if="article.faq && article.faq.length" class="mt-10">
          <h2 class="text-2xl font-bold text-[#1A1A2E] mb-5">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <div v-for="f in article.faq" :key="f.q" class="card p-6">
              <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ f.q }}</h3>
              <p class="text-gray-500 leading-relaxed">{{ f.a }}</p>
            </div>
          </div>
        </div>

        <footer class="mt-12 pt-6 border-t border-gray-200">
          <h3 class="text-xl font-bold text-[#1A1A2E] mb-5">Related Articles</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div v-for="r in article.related" :key="r.slug" class="card reveal p-5">
              <span class="tag mb-2 inline-block">{{ r.tag }}</span>
              <h4 class="font-semibold text-[#1A1A2E] mb-1 leading-snug">{{ r.title }}</h4>
              <div class="text-xs text-gray-400 mb-2">{{ r.date }}</div>
              <p class="text-sm text-gray-500 mb-3">{{ r.desc }}</p>
              <RouterLink :to="`/news/${r.slug}/`" class="text-[#FF6B00] text-sm font-medium hover:underline">Read More &rarr;</RouterLink>
            </div>
          </div>
          <div class="mt-8">
            <RouterLink to="/news/" class="btn border border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white">&#8592; Back to News</RouterLink>
          </div>
        </footer>
      </div>
    </article>
    <CtaSection heading="Questions About Our Products?" />
  </div>
</template>
