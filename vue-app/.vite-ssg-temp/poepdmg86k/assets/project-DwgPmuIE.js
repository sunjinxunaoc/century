import { unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./PageHero-BRQNIife.js";
import { _ as _sfc_main$2 } from "./CtaSection-DWHdbXkJ.js";
import { useHead } from "@unhead/vue";
const projectRegions = [
  {
    id: "asia",
    name: "Asia",
    subtitle: "Projects delivered across South-East Asia",
    projects: [
      {
        title: "Wheel Balancing Weights for Alloy Rim Assembly Line",
        img: "/images/wheel weight.webp",
        tags: ["Wheel Weights", "Asia"],
        desc: "Ongoing supply of Fe and Pb adhesive and clip-on wheel balancing weights supporting an alloy rim production line.",
        meta: [["Location", "Thailand"], ["Client", "Siam Alloy Wheels Co., Ltd."], ["Details", "120 tons, gram & OZ series"], ["Completion", "2025"]]
      },
      {
        title: "TPMS Valves for Passenger Car Line",
        img: "/images/TPMS Valve.webp",
        tags: ["TPMS", "Asia"],
        desc: "TPMS valve sensors supplied for passenger car tyre assembly in South-East Asia.",
        meta: [["Location", "Malaysia"], ["Client", "KL Auto Components Sdn. Bhd."], ["Details", "50,000 units / year"], ["Completion", "2025"]]
      },
      {
        title: "Truck & Bus Valves for Fleet Operator",
        img: "/images/tire valve.webp",
        tags: ["Tyre Valves", "Asia"],
        desc: "Metal high-pressure truck and bus valves supplied for a large commercial fleet maintenance program.",
        meta: [["Location", "Indonesia"], ["Client", "Nusantara Fleet Services"], ["Details", "TR570 / V3-20 series"], ["Completion", "2024"]]
      }
    ]
  },
  {
    id: "europe",
    name: "Europe",
    subtitle: "Projects delivered across Europe",
    projects: [
      {
        title: "Tyre Patch Range for Distributor Network",
        img: "/images/tire patch.webp",
        tags: ["Tyre Patch", "Europe"],
        desc: "Complete euro radial and bias patch range supplied to a national tyre repair product distributor.",
        meta: [["Location", "Poland"], ["Client", "EuroTyre Distributors Sp. z o.o."], ["Details", "Full size range, private label packing"], ["Completion", "2024"]]
      },
      {
        title: "Tyre Valve Bulk Supply",
        img: "/images/tire valve.webp",
        tags: ["Tyre Valves", "Europe"],
        desc: "Rubber TR-series and metal tyre valves supplied in bulk to a German automotive parts wholesaler.",
        meta: [["Location", "Germany"], ["Client", "NordGummi GmbH"], ["Details", "TR412 - TR415, custom packing"], ["Completion", "2024"]]
      }
    ]
  },
  {
    id: "middle-east",
    name: "Middle East",
    subtitle: "Projects delivered across the Middle East",
    projects: [
      {
        title: "Agricultural Valves for Tractor Assembly",
        img: "/images/tire valve.webp",
        tags: ["Tyre Valves", "Middle East"],
        desc: "Heavy-duty agricultural and off-road valves supplied for tractor assembly operations.",
        meta: [["Location", "United Arab Emirates"], ["Client", "Gulf Agri Machinery"], ["Details", "TR618A / TRJ670 series"], ["Completion", "2024"]]
      },
      {
        title: "Wheel Weights for Retail Chain",
        img: "/images/wheel weight.webp",
        tags: ["Wheel Weights", "Middle East"],
        desc: "Clip-on and adhesive wheel balancing weights supplied to a regional auto parts retail chain.",
        meta: [["Location", "Saudi Arabia"], ["Client", "Riyadh Auto Parts Co."], ["Details", "Fe & Pb, retail-ready boxes"], ["Completion", "2025"]]
      }
    ]
  },
  {
    id: "africa",
    name: "Africa",
    subtitle: "Projects delivered across Africa",
    projects: [
      {
        title: "Tyre Seal Strings for Emergency Kits",
        img: "/images/tire seal.webp",
        tags: ["Tyre Seal String", "Africa"],
        desc: "Emergency tyre seal strips supplied for roadside repair kits distributed across the region.",
        meta: [["Location", "South Africa"], ["Client", "Cape Emergency Products"], ["Details", "200,000 strips / order"], ["Completion", "2024"]]
      },
      {
        title: "Mushroom Patch Plugs for Trucking Fleet",
        img: "/images/tire patch.webp",
        tags: ["Mushroom Patch Plug", "Africa"],
        desc: "Combination mushroom patch plugs supplied for a large commercial trucking fleet maintenance program.",
        meta: [["Location", "Nigeria"], ["Client", "Lagos Trucking Co."], ["Details", "Multi-size kit supply"], ["Completion", "2023"]]
      }
    ]
  },
  {
    id: "americas",
    name: "Americas",
    subtitle: "Projects delivered across the Americas",
    projects: [
      {
        title: "Adhesive Wheel Weights for OEM",
        img: "/images/wheel weight.webp",
        tags: ["Wheel Weights", "Americas"],
        desc: "Adhesive wheel balancing weights supplied directly to an alloy rim OEM assembly line.",
        meta: [["Location", "Mexico"], ["Client", "Monterrey Alloy OEM"], ["Details", "5+10 / 5x12, 3M backing"], ["Completion", "2023"]]
      },
      {
        title: "Radial Patches for Tyre Shop Chain",
        img: "/images/tire patch.webp",
        tags: ["Tyre Patch", "Americas"],
        desc: "Euro radial and tubeless patches supplied to a national tyre service shop chain.",
        meta: [["Location", "Brazil"], ["Client", "Pneus Rapid Brasil"], ["Details", "30 size SKUs, private label"], ["Completion", "2024"]]
      }
    ]
  }
];
const _sfc_main = {
  __name: "project",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Our Projects | Century Auto Parts",
      meta: [
        { name: "description", content: "Explore Century Auto Parts export projects worldwide - wheel weights, tyre valves, TPMS, patches and repair materials supplied across Asia, Europe, Middle East, Africa and the Americas." },
        { rel: "canonical", href: "https://centurymanufacture.com/project/" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Our Projects",
        subtitle: "Export projects trusted by partners across 50+ countries"
      }, null, _parent));
      _push(`<section class="py-16"><div class="container-app"><div class="section-header"><h2 class="section-title">Global Delivery Cases</h2><p class="section-subtitle">Wheel balancing weights, tyre valves, TPMS, patches and repair materials supplied to OEMs, distributors and fleets worldwide</p></div><!--[-->`);
      ssrRenderList(unref(projectRegions), (region) => {
        _push(`<section${ssrRenderAttr("id", region.id)} class="py-10 scroll-mt-24"><div class="section-header"><h3 class="text-2xl font-bold text-[#1A1A2E] mb-2">${ssrInterpolate(region.name)}</h3><p class="text-gray-500">${ssrInterpolate(region.subtitle)}</p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(region.projects, (p) => {
          _push(`<div class="card reveal flex flex-col"><div class="aspect-[4/3] overflow-hidden bg-gray-100"><img${ssrRenderAttr("src", p.img)}${ssrRenderAttr("alt", p.title)} loading="lazy" class="w-full h-full object-cover"></div><div class="p-5 flex flex-col flex-1"><div class="flex flex-wrap gap-1.5 mb-2"><!--[-->`);
          ssrRenderList(p.tags, (t) => {
            _push(`<span class="tag">${ssrInterpolate(t)}</span>`);
          });
          _push(`<!--]--></div><h4 class="font-semibold text-[#1A1A2E] mb-2 leading-snug">${ssrInterpolate(p.title)}</h4><p class="text-sm text-gray-500 leading-relaxed mb-4">${ssrInterpolate(p.desc)}</p><div class="mt-auto pt-3 border-t border-dashed border-gray-200 text-xs text-gray-500 leading-relaxed"><!--[-->`);
          ssrRenderList(p.meta, ([k, v]) => {
            _push(`<div><strong class="text-gray-600">${ssrInterpolate(k)}:</strong> ${ssrInterpolate(v)}</div>`);
          });
          _push(`<!--]--></div></div></div>`);
        });
        _push(`<!--]--></div></section>`);
      });
      _push(`<!--]--></div></section>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        heading: "Start Your Project With Us",
        text: "Tell us your requirements - our team will provide a factory-direct solution."
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/project.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
