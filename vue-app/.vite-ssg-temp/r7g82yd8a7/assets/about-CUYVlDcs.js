import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./PageHero-BRQNIife.js";
import { _ as _sfc_main$2 } from "./CtaSection-DWHdbXkJ.js";
import { useHead } from "@unhead/vue";
import { ref, onMounted, onUnmounted, useSSRContext } from "vue";
const _sfc_main = {
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "About Us | Century Auto Parts",
      meta: [
        { name: "description", content: "Hebei Century Auto Parts Co., Ltd. - professional manufacturer of tire repair products since 2010. Trusted by partners in 50+ countries." },
        { rel: "canonical", href: "https://centurymanufacture.com/about/" }
      ]
    });
    const slides = [
      { img: "/images/factory.webp", caption: "Our manufacturing facility" },
      { img: "/images/wheel weight.webp", caption: "Wheel balancing weights production" },
      { img: "/images/tire valve.webp", caption: "Tyre valve production" }
    ];
    const current = ref(0);
    let timer = null;
    function next() {
      current.value = (current.value + 1) % slides.length;
    }
    onMounted(() => {
      timer = setInterval(next, 4e3);
    });
    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });
    const values = [
      { title: "Trusted Enterprise", desc: "Buy with confidence - we are a professional tire repair products manufacturer serving partners worldwide." },
      { title: "Quality First", desc: "Every product undergoes strict quality testing from raw materials to packaging." },
      { title: "Factory Direct", desc: "Direct manufacturer pricing with optimized logistics to help you save on every order." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "About Us",
        subtitle: "Trusted Enterprise - Buy with Confidence"
      }, null, _parent));
      _push(`<section class="py-20"><div class="container-app"><div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div class="relative overflow-hidden rounded-lg shadow-card-lg"><!--[-->`);
      ssrRenderList(slides, (s, i) => {
        _push(`<div class="${ssrRenderClass([i === current.value ? "opacity-100" : "opacity-0 absolute inset-0", "transition-opacity duration-500"])}"><img${ssrRenderAttr("src", s.img)}${ssrRenderAttr("alt", s.caption)} class="w-full aspect-[4/3] object-cover">`);
        if (i === current.value) {
          _push(`<div class="absolute bottom-0 inset-x-0 bg-black/50 text-white text-center py-2 text-sm">${ssrInterpolate(s.caption)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--><div class="absolute bottom-0 inset-x-0 flex justify-center gap-2 pb-2"><!--[-->`);
      ssrRenderList(slides, (s, i) => {
        _push(`<button class="${ssrRenderClass([i === current.value ? "bg-[#FF6B00]" : "bg-white/60", "w-2.5 h-2.5 rounded-full transition-colors"])}"></button>`);
      });
      _push(`<!--]--></div></div><div><h2 class="text-3xl font-bold text-[#1A1A2E] mb-5">Hebei Century Auto Parts Co., Ltd.</h2><div class="space-y-4 text-gray-600 leading-relaxed"><p>Since 2010, Century Auto Parts has been a professional manufacturer and exporter of tire repair products. Based in Cangzhou, Hebei Province, China, we focus on wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs.</p><p>With more than a decade of experience, we serve distributors, wholesalers and OEM customers in over 50 countries across Asia, Europe, the Middle East, Africa and the Americas.</p><p>We support OEM/ODM services with custom packaging and branding, backed by strict quality control and reliable after-sales support.</p></div></div></div></div></section><section class="py-20 bg-gray-50"><div class="container-app"><div class="section-header"><h2 class="section-title">Our Values</h2><p class="section-subtitle">What makes Century Auto Parts a trusted partner</p></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(values, (v) => {
        _push(`<div class="card reveal p-6 text-center"><div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">★</div><h3 class="font-semibold text-[#1A1A2E] mb-2">${ssrInterpolate(v.title)}</h3><p class="text-sm text-gray-500 leading-relaxed">${ssrInterpolate(v.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div></section>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        heading: "Partner With Us",
        text: "Tell us your requirements - our team will provide a factory-direct solution."
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
