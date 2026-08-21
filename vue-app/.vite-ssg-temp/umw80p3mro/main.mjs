import { ViteSSG } from "vite-ssg";
import { ref, onMounted, onUnmounted, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
function useScrollHeader() {
  const shadowed = ref(false);
  let handler;
  onMounted(() => {
    handler = () => {
      shadowed.value = window.scrollY > 100;
    };
    window.addEventListener("scroll", handler, { passive: true });
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", handler);
  });
  return { shadowed };
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$3 = {
  __name: "SiteHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const { shadowed } = useScrollHeader();
    const navOpen = ref(false);
    const openMobile = ref(/* @__PURE__ */ new Set());
    const productsNav = [
      { label: "Wheel Balancing Weights", path: "/products/wheel-balancing-weights", children: [
        { label: "Fe Wheel Balancing Weights", path: "/products/wheel-balancing-weights/fe-wheel-balancing-weights" },
        { label: "Lead Wheel Balancing Weights", path: "/products/wheel-balancing-weights/lead-wheel-balancing-weights" }
      ] },
      { label: "Tyre Valves", path: "/products/tyre-valves", children: [
        { label: "Passenger Car & Light Truck", path: "/products/tyre-valves/passenger-car-light-truck-valves" },
        { label: "Truck & Bus", path: "/products/tyre-valves/truck-bus-valves" },
        { label: "Agricultural & Off-Road", path: "/products/tyre-valves/agricultural-tractors-off-road-valves" }
      ] },
      { label: "TPMS", path: "/products/tpms" },
      { label: "Tyre Seal String", path: "/products/tyre-seal-string" },
      { label: "Tyre Patch", path: "/products/tyre-patch" },
      { label: "Mushroom Patch Plug", path: "/products/mushroom-patch-plug" }
    ];
    const projectNav = [
      { label: "All Projects", path: "/project" },
      { label: "Asia", path: "/project#asia" },
      { label: "Europe", path: "/project#europe" },
      { label: "Middle East", path: "/project#middle-east" },
      { label: "Africa", path: "/project#africa" },
      { label: "Americas", path: "/project#americas" }
    ];
    function closeNav() {
      navOpen.value = false;
      openMobile.value = /* @__PURE__ */ new Set();
    }
    function onNavLinkClick() {
      if (window.innerWidth <= 768) closeNav();
    }
    onMounted(() => {
      const handler = () => {
        if (window.innerWidth > 768) closeNav();
      };
      window.addEventListener("resize", handler);
      onUnmounted(() => window.removeEventListener("resize", handler));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur border-b border-black/5 transition-shadow", unref(shadowed) ? "shadow-lg" : "shadow-md"]
      }, _attrs))} data-v-ca0fb340><div class="container-app" data-v-ca0fb340><div class="flex items-center justify-between py-3.5" data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/",
        class: "flex items-center gap-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B00] to-orange-500 text-white font-bold flex items-center justify-center shadow-md" data-v-ca0fb340${_scopeId}>C</span><span class="text-lg font-bold tracking-wider text-[#1A1A2E]" data-v-ca0fb340${_scopeId}>CENTURY<span class="text-[#FF6B00]" data-v-ca0fb340${_scopeId}>AUTO</span></span>`);
          } else {
            return [
              createVNode("span", { class: "w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B00] to-orange-500 text-white font-bold flex items-center justify-center shadow-md" }, "C"),
              createVNode("span", { class: "text-lg font-bold tracking-wider text-[#1A1A2E]" }, [
                createTextVNode("CENTURY"),
                createVNode("span", { class: "text-[#FF6B00]" }, "AUTO")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden md:block" data-v-ca0fb340><ul class="flex gap-6" data-v-ca0fb340><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/",
        class: "nav-link",
        "exact-active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/about",
        class: "nav-link",
        "active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About Us`);
          } else {
            return [
              createTextVNode("About Us")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="group relative" data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/products",
        class: "nav-link",
        "active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Products <span class="text-xs" data-v-ca0fb340${_scopeId}>▾</span>`);
          } else {
            return [
              createTextVNode("Products "),
              createVNode("span", { class: "text-xs" }, "▾")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<ul class="dropdown-menu" data-v-ca0fb340><!--[-->`);
      ssrRenderList(productsNav, (p) => {
        _push(`<li class="relative" data-v-ca0fb340>`);
        if (p.children) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_RouterLink, {
            to: p.path,
            class: "dropdown-item flex items-center justify-between group/sub"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p.label)} <span class="text-xs" data-v-ca0fb340${_scopeId}>▸</span>`);
              } else {
                return [
                  createTextVNode(toDisplayString(p.label) + " ", 1),
                  createVNode("span", { class: "text-xs" }, "▸")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<ul class="dropdown-submenu" data-v-ca0fb340><!--[-->`);
          ssrRenderList(p.children, (c) => {
            _push(`<li data-v-ca0fb340>`);
            _push(ssrRenderComponent(_component_RouterLink, {
              to: c.path,
              class: "dropdown-item"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(c.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(c.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul><!--]-->`);
        } else {
          _push(ssrRenderComponent(_component_RouterLink, {
            to: p.path,
            class: "dropdown-item"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(p.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></li><li class="group relative" data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/project",
        class: "nav-link",
        "active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Projects <span class="text-xs" data-v-ca0fb340${_scopeId}>▾</span>`);
          } else {
            return [
              createTextVNode("Projects "),
              createVNode("span", { class: "text-xs" }, "▾")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<ul class="dropdown-menu" data-v-ca0fb340><!--[-->`);
      ssrRenderList(projectNav, (pr) => {
        _push(`<li data-v-ca0fb340>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: pr.path,
          class: "dropdown-item"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(pr.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(pr.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></li><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/news",
        class: "nav-link",
        "active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`News`);
          } else {
            return [
              createTextVNode("News")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/contact",
        class: "nav-link",
        "active-class": "active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact`);
          } else {
            return [
              createTextVNode("Contact")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></nav><button class="md:hidden flex flex-col gap-1.5 p-1.5" aria-label="Toggle navigation" data-v-ca0fb340><span class="${ssrRenderClass([{ "rotate-45 translate-y-2": navOpen.value }, "w-6 h-0.5 bg-[#1A1A2E] rounded transition-transform"])}" data-v-ca0fb340></span><span class="${ssrRenderClass([{ "opacity-0": navOpen.value }, "w-6 h-0.5 bg-[#1A1A2E] rounded transition-opacity"])}" data-v-ca0fb340></span><span class="${ssrRenderClass([{ "-rotate-45 -translate-y-2": navOpen.value }, "w-6 h-0.5 bg-[#1A1A2E] rounded transition-transform"])}" data-v-ca0fb340></span></button></div><div class="md:hidden pb-4" style="${ssrRenderStyle(navOpen.value ? null : { display: "none" })}" data-v-ca0fb340><ul class="flex flex-col gap-2" data-v-ca0fb340><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/",
        class: "mobile-link",
        "exact-active-class": "active",
        onClick: closeNav
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/about",
        class: "mobile-link",
        "active-class": "active",
        onClick: closeNav
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About Us`);
          } else {
            return [
              createTextVNode("About Us")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-ca0fb340><div class="flex items-center justify-between" data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/products",
        class: "mobile-link",
        "active-class": "active",
        onClick: onNavLinkClick
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Products`);
          } else {
            return [
              createTextVNode("Products")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="px-3 py-1 text-[#FF6B00]" data-v-ca0fb340>▾</button></div><ul class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3" style="${ssrRenderStyle(openMobile.value.has("products") ? null : { display: "none" })}" data-v-ca0fb340><!--[-->`);
      ssrRenderList(productsNav, (p) => {
        _push(`<li data-v-ca0fb340>`);
        if (p.children) {
          _push(`<!--[--><div class="flex items-center justify-between" data-v-ca0fb340>`);
          _push(ssrRenderComponent(_component_RouterLink, {
            to: p.path,
            class: "mobile-link",
            "active-class": "active",
            onClick: onNavLinkClick
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(p.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button class="px-2 text-[#FF6B00]" data-v-ca0fb340>▾</button></div><ul class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3" style="${ssrRenderStyle(openMobile.value.has(p.label) ? null : { display: "none" })}" data-v-ca0fb340><!--[-->`);
          ssrRenderList(p.children, (c) => {
            _push(`<li data-v-ca0fb340>`);
            _push(ssrRenderComponent(_component_RouterLink, {
              to: c.path,
              class: "mobile-link",
              "active-class": "active",
              onClick: closeNav
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(c.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(c.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul><!--]-->`);
        } else {
          _push(ssrRenderComponent(_component_RouterLink, {
            to: p.path,
            class: "mobile-link",
            "active-class": "active",
            onClick: closeNav
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(p.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></li><li data-v-ca0fb340><div class="flex items-center justify-between" data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/project",
        class: "mobile-link",
        "active-class": "active",
        onClick: onNavLinkClick
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Projects`);
          } else {
            return [
              createTextVNode("Projects")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="px-3 py-1 text-[#FF6B00]" data-v-ca0fb340>▾</button></div><ul class="ml-4 flex flex-col gap-1 border-l-2 border-orange-300 pl-3" style="${ssrRenderStyle(openMobile.value.has("project") ? null : { display: "none" })}" data-v-ca0fb340><!--[-->`);
      ssrRenderList(projectNav, (pr) => {
        _push(`<li data-v-ca0fb340>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: pr.path,
          class: "mobile-link",
          "active-class": "active",
          onClick: closeNav
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(pr.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(pr.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></li><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/news",
        class: "mobile-link",
        "active-class": "active",
        onClick: closeNav
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`News`);
          } else {
            return [
              createTextVNode("News")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-ca0fb340>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/contact",
        class: "mobile-link",
        "active-class": "active",
        onClick: closeNav
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact`);
          } else {
            return [
              createTextVNode("Contact")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div></header>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/SiteHeader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SiteHeader = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-ca0fb340"]]);
const _sfc_main$2 = {
  __name: "SiteFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const quickLinks = [
      { label: "Home", path: "/" },
      { label: "About Us", path: "/about" },
      { label: "Products", path: "/products" },
      { label: "Projects", path: "/project" },
      { label: "News", path: "/news" },
      { label: "Contact", path: "/contact" }
    ];
    const productLinks = [
      { label: "Wheel Balancing Weights", path: "/products/wheel-balancing-weights" },
      { label: "Tyre Valves", path: "/products/tyre-valves" },
      { label: "TPMS", path: "/products/tpms" },
      { label: "Tyre Seal String", path: "/products/tyre-seal-string" },
      { label: "Tyre Patch", path: "/products/tyre-patch" },
      { label: "Mushroom Patch Plug", path: "/products/mushroom-patch-plug" }
    ];
    const socials = [
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100075854564828" },
      { label: "Instagram", href: "https://www.instagram.com/gracezzling0723/" },
      { label: "Skype", href: "https://join.skype.com/invite/uSfQyI4aIVi2" },
      { label: "WhatsApp", href: "https://api.whatsapp.com/send?phone=8615633632668" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-[#1A1A2E] text-gray-300 mt-auto" }, _attrs))}><div class="container-app py-14"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"><div><div class="flex items-center gap-2.5 mb-4"><span class="w-10 h-10 rounded-lg bg-[#FF6B00] text-white font-bold flex items-center justify-center">C</span><span class="text-lg font-bold tracking-wider text-white">CENTURY<span class="text-[#FF6B00]">AUTO</span></span></div><p class="text-sm text-gray-400 leading-relaxed">Professional manufacturer of tire repair products since 2010. Trusted by 50+ countries worldwide.</p></div><div><h4 class="text-white font-semibold mb-4">Quick Links</h4><ul class="flex flex-col gap-2.5 text-sm"><!--[-->`);
      ssrRenderList(quickLinks, (l) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: l.path,
          class: "hover:text-[#FF6B00]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="text-white font-semibold mb-4">Products</h4><ul class="flex flex-col gap-2.5 text-sm"><!--[-->`);
      ssrRenderList(productLinks, (l) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: l.path,
          class: "hover:text-[#FF6B00]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><h4 class="text-white font-semibold mb-4">Contact Us</h4><ul class="flex flex-col gap-3 text-sm text-gray-400"><li><strong class="text-gray-300">Address:</strong><br>No.161, Qiantang Village, Qingyun Town, Yanshan County, Cangzhou City, Hebei Province, China</li><li><strong class="text-gray-300">Phone:</strong> +86 15633632668</li><li><strong class="text-gray-300">Email:</strong> gracecenturyauto@gmail.com</li><li><strong class="text-gray-300">Hours:</strong> Mon-Sat: 8am - 6pm</li></ul></div></div><div class="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"><div class="flex gap-5 text-sm"><!--[-->`);
      ssrRenderList(socials, (s) => {
        _push(`<a${ssrRenderAttr("href", s.href)} target="_blank" rel="noopener" class="hover:text-[#FF6B00]">${ssrInterpolate(s.label)}</a>`);
      });
      _push(`<!--]--></div><p class="text-sm text-gray-500">Copyright 2012 - 2025 Hebei Century Auto Parts Co.,Ltd. All Rights Reserved.</p></div></div></footer>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/SiteFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<a${ssrRenderAttrs(mergeProps({
    href: "https://api.whatsapp.com/send?phone=8615633632668",
    target: "_blank",
    rel: "noopener",
    "aria-label": "Chat on WhatsApp",
    class: "fixed bottom-6 right-6 z-[999] bg-green-500 text-white px-4 py-3 rounded-full shadow-lg font-medium text-sm hover:bg-green-600 transition-colors"
  }, _attrs))}> WhatsApp </a>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/WhatsAppFloat.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const WhatsAppFloat = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterView = resolveComponent("RouterView");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(SiteHeader, null, null, _parent));
      _push(`<main class="flex-1">`);
      _push(ssrRenderComponent(_component_RouterView, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(ssrRenderComponent(WhatsAppFloat, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const routes = [
  { path: "/", name: "home", component: () => import("./assets/index-ClKYLqER.js") },
  { path: "/about", name: "about", component: () => import("./assets/about-CUYVlDcs.js") },
  { path: "/contact", name: "contact", component: () => import("./assets/contact-LlgAuHtZ.js") },
  { path: "/products", name: "products", component: () => import("./assets/products-D7ItqPd1.js") },
  { path: "/project", name: "project", component: () => import("./assets/project-DwgPmuIE.js") },
  { path: "/news", name: "news", component: () => import("./assets/news-vLy3PRo6.js") },
  { path: "/news/:slug", name: "article", component: () => import("./assets/ArticlePage-CoTClptN.js") },
  { path: "/products/:category/:slug?", name: "product", component: () => import("./assets/ProductPage-CnV6UK8p.js") },
  { path: "/:pathMatch(.*)*", redirect: "/" }
];
const createApp = ViteSSG(
  _sfc_main,
  { routes }
);
export {
  _export_sfc as _,
  createApp
};
