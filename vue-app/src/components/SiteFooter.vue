<script setup>
const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Projects', path: '/project' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },
]
const productLinks = [
  { label: 'Wheel Balancing Weights', path: '/products/wheel-balancing-weights' },
  { label: 'Tyre Valves', path: '/products/tyre-valves' },
  { label: 'TPMS', path: '/products/tpms' },
  { label: 'Tyre Seal String', path: '/products/tyre-seal-string' },
  { label: 'Tyre Patch', path: '/products/tyre-patch' },
  { label: 'Mushroom Patch Plug', path: '/products/mushroom-patch-plug' },
]
const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100075854564828' },
  { label: 'Instagram', href: 'https://www.instagram.com/gracezzling0723/' },
  { label: 'Skype', href: 'https://join.skype.com/invite/uSfQyI4aIVi2' },
  { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=8615633632668' },
]
</script>

<template>
  <footer class="bg-[#1A1A2E] text-gray-300 mt-auto">
    <div class="container-app py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <img src="/ctr.svg" alt="Century Auto Parts" class="h-10 w-auto object-contain">
            <span class="text-lg font-bold tracking-wider text-white">CENTURY<span class="text-[#E8590C]">AUTO</span></span>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed">Professional manufacturer of tire repair products since 2010. Trusted by 50+ countries worldwide.</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <ul class="flex flex-col gap-2.5 text-sm">
            <li v-for="l in quickLinks" :key="l.path"><RouterLink :to="l.path" class="hover:text-[#FF6B00]">{{ l.label }}</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Products</h4>
          <ul class="flex flex-col gap-2.5 text-sm">
            <li v-for="l in productLinks" :key="l.path"><RouterLink :to="l.path" class="hover:text-[#FF6B00]">{{ l.label }}</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Contact Us</h4>
          <ul class="flex flex-col gap-3 text-sm text-gray-400">
            <li><strong class="text-gray-300">Address:</strong><br>No.161, Qiantang Village, Qingyun Town, Yanshan County, Cangzhou City, Hebei Province, China</li>
            <li><strong class="text-gray-300">Phone:</strong> +86 15633632668</li>
            <li><strong class="text-gray-300">Email:</strong> gracecenturyauto@gmail.com</li>
            <li><strong class="text-gray-300">Hours:</strong> Mon-Sat: 8am - 6pm</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex gap-5 text-sm">
          <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" class="hover:text-[#FF6B00]">{{ s.label }}</a>
        </div>
        <p class="text-sm text-gray-500">Copyright 2012 - 2025 Hebei Century Auto Parts Co.,Ltd. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>
