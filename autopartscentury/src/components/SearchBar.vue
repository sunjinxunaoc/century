<template>
  <div ref="wrap" class="relative w-full lg:w-[220px] xl:w-[260px]">
    <form class="relative" @submit.prevent="go">
      <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input
        v-model="q"
        type="search"
        placeholder="Search tyre valves, e.g. TR414"
        class="w-full rounded-sm border border-black/10 bg-page py-2 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:bg-white"
        @focus="onFocus"
        @input="open = true"
      />
    </form>

    <div
      v-if="open && q.trim() && suggestions.length"
      class="absolute left-0 right-0 top-full z-50 mt-1 max-h-[420px] overflow-auto rounded-md border border-black/5 bg-white py-1 shadow-xl"
    >
      <router-link
        v-for="p in suggestions"
        :key="p.slug"
        :to="`/products/${p.sub}/${p.slug}`"
        class="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-page"
        @click="close"
      >
        <img :src="p.image" :alt="p.name" class="h-9 w-9 shrink-0 object-contain" loading="lazy" />
        <div class="min-w-0">
          <div class="truncate text-[13px] font-medium text-ink">{{ p.name }}</div>
          <div class="truncate text-[11px] text-muted">{{ p.subName }}</div>
        </div>
      </router-link>
      <router-link
        :to="`/search?q=${encodeURIComponent(q.trim())}`"
        class="block border-t border-black/5 px-3 py-2 text-center text-[12px] text-brand hover:bg-page"
        @click="close"
      >View all results ({{ results.length }})</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const q = ref('')
const open = ref(false)
const wrap = ref(null)
const index = shallowRef([])

let indexPromise = null
function loadIndex() {
  if (!indexPromise && typeof fetch !== 'undefined') {
    indexPromise = fetch('/search-index.json')
      .then(r => r.json())
      .then(data => { index.value = data })
      .catch(() => { indexPromise = null })
  }
  return indexPromise
}

function onFocus() {
  open.value = true
  loadIndex()
}

const results = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return []
  return index.value.filter(p =>
    p.name.toLowerCase().includes(s) ||
    (p.keywords || '').toLowerCase().includes(s) ||
    (p.tagline || '').toLowerCase().includes(s)
  )
})

const suggestions = computed(() => results.value.slice(0, 6))

function go() {
  if (!q.value.trim()) return
  router.push(`/search?q=${encodeURIComponent(q.value.trim())}`)
  close()
}

function close() {
  open.value = false
}

function onDocClick(e) {
  if (wrap.value && !wrap.value.contains(e.target)) open.value = false
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocClick)
}
</script>
