<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
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

const canonicalPath = computed(() => {
  if (!category.value) return '/products'
  if (product.value) return `/products/${category.value.slug}/${product.value.slug}`
  if (subcategory.value) return `/products/${category.value.slug}/${subcategory.value.slug}`
  return `/products/${category.value.slug}`
})

const pageTitle = computed(() => {
  if (product.value) return product.value.name
  if (subcategory.value) return totalPages.value > 1 && currentPage.value > 1 ? `${subcategory.value.name} - Page ${currentPage.value}` : subcategory.value.name
  return category.value?.name || 'Products'
})

const crumbs = computed(() => {
  const items = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
  ]
  if (category.value) items.push({ label: category.value.name, path: `/products/${category.value.slug}` })
  if (subcategory.value) items.push({ label: subcategory.value.name, path: baseSubPath.value })
  if (totalPages.value > 1 && currentPage.value > 1 && pageType.value === 'subcategory') items.push({ label: `Page ${currentPage.value}` })
  if (product.value) items.push({ label: product.value.name })
  return items
})

const activeSubSlug = computed(() => found.value?.subcategory?.slug || subcategory.value?.slug || slug.value)

const gallery = computed(() => {
  const imgs = product.value?.images
  if (imgs && imgs.length) return imgs
  return product.value?.image ? [product.value.image] : []
})
const currentIndex = ref(0)
const currentImage = computed(() => gallery.value[currentIndex.value] || gallery.value[0] || '/images/placeholder.svg')
function prevImage() {
  if (gallery.value.length < 2) return
  currentIndex.value = (currentIndex.value - 1 + gallery.value.length) % gallery.value.length
}
function nextImage() {
  if (gallery.value.length < 2) return
  currentIndex.value = (currentIndex.value + 1) % gallery.value.length
}
function goToImage(i) {
  currentIndex.value = i
}
watch(() => product.value?.slug, () => { currentIndex.value = 0 })

const zoomOpen = ref(false)
function openZoom() {
  zoomOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeZoom() {
  zoomOpen.value = false
  document.body.style.overflow = ''
}
function onKeydown(e) {
  if (e.key === 'Escape') closeZoom()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

useHead(() => {
  const isSubPaged = pageType.value === 'subcategory' && totalPages.value > 1
  const baseUrl = `https://centurymanufacture.com${canonicalPath.value}`
  const url = isSubPaged && currentPage.value > 1
    ? `${baseUrl}/page/${currentPage.value}/`
    : `${baseUrl}/`
  const desc = product.value?.desc || subcategory.value?.desc || category.value?.intro || pageTitle.value
  const tagline = product.value?.tagline || subcategory.value?.tagline || category.value?.tagline || ''
  const catName = category.value?.name || ''
  const name = product.value?.name || subcategory.value?.name || ''

  let srcDesc = desc
  const parts = [name, catName, tagline].filter(p => p && p.length > 3)
  for (const p of parts) {
    if (srcDesc.length >= 120) break
    srcDesc = `${srcDesc.trim()}${p ? ' ' + p : ''}`
  }

  const metaDesc = srcDesc.length > 152
    ? `${srcDesc.slice(0, 152).replace(/\s+\S*$/, '').replace(/[\.\s]+$/, '')}...`
    : srcDesc.trim()
  const scripts = []
  if (product.value) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value.name,
        description: product.value.desc,
        ...(product.value.image ? { image: `https://centurymanufacture.com${product.value.image}` } : {}),
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
      { name: 'description', content: metaDesc },
      { name: 'keywords', content: product.value?.keywords || category.value?.name || '' },
      { property: 'og:title', content: `${pageTitle.value} | Century Auto Parts` },
      { property: 'og:description', content: metaDesc },
      { property: 'og:type', content: product.value ? 'product' : 'website' },
      { property: 'og:url', content: url },
      ...(product.value?.image ? [{ property: 'og:image', content: `https://centurymanufacture.com${product.value.image}` }] : []),
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
              <div class="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 lg:gap-14 items-start">
                <div class="rounded-lg overflow-hidden bg-gray-100 shadow-card">
                  <div class="relative">
                    <button type="button" class="group relative block w-full cursor-zoom-in" @click="openZoom" aria-label="Enlarge product image">
                      <img :src="currentImage" :alt="product.name" class="w-full h-auto object-contain block transition-transform duration-300 group-hover:scale-105">
                      <span class="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="inline-flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded">&#128269; Click to enlarge</span>
                      </span>
                    </button>
                    <template v-if="gallery.length > 1">
                      <button type="button" class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white text-xl hover:bg-black/60" @click="prevImage" aria-label="Previous image">&#8249;</button>
                      <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white text-xl hover:bg-black/60" @click="nextImage" aria-label="Next image">&#8250;</button>
                      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        <button v-for="(img, i) in gallery" :key="img" type="button" class="h-2 rounded-full transition-all" :class="i === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/50'" @click="goToImage(i)" :aria-label="`Image ${i + 1}`"></button>
                      </div>
                    </template>
                  </div>
                </div>

                <div class="lg:sticky lg:top-24">
                  <h1 class="text-2xl md:text-3xl font-bold text-[#1A1A2E] leading-tight">{{ product.name }}</h1>
                  <p v-if="product.tagline" class="text-[#FF6B00] font-medium mt-2">{{ product.tagline }}</p>
                  <div class="w-12 h-0.5 bg-[#FF6B00] mt-4 mb-5"></div>
                  <p class="text-gray-500 leading-relaxed">{{ product.desc }}</p>

                  <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    <div v-for="f in product.features" :key="f" class="flex items-start gap-2.5 text-gray-600">
                      <svg class="w-5 h-5 shrink-0 text-[#FF6B00] mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                      <span>{{ f }}</span>
                    </div>
                  </div>

                  <div class="mt-8 pt-6 border-t border-gray-200">
                    <div class="flex flex-col sm:flex-row gap-3">
                      <RouterLink to="/contact" class="btn btn-primary btn-large flex-1 justify-center">Request Quote</RouterLink>
                      <a href="https://api.whatsapp.com/send?phone=8615633632668&text=Hello, I'm interested in {{ product.name }}" target="_blank" rel="noopener" class="btn btn-large flex-1 justify-center border-2 border-[#25D366] text-[#128C7E] hover:bg-[#25D366] hover:text-white">
                        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    </div>
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
                  <ProductCard v-for="r in related" :key="r.slug" :name="r.name" :desc="r.tagline" :image="r.image" :href="`/products/${categorySlug}/${r.slug}`" />
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
                  <ProductCard v-for="p in pagedProducts" :key="p.slug" :name="p.name" :desc="p.tagline" :image="p.image" :href="`/products/${categorySlug}/${p.slug}`" />
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

    <Teleport to="body">
      <div v-if="zoomOpen" class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 p-4 md:p-10" @click.self="closeZoom">
        <img :src="currentImage" :alt="product?.name" class="max-w-full max-h-full object-contain shadow-2xl">
        <button v-if="gallery.length > 1" type="button" class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20" @click="prevImage" aria-label="Previous image">&#8249;</button>
        <button v-if="gallery.length > 1" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20" @click="nextImage" aria-label="Next image">&#8250;</button>
        <button type="button" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20" @click="closeZoom" aria-label="Close">&times;</button>
      </div>
    </Teleport>
  </div>
</template>
