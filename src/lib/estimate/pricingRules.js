export const pricingRules = {
  settings: {
    publicPriceMultiplier: 1.1,
    promotionalDiscountPercent: 15,
    offerDurationHours: 24,
    requiredDepositPercent: 50,
    rangeSpreadPercent: 12,
    enablePublicCalculator: true,
    requireContactBeforePdf: true,
    sendClientEmailAutomatically: true,
    sendAdminNotification: true,
    allowPhotoUpload: true,
    maxPhotosPerZone: 4,
  },
  wallPanels: {
    baseRates: [
      { id: "under_100", label: "Under 100 SF", maxSqFt: 99.999, internalRate: 60 },
      { id: "100_249", label: "100-249 SF", minSqFt: 100, maxSqFt: 249.999, internalRate: 55 },
      { id: "250_plus", label: "250 SF and above", minSqFt: 250, internalRate: 50 },
    ],
    sfAddOns: {
      led_lighting: { name: "LED lighting", internalRate: 5 },
      premium_material_stone: { name: "Premium material: marble, travertine, granite, metal panels", internalRate: 5 },
      very_premium_material: { name: "Very premium material: onyx, book-matched stone, leather, wood veneer", internalRate: 10 },
      three_d_panels: { name: "3D panels / relief / fluted", internalRate: 5 },
      complex_three_d: { name: "Complex 3D / sculptural relief", internalRate: 10 },
      mosaic_irregular: { name: "Mosaic / small tiles / irregular shapes", internalRate: 5 },
      staircase_stairwell: { name: "Staircase / stairwell multiplier", internalRate: 5 },
      recessed_lighting: { name: "Recessed lighting", internalRate: 5 },
      premium_material_egger_lioher: { name: "Premium material / Egger / Lioher", internalRate: 10 },
      multidimensional_design: { name: "Multidimensional design", internalRate: 15 },
      many_small_pieces: { name: "Many small pieces / irregular shapes", internalRate: 10 },
      staircase_installation: { name: "Staircase installation multiplier", internalRate: 10 },
      natural_slab: { name: "Natural slab", internalRate: 80 },
      natural_wood: { name: "Natural wood", internalRate: 80 },
      curved_wall: { name: "Curved wall / curved pieces", internalRate: 40 },
    },
    fixedAddOns: {
      hidden_door: { name: "Hidden door", internalPrice: 2500 },
      tall_hidden_door: { name: "Tall hidden door", internalPrice: 3250 },
    },
  },
  cabinetry: {
    rates: {
      kitchen_cabinetry: { name: "Kitchen cabinetry", internalRate: 1000 },
      kitchen_island: { name: "Kitchen island", internalRate: 1200 },
      tv_stand: { name: "TV stand", internalRate: 600 },
      vanity: { name: "Vanity", internalRate: 1200 },
      wardrobe_closet: { name: "Wardrobe / closet", internalRate: 950 },
      bar_cabinetry: { name: "Bar cabinetry", internalRate: 1200 },
      built_in_cabinetry: { name: "Built-in cabinetry", internalRate: 1200 },
      entry_console_nightstands: { name: "Entry console / night stands", internalRate: 1400 },
    },
    glassDoors: {
      standard_glass_door: { name: "Standard glass door", internalPrice: 650 },
      large_glass_door: { name: "Large glass door", internalPrice: 1250 },
    },
  },
  mirrors: {
    internalRatePerSqFt: 80,
    internalInstallationFee: 1000,
  },
  services: {
    demolition: { name: "Demolition of existing walls/surfaces", description: "Remove existing wall finish or surface material before new work.", unitType: "SF", defaultInternalPrice: 8, taxable: true, visibleInClientPdf: true, active: true },
    garbage_removal: { name: "Garbage removal & haul-away", description: "Removal and haul-away of normal project debris.", unitType: "Fixed", defaultInternalPrice: 450, taxable: true, visibleInClientPdf: true, active: true },
    surface_preparation: { name: "Surface preparation", description: "Basic surface prep before panels or cabinetry.", unitType: "SF", defaultInternalPrice: 6, taxable: true, visibleInClientPdf: true, active: true },
    floor_furniture_protection: { name: "Floor & furniture protection", description: "Protection for adjacent finished areas.", unitType: "Fixed", defaultInternalPrice: 350, taxable: true, visibleInClientPdf: true, active: true },
    vent_relocation: { name: "Vent relocation", description: "Default allowance for vent relocation review.", unitType: "EA", defaultInternalPrice: 400, taxable: true, visibleInClientPdf: true, active: true },
    electrician_services: { name: "Electrician services", description: "Electrical coordination or connection work allowance.", unitType: "Manual", defaultInternalPrice: 0, taxable: true, visibleInClientPdf: true, active: true },
    plumbing_services: { name: "Plumbing services", description: "Plumbing coordination allowance.", unitType: "Manual", defaultInternalPrice: 0, taxable: true, visibleInClientPdf: true, active: true },
    framing_blocking: { name: "Framing / blocking installation", description: "Backing, framing or blocking needed for support.", unitType: "Manual", defaultInternalPrice: 0, taxable: true, visibleInClientPdf: true, active: true },
    touch_up_painting: { name: "Touch-up painting", description: "Minor paint touch-up after installation.", unitType: "Manual", defaultInternalPrice: 0, taxable: true, visibleInClientPdf: true, active: true },
    drywall_repair: { name: "Drywall repair", description: "Drywall repair allowance.", unitType: "Manual", defaultInternalPrice: 0, taxable: true, visibleInClientPdf: true, active: true },
    delivery: { name: "Delivery", description: "Delivery coordination allowance.", unitType: "Fixed", defaultInternalPrice: 650, taxable: true, visibleInClientPdf: true, active: true },
    installation: { name: "Installation", description: "Installation labor and coordination allowance.", unitType: "Manual", defaultInternalPrice: 0, taxable: true, visibleInClientPdf: true, active: true },
    design_consultation: { name: "Design consultation", description: "Design consultation allowance.", unitType: "Fixed", defaultInternalPrice: 350, taxable: false, visibleInClientPdf: true, active: true },
    site_measurement: { name: "Site measurement", description: "Site measurement visit allowance.", unitType: "Fixed", defaultInternalPrice: 450, taxable: false, visibleInClientPdf: true, active: true },
    project_management: { name: "Project management / coordination", description: "Coordination allowance for project planning.", unitType: "Manual", defaultInternalPrice: 0, taxable: true, visibleInClientPdf: true, active: true },
  },
  disclaimers: {
    preliminary: "This is a preliminary estimate based on the information entered. Final pricing may change after measurements, design review, material selection, site conditions and installation details.",
    offer: "This offer is available for qualified projects and is applied after Cas Aurum reviews your project details, photos and final scope.",
  },
};

export function publicPrice(internalPrice, rules = pricingRules) {
  return roundMoney(Number(internalPrice || 0) * Number(rules.settings.publicPriceMultiplier || 1));
}

export function wallPanelBaseRate(squareFeet, rules = pricingRules) {
  const area = Number(squareFeet || 0);
  return rules.wallPanels.baseRates.find((tier) => (tier.minSqFt == null || area >= tier.minSqFt) && (tier.maxSqFt == null || area <= tier.maxSqFt)) || rules.wallPanels.baseRates[0];
}

export function calculateWallPanelLineItem({ squareFeet = 0, addOns = [], name = "Wall panels" } = {}, rules = pricingRules) {
  const area = roundQty(squareFeet);
  const base = wallPanelBaseRate(area, rules);
  const selectedAddOns = addOns.map((id) => ({ id, ...rules.wallPanels.sfAddOns[id] })).filter((item) => item.name);
  const internalRate = Number(base.internalRate || 0) + selectedAddOns.reduce((sum, item) => sum + Number(item.internalRate || 0), 0);
  const publicRate = publicPrice(internalRate, rules);
  return lineItem({
    id: "wall_panels",
    category: "panels",
    name,
    unit: "SF",
    quantity: area,
    internalUnitPrice: internalRate,
    publicUnitPrice: publicRate,
    pricingBasis: `${base.label}${selectedAddOns.length ? ` + ${selectedAddOns.map((item) => item.name).join(", ")}` : ""}`,
  });
}

export function calculateCabinetryLineItem({ rateId, linearFeet = 0, name } = {}, rules = pricingRules) {
  const rate = rules.cabinetry.rates[rateId] || rules.cabinetry.rates.built_in_cabinetry;
  return lineItem({
    id: rateId || "built_in_cabinetry",
    category: "cabinetry",
    name: name || rate.name,
    unit: "LF",
    quantity: roundQty(linearFeet),
    internalUnitPrice: rate.internalRate,
    publicUnitPrice: publicPrice(rate.internalRate, rules),
    pricingBasis: rate.name,
  });
}

export function calculateFixedLineItem({ id, category = "add_on", name, quantity = 1, internalPrice = 0 } = {}, rules = pricingRules) {
  return lineItem({
    id,
    category,
    name,
    unit: "EA",
    quantity: roundQty(quantity || 1),
    internalUnitPrice: internalPrice,
    publicUnitPrice: publicPrice(internalPrice, rules),
    pricingBasis: "Fixed add-on",
  });
}

export function calculateMirrorLineItems({ squareFeet = 0, includeInstall = true } = {}, rules = pricingRules) {
  const area = roundQty(squareFeet);
  const items = [
    lineItem({
      id: "mirror_area",
      category: "mirror",
      name: "Mirror feature area",
      unit: "SF",
      quantity: area,
      internalUnitPrice: rules.mirrors.internalRatePerSqFt,
      publicUnitPrice: publicPrice(rules.mirrors.internalRatePerSqFt, rules),
      pricingBasis: "Mirror SF",
    }),
  ];
  if (includeInstall) {
    items.push(calculateFixedLineItem({
      id: "mirror_installation",
      category: "mirror",
      name: "Mirror installation fee",
      quantity: 1,
      internalPrice: rules.mirrors.internalInstallationFee,
    }, rules));
  }
  return items;
}

export function glassDoorLineItem({ size = "standard", quantity = 1 } = {}, rules = pricingRules) {
  const id = size === "large" ? "large_glass_door" : "standard_glass_door";
  const door = rules.cabinetry.glassDoors[id];
  return calculateFixedLineItem({ id, category: "glass", name: door.name, quantity, internalPrice: door.internalPrice }, rules);
}

export function serviceLineItem({ serviceId, quantity = 1, overrideInternalPrice = null } = {}, rules = pricingRules) {
  const service = rules.services[serviceId];
  if (!service || !service.active) return null;
  const unit = service.unitType || "Fixed";
  const internalPrice = overrideInternalPrice == null ? service.defaultInternalPrice : overrideInternalPrice;
  return lineItem({
    id: serviceId,
    category: "services",
    name: service.name,
    description: service.description,
    unit,
    quantity: roundQty(quantity || 1),
    internalUnitPrice: internalPrice,
    publicUnitPrice: publicPrice(internalPrice, rules),
    pricingBasis: unit,
    visibleInClientPdf: service.visibleInClientPdf,
    taxable: service.taxable,
  });
}

export function summarizePricing(lineItems = [], { confidence = "medium", rules = pricingRules } = {}) {
  const internalSubtotal = roundMoney(lineItems.reduce((sum, item) => sum + Number(item.internalTotal || 0), 0));
  const publicEstimateTotal = roundMoney(lineItems.reduce((sum, item) => sum + Number(item.publicTotal || 0), 0));
  const spread = confidenceRangeSpread(confidence, rules);
  const rangeLow = roundMoneyTo(publicEstimateTotal * (1 - spread / 100), 100);
  const rangeHigh = roundMoneyTo(publicEstimateTotal * (1 + spread / 100), 100);
  const discountPercent = Number(rules.settings.promotionalDiscountPercent || 0);
  const discountAmount = roundMoney(publicEstimateTotal * discountPercent / 100);
  const discountedTotal = roundMoney(publicEstimateTotal - discountAmount);
  const depositPercent = Number(rules.settings.requiredDepositPercent || 0);
  const depositAmount = roundMoney(discountedTotal * depositPercent / 100);
  return {
    internalSubtotal,
    publicMultiplierUsed: Number(rules.settings.publicPriceMultiplier || 1),
    publicEstimateTotal,
    estimatedTotal: publicEstimateTotal,
    rangeLow,
    rangeHigh,
    discountPercent,
    discountAmount,
    discountedTotal,
    depositPercent,
    depositAmount,
    rangeSpreadPercent: spread,
  };
}

export function createOffer({ now = new Date(), rules = pricingRules } = {}) {
  const offerCreatedAt = new Date(now).toISOString();
  const offerExpiresAt = new Date(new Date(offerCreatedAt).getTime() + Number(rules.settings.offerDurationHours || 24) * 60 * 60 * 1000).toISOString();
  return { offerCreatedAt, offerExpiresAt, offerStatus: "active" };
}

export function confidenceRangeSpread(confidence, rules = pricingRules) {
  if (confidence === "high") return 9;
  if (confidence === "low") return 22;
  return Number(rules.settings.rangeSpreadPercent || 12);
}

export function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function lineItem(item) {
  const quantity = roundQty(item.quantity || 0);
  const internalUnitPrice = roundMoney(item.internalUnitPrice || 0);
  const publicUnitPrice = roundMoney(item.publicUnitPrice || 0);
  return {
    ...item,
    quantity,
    qty: quantity,
    internalUnitPrice,
    publicUnitPrice,
    internalTotal: roundMoney(quantity * internalUnitPrice),
    publicTotal: roundMoney(quantity * publicUnitPrice),
    clientVisible: item.clientVisible ?? true,
  };
}

function roundQty(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function roundMoneyTo(value, increment = 100) {
  return Math.round(Number(value || 0) / increment) * increment;
}
