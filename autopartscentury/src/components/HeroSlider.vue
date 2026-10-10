<template>
  <div class="relative overflow-hidden bg-ink" @mouseenter="pause = true" @mouseleave="pause = false">
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <div v-for="(slide, i) in slides" :key="i" class="relative w-full shrink-0">
        <div class="relative h-[300px] sm:h-[380px] lg:h-[460px]">
          <img :src="slide.image" :alt="slide.title" class="absolute inset-0 h-full w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div class="container-mi relative flex h-full flex-col justify-center">
            <div class="max-w-xl pl-0 text-white lg:pl-[240px]">
              <div class="mb-2 text-[13px] font-medium uppercase tracking-widest text-brand">{{ slide.kicker }}</div>
              <h1 class="mb-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{{ slide.title }}</h1>
              <p class="mb-6 text-[15px] text-white/80">{{ slide.desc }}</p>
              <div class="flex gap-3">
                <router-link :to="slide.to" class="rounded-sm bg-brand px-7 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-dark">
                  {{ slide.cta }}
                </router-link>
                <router-link to="/contact" class="rounded-sm border border-white/60 px-7 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white hover:text-ink">
                  Get Quote
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      class="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50 lg:left-[220px] lg:block"
      @click="prev"
      aria-label="Previous"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <button
      class="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-colors hover:bg-black/50 lg:block"
      @click="next"
      aria-label="Next"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>

    <div class="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
      <button
        v-for="(s, i) in slides"
        :key="i"
        class="h-2 rounded-full transition-all"
        :class="i === current ? 'w-6 bg-brand' : 'w-2 bg-white/50 hover:bg-white/80'"
        @click="go(i)"
        :aria-label="`Slide ${i + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  slides: { type: Array, required: true },
})

const current = ref(0)
const pause = ref(false)
let timer = null

const go = (i) => { current.value = i }
const next = () => { current.value = (current.value + 1) % props.slides.length }
const prev = () => { current.value = (current.value - 1 + props.slides.length) % props.slides.length }

onMounted(() => {
  timer = setInterval(() => { if (!pause.value) next() }, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>
