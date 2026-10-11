<template>
  <footer>
    <div class="border-b border-black/5 bg-white py-8">
      <div class="container-mi grid grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-5">
        <div v-for="s in services" :key="s.title" class="flex flex-col items-center gap-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand" v-html="s.icon"></div>
          <div class="text-[14px] font-medium">{{ s.title }}</div>
          <div class="text-[12px] text-muted">{{ s.desc }}</div>
        </div>
      </div>
    </div>

    <div class="bg-white py-10">
      <div class="container-mi grid gap-10 md:grid-cols-4">
        <div>
          <div class="mb-3 text-[14px] font-semibold">Products</div>
          <ul class="space-y-2 text-[13px] text-muted">
            <li><router-link to="/products" class="hover:text-brand">All Tyre Valves</router-link></li>
            <li v-for="sub in navSubs" :key="sub.slug">
              <router-link :to="`/products/${sub.slug}`" class="hover:text-brand">{{ sub.name }}</router-link>
            </li>
          </ul>
        </div>
        <div>
          <div class="mb-3 text-[14px] font-semibold">Company</div>
          <ul class="space-y-2 text-[13px] text-muted">
            <li><router-link to="/about" class="hover:text-brand">About Us</router-link></li>
            <li><router-link to="/contact" class="hover:text-brand">Contact</router-link></li>
            <li><router-link to="/contact" class="hover:text-brand">Request Quote</router-link></li>
          </ul>
        </div>
        <div>
          <div class="mb-3 text-[14px] font-semibold">Contact Us</div>
          <ul class="space-y-2 text-[13px] text-muted">
            <li>No.161, Qiantang Village, Qingyun Town,</li>
            <li>Yanshan County, Cangzhou City, Hebei Province, China</li>
            <li>Phone: <a href="tel:+8615633632668" class="hover:text-brand">+86 156 3363 2668</a></li>
            <li>Email: <a href="mailto:info@centurymanufacture.com" class="hover:text-brand">info@centurymanufacture.com</a></li>
            <li>Hours: Mon-Sat 8am - 6pm (GMT+8)</li>
          </ul>
        </div>
        <div>
          <div class="mb-1 text-[22px] font-bold text-brand">+86 156 3363 2668</div>
          <div class="mb-4 text-[12px] text-muted">Mon-Sat 8am-6pm, WhatsApp available</div>
          <router-link to="/contact" class="inline-block rounded-sm border border-brand px-5 py-2 text-[13px] text-brand transition-colors hover:bg-brand hover:text-white">
            Send Inquiry
          </router-link>
        </div>
      </div>
    </div>

    <div class="bg-page py-6">
      <div class="container-mi flex flex-col items-center gap-2 text-center text-[12px] text-muted">
        <div class="flex items-center gap-2">
          <img src="/images/logo/logo-icon-transparent-160.webp" alt="Century AutoParts" class="h-6 w-6 object-contain" width="24" height="24" />
          <span class="font-semibold text-ink">CENTURY AUTOPARTS</span>
        </div>
        <p>Professional tyre valve manufacturer. Factory-direct rubber snap-in & brass clamp-in valve stems for global markets.</p>
        <p>&copy; 2010 - {{ year }} AutoPartsCentury.com All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { navSubs } from '../data/nav'

const year = new Date().getFullYear()

const services = [
  { title: 'Factory Direct', desc: 'OEM / ODM welcome', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 21V8l7-5 7 5v13M3 21h18M10 21v-6h4v6"/></svg>' },
  { title: 'Quality Assured', desc: '100% leak tested', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { title: 'Bulk Supply', desc: 'Wholesale pricing', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m-8-4v10l8 4m-8-14l8 4"/></svg>' },
  { title: 'Global Shipping', desc: '50+ countries served', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  { title: 'Fast Response', desc: 'Quote within 24h', icon: '<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
]
</script>
