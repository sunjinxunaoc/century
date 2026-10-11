<template>
  <div v-if="product" class="bg-page pb-14">
    <BreadcrumbNav :items="[
      { label: 'Home', to: '/' },
      { label: 'Tyre Valves', to: '/products' },
      { label: sub.name, to: `/products/${sub.slug}` },
      { label: product.name },
    ]" />

    <section class="container-mi">
      <div class="mi-card grid gap-8 p-6 lg:grid-cols-2 lg:p-10">
        <div>
          <div
            class="group/gallery relative mb-3 flex h-[380px] items-center justify-center bg-white p-6"
            @mouseenter="pauseAutoplay"
            @mouseleave="resumeAutoplay"
          >
            <img :src="activeImage" :alt="product.name" class="max-h-full max-w-full object-contain" />
            <template v-if="gallery.length > 1">
              <button
                type="button"
                aria-label="Previous image"
                class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover/gallery:opacity-100"
                @click="prevImage"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover/gallery:opacity-100"
                @click="nextImage"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </template>
          </div>
          <div v-if="gallery.length > 1" class="flex gap-2 overflow-x-auto">
            <button
              v-for="(img, i) in gallery"
              :key="i"
              class="flex h-20 w-20 shrink-0 items-center justify-center border-2 bg-white p-1 transition-colors"
              :class="activeIndex === i ? 'border-brand' : 'border-transparent hover:border-black/20'"
              @click="goToImage(i)"
            >
              <img :src="img" :alt="`${product.name} ${i + 1}`" class="max-h-full max-w-full object-contain" loading="lazy" />
            </button>
          </div>
        </div>

        <div>
          <h1 class="mb-3 text-2xl font-bold leading-snug lg:text-3xl">{{ product.name }}</h1>
          <p class="mb-5 text-[14px] leading-relaxed text-muted">{{ product.tagline }}</p>

          <div class="mb-6 border-y border-black/5 py-4">
            <ul class="grid gap-2">
              <li v-for="(f, i) in product.features" :key="i" class="flex items-start gap-2 text-[13px] text-muted">
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                {{ f }}
              </li>
            </ul>
          </div>

          <div class="flex flex-wrap gap-3">
            <router-link to="/contact" class="rounded-sm bg-brand px-8 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-dark">
              Request Quote
            </router-link>
            <a
              :href="`https://api.whatsapp.com/send?phone=8615633632668&text=${encodeURIComponent('Hi, I am interested in ' + product.name)}`"
              target="_blank" rel="noopener"
              class="rounded-sm border border-[#25d366] px-8 py-3 text-[14px] font-medium text-[#25d366] transition-colors hover:bg-[#25d366] hover:text-white"
            >
              WhatsApp Inquiry
            </a>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
            <div class="bg-page px-2 py-3">
              <div class="text-[13px] font-semibold">MOQ</div>
              <div class="text-[12px] text-muted">Negotiable</div>
            </div>
            <div class="bg-page px-2 py-3">
              <div class="text-[13px] font-semibold">Packaging</div>
              <div class="text-[12px] text-muted">Custom / Bulk</div>
            </div>
            <div class="bg-page px-2 py-3">
              <div class="text-[13px] font-semibold">Lead Time</div>
              <div class="text-[12px] text-muted">7-20 days</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container-mi mt-6">
      <div class="mi-card p-6 lg:p-10">
        <h2 class="mb-4 text-[20px] font-semibold">Product Description</h2>
        <p class="max-w-4xl text-[14px] leading-relaxed text-muted">{{ product.desc }}</p>
      </div>
    </section>

    <section v-if="product.spec" class="container-mi mt-6">
      <div class="mi-card p-6 lg:p-10">
        <h2 class="mb-4 text-[20px] font-semibold">Specifications</h2>
        <SpecTable :spec="product.spec" />
      </div>
    </section>

    <section v-if="related.length" class="container-mi mt-10">
      <h2 class="mb-4 text-[20px] font-semibold">Related Products</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <ProductCard v-for="p in related" :key="p.slug" :product="p" :sub-slug="sub.slug" />
      </div>
    </section>

    <CtaSection class="mt-14" :title="`Need ${product.name}?`" />
  </div>

  <div v-else class="container-mi py-24 text-center">
    <h1 class="mb-4 text-2xl font-bold">Product Not Found</h1>
    <router-link to="/products" class="text-brand hover:underline">Back to all tyre valves</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getSubcategory, getProduct } from '../data/products'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import SpecTable from '../components/SpecTable.vue'
import ProductCard from '../components/ProductCard.vue'
import CtaSection from '../components/CtaSection.vue'

const route = useRoute()
const sub = computed(() => getSubcategory(route.params.sub))
const product = computed(() => getProduct(route.params.sub, route.params.slug))
const activeIndex = ref(0)

const gallery = computed(() => {
  const p = product.value
  if (!p) return []
  return p.images && p.images.length ? p.images : [p.image]
})

const activeImage = computed(() => gallery.value[activeIndex.value] || '')

let timer = null

function stopAutoplay() {
  if (timer) { clearInterval(timer); timer = null }
}

function startAutoplay() {
  stopAutoplay()
  if (typeof window !== 'undefined' && gallery.value.length > 1) {
    timer = setInterval(() => { nextImage() }, 3500)
  }
}

function pauseAutoplay() { stopAutoplay() }
function resumeAutoplay() { startAutoplay() }

function goToImage(i) {
  activeIndex.value = i
  startAutoplay()
}

function nextImage() {
  activeIndex.value = (activeIndex.value + 1) % gallery.value.length
}

function prevImage() {
  activeIndex.value = (activeIndex.value - 1 + gallery.value.length) % gallery.value.length
}

watch(product, () => {
  activeIndex.value = 0
  startAutoplay()
}, { immediate: true })

onUnmounted(stopAutoplay)

const related = computed(() => {
  if (!sub.value || !product.value) return []
  return sub.value.products.filter(p => p.slug !== product.value.slug).slice(0, 5)
})

useHead({
  title: () => product.value ? `${product.value.seoTitle || product.value.name} - AutoParts Century` : 'Product Not Found',
  meta: [
    { name: 'description', content: () => product.value?.tagline || '' },
    { name: 'keywords', content: () => product.value?.keywords || '' },
    { property: 'og:title', content: () => product.value?.name || '' },
    { property: 'og:description', content: () => product.value?.tagline || '' },
    { property: 'og:image', content: () => product.value ? `https://autopartscentury.com${product.value.image}` : '' },
  ],
  link: [{ rel: 'canonical', href: () => `https://autopartscentury.com/products/${route.params.sub}/${route.params.slug}/` }],
  script: [
    {
      type: 'application/ld+json',
      children: () => product.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value.name,
        description: product.value.tagline,
        image: `https://autopartscentury.com${product.value.image}`,
        sku: product.value.slug,
        mpn: product.value.name.split(' ')[0],
        brand: { '@type': 'Brand', name: 'AutoParts Century' },
        manufacturer: {
          '@type': 'Organization',
          name: 'AutoParts Century',
          url: 'https://autopartscentury.com/',
        },
        offers: {
          '@type': 'Offer',
          url: `https://autopartscentury.com/products/${route.params.sub}/${route.params.slug}/`,
          availability: 'https://schema.org/InStock',
          businessFunction: 'http://purl.org/goodrelations/v1#Sell',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'AutoParts Century' },
        },
      }) : '{}',
    },
  ],
})
</script>
