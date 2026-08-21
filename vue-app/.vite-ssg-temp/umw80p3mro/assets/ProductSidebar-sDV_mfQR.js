import { computed, resolveComponent, mergeProps, withCtx, createTextVNode, unref, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { c as categories } from "./products-DQVo6GNT.js";
import { _ as _export_sfc } from "../main.mjs";
const _sfc_main = {
  __name: "ProductSidebar",
  __ssrInlineRender: true,
  props: {
    category: { type: String, default: "" },
    subcategory: { type: String, default: "" },
    product: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    computed(() => props.category);
    computed(() => props.subcategory);
    computed(() => props.product);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "sidebar" }, _attrs))} data-v-ef13890c><h4 class="sidebar-title" data-v-ef13890c>Products</h4><ul class="flex flex-col gap-0.5" data-v-ef13890c><li data-v-ef13890c>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/products",
        class: ["sidebar-link", { active: !__props.category }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`All Products`);
          } else {
            return [
              createTextVNode("All Products")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<li data-v-ef13890c><details${ssrIncludeBooleanAttr(__props.category === cat.slug) ? " open" : ""} data-v-ef13890c><summary class="${ssrRenderClass([{ active: __props.category === cat.slug && !__props.subcategory }, "sidebar-link cursor-pointer list-none font-semibold"])}" data-v-ef13890c>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: `/products/${cat.slug}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(cat.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</summary>`);
        if (cat.subcategories.length) {
          _push(`<ul class="ml-3 border-l-2 border-orange-200 pl-2 flex flex-col gap-0.5" data-v-ef13890c><!--[-->`);
          ssrRenderList(cat.subcategories, (sub) => {
            _push(`<li data-v-ef13890c>`);
            if (sub.products && sub.products.length) {
              _push(`<details${ssrIncludeBooleanAttr(__props.subcategory === sub.slug) ? " open" : ""} data-v-ef13890c><summary class="${ssrRenderClass([{ active: __props.subcategory === sub.slug && !__props.product }, "sidebar-link cursor-pointer list-none font-medium"])}" data-v-ef13890c>`);
              _push(ssrRenderComponent(_component_RouterLink, {
                to: `/products/${cat.slug}/${sub.slug}`
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(sub.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(sub.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`</summary><ul class="ml-3 border-l-2 border-orange-200 pl-2 flex flex-col gap-0.5" data-v-ef13890c><!--[-->`);
              ssrRenderList(sub.products, (p) => {
                _push(`<li data-v-ef13890c>`);
                _push(ssrRenderComponent(_component_RouterLink, {
                  to: `/products/${cat.slug}/${p.slug}`,
                  class: ["sidebar-link", { active: __props.product === p.slug }]
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(p.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(p.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
                _push(`</li>`);
              });
              _push(`<!--]--></ul></details>`);
            } else {
              _push(ssrRenderComponent(_component_RouterLink, {
                to: `/products/${cat.slug}/${sub.slug}`,
                class: ["sidebar-link", { active: __props.subcategory === sub.slug }]
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(sub.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(sub.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            }
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</details></li>`);
      });
      _push(`<!--]--></ul></aside>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ProductSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductSidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ef13890c"]]);
export {
  ProductSidebar as P
};
