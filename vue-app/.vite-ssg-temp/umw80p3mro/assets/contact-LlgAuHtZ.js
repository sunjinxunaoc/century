import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./PageHero-BRQNIife.js";
import { useHead } from "@unhead/vue";
import { reactive, ref, useSSRContext } from "vue";
const _sfc_main = {
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Contact Us | Century Auto Parts",
      meta: [
        { name: "description", content: "Contact Hebei Century Auto Parts Co., Ltd. for factory-direct pricing on wheel balancing weights, tyre valves, TPMS and tyre repair products." },
        { rel: "canonical", href: "https://centurymanufacture.com/contact/" }
      ]
    });
    const form = reactive({ name: "", email: "", product: "Wheel Balancing Weights", message: "" });
    const sending = ref(false);
    const submitted = ref(false);
    const productOptions = [
      "Wheel Balancing Weights",
      "Tyre Valves",
      "TPMS",
      "Tyre Seal String",
      "Tyre Patch",
      "Mushroom Patch Plug",
      "Other"
    ];
    const info = [
      { label: "Address", value: "No.161, Qiantang Village, Qingyun Town, Yanshan County, Cangzhou City, Hebei Province, China" },
      { label: "Phone", value: "+86 15633632668", href: "tel:+8615633632668" },
      { label: "Email", value: "gracecenturyauto@gmail.com", href: "mailto:gracecenturyauto@gmail.com" },
      { label: "Hours", value: "Mon-Sat: 8am - 6pm" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Contact Us",
        subtitle: "Get a factory-direct quote from our sales team"
      }, null, _parent));
      _push(`<section class="py-20"><div class="container-app"><div class="grid grid-cols-1 lg:grid-cols-2 gap-12"><div><h2 class="text-2xl font-bold text-[#1A1A2E] mb-6">Get in Touch</h2><div class="space-y-4"><!--[-->`);
      ssrRenderList(info, (i) => {
        _push(`<div class="flex gap-3"><div class="w-10 h-10 shrink-0 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center">◈</div><div><div class="text-sm text-gray-500">${ssrInterpolate(i.label)}</div>`);
        if (i.href) {
          _push(`<a${ssrRenderAttr("href", i.href)} class="font-medium text-[#1A1A2E] hover:text-[#FF6B00]">${ssrInterpolate(i.value)}</a>`);
        } else {
          _push(`<div class="font-medium text-[#1A1A2E]">${ssrInterpolate(i.value)}</div>`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div><div class="mt-8 bg-gray-50 rounded-lg p-6"><h3 class="font-semibold text-[#1A1A2E] mb-2">Send an Inquiry</h3><p class="text-sm text-gray-500 leading-relaxed">Tell us the products you need and your target quantity. Our team will reply within 24 hours with a factory-direct quotation.</p></div></div><div class="bg-white border border-gray-200 rounded-lg shadow-card p-8"><h2 class="text-2xl font-bold text-[#1A1A2E] mb-6">Request a Quote</h2><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-600 mb-1">Your Name</label><input${ssrRenderAttr("value", form.name)} type="text" required placeholder="Your name" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"></div><div><label class="block text-sm font-medium text-gray-600 mb-1">Email</label><input${ssrRenderAttr("value", form.email)} type="email" required placeholder="you@company.com" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"></div><div><label class="block text-sm font-medium text-gray-600 mb-1">Product</label><select class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"><!--[-->`);
      ssrRenderList(productOptions, (p) => {
        _push(`<option${ssrRenderAttr("value", p)}${ssrIncludeBooleanAttr(Array.isArray(form.product) ? ssrLooseContain(form.product, p) : ssrLooseEqual(form.product, p)) ? " selected" : ""}>${ssrInterpolate(p)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-600 mb-1">Message</label><textarea rows="4" required placeholder="Tell us your requirements..." class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B00]">${ssrInterpolate(form.message)}</textarea></div><button type="submit"${ssrIncludeBooleanAttr(sending.value) ? " disabled" : ""} id="submitBtn" class="${ssrRenderClass([{ "opacity-60": sending.value }, "w-full btn btn-primary"])}">${ssrInterpolate(sending.value ? "Sending..." : "Send Inquiry")}</button>`);
      if (submitted.value) {
        _push(`<p class="text-green-600 text-sm text-center">Thank you! Your inquiry has been received. We will reply within 24 hours.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
