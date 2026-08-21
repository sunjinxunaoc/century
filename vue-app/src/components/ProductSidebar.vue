<script setup>
import { ref, watch } from 'vue'
import { categories } from '../data/products'

const props = defineProps({
  category: { type: String, default: '' },
  subcategory: { type: String, default: '' },
  product: { type: String, default: '' },
})

const openCats = ref(new Set())
const openSubs = ref(new Set())
const collapsed = ref(true)

function syncFromRoute() {
  const cats = new Set(openCats.value)
  const subs = new Set(openSubs.value)
  if (props.category) cats.add(props.category)
  if (props.subcategory) subs.add(props.subcategory)
  openCats.value = cats
  openSubs.value = subs
}
syncFromRoute()
watch(() => [props.category, props.subcategory], syncFromRoute)

function openCat(slug) {
  const next = new Set(openCats.value)
  next.add(slug)
  openCats.value = next
}
function toggleCat(slug) {
  const next = new Set(openCats.value)
  if (next.has(slug)) next.delete(slug)
  else next.add(slug)
  openCats.value = next
}
function openSub(slug) {
  const next = new Set(openSubs.value)
  next.add(slug)
  openSubs.value = next
}
function toggleSub(slug) {
  const next = new Set(openSubs.value)
  if (next.has(slug)) next.delete(slug)
  else next.add(slug)
  openSubs.value = next
}
</script>

<template>
  <aside class="sidebar">
    <button
      type="button"
      class="lg:hidden w-full flex items-center justify-between sidebar-title sidebar-toggle"
      aria-expanded="!collapsed"
      @click="collapsed = !collapsed"
    >
      <span>Browse Categories</span>
      <span class="sidebar-chevron" :class="{ open: !collapsed }">&#9656;</span>
    </button>
    <div :class="collapsed ? 'hidden lg:block' : ''">
      <h4 class="sidebar-title">Products</h4>
      <ul class="flex flex-col gap-0.5">
      <li><RouterLink to="/products" class="sidebar-link" :class="{ active: !category }">All Products</RouterLink></li>
      <li v-for="cat in categories" :key="cat.slug">
        <div class="flex items-center gap-0.5">
          <RouterLink
            :to="`/products/${cat.slug}`"
            class="sidebar-link flex-1 font-semibold"
            :class="{ active: category === cat.slug && !subcategory }"
            @click="openCat(cat.slug)"
          >{{ cat.name }}</RouterLink>
          <button
            v-if="cat.subcategories.length"
            type="button"
            class="sidebar-chevron"
            :class="{ open: openCats.has(cat.slug) }"
            :aria-label="`Toggle ${cat.name}`"
            @click="toggleCat(cat.slug)"
          >&#9656;</button>
        </div>
        <ul v-if="cat.subcategories.length && openCats.has(cat.slug)" class="ml-3 border-l-2 border-orange-200 pl-2 flex flex-col gap-0.5">
          <li v-for="sub in cat.subcategories" :key="sub.slug">
            <template v-if="sub.products && sub.products.length">
              <div class="flex items-center gap-0.5">
                <RouterLink
                  :to="`/products/${cat.slug}/${sub.slug}`"
                  class="sidebar-link flex-1 font-medium"
                  :class="{ active: subcategory === sub.slug && !product }"
                  @click="openSub(sub.slug)"
                >{{ sub.name }}</RouterLink>
                <button
                  type="button"
                  class="sidebar-chevron"
                  :class="{ open: openSubs.has(sub.slug) }"
                  :aria-label="`Toggle ${sub.name}`"
                  @click="toggleSub(sub.slug)"
                >&#9656;</button>
              </div>
              <ul v-if="openSubs.has(sub.slug)" class="ml-3 border-l-2 border-orange-200 pl-2 flex flex-col gap-0.5">
                <li v-for="p in sub.products" :key="p.slug">
                  <RouterLink :to="`/products/${cat.slug}/${p.slug}`" class="sidebar-link" :class="{ active: product === p.slug }">{{ p.name }}</RouterLink>
                </li>
              </ul>
            </template>
            <RouterLink v-else :to="`/products/${cat.slug}/${sub.slug}`" class="sidebar-link" :class="{ active: subcategory === sub.slug }">{{ sub.name }}</RouterLink>
          </li>
        </ul>
      </li>
    </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-toggle {
  cursor: pointer;
  margin-bottom: 0.25rem;
}
.sidebar-chevron {
  font-size: 0.7em;
  color: #FF6B00;
  padding: 0 6px;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;
  flex-shrink: 0;
  transition: transform 200ms ease;
}
.sidebar-chevron.open {
  transform: rotate(90deg);
}
</style>
