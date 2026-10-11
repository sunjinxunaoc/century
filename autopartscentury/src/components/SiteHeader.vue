<template>
  <header class="z-50">
    <div class="bg-ink text-[12px] text-[#b0b0b0]">
      <div class="container-mi flex h-10 items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-white/90 font-medium">AutoPartsCentury.com</span>
          <span class="hidden sm:inline text-[#6b6b6b]">|</span>
          <span class="hidden sm:inline">Tyre Valves Manufacturer Since 2010</span>
        </div>
        <div class="flex items-center gap-4">
          <a href="mailto:info@centurymanufacture.com" class="transition-colors hover:text-brand">info@centurymanufacture.com</a>
          <span class="hidden md:inline text-[#6b6b6b]">|</span>
          <a href="tel:+8615633632668" class="hidden transition-colors hover:text-brand md:inline">+86 156 3363 2668</a>
        </div>
      </div>
    </div>

    <div class="sticky top-0 border-b border-black/5 bg-white">
      <div class="container-mi flex h-[68px] items-center justify-between gap-6">
        <router-link to="/" class="flex shrink-0 items-center gap-3">
          <img src="/images/logo/logo-icon-transparent.png" alt="AutoParts Century" class="h-10 w-10 object-contain" />
          <div class="leading-tight">
            <div class="text-[17px] font-bold tracking-tight">AUTOPARTS <span class="text-brand">CENTURY</span></div>
            <div class="text-[11px] text-muted">Tyre Valves Specialist</div>
          </div>
        </router-link>

        <nav class="hidden items-center gap-8 text-[15px] lg:flex">
          <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">Home</router-link>
          <div class="group relative">
            <router-link to="/products" class="nav-link flex items-center gap-1" :class="{ active: route.path.startsWith('/products') }">
              Tyre Valves
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </router-link>
            <div class="invisible absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div class="grid grid-cols-3 gap-2 rounded-lg border border-black/5 bg-white p-4 shadow-xl">
                <router-link
                  v-for="sub in subcategories"
                  :key="sub.slug"
                  :to="`/products/${sub.slug}`"
                  class="rounded-md p-3 transition-colors hover:bg-page"
                >
                  <div class="text-[14px] font-semibold text-ink">{{ sub.name }}</div>
                  <div class="mt-1 text-[12px] leading-snug text-muted">{{ sub.products.length }} products</div>
                </router-link>
              </div>
            </div>
          </div>
          <router-link to="/about" class="nav-link" :class="{ active: route.path === '/about' }">About Us</router-link>
          <router-link to="/contact" class="nav-link" :class="{ active: route.path === '/contact' }">Contact</router-link>
        </nav>

        <div class="flex flex-1 items-center justify-end gap-3">
          <SearchBar class="hidden md:block" />
          <router-link
            to="/contact"
            class="hidden rounded-sm bg-brand px-5 py-2 text-[14px] font-medium text-white transition-colors hover:bg-brand-dark sm:block"
          >
            Request Quote
          </router-link>
          <button class="p-2 lg:hidden" @click="mobileOpen = !mobileOpen" aria-label="Menu">
            <svg v-if="!mobileOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div v-if="mobileOpen" class="border-t border-black/5 bg-white lg:hidden">
        <div class="container-mi flex flex-col py-2 text-[15px]">
          <div class="py-3 md:hidden">
            <SearchBar />
          </div>
          <router-link to="/" class="mobile-link" @click="mobileOpen = false">Home</router-link>
          <router-link to="/products" class="mobile-link" @click="mobileOpen = false">All Tyre Valves</router-link>
          <router-link
            v-for="sub in subcategories"
            :key="sub.slug"
            :to="`/products/${sub.slug}`"
            class="mobile-link pl-6 text-muted"
            @click="mobileOpen = false"
          >{{ sub.name }}</router-link>
          <router-link to="/about" class="mobile-link" @click="mobileOpen = false">About Us</router-link>
          <router-link to="/contact" class="mobile-link" @click="mobileOpen = false">Contact</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { subcategories } from '../data/products'
import SearchBar from './SearchBar.vue'

const route = useRoute()
const mobileOpen = ref(false)
</script>

<style scoped>
.nav-link {
  @apply py-2 text-ink transition-colors hover:text-brand;
}
.nav-link.active {
  @apply text-brand;
}
.mobile-link {
  @apply border-b border-black/5 py-3 last:border-0;
}
</style>
