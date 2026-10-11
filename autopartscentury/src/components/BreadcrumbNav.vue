<template>
  <nav class="py-4 text-[13px] text-muted" aria-label="Breadcrumb">
    <div class="container-mi flex flex-wrap items-center gap-1">
      <template v-for="(item, i) in items" :key="i">
        <router-link v-if="item.to" :to="item.to" class="hover:text-brand">{{ item.label }}</router-link>
        <span v-else class="text-ink">{{ item.label }}</span>
        <span v-if="i < items.length - 1" class="mx-1">/</span>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const props = defineProps({
  items: { type: Array, required: true },
})

const route = useRoute()
const BASE = 'https://autopartscentury.com'

const breadcrumbJson = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: props.items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    item: item.to ? `${BASE}${item.to === '/' ? '/' : item.to.replace(/\/?$/, '/')}` : `${BASE}${route.fullPath}`,
  })),
}))

useHead({
  script: [{ type: 'application/ld+json', children: breadcrumbJson }],
})
</script>
