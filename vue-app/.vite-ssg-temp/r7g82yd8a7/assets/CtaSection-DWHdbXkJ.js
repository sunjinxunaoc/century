import { resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main = {
  __name: "CtaSection",
  __ssrInlineRender: true,
  props: {
    heading: { type: String, required: true },
    text: { type: String, default: "Get a factory-direct quote for your order requirements." }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-gradient-to-br from-[#FF6B00] to-orange-600 text-white" }, _attrs))}><div class="container-app py-16 text-center"><h2 class="text-3xl font-bold mb-3">${ssrInterpolate(__props.heading)}</h2><p class="text-orange-100 mb-6">${ssrInterpolate(__props.text)}</p><div class="flex justify-center gap-4 flex-wrap">`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/contact",
        class: "btn bg-white text-[#FF6B00] hover:bg-orange-100 btn-large"
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
      _push(`<a href="tel:+8615633632668" class="btn border border-white text-white hover:bg-white hover:text-[#1A1A2E] btn-large">Call +86 15633632668</a></div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/CtaSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
