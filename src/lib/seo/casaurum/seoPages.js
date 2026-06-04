export const CAS_LOCALES = ["en", "es", "fr", "ru"];
export const DEFAULT_LOCALE = "en";
export const MAX_GENERATED_COMBINATION_PAGES = 300;
export const MAX_GENERATED_CITY_COMBINATION_PAGES = 100;
export const MAX_GENERATED_INTENT_PAGES = 200;

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://casaurum.com").replace(/\/$/, "");
const BRAND = "CAS AURUM";

const ui = {
  en: {
    interiors: "Interiors", styles: "Styles", rooms: "Rooms", properties: "Properties", cities: "Cities", collections: "Collections", journal: "Journal",
    eyebrow: "Casaurum Interiors", ctaPrimary: "Request a Design Concept", ctaSecondary: "Explore Collections", contact: "Contact", request: "Request Concept",
    direct: "Direct answer", defines: "What defines this direction", elements: "Key design elements", materials: "Materials and finishes", lighting: "Lighting and atmosphere", furniture: "Furniture and decor direction", layout: "Layout and spatial planning", investment: "Investment signals", mistakes: "Common mistakes", related: "Related Casaurum pages", faq: "Frequently Asked Questions", finalCta: "Start a curated interior concept"
  },
  es: {
    interiors: "Interiores", styles: "Estilos", rooms: "Espacios", properties: "Propiedades", cities: "Ciudades", collections: "Colecciones", journal: "Journal",
    eyebrow: "Interiores Casaurum", ctaPrimary: "Solicitar un Concepto de Diseño", ctaSecondary: "Explorar Colecciones", contact: "Contacto", request: "Solicitar Concepto",
    direct: "Respuesta directa", defines: "Qué define esta dirección", elements: "Elementos clave", materials: "Materiales y acabados", lighting: "Iluminación y atmósfera", furniture: "Mobiliario y decoración", layout: "Distribución espacial", investment: "Señales de inversión", mistakes: "Errores comunes", related: "Páginas relacionadas", faq: "Preguntas frecuentes", finalCta: "Iniciar un concepto interior curado"
  },
  fr: {
    interiors: "Intérieurs", styles: "Styles", rooms: "Pièces", properties: "Propriétés", cities: "Villes", collections: "Collections", journal: "Journal",
    eyebrow: "Intérieurs Casaurum", ctaPrimary: "Demander un Concept Design", ctaSecondary: "Explorer les Collections", contact: "Contact", request: "Demander un Concept",
    direct: "Réponse directe", defines: "Ce qui définit cette direction", elements: "Éléments clés", materials: "Matériaux et finis", lighting: "Lumière et atmosphère", furniture: "Mobilier et décor", layout: "Planification spatiale", investment: "Signaux d'investissement", mistakes: "Erreurs fréquentes", related: "Pages liées", faq: "Questions fréquentes", finalCta: "Démarrer un concept intérieur curé"
  },
  ru: {
    interiors: "Интерьеры", styles: "Стили", rooms: "Комнаты", properties: "Недвижимость", cities: "Города", collections: "Коллекции", journal: "Журнал",
    eyebrow: "Casaurum Interiors", ctaPrimary: "Запросить Дизайн-Концепт", ctaSecondary: "Смотреть Коллекции", contact: "Контакты", request: "Запросить Концепт",
    direct: "Короткий ответ", defines: "Что формирует направление", elements: "Ключевые элементы", materials: "Материалы и отделки", lighting: "Свет и атмосфера", furniture: "Мебель и декор", layout: "Планировка и пространство", investment: "Сигналы инвестиции", mistakes: "Частые ошибки", related: "Связанные страницы", faq: "Частые вопросы", finalCta: "Начать curated interior concept"
  },
};

const l = (locale, key) => ui[locale]?.[key] || ui.en[key] || key;
const tx = (en, es, fr, ru) => ({ en, es, fr, ru });
const local = (value, locale) => value?.[locale] || value?.en || value || "";
const sentence = (text) => text.endsWith(".") ? text : `${text}.`;

function localizedEntity(slug, title, extras = {}) {
  const readable = title.en || title;
  return {
    slug,
    title,
    shortTitle: extras.shortTitle || title,
    metaDescription: extras.metaDescription || tx(
      `${BRAND} explores ${readable.toLowerCase()} through premium materials, curated rooms, architectural detailing and high-end design inspiration.`,
      `${BRAND} presenta ${local(title, "es").toLowerCase()} con materiales premium, espacios curados y detalle arquitectónico.`,
      `${BRAND} explore ${local(title, "fr").toLowerCase()} avec matériaux premium, pièces curées et détails architecturaux.`,
      `${BRAND} раскрывает ${local(title, "ru").toLowerCase()} через премиальные материалы, curated rooms и архитектурные детали.`
    ),
    intro: extras.intro || tx(
      `${readable} at CAS AURUM is treated as a material-driven design language: proportion, light, furniture, surfaces and storage are considered together rather than as separate decorative choices.`,
      `${local(title, "es")} en CAS AURUM se entiende como un lenguaje de diseño guiado por materiales, proporción, luz, mobiliario y superficies.`,
      `${local(title, "fr")} chez CAS AURUM est abordé comme un langage guidé par les matériaux, les proportions, la lumière, le mobilier et les surfaces.`,
      `${local(title, "ru")} в CAS AURUM рассматривается как материально-архитектурный язык: пропорции, свет, мебель, поверхности и хранение работают вместе.`
    ),
    ...extras,
  };
}

export const styles = [
  ["modern", tx("Modern Interiors", "Interiores Modernos", "Intérieurs Modernes", "Современные интерьеры"), ["clean planes", "integrated storage", "architectural lighting"], ["stone", "walnut", "matte metal"], "calm, precise, open"],
  ["contemporary", tx("Contemporary Interiors", "Interiores Contemporáneos", "Intérieurs Contemporains", "Контемпорари интерьеры"), ["current proportions", "soft geometry", "curated furniture"], ["oak", "limestone", "brushed metal"], "fresh, refined, gallery-like"],
  ["minimalist", tx("Minimalist Interiors", "Interiores Minimalistas", "Intérieurs Minimalistes", "Минималистичные интерьеры"), ["edited forms", "concealed function", "negative space"], ["microcement", "oak", "linen"], "quiet, reduced, balanced"],
  ["quiet-luxury", tx("Quiet Luxury Interiors", "Interiores Quiet Luxury", "Intérieurs Quiet Luxury", "Интерьеры quiet luxury"), ["subtle refinement", "tailored millwork", "restrained accents"], ["walnut", "champagne brass", "natural stone"], "expensive without noise"],
  ["organic-modern", tx("Organic Modern Interiors", "Interiores Organic Modern", "Intérieurs Organic Modern", "Organic modern интерьеры"), ["soft forms", "natural texture", "warm neutrality"], ["oak", "travertine", "wool"], "warm, tactile, grounded"],
  ["italian-inspired", tx("Italian-Inspired Interiors", "Interiores Inspirados en Italia", "Intérieurs d'Inspiration Italienne", "Интерьеры в итальянском духе"), ["stone statements", "elegant silhouettes", "tailored cabinetry"], ["marble", "walnut", "leather"], "polished, cosmopolitan, refined"],
  ["french-inspired", tx("French-Inspired Interiors", "Interiores Inspirados en Francia", "Intérieurs d'Inspiration Française", "Интерьеры во французском духе"), ["classical balance", "soft paneling", "edited ornament"], ["oak", "plaster", "brass"], "graceful, timeless, architectural"],
  ["art-deco", tx("Art Deco Interiors", "Interiores Art Déco", "Intérieurs Art Déco", "Интерьеры ар-деко"), ["rhythmic linework", "dark contrast", "metal inlays"], ["black oak", "stone", "champagne brass"], "dramatic, controlled, glamorous"],
  ["neoclassical", tx("Neoclassical Interiors", "Interiores Neoclásicos", "Intérieurs Néoclassiques", "Неоклассические интерьеры"), ["symmetry", "wall moulding", "noble proportions"], ["stone", "oak", "plaster"], "formal, calm, elevated"],
  ["japandi", tx("Japandi Interiors", "Interiores Japandi", "Intérieurs Japandi", "Japandi интерьеры"), ["low profiles", "natural texture", "quiet storage"], ["oak", "linen", "clay"], "serene, edited, tactile"],
  ["wabi-sabi", tx("Wabi-Sabi Interiors", "Interiores Wabi-Sabi", "Intérieurs Wabi-Sabi", "Wabi-sabi интерьеры"), ["imperfect texture", "soft asymmetry", "natural patina"], ["plaster", "stone", "raw wood"], "poetic, calm, organic"],
  ["warm-minimalism", tx("Warm Minimalism", "Minimalismo Cálido", "Minimalisme Chaleureux", "Теплый минимализм"), ["soft minimal lines", "warm materials", "integrated furniture"], ["oak", "beige stone", "wool"], "minimal but welcoming"],
  ["futuristic", tx("Futuristic Interiors", "Interiores Futuristas", "Intérieurs Futuristes", "Футуристические интерьеры"), ["seamless surfaces", "ambient tech", "sculptural forms"], ["glass", "matte black", "stone"], "forward-looking, cinematic"],
  ["smart-home", tx("Smart Home Interiors", "Interiores Smart Home", "Intérieurs Maison Intelligente", "Интерьеры smart home"), ["hidden technology", "lighting scenes", "automated comfort"], ["wood veneer", "acoustic panels", "matte metal"], "technical, comfortable, invisible"],
  ["natural-stone", tx("Natural Stone Interiors", "Interiores con Piedra Natural", "Intérieurs en Pierre Naturelle", "Интерьеры с натуральным камнем"), ["stone slabs", "mineral texture", "architectural weight"], ["marble", "limestone", "travertine"], "solid, timeless, premium"],
  ["bespoke", tx("Bespoke Interiors", "Interiores Bespoke", "Intérieurs Sur Mesure", "Bespoke интерьеры"), ["custom proportions", "one-of-one details", "tailored storage"], ["walnut", "stone", "leather"], "personal, crafted, exact"],
  ["architectural", tx("Architectural Interiors", "Interiores Arquitectónicos", "Intérieurs Architecturaux", "Архитектурные интерьеры"), ["spatial rhythm", "built-in elements", "surface composition"], ["veneer", "stone", "metal"], "structured, refined, spatial"],
  ["elegant", tx("Elegant Interiors", "Interiores Elegantes", "Intérieurs Élégants", "Элегантные интерьеры"), ["soft proportion", "timeless materials", "balanced detailing"], ["oak", "fabric", "brass"], "graceful, premium, approachable"],
  ["premium", tx("Premium Interiors", "Interiores Premium", "Intérieurs Premium", "Премиальные интерьеры"), ["durable finishes", "precise millwork", "curated furniture"], ["walnut", "stone", "brass"], "high-quality, practical, elevated"],
  ["luxury", tx("Luxury Interiors", "Interiores de Lujo", "Intérieurs de Luxe", "Люксовые интерьеры"), ["statement surfaces", "bespoke furniture", "material depth"], ["marble", "walnut", "champagne brass"], "refined, expensive, timeless"],
].map(([slug, title, designSignals, materials, visualMood]) => localizedEntity(slug, title, {
  shortTitle: stripInteriorWords(title),
  designSignals, materials, visualMood,
  colorPalette: ["ivory", "warm beige", "walnut", "stone grey", "soft black"],
  lightingApproach: ["layered ambient light", "concealed linear lighting", "warm accent glow"],
  relatedStyles: relatedFrom(slug, ["modern", "contemporary", "quiet-luxury", "organic-modern", "architectural", "luxury"], 3),
  relatedCollections: styleCollections(slug),
}));

export const rooms = [
  "living-room", "kitchen", "bathroom", "bedroom", "master-suite", "dining-room", "home-office", "walk-in-closet", "wine-cellar", "home-theater", "entryway", "outdoor-living", "terrace", "spa-room", "kids-room", "guest-room", "library", "wellness-room", "gym", "pool-area",
].map((slug) => localizedEntity(slug, roomTitle(slug), {
  shortTitle: shortRoomTitle(slug),
  layoutIdeas: ["clear focal wall", "balanced circulation", "built-in storage where it improves proportion"],
  keyFeatures: ["custom furniture", "premium surfaces", "architectural lighting"],
  premiumMaterials: roomMaterials(slug),
  lightingNotes: ["combine daylight control with warm evening scenes", "avoid flat overhead-only lighting"],
  furnitureDirection: ["scaled pieces", "tailored storage", "quiet luxury upholstery"],
  commonMistakes: ["using too many finishes", "undersizing furniture", "ignoring lighting layers"],
  relatedRooms: relatedFrom(slug, ["living-room", "kitchen", "bedroom", "master-suite", "home-office", "walk-in-closet", "bathroom", "dining-room"], 3),
}));

export const propertyTypes = [
  "villa", "penthouse", "mansion", "apartment", "townhouse", "beach-house", "mountain-house", "lake-house", "city-apartment", "family-home", "luxury-condo", "boutique-hotel", "private-residence", "vacation-home", "estate",
].map((slug) => localizedEntity(slug, propertyTitle(slug), {
  shortTitle: shortPropertyTitle(slug),
  designPriorities: ["arrival sequence", "room-by-room material continuity", "storage that supports daily life"],
  lifestyleUseCases: ["private entertaining", "family routines", "guest-ready spaces", "remote work"],
  buyerIntent: ["ideas", "inspiration", "consultation", "custom"],
  roomPlanning: ["connect primary rooms through consistent material direction", "use built-ins to make proportions feel intentional"],
  relatedPropertyTypes: relatedFrom(slug, ["villa", "penthouse", "mansion", "private-residence", "luxury-condo", "estate"], 3),
}));

export const intents = [
  ["ideas", true, ["examples", "planning notes", "visual direction"]],
  ["inspiration", true, ["mood", "materials", "collection references"]],
  ["trends", true, ["what is current", "what remains timeless", "what to avoid"]],
  ["materials", true, ["surface choices", "durability", "finish palette"]],
  ["lighting", true, ["ambient light", "accent light", "control scenes"]],
  ["furniture", true, ["custom pieces", "scale", "coordination"]],
  ["color-palette", true, ["neutral palette", "contrast", "material color"]],
  ["cost", true, ["investment drivers", "scope variables", "no fixed online quote"]],
  ["smart-home", true, ["hidden technology", "comfort", "automation"]],
  ["storage", true, ["built-ins", "closets", "concealed function"]],
  ["layout", true, ["circulation", "zoning", "room planning"]],
  ["decor", false, ["accessories", "styling", "not enough CAS AURUM-specific data"]],
  ["renovation", true, ["existing conditions", "phasing", "coordination"]],
  ["custom", true, ["bespoke scope", "measurements", "project brief"]],
].map(([slug, indexableDefault, sectionFocus]) => ({
  slug,
  title: intentTitle(slug),
  h1Pattern: tx("{style} {room} {intent}", "{style} para {room}: {intent}", "{style} pour {room} : {intent}", "{style}: {room} и {intent}"),
  metaTitlePattern: tx("{style} {room} {intent} | CAS AURUM", "{style} {room} {intent} | CAS AURUM", "{style} {room} {intent} | CAS AURUM", "{style} {room} {intent} | CAS AURUM"),
  metaDescriptionPattern: tx("Explore {style} {room} {intent} with premium materials, lighting, furniture direction and curated CAS AURUM collection references.", "Explore {style} {room} {intent} con materiales premium, iluminación, mobiliario y colecciones CAS AURUM.", "Explorez {style} {room} {intent} avec matériaux premium, lumière, mobilier et collections CAS AURUM.", "Изучите {style} {room} {intent}: материалы, свет, мебель и коллекции CAS AURUM."),
  allowedWith: ["style-room"],
  indexableDefault,
  sectionFocus,
}));

const cityMarketBriefs = {
  atlanta: {
    intro: "Atlanta luxury interiors need to balance Southern warmth with disciplined architectural detailing: custom cabinetry that feels built into the home, wall panels that improve proportion, and material choices that hold up in busy family, hospitality and developer spaces.",
    direct: "Atlanta is CAS AURUM's priority Georgia market for custom cabinetry, wall panels, built-ins, closets, kitchens and architectural millwork inquiries.",
    sections: [
      ["Atlanta project fit", "The strongest Atlanta inquiries usually involve Buckhead residences, Sandy Springs and Alpharetta homes, developer interiors, boutique hospitality, restaurants, offices or high-end remodels where standard cabinetry would look too thin. CAS AURUM reviews drawings, room photos, measurements, material direction and budget range before recommending a practical custom path."],
      ["What matters locally", "Atlanta projects often need durable luxury: finishes that survive daily use, storage that feels architectural, and warm materials that do not turn a refined home into a cold showroom. Walnut, oak, natural stone, textured panels, concealed lighting and restrained champagne metal details tend to work well when the proportions are controlled."],
      ["Useful brief for designers", "A valuable Atlanta design brief should include the property area, room dimensions, ceiling height, appliance or AV requirements, desired storage, inspiration images, and whether the scope is cabinetry, a TV wall, wall panels, closets, vanities, a kitchen or a full millwork package."],
    ],
  },
  miami: {
    intro: "Miami interiors reward clean drama: stone, glass, dark wood, integrated lighting and custom storage that can feel glamorous without becoming loud. The climate, daylight and entertainment lifestyle make material selection and lighting control especially important.",
    direct: "Miami inquiries are best suited to villas, condos, penthouses, dressing rooms, TV walls, kitchens and hospitality-inspired interiors where custom surfaces and built-ins create a polished technical scope.",
    sections: [
      ["Miami project fit", "A Miami project brief should clarify whether the space is a waterfront residence, condo, villa, private lounge, dressing room, kitchen, media wall or hospitality interior. Humidity, daylight, reflection, maintenance and evening lighting scenes should be discussed before choosing high-gloss, stone, veneer or glass-heavy directions."],
      ["Design value", "The best Miami interiors usually avoid generic white-box luxury. A stronger direction uses custom wall composition, concealed storage, integrated LEDs, glass display zones, stone back panels and technical hardware decisions that make the room feel designed rather than simply decorated."],
      ["What to send", "Send plan dimensions, wall photos, ceiling height, condo or building constraints, desired storage, lighting intent, stone or veneer references, and a target budget range. That lets CAS AURUM respond with a realistic concept path instead of a vague moodboard."],
    ],
  },
  "new-york": {
    intro: "New York interiors depend on precision: small tolerances, vertical storage, quiet luxury materials and built-ins that make apartments, townhouses and penthouses feel composed rather than crowded.",
    direct: "New York is a strong concept and coordination market for custom built-ins, wall systems, closets, media walls and refined cabinetry where every inch needs a clear purpose.",
    sections: [
      ["New York project fit", "The most useful New York scopes are usually apartments, townhouses, penthouses, private offices, wardrobes, libraries and living rooms where storage, wall composition and lighting need to work inside tight architectural limits."],
      ["Planning priorities", "Before finishes are discussed, the technical brief should settle wall length, elevator or access constraints, ceiling height, radiator or HVAC conflicts, AV locations, door swings and whether the goal is concealed storage, display, acoustic comfort or a stronger architectural focal wall."],
      ["Material direction", "New York quiet luxury often works best with limestone, walnut, smoked oak, warm lacquer, fabric panels and very restrained metal lines. The value is not excess decoration; it is proportion, joinery logic, lighting discipline and fewer visible compromises."],
    ],
  },
  chicago: {
    intro: "Chicago interiors can carry stronger architectural rhythm: panel grids, dining room symmetry, office millwork, built-in storage and subtle Art Deco references translated into a calmer contemporary language.",
    direct: "Chicago inquiries are a good fit for architectural wall panels, dining rooms, home offices, libraries, custom furniture and millwork packages that need structure, warmth and long-term durability.",
    sections: [
      ["Chicago project fit", "Chicago projects often benefit from custom wall panels, built-in libraries, dining storage, office millwork, media walls and residential cabinetry that respects older architectural bones while making the interior feel current."],
      ["What matters locally", "A good Chicago concept should consider winter light, layered evening lighting, durable finishes, strong proportions and whether the interior should lean modern, Art Deco, quiet luxury or warm contemporary. The result should feel substantial, not trendy."],
      ["Useful brief", "Send photos of the existing trim and openings, wall measurements, ceiling height, preferred wood tone, lighting goals, room function and any historic details that should be preserved or simplified. This helps avoid a design that fights the architecture."],
    ],
  },
};

export const cities = [
  ["atlanta", "Atlanta", "United States"], ["miami", "Miami", "United States"], ["new-york", "New York", "United States"], ["chicago", "Chicago", "United States"], ["charlotte", "Charlotte", "United States"], ["nashville", "Nashville", "United States"], ["houston", "Houston", "United States"], ["dallas", "Dallas", "United States"], ["los-angeles", "Los Angeles", "United States"], ["beverly-hills", "Beverly Hills", "United States"], ["palm-beach", "Palm Beach", "United States"], ["scottsdale", "Scottsdale", "United States"], ["seattle", "Seattle", "United States"], ["san-francisco", "San Francisco", "United States"], ["toronto", "Toronto", "Canada"], ["vancouver", "Vancouver", "Canada"], ["mexico-city", "Mexico City", "Mexico"],
].map(([slug, cityName, country]) => ({
  slug, cityName, country,
  title: tx(`${cityName} Interiors`, `Interiores en ${cityName}`, `Intérieurs à ${cityName}`, `Интерьеры ${cityName}`),
  luxuryContext: tx(cityMarketBriefs[slug]?.intro || `${cityName} projects often reward interiors that feel precise, material-rich and tailored to the property rather than copied from a trend board.`, `Los proyectos en ${cityName} funcionan mejor con interiores precisos, materiales premium y soluciones adaptadas a la propiedad.`, `Les projets à ${cityName} gagnent avec des intérieurs précis, riches en matériaux et adaptés à la propriété.`, `Для ${cityName} особенно важны точность, материалы и решения под конкретную недвижимость.`),
  directSummary: cityMarketBriefs[slug]?.direct,
  marketSections: cityMarketBriefs[slug]?.sections,
  localDesignSignals: ["premium residential demand", "global design references", "custom furniture and lighting"],
  popularPropertyTypes: ["villa", "penthouse", "private-residence", "luxury-condo"],
  relatedCities: relatedFrom(slug, ["atlanta", "miami", "new-york", "chicago", "charlotte", "nashville", "houston", "toronto"], 3),
}));

export const collections = [
  { slug: "aurum", name: "Aurum Collection", philosophy: "champagne brass refinement, warm stone and quiet luxury", materials: ["limestone", "champagne brass", "taupe lacquer"], relatedStyles: ["quiet-luxury", "contemporary", "italian-inspired", "luxury"], imagePath: "/images/collections/aurum-01-champagne-gallery-residence.webp" },
  { slug: "forma", name: "Forma Collection", philosophy: "architectural geometry, modular rhythm and clean contemporary panels", materials: ["oak", "matte stone", "warm grey lacquer"], relatedStyles: ["modern", "contemporary", "architectural", "minimalist"], imagePath: "/images/collections/forma-01-linear-house-media-wall.webp" },
  { slug: "noir", name: "Noir Collection", philosophy: "dark luxury, media walls, studies and dramatic private spaces", materials: ["black oak", "dark stone", "charcoal textiles"], relatedStyles: ["art-deco", "luxury", "futuristic", "premium"], imagePath: "/images/collections/noir-01-cinema-wall.webp" },
  { slug: "madera", name: "Madera Collection", philosophy: "walnut, oak and natural textures for refined residential warmth", materials: ["walnut", "oak", "travertine"], relatedStyles: ["organic-modern", "quiet-luxury", "warm-minimalism", "japandi"], imagePath: "/images/collections/madera-01-walnut-horizon-living.webp" },
  { slug: "signature", name: "Signature Collection", philosophy: "one-of-one bespoke concepts for residences, hospitality and commercial interiors", materials: ["custom wood", "stone", "upholstered panels"], relatedStyles: ["bespoke", "luxury", "italian-inspired", "architectural"], imagePath: "/images/collections/signature-01-one-of-one-penthouse-salon.webp" },
];

export const articles = [
  "modern-interior-design-ideas", "luxury-interior-design-trends", "how-to-make-a-home-look-expensive", "quiet-luxury-interior-design", "contemporary-vs-modern-interior-design", "luxury-kitchen-design-ideas", "luxury-bathroom-design-ideas", "smart-home-interior-design", "natural-stone-in-interior-design", "italian-inspired-interiors", "minimalist-luxury-interiors", "best-materials-for-premium-interiors",
].map((slug) => ({ slug, title: articleTitle(slug), description: articleDescription(slug), relatedStyles: ["modern", "quiet-luxury", "luxury"], relatedRooms: ["living-room", "kitchen", "bathroom"] }));

export const casaurumSeoPages = buildCasaurumSeoPages();
export const casaurumSeoPagesByPath = new Map(casaurumSeoPages.map((page) => [page.slug, page]));
export const casaurumSeoStats = {
  total: casaurumSeoPages.length,
  indexable: casaurumSeoPages.filter((page) => page.indexable).length,
  noindex: casaurumSeoPages.filter((page) => !page.indexable).length,
};

export function getCasaurumSeoPageSpec(params) {
  return casaurumSeoPagesByPath.get(params.path || params.slug) || null;
}

export function getRelatedCasaurumLinks(params) {
  const locale = params.locale || "en";
  const links = [
    seoLink(locale, "/interiors", l(locale, "interiors")),
    seoLink(locale, "/styles", l(locale, "styles")),
    seoLink(locale, "/rooms", l(locale, "rooms")),
    seoLink(locale, "/collections", l(locale, "collections")),
    seoLink(locale, "/contact", l(locale, "contact")),
  ];
  for (const slug of (params.relatedStyles || []).slice(0, 3)) links.push(seoLink(locale, `/styles/${slug}`, entityLabel(styles, slug, locale)));
  for (const slug of (params.relatedRooms || []).slice(0, 3)) links.push(seoLink(locale, `/rooms/${slug}`, entityLabel(rooms, slug, locale)));
  for (const slug of (params.relatedCollections || []).slice(0, 2)) links.push(seoLink(locale, `/collections/${slug}`, collectionName(slug)));
  return dedupeLinks(links);
}

export function getSeoQualityStatus(pageSpec) {
  const reasons = [];
  if (!pageSpec.metaTitle) reasons.push("missing title");
  if (!pageSpec.metaDescription) reasons.push("missing meta description");
  if (!pageSpec.intro) reasons.push("missing intro");
  if ((pageSpec.sections || []).length < 3) reasons.push("less than 3 meaningful sections");
  if ((pageSpec.faq || []).length < 3) reasons.push("less than 3 FAQ items");
  if ((pageSpec.internalLinks || []).length < 5) reasons.push("less than 5 internal links");
  if (pageSpec.intentSlug && intentBySlug(pageSpec.intentSlug)?.indexableDefault === false) reasons.push("intent held for editorial review");
  if (pageSpec.combination && !pageSpec.allowlisted) reasons.push("combination not allowlisted");
  const score = Math.max(45, 100 - reasons.length * 12 - (pageSpec.wordDepth === "thin" ? 16 : 0));
  return { qualityScore: score, indexable: score >= 80 && reasons.length === 0, reasons };
}

function buildCasaurumSeoPages() {
  const base = [];
  for (const locale of CAS_LOCALES) {
    base.push(...hubPages(locale));
    base.push(...styles.map((style) => stylePage(locale, style)));
    base.push(...rooms.map((room) => roomPage(locale, room)));
    base.push(...propertyTypes.map((property) => propertyPage(locale, property)));
    base.push(...cities.map((city) => cityPage(locale, city)));
    base.push(...collections.map((collection) => collectionPage(locale, collection)));
    base.push(...articles.map((article) => articlePage(locale, article)));
  }

  const comboBases = [];
  for (const style of styles) for (const room of rooms) comboBases.push({ type: "style-room", style, room });
  for (const style of styles) for (const property of propertyTypes) comboBases.push({ type: "style-property", style, property });
  const requiredCombos = [
    { type: "style-property", style: bySlug(styles, "contemporary"), property: bySlug(propertyTypes, "penthouse") },
  ];
  const topCombos = dedupeCombo([...requiredCombos, ...comboBases]).slice(0, MAX_GENERATED_COMBINATION_PAGES);

  const intentBases = [];
  for (const combo of comboBases) {
    if (combo.type !== "style-room") continue;
    for (const intent of intents) intentBases.push({ ...combo, intent });
  }
  const requiredIntents = [
    { type: "style-room", style: bySlug(styles, "quiet-luxury"), room: bySlug(rooms, "kitchen"), intent: bySlug(intents, "lighting") },
  ];
  const topIntents = dedupeCombo([...requiredIntents, ...intentBases]).slice(0, MAX_GENERATED_INTENT_PAGES);

  const cityCombos = [];
  for (const city of cities) cityCombos.push({ type: "city-service", city });
  for (const city of cities) for (const style of styles.slice(0, 6)) cityCombos.push({ type: "city-style", city, style });
  for (const city of cities) for (const room of rooms.slice(0, 5)) cityCombos.push({ type: "city-room", city, room });
  for (const city of cities) for (const property of propertyTypes.slice(0, 4)) cityCombos.push({ type: "city-property", city, property });
  const topCityCombos = cityCombos.slice(0, MAX_GENERATED_CITY_COMBINATION_PAGES);

  for (const locale of CAS_LOCALES) {
    base.push(...topCombos.map((combo) => combinationPage(locale, combo)));
    base.push(...topIntents.map((combo) => intentPage(locale, combo)));
    base.push(...topCityCombos.map((combo) => cityCombinationPage(locale, combo)));
  }
  return base.map(finalizePage);
}

function hubPages(locale) {
  const hubs = ["interiors", "styles", "rooms", "properties", "cities", "collections", "journal"];
  return hubs.map((hub) => makePage({
    pageType: "hub", locale, path: `/${hub}`, h1: l(locale, hub), eyebrow: l(locale, "eyebrow"),
    metaTitle: `${l(locale, hub)} | ${BRAND}`, metaDescription: hubDescription(hub, locale),
    intro: hubDescription(hub, locale), directSummary: hubDirect(hub, locale),
    sections: standardSections(locale, l(locale, hub), null, null),
    faq: faqFor(locale, l(locale, hub)), breadcrumbs: crumb(locale, [[l(locale, hub), `/${hub}`]]),
    relatedStyles: styles.slice(0, 6).map((s) => s.slug), relatedRooms: rooms.slice(0, 6).map((r) => r.slug), relatedCollections: collections.slice(0, 4).map((c) => c.slug),
    imagePath: collectionImage("madera"), allowlisted: true,
  }));
}

function stylePage(locale, style) {
  return makePage({
    pageType: "style", locale, path: `/styles/${style.slug}`, h1: local(style.title, locale), eyebrow: l(locale, "styles"),
    metaTitle: `${local(style.title, locale)} | ${BRAND}`, metaDescription: local(style.metaDescription, locale),
    intro: local(style.intro, locale), directSummary: directFor(locale, local(style.title, locale), "style"),
    sections: standardSections(locale, local(style.title, locale), style, null),
    faq: faqFor(locale, local(style.title, locale)), breadcrumbs: crumb(locale, [[l(locale, "styles"), "/styles"], [local(style.title, locale), `/styles/${style.slug}`]]),
    relatedStyles: style.relatedStyles, relatedCollections: style.relatedCollections, relatedRooms: rooms.slice(0, 4).map((r) => r.slug),
    imagePath: collectionImage(style.relatedCollections?.[0] || "aurum"), allowlisted: true,
  });
}

function roomPage(locale, room) {
  return makePage({
    pageType: "room", locale, path: `/rooms/${room.slug}`, h1: local(room.title, locale), eyebrow: l(locale, "rooms"),
    metaTitle: `${local(room.title, locale)} | Premium Room Ideas | ${BRAND}`, metaDescription: local(room.metaDescription, locale),
    intro: local(room.intro, locale), directSummary: directFor(locale, local(room.title, locale), "room"),
    sections: standardSections(locale, local(room.title, locale), null, room),
    faq: faqFor(locale, local(room.title, locale)), breadcrumbs: crumb(locale, [[l(locale, "rooms"), "/rooms"], [local(room.title, locale), `/rooms/${room.slug}`]]),
    relatedRooms: room.relatedRooms, relatedStyles: ["modern", "quiet-luxury", "organic-modern"], relatedCollections: ["forma", "madera"],
    imagePath: roomImage(room.slug), allowlisted: true,
  });
}

function propertyPage(locale, property) {
  return makePage({
    pageType: "property", locale, path: `/properties/${property.slug}`, h1: local(property.title, locale), eyebrow: l(locale, "properties"),
    metaTitle: `${local(property.title, locale)} | Interior Concepts | ${BRAND}`, metaDescription: local(property.metaDescription, locale),
    intro: local(property.intro, locale), directSummary: directFor(locale, local(property.title, locale), "property"),
    sections: standardSections(locale, local(property.title, locale), null, null, property),
    faq: faqFor(locale, local(property.title, locale)), breadcrumbs: crumb(locale, [[l(locale, "properties"), "/properties"], [local(property.title, locale), `/properties/${property.slug}`]]),
    relatedPropertyTypes: property.relatedPropertyTypes, relatedStyles: ["luxury", "quiet-luxury", "bespoke"], relatedCollections: ["aurum", "signature"],
    imagePath: collectionImage("signature"), allowlisted: true,
  });
}

function cityPage(locale, city) {
  const customSections = locale === "en" && city.marketSections ? city.marketSections.map(([heading, body]) => ({ heading, body })) : null;
  const intro = local(city.luxuryContext, locale);
  const directSummary = locale === "en" && city.directSummary ? city.directSummary : directFor(locale, city.cityName, "city");
  return makePage({
    pageType: "city", locale, path: `/cities/${city.slug}`, h1: local(city.title, locale), eyebrow: l(locale, "cities"),
    metaTitle: `${city.cityName} Interior Design Ideas | ${BRAND}`, metaDescription: local(city.luxuryContext, locale),
    intro, directSummary,
    sections: customSections || standardSections(locale, city.cityName, null, null, null, city),
    faq: faqFor(locale, city.cityName), breadcrumbs: crumb(locale, [[l(locale, "cities"), "/cities"], [city.cityName, `/cities/${city.slug}`]]),
    relatedCities: city.relatedCities, relatedStyles: ["modern", "luxury", "quiet-luxury"], relatedCollections: ["aurum", "signature"],
    imagePath: cityImage(city.slug), allowlisted: true,
  });
}

function collectionPage(locale, collection) {
  return makePage({
    pageType: "collection", locale, path: `/collections/${collection.slug}`, h1: collection.name, eyebrow: l(locale, "collections"),
    metaTitle: `${collection.name} | ${BRAND}`, metaDescription: `${collection.name} explores ${collection.philosophy} through curated rooms, premium materials and architectural interior concepts.`,
    intro: collectionIntro(locale, collection),
    directSummary: collectionDirect(locale, collection),
    sections: standardSections(locale, collection.name, null, null).concat([{ heading: collectionFitHeading(locale), body: collectionFitBody(locale) }]),
    faq: faqFor(locale, collection.name), breadcrumbs: crumb(locale, [[l(locale, "collections"), "/collections"], [collection.name, `/collections/${collection.slug}`]]),
    relatedStyles: collection.relatedStyles, relatedCollections: collections.filter((item) => item.slug !== collection.slug).slice(0, 3).map((item) => item.slug), relatedRooms: ["living-room", "bedroom", "home-office"],
    imagePath: collection.imagePath, allowlisted: true,
  });
}

function articlePage(locale, article) {
  const title = local(article.title, locale);
  return makePage({
    pageType: "article", locale, path: `/journal/${article.slug}`, h1: title, eyebrow: l(locale, "journal"),
    metaTitle: `${title} | ${BRAND} Journal`, metaDescription: local(article.description, locale),
    intro: local(article.description, locale), directSummary: directFor(locale, title, "article"),
    sections: articleSections(locale, title), faq: faqFor(locale, title),
    breadcrumbs: crumb(locale, [[l(locale, "journal"), "/journal"], [title, `/journal/${article.slug}`]]),
    relatedStyles: article.relatedStyles, relatedRooms: article.relatedRooms, relatedCollections: ["aurum", "forma", "madera"],
    imagePath: collectionImage(article.relatedStyles.includes("quiet-luxury") ? "aurum" : "forma"), allowlisted: true,
  });
}

function combinationPage(locale, combo) {
  const style = combo.style;
  const target = combo.room || combo.property;
  const type = combo.room ? "room" : "property";
  const h1 = `${local(style.shortTitle, locale)} ${local(target.shortTitle, locale)} Interiors`;
  const path = combo.room ? `/interiors/${style.slug}/${combo.room.slug}` : `/interiors/${style.slug}/${combo.property.slug}`;
  return makePage({
    pageType: `combination-${type}`, locale, path, h1, eyebrow: l(locale, "interiors"),
    metaTitle: `${h1} | ${BRAND}`, metaDescription: `Explore ${h1.toLowerCase()} with materials, lighting, furniture direction, layout ideas and related Casaurum collections.`,
    intro: combinationIntro(locale, h1),
    directSummary: `${h1} should combine ${style.designSignals.join(", ")} with ${target.keyFeatures?.join(", ") || target.designPriorities?.join(", ")}.`,
    sections: standardSections(locale, h1, style, combo.room, combo.property), faq: faqFor(locale, h1),
    breadcrumbs: crumb(locale, [[l(locale, "interiors"), "/interiors"], [h1, path]]),
    relatedStyles: style.relatedStyles, relatedRooms: combo.room?.relatedRooms || ["living-room", "kitchen"], relatedPropertyTypes: combo.property?.relatedPropertyTypes || ["villa", "penthouse"], relatedCollections: style.relatedCollections,
    imagePath: combo.room ? roomImage(combo.room.slug) : collectionImage("signature"), allowlisted: true, combination: true,
  });
}

function intentPage(locale, combo) {
  const styleTitle = local(combo.style.shortTitle, locale);
  const roomTitleText = local(combo.room.shortTitle, locale);
  const intentTitleText = local(combo.intent.title, locale);
  const h1 = fill(combo.intent.h1Pattern, locale, { style: styleTitle, room: roomTitleText, intent: intentTitleText });
  const path = `/interiors/${combo.style.slug}/${combo.room.slug}/${combo.intent.slug}`;
  return makePage({
    pageType: "intent", locale, path, h1, eyebrow: l(locale, "interiors"),
    metaTitle: fill(combo.intent.metaTitlePattern, locale, { style: styleTitle, room: roomTitleText, intent: intentTitleText }),
    metaDescription: fill(combo.intent.metaDescriptionPattern, locale, { style: styleTitle, room: roomTitleText, intent: intentTitleText }),
    intro: `${h1} is useful when the decision is not only visual but practical: materials, lighting, furniture scale, storage, renovation constraints and investment level all affect the final result.`,
    directSummary: `${intentTitleText} for ${styleTitle} ${roomTitleText} should be specific: start with the room's function, then choose materials, lighting and custom elements that support that use.`,
    sections: standardSections(locale, h1, combo.style, combo.room).concat([{ heading: local(combo.intent.title, locale), body: `${combo.intent.sectionFocus.join(", ")} shape the page focus. CAS AURUM treats this as planning guidance, not a fixed online quote or universal rule.` }]),
    faq: faqFor(locale, h1), breadcrumbs: crumb(locale, [[l(locale, "interiors"), "/interiors"], [h1, path]]),
    relatedStyles: combo.style.relatedStyles, relatedRooms: combo.room.relatedRooms, relatedCollections: combo.style.relatedCollections,
    imagePath: roomImage(combo.room.slug), allowlisted: combo.intent.indexableDefault, combination: true, intentSlug: combo.intent.slug,
  });
}

function cityCombinationPage(locale, combo) {
  let path = `/cities/${combo.city.slug}/luxury-interior-design`;
  let h1 = `${combo.city.cityName} Luxury Interior Design`;
  if (combo.type === "city-style") { path = `/cities/${combo.city.slug}/styles/${combo.style.slug}`; h1 = `${local(combo.style.shortTitle, locale)} in ${combo.city.cityName}`; }
  if (combo.type === "city-room") { path = `/cities/${combo.city.slug}/rooms/${combo.room.slug}`; h1 = `${local(combo.room.title, locale)} in ${combo.city.cityName}`; }
  if (combo.type === "city-property") { path = `/cities/${combo.city.slug}/properties/${combo.property.slug}`; h1 = `${local(combo.property.title, locale)} in ${combo.city.cityName}`; }
  return makePage({
    pageType: combo.type, locale, path, h1, eyebrow: l(locale, "cities"),
    metaTitle: `${h1} | ${BRAND}`, metaDescription: `${BRAND} explores ${h1.toLowerCase()} through premium materials, curated rooms, custom furniture and architectural interior concepts.`,
    intro: `${h1} should reflect local lifestyle, property type, light, climate and global design expectations. CAS AURUM uses careful wording: design direction, custom concepts and coordination can be discussed without claiming a local office or completed projects in every city.`,
    directSummary: `${h1} benefits from honest local planning: understand property type, select materials for durability, coordinate lighting and avoid generic city-name-only design pages.`,
    sections: standardSections(locale, h1, combo.style, combo.room, combo.property, combo.city),
    faq: faqFor(locale, h1), breadcrumbs: crumb(locale, [[l(locale, "cities"), "/cities"], [combo.city.cityName, `/cities/${combo.city.slug}`], [h1, path]]),
    relatedCities: combo.city.relatedCities, relatedStyles: combo.style ? combo.style.relatedStyles : ["modern", "luxury", "quiet-luxury"], relatedRooms: combo.room ? combo.room.relatedRooms : ["living-room", "kitchen"], relatedPropertyTypes: combo.property ? combo.property.relatedPropertyTypes : ["villa", "penthouse"], relatedCollections: ["aurum", "forma", "signature"],
    imagePath: cityImage(combo.city.slug), allowlisted: true, combination: true,
  });
}

function makePage(input) {
  const slug = `/${input.locale}${input.path}`;
  const alternates = Object.fromEntries(CAS_LOCALES.map((locale) => [locale, `${BASE_URL}/${locale}${input.path}`]));
  return {
    pageId: `${input.pageType}:${input.locale}:${input.path}`,
    slug, canonicalUrl: `${BASE_URL}${slug}`, hreflangAlternates: { ...alternates, "x-default": alternates.en },
    openGraph: { title: input.metaTitle, description: input.metaDescription, image: input.imagePath || collectionImage("aurum") },
    cta: { primary: l(input.locale, "ctaPrimary"), secondary: l(input.locale, "ctaSecondary") },
    internalLinks: getRelatedCasaurumLinks(input),
    schemaData: [], lastModified: "2026-06-03", changeFrequency: input.pageType === "article" ? "monthly" : "weekly", priority: priorityFor(input.pageType),
    ...input, slug,
  };
}

function finalizePage(page) {
  const quality = getSeoQualityStatus(page);
  const final = { ...page, qualityScore: quality.qualityScore, indexable: quality.indexable, noindexReasons: quality.reasons };
  final.schemaData = schemaFor(final);
  return final;
}

function standardSections(locale, subject, style, room, property, city) {
  const materials = [...(style?.materials || []), ...(room?.premiumMaterials || []), "natural stone", "walnut", "oak"].slice(0, 8).join(", ");
  const cityBody = city ? local(city.luxuryContext, locale) : null;
  const bodies = {
    en: [
      `${subject} is defined by proportion, material discipline and a clear hierarchy of surfaces. The strongest version avoids scattered decoration and lets architecture, furniture and lighting work as one composition.`,
      `Important elements include custom wall panels, built-in storage, furniture scaled to the room, refined hardware, controlled contrast and enough negative space for the materials to feel intentional.`,
      `Suitable materials may include ${materials}. The goal is a palette that feels durable, tactile and aligned with the property.`,
      `Lighting should combine daylight control, warm ambient layers, concealed linear light and focused accents. A premium room should be comfortable at noon and cinematic in the evening.`,
      `Furniture direction should support the room rather than compete with it: custom proportions, calm upholstery, thoughtful storage and materials that echo the walls, floors and millwork.`,
      cityBody || "Spatial planning should keep circulation clear, locate the primary focal point early and use built-ins where they make the architecture feel more resolved.",
      `Investment depends on scope, measurements, materials, fabrication complexity, logistics and installation coordination. CAS AURUM avoids false fixed promises and uses the inquiry to understand what level of design concept is appropriate.`,
      `Common mistakes include mixing too many finishes, using lighting as an afterthought, copying inspiration without adapting scale, and choosing furniture before the architectural surfaces are planned.`,
    ],
    es: [
      `${subject} se define por proporción, disciplina material y una jerarquía clara de superficies. La versión más fuerte evita decoración dispersa y hace que arquitectura, mobiliario e iluminación trabajen como una sola composición.`,
      `Los elementos importantes incluyen paneles a medida, almacenamiento integrado, mobiliario en escala correcta, herrajes refinados, contraste controlado y espacio visual suficiente para que los materiales respiren.`,
      `Los materiales adecuados pueden incluir ${materials}. El objetivo es una paleta durable, táctil y coherente con la propiedad.`,
      `La iluminación debe combinar control de luz natural, capas cálidas, luz lineal oculta y acentos precisos. Un espacio premium debe funcionar al mediodía y sentirse cinematográfico por la noche.`,
      `La dirección de mobiliario debe apoyar el espacio, no competir con él: proporciones a medida, tapicería sobria, almacenamiento pensado y materiales conectados con paredes, pisos y carpintería.`,
      cityBody || "La planificación espacial debe mantener circulación clara, definir pronto el punto focal y usar elementos integrados cuando ayudan a resolver la arquitectura.",
      `La inversión depende del alcance, medidas, materiales, complejidad de fabricación, logística y coordinación de instalación. CAS AURUM evita promesas fijas falsas y usa la consulta para entender el nivel adecuado de concepto.`,
      `Errores comunes: demasiados acabados, iluminación como idea tardía, copiar inspiración sin adaptar escala y elegir muebles antes de planificar las superficies arquitectónicas.`,
    ],
    fr: [
      `${subject} se définit par la proportion, la discipline des matériaux et une hiérarchie claire des surfaces. La meilleure version évite la décoration dispersée et fait travailler architecture, mobilier et lumière comme une composition unique.`,
      `Les éléments importants incluent panneaux sur mesure, rangements intégrés, mobilier à la bonne échelle, quincaillerie raffinée, contraste maîtrisé et assez d'espace visuel pour laisser parler les matériaux.`,
      `Les matériaux adaptés peuvent inclure ${materials}. L'objectif est une palette durable, tactile et cohérente avec la propriété.`,
      `La lumière doit combiner contrôle du jour, couches chaleureuses, éclairage linéaire dissimulé et accents précis. Une pièce premium doit être confortable à midi et cinématographique le soir.`,
      `Le mobilier doit soutenir la pièce plutôt que rivaliser avec elle : proportions sur mesure, textiles calmes, rangement réfléchi et matériaux liés aux murs, sols et menuiseries.`,
      cityBody || "La planification spatiale doit garder une circulation claire, placer tôt le point focal principal et utiliser les intégrés quand ils rendent l'architecture plus aboutie.",
      `L'investissement dépend de la portée, des mesures, des matériaux, de la complexité de fabrication, de la logistique et de la coordination d'installation. CAS AURUM évite les promesses fixes trompeuses.`,
      `Les erreurs fréquentes incluent trop de finis, la lumière pensée trop tard, la copie d'inspiration sans adaptation d'échelle et le choix du mobilier avant les surfaces architecturales.`,
    ],
    ru: [
      `${subject} определяется пропорциями, дисциплиной материалов и ясной иерархией поверхностей. Сильная версия избегает случайного декора и связывает архитектуру, мебель и свет в одну композицию.`,
      `Ключевые элементы: кастомные панели, встроенное хранение, мебель правильного масштаба, утонченная фурнитура, контролируемый контраст и достаточно воздуха, чтобы материалы выглядели намеренно.`,
      `Подходящие материалы могут включать ${materials}. Цель — долговечная, тактильная и согласованная с недвижимостью палитра.`,
      `Свет должен объединять контроль дневного света, теплые сценарии, скрытую линейную подсветку и акцентный свет. Премиальная комната должна быть удобной днем и атмосферной вечером.`,
      `Мебель должна поддерживать пространство, а не спорить с ним: кастомные пропорции, спокойная обивка, продуманное хранение и материалы, связанные со стенами, полом и millwork.`,
      cityBody || "Планировка должна сохранять чистую циркуляцию, рано определять главный фокус и использовать встроенные элементы там, где они делают архитектуру завершенной.",
      `Инвестиция зависит от объема, замеров, материалов, сложности изготовления, логистики и координации установки. CAS AURUM не дает ложных фиксированных обещаний и сначала уточняет уровень концепта.`,
      `Частые ошибки: слишком много отделок, свет как второстепенная мысль, копирование референса без адаптации масштаба и выбор мебели до планирования архитектурных поверхностей.`,
    ],
  }[locale] || [];
  return [
    { heading: l(locale, "defines"), body: bodies[0] },
    { heading: l(locale, "elements"), body: bodies[1] },
    { heading: l(locale, "materials"), body: bodies[2] },
    { heading: l(locale, "lighting"), body: bodies[3] },
    { heading: l(locale, "furniture"), body: bodies[4] },
    { heading: l(locale, "layout"), body: bodies[5] },
    { heading: l(locale, "investment"), body: bodies[6] },
    { heading: l(locale, "mistakes"), body: bodies[7] },
  ];
}

function collectionIntro(locale, collection) {
  const text = {
    en: `${collection.name} is a Casaurum design direction built around ${collection.philosophy}. It can guide living rooms, kitchens, bedrooms, offices, villas, penthouses and hospitality spaces without becoming a fixed catalog package.`,
    es: `${collection.name} es una dirección de diseño Casaurum basada en ${collection.philosophy}. Puede orientar salas, cocinas, dormitorios, oficinas, villas, penthouses y espacios hospitality sin convertirse en un paquete de catálogo fijo.`,
    fr: `${collection.name} est une direction de design Casaurum construite autour de ${collection.philosophy}. Elle peut guider salons, cuisines, chambres, bureaux, villas, penthouses et espaces hospitality sans devenir un package catalogue figé.`,
    ru: `${collection.name} — дизайн-направление Casaurum, построенное вокруг ${collection.philosophy}. Оно может направлять гостиные, кухни, спальни, кабинеты, виллы, пентхаусы и hospitality-пространства, не превращаясь в фиксированный каталог.`,
  };
  return text[locale] || text.en;
}

function collectionDirect(locale, collection) {
  const materials = collection.materials.join(", ");
  const text = {
    en: `${collection.name} is best understood as a visual and material language: ${materials} with tailored furniture, wall panels and millwork.`,
    es: `${collection.name} se entiende mejor como un lenguaje visual y material: ${materials} con mobiliario a medida, paneles de pared y carpintería arquitectónica.`,
    fr: `${collection.name} se comprend comme un langage visuel et matériel : ${materials} avec mobilier sur mesure, panneaux muraux et menuiserie architecturale.`,
    ru: `${collection.name} лучше понимать как визуальный и материальный язык: ${materials}, мебель на заказ, стеновые панели и архитектурная столярка.`,
  };
  return text[locale] || text.en;
}

function collectionFitHeading(locale) {
  return { en: "Collection fit", es: "Dónde encaja la colección", fr: "Où la collection convient", ru: "Где подходит коллекция" }[locale] || "Collection fit";
}

function collectionFitBody(locale) {
  return {
    en: "Best-fit rooms include living rooms, master suites, dining rooms, home offices and hospitality lounges. Property fit includes villas, penthouses, private residences and boutique commercial interiors.",
    es: "Los espacios más adecuados incluyen salas, master suites, comedores, oficinas en casa y lounges hospitality. Encaja bien en villas, penthouses, residencias privadas e interiores comerciales boutique.",
    fr: "Les pièces les plus adaptées incluent salons, master suites, salles à manger, bureaux à domicile et lounges hospitality. Elle convient aux villas, penthouses, résidences privées et intérieurs commerciaux boutique.",
    ru: "Лучше всего подходит для гостиных, master suites, столовых, домашних кабинетов и hospitality lounge. По типу объекта подходит для вилл, пентхаусов, частных резиденций и boutique commercial interiors.",
  }[locale] || "";
}

function articleSections(locale, title) {
  const content = {
    en: [
      [l(locale, "direct"), `${title} starts with a direct design question: what should the room feel like, how should it function, and which materials can carry that feeling without visual noise?`],
      ["Design framework", "Use style, room, property type and intent together. A villa living room, penthouse kitchen and boutique hotel lobby may share a style but need different lighting, storage and furniture logic."],
      ["Material notes", "Premium interiors usually read through fewer, better materials: walnut, oak, stone, plaster, leather, wool, brass accents and matte metal used with restraint."],
      ["Comparison", "Modern is cleaner and more structural; contemporary is more current and fluid; quiet luxury is subtler; bespoke design is the most project-specific."],
      [l(locale, "finalCta"), "A Casaurum concept can connect inspiration to a practical brief: room, location, property type, material direction, budget range and timeline."],
    ],
    es: [
      [l(locale, "direct"), `${title} empieza con una pregunta directa de diseño: cómo debe sentirse el espacio, cómo debe funcionar y qué materiales pueden sostener esa sensación sin ruido visual.`],
      ["Marco de diseño", "Use estilo, espacio, tipo de propiedad e intención juntos. Una sala de villa, una cocina de penthouse y un lobby boutique pueden compartir estilo, pero necesitan distinta lógica de luz, almacenamiento y mobiliario."],
      ["Notas de materiales", "Los interiores premium suelen leerse mejor con menos materiales y mejor elegidos: nogal, roble, piedra, yeso, cuero, lana, acentos de latón y metal mate usados con contención."],
      ["Comparación", "El estilo moderno es más limpio y estructural; el contemporáneo es más actual y fluido; el lujo discreto es más sutil; el diseño a medida es el más específico para cada proyecto."],
      [l(locale, "finalCta"), "Un concepto Casaurum puede conectar inspiración con un brief práctico: espacio, ubicación, tipo de propiedad, dirección material, rango de presupuesto y tiempos."],
    ],
    fr: [
      [l(locale, "direct"), `${title} commence par une question de design directe : quelle sensation créer, comment la pièce doit fonctionner et quels matériaux peuvent porter cette intention sans bruit visuel ?`],
      ["Cadre de design", "Utilisez ensemble le style, la pièce, le type de propriété et l'intention. Un salon de villa, une cuisine de penthouse et un lobby boutique peuvent partager un style, mais demandent une logique différente de lumière, rangement et mobilier."],
      ["Notes matériaux", "Les intérieurs premium se lisent souvent mieux avec moins de matières, mais mieux choisies : noyer, chêne, pierre, plâtre, cuir, laine, accents laiton et métal mat avec retenue."],
      ["Comparaison", "Le style moderne est plus net et structurel; le contemporain est plus actuel et fluide; le luxe discret est plus subtil; le design sur mesure est le plus spécifique au projet."],
      [l(locale, "finalCta"), "Un concept Casaurum peut relier l'inspiration à un brief pratique : pièce, lieu, type de propriété, direction matière, budget indicatif et calendrier."],
    ],
    ru: [
      [l(locale, "direct"), `${title} начинается с прямого дизайн-вопроса: каким должно быть ощущение комнаты, как она должна работать и какие материалы могут передать это без визуального шума.`],
      ["Дизайн-рамка", "Рассматривайте стиль, комнату, тип недвижимости и намерение вместе. Гостиная виллы, кухня пентхауса и лобби бутик-отеля могут иметь общий стиль, но разную логику света, хранения и мебели."],
      ["Заметки по материалам", "Премиальные интерьеры часто читаются лучше через меньшее количество более сильных материалов: орех, дуб, камень, штукатурка, кожа, шерсть, латунные акценты и матовый металл сдержанно."],
      ["Сравнение", "Современный стиль чище и структурнее; контемпорари актуальнее и мягче; тихая роскошь тоньше; дизайн на заказ сильнее всего зависит от конкретного проекта."],
      [l(locale, "finalCta"), "Концепт Casaurum может связать вдохновение с практическим brief: комната, локация, тип объекта, направление материалов, бюджетный диапазон и сроки."],
    ],
  }[locale] || [];
  return content.map(([heading, body]) => ({ heading, body }));
}

function faqFor(locale, subject) {
  const content = {
    en: [
      [`What defines ${subject}?`, `${subject} is defined by proportion, materials, lighting, furniture scale and how well the design supports the room's function.`],
      [`Which materials work best for ${subject}?`, "Walnut, oak, natural stone, plaster, matte metal, textured fabric and restrained brass details are common premium directions."],
      [`Can CAS AURUM create a custom concept for ${subject}?`, "Yes. A useful inquiry includes location, project type, room photos or plans, desired style, budget range and timeline."],
      ["Are the visuals final project photos?", "Collection visuals are used as design direction and material inspiration unless a project is specifically identified as completed work."],
    ],
    es: [
      [`¿Qué define ${subject}?`, `${subject} se define por proporción, materiales, iluminación, escala del mobiliario y qué tan bien el diseño apoya la función del espacio.`],
      [`¿Qué materiales funcionan mejor para ${subject}?`, "Nogal, roble, piedra natural, yeso, metal mate, textiles con textura y detalles de latón contenido son direcciones premium habituales."],
      [`¿CAS AURUM puede crear un concepto a medida para ${subject}?`, "Sí. Una consulta útil incluye ubicación, tipo de proyecto, fotos o planos, estilo deseado, rango de presupuesto y tiempos."],
      ["¿Las visuales son fotos finales de proyectos?", "Las visuales de colección se usan como dirección de diseño e inspiración material salvo que un proyecto se identifique específicamente como trabajo realizado."],
    ],
    fr: [
      [`Qu'est-ce qui définit ${subject} ?`, `${subject} se définit par les proportions, les matériaux, la lumière, l'échelle du mobilier et la manière dont le design soutient la fonction de la pièce.`],
      [`Quels matériaux conviennent le mieux à ${subject} ?`, "Le noyer, le chêne, la pierre naturelle, le plâtre, le métal mat, les textiles texturés et les détails laiton retenus sont des directions premium courantes."],
      [`CAS AURUM peut-il créer un concept sur mesure pour ${subject} ?`, "Oui. Une demande utile inclut le lieu, le type de projet, des photos ou plans, le style souhaité, une fourchette de budget et le calendrier."],
      ["Les visuels sont-ils des photos finales de projets ?", "Les visuels de collection servent de direction design et d'inspiration matière, sauf si un projet est clairement identifié comme réalisé."],
    ],
    ru: [
      [`Что определяет ${subject}?`, `${subject} определяется пропорциями, материалами, светом, масштабом мебели и тем, насколько дизайн поддерживает функцию комнаты.`],
      [`Какие материалы лучше подходят для ${subject}?`, "Орех, дуб, натуральный камень, штукатурка, матовый металл, фактурный текстиль и сдержанные латунные детали часто подходят для премиального направления."],
      [`Может ли CAS AURUM создать кастомную концепцию для ${subject}?`, "Да. Полезный запрос включает локацию, тип проекта, фото или планы, желаемый стиль, бюджетный диапазон и сроки."],
      ["Визуалы являются финальными фото проектов?", "Визуалы коллекций используются как направление дизайна и вдохновение по материалам, если конкретный проект отдельно не обозначен как выполненная работа."],
    ],
  }[locale] || [];
  return content.map(([q, a]) => ({ q, a }));
}

function schemaFor(page) {
  const graph = [
    { "@type": page.pageType === "article" ? "Article" : page.pageType === "collection" ? "CollectionPage" : "WebPage", "@id": `${page.canonicalUrl}#webpage`, url: page.canonicalUrl, name: page.metaTitle, description: page.metaDescription, inLanguage: page.locale },
    { "@type": "BreadcrumbList", itemListElement: page.breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${BASE_URL}${item.href}` })) },
    { "@type": "FAQPage", mainEntity: page.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
  ];
  if (page.imagePath) graph.push({ "@type": "ImageObject", contentUrl: page.imagePath.startsWith("http") ? page.imagePath : `${BASE_URL}${page.imagePath}`, name: page.h1 });
  return graph;
}

function crumb(locale, parts) {
  return [{ name: BRAND, href: `/${locale}` }, ...parts.map(([name, href]) => ({ name, href: `/${locale}${href}` }))];
}

function fill(pattern, locale, values) {
  return local(pattern, locale).replaceAll("{style}", values.style).replaceAll("{room}", values.room).replaceAll("{intent}", values.intent);
}

function seoLink(locale, path, label) {
  return { href: `/${locale}${path}`, label };
}

function dedupeLinks(links) {
  return [...new Map(links.map((link) => [link.href, link])).values()].slice(0, 12);
}

function relatedFrom(current, pool, count) {
  return pool.filter((item) => item !== current).slice(0, count);
}

function bySlug(list, slug) {
  return list.find((item) => item.slug === slug);
}

function dedupeCombo(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = [item.type, item.style?.slug, item.room?.slug, item.property?.slug, item.intent?.slug, item.city?.slug].filter(Boolean).join(":");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function styleCollections(slug) {
  if (["modern", "minimalist", "architectural", "contemporary"].includes(slug)) return ["forma", "signature"];
  if (["quiet-luxury", "organic-modern", "warm-minimalism", "japandi"].includes(slug)) return ["aurum", "madera"];
  if (["art-deco", "futuristic"].includes(slug)) return ["noir", "signature"];
  if (["italian-inspired", "luxury", "premium", "bespoke"].includes(slug)) return ["aurum", "signature", "noir"];
  return ["aurum", "forma"];
}

function roomTitle(slug) {
  const names = roomName(slug);
  return tx(`${names.en} Interiors`, `${names.es} de lujo`, `${names.fr} haut de gamme`, `${names.ru}: интерьерные идеи`);
}

function propertyTitle(slug) {
  const names = propertyName(slug);
  return tx(`${names.en} Interiors`, `Interiores para ${names.es}`, `Intérieurs pour ${names.fr}`, `${names.ru}: интерьеры`);
}

function intentTitle(slug) {
  const en = titleCase(slug);
  return tx(en, en, en, en);
}

function articleTitle(slug) {
  const titles = {
    "modern-interior-design-ideas": tx("Modern Interior Design Ideas", "Ideas de diseño interior moderno", "Idées de design intérieur moderne", "Идеи современного интерьера"),
    "luxury-interior-design-trends": tx("Luxury Interior Design Trends", "Tendencias de diseño interior de lujo", "Tendances du design intérieur de luxe", "Тренды люксового интерьера"),
    "how-to-make-a-home-look-expensive": tx("How to Make a Home Look Expensive", "Cómo hacer que una casa se vea más cara", "Comment rendre une maison plus luxueuse", "Как сделать дом визуально дороже"),
    "quiet-luxury-interior-design": tx("Quiet Luxury Interior Design", "Diseño interior de lujo discreto", "Design intérieur luxe discret", "Интерьер в стиле тихой роскоши"),
    "contemporary-vs-modern-interior-design": tx("Contemporary vs Modern Interior Design", "Diseño contemporáneo vs moderno", "Design contemporain ou moderne", "Contemporary и modern: разница в интерьере"),
    "luxury-kitchen-design-ideas": tx("Luxury Kitchen Design Ideas", "Ideas de cocinas de lujo", "Idées de cuisines de luxe", "Идеи люксовой кухни"),
    "luxury-bathroom-design-ideas": tx("Luxury Bathroom Design Ideas", "Ideas de baños de lujo", "Idées de salles de bain de luxe", "Идеи люксовой ванной"),
    "smart-home-interior-design": tx("Smart Home Interior Design", "Diseño interior smart home", "Design intérieur smart home", "Интерьер smart home"),
    "natural-stone-in-interior-design": tx("Natural Stone in Interior Design", "Piedra natural en diseño interior", "Pierre naturelle en design intérieur", "Натуральный камень в интерьере"),
    "italian-inspired-interiors": tx("Italian-Inspired Interiors", "Interiores inspirados en Italia", "Intérieurs d'inspiration italienne", "Интерьеры в итальянском духе"),
    "minimalist-luxury-interiors": tx("Minimalist Luxury Interiors", "Interiores de lujo minimalista", "Intérieurs luxe minimalistes", "Минималистичные люксовые интерьеры"),
    "best-materials-for-premium-interiors": tx("Best Materials for Premium Interiors", "Mejores materiales para interiores premium", "Meilleurs matériaux pour intérieurs premium", "Лучшие материалы для премиальных интерьеров"),
  };
  return titles[slug] || tx(titleCase(slug), titleCase(slug), titleCase(slug), titleCase(slug));
}

function articleDescription(slug) {
  const title = articleTitle(slug);
  return tx(`A practical CAS AURUM guide to ${local(title, "en").toLowerCase()}, with materials, room planning, lighting and premium collection references.`, `Guía práctica de CAS AURUM sobre ${local(title, "es").toLowerCase()}, con materiales, planificación e iluminación.`, `Guide CAS AURUM sur ${local(title, "fr").toLowerCase()}, avec matériaux, planification et lumière.`, `Практический гид CAS AURUM: ${local(title, "ru").toLowerCase()}, материалы, планировка и свет.`);
}

function titleCase(slug) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function stripInteriorWords(title) {
  return Object.fromEntries(Object.entries(title).map(([locale, value]) => [locale, value.replace(/\s*(Interiors|Interiores|Intérieurs|интерьеры)$/i, "").trim()]));
}

function shortRoomTitle(slug) {
  const names = roomName(slug);
  return tx(names.en, names.es, names.fr, names.ru);
}

function shortPropertyTitle(slug) {
  const names = propertyName(slug);
  return tx(names.en, names.es, names.fr, names.ru);
}

function roomName(slug) {
  const map = {
    "living-room": ["Living Room", "Sala", "Salon", "Гостиная"],
    kitchen: ["Kitchen", "Cocina", "Cuisine", "Кухня"],
    bathroom: ["Bathroom", "Baño", "Salle de bain", "Ванная"],
    bedroom: ["Bedroom", "Dormitorio", "Chambre", "Спальня"],
    "master-suite": ["Master Suite", "Suite principal", "Suite parentale", "Мастер-сьют"],
    "dining-room": ["Dining Room", "Comedor", "Salle à manger", "Столовая"],
    "home-office": ["Home Office", "Oficina en casa", "Bureau à domicile", "Домашний кабинет"],
    "walk-in-closet": ["Walk-In Closet", "Vestidor", "Dressing", "Гардеробная"],
    "wine-cellar": ["Wine Cellar", "Bodega", "Cave à vin", "Винная комната"],
    "home-theater": ["Home Theater", "Cine en casa", "Cinéma privé", "Домашний кинотеатр"],
    entryway: ["Entryway", "Entrada", "Entrée", "Прихожая"],
    "outdoor-living": ["Outdoor Living", "Exterior lounge", "Espace extérieur", "Уличная зона отдыха"],
    terrace: ["Terrace", "Terraza", "Terrasse", "Терраса"],
    "spa-room": ["Spa Room", "Sala spa", "Espace spa", "SPA-комната"],
    "kids-room": ["Kids Room", "Habitación infantil", "Chambre enfant", "Детская"],
    "guest-room": ["Guest Room", "Habitación de invitados", "Chambre d'amis", "Гостевая"],
    library: ["Library", "Biblioteca", "Bibliothèque", "Библиотека"],
    "wellness-room": ["Wellness Room", "Sala wellness", "Espace wellness", "Wellness-комната"],
    gym: ["Gym", "Gimnasio", "Salle de sport", "Тренажерный зал"],
    "pool-area": ["Pool Area", "Zona de piscina", "Espace piscine", "Зона бассейна"],
  }[slug] || [titleCase(slug), titleCase(slug), titleCase(slug), titleCase(slug)];
  return { en: map[0], es: map[1], fr: map[2], ru: map[3] };
}

function propertyName(slug) {
  const map = {
    villa: ["Villa", "villa", "villa", "Вилла"],
    penthouse: ["Penthouse", "penthouse", "penthouse", "Пентхаус"],
    mansion: ["Mansion", "mansión", "manoir", "Особняк"],
    apartment: ["Apartment", "apartamento", "appartement", "Апартаменты"],
    townhouse: ["Townhouse", "townhouse", "maison de ville", "Таунхаус"],
    "beach-house": ["Beach House", "casa de playa", "maison de plage", "Дом у пляжа"],
    "mountain-house": ["Mountain House", "casa de montaña", "maison de montagne", "Дом в горах"],
    "lake-house": ["Lake House", "casa del lago", "maison au bord du lac", "Дом у озера"],
    "city-apartment": ["City Apartment", "apartamento urbano", "appartement urbain", "Городские апартаменты"],
    "family-home": ["Family Home", "casa familiar", "maison familiale", "Семейный дом"],
    "luxury-condo": ["Luxury Condo", "condominio de lujo", "condo de luxe", "Люксовое кондо"],
    "boutique-hotel": ["Boutique Hotel", "hotel boutique", "hôtel boutique", "Бутик-отель"],
    "private-residence": ["Private Residence", "residencia privada", "résidence privée", "Частная резиденция"],
    "vacation-home": ["Vacation Home", "casa vacacional", "maison de vacances", "Дом для отдыха"],
    estate: ["Estate", "estate", "domaine", "Усадьба"],
  }[slug] || [titleCase(slug), titleCase(slug), titleCase(slug), titleCase(slug)];
  return { en: map[0], es: map[1], fr: map[2], ru: map[3] };
}

function roomMaterials(slug) {
  if (slug.includes("kitchen")) return ["walnut", "stone island", "matte lacquer"];
  if (slug.includes("bath") || slug.includes("spa")) return ["travertine", "limestone", "warm wood"];
  if (slug.includes("closet")) return ["walnut", "glass", "leather"];
  if (slug.includes("office") || slug.includes("library")) return ["oak", "walnut", "leather"];
  return ["walnut", "oak", "natural stone"];
}

function collectionImage(slug) {
  return collections.find((item) => item.slug === slug)?.imagePath || collections[0].imagePath;
}

function roomImage(slug) {
  if (slug.includes("kitchen")) return "/images/collections/madera-03-kitchen-gallery.webp";
  if (slug.includes("bedroom") || slug.includes("suite")) return "/images/collections/aurum-03-golden-hour-suite.webp";
  if (slug.includes("office") || slug.includes("library")) return "/images/collections/aurum-05-champagne-study.webp";
  if (slug.includes("closet")) return "/images/collections/signature-03-private-villa-dressing-gallery.webp";
  if (slug.includes("bath") || slug.includes("spa")) return "/images/collections/madera-06-spa-suite.webp";
  if (slug.includes("dining")) return "/images/collections/aurum-04-brass-line-dining-room.webp";
  return "/images/collections/madera-01-walnut-horizon-living.webp";
}

function cityImage(slug) {
  if (["miami", "palm-beach", "scottsdale"].includes(slug)) return "/images/collections/signature-03-private-villa-dressing-gallery.webp";
  if (["new-york", "toronto", "vancouver"].includes(slug)) return "/images/collections/aurum-01-champagne-gallery-residence.webp";
  if (["atlanta", "charlotte", "nashville", "chicago", "houston", "dallas"].includes(slug)) return "/images/collections/madera-04-refined-oak-study.webp";
  if (["mexico-city"].includes(slug)) return "/images/collections/noir-04-collectors-lounge.webp";
  if (["los-angeles", "beverly-hills"].includes(slug)) return "/images/collections/signature-01-one-of-one-penthouse-salon.webp";
  return "/images/collections/forma-01-linear-house-media-wall.webp";
}

function entityLabel(list, slug, locale) {
  return local(list.find((item) => item.slug === slug)?.title, locale) || titleCase(slug);
}

function collectionName(slug) {
  return collections.find((item) => item.slug === slug)?.name || titleCase(slug);
}

function intentBySlug(slug) {
  return intents.find((item) => item.slug === slug);
}

function directFor(locale, subject, type) {
  const base = {
    en: `${subject} should be planned as a complete interior system: style, room function, materials, lighting, furniture and storage need to support one another from the first concept.`,
    es: `${subject} debe planificarse como un sistema interior completo: estilo, función, materiales, iluminación, mobiliario y almacenamiento deben trabajar juntos.`,
    fr: `${subject} doit être planifié comme un système intérieur complet : style, fonction, matériaux, lumière, mobilier et rangement doivent se répondre.`,
    ru: `${subject} стоит планировать как единую интерьерную систему: стиль, функция, материалы, свет, мебель и хранение должны работать вместе.`,
  };
  return base[locale] || base.en;
}

function hubDescription(hub, locale) {
  return {
    en: `Explore CAS AURUM ${hub}: premium interiors, curated rooms, architectural spaces, collection directions and design inspiration for high-end properties.`,
    es: `Explore ${hub} de CAS AURUM: interiores premium, espacios curados, arquitectura interior y colecciones para propiedades de alto nivel.`,
    fr: `Explorez ${hub} CAS AURUM : intérieurs premium, pièces curées, espaces architecturaux et collections pour propriétés haut de gamme.`,
    ru: `Изучите ${hub} CAS AURUM: премиальные интерьеры, curated rooms, архитектурные пространства и коллекции для high-end недвижимости.`,
  }[locale];
}

function hubDirect(hub, locale) {
  return {
    en: `Explore ${hub} through practical design angles: room use, materials, lighting, property type and the kind of custom scope that makes a premium interior feel resolved.`,
    es: `Explore ${hub} desde ángulos prácticos de diseño: uso del espacio, materiales, iluminación, tipo de propiedad y el alcance a medida que hace que un interior premium se sienta resuelto.`,
    fr: `Explorez ${hub} à travers des angles pratiques : usage de la pièce, matériaux, lumière, type de propriété et portée sur mesure qui rend un intérieur premium abouti.`,
    ru: `Изучите ${hub} через практические углы дизайна: сценарии комнаты, материалы, свет, тип недвижимости и кастомный объем работ, который делает премиальный интерьер завершенным.`,
  }[locale];
}

function combinationIntro(locale, h1) {
  return {
    en: `${h1} works best when the style language, room function and property context are planned together. The useful questions are scale, storage, lighting, material durability and how the space should feel in daily life.`,
    es: `${h1} funciona mejor cuando el lenguaje de estilo, la función del espacio y el contexto de la propiedad se planifican juntos. Las preguntas útiles son escala, almacenamiento, iluminación, durabilidad de materiales y cómo debe sentirse el espacio en la vida diaria.`,
    fr: `${h1} fonctionne mieux lorsque le langage stylistique, la fonction de la pièce et le contexte de la propriété sont pensés ensemble. Les bonnes questions portent sur l'échelle, le rangement, la lumière, la durabilité des matières et la sensation au quotidien.`,
    ru: `${h1} работает лучше всего, когда стиль, функция комнаты и контекст недвижимости планируются вместе. Важные вопросы: масштаб, хранение, свет, долговечность материалов и ощущение пространства в ежедневной жизни.`,
  }[locale] || h1;
}

function priorityFor(pageType) {
  if (pageType === "hub") return "0.8";
  if (["style", "room", "collection", "article"].includes(pageType)) return "0.75";
  if (pageType.startsWith("city")) return "0.68";
  return "0.62";
}
