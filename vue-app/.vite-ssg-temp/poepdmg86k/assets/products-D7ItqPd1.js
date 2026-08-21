import { resolveComponent, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { c as categories } from "./products-DQVo6GNT.js";
import { _ as _sfc_main$1 } from "./PageHero-BRQNIife.js";
import { P as ProductSidebar } from "./ProductSidebar-sDV_mfQR.js";
import { _ as _sfc_main$2 } from "./CtaSection-DWHdbXkJ.js";
import { useHead } from "@unhead/vue";
import "../main.mjs";
import "vite-ssg";
const _sfc_main = {
  __name: "products",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Our Products | Century Auto Parts",
      meta: [
        { name: "description", content: "Browse our complete range of tyre repair products - wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs." },
        { name: "keywords", content: "tyre repair products, wheel balancing weights, tyre valves, TPMS, tyre seal string, tyre patch, mushroom patch plug" },
        { rel: "canonical", href: "https://centurymanufacture.com/products/" }
      ]
    });
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
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Our Products",
        subtitle: "Complete Tire Repair Solutions for Global Markets"
      }, null, _parent));
      _push(`<section class="py-16"><div class="container-app"><div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">`);
      _push(ssrRenderComponent(ProductSidebar, null, null, _parent));
      _push(`<div class="min-w-0"><div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"><!--[-->`);
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
      _push(`<!--]--></div></div></div></div></section>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        heading: "Need a Custom Solution?",
        text: "Contact us for OEM/ODM services and custom product development."
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
