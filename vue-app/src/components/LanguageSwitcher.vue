<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SUPPORTED_LOCALES, LOCALE_SHORT, LOCALE_LABELS, switchLocalePath, useI18n } from '../i18n'

defineProps({
  variant: { type: String, default: 'desktop' },
})

const route = useRoute()
const { locale } = useI18n()
const open = ref(false)
const rootEl = ref(null)

// Inline SVG flags (viewBox 16 x 11). Locale -> country flag.
const FLAG_COUNTRY = {
  en: 'United Kingdom',
  es: 'Spain',
  ar: 'Saudi Arabia',
  de: 'Germany',
  pt: 'Portugal',
  ru: 'Russia',
}

// Rect-style flags built from simple shapes for reliable rendering everywhere.
const FLAG_SVG = {
  // Union Jack
  en: `<rect width="16" height="11" fill="#012169"/>
  <path d="M0 0 L16 11 M16 0 L0 11" stroke="#ffffff" stroke-width="2.6"/>
  <path d="M0 0 L16 11 M16 0 L0 11" stroke="#c8102e" stroke-width="1.2"/>
  <path d="M8 0 V11 M0 5.5 H16" stroke="#ffffff" stroke-width="3.6"/>
  <path d="M8 0 V11 M0 5.5 H16" stroke="#c8102e" stroke-width="2.4"/>`,
  // Spain
  es: `<rect width="16" height="11" fill="#aa151b"/>
  <rect y="2.75" width="16" height="5.5" fill="#f1bf00"/>
  <path d="M8 4.3 a1.6 1.6 0 0 1 0 3.2 a1.6 1.6 0 0 1 0 -3.2" fill="#aa151b"/>
  <path d="M8 4.3 l-.6 1.4 h1.2 z" fill="#aa151b"/>`,
  // Saudi Arabia
  ar: `<rect width="16" height="11" fill="#1c8a4c"/>
  <rect x="2.2" y="3.4" width="11.6" height="2.2" fill="#ffffff" opacity="0.9"/>
  <rect x="6.4" y="5.9" width="3.2" height="1.4" fill="#ffffff" opacity="0.9"/>`,
  // Germany
  de: `<rect width="16" height="11" fill="#000000"/>
  <rect y="3.67" width="16" height="3.66" fill="#dd0000"/>
  <rect y="7.33" width="16" height="3.67" fill="#ffcc00"/>`,
  // Portugal
  pt: `<rect width="16" height="11" fill="#046a38"/>
  <rect x="10.6" width="5.4" height="11" fill="#da291c"/>
  <circle cx="8" cy="5.5" r="3.1" fill="#ffe900"/>
  <circle cx="8" cy="5.5" r="1.5" fill="#046a38"/>`,
  // Russia
  ru: `<rect width="16" height="11" fill="#ffffff"/>
  <rect y="3.67" width="16" height="3.66" fill="#0039a6"/>
  <rect y="7.33" width="16" height="3.67" fill="#d52b1e"/>`,
}

function flagInner(code) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 11" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${FLAG_SVG[code] || FLAG_SVG.en}</svg>`
}
function country(code) {
  return FLAG_COUNTRY[code] || code
}

const items = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    code,
    short: LOCALE_SHORT[code],
    label: LOCALE_LABELS[code],
    country: country(code),
    to: switchLocalePath(route.path, code),
    active: code === locale.value,
  }))
)

const current = computed(() => items.value.find((i) => i.active) || items.value[0])

function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}

function onClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) close()
}
function onKeydown(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    ref="rootEl"
    class="relative select-none"
    :class="variant === 'mobile' ? 'mt-1' : ''"
  >
    <button
      type="button"
      class="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm font-medium transition-colors"
      :class="open
        ? 'bg-orange-50 text-[#C2410C]'
        : 'text-gray-600 hover:bg-orange-50 hover:text-[#C2410C]'"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      :title="current.country"
      :aria-label="'Language: ' + current.label"
      @click.stop="toggle"
    >
      <span
        class="flag inline-block shrink-0"
        v-html="flagInner(current.code)"
        aria-hidden="true"
      ></span>
      <span class="uppercase tracking-wide">{{ current.short }}</span>
      <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': open }" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <transition name="fade">
      <ul
        v-show="open"
        role="listbox"
        class="absolute top-full z-50 mt-1.5 min-w-[210px] rounded-lg border border-gray-200 bg-white p-2 shadow-card-lg"
        :class="variant === 'mobile' ? 'left-0' : 'right-0'"
      >
        <li v-for="item in items" :key="item.code">
          <RouterLink
            :to="item.to"
            role="option"
            :aria-selected="item.active"
            @click="close"
            class="group/opt flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors"
            :class="item.active
              ? 'bg-orange-50 text-[#FF6B00] font-semibold'
              : 'text-gray-600 hover:bg-orange-50 hover:text-[#C2410C]'"
          >
            <span
              class="flag inline-block shrink-0"
              v-html="flagInner(item.code)"
              aria-hidden="true"
            ></span>
            <span class="flex-1 min-w-0">
              <span class="block leading-tight truncate">{{ item.country }}</span>
              <span class="block text-xs leading-tight text-gray-400 truncate">{{ item.label }}</span>
            </span>
            <span class="text-xs uppercase tracking-wide" :class="item.active ? 'text-[#FF6B00]' : 'text-gray-400'">{{ item.short }}</span>
          </RouterLink>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.flag {
  width: 20px;
  height: 14px;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);
}
.flag :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
