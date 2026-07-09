import {
  calculateCabinetryLineItem,
  calculateFixedLineItem,
  calculateMirrorLineItems,
  calculateWallPanelLineItem,
  createOffer,
  pricingRules,
  serviceLineItem,
  summarizePricing,
} from "./pricingRules.js";

export const quickEstimateConfig = {
  projectTypes: ["TV Wall / Media Wall", "Wall Panels", "Fireplace Wall", "Foyer / Entry Wall", "Bedroom Feature Wall", "Bathroom Vanity Wall", "Closet Doors / Closet Reface", "Office Built-In", "Kitchen Wall / Under Bar", "Full Custom Project"],
  rooms: ["Living Room", "Bedroom", "Foyer", "Hallway", "Kitchen", "Bathroom", "Closet", "Office", "Dining Area", "Den Room", "Other"],
  approximateSizes: {
    small: { label: "Small wall, up to 8 ft wide", widthMin: 8, widthMax: 8, heightMin: 9, heightMax: 9, placeholderSqFt: 72 },
    medium: { label: "Medium wall, 8-14 ft wide", widthMin: 12, widthMax: 12, heightMin: 9, heightMax: 9, placeholderSqFt: 108 },
    large: { label: "Large wall, 14-22 ft wide", widthMin: 18, widthMax: 18, heightMin: 9, heightMax: 9, placeholderSqFt: 162 },
    multiple: { label: "Multiple walls / full room", widthMin: 20, widthMax: 20, heightMin: 16, heightMax: 16, placeholderSqFt: 320 },
    double_height: { label: "Double-height area", widthMin: 18, widthMax: 18, heightMin: 18, heightMax: 18, placeholderSqFt: 324 },
    not_sure: { label: "Not sure", widthMin: 12, widthMax: 12, heightMin: 9, heightMax: 9, placeholderSqFt: 108 },
  },
  layouts: {
    "TV Wall / Media Wall": ["Simple TV panel", "TV wall with lower cabinet", "TV wall with tall side cabinets", "Full media wall with shelves", "TV wall with hidden door", "Premium TV wall with stone / mirror / LED"],
    "Wall Panels": ["Flat panels", "Fluted panels", "Mixed wood panels", "Stone-look accent", "Panels with LED", "Full hallway / full room panels"],
    "Fireplace Wall": ["Fireplace surround", "Fireplace wall with panels", "Fireplace wall with stone-look panels", "Fireplace wall with LED", "Full fireplace feature wall"],
    "Foyer / Entry Wall": ["Single accent wall", "Double-height foyer", "Wall with hidden door", "Wall with mirror", "Wall with ceiling panels", "Full foyer package"],
    "Bedroom Feature Wall": ["Bed back wall", "Bed wall with LED", "Bed wall with panels and nightstands", "TV wall", "Full bedroom feature package"],
    "Bathroom Vanity Wall": ["Vanity wall panels", "Mirror and LED", "Floating cabinet", "Double vanity", "Stone-look panels", "Full vanity feature wall"],
    "Closet Doors / Closet Reface": ["Sliding doors", "Mirror doors", "Closet reface", "Full closet front", "Walk-in closet system"],
    "Office Built-In": ["Desk wall", "Shelving wall", "Murphy bed wall", "Tall cabinet wall", "Full office built-in"],
    "Kitchen Wall / Under Bar": ["Kitchen accent wall", "Under bar panels", "Pantry / cabinet wall", "Panels with LED", "Full kitchen feature package"],
    "Full Custom Project": ["Custom wall", "Full room", "Multiple areas", "Not sure"],
  },
};

export function buildQuickEstimate(input = {}) {
  const createdAt = input.createdAt || new Date().toISOString();
  const rules = input.pricingRules || pricingRules;
  const projectType = input.projectType || "TV Wall / Media Wall";
  const roomType = input.roomType || "";
  const size = resolveSize(input);
  const selectedFeatures = selectedFeaturesFromInput(input);
  const layout = input.selectedLayout || defaultLayout(projectType);
  const lineItems = buildLineItems(projectType, layout, input, size, rules);
  const confidence = estimateConfidence(input);
  const pricingSummary = summarizePricing(lineItems, { confidence, rules });
  const offer = createOffer({ now: createdAt, rules });
  const section = {
    id: "quick-main-section",
    name: "Main area",
    widthFt: size.widthMax,
    heightFt: size.heightMax,
    calculatedAreaSqFt: size.areaMax,
    billableAreaSqFt: size.areaMax,
    allowAreaOverride: false,
    lineItems,
    options: [],
    notes: input.notes || "",
  };
  const estimate = {
    id: input.id || `quick-${Date.now()}`,
    publicId: input.publicId || "",
    mode: "quick_estimate",
    source: "quick_project_estimate",
    projectType,
    roomType,
    clientName: input.clientName || input.fullName || "",
    email: input.email || "",
    phone: input.phone || "",
    zip: input.zip || input.zipCode || "",
    address: input.address || "",
    timeline: input.timeline || "",
    budgetRange: input.budgetRange || input.budget || "",
    notes: input.notes || input.projectNotes || "",
    photos: input.photos || input.files || [],
    zones: [{
      id: "quick-zone-1",
      name: slug(projectType),
      displayName: `${projectType}${roomType ? ` - ${roomType}` : ""}`,
      type: projectType,
      sections: [section],
      selectedOptionId: "",
      images: [],
    }],
    selectedFeatures,
    selectedLayout: layout,
    sizeMode: input.sizeMode || "unknown",
    sizeBucket: input.sizeBucket || "",
    confidence,
    pricingRulesUsed: "cas_aurum_public_pricing_rules_v1",
    settings: rules.settings,
    ...pricingSummary,
    ...offer,
    sourcePage: input.sourcePage || "/technical-millwork-planner",
    createdAt,
    status: input.status || "draft",
    recommendedNextAction: recommendedNextAction(input, confidence),
  };
  estimate.calculatedTotalMin = estimate.rangeLow;
  estimate.calculatedTotalMax = estimate.rangeHigh;
  estimate.finalTotalMin = estimate.rangeLow;
  estimate.finalTotalMax = estimate.rangeHigh;
  estimate.adjustmentAmountMin = 0;
  estimate.adjustmentAmountMax = 0;
  estimate.clientNote = rules.disclaimers.preliminary;
  estimate.warnings = smartWarnings(projectType, layout, input);
  return estimate;
}

function buildLineItems(projectType, layout, input, size, rules = pricingRules) {
  const items = [];
  const widthMax = size.widthMax;
  const area = size.areaMax;
  const cabinet = input.cabinets || "";
  const led = input.led || "";
  const shelves = input.shelves || "";
  const material = input.material || "";
  const hiddenDoors = input.hiddenDoors || "";
  const wallCountLabel = input.wallCountLabel || "";

  const add = (item) => {
    if (!item) return;
    items.push(legacyLineItem(item, items.length + 1));
  };
  const panelAddOns = panelAddOnsFor({ projectType, layout, material, led, wallCountLabel });
  const panelName = /stone/i.test(layout) || /Stone-look|Both/i.test(material) ? "Stone-look wall panels" : "Wall panels";

  if (!/Closet Doors/.test(projectType) || /walk-in/i.test(layout)) add(calculateWallPanelLineItem({ squareFeet: area, addOns: panelAddOns, name: panelName }, rules));
  if (/Under Bar/.test(projectType) || /under bar/i.test(layout)) add(calculateWallPanelLineItem({ squareFeet: Math.max(42, area * 0.45), addOns: ["premium_material_egger_lioher"], name: "Kitchen wall / under bar panels" }, rules));
  if (/lower|Both/i.test(cabinet) || /lower cabinet|Full media|Floating cabinet/i.test(layout)) add(calculateCabinetryLineItem({ rateId: /Vanity|Bathroom/.test(projectType) ? "vanity" : "tv_stand", linearFeet: Math.max(4, widthMax * 0.75), name: /Vanity|Bathroom/.test(projectType) ? "Vanity cabinetry" : "Lower media cabinet" }, rules));
  if (/Tall|Both/i.test(cabinet) || /tall side|Tall cabinet|Full media/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "built_in_cabinetry", linearFeet: Math.min(10, Math.max(4, widthMax * 0.45)), name: "Tall side built-ins" }, rules));
  if (/Office Built-In/i.test(projectType) || /Shelving|office/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "built_in_cabinetry", linearFeet: Math.max(6, widthMax * 0.85), name: "Office built-in cabinetry" }, rules));
  if (/Closet/.test(projectType) || /Walk-in closet/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "wardrobe_closet", linearFeet: Math.max(6, widthMax), name: "Closet / wardrobe system" }, rules));
  if (/Kitchen/.test(projectType) && !/Under Bar/.test(layout)) add(calculateCabinetryLineItem({ rateId: "kitchen_cabinetry", linearFeet: Math.max(6, widthMax * 0.75), name: "Kitchen cabinetry allowance" }, rules));
  if (/Entry|Foyer/.test(projectType)) add(calculateCabinetryLineItem({ rateId: "entry_console_nightstands", linearFeet: Math.max(3, widthMax * 0.35), name: "Entry console allowance" }, rules));
  if (/Premium lighting/i.test(led)) add(serviceLineItem({ serviceId: "electrician_services", quantity: 1, overrideInternalPrice: 650 }, rules));
  if (/Few shelves/i.test(shelves) || /shelves|Shelving/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "built_in_cabinetry", linearFeet: Math.max(2, widthMax * 0.22), name: "Open shelving allowance" }, rules));
  if (/Many shelves/i.test(shelves) || /Full media|Full office/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "built_in_cabinetry", linearFeet: Math.max(4, widthMax * 0.4), name: "Expanded shelving allowance" }, rules));
  if (/Mirror|Both/i.test(material) || /mirror/i.test(layout)) calculateMirrorLineItems({ squareFeet: Math.max(18, Math.min(area * 0.45, 70)), includeInstall: true }, rules).forEach(add);
  const doorCount = hiddenDoors.match(/\d+/)?.[0] ? Number(hiddenDoors.match(/\d+/)[0]) : /hidden door/i.test(layout) ? 1 : 0;
  if (doorCount) add(calculateFixedLineItem({ id: doorCount > 1 ? "tall_hidden_door" : "hidden_door", category: "doors", name: doorCount > 1 ? "Tall hidden door" : "Hidden door", quantity: doorCount, internalPrice: doorCount > 1 ? rules.wallPanels.fixedAddOns.tall_hidden_door.internalPrice : rules.wallPanels.fixedAddOns.hidden_door.internalPrice }, rules));
  if (/Sliding doors|Mirror doors/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "wardrobe_closet", linearFeet: widthMax, name: "Closet doors / reface allowance" }, rules));
  if (/Murphy bed/i.test(layout)) add(calculateFixedLineItem({ id: "murphy_bed", category: "office", name: "Murphy bed wall allowance", quantity: 1, internalPrice: 9600 }, rules));
  if (/Desk wall/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "built_in_cabinetry", linearFeet: Math.max(4, widthMax * 0.55), name: "Built-in desk allowance" }, rules));
  if (/nightstands/i.test(layout)) add(calculateCabinetryLineItem({ rateId: "entry_console_nightstands", linearFeet: 4, name: "Integrated nightstands" }, rules));
  if (/ceiling/i.test(layout)) add(calculateWallPanelLineItem({ squareFeet: area * 0.55, addOns: ["premium_material_stone"], name: "Ceiling panels" }, rules));
  add(serviceLineItem({ serviceId: "delivery", quantity: 1 }, rules));
  if (/Bathroom Vanity/.test(projectType)) items.push({ id: "excluded-countertop", category: "exclusion", name: "Countertop, sink and plumbing", description: "Excluded unless selected after review.", unit: "manual", totalMin: 0, totalMax: 0, publicTotal: 0, clientVisible: true, included: false, excluded: true, formulaText: "excluded" });
  return items;
}

function resolveSize(input) {
  const exact = input.sizeMode === "exact";
  const walls = Math.max(1, Number(input.wallCount || input.numberOfWalls || 1));
  if (exact) {
    const width = clamp(Number(input.widthFt || 0), 1, 80);
    const height = clamp(Number(input.heightFt || 0), 1, 30);
    const area = width * height * walls;
    return { widthMin: width, widthMax: width, heightMin: height, heightMax: height, areaMin: area, areaMax: area };
  }
  const bucket = quickEstimateConfig.approximateSizes[input.sizeBucket] || quickEstimateConfig.approximateSizes.not_sure;
  const mappedWalls = wallMultiplier(input.wallCountLabel || input.quick_wall_count || "");
  const multiplier = mappedWalls || walls;
  const area = Number(bucket.placeholderSqFt || bucket.widthMax * bucket.heightMax) * multiplier;
  return {
    widthMin: bucket.widthMin,
    widthMax: bucket.widthMax,
    heightMin: bucket.heightMin,
    heightMax: bucket.heightMax,
    areaMin: area,
    areaMax: area,
  };
}

function selectedFeaturesFromInput(input) {
  return [input.cabinets, input.led, input.shelves, input.material, input.hiddenDoors, input.wallCount, input.drawings].filter(Boolean);
}

function estimateConfidence(input) {
  const hasPhotos = Number(input.photoCount || 0) > 0 || (Array.isArray(input.photos) && input.photos.length) || (Array.isArray(input.files) && input.files.length);
  if (input.sizeMode === "exact" && hasPhotos) return "high";
  if ((input.sizeBucket && input.sizeBucket !== "not_sure") || hasPhotos) return "medium";
  return "low";
}

function recommendedNextAction(input, confidence) {
  if (confidence === "low") return "Ask for wall width, ceiling height and 2-3 photos if missing. Offer Design Concept or detailed estimate review.";
  return "Review photos and dimensions, then offer Design Concept or detailed estimate review.";
}

function defaultLayout(projectType) {
  return quickEstimateConfig.layouts[projectType]?.[0] || "Custom wall";
}

function roundToHundreds(value) {
  return Math.max(0, Math.round(Number(value || 0) / 100) * 100);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function slug(value) {
  return String(value || "zone").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function legacyLineItem(item, index) {
  return {
    ...item,
    id: `${item.id || "line"}-${index}`,
    catalogId: item.id,
    materialCode: item.id,
    unit: item.unit,
    qty: item.quantity,
    qtyMin: item.quantity,
    qtyMax: item.quantity,
    unitPrice: item.publicUnitPrice,
    unitPriceMin: item.publicUnitPrice,
    unitPriceMax: item.publicUnitPrice,
    total: item.publicTotal,
    totalMin: item.publicTotal,
    totalMax: item.publicTotal,
    formulaText: `${item.quantity} ${item.unit} x public project rate`,
    included: true,
    excluded: false,
  };
}

function panelAddOnsFor({ projectType, layout, material, led, wallCountLabel }) {
  const text = `${projectType} ${layout} ${material} ${led} ${wallCountLabel}`;
  return [
    /Simple lighting|Premium lighting|LED/i.test(text) ? "led_lighting" : "",
    /Premium lighting|recessed/i.test(text) ? "recessed_lighting" : "",
    /Stone-look|travertine|marble|granite|metal|Both/i.test(text) ? "premium_material_stone" : "",
    /Fluted|3D|relief/i.test(text) ? "three_d_panels" : "",
    /Full|Premium/i.test(text) ? "multidimensional_design" : "",
    /Double-height|stair/i.test(text) ? "staircase_installation" : "",
  ].filter(Boolean);
}

function wallMultiplier(label) {
  if (/Two walls/i.test(label)) return 2;
  if (/Full room/i.test(label)) return 3;
  return 0;
}

function smartWarnings(projectType, layout, input) {
  return [
    /Not sure|^$/i.test(input.material || "") ? "Material not specified - pricing may be understated." : "",
    /lighting|LED/i.test(`${input.led || ""} ${layout}`) ? "Electrical work may be required for LED lighting." : "",
    /hidden door/i.test(`${input.hiddenDoors || ""} ${layout}`) ? "Hidden doors require field review and may affect hardware, framing and installation." : "",
    /Double-height|stair/i.test(`${input.wallCountLabel || ""} ${layout}`) ? "Double-height and staircase installations may require additional access, safety planning and installation review." : "",
    /Full Custom Project/i.test(projectType) ? "A detailed review is needed for custom scope. This estimate is a starting point only." : "",
  ].filter(Boolean);
}
