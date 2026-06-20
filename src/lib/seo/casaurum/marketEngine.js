export const SEO_MARKET_LOCALES = ["en", "es"];

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://casaurum.com").replace(/\/$/, "");
const BRAND = "CAS AURUM";
const MIN_INDEXABLE_SCORE = 82;

export const defaultNorthAtlantaMarkets = [
  "Atlanta",
  "Buckhead",
  "Alpharetta",
  "Milton",
  "Roswell",
  "Marietta",
  "Sandy Springs",
  "Johns Creek",
  "Brookhaven",
  "Suwanee",
  "Duluth",
  "Buford",
  "Cumming",
  "Peachtree Corners",
  "Decatur",
];

const serviceCommonFaq = [
  ["What should I send before starting?", "Photos, rough dimensions, ceiling height, project goals, inspiration images and any known site constraints help CAS AURUM recommend the right design concept, technical package or project review path."],
  ["Can this begin remotely?", "Yes. Design concepts and technical planning can begin from photos, measurements and drawings. Georgia projects may also be reviewed for selected local site visits and realization."],
  ["Is a concept the same as construction drawings?", "No. A design concept or technical package may include layout direction, material planning and preliminary fabrication notes where applicable, but it is not a substitute for licensed architectural, structural or code-required engineering documents."],
  ["Can CAS AURUM fabricate or install the project?", "Selected projects can be reviewed for full-service realization based on scope, budget, location, site conditions and logistics."],
];

export const seoMarketServices = [
  service("media_wall", "custom-media-walls", "Custom Media Walls", "Custom Media Walls", "media_wall", "media_wall", "from $450", "3-5 business days", "sales", "Custom TV walls, fireplace walls, floating consoles, storage, panels and lighting planned as one architectural composition.", "A custom media wall brings TV placement, storage, surface rhythm, wiring, lighting and materials into one considered focal point.", ["TV wall", "fireplace wall", "built-ins", "wood panels"], ["built_ins", "fireplace_wall", "wall_panels"]),
  service("kitchen", "custom-kitchens", "Custom Kitchens", "Custom Kitchens", "kitchen", "kitchen", "from $1,200", "7-14 business days", "high", "Kitchen concepts, cabinetry direction, island planning, pantry storage and millwork details designed around the way the home works.", "Custom kitchen planning starts with workflow, appliance logic, storage, island scale, cabinetry lines and material transitions before finishes are selected.", ["custom cabinetry", "kitchen island", "pantry", "millwork planning"], ["built_ins", "architectural_millwork", "custom_furniture"]),
  service("closet", "custom-closets", "Custom Closets", "Custom Closets", "closet", "closet", "from $650", "3-7 business days", "sales", "Closet and wardrobe planning for walk-ins, reach-ins, dressing rooms, accessory storage and integrated lighting.", "A custom closet should be planned around real wardrobe inventory, circulation, drawers, hanging zones, shoes, accessories, mirrors and daily routines.", ["walk-in closet", "wardrobe", "dressing room", "closet storage"], ["bedroom_feature_wall", "custom_furniture", "built_ins"]),
  service("built_ins", "custom-built-ins", "Custom Built-Ins", "Custom Built-Ins", "built_ins", "built_ins", "from $850", "5-10 business days", "sales", "Built-in shelving, storage walls, benches, living room cabinetry, office storage and specialty millwork made to fit the room.", "Custom built-ins solve storage and proportion together, giving awkward walls, niches and everyday rooms a more complete architectural role.", ["built-in cabinets", "library wall", "storage wall", "shelving"], ["library", "home_office", "media_wall"]),
  service("wall_panels", "wall-panels", "Architectural Wall Panels", "Architectural Wall Panels", "wall_panels", "wall_panels", "from $450", "3-7 business days", "standard", "Wood, fluted, stone-look, fabric, geometric and architectural wall panel concepts for homes and commercial interiors.", "Architectural wall panels can improve scale, texture, acoustic comfort and lighting when the pattern is designed around the room instead of applied as decoration.", ["wall panels", "feature wall", "fluted panels", "wood panels"], ["media_wall", "bedroom_feature_wall", "architectural_millwork"]),
  service("architectural_millwork", "architectural-millwork", "Custom Architectural Millwork", "Custom Architectural Millwork", "architectural_millwork", "architectural_millwork", "from $1,500", "7-14 business days", "high", "Site-specific millwork planning for cabinetry, panels, reception features, built-ins, storage, hospitality, office and residential scopes.", "Architectural millwork connects storage, surface, proportion, lighting and construction logic so the interior feels intentionally built around the space.", ["millwork", "cabinetry", "architectural details", "fabrication planning"], ["commercial_millwork", "built_ins", "wall_panels"]),
  service("commercial_millwork", "commercial-millwork", "Commercial Millwork", "Commercial Millwork", "commercial_millwork", "commercial_millwork", "custom quote", "reviewed by scope", "b2b", "Millwork concepts and technical review for offices, hospitality, restaurants, retail spaces, lobbies and designer or builder-led work.", "Commercial millwork requests are reviewed through drawings, scope notes, timelines, finish schedules, access requirements and coordination needs.", ["commercial millwork", "hospitality millwork", "office millwork", "restaurant millwork"], ["architectural_millwork", "wall_panels", "custom_furniture"]),
  service("custom_furniture", "custom-furniture", "Custom Furniture", "Custom Furniture", "custom_furniture", "custom_furniture", "from $850", "5-10 business days", "standard", "One-of-one furniture concepts, tables, consoles, vanities, bedroom pieces, storage pieces and coordinated furniture details.", "Custom furniture gives a space exact proportions, materials and function when catalog pieces would feel disconnected from the architecture.", ["custom furniture", "made-to-fit furniture", "console", "table"], ["built_ins", "closet", "home_office"]),
  service("bathroom_vanity", "bathroom-vanities", "Custom Bathroom Vanities", "Custom Bathroom Vanities", "bathroom_vanity", "bathroom_vanity", "from $850", "5-10 business days", "standard", "Vanity concepts with storage, stone, plumbing awareness, mirror scale, lighting and bathroom millwork direction.", "A custom bathroom vanity works best when storage, plumbing, mirror, outlets, lighting and moisture-resistant details are planned together.", ["bathroom vanity", "custom vanity", "bathroom millwork"], ["wall_panels", "custom_furniture", "architectural_millwork"]),
  service("home_office", "home-offices", "Custom Home Offices", "Custom Home Offices", "home_office", "home_office", "from $850", "5-10 business days", "standard", "Home office desks, storage walls, shelves, libraries, display cabinetry and concealed wiring planned around daily work.", "A custom home office should make equipment, files, books, lighting, video calls and storage feel composed instead of improvised.", ["home office", "desk wall", "office built-ins"], ["library", "built_ins", "wall_panels"]),
  service("library", "libraries", "Custom Libraries", "Custom Libraries", "library", "library", "from $850", "5-10 business days", "standard", "Library walls, bookcases, reading niches, display shelves, lower cabinets and integrated lighting for homes and offices.", "Custom libraries balance books, display, closed storage, lighting, ladder logic, cabinet depth and the room's quiet atmosphere.", ["library wall", "bookcase", "display shelves"], ["built_ins", "home_office", "custom_furniture"]),
  service("mudroom", "mudrooms", "Custom Mudrooms", "Custom Mudrooms", "mudroom", "mudroom", "from $650", "3-7 business days", "standard", "Mudroom benches, lockers, hooks, drawers, shoe storage and durable entry organization designed around real routines.", "A custom mudroom works when storage counts, clearances, door swings, durable finishes and family routines are planned before the first cabinet is drawn.", ["mudroom", "entry storage", "lockers", "bench"], ["built_ins", "wall_panels", "custom_furniture"]),
  service("fireplace_wall", "fireplace-walls", "Custom Fireplace Walls", "Custom Fireplace Walls", "fireplace_wall", "fireplace_wall", "from $650", "3-7 business days", "standard", "Fireplace wall concepts with stone, panels, storage, mantels, TV integration, lighting and heat-clearance review.", "A custom fireplace wall needs careful balance between heat, surface materials, TV placement, storage, lighting and visual weight.", ["fireplace wall", "mantel", "TV fireplace wall"], ["media_wall", "wall_panels", "built_ins"]),
  service("bedroom_feature_wall", "bedroom-feature-walls", "Bedroom Feature Walls", "Bedroom Feature Walls", "bedroom_feature_wall", "bedroom_feature_wall", "from $450", "3-5 business days", "standard", "Bedroom wall concepts with headboard panels, integrated nightstands, lighting, wood, fabric or stone-inspired surfaces.", "A bedroom feature wall should support calm, storage, lighting and proportion rather than acting as a decorative afterthought.", ["bedroom feature wall", "headboard wall", "wall panels"], ["closet", "wall_panels", "custom_furniture"]),
];

export const seoMarketStates = [
  state("georgia", "Georgia", "GA", "core", "full_service_local", ["media_wall", "kitchen", "closet", "built_ins", "wall_panels", "architectural_millwork", "commercial_millwork", "custom_furniture", "bathroom_vanity", "home_office", "library", "mudroom", "fireplace_wall", "bedroom_feature_wall"], "CAS AURUM creates custom media walls, kitchens, closets, built-ins and architectural millwork for Georgia homes, with design concepts, technical planning and selected full-service realization."),
  state("florida", "Florida", "FL", "expansion", "selected_full_service"),
  state("new-york", "New York", "NY", "expansion", "selected_full_service"),
  state("california", "California", "CA", "expansion", "selected_full_service"),
  state("texas", "Texas", "TX", "expansion", "selected_full_service"),
  state("illinois", "Illinois", "IL", "expansion", "design_concept_remote"),
  state("north-carolina", "North Carolina", "NC", "expansion", "design_concept_remote"),
  state("tennessee", "Tennessee", "TN", "expansion", "design_concept_remote"),
  state("dc-northern-virginia", "Washington DC / Northern Virginia", "DC/VA", "expansion", "selected_full_service"),
  state("massachusetts", "Massachusetts", "MA", "expansion", "design_concept_remote"),
  state("arizona", "Arizona", "AZ", "expansion", "design_concept_remote"),
  state("ohio", "Ohio", "OH", "expansion", "design_concept_remote"),
  state("indiana", "Indiana", "IN", "expansion", "design_concept_remote"),
  state("washington-state", "Washington", "WA", "expansion", "design_concept_remote"),
  state("colorado", "Colorado", "CO", "expansion", "design_concept_remote"),
];

export const seoMarketCities = [
  city("atlanta", "Atlanta", "georgia", "core", 5, "Atlanta homes often need custom millwork that feels integrated with the architecture while staying practical for family use, entertaining and long-term durability.", "Serving Atlanta, North Atlanta suburbs and selected projects across Georgia."),
  city("buckhead", "Buckhead", "georgia", "core", 5, "Buckhead projects often call for refined cabinetry, media walls, closets and built-ins that feel made for the home's proportions rather than selected from a catalog."),
  city("sandy-springs", "Sandy Springs", "georgia", "core", 4, "Sandy Springs interiors benefit from custom storage, built-ins and material direction that support daily living without losing architectural clarity."),
  city("brookhaven", "Brookhaven", "georgia", "core", 4, "Brookhaven homes often need tailored kitchens, living room built-ins and closets that make existing rooms feel more complete."),
  city("alpharetta", "Alpharetta", "georgia", "core", 5, "Alpharetta projects often combine family function with custom media walls, kitchens, storage and millwork that can hold up to daily use."),
  city("johns-creek", "Johns Creek", "georgia", "core", 4, "Johns Creek homes are a strong fit for custom closet planning, built-ins, media walls and technical millwork packages."),
  city("milton", "Milton", "georgia", "core", 5, "Milton homes often have generous rooms where custom wall composition, storage and material planning can make the scale feel intentional."),
  city("roswell", "Roswell", "georgia", "core", 4, "Roswell projects often benefit from architectural millwork that respects existing character while improving function and storage."),
  city("suwanee", "Suwanee", "georgia", "core", 4, "Suwanee homes are a strong fit for custom media walls, built-ins, mudrooms and family storage planned around daily routines."),
  city("duluth", "Duluth", "georgia", "core", 3, "Duluth projects can use custom millwork to clarify storage, improve focal walls and make renovated rooms feel complete."),
  city("cumming", "Cumming", "georgia", "core", 4, "Cumming homes often need media walls, built-ins, closets and mudrooms that improve storage while keeping the room calm."),
  city("buford", "Buford", "georgia", "core", 3, "Buford projects are a good fit for custom built-ins, media walls and storage planning where standard cabinetry feels unfinished."),
  city("marietta", "Marietta", "georgia", "core", 4, "Marietta homes often benefit from custom kitchens, built-ins, media walls and architectural millwork that respect established residential architecture."),
  city("sugar-hill", "Sugar Hill", "georgia", "core", 3, "Sugar Hill homes can benefit from tailored media walls, built-ins and closets planned around actual dimensions and family use."),
  city("peachtree-corners", "Peachtree Corners", "georgia", "core", 4, "Peachtree Corners projects are a strong fit for warm minimal built-ins, media walls, home offices and custom cabinetry planned for family routines."),
  city("decatur", "Decatur", "georgia", "core", 4, "Decatur homes often need custom millwork that balances older-home character, efficient storage, natural light and thoughtful material selection."),
  city("marietta-east-cobb", "Marietta / East Cobb", "georgia", "core", 4, "Marietta and East Cobb homes often need custom kitchens, built-ins and architectural millwork that work with established residential architecture."),
  city("dunwoody", "Dunwoody", "georgia", "core", 4, "Dunwoody projects often call for custom storage, home offices, media walls and built-ins that make existing homes work better."),
  city("miami", "Miami", "florida", "expansion", 5, "Miami projects reward clean drama, integrated lighting, custom storage and materials that can handle bright daylight and entertainment-focused living."),
  city("fort-lauderdale", "Fort Lauderdale", "florida", "expansion", 4, "Fort Lauderdale projects can begin with remote design concepts for media walls, kitchens, closets and built-ins, then move into review if the scope fits."),
  city("boca-raton", "Boca Raton", "florida", "expansion", 5, "Boca Raton homes are a strong fit for custom closets, media walls, kitchens and millwork concepts that balance function with refined materials."),
  city("palm-beach", "Palm Beach", "florida", "expansion", 5, "Palm Beach projects often need bright, durable, carefully edited materials for custom wall panels, closets, guest suites and built-ins."),
  city("naples", "Naples", "florida", "expansion", 5, "Naples projects can use design concepts and technical planning to clarify materials, storage, lighting and full-service feasibility before larger commitments."),
  city("new-york", "New York City", "new-york", "expansion", 5, "New York interiors depend on precision, vertical storage, compact tolerances and custom built-ins that make every inch useful."),
  city("long-island", "Long Island", "new-york", "expansion", 4, "Long Island homes are a fit for remote concepts and planning for kitchens, closets, built-ins and living room millwork."),
  city("hamptons", "Hamptons", "new-york", "expansion", 5, "Hamptons homes often need custom millwork that feels calm, durable and tailored to private entertaining and guest-ready rooms."),
  city("westchester", "Westchester", "new-york", "expansion", 4, "Westchester projects can benefit from custom storage, kitchens, offices and built-ins planned around family homes and established architecture."),
  city("los-angeles", "Los Angeles", "california", "expansion", 5, "Los Angeles interiors benefit from soft daylight, open-plan awareness, custom storage and media walls designed around the visual rhythm of the room."),
  city("san-diego", "San Diego", "california", "expansion", 4, "San Diego projects can use remote concepts for custom cabinetry, media walls, built-ins and material palettes that respond to indoor-outdoor living."),
  city("orange-county", "Orange County", "california", "expansion", 4, "Orange County projects can begin with remote design concepts for custom kitchens, closets, built-ins and feature walls."),
  city("beverly-hills", "Beverly Hills", "california", "expansion", 5, "Beverly Hills projects often need one-of-one closets, furniture, media walls and millwork with exact finish quality and a private residential feel."),
  city("malibu", "Malibu", "california", "expansion", 5, "Malibu projects should account for daylight, material restraint, coastal conditions and custom work that feels integrated rather than decorative."),
  city("san-francisco", "San Francisco / Bay Area", "california", "expansion", 5, "San Francisco and Bay Area homes often need compact, intelligent storage, built-ins, closets and custom office millwork."),
  city("dallas", "Dallas", "texas", "expansion", 5, "Dallas interiors can support confident media walls, built-ins, offices and kitchens when the scale and materials are planned with restraint."),
  city("fort-worth", "Fort Worth", "texas", "expansion", 4, "Fort Worth homes are a fit for custom built-ins, media walls, offices and millwork concepts with warm materials and durable detailing."),
  city("san-antonio", "San Antonio", "texas", "expansion", 4, "San Antonio projects can begin with design concepts for custom cabinetry, wall panels, media walls and storage tailored to the home."),
  city("austin", "Austin", "texas", "expansion", 5, "Austin projects are a fit for architectural millwork, custom kitchens, media walls and built-ins with clean lines and practical technical planning."),
  city("houston", "Houston", "texas", "expansion", 4, "Houston homes often need generous storage, kitchens, wall panels and built-ins that bring order to larger rooms and open plans."),
  city("jacksonville", "Jacksonville", "florida", "expansion", 4, "Jacksonville homes can use custom media walls, built-ins, kitchens and closets planned around natural light, durability and family use."),
  city("tampa", "Tampa", "florida", "expansion", 4, "Tampa projects can begin with remote design concepts for custom cabinetry, media walls, wall panels and storage-heavy rooms."),
  city("orlando", "Orlando", "florida", "expansion", 4, "Orlando homes are a fit for custom built-ins, media walls, closets and kitchen cabinetry concepts planned around daily routines."),
  city("chicago", "Chicago", "illinois", "expansion", 5, "Chicago interiors can carry strong architectural rhythm through panel grids, offices, libraries, built-ins and custom closet planning."),
  city("columbus", "Columbus", "ohio", "expansion", 4, "Columbus projects can start with design concepts for custom cabinetry, media walls, built-ins and architectural millwork."),
  city("charlotte", "Charlotte", "north-carolina", "expansion", 4, "Charlotte homes are a fit for custom built-ins, kitchens, closets and offices that feel tailored without becoming overdone."),
  city("indianapolis", "Indianapolis", "indiana", "expansion", 4, "Indianapolis homes can use custom built-ins, kitchens, media walls and closets planned for storage, warmth and long-term durability."),
  city("seattle", "Seattle", "washington-state", "expansion", 5, "Seattle interiors benefit from moisture-aware material planning, calm built-ins, view preservation and warm integrated lighting."),
  city("denver", "Denver", "colorado", "expansion", 5, "Denver projects are a fit for custom millwork, media walls, fireplace walls and built-ins with warm natural textures and durable detailing."),
  city("nashville", "Nashville", "tennessee", "expansion", 4, "Nashville projects can use custom millwork, restaurant panels, home bars, media walls and storage to bring warmth and structure."),
  city("washington-dc", "Washington DC", "dc-northern-virginia", "expansion", 5, "Washington DC projects often need measured offices, libraries, built-ins and wall systems with calm authority and durable materials."),
  city("northern-virginia", "Northern Virginia", "dc-northern-virginia", "expansion", 4, "Northern Virginia homes are a fit for custom offices, media walls, closets, kitchens and storage planning."),
  city("boston", "Boston", "massachusetts", "expansion", 5, "Boston homes often benefit from custom millwork that respects existing architecture while improving storage, lighting and daily function."),
  city("scottsdale", "Scottsdale", "arizona", "expansion", 5, "Scottsdale projects should account for strong sun, stone, wood, texture and evening lighting in custom vanities, walls and built-ins."),
  city("phoenix", "Phoenix", "arizona", "expansion", 4, "Phoenix projects can begin with remote design concepts for custom media walls, vanities, offices, closets and built-ins."),
];

const servicesById = new Map(seoMarketServices.map((item) => [item.id, item]));
const statesById = new Map(seoMarketStates.map((item) => [item.id, item]));
const statesBySlug = new Map(seoMarketStates.map((item) => [item.slug, item]));
const citiesBySlug = new Map(seoMarketCities.map((item) => [item.slug, item]));

const wave1Indexable = new Set([
  "/georgia",
  "/georgia/custom-media-walls",
  "/georgia/custom-kitchens",
  "/georgia/custom-closets",
  "/georgia/custom-built-ins",
  "/georgia/wall-panels",
  "/georgia/architectural-millwork",
]);

const wave2Indexable = new Set([
  "/atlanta/custom-media-walls",
  "/atlanta/custom-kitchens",
  "/atlanta/custom-closets",
  "/atlanta/custom-built-ins",
  "/atlanta/architectural-millwork",
  "/buckhead/custom-kitchens",
  "/alpharetta/custom-media-walls",
  "/alpharetta/custom-kitchens",
  "/johns-creek/custom-closets",
  "/milton/custom-media-walls",
  "/sandy-springs/custom-built-ins",
  "/roswell/architectural-millwork",
  "/suwanee/custom-media-walls",
]);

const expansionNoindex = new Set([
  "/miami/custom-media-walls",
  "/miami/custom-kitchens",
  "/new-york/custom-closets",
  "/los-angeles/custom-media-walls",
  "/austin/architectural-millwork",
  "/dallas/custom-built-ins",
  "/chicago/custom-closets",
]);

export const seoMarketPages = buildSeoMarketPages();
export const seoMarketPagesByPath = buildPathIndex(seoMarketPages);
export const seoMarketStats = buildStats(seoMarketPages);

export function getSeoMarketPageByPath(path) {
  return seoMarketPagesByPath.get(path) || null;
}

export function seoMarketSitemapEntries(baseUrl = BASE_URL, date = new Date().toISOString().slice(0, 10)) {
  return seoMarketPages
    .filter((page) => page.sitemapEligible)
    .map((page) => ({
      group: "seo-market",
      loc: `${baseUrl}${page.route}`,
      lastmod: page.lastModified || date,
      changefreq: page.marketTier === "core" ? "weekly" : "monthly",
      priority: page.priority || "0.80",
      alternates: hrefLangFor(page.canonicalRoute, baseUrl),
    }));
}

function buildSeoMarketPages() {
  const pages = [];
  for (const state of seoMarketStates.filter((item) => item.enabled)) {
    pages.push(createHubPage({ state }));
    for (const serviceId of state.allowedServices) pages.push(createServicePage({ state, service: servicesById.get(serviceId) }));
  }
  for (const city of seoMarketCities.filter((item) => item.enabled)) {
    const state = statesById.get(city.stateId);
    if (!state?.enabled) continue;
    pages.push(createHubPage({ state, city }));
    const allowed = city.allowedServices?.length ? city.allowedServices : state.allowedServices;
    for (const serviceId of allowed) pages.push(createServicePage({ state, city, service: servicesById.get(serviceId) }));
  }
  return pages.filter(Boolean);
}

function buildPathIndex(pages) {
  const entries = [];
  for (const page of pages) {
    entries.push([page.route, page]);
    for (const locale of SEO_MARKET_LOCALES.filter((item) => item !== "en")) {
      entries.push([`/${locale}${page.route}`, { ...page, locale, route: `/${locale}${page.route}`, canonicalRoute: page.route }]);
    }
  }
  return new Map(entries);
}

function buildStats(pages) {
  const byStatus = pages.reduce((acc, page) => {
    acc[page.status] = (acc[page.status] || 0) + 1;
    return acc;
  }, {});
  return {
    total: pages.length,
    indexable: pages.filter((page) => page.indexable).length,
    noindex: pages.filter((page) => !page.indexable && page.enabled).length,
    sitemapEligible: pages.filter((page) => page.sitemapEligible).length,
    byStatus,
  };
}

function createHubPage({ state, city }) {
  const route = city ? `/${city.slug}` : `/${stateRouteSlug(state)}`;
  const approved = wave1Indexable.has(route);
  const title = city ? `Custom Interior and Millwork Solutions in ${city.name} | ${BRAND}` : `Custom Interior and Millwork Solutions in ${state.name} | ${BRAND}`;
  const metaDescription = city
    ? `Custom media walls, kitchens, closets, built-ins and millwork planning in ${city.name}. Start with a design concept, open the planner or request project review.`
    : `Custom media walls, kitchens, closets, built-ins and architectural millwork for ${state.name} homes. Start with a design concept, planner or project review.`;
  return finishPage({
    pageType: city ? "city-hub" : "state-hub",
    pageId: city ? `market-city-${city.id}` : `market-state-${state.id}`,
    state,
    city,
    service: null,
    route,
    slug: route.slice(1),
    title,
    metaDescription,
    h1: city ? `Custom interiors and millwork in ${city.name}` : `Custom interiors and millwork in ${state.name}`,
    intro: city ? city.localIntro : state.defaultPositioning,
    localAngle: city ? city.localDesignAngle : state.localNotes,
    approved,
    priority: city?.marketTier === "core" || state.marketTier === "core" ? "0.82" : "0.60",
  });
}

function createServicePage({ state, city, service }) {
  if (!service?.enabled) return null;
  const route = city ? `/${city.slug}/${service.slug}` : `/${stateRouteSlug(state)}/${service.slug}`;
  const approved = wave1Indexable.has(route) || wave2Indexable.has(route);
  const expansionTest = expansionNoindex.has(route);
  const label = service.label.replace(/^Custom /, "");
  const title = city ? `Custom ${label} in ${city.name} | ${BRAND}` : `Custom ${label} ${state.name} | ${BRAND}`;
  const metaDescription = city
    ? `Custom ${label.toLowerCase()} designed around your space, materials and project goals in ${city.name}. Start with a design concept, open the planner or request project review.`
    : `Custom ${label.toLowerCase()} for ${state.name} homes. Start with a design concept, open the planner or request project review.`;
  return finishPage({
    pageType: city ? "city-service" : "state-service",
    pageId: city ? `market-${city.id}-${service.id}` : `market-${state.id}-${service.id}`,
    state,
    city,
    service,
    route,
    slug: route.slice(1),
    title,
    metaDescription,
    h1: city ? `Custom ${label} in ${city.name}` : `Custom ${label} in ${state.name}`,
    intro: introForServiceLocation(service, state, city),
    localAngle: city ? city.localDesignAngle : state.localNotes,
    approved,
    expansionTest,
    priority: approved ? "0.84" : expansionTest ? "0.45" : "0.40",
  });
}

function finishPage(source) {
  const service = source.service;
  const warnings = missingContentWarnings(source);
  const contentScore = contentScoreFor(source, warnings);
  const localIndexable = source.approved && contentScore >= MIN_INDEXABLE_SCORE && !warnings.some((warning) => warning.level === "critical");
  const indexable = Boolean(source.state.enabled && source.state.indexable && (!source.city || (source.city.enabled && source.city.indexable)) && (!service || (service.enabled && service.indexable)) && localIndexable);
  const noindexReason = indexable ? "" : noindexReasonFor(source, warnings, contentScore);
  const status = statusFor(source, indexable, contentScore, warnings);
  const canonicalRoute = source.canonicalRoute || source.route;
  const canonicalUrl = `${BASE_URL}${canonicalRoute}`;
  const ctaLinks = ctaLinksFor(source);
  const faq = service ? service.faqTemplates : stateFaq(source.state, source.city);
  const pageSource = { ...source, faq };
  const page = {
    ...source,
    locale: "en",
    enabled: true,
    indexable,
    status,
    canonicalRoute,
    canonicalUrl,
    seoTitle: source.title,
    title: source.title,
    metaTitle: source.title,
    metaDescription: source.metaDescription,
    canonicalPath: canonicalRoute,
    contentScore,
    missingContentWarnings: warnings.map((warning) => warning.message),
    noindexReason,
    sitemapEligible: indexable,
    marketTier: source.city?.marketTier || source.state.marketTier,
    serviceMode: source.city?.serviceMode || source.state.serviceMode,
    stateRoute: `/${stateRouteSlug(source.state)}`,
    ctaLinks,
    faq,
    relatedServices: relatedServicesFor(source),
    relatedLocations: relatedLocationsFor(source),
    internalLinks: internalLinksFor(source),
    hreflangAlternates: hrefLangFor(canonicalRoute),
    schemaData: schemaDataFor(pageSource, canonicalUrl),
    lastModified: "2026-06-18",
  };
  return page;
}

function service(id, slug, label, pluralLabel, defaultPlannerPreset, defaultDesignConceptType, defaultPriceRange, defaultTimeline, defaultLeadPriority, shortDescription, longDescription, serviceKeywords, relatedServices) {
  return {
    id,
    slug,
    label,
    pluralLabel,
    enabled: true,
    indexable: true,
    defaultPlannerPreset,
    defaultDesignConceptType,
    defaultPriceRange,
    defaultTimeline,
    defaultLeadPriority,
    shortDescription,
    longDescription,
    serviceKeywords,
    faqTemplates: serviceCommonFaq,
    ctaSet: "standard_market",
    relatedServices,
    visualTheme: "material-driven",
  };
}

function state(id, name, abbreviation, marketTier, serviceMode, allowedServices = seoMarketServices.map((item) => item.id), defaultPositioning = "") {
  return {
    id,
    slug: id,
    name,
    abbreviation,
    enabled: true,
    indexable: marketTier === "core",
    marketTier,
    serviceMode,
    defaultPositioning: defaultPositioning || `CAS AURUM provides custom design concepts and technical planning for clients in ${name}. Selected full-service projects are reviewed individually based on scope, budget, location and logistics.`,
    defaultCTAType: marketTier === "core" ? "local_review" : "remote_concept",
    allowedServices,
    priorityCities: [],
    seoTitlePattern: "Custom {Service} in {Market} | CAS AURUM",
    seoDescriptionPattern: "Custom {service} designed around your space, materials and project goals in {market}. Start with a design concept, open the planner or request project review.",
    localNotes: marketTier === "core" ? "Local review and selected site visits are available for qualified Georgia projects." : "Design concepts and technical planning are available remotely. Full-service realization is reviewed for selected projects.",
    internalLinkingPriority: marketTier === "core" ? 10 : 4,
  };
}

function city(id, name, stateId, marketTier, customMarketScore, localIntro, localNotes = "") {
  return {
    id,
    slug: id,
    name,
    stateId,
    enabled: true,
    indexable: marketTier === "core",
    marketTier,
    customMarketScore,
    allowedServices: [],
    serviceMode: "",
    localIntro,
    localDesignAngle: localIntro,
    localHomeTypes: "custom homes, remodels, family residences, private suites and selected commercial interiors",
    localNotes: localNotes || "Design concepts and technical planning are available remotely. Full-service realization is reviewed for selected projects.",
    defaultCTAType: marketTier === "core" ? "local_review" : "remote_concept",
    internalLinkingPriority: marketTier === "core" ? 9 : 4,
  };
}

function introForServiceLocation(service, state, city) {
  if (city && state.marketTier === "core") {
    return `${BRAND} creates ${service.label.toLowerCase()} for ${city.name} and Georgia homes, with design concepts, technical planning and selected full-service realization.`;
  }
  if (city) {
    return `${BRAND} provides custom design concepts and technical planning for ${service.label.toLowerCase()} in ${city.name}. Selected full-service projects are reviewed individually based on scope, budget, location and logistics.`;
  }
  return `${BRAND} creates ${service.label.toLowerCase()} for ${state.name} homes, with design concepts, technical planning and selected project review.`;
}

function missingContentWarnings(source) {
  const warnings = [];
  if (!source.localAngle && (source.city || source.state)) warnings.push({ level: "critical", message: "Missing local intro" });
  if (source.service && !source.service.longDescription) warnings.push({ level: "critical", message: "Missing service copy" });
  if (!source.metaDescription) warnings.push({ level: "critical", message: "Missing meta description" });
  if (source.service && !source.service.faqTemplates?.length) warnings.push({ level: "critical", message: "Missing FAQ" });
  if (source.service && !source.service.defaultPlannerPreset) warnings.push({ level: "critical", message: "Missing planner preset" });
  if (source.service && !source.service.defaultDesignConceptType) warnings.push({ level: "critical", message: "Missing design concept mapping" });
  if (!source.approved) warnings.push({ level: source.expansionTest ? "info" : "warning", message: source.expansionTest ? "Expansion test active noindex" : "Not approved for indexation wave" });
  if (source.city && !source.city.enabled) warnings.push({ level: "critical", message: "City disabled" });
  if (!source.state.enabled) warnings.push({ level: "critical", message: "State disabled" });
  if (source.service && !source.service.enabled) warnings.push({ level: "critical", message: "Service disabled" });
  return warnings;
}

function contentScoreFor(source, warnings) {
  let score = 100;
  score -= warnings.filter((item) => item.level === "critical").length * 24;
  score -= warnings.filter((item) => item.level === "warning").length * 12;
  score -= warnings.filter((item) => item.level === "info").length * 4;
  if (!source.city && source.pageType === "state-service") score -= 2;
  if (source.city?.marketTier === "expansion") score -= 4;
  return Math.max(0, score);
}

function noindexReasonFor(source, warnings, score) {
  if (warnings.some((warning) => warning.level === "critical")) return warnings.find((warning) => warning.level === "critical").message;
  if (!source.approved) return source.expansionTest ? "Expansion test page held as active noindex" : "Not approved for current indexation wave";
  if (score < MIN_INDEXABLE_SCORE) return "Page indexable but thin content";
  if (!source.state.indexable || source.city?.indexable === false) return "Market is configured noindex";
  return "";
}

function statusFor(source, indexable, score, warnings) {
  if (!source.state.enabled || source.city?.enabled === false || source.service?.enabled === false) return "Disabled";
  if (warnings.some((warning) => warning.level === "critical")) return "Missing Content";
  if (score < MIN_INDEXABLE_SCORE) return "Thin Risk";
  if (indexable) return "Active Indexable";
  if (source.expansionTest || source.approved) return "Active Noindex";
  return "Draft";
}

function ctaLinksFor(source) {
  const location = source.city?.slug || source.state.slug;
  const service = source.service;
  const serviceId = service?.id || "interior_solutions";
  const conceptType = service?.defaultDesignConceptType || "general";
  const plannerPreset = service?.defaultPlannerPreset || "general";
  const sourceParams = `source=seo_market_page&source_page=${encodeURIComponent(source.route)}&service=${encodeURIComponent(serviceId)}&city=${encodeURIComponent(source.city?.slug || "")}&state=${encodeURIComponent(source.state.slug)}&market_tier=${encodeURIComponent(source.city?.marketTier || source.state.marketTier)}&route=${encodeURIComponent(source.route)}`;
  return {
    designConcept: {
      label: "Start with a Custom Design Concept",
      href: `/design-concept?type=${encodeURIComponent(conceptType)}&location=${encodeURIComponent(location)}&${sourceParams}&cta_clicked=design_concept`,
    },
    planner: {
      label: "Open the Planner",
      href: `/technical-millwork-planner?type=${encodeURIComponent(plannerPreset)}&location=${encodeURIComponent(location)}&${sourceParams}&cta_clicked=planner`,
    },
    review: {
      label: "Request Project Review",
      href: `/request-consultation?project_type=${encodeURIComponent(serviceId)}&location=${encodeURIComponent(location)}&mode=full_service_review&${sourceParams}&cta_clicked=full_service_review`,
    },
  };
}

function relatedServicesFor(source) {
  const related = source.service?.relatedServices?.length ? source.service.relatedServices : ["media_wall", "kitchen", "closet", "built_ins", "wall_panels", "architectural_millwork"];
  return related.map((id) => servicesById.get(id)).filter(Boolean).map((serviceItem) => ({
    label: serviceItem.label,
    href: source.city ? `/${source.city.slug}/${serviceItem.slug}` : `/${source.state.slug}/${serviceItem.slug}`,
  }));
}

function relatedLocationsFor(source) {
  const stateCities = seoMarketCities
    .filter((cityItem) => cityItem.stateId === source.state.id && cityItem.enabled)
    .sort((a, b) => b.internalLinkingPriority - a.internalLinkingPriority)
    .slice(0, 8);
  if (source.service) return stateCities.map((cityItem) => ({ label: cityItem.name, href: `/${cityItem.slug}/${source.service.slug}` }));
  return stateCities.map((cityItem) => ({ label: cityItem.name, href: `/${cityItem.slug}` }));
}

function internalLinksFor(source) {
  const links = [
    { label: "Design Concept", href: "/design-concept" },
    { label: "Millwork Planner", href: "/technical-millwork-planner" },
    { label: "Project Review", href: "/request-consultation" },
  ];
  if (source.city) links.push({ label: source.state.name, href: `/${stateRouteSlug(source.state)}` }, { label: source.city.name, href: `/${source.city.slug}` });
  if (source.service) links.push({ label: source.service.label, href: `/${source.service.slug}` });
  return links;
}

function stateRouteSlug(state) {
  return state.id === "new-york" ? "new-york-state" : state.slug;
}

function stateFaq(state, city) {
  const market = city?.name || state.name;
  return [
    [`What does CAS AURUM offer in ${market}?`, `${BRAND} offers custom interior and millwork concepts, technical planning and selected project review for media walls, kitchens, closets, built-ins, wall panels and architectural millwork.`],
    [`Can full-service realization happen in ${market}?`, state.marketTier === "core" ? "Qualified Georgia projects may be reviewed for local site visits, full-service realization and installation planning." : "Design concepts and technical planning are available remotely. Full-service realization is reviewed individually based on scope, budget, location and logistics."],
    ["What is the best first step?", "Most clients begin with photos, goals and rough dimensions, then choose a Design Concept, Technical Package or Full-Service Project Review."],
  ];
}

function hrefLangFor(route, baseUrl = BASE_URL) {
  const alternates = Object.fromEntries(SEO_MARKET_LOCALES.map((locale) => [locale, `${baseUrl}${locale === "en" ? "" : `/${locale}`}${route}`]));
  alternates["x-default"] = `${baseUrl}${route}`;
  return alternates;
}

function schemaDataFor(source, canonicalUrl) {
  const area = [source.city?.name, source.state.name].filter(Boolean).join(", ");
  const data = [
    {
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: source.service?.label || "Custom interior and millwork solutions",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: area,
      serviceType: source.service ? [source.service.label, ...source.service.serviceKeywords] : ["custom media walls", "custom kitchens", "custom closets", "custom built-ins", "architectural millwork"],
      description: source.intro,
    },
  ];
  if (source.faq?.length) {
    data.push({
      "@type": "FAQPage",
      mainEntity: source.faq.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    });
  }
  return data;
}
