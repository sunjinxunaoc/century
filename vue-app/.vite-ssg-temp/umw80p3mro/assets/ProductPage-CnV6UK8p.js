import { resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext, computed } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { f as findCategory, a as findSubcategory, b as findProduct, r as relatedProducts } from "./products-DQVo6GNT.js";
import { _ as _sfc_main$4 } from "./PageHero-BRQNIife.js";
import { P as ProductSidebar } from "./ProductSidebar-sDV_mfQR.js";
import { _ as _sfc_main$5 } from "./BreadcrumbNav-DTBVk7RX.js";
import { _ as _sfc_main$6 } from "./CtaSection-DWHdbXkJ.js";
import "../main.mjs";
import "vite-ssg";
const _imports_0 = "/images/placeholder.svg";
const _sfc_main$3 = {
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    name: { type: String, required: true },
    desc: { type: String, default: "" },
    href: { type: String, required: true },
    image: { type: String, default: "/images/placeholder.svg" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card reveal flex flex-col" }, _attrs))}><div class="aspect-[4/3] overflow-hidden bg-gray-100"><img${ssrRenderAttr("src", __props.image)}${ssrRenderAttr("alt", __props.name)} loading="lazy" class="w-full h-full object-cover"></div><div class="p-5 flex flex-col flex-1"><h3 class="font-semibold text-[#1A1A2E] mb-2 leading-snug">${ssrInterpolate(__props.name)}</h3>`);
      if (__props.desc) {
        _push(`<p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">${ssrInterpolate(__props.desc)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_RouterLink, {
        to: __props.href,
        class: "text-[#FF6B00] text-sm font-medium hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View Details →`);
          } else {
            return [
              createTextVNode("View Details →")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ProductCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "CategoryCard",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    desc: { type: String, default: "" },
    href: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card reveal flex flex-col p-6 text-center" }, _attrs))}><div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">◈</div><h3 class="font-semibold text-[#1A1A2E] mb-2">${ssrInterpolate(__props.title)}</h3><p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">${ssrInterpolate(__props.desc)}</p>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: __props.href,
        class: "text-[#FF6B00] text-sm font-medium hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View Details →`);
          } else {
            return [
              createTextVNode("View Details →")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/CategoryCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "SpecTable",
  __ssrInlineRender: true,
  props: {
    headers: { type: Array, required: true },
    rows: { type: Array, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-auto mt-6" }, _attrs))}><table class="spec-table"><thead><tr><!--[-->`);
      ssrRenderList(__props.headers, (h) => {
        _push(`<th>${ssrInterpolate(h)}</th>`);
      });
      _push(`<!--]--></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.rows, (row, i) => {
        _push(`<tr><!--[-->`);
        ssrRenderList(row, (cell, j) => {
          _push(`<td class="${ssrRenderClass({ "text-gray-400 italic": cell === "TBD" })}">${ssrInterpolate(cell)}</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/SpecTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "ProductPage",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const categorySlug = computed(() => route.params.category);
    const slug = computed(() => route.params.slug);
    const category = computed(() => findCategory(categorySlug.value));
    const subcategory = computed(() => slug.value ? findSubcategory(categorySlug.value, slug.value) : null);
    const found = computed(() => slug.value ? findProduct(categorySlug.value, slug.value) : null);
    const product = computed(() => {
      var _a;
      return ((_a = found.value) == null ? void 0 : _a.product) || null;
    });
    const related = computed(() => product.value ? relatedProducts(categorySlug.value, product.value.slug, 3) : []);
    const pageType = computed(() => {
      if (product.value) return "product";
      if (subcategory.value) return "subcategory";
      return "category";
    });
    const pageTitle = computed(() => {
      var _a;
      if (product.value) return product.value.name;
      if (subcategory.value) return subcategory.value.name;
      return ((_a = category.value) == null ? void 0 : _a.name) || "Products";
    });
    const crumbs = computed(() => {
      const items = [
        { label: "Home", path: "/" },
        { label: "Products", path: "/products" }
      ];
      if (category.value) items.push({ label: category.value.name, path: `/products/${category.value.slug}` });
      if (subcategory.value) items.push({ label: subcategory.value.name, path: `/products/${category.value.slug}/${subcategory.value.slug}` });
      if (product.value) items.push({ label: product.value.name });
      return items;
    });
    useHead(() => {
      var _a, _b, _c, _d;
      return {
        title: `${pageTitle.value} | Century Auto Parts`,
        meta: [
          { name: "description", content: ((_a = product.value) == null ? void 0 : _a.desc) || ((_b = category.value) == null ? void 0 : _b.intro) || pageTitle.value },
          { name: "keywords", content: ((_c = product.value) == null ? void 0 : _c.keywords) || ((_d = category.value) == null ? void 0 : _d.name) || "" },
          { rel: "canonical", href: `https://centurymanufacture.com/products/${categorySlug.value}${slug.value ? "/" + slug.value : ""}/` }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_RouterLink = resolveComponent("RouterLink");
      if (category.value) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_sfc_main$4, {
          title: pageTitle.value,
          subtitle: ((_a = product.value.value) == null ? void 0 : _a.tagline) || category.value.tagline
        }, null, _parent));
        _push(`<section class="py-16"><div class="container-app"><div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">`);
        _push(ssrRenderComponent(ProductSidebar, {
          category: categorySlug.value,
          subcategory: slug.value,
          product: slug.value
        }, null, _parent));
        _push(`<div class="min-w-0">`);
        _push(ssrRenderComponent(_sfc_main$5, { items: crumbs.value }, null, _parent));
        if (pageType.value === "product") {
          _push(`<!--[--><div class="grid grid-cols-1 md:grid-cols-2 gap-10"><div class="rounded-lg overflow-hidden bg-gray-100 shadow-card"><img${ssrRenderAttr("src", _imports_0)}${ssrRenderAttr("alt", product.value.name)} class="w-full aspect-[4/3] object-cover"></div><div><h1 class="text-2xl font-bold text-[#1A1A2E] mb-4">${ssrInterpolate(product.value.name)}</h1><p class="text-gray-500 mb-5">${ssrInterpolate(product.value.desc)}</p><ul class="list-disc ml-5 space-y-2 text-gray-600 mb-6"><!--[-->`);
          ssrRenderList(product.value.features, (f) => {
            _push(`<li>${ssrInterpolate(f)}</li>`);
          });
          _push(`<!--]--></ul><div class="flex gap-4">`);
          _push(ssrRenderComponent(_component_RouterLink, {
            to: "/contact",
            class: "btn btn-primary"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Request Quote`);
              } else {
                return [
                  createTextVNode("Request Quote")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<a href="tel:+8615633632668" class="btn border border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white">Call +86 15633632668</a></div></div></div><div class="mt-14"><div class="section-header text-left"><h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">Specifications</h2><p class="text-gray-500">Detailed parameters for ${ssrInterpolate(product.value.name)}</p></div>`);
          _push(ssrRenderComponent(_sfc_main$1, {
            headers: product.value.spec.headers,
            rows: product.value.spec.rows
          }, null, _parent));
          _push(`</div>`);
          if (related.value.length) {
            _push(`<div class="mt-14"><div class="section-header text-left"><h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">Related Products</h2><p class="text-gray-500">Explore more related products</p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
            ssrRenderList(related.value, (r) => {
              _push(ssrRenderComponent(_sfc_main$3, {
                key: r.slug,
                name: r.name,
                desc: r.tagline,
                href: `/products/${categorySlug.value}/${r.slug}`
              }, null, _parent));
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else if (pageType.value === "subcategory") {
          _push(`<!--[--><div class="section-header text-left"><h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">Available Models</h2><p class="text-gray-500">${ssrInterpolate(subcategory.value.desc)}</p></div>`);
          if (subcategory.value.products && subcategory.value.products.length) {
            _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
            ssrRenderList(subcategory.value.products, (p) => {
              _push(ssrRenderComponent(_sfc_main$3, {
                key: p.slug,
                name: p.name,
                desc: p.tagline,
                href: `/products/${categorySlug.value}/${p.slug}`
              }, null, _parent));
            });
            _push(`<!--]--></div>`);
          } else if (subcategory.value.models) {
            _push(`<div class="mt-6">`);
            _push(ssrRenderComponent(_sfc_main$1, {
              headers: ["Model", "Type", "Material", "Remarks"],
              rows: subcategory.value.models.map((m) => [m, "Tyre valve", "Metal", "TBD"])
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!--[--><div class="section-header text-left"><h2 class="text-2xl font-bold text-[#1A1A2E] mb-2">${ssrInterpolate(category.value.name)}</h2><p class="text-gray-500">${ssrInterpolate(category.value.intro)}</p></div>`);
          if (category.value.subcategories.length) {
            _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
            ssrRenderList(category.value.subcategories, (sub) => {
              _push(ssrRenderComponent(_sfc_main$2, {
                key: sub.slug,
                title: sub.name,
                desc: sub.desc,
                href: `/products/${categorySlug.value}/${sub.slug}`
              }, null, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
            ssrRenderList(category.value.cards, (c) => {
              _push(`<div class="card reveal p-6 text-center"><div class="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl">◈</div><h3 class="font-semibold text-[#1A1A2E] mb-2">${ssrInterpolate(c.title)}</h3><p class="text-sm text-gray-500 leading-relaxed">${ssrInterpolate(c.desc)}</p></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div></div></div></section>`);
        _push(ssrRenderComponent(_sfc_main$6, {
          heading: `Need ${category.value.name}?`
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/ProductPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
