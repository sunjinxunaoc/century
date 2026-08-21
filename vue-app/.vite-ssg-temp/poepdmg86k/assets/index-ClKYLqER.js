import { resolveComponent, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { c as categories } from "./products-DQVo6GNT.js";
import { _ as _sfc_main$1 } from "./CtaSection-DWHdbXkJ.js";
import { useHead } from "@unhead/vue";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Century Auto Parts | Tire Repair Products Manufacturer",
      meta: [
        { name: "description", content: "Professional manufacturer of wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs since 2010. Factory direct to 50+ countries." },
        { name: "keywords", content: "tyre repair products, wheel balancing weights, tyre valves, TPMS, tyre patch, tyre seal string, mushroom patch plug" },
        { rel: "canonical", href: "https://centurymanufacture.com/" }
      ]
    });
    const stats = [
      { value: "12+", label: "Years Experience" },
      { value: "50+", label: "Export Countries" },
      { value: "2000+", label: "Product SKUs" },
      { value: "24/7", label: "Support" }
    ];
    const values = [
      { icon: "★", title: "12+ Years in Business", desc: "Since 2010, we have built extensive export experience and deep industry expertise, serving partners worldwide with consistent quality." },
      { icon: "★", title: "Quality Assured", desc: "Every product undergoes strict quality testing from raw materials to packaging. Our multi-department inspection system ensures reliability." },
      { icon: "★", title: "Competitive Pricing", desc: "Direct manufacturer pricing with optimized logistics solutions, helping you save significantly on every order." },
      { icon: "★", title: "Reliable After-Sales", desc: "Dedicated support team ready to assist with any concerns. We stand behind our products and customer relationships." }
    ];
    const catImages = {
      "wheel-balancing-weights": "/images/wheel weight.webp",
      "tyre-valves": "/images/tire valve.webp",
      "tpms": "/images/TPMS Valve.webp",
      "tyre-seal-string": "/images/tire seal.webp",
      "tyre-patch": "/images/tire patch.webp",
      "mushroom-patch-plug": "/images/tire patch.webp"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="relative bg-gradient-to-br from-[#1A1A2E] via-[#2B2B45] to-[#4A2B1A] text-white overflow-hidden"><div class="container-app pt-36 pb-24 md:pt-44 md:pb-32 text-center"><span class="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">◈ Since 2010  ·  Exported to 50+ Countries</span><h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">Tire Repair Products for <span class="text-[#FF6B00]">Global Markets</span></h1><p class="text-lg text-gray-300 max-w-2xl mx-auto mb-8">Wheel balancing weights, tyre valves, TPMS, patches and repair materials - manufactured and exported worldwide with factory-direct quality and pricing.</p><div class="flex justify-center gap-4 flex-wrap">`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/products",
        class: "btn btn-primary btn-large"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Explore Products`);
          } else {
            return [
              createTextVNode("Explore Products")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/contact",
        class: "btn btn-outline btn-large"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Get a Quote`);
          } else {
            return [
              createTextVNode("Get a Quote")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="bg-white border-b border-gray-100"><div class="container-app -mt-10"><div class="bg-white rounded-lg shadow-card-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8"><!--[-->`);
      ssrRenderList(stats, (s) => {
        _push(`<div class="text-center"><div class="text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-500 bg-clip-text text-transparent">${ssrInterpolate(s.value)}</div><div class="text-sm text-gray-500 mt-1">${ssrInterpolate(s.label)}</div></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-20"><div class="container-app"><div class="section-header"><h2 class="section-title">Our Product Range</h2><p class="section-subtitle">Six product categories covering complete tyre repair solutions</p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<div class="card reveal flex flex-col"><div class="aspect-[4/3] overflow-hidden bg-gray-100"><img${ssrRenderAttr("src", catImages[cat.slug])}${ssrRenderAttr("alt", cat.name)} loading="lazy" class="w-full h-full object-cover"></div><div class="p-5 flex flex-col flex-1"><h3 class="font-semibold text-[#1A1A2E] mb-2">${ssrInterpolate(cat.name)}</h3><p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">${ssrInterpolate(cat.tagline)}</p>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: `/products/${cat.slug}`,
          class: "text-[#FF6B00] text-sm font-medium hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Explore Range →`);
            } else {
              return [
                createTextVNode("Explore Range →")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-20 bg-gray-50"><div class="container-app"><div class="section-header"><h2 class="section-title">Why Choose Century Auto Parts</h2><p class="section-subtitle">Your trusted partner for professional tire repair solutions</p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`);
      ssrRenderList(values, (v) => {
        _push(`<div class="card reveal p-6 text-center"><div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">${ssrInterpolate(v.icon)}</div><h3 class="font-semibold text-[#1A1A2E] mb-2">${ssrInterpolate(v.title)}</h3><p class="text-sm text-gray-500 leading-relaxed">${ssrInterpolate(v.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div></section>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        heading: "Need Tire Repair Products?",
        text: "Contact us for factory-direct pricing and OEM/ODM services."
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
