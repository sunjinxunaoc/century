<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { findCategory, findSubcategory, findProduct, relatedProducts, PAGE_SIZE } from '../data/products'
import PageHero from '../components/PageHero.vue'
import ProductSidebar from '../components/ProductSidebar.vue'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import ProductCard from '../components/ProductCard.vue'
import CategoryCard from '../components/CategoryCard.vue'
import SpecTable from '../components/SpecTable.vue'
import Pagination from '../components/Pagination.vue'
import CtaSection from '../components/CtaSection.vue'

const route = useRoute()
const categorySlug = computed(() => route.params.category)
const slug = computed(() => route.params.slug)
const currentPage = computed(() => Math.max(1, parseInt(route.params.page, 10) || 1))

const category = computed(() => findCategory(categorySlug.value))
const subcategory = computed(() => (slug.value ? findSubcategory(categorySlug.value, slug.value) : null))
const found = computed(() => (slug.value ? findProduct(categorySlug.value, slug.value) : null))
const product = computed(() => found.value?.product || null)
const related = computed(() => (product.value ? relatedProducts(categorySlug.value, product.value.slug, 3) : []))

const totalPages = computed(() => {
  const count = subcategory.value?.products?.length || 0
  return Math.max(1, Math.ceil(count / PAGE_SIZE))
})

const pagedProducts = computed(() => {
  const products = subcategory.value?.products || []
  const start = (currentPage.value - 1) * PAGE_SIZE
  return products.slice(start, start + PAGE_SIZE)
})

const pageType = computed(() => {
  if (product.value) return 'product'
  if (subcategory.value) return 'subcategory'
  return 'category'
})

const baseSubPath = computed(() => (category.value && subcategory.value ? `/products/${category.value.slug}/${subcategory.value.slug}` : ''))

const pageTitle = computed(() => {
  if (product.value) return product.value.name
  if (subcategory.value) return totalPages.value > 1 ? `${subcategory.value.name} - Page ${currentPage.value}` : subcategory.value.name
  return category.value?.name || 'Products'
})

const crumbs = computed(() => {
  const items = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
  ]
  if (category.value) items.push({ label: category.value.name, path: `/products/${category.value.slug}` })
  if (subcategory.value) items.push({ label: subcategory.value.name, path: baseSubPath.value })
  if (totalPages.value > 1 && pageType.value === 'subcategory') items.push({ label: `Page ${currentPage.value}` })
  if (product.value) items.push({ label: product.value.name })
  return items
})

const activeSubSlug = computed(() => found.value?.subcategory?.slug || subcategory.value?.slug || slug.value)

useHead(() => {
  const isSubPaged = pageType.value === 'subcategory' && totalPages.value > 1
  const baseUrl = `https://centurymanufacture.com${baseSubPath.value}`
  const url = isSubPaged && currentPage.value > 1
    ? `${baseUrl}/page/${currentPage.value}/`
    : `${baseUrl}/`
  const desc = product.value?.desc || subcategory.value?.desc || category.value?.intro || pageTitle.value
  const scripts = []
  if (product.value) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value.name,
        description: product.value.desc,
        category: category.value?.name,
        brand: { '@type': 'Brand', name: 'Century Auto Parts' },
        manufacturer: { '@type': 'Organization', name: 'Hebei Century Auto Parts Co., Ltd.' },
        url,
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
        item: c.path ? `https://centurymanufacture.com${c.path}${c.path.endsWith('/') ? '' : '/'}` : undefined,
      })),
    }),
  })
  const link = [
    { rel: 'canonical', href: url },
  ]
  if (isSubPaged) {
    if (currentPage.value > 1) link.push({ rel: 'prev', href: currentPage.value === 2 ? `${baseUrl}/` : `${baseUrl}/page/${currentPage.value - 1}/` })
    if (currentPage.value < totalPages.value) link.push({ rel: 'next', href: `${baseUrl}/page/${currentPage.value + 1}/` })
  }
  return {
    title: `${pageTitle.value} | Century Auto Parts`,
    meta: [
      { name: 'description', content: desc },
      { name: 'keywords', content: product.value?.keywords || category.value?.name || '' },
      { property: 'og:title', content: `${pageTitle.value} | Century Auto Parts` },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: product.value ? 'product' : 'website' },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link,
    script: scripts,
  }
})
</script>

<template>
  <div v-if="category">
    <PageHero :title="pageTitle" :subtitle="product?.tagline || category.tagline" />
    <section class="py-16">
      <div class="container-app">
        <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          <ProductSidebar :category="categorySlug" :subcategory="activeSubSlug" :product="slug" />
          <div class="min-w-0">
            <BreadcrumbNav :items="crumbs" />

            <!-- PRODUCT DETAIL -->
            <template v-if="pageType === 'product'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="rounded-lg overflow-hidden bg-gray-100 shadow-card">
                  <img src="/images/placeholder.svg" :alt="product.name" class="w-full aspect-[4/3] object-cover">
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-[#1A1A2E] mb-4">{{ product.name }}</h1>
                  <p class="text-gray-500 mb-5">{{ product.desc }}</p>
                  <ul class="list-disc ml-5 space-y-2 text-gray-600 mb-6">
                    <li v-for="f in product.features" :key="f">{{ f }}</li>
                  </ul>
                  <div class="flex gap-4">
                    <RouterLink to="/contact" class="btn btn-primary">Request Quote</RouterLink>
                    <a href="tel:+8615633632668" class="btn border border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white">Call +86 15633632668</a>
                  </div>
                </div>
              </div>

              <div class="mt-14">
                <div class="section-header text-left">
                  <h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">Specifications</h2>
                  <p class="text-gray-500">Detailed parameters for {{ product.name }}</p>
                </div>
                <SpecTable :headers="product.spec.headers" :rows="product.spec.rows" />
              </div>

              <div class="mt-14" v-if="related.length">
                <div class="section-header text-left">
                  <h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">Related Products</h2>
                  <p class="text-gray-500">Explore more related products</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <ProductCard v-for="r in related" :key="r.slug" :name="r.name" :desc="r.tagline" :href="`/products/${categorySlug}/${r.slug}`" />
                </div>
              </div>
            </template>

            <!-- SUB CATEGORY -->
            <template v-else-if="pageType === 'subcategory'">
              <div class="section-header text-left">
                <h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">Available Models</h2>
                <p class="text-gray-500">{{ subcategory.desc }}</p>
              </div>
              <template v-if="subcategory.products && subcategory.products.length">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <ProductCard v-for="p in pagedProducts" :key="p.slug" :name="p.name" :desc="p.tagline" :href="`/products/${categorySlug}/${p.slug}`" />
                </div>
                <Pagination :current="currentPage" :total="totalPages" :base-path="baseSubPath" />
              </template>
              <div v-else-if="subcategory.models" class="mt-6">
                <SpecTable :headers="['Model', 'Type', 'Material', 'Remarks']" :rows="subcategory.models.map(m => [m, 'Tyre valve', 'Metal', 'TBD'])" />
              </div>
            </template>

            <!-- CATEGORY -->
            <template v-else>
              <div class="section-header text-left">
                <h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">{{ category.name }}</h2>
                <p class="text-gray-500">{{ category.intro }}</p>
              </div>
              <div v-if="category.subcategories.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <CategoryCard v-for="sub in category.subcategories" :key="sub.slug" :title="sub.name" :desc="sub.desc" :href="`/products/${categorySlug}/${sub.slug}`" />
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="c in category.cards" :key="c.title" class="card reveal p-6 text-center">
                  <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">&#9672;</div>
                  <h3 class="font-semibold text-[#1A1A2E] mb-2">{{ c.title }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">{{ c.desc }}</p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
    <CtaSection :heading="`Need ${category.name}?`" />
  </div>
</template>
