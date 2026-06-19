import { calculateEstimate } from "./calculationEngine.js";

export const quickEstimateConfig = {
  projectTypes: ["TV Wall / Media Wall", "Wall Panels", "Foyer / Entry Wall", "Bedroom Feature Wall", "Bathroom Vanity Wall", "Closet Doors / Closet Reface", "Office Built-In", "Kitchen Wall / Under Bar", "Full Custom Project"],
  rooms: ["Living Room", "Bedroom", "Foyer", "Hallway", "Kitchen", "Bathroom", "Closet", "Office", "Dining Area", "Den Room", "Other"],
  approximateSizes: {
    small: { label: "Small wall, up to 8 ft wide", widthMin: 6, widthMax: 8, heightMin: 8, heightMax: 10 },
    medium: { label: "Medium wall, 8-14 ft wide", widthMin: 8, widthMax: 14, heightMin: 8, heightMax: 10 },
    large: { label: "Large wall, 14-22 ft wide", widthMin: 14, widthMax: 22, heightMin: 9, heightMax: 11 },
    multiple: { label: "Multiple walls / full room", widthMin: 14, widthMax: 22, heightMin: 9, heightMax: 11, multiplierMin: 2, multiplierMax: 4 },
    double_height: { label: "Double-height area", widthMin: 10, widthMax: 18, heightMin: 14, heightMax: 22 },
    not_sure: { label: "Not sure", widthMin: 8, widthMax: 16, heightMin: 8, heightMax: 11 },
  },
  layouts: {
    "TV Wall / Media Wall": ["Simple TV panel", "TV wall with lower cabinet", "TV wall with tall side cabinets", "Full media wall with shelves", "TV wall with hidden door", "Premium TV wall with stone / mirror / LED"],
    "Wall Panels": ["Flat panels", "Fluted panels", "Mixed wood panels", "Stone-look accent", "Panels with LED", "Full hallway / full room panels"],
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
  const projectType = input.projectType || "TV Wall / Media Wall";
  const roomType = input.roomType || "";
  const size = resolveSize(input);
  const selectedFeatures = selectedFeaturesFromInput(input);
  const layout = input.selectedLayout || defaultLayout(projectType);
  const lineItems = buildLineItems(projectType, layout, input, size);
  const confidence = estimateConfidence(input);
  const buffer = confidence === "high" ? 1.08 : confidence === "medium" ? 1.18 : 1.32;
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
  const estimate = calculateEstimate({
    id: input.id || `quick-${Date.now()}`,
    mode: "quick_estimate",
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
    sourcePage: input.sourcePage || "/technical-millwork-planner",
    createdAt,
    status: input.status || "draft",
    recommendedNextAction: recommendedNextAction(input, confidence),
  });
  estimate.calculatedTotalMin = roundToHundreds(estimate.calculatedTotalMin * buffer);
  estimate.calculatedTotalMax = roundToHundreds(estimate.calculatedTotalMax * (buffer + 0.08));
  estimate.finalTotalMin = estimate.calculatedTotalMin;
  estimate.finalTotalMax = estimate.calculatedTotalMax;
  estimate.adjustmentAmountMin = 0;
  estimate.adjustmentAmountMax = 0;
  estimate.clientNote = "Final pricing may change after field measurements, material selection, engineering details and installation review.";
  return estimate;
}

function buildLineItems(projectType, layout, input, size) {
  const items = [];
  const areaMin = size.areaMin;
  const areaMax = size.areaMax;
  const widthMin = size.widthMin;
  const widthMax = size.widthMax;
  const cabinet = input.cabinets || "";
  const led = input.led || "";
  const shelves = input.shelves || "";
  const material = input.material || "";
  const hiddenDoors = input.hiddenDoors || "";

  const add = (catalogId, name, unit, qtyMin, qtyMax, extra = {}) => items.push({ id: `${catalogId}-${items.length + 1}`, catalogId, materialCode: catalogId, category: extra.category || "", name, unit, qtyMin, qtyMax, clientVisible: extra.clientVisible ?? true, included: true, excluded: false, description: extra.description || "" });
  const panelCatalog = /stone/i.test(layout) || /Stone/.test(material) ? "stone_look_panels" : /Premium|full media|Full/.test(layout) ? "panels_premium" : "panels_standard";
  const panelName = panelCatalog === "stone_look_panels" ? "Stone-look panels" : "Wall panels";

  if (!/Closet/.test(projectType) || /walk-in/i.test(layout)) add(panelCatalog, panelName, "sq_ft", areaMin, areaMax, { category: "panels" });
  if (/Under Bar/.test(projectType) || /under bar/i.test(layout)) add("under_bar_panels", "Under bar panels", "sq_ft", Math.max(24, areaMin * 0.35), Math.max(42, areaMax * 0.45));
  if (/lower|Both/i.test(cabinet) || /lower cabinet|Full media|Floating cabinet|Double vanity/i.test(layout)) add("cabinet_short", "Lower cabinet", "linear_ft", widthMin * 0.55, widthMax * 0.85);
  if (/Tall|Both/i.test(cabinet) || /tall side|Tall cabinet|Full media/i.test(layout)) add("cabinet_tall", "Tall side cabinets", "linear_ft", 2, Math.min(8, Math.max(4, widthMax * 0.35)));
  if (/TV Wall|Media Wall|TV wall/i.test(projectType + layout)) add("tv_mount", "TV mounting preparation", "fixed", 1, 1);
  if (/Simple lighting/i.test(led)) add("led", "Simple LED lighting allowance", "fixed", 1, 1);
  if (/Premium lighting/i.test(led) || /LED/i.test(layout)) add("led", "Premium LED lighting allowance", "fixed", 1, 2);
  if (/Few shelves/i.test(shelves) || /shelves|Shelving/i.test(layout)) add("shelves", "Shelves", "pcs", 2, 5);
  if (/Many shelves/i.test(shelves) || /Full media|Full office/i.test(layout)) add("shelves", "Shelves", "pcs", 4, 10);
  if (/Mirror|Both/i.test(material) || /mirror/i.test(layout)) add(/bronze/i.test(material) ? "mirror_bronze" : "mirror_standard", "Mirror feature", "sq_ft", 15, 28);
  if (/Stone-look|Both/i.test(material) && panelCatalog !== "stone_look_panels") add("stone_look_panels", "Stone-look accent material", "sq_ft", areaMin * 0.25, areaMax * 0.55);
  const doorCount = hiddenDoors.match(/\d+/)?.[0] ? Number(hiddenDoors.match(/\d+/)[0]) : /hidden door/i.test(layout) ? 1 : 0;
  if (doorCount) add(doorCount > 1 ? "custom_hidden_door" : "hidden_door", "Hidden door allowance", "pcs", doorCount, doorCount);
  if (/Sliding doors|Mirror doors/i.test(layout)) add("sliding_doors", "Sliding closet doors", "linear_ft", widthMin, widthMax);
  if (/Closet reface|Full closet front/i.test(layout)) add("closet_reface", "Closet reface pieces", "pcs", 2, 6);
  if (/Murphy bed/i.test(layout)) add("murphy_bed", "Murphy bed wall allowance", "fixed", 1, 1);
  if (/Desk wall/i.test(layout)) add("desk", "Built-in desk allowance", "fixed", 1, 1);
  if (/nightstands/i.test(layout)) add("nightstand", "Integrated nightstands", "pcs", 1, 2);
  if (/ceiling/i.test(layout)) add("panels_ceiling", "Ceiling panels", "sq_ft", areaMin * 0.35, areaMax * 0.65);
  if (/lamp/i.test(layout)) add("lamp", "Wall lights", "pcs", 1, 2);
  if (/Bathroom Vanity/.test(projectType)) items.push({ id: "excluded-countertop", category: "exclusion", name: "Countertop, sink and plumbing", description: "Excluded unless selected after review.", unit: "manual", totalMin: 0, totalMax: 0, clientVisible: true, included: false, excluded: true, formulaText: "excluded" });
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
  const minMultiplier = bucket.multiplierMin || walls;
  const maxMultiplier = bucket.multiplierMax || walls;
  return {
    widthMin: bucket.widthMin,
    widthMax: bucket.widthMax,
    heightMin: bucket.heightMin,
    heightMax: bucket.heightMax,
    areaMin: bucket.widthMin * bucket.heightMin * minMultiplier,
    areaMax: bucket.widthMax * bucket.heightMax * maxMultiplier,
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
