<template>
  <section class="bg-ink py-14 text-white">
    <div class="container-mi flex flex-col items-center gap-6 text-center">
      <h2 class="text-2xl font-bold sm:text-3xl">{{ title }}</h2>
      <p class="max-w-xl text-[15px] text-white/70">{{ desc }}</p>
      <div class="flex flex-wrap justify-center gap-3">
        <router-link to="/contact" class="rounded-sm bg-brand px-8 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-dark">
          Request Quote
        </router-link>
        <a href="tel:+8615633632668" class="rounded-sm border border-white/40 px-8 py-3 text-[14px] font-medium transition-colors hover:bg-white hover:text-ink">
          Call +86 156 3363 2668
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Need Tyre Valves?' },
  desc: { type: String, default: 'Get a factory-direct quote for your order requirements. We reply within 24 hours.' },
})
</script>
