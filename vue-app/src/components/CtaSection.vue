<script setup>
defineProps({
  heading: { type: String, required: true },
  text: { type: String, default: 'Get a factory-direct quote for your order requirements.' },
})
</script>

<template>
  <section class="bg-gradient-to-br from-[#FF6B00] to-orange-600 text-white">
    <div class="container-app py-16 text-center">
      <h2 class="text-3xl font-bold mb-3">{{ heading }}</h2>
      <p class="text-orange-100 mb-6">{{ text }}</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <RouterLink to="/contact" class="btn bg-white text-[#FF6B00] hover:bg-orange-100 btn-large">Request Quote</RouterLink>
        <a href="tel:+8615633632668" class="btn border border-white text-white hover:bg-white hover:text-[#1A1A2E] btn-large">Call +86 15633632668</a>
      </div>
    </div>
  </section>
</template>
