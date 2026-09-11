<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollHeader } from '../composables/useScrollHeader'
import { categories } from '../data/products'

const { shadowed } = useScrollHeader()
const navOpen = ref(false)
const openMobile = ref(new Set())

const productsNav = categories.map((cat) => {
  const children = []
  for (const sub of cat.subcategories || []) {
    const products = (sub.products || []).map((p) => ({
      label: p.name,
      path: `/products/${cat.slug}/${p.slug}`,
    }))
    children.push({
      label: sub.name,
      path: `/products/${cat.slug}/${sub.slug}`,
      children: products.length ? products : undefined,
    })
  }
  for (const card of cat.cards || []) {
    children.push({ label: card.title, path: `/products/${cat.slug}` })
  }
  return {
    label: cat.name,
    path: `/products/${cat.slug}`,
    children: children.length ? children : undefined,
  }
})


function toggleMobile(key) {  const set = new Set(openMobile.value)
  if (set.has(key)) set.delete(key)
  else set.add(key)
  openMobile.value = set
}

function closeNav() {
  navOpen.value = false
  openMobile.value = new Set()
}

function onNavLinkClick() {
  if (window.innerWidth <= 768) closeNav()
}

onMounted(() => {
  const handler = () => { if (window.innerWidth > 768) closeNav() }
  window.addEventListener('resize', handler)
  onUnmounted(() => window.removeEventListener('resize', handler))
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur border-b border-black/5 transition-shadow"
    :class="shadowed ? 'shadow-lg' : 'shadow-md'">
    <div class="container-app">
      <div class="flex items-center justify-between py-3.5">
        <RouterLink to="/" class="flex items-center gap-2.5">
          <img src="/ctr.svg" alt="Century Auto Parts" class="h-10 w-auto object-contain">
          <span class="text-lg font-bold tracking-wider text-[#1A1A2E]">CENTURY<span class="text-[#E8590C]">AUTO</span></span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:block">
          <ul class="flex gap-6">
            <li><RouterLink to="/" class="nav-link" exact-active-class="active">Home</RouterLink></li>
            <li><RouterLink to="/about" class="nav-link" active-class="active">About Us</RouterLink></li>
            <li class="group relative">
              <RouterLink to="/products" class="nav-link" active-class="active">Products <span class="text-xs">&#9662;</span></RouterLink>
              <ul class="dropdown-menu">
                <li v-for="p in productsNav" :key="p.path" class="relative group/sub">
                  <template v-if="p.children">
                    <RouterLink :to="p.path" class="dropdown-item flex items-center justify-between">{{ p.label }} <span class="text-xs">&#9656;</span></RouterLink>
                    <ul class="dropdown-submenu">
                      <li v-for="c in p.children" :key="c.path" class="relative group/sub2">
                        <template v-if="c.children">
                          <RouterLink :to="c.path" class="dropdown-item flex items-center justify-between">{{ c.label }} <span class="text-xs">&#9656;</span></RouterLink>
                          <ul class="dropdown-submenu">
                            <li v-for="prod in c.children" :key="prod.path"><RouterLink :to="prod.path" class="dropdown-item">{{ prod.label }}</RouterLink></li>
                          </ul>
                        </template>
                        <RouterLink v-else :to="c.path" class="dropdown-item">{{ c.label }}</RouterLink>
                      </li>
                    </ul>
                  </template>
                  <RouterLink v-else :to="p.path" class="dropdown-item">{{ p.label }}</RouterLink>
                </li>
              </ul>
            </li>
            <li><RouterLink to="/news" class="nav-link" active-class="active">News</RouterLink></li>
            <li><RouterLink to="/contact" class="nav-link" active-class="active">Contact</RouterLink></li>
          </ul>
        </nav>

        <!-- Mobile toggle -->
        <button class="md:hidden flex flex-col gap-1.5 p-1.5" aria-label="Toggle navigation" @click="navOpen = !navOpen">
          <span class="w-6 h-0.5 bg-[#1A1A2E] rounded transition-transform" :class="{ 'rotate-45 translate-y-2': navOpen }"></span>
          <span class="w-6 h-0.5 bg-[#1A1A2E] rounded transition-opacity" :class="{ 'opacity-0': navOpen }"></span>
          <span class="w-6 h-0.5 bg-[#1A1A2E] rounded transition-transform" :class="{ '-rotate-45 -translate-y-2': navOpen }"></span>
        </button>
      </div>

      <!-- Mobile nav -->
      <div v-show="navOpen" class="md:hidden pb-4">
        <ul class="flex flex-col gap-2">
          <li><RouterLink to="/" class="mobile-link" exact-active-class="active" @click="closeNav">Home</RouterLink></li>
          <li><RouterLink to="/about" class="mobile-link" active-class="active" @click="closeNav">About Us</RouterLink></li>
          <li>
            <div class="flex items-center justify-between">
              <RouterLink to="/products" class="mobile-link" active-class="active" @click="onNavLinkClick">Products</RouterLink>
              <button class="px-3 py-1 text-[#FF6B00]" @click="toggleMobile('products')">&#9662;</button>
            </div>
            <ul v-show="openMobile.has('products')" class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3">
              <li v-for="p in productsNav" :key="p.label">
                <template v-if="p.children">
                  <div class="flex items-center justify-between">
                    <RouterLink :to="p.path" class="mobile-link" active-class="active" @click="onNavLinkClick">{{ p.label }}</RouterLink>
                    <button class="px-2 text-[#FF6B00]" @click="toggleMobile(p.label)">&#9662;</button>
                  </div>
                  <ul v-show="openMobile.has(p.label)" class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3">
                    <li v-for="c in p.children" :key="c.path">
                      <template v-if="c.children">
                        <div class="flex items-center justify-between">
                          <RouterLink :to="c.path" class="mobile-link" active-class="active" @click="onNavLinkClick">{{ c.label }}</RouterLink>
                          <button class="px-2 text-[#FF6B00]" @click="toggleMobile(c.label)">&#9662;</button>
                        </div>
                        <ul v-show="openMobile.has(c.label)" class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3">
                          <li v-for="prod in c.children" :key="prod.path">
                            <RouterLink :to="prod.path" class="mobile-link" active-class="active" @click="closeNav">{{ prod.label }}</RouterLink>
                          </li>
                        </ul>
                      </template>
                      <RouterLink v-else :to="c.path" class="mobile-link" active-class="active" @click="closeNav">{{ c.label }}</RouterLink>
                    </li>
                  </ul>
                </template>
                <RouterLink v-else :to="p.path" class="mobile-link" active-class="active" @click="closeNav">{{ p.label }}</RouterLink>
              </li>
            </ul>
          </li>
          <li><RouterLink to="/news" class="mobile-link" active-class="active" @click="closeNav">News</RouterLink></li>
          <li><RouterLink to="/contact" class="mobile-link" active-class="active" @click="closeNav">Contact</RouterLink></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  @apply font-medium text-gray-600 px-3 py-2 rounded relative transition-colors hover:bg-orange-50 hover:text-[#FF6B00];
}
.nav-link.active {
  @apply text-[#FF6B00];
}
.nav-link.active::after {
  content: '';
  @apply absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF6B00];
}
.dropdown-menu {
  @apply hidden absolute top-full left-0 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-card-lg p-2 z-50;
}
.group:hover > .dropdown-menu {
  @apply block;
}
.group\/sub:hover > .dropdown-submenu {
  @apply block;
}
.group\/sub2:hover > .dropdown-submenu {
  @apply block;
}
.dropdown-item {
  @apply block px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap rounded hover:bg-orange-50 hover:text-[#FF6B00];
}
.dropdown-submenu {
  @apply hidden absolute top-0 left-full ml-0 min-w-[220px] bg-white border border-gray-200 rounded-lg shadow-card-lg p-2 z-50;
}
.group\/sub:hover > .dropdown-submenu {
  @apply block;
}
.mobile-link {
  @apply block py-2.5 px-3 text-gray-700 rounded hover:bg-orange-50;
}
.mobile-link.active {
  @apply text-[#FF6B00] font-semibold;
}
</style>
