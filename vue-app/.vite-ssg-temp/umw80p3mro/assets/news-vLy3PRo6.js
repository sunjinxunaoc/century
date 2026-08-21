import { resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./PageHero-BRQNIife.js";
import { _ as _sfc_main$3 } from "./CtaSection-DWHdbXkJ.js";
import { a as articles } from "./articles-Bdg6U0lj.js";
import { useHead } from "@unhead/vue";
const _sfc_main$1 = {
  __name: "ArticleCard",
  __ssrInlineRender: true,
  props: {
    article: { type: Object, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card reveal flex flex-col" }, _attrs))}><div class="aspect-[4/3] overflow-hidden bg-gray-100"><img${ssrRenderAttr("src", __props.article.img)}${ssrRenderAttr("alt", __props.article.title)} loading="lazy" class="w-full h-full object-cover"></div><div class="p-5 flex flex-col flex-1"><div class="flex flex-wrap gap-1.5 mb-2"><!--[-->`);
      ssrRenderList(__props.article.tags, (t) => {
        _push(`<span class="tag">${ssrInterpolate(t)}</span>`);
      });
      _push(`<!--]--></div><h3 class="font-semibold text-[#1A1A2E] mb-2 leading-snug">${ssrInterpolate(__props.article.title)}</h3><div class="text-xs text-gray-400 mb-3">${ssrInterpolate(__props.article.date)}</div><p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1">${ssrInterpolate(__props.article.desc)}</p>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: `/news/${__props.article.slug}`,
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
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ArticleCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "news",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "News & Product Guides | Century Auto Parts",
      meta: [
        { name: "description", content: "Latest news and product guides from Century Auto Parts - wheel weight guides, tyre valve guides, TPMS maintenance, tyre repair tips and ordering information." },
        { rel: "canonical", href: "https://centurymanufacture.com/news/" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        title: "News",
        subtitle: "Industry insights & product guides from Century Auto Parts"
      }, null, _parent));
      _push(`<section class="py-16"><div class="container-app"><div class="section-header"><h2 class="section-title">Latest Articles</h2><p class="section-subtitle">Practical guides and industry knowledge for tyre repair professionals and importers</p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(unref(articles), (a) => {
        _push(ssrRenderComponent(_sfc_main$1, {
          key: a.slug,
          article: a
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        heading: "Questions About Our Products?",
        text: "Contact our team for advice and factory-direct pricing."
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/news.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
