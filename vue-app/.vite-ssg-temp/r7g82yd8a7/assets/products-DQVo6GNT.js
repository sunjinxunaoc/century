const categories = [
  {
    slug: "wheel-balancing-weights",
    name: "Wheel Balancing Weights",
    tagline: "Precision-balanced clip-on & adhesive weights for every wheel type",
    intro: "Clip-on and adhesive wheel balancing weights in Fe (steel) and Pb (lead). Available in gram and OZ series from 5g up, with zinc plated, epoxy coated or black coated finishes.",
    subcategories: [
      {
        slug: "fe-wheel-balancing-weights",
        name: "Fe Wheel Balancing Weights",
        desc: "Six Fe models in adhesive and clip-on types: CTR-FE-01A/02A, CTR-FE-01C to CTR-FE-04C.",
        products: [
          {
            slug: "fe-adhesive-wheel-weight-ctr-fe-01a",
            name: "Fe Adhesive Wheel Weight CTR-FE-01A",
            tagline: "Self-adhesive steel wheel balancing weight for alloy rims. Round or right angle profile, 140 x 19 x 3.8 mm.",
            desc: "Self-adhesive steel wheel balancing weight for alloy and aluminum rims. Round or right angle profile, 140 x 19 x 3.8 mm.",
            keywords: "Fe Adhesive Wheel Weight, CTR-FE-01A, steel adhesive wheel weight, alloy rim weight",
            features: ["Self-adhesive backing", "Round / right angle profile", "Zinc plated, epoxy coated or black coated surface", "Blue, white, Norton or 3M tape options"],
            spec: {
              headers: ["Model", "Profile", "Shape", "Size", "Surface", "Tape", "Box"],
              rows: [["CTR-FE-01A", "Round / Right angle", "4 x 5gr + 4 x 10gr", "140 x 19 x 3.8 mm", "Zinc plated / Epoxy coated / Black coated", "Blue / White / Norton / 3M sticker", "100 PCS; 50 PCS"]]
            }
          },
          {
            slug: "steel-adhesive-wheel-weight-ctr-fe-02a",
            name: "Steel Adhesive Wheel Weight CTR-FE-02A",
            tagline: "Self-adhesive steel wheel balancing weight for alloy rims. 12 x 5gr, 140 x 19 x 3.8 mm.",
            desc: "Self-adhesive steel wheel balancing weight for alloy and aluminum rims.",
            keywords: "Steel Adhesive Wheel Weight, CTR-FE-02A, steel adhesive wheel weight, alloy rim weight",
            features: ["Self-adhesive backing", "For alloy and aluminum rims", "Rust resistant steel construction", "Multiple surface finishes available"],
            spec: {
              headers: ["Model", "Profile", "Shape", "Size", "Surface", "Tape", "Box"],
              rows: [["CTR-FE-02A", "Round / Right angle", "12 x 5gr", "140 x 19 x 3.8 mm", "Zinc plated / Epoxy coated / Black coated", "Blue / White / Norton / 3M sticker", "100 PCS; 50 PCS"]]
            }
          },
          {
            slug: "fe-clip-on-wheel-weight-alloy-rims-ctr-fe-01c",
            name: "Fe Clip On Wheel Weight for Alloy Rims CTR-FE-01C",
            tagline: "Steel clip on wheel balancing weight designed for alloy rims.",
            desc: "Steel clip on wheel balancing weight designed for alloy rims.",
            keywords: "Fe Clip On Wheel Weight, CTR-FE-01C, alloy rim clip on weight, steel clip on weight",
            features: ["Secure clip fit", "For alloy / steel / FN-series rims", "Precision balanced", "Gram and OZ series available"],
            spec: {
              headers: ["Model", "Application", "Weight Range", "Surface", "Packing", "Remarks"],
              rows: [["CTR-FE-01C", "Alloy rims", "5gr - 60gr", "Zinc plated", "100 PCS; 50 PCS", "TBD"]]
            }
          },
          {
            slug: "fe-clip-on-wheel-weight-fn-series-car-rims-ctr-fe-02c",
            name: "Fe Clip On Wheel Weight for FN Series Car Rims CTR-FE-02C",
            tagline: "Steel clip on wheel balancing weight designed for FN series car rims.",
            desc: "Steel clip on wheel balancing weight designed for FN series car rims.",
            keywords: "Fe Clip On Wheel Weight, CTR-FE-02C, FN series car rim weight, steel clip on weight",
            features: ["Secure clip fit", "For alloy / steel / FN-series rims", "Precision balanced", "Gram and OZ series available"],
            spec: {
              headers: ["Model", "Application", "Weight Range", "Surface", "Packing", "Remarks"],
              rows: [["CTR-FE-02C", "FN series car rims", "5gr - 60gr", "Zinc plated", "100 PCS; 50 PCS", "TBD"]]
            }
          },
          {
            slug: "fe-clip-on-wheel-weight-steel-rims-ctr-fe-03c",
            name: "Fe Clip On Wheel Weight for Steel Rims CTR-FE-03C",
            tagline: "Steel clip on wheel balancing weight designed for steel rims.",
            desc: "Steel clip on wheel balancing weight designed for steel rims.",
            keywords: "Fe Clip On Wheel Weight, CTR-FE-03C, steel rim clip on weight, steel clip on weight",
            features: ["Secure clip fit", "For alloy / steel / FN-series rims", "Precision balanced", "Gram and OZ series available"],
            spec: {
              headers: ["Model", "Application", "Weight Range", "Surface", "Packing", "Remarks"],
              rows: [["CTR-FE-03C", "Steel rims", "5gr - 60gr", "Zinc plated", "100 PCS; 50 PCS", "TBD"]]
            }
          },
          {
            slug: "fe-clip-on-wheel-weight-alloy-rims-ctr-fe-04c",
            name: "Fe Clip On Wheel Weight for Alloy Rims CTR-FE-04C",
            tagline: "Steel clip on wheel balancing weight designed for alloy rims.",
            desc: "Steel clip on wheel balancing weight designed for alloy rims.",
            keywords: "Fe Clip On Wheel Weight, CTR-FE-04C, alloy rim clip on weight, steel clip on weight",
            features: ["Secure clip fit", "For alloy / steel / FN-series rims", "Precision balanced", "Gram and OZ series available"],
            spec: {
              headers: ["Model", "Application", "Weight Range", "Surface", "Packing", "Remarks"],
              rows: [["CTR-FE-04C", "Alloy rims", "5gr - 60gr", "Zinc plated", "100 PCS; 50 PCS", "TBD"]]
            }
          }
        ]
      },
      {
        slug: "lead-wheel-balancing-weights",
        name: "Lead Wheel Balancing Weights",
        desc: "Five Pb models in adhesive and clip-on types: CTR-PB-01A/02A, CTR-PB-01C to CTR-PB-03C.",
        products: [
          {
            slug: "pb-adhesive-wheel-weight-ctr-pb-01a",
            name: "Pb Adhesive Wheel Weight CTR-PB-01A",
            tagline: "Self-adhesive lead wheel balancing weight offering superior vibration damping for alloy and aluminum rims. 105 x 18 x 4 mm.",
            desc: "Self-adhesive lead wheel balancing weight offering superior vibration damping for alloy and aluminum rims.",
            keywords: "Pb Adhesive Wheel Weight, CTR-PB-01A, lead adhesive wheel weight, alloy rim weight",
            features: ["Self-adhesive backing", "Superior vibration damping", "For alloy and aluminum rims", "Ordinary or easy-peel tape"],
            spec: {
              headers: ["Model", "Profile", "Shape", "Size", "Tape Shape", "Tape", "Box"],
              rows: [["CTR-PB-01A", "Round / Right angle", "4 x 5gr + 4 x 10gr", "105 x 18 x 4 mm", "Ordinary tape / Easy-peel tape", "Blue / White / Norton / 3M sticker", "100 PCS; 50 PCS"]]
            }
          },
          {
            slug: "lead-adhesive-wheel-weight-ctr-pb-02a",
            name: "Lead Adhesive Wheel Weight CTR-PB-02A",
            tagline: "Self-adhesive lead wheel balancing weight for alloy and aluminum rims. 12 x 5gr, 105 x 18 x 4 mm.",
            desc: "Self-adhesive lead wheel balancing weight for alloy and aluminum rims.",
            keywords: "Lead Adhesive Wheel Weight, CTR-PB-02A, lead adhesive wheel weight, alloy rim weight",
            features: ["Self-adhesive backing", "Superior vibration damping", "For alloy and aluminum rims", "Ordinary or easy-peel tape"],
            spec: {
              headers: ["Model", "Profile", "Shape", "Size", "Tape Shape", "Tape", "Box"],
              rows: [["CTR-PB-02A", "Round / Right angle", "12 x 5gr", "105 x 18 x 4 mm", "Ordinary tape / Easy-peel tape", "Blue / White / Norton / 3M sticker", "100 PCS; 50 PCS"]]
            }
          },
          {
            slug: "pb-clip-on-wheel-weight-steel-rims-ctr-pb-01c",
            name: "Pb Clip On Wheel Weight for Steel Rims CTR-PB-01C",
            tagline: "Lead clip on wheel balancing weight designed for steel rims.",
            desc: "Lead clip on wheel balancing weight designed for steel rims.",
            keywords: "Pb Clip On Wheel Weight, CTR-PB-01C, steel rim clip on weight, lead clip on weight",
            features: ["Secure clip fit", "Excellent vibration damping", "Natural color or plastic coated", "Gram and OZ series available"],
            spec: {
              headers: ["Model", "Application", "Weight Range", "Surface", "Packing", "Remarks"],
              rows: [["CTR-PB-01C", "Steel rims", "5gr - 60gr", "Natural color / Plastic coated", "100 PCS; 50 PCS", "TBD"]]
            }
          },
          {
            slug: "pb-clip-on-wheel-weight-alloy-rims-ctr-pb-02c",
            name: "Pb Clip On Wheel Weight for Alloy Rims CTR-PB-02C",
            tagline: "Lead clip on wheel balancing weight designed for alloy rims.",
            desc: "Lead clip on wheel balancing weight designed for alloy rims.",
            keywords: "Pb Clip On Wheel Weight, CTR-PB-02C, alloy rim clip on weight, lead clip on weight",
            features: ["Secure clip fit", "Excellent vibration damping", "Natural color or plastic coated", "Gram and OZ series available"],
            spec: {
              headers: ["Model", "Application", "Weight Range", "Surface", "Packing", "Remarks"],
              rows: [["CTR-PB-02C", "Alloy rims", "5gr - 60gr", "Natural color / Plastic coated", "100 PCS; 50 PCS", "TBD"]]
            }
          },
          {
            slug: "pb-clip-on-wheel-weight-truck-ctr-pb-03c",
            name: "Pb Clip On Wheel Weight for Truck CTR-PB-03C",
            tagline: "Lead clip on wheel balancing weight for truck steel wheels.",
            desc: "Lead clip on wheel balancing weight designed for truck steel wheels.",
            keywords: "Pb Clip On Wheel Weight, CTR-PB-03C, truck wheel weight, lead clip on weight",
            features: ["Secure clip fit", "Excellent vibration damping", "Natural color or plastic coated", "Heavy duty construction"],
            spec: {
              headers: ["Model", "Application", "Weight Range", "Surface", "Packing", "Remarks"],
              rows: [["CTR-PB-03C", "Truck steel wheels", "5gr - 500gr", "Natural color / Plastic coated", "100 PCS; 50 PCS", "TBD"]]
            }
          }
        ]
      }
    ]
  },
  {
    slug: "tyre-valves",
    name: "Tyre Valves",
    tagline: "Rubber & metal tyre valves for every vehicle type",
    intro: "Rubber & metal tyre valves for passenger cars, light trucks, trucks, buses, agricultural machinery and off-road vehicles.",
    subcategories: [
      {
        slug: "passenger-car-light-truck-valves",
        name: "Passenger Car & Light Truck",
        desc: "Eight tyre valve products: TR414, TR412-415 valve stems, TR414C and PVR40-70.",
        products: [
          {
            slug: "tr414-tyre-valve",
            name: "TR414 Tyre Valve",
            tagline: 'High quality rubber tyre valve for passenger cars and light trucks. Ref V2.03.2, 11.5mm/.453" rim hole, 38mm/1.50" effective length.',
            desc: "TR414 Tyre Valve - high quality rubber tyre valve stem for passenger cars and light trucks.",
            keywords: "TR414 tyre valve, TR414, rubber tyre valve, passenger car valve",
            features: ["Precision-engineered rubber valve", "Reliable leak-proof sealing", "Easy installation", "Factory direct supply"],
            spec: {
              headers: ["Model", "Ref. No.", "Rim Hole", "Eff. Length", "Core", "Cap"],
              rows: [["TR414", "V2.03.2", '11.5mm / .453"', '38mm / 1.50"', "9002#", "VC8"]]
            }
          },
          {
            slug: "tyre-valve-stem-tr414-tr412-tr413-tr415",
            name: "Tyre Valve Stem TR414 TR412 TR413 TR415",
            tagline: "Standard rubber tyre valve stems covering TR414, TR412, TR413 and TR415 for passenger cars and light trucks.",
            desc: "Standard rubber tyre valve stems for passenger cars and light trucks.",
            keywords: "tyre valve stem, TR414, TR412, TR413, TR415, rubber valve stem",
            features: ["Precision-engineered rubber valve", "Reliable leak-proof sealing", "Easy installation", "Factory direct supply"],
            spec: {
              headers: ["Model", "Ref. No.", "Rim Hole", "Eff. Length", "Core", "Cap"],
              rows: [
                ["TR412", "V2.03.6", '11.5mm / .453"', '22mm / 0.88"', "9002#", "VC8"],
                ["TR413", "V2.03.1", '11.5mm / .453"', '32mm / 1.25"', "9002#", "VC8"],
                ["TR414", "V2.03.2", '11.5mm / .453"', '38mm / 1.50"', "9002#", "VC8"],
                ["TR415", "V2.03.3", '15.8mm / .625"', '32mm / 1.25"', "9002#", "VC8"]
              ]
            }
          },
          {
            slug: "tr413-tr414-valve",
            name: "TR413 TR414 Valve",
            tagline: "The TR413 and TR414 rubber tyre valves offer reliable sealing for passenger cars and light trucks.",
            desc: "Rubber tyre valves TR413 and TR414 for passenger cars and light trucks.",
            keywords: "TR413 valve, TR414 valve, rubber tyre valve, passenger car valve",
            features: ["Precision-engineered rubber valve", "Reliable leak-proof sealing", "Easy installation", "Factory direct supply"],
            spec: {
              headers: ["Model", "Ref. No.", "Rim Hole", "Eff. Length", "Core", "Cap"],
              rows: [
                ["TR413", "V2.03.1", '11.5mm / .453"', '32mm / 1.25"', "9002#", "VC8"],
                ["TR414", "V2.03.2", '11.5mm / .453"', '38mm / 1.50"', "9002#", "VC8"]
              ]
            }
          },
          {
            slug: "tr412-tr413-tr415-tr414-tyre-valve-stem",
            name: "TR412 TR413 TR415 TR414 Tyre Valve Stem",
            tagline: "Standard rubber tyre valve stems covering TR412, TR413, TR415 and TR414 for passenger cars and light trucks.",
            desc: "Standard rubber valve stems covering TR412, TR413, TR415 and TR414.",
            keywords: "tyre valve stem, TR412, TR413, TR415, TR414, rubber valve stem",
            features: ["Precision-engineered rubber valve", "Reliable leak-proof sealing", "Easy installation", "Factory direct supply"],
            spec: {
              headers: ["Model", "Ref. No.", "Rim Hole", "Eff. Length", "Core", "Cap"],
              rows: [
                ["TR412", "V2.03.6", '11.5mm / .453"', '22mm / 0.88"', "9002#", "VC8"],
                ["TR413", "V2.03.1", '11.5mm / .453"', '32mm / 1.25"', "9002#", "VC8"],
                ["TR414", "V2.03.2", '11.5mm / .453"', '38mm / 1.50"', "9002#", "VC8"],
                ["TR415", "V2.03.3", '15.8mm / .625"', '32mm / 1.25"', "9002#", "VC8"]
              ]
            }
          },
          {
            slug: "tr414c-tyre-valve-stem",
            name: "TR414C Tyre Valve Stem",
            tagline: 'Rubber valve stem with 11.5mm/.453" rim hole, 38mm/1.50" length, max pressure 65 PSI.',
            desc: 'Rubber valve stem with 11.5mm/.453" rim hole, 38mm/1.50" length, max pressure 65 PSI.',
            keywords: "TR414C, tyre valve stem, rubber valve stem, passenger car valve",
            features: ["Precision-engineered rubber valve", "Reliable leak-proof sealing", "Easy installation", "Factory direct supply"],
            spec: {
              headers: ["Model", "Ref. No.", "Rim Hole", "Length", "Core", "Max Pressure"],
              rows: [["TR414C", "—", '11.5mm / .453"', '38mm / 1.50"', "9002#", "65 PSI"]]
            }
          },
          {
            slug: "pvr70-pvr60-pvr50-pvr40-valve-stem",
            name: "PVR70 PVR60 PVR50 PVR40 Valve Stem",
            tagline: "Motorcycle and scooter tyre valve stems in PVR40, PVR50, PVR60 and PVR70 with 45° / 90° bend options.",
            desc: "Motorcycle valve stems PVR40 - PVR70, 45° / 90° bend.",
            keywords: "PVR70, PVR60, PVR50, PVR40, motorcycle valve stem, scooter valve",
            features: ["Precision-engineered motorcycle valve", "Reliable leak-proof sealing", "45° / 90° bend options", "Factory direct supply"],
            spec: {
              headers: ["Model", "Valve Hole Diameter (mm)", "Max Pressure (PSI)", "Bent Degree"],
              rows: [
                ["PVR40", "8.8 - 9.5", "65", "45° / 90°"],
                ["PVR50", "9.5 - 10", "65", "45° / 90°"],
                ["PVR60", "10 - 10.5", "65", "45° / 90°"],
                ["PVR70", "11.5", "65", "45° / 90°"]
              ]
            }
          },
          {
            slug: "pvr70-pvr60-pvr50-pvr40-ventil",
            name: "PVR70 PVR60 PVR50 PVR40 Ventil",
            tagline: "Motorcycle and scooter tyre valve (ventil) stems in PVR40, PVR50, PVR60 and PVR70 with 45° / 90° bend options.",
            desc: "Motorcycle valve stems (ventil) PVR40 - PVR70, 45° / 90° bend.",
            keywords: "PVR70, PVR60, PVR50, PVR40, motorcycle valve, ventil",
            features: ["Precision-engineered motorcycle valve", "Reliable leak-proof sealing", "45° / 90° bend options", "Factory direct supply"],
            spec: {
              headers: ["Model", "Valve Hole Diameter (mm)", "Max Pressure (PSI)", "Bent Degree"],
              rows: [
                ["PVR40", "8.8 - 9.5", "65", "45° / 90°"],
                ["PVR50", "9.5 - 10", "65", "45° / 90°"],
                ["PVR60", "10 - 10.5", "65", "45° / 90°"],
                ["PVR70", "11.5", "65", "45° / 90°"]
              ]
            }
          },
          {
            slug: "valvula-pvr40-pvr50-pvr60-pvr70",
            name: "Valvula PVR40 PVR50 PVR60 PVR70",
            tagline: "Motorcycle and scooter tyre valve stems (valvula) in PVR40, PVR50, PVR60 and PVR70 with 45° / 90° bend options.",
            desc: "Motorcycle valve stems (valvula) PVR40 - PVR70, 45° / 90° bend.",
            keywords: "PVR40, PVR50, PVR60, PVR70, valvula, motorcycle valve stem",
            features: ["Precision-engineered motorcycle valve", "Reliable leak-proof sealing", "45° / 90° bend options", "Factory direct supply"],
            spec: {
              headers: ["Model", "Valve Hole Diameter (mm)", "Max Pressure (PSI)", "Bent Degree"],
              rows: [
                ["PVR40", "8.8 - 9.5", "65", "45° / 90°"],
                ["PVR50", "9.5 - 10", "65", "45° / 90°"],
                ["PVR60", "10 - 10.5", "65", "45° / 90°"],
                ["PVR70", "11.5", "65", "45° / 90°"]
              ]
            }
          }
        ]
      },
      {
        slug: "truck-bus-valves",
        name: "Truck & Bus",
        desc: "V3-20 series, TR570-TR572 and MS70-7 metal high-pressure valves.",
        models: ["V3-20-4", "V3-20-6", "V3-20-22-1/58MS", "TR570", "TR571", "TR572", "TR571C", "TR572C", "MS70-7"],
        products: []
      },
      {
        slug: "agricultural-tractors-off-road-valves",
        name: "Agricultural & Off-Road",
        desc: "TR618A, TRJ670-TRJ672 and TR1175A heavy-duty valves.",
        models: ["TR618A", "TRJ670", "TRJ671", "TRJ672", "TR1175A"],
        products: []
      }
    ]
  },
  {
    slug: "tpms",
    name: "TPMS",
    tagline: "Tyre Pressure Monitoring System valves & sensors",
    intro: "Advanced tyre pressure monitoring sensors that alert drivers to pressure changes and help prevent accidents. Compatible with standard valve stems.",
    cards: [
      { title: "TPMS Valve Sensors", desc: "Real-time tyre pressure monitoring sensors with low battery alert and easy installation." },
      { title: "TPMS Replacement Valve Core", desc: "Durable replacement valve cores specifically designed for TPMS systems." },
      { title: "TPMS Programming Tools", desc: "Professional tools for TPMS sensor programming and diagnosis." }
    ],
    subcategories: []
  },
  {
    slug: "tyre-seal-string",
    name: "Tyre Seal String",
    tagline: "Quick emergency puncture repair for tubeless tyres",
    intro: "High-quality rubber seal strips for quick, on-the-spot emergency puncture repairs on tubeless tyres.",
    cards: [
      { title: "Tyre Seal Strips", desc: "Quick emergency repair strips for minor punctures. Easy to use for on-the-spot repairs." },
      { title: "Emergency Kits", desc: "Complete tyre seal string repair kits for roadside use." }
    ],
    subcategories: []
  },
  {
    slug: "tyre-patch",
    name: "Tyre Patch",
    tagline: "Permanent repair patches for every tyre construction",
    intro: "Professional tyre patches applied to the inner liner for durable, permanent repairs - euro type radial patches, bias patches and tubeless patches.",
    cards: [
      { title: "Euro Type Radial Patch", desc: "For radial tyres with superior bonding strength." },
      { title: "Bias Patch", desc: "Traditional bias-ply patches for older tire constructions." },
      { title: "Tubeless Tyre Patch", desc: "Specialized patches for tubeless tyres ensuring airtight seal." }
    ],
    subcategories: []
  },
  {
    slug: "mushroom-patch-plug",
    name: "Mushroom Patch Plug",
    tagline: "The most reliable combination plug & patch repair",
    intro: "A mushroom-shaped plug where the stem fills the puncture and the patch bonds to the inner liner - combining the benefits of a plug and a patch.",
    cards: [
      { title: "Combination Plug & Patch", desc: "Stem fills puncture, patch seals from inside - the most reliable permanent repair." }
    ],
    subcategories: []
  }
];
function findCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
function findSubcategory(categorySlug, subSlug) {
  const cat = findCategory(categorySlug);
  if (!cat) return null;
  return cat.subcategories.find((s) => s.slug === subSlug) || null;
}
function findProduct(categorySlug, productSlug) {
  const cat = findCategory(categorySlug);
  if (!cat) return null;
  for (const sub of cat.subcategories) {
    const p = (sub.products || []).find((x) => x.slug === productSlug);
    if (p) return { product: p, subcategory: sub };
  }
  return null;
}
function relatedProducts(categorySlug, currentSlug, count = 3) {
  const cat = findCategory(categorySlug);
  if (!cat) return [];
  const all = [];
  for (const sub of cat.subcategories) {
    for (const p of sub.products || []) {
      if (p.slug !== currentSlug) all.push({ ...p, subSlug: sub.slug });
    }
  }
  return all.slice(0, count);
}
export {
  findSubcategory as a,
  findProduct as b,
  categories as c,
  findCategory as f,
  relatedProducts as r
};
