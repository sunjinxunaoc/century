import { computed, resolveComponent, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { f as findArticle } from "./articles-Bdg6U0lj.js";
import { _ as _sfc_main$1 } from "./BreadcrumbNav-DTBVk7RX.js";
import { _ as _sfc_main$2 } from "./CtaSection-DWHdbXkJ.js";
const _sfc_main = {
  __name: "ArticlePage",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const article = computed(() => findArticle(route.params.slug));
    const crumbs = computed(() => {
      var _a;
      return [
        { label: "Home", path: "/" },
        { label: "News", path: "/news" },
        { label: ((_a = article.value) == null ? void 0 : _a.title) || "" }
      ];
    });
    useHead(() => {
      var _a, _b;
      return {
        title: `${((_a = article.value) == null ? void 0 : _a.title) || "News"} | Century Auto Parts`,
        meta: [
          { name: "description", content: ((_b = article.value) == null ? void 0 : _b.desc) || "" },
          { rel: "canonical", href: `https://centurymanufacture.com/news/${route.params.slug}/` }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      if (article.value) {
        _push(`<div${ssrRenderAttrs(_attrs)}><section class="relative bg-gradient-to-br from-[#1A1A2E] via-[#2B2B45] to-[#4A2B1A] text-white"><div class="container-app py-20 md:py-24 text-center"><h1 class="text-3xl md:text-4xl font-bold mb-4">News</h1><p class="text-gray-300">Industry insights &amp; product guides from Century Auto Parts</p></div></section><article class="py-14"><div class="container-app max-w-4xl">`);
        _push(ssrRenderComponent(_sfc_main$1, { items: crumbs.value }, null, _parent));
        _push(`<header class="mb-8"><div class="flex flex-wrap gap-1.5 mb-3"><!--[-->`);
        ssrRenderList(article.value.tags, (t) => {
          _push(`<span class="tag">${ssrInterpolate(t)}</span>`);
        });
        _push(`<!--]--></div><h1 class="text-3xl font-bold text-[#1A1A2E] leading-tight mb-4">${ssrInterpolate(article.value.title)}</h1><div class="text-sm text-gray-400">${ssrInterpolate(article.value.date)} · By Century Auto Parts</div></header><div class="rounded-lg overflow-hidden shadow-card mb-10"><img${ssrRenderAttr("src", article.value.img)}${ssrRenderAttr("alt", article.value.imgAlt)} class="w-full aspect-[21/9] object-cover"></div><div class="article-content">${article.value.content ?? ""}</div><footer class="mt-12 pt-6 border-t border-gray-200"><h3 class="text-xl font-bold text-[#1A1A2E] mb-5">Related Articles</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-8"><!--[-->`);
        ssrRenderList(article.value.related, (r) => {
          _push(`<div class="card reveal p-5"><span class="tag mb-2 inline-block">${ssrInterpolate(r.tag)}</span><h4 class="font-semibold text-[#1A1A2E] mb-1 leading-snug">${ssrInterpolate(r.title)}</h4><div class="text-xs text-gray-400 mb-2">${ssrInterpolate(r.date)}</div><p class="text-sm text-gray-500 mb-3">${ssrInterpolate(r.desc)}</p>`);
          _push(ssrRenderComponent(_component_RouterLink, {
            to: `/news/${r.slug}`,
            class: "text-[#FF6B00] text-sm font-medium hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Read More →`);
              } else {
                return [
                  createTextVNode("Read More →")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div><div class="mt-8">`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: "/news",
          class: "btn border border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← Back to News`);
            } else {
              return [
                createTextVNode("← Back to News")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></footer></div></article>`);
        _push(ssrRenderComponent(_sfc_main$2, { heading: "Questions About Our Products?" }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/ArticlePage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
