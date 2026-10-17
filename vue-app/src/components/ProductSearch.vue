<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { categories } from '../data/products'

defineProps({
  placeholder: { type: String, default: 'Search products - e.g. adhesive wheel weight, TR414, TPMS...' },
})

const router = useRouter()
const q = ref('')
const open = ref(false)
const root = ref(null)

const allProducts = computed(() => {
  const out = []
  for (const cat of categories) {
    for (const sub of cat.subcategories || []) {
      for (const p of sub.products || []) {
        out.push({
          name: p.name,
          image: p.image,
          href: `/products/${cat.slug}/${p.slug}/`,
          context: `${cat.name} / ${sub.name}`,
          hay: `${p.name} ${p.keywords || ''} ${p.tagline || ''} ${cat.name} ${sub.name}`.toLowerCase(),
        })
      }
    }
  }
  return out
})

const terms = computed(() => q.value.toLowerCase().split(/\s+/).filter(Boolean))

const results = computed(() => {
  if (!terms.value.length) return []
  return allProducts.value.filter(p => terms.value.every(t => p.hay.includes(t)))
})

const top = computed(() => results.value.slice(0, 6))

function submit() {
  const v = q.value.trim()
  open.value = false
  router.push({ path: '/products/', query: v ? { q: v } : {} })
}

function onInput() {
  open.value = terms.value.length > 0
}

function onDocClick(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="relative">
    <form role="search" @submit.prevent="submit">
      <label for="product-search-inline" class="sr-only">Search products</label>
      <div class="relative">
        <input
          id="product-search-inline"
          v-model="q"
          type="search"
          autocomplete="off"
          :placeholder="placeholder"
          class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-200 bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 outline-none transition"
          @focus="onInput"
          @input="onInput"
          @keydown.escape="open = false"
        >
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
      </div>
    </form>

    <div v-if="open && terms.length" class="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
      <ul v-if="top.length" class="max-h-[60vh] overflow-y-auto">
        <li v-for="p in top" :key="p.href">
          <RouterLink :to="p.href" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50" @click="open = false">
            <img :src="p.image" :alt="p.name" width="40" height="40" loading="lazy" decoding="async" class="w-10 h-10 rounded object-contain bg-gray-100 shrink-0">
            <span class="min-w-0">
              <span class="block text-sm font-medium text-[#1A1A2E] truncate">{{ p.name }}</span>
              <span class="block text-xs text-gray-400 truncate">{{ p.context }}</span>
            </span>
          </RouterLink>
        </li>
      </ul>
      <button v-if="top.length" type="button" class="w-full text-left px-4 py-2.5 text-sm font-medium text-[#FF6B00] hover:bg-gray-50 border-t border-gray-100" @click="submit">
        View all {{ results.length }} result{{ results.length === 1 ? '' : 's' }} for "{{ q }}"
      </button>
      <p v-else class="px-4 py-3 text-sm text-gray-500">No products matched. Try "wheel weight", "valve" or "TPMS".</p>
    </div>
  </div>
</template>
