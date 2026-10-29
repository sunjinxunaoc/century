<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useScrollHeader } from '../composables/useScrollHeader'
import { getCategories } from '../data/localize'
import { useI18n } from '../i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { shadowed } = useScrollHeader()
const { t, locale, p } = useI18n()
const navOpen = ref(false)
const openMobile = ref(new Set())

const productsNav = computed(() =>
  getCategories(locale.value).map((cat) => {
    const children = []
    for (const sub of cat.subcategories || []) {
      children.push({ label: sub.name, path: p(`/products/${cat.slug}/${sub.slug}/`) })
    }
    for (const card of cat.cards || []) {
      children.push({ label: card.title, path: p(`/products/${cat.slug}/`) })
    }
    return {
      label: cat.name,
      path: p(`/products/${cat.slug}/`),
      children: children.length ? children : undefined,
    }
  })
)

function toggleMobile(key) {
  const set = new Set(openMobile.value)
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
      <div class="flex items-center justify-between py-6">
        <RouterLink :to="p('/')" class="flex items-center gap-3">
          <img src="/images/logo/logo-icon-transparent.png" alt="Century Auto Parts" width="64" height="64" class="h-14 w-auto object-contain">
          <span class="text-2xl md:text-3xl font-bold tracking-wider text-[#1A1A2E]">CENTURY<span class="text-[#E8590C]">AUTO</span></span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6">
          <ul class="flex gap-8">
            <li><RouterLink :to="p('/')" class="nav-link" exact-active-class="active">{{ t('nav.home') }}</RouterLink></li>
            <li><RouterLink :to="p('/about/')" class="nav-link" active-class="active">{{ t('nav.about') }}</RouterLink></li>
            <li class="group relative">
              <RouterLink :to="p('/products/')" class="nav-link" active-class="active">{{ t('nav.products') }} <span class="text-xs">&#9662;</span></RouterLink>
              <ul class="dropdown-menu">
                <li v-for="item in productsNav" :key="item.path" class="relative group/sub">
                  <template v-if="item.children">
                    <RouterLink :to="item.path" class="dropdown-item flex items-center justify-between">{{ item.label }} <span class="text-xs">&#9656;</span></RouterLink>
                    <ul class="dropdown-submenu">
                      <li v-for="c in item.children" :key="c.path">
                        <RouterLink :to="c.path" class="dropdown-item">{{ c.label }}</RouterLink>
                      </li>
                    </ul>
                  </template>
                  <RouterLink v-else :to="item.path" class="dropdown-item">{{ item.label }}</RouterLink>
                </li>
              </ul>
            </li>
            <li><RouterLink :to="p('/news/')" class="nav-link" active-class="active">{{ t('nav.news') }}</RouterLink></li>
            <li><RouterLink :to="p('/contact/')" class="nav-link" active-class="active">{{ t('nav.contact') }}</RouterLink></li>
          </ul>
          <LanguageSwitcher />
        </nav>

        <!-- Mobile toggle -->
        <button class="md:hidden flex flex-col gap-1.5 p-1.5" :aria-label="t('nav.toggle')" @click="navOpen = !navOpen">
          <span class="w-6 h-0.5 bg-[#1A1A2E] rounded transition-transform" :class="{ 'rotate-45 translate-y-2': navOpen }"></span>
          <span class="w-6 h-0.5 bg-[#1A1A2E] rounded transition-opacity" :class="{ 'opacity-0': navOpen }"></span>
          <span class="w-6 h-0.5 bg-[#1A1A2E] rounded transition-transform" :class="{ '-rotate-45 -translate-y-2': navOpen }"></span>
        </button>
      </div>

      <!-- Mobile nav -->
      <div v-show="navOpen" class="md:hidden pb-4">
        <ul class="flex flex-col gap-2">
          <li><RouterLink :to="p('/')" class="mobile-link" exact-active-class="active" @click="closeNav">{{ t('nav.home') }}</RouterLink></li>
          <li><RouterLink :to="p('/about/')" class="mobile-link" active-class="active" @click="closeNav">{{ t('nav.about') }}</RouterLink></li>
          <li>
            <div class="flex items-center justify-between">
              <RouterLink :to="p('/products/')" class="mobile-link" active-class="active" @click="onNavLinkClick">{{ t('nav.products') }}</RouterLink>
              <button class="px-3 py-1 text-[#FF6B00]" @click="toggleMobile('products')">&#9662;</button>
            </div>
            <ul v-show="openMobile.has('products')" class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3">
              <li v-for="item in productsNav" :key="item.label">
                <template v-if="item.children">
                  <div class="flex items-center justify-between">
                    <RouterLink :to="item.path" class="mobile-link" active-class="active" @click="onNavLinkClick">{{ item.label }}</RouterLink>
                    <button class="px-2 text-[#FF6B00]" @click="toggleMobile(item.label)">&#9662;</button>
                  </div>
                  <ul v-show="openMobile.has(item.label)" class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3">
                    <li v-for="c in item.children" :key="c.path">
                      <RouterLink :to="c.path" class="mobile-link" active-class="active" @click="closeNav">{{ c.label }}</RouterLink>
                    </li>
                  </ul>
                </template>
                <RouterLink v-else :to="item.path" class="mobile-link" active-class="active" @click="closeNav">{{ item.label }}</RouterLink>
              </li>
            </ul>
          </li>
          <li><RouterLink :to="p('/news/')" class="mobile-link" active-class="active" @click="closeNav">{{ t('nav.news') }}</RouterLink></li>
          <li><RouterLink :to="p('/contact/')" class="mobile-link" active-class="active" @click="closeNav">{{ t('nav.contact') }}</RouterLink></li>
          <li><LanguageSwitcher variant="mobile" /></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  @apply font-medium text-gray-600 px-5 py-3.5 text-lg rounded relative transition-colors hover:bg-orange-50 hover:text-[#FF6B00];
}
.nav-link.active {
  @apply text-[#FF6B00];
}
.nav-link.active::after {
  content: '';
  @apply absolute bottom-0 left-5 right-5 h-0.5 bg-[#FF6B00];
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
