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
    eyebrow: "Casaurum Interiors", ctaPrimary: "Request a Consultation", ctaSecondary: "Explore Completed Work", contact: "Contact", request: "Request Consultation",
    direct: "Direct answer", defines: "What defines this direction", elements: "Key design elements", materials: "Materials and finishes", lighting: "Lighting and atmosphere", furniture: "Furniture and decor direction", layout: "Layout and spatial planning", investment: "Investment signals", mistakes: "Common mistakes", related: "Related Casaurum pages", faq: "Frequently Asked Questions", finalCta: "Request a consultation"
  },
  es: {
    interiors: "Interiores", styles: "Estilos", rooms: "Espacios", properties: "Propiedades", cities: "Ciudades", collections: "Colecciones", journal: "Journal",
    eyebrow: "Interiores Casaurum", ctaPrimary: "Solicitar una consulta", ctaSecondary: "Explorar trabajos completados", contact: "Contacto", request: "Solicitar consulta",
    direct: "Respuesta directa", defines: "Qué define esta dirección", elements: "Elementos clave", materials: "Materiales y acabados", lighting: "Iluminación y atmósfera", furniture: "Mobiliario y decoración", layout: "Distribución espacial", investment: "Señales de inversión", mistakes: "Errores comunes", related: "Páginas relacionadas", faq: "Preguntas frecuentes", finalCta: "Solicitar una consulta"
  },
  fr: {
    interiors: "Intérieurs", styles: "Styles", rooms: "Pièces", properties: "Propriétés", cities: "Villes", collections: "Collections", journal: "Journal",
    eyebrow: "Intérieurs Casaurum", ctaPrimary: "Demander une consultation", ctaSecondary: "Explorer les projets réalisés", contact: "Contact", request: "Demander une consultation",
    direct: "Réponse directe", defines: "Ce qui définit cette direction", elements: "Éléments clés", materials: "Matériaux et finis", lighting: "Lumière et atmosphère", furniture: "Mobilier et décor", layout: "Planification spatiale", investment: "Signaux d'investissement", mistakes: "Erreurs fréquentes", related: "Pages liées", faq: "Questions fréquentes", finalCta: "Demander une consultation"
  },
  ru: {
    interiors: "Интерьеры", styles: "Стили", rooms: "Комнаты", properties: "Недвижимость", cities: "Города", collections: "Коллекции", journal: "Журнал",
    eyebrow: "Casaurum Interiors", ctaPrimary: "Запросить консультацию", ctaSecondary: "Смотреть выполненные проекты", contact: "Контакты", request: "Запросить консультацию",
    direct: "Короткий ответ", defines: "Что формирует направление", elements: "Ключевые элементы", materials: "Материалы и отделки", lighting: "Свет и атмосфера", furniture: "Мебель и декор", layout: "Планировка и пространство", investment: "Инвестиционные факторы", mistakes: "Частые ошибки", related: "Связанные страницы", faq: "Частые вопросы", finalCta: "Запросить консультацию"
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
      `${readable} at CAS AURUM is planned as a project-specific interior direction: proportion, light, furniture, surfaces and storage are considered together rather than as separate decorative choices.`,
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

const roomProfiles = {
  bedroom: {
    h1Title: tx("Luxury Bedroom Interiors", "Dormitorios de lujo", "Chambres de luxe", "Люксовые спальни"),
    metaTitleOverride: tx(
      "Luxury Bedroom Interiors | Custom Headboard Walls & Storage | CAS AURUM",
      "Dormitorios de lujo | Cabeceros y almacenamiento a medida | CAS AURUM",
      "Chambres de luxe | Têtes de lit et rangement sur mesure | CAS AURUM",
      "Люксовые спальни | Изголовья и хранение на заказ | CAS AURUM"
    ),
    intro: tx(
      "CAS AURUM bedrooms are shaped around calm proportion, a strong headboard wall, integrated lighting, custom storage, warm materials and furniture that makes the room feel private, quiet and resolved.",
      "Los dormitorios CAS AURUM se planifican como suites privadas: almacenamiento sereno, muro de cabecera compuesto, iluminación por capas, materiales suaves y una disciplina tranquila que favorece el descanso.",
      "Les chambres CAS AURUM sont pensées comme des suites privées : rangement calme, mur de tête de lit composé, lumière en couches, matières douces et discipline discrète au service du repos.",
      "Спальни CAS AURUM планируются как приватные архитектурные сьюты: спокойное хранение, продуманная стена изголовья, многослойный свет, мягкие материалы и атмосфера отдыха без визуального шума."
    ),
    metaDescription: tx(
      "Bedroom interior ideas by CAS AURUM with custom headboard walls, wardrobes, integrated storage, warm lighting, premium materials and related completed interior work.",
      "Ideas de dormitorios CAS AURUM con cabeceros a medida, wardrobes, almacenamiento integrado, luz cálida, materiales premium y trabajos interiores completados relacionados.",
      "Idées de chambre CAS AURUM avec têtes de lit sur mesure, dressings, rangement intégré, lumière chaleureuse, matériaux premium et projets réalisés liés.",
      "Идеи интерьера спальни CAS AURUM: кастомные изголовья, гардеробные решения, встроенное хранение, теплый свет, премиальные материалы и связанные выполненные работы."
    ),
    directSummary: tx(
      "A premium bedroom should start with the bed wall, lighting layers, storage requirements and the level of softness or architectural detail the room needs.",
      "Un dormitorio premium debe sentirse reparador primero y después revelar el trabajo a medida: cabecero, wardrobes, mesas de noche, textiles suaves, confort acústico y escenas de luz para mañana, tarde y noche.",
      "Une chambre premium doit d'abord apaiser, puis révéler le sur mesure : tête de lit, dressings, chevets, douceur textile, confort acoustique et scénarios lumineux du matin au soir.",
      "Премиальная спальня сначала должна давать отдых, а уже потом показывать кастомную работу: изголовье, шкафы, тумбы, мягкие ткани, акустический комфорт и световые сценарии для утра, вечера и ночи."
    ),
    materials: ["oak", "walnut", "linen textures", "leather details", "soft stone", "matte finishes"],
    relatedProjects: [
      "cas-aurum-premium-walnut-built-in-bookcase-library-wall.webp",
      "cas-aurum-premium-live-edge-designer-table-office.webp",
      "cas-aurum-premium-walnut-glass-bar-cabinet.webp",
    ],
    relatedProjectsTitle: tx("Related completed projects", "Proyectos realizados relacionados", "Projets réalisés associés", "Похожие выполненные проекты"),
    relatedProjectsBody: tx(
      "Explore completed CAS AURUM work related to private rooms, including walnut built-ins, designer furniture and refined storage details that can inform a bedroom suite.",
      "Explore trabajos realizados de CAS AURUM relacionados con espacios privados: built-ins en nogal, mobiliario de diseño y detalles de almacenamiento refinados.",
      "Découvrez des projets réalisés CAS AURUM liés aux pièces privées : intégrés en noyer, mobilier design et détails de rangement raffinés.",
      "Посмотрите выполненные работы CAS AURUM для приватных помещений: встроенные решения из ореха, дизайнерская мебель и утонченные детали хранения."
    ),
    sections: {
      en: [
        ["The bedroom as a private architectural suite", "The strongest bedroom is not overdecorated. It uses proportion, storage, wall composition and soft texture to make the room feel protected, quiet and resolved."],
        ["Custom headboard walls and integrated storage", "A full-wall headboard can carry lighting, bedside niches, upholstered panels, wood veneer, stone ledges or concealed wiring so the bed wall feels built into the architecture."],
        ["Wardrobes, vanities and concealed organization", "Bedroom storage should be planned around daily use: hanging lengths, drawers, accessories, linens, luggage, vanity needs and the way doors or drawers move around the bed."],
        ["Lighting for morning, evening and nighttime comfort", "Good bedroom lighting separates reading light, closet light, ambient glow, low nighttime guidance and daylight control instead of relying on one ceiling fixture."],
        ["Materials with softness and weight", "Oak, walnut, linen textures, leather details, soft stone and matte finishes create calm luxury when the palette stays edited and tactile."],
        ["Common mistakes", "Avoid overdecorating the bed wall, undersizing the bed or rug, planning the closet too late, using cold lighting, or choosing nightstands before the headboard and storage logic are settled."],
      ],
      es: [
        ["El dormitorio como suite privada", "El mejor dormitorio no está sobredecorado. Usa proporción, almacenamiento, composición de pared y textura suave para sentirse protegido, sereno y resuelto."],
        ["Cabeceros a medida y almacenamiento integrado", "Un cabecero de pared completa puede integrar luz, nichos, paneles tapizados, chapa de madera, repisas de piedra o cableado oculto para que la cama pertenezca a la arquitectura."],
        ["Wardrobes, tocadores y organización oculta", "El almacenamiento debe planificarse según el uso diario: largos de colgado, cajones, accesorios, ropa blanca, maletas, tocador y recorridos alrededor de la cama."],
        ["Luz para mañana, tarde y noche", "La buena iluminación separa lectura, closet, ambiente, guía nocturna y control de luz natural en lugar de depender de una sola lámpara de techo."],
        ["Materiales suaves y con peso", "Roble, nogal, texturas de lino, detalles de cuero, piedra suave y acabados mate crean lujo tranquilo cuando la paleta se mantiene editada y táctil."],
        ["Errores comunes", "Evite sobredecorar la pared de la cama, elegir una cama o alfombra pequeña, planificar tarde el closet, usar luz fría o escoger mesas antes de resolver cabecero y almacenamiento."],
      ],
      fr: [
        ["La chambre comme suite privée", "La meilleure chambre n'est pas surdécorée. Elle utilise proportion, rangement, composition murale et texture douce pour créer une sensation protégée, calme et aboutie."],
        ["Têtes de lit sur mesure et rangement intégré", "Une tête de lit pleine largeur peut intégrer lumière, niches, panneaux tapissés, placage bois, tablette pierre ou câblage dissimulé pour ancrer le lit dans l'architecture."],
        ["Dressings, coiffeuses et organisation cachée", "Le rangement doit suivre l'usage quotidien : penderies, tiroirs, accessoires, linge, bagages, coin coiffeuse et circulation autour du lit."],
        ["Lumière du matin, du soir et de la nuit", "Une bonne lumière sépare lecture, dressing, ambiance, repère nocturne et contrôle du jour au lieu de dépendre d'un seul plafonnier."],
        ["Matières douces et présentes", "Chêne, noyer, textures de lin, détails cuir, pierre douce et finitions mates créent un luxe calme lorsque la palette reste éditée et tactile."],
        ["Erreurs fréquentes", "Évitez de surcharger le mur du lit, de sous-dimensionner lit ou tapis, de planifier le dressing trop tard, d'utiliser une lumière froide ou de choisir les chevets avant la logique de rangement."],
      ],
      ru: [
        ["Спальня как приватный архитектурный сьют", "Сильная спальня не перегружена декором. Она строится на пропорциях, хранении, композиции стены и мягких фактурах, чтобы пространство ощущалось защищенным и спокойным."],
        ["Кастомная стена изголовья и встроенное хранение", "Стена изголовья может объединять подсветку, ниши, мягкие панели, шпон, каменную полку или скрытую проводку, чтобы кровать стала частью архитектуры."],
        ["Шкафы, туалетные зоны и скрытая организация", "Хранение планируется под ежедневные сценарии: длинная одежда, ящики, аксессуары, белье, чемоданы, vanity-зона и движение дверей вокруг кровати."],
        ["Свет для утра, вечера и ночи", "Хороший свет разделяет чтение, шкафы, мягкий фоновый сценарий, ночную навигацию и контроль дневного света, а не держится на одной потолочной точке."],
        ["Материалы с мягкостью и весом", "Дуб, орех, льняные фактуры, кожа, мягкий камень и матовые отделки создают спокойную роскошь, если палитра остается собранной и тактильной."],
        ["Частые ошибки", "Не перегружайте стену кровати, не ошибайтесь с масштабом кровати и ковра, не оставляйте шкафы на последний этап, избегайте холодного света и выбора тумб до логики изголовья."],
      ],
    },
    faq: {
      en: [
        ["Can CAS AURUM design a complete bedroom suite?", "Yes. A bedroom scope can include a custom headboard wall, wardrobes, nightstands, vanities, panels, lighting direction and material coordination."],
        ["Can you integrate wardrobes and a custom headboard wall?", "Yes. The strongest bedrooms usually connect the bed wall and storage so the room feels architectural rather than furnished in separate pieces."],
        ["Do you help with lighting and material selection?", "Yes. Lighting scenes and materials are reviewed together because bedroom comfort depends on warmth, glare control, texture and nighttime use."],
        ["Can you adapt the design to an existing home?", "Yes. Photos, dimensions, ceiling height, outlet locations and existing finishes help adapt the scope to the home."],
      ],
      es: [
        ["¿CAS AURUM puede diseñar una suite completa de dormitorio?", "Sí. El alcance puede incluir cabecero a medida, wardrobes, mesas, tocador, paneles, dirección de iluminación y coordinación de materiales."],
        ["¿Pueden integrar wardrobes y un cabecero a medida?", "Sí. Los mejores dormitorios conectan pared de cama y almacenamiento para que el espacio se sienta arquitectónico."],
        ["¿Ayudan con iluminación y materiales?", "Sí. Luz y materiales se revisan juntos porque el confort depende de calidez, control de brillo, textura y uso nocturno."],
        ["¿Pueden adaptar el diseño a una casa existente?", "Sí. Fotos, medidas, altura, tomas eléctricas y acabados existentes ayudan a adaptar el alcance."],
      ],
      fr: [
        ["CAS AURUM peut-il concevoir une suite chambre complète ?", "Oui. Le périmètre peut inclure tête de lit, dressings, chevets, coiffeuse, panneaux, lumière et coordination matières."],
        ["Pouvez-vous intégrer dressings et tête de lit sur mesure ?", "Oui. Les meilleures chambres relient mur du lit et rangement pour donner une vraie architecture à la pièce."],
        ["Aidez-vous pour la lumière et les matériaux ?", "Oui. Lumière et matières sont étudiées ensemble car le confort dépend de la chaleur, de l'éblouissement, des textures et de l'usage nocturne."],
        ["Pouvez-vous adapter le design à une maison existante ?", "Oui. Photos, mesures, hauteur, prises et finitions existantes aident à adapter le périmètre."],
      ],
      ru: [
        ["Может ли CAS AURUM спроектировать полный bedroom suite?", "Да. Объем может включать изголовье, шкафы, тумбы, vanity-зону, панели, свет и согласование материалов."],
        ["Можно интегрировать шкафы и кастомную стену изголовья?", "Да. Лучшие спальни связывают стену кровати и хранение, чтобы комната выглядела архитектурно, а не набором предметов."],
        ["Вы помогаете со светом и материалами?", "Да. Свет и материалы рассматриваются вместе: комфорт спальни зависит от теплоты, контроля бликов, фактур и ночных сценариев."],
        ["Можно адаптировать решение к существующему дому?", "Да. Фото, размеры, высота потолка, розетки и существующие отделки помогают адаптировать scope."],
      ],
    },
  },
  bathroom: {
    h1Title: tx("Luxury Bathroom Interiors & Custom Vanities", "Baños de lujo y vanities a medida", "Salles de bain de luxe et meubles vasques", "Люксовые ванные и тумбы на заказ"),
    metaTitleOverride: tx(
      "Luxury Bathroom Interiors | Custom Vanities & Marble Details | CAS AURUM",
      "Baños de lujo | Vanities a medida y detalles de mármol | CAS AURUM",
      "Salles de bain de luxe | Meubles vasques et détails marbre | CAS AURUM",
      "Люксовые ванные | Тумбы на заказ и мраморные детали | CAS AURUM"
    ),
    intro: tx(
      "CAS AURUM bathrooms are planned around stone, proportion, vanity design, mirror and lighting placement, shower details, storage and the calm atmosphere expected from a premium residential suite.",
      "Los baños CAS AURUM se centran en el ritual diario: piedra, vanity, espejos, zonas húmedas, iluminación, almacenamiento, ventilación y acabados durables con presencia refinada.",
      "Les salles de bain CAS AURUM se concentrent sur le rituel quotidien : pierre, meuble vasque, miroirs, zones humides, lumière, rangement, ventilation et finitions durables.",
      "Ванные CAS AURUM строятся вокруг ежедневного ритуала: камень, тумба, зеркала, влажные зоны, свет, хранение, вентиляция и долговечные отделки без потери премиальности."
    ),
    metaDescription: tx(
      "Bathroom interior ideas with custom vanities, stone, tile, mirrors, lighting, storage, durable finishes and related completed bathroom projects by CAS AURUM.",
      "Ideas de baños con vanities a medida, piedra, tile, espejos, iluminación, almacenamiento, acabados durables y proyectos completados relacionados.",
      "Idées de salle de bain avec meubles vasques, pierre, carrelage, miroirs, lumière, rangement, finitions durables et projets réalisés liés.",
      "Идеи ванной: тумбы на заказ, камень, плитка, зеркала, свет, хранение, долговечные отделки и связанные выполненные проекты CAS AURUM."
    ),
    directSummary: tx(
      "A luxury bathroom should balance stone, water exposure, lighting, storage and daily function before decorative finishes are chosen.",
      "Un baño premium necesita más que piedra: vanity, espejo, zona húmeda, luz, almacenamiento y ventilación deben trabajar juntos para sentirse tipo spa y funcionar cada día.",
      "Une salle de bain premium demande plus que de la pierre : vasque, miroir, zone humide, lumière, rangement et ventilation doivent fonctionner ensemble au quotidien.",
      "Премиальной ванной недостаточно одного камня: тумба, зеркало, wet zone, свет, хранение и вентиляция должны работать вместе, чтобы комната была и spa-like, и практичной."
    ),
    materials: ["marble", "limestone", "travertine", "porcelain slabs", "walnut accents", "brushed metal"],
    relatedProjects: [
      "cas-aurum-premium-fluted-stone-bathroom-vanity.webp",
    ],
    relatedProjectsTitle: tx("Related completed projects", "Proyectos realizados relacionados", "Projets réalisés associés", "Похожие выполненные проекты"),
    relatedProjectsBody: tx(
      "Explore completed CAS AURUM bathroom work with a fluted stone vanity, backlit mirror, brass fixtures and warm luxury lighting.",
      "Explore trabajos realizados de baño con vanity acanalado, piedra, espejo retroiluminado, grifería de latón y luz cálida premium.",
      "Découvrez un projet de salle de bain réalisé avec meuble vasque cannelé, pierre, miroir rétroéclairé, robinetterie laiton et lumière chaude.",
      "Посмотрите выполненную ванную CAS AURUM: рифленая тумба, камень, зеркало с подсветкой, латунная сантехника и теплый свет."
    ),
  },
  "living-room": {
    h1Title: tx("Luxury Living Room Interiors", "Salas de lujo", "Salons de luxe", "Люксовые гостиные"),
    metaTitleOverride: tx(
      "Luxury Living Room Interiors | Custom Media Walls & Built-Ins | CAS AURUM",
      "Salas de lujo | Media walls y built-ins a medida | CAS AURUM",
      "Salons de luxe | Media walls et intégrés sur mesure | CAS AURUM",
      "Люксовые гостиные | Media walls и built-ins на заказ | CAS AURUM"
    ),
    intro: tx(
      "CAS AURUM living rooms are planned around the room's strongest architectural moment: a media wall, fireplace wall, custom built-ins, panel rhythm, lighting, storage and furniture scaled as one composition.",
      "Las salas CAS AURUM se tratan como la declaración arquitectónica principal: muro focal, chimenea o media wall, built-ins, distribución de asientos, equilibrio acústico y atmósfera nocturna.",
      "Les salons CAS AURUM sont traités comme la déclaration architecturale principale : mur focal, cheminée ou media wall, intégrés, assises, équilibre acoustique et ambiance du soir.",
      "Гостиные CAS AURUM рассматриваются как главный архитектурный акцент дома: фокусная стена, камин или media wall, built-ins, посадка, акустический баланс и вечерняя атмосфера."
    ),
    metaDescription: tx(
      "Living room interior ideas with media walls, fireplaces, built-ins, seating layouts, premium materials, lighting and related completed living room work by CAS AURUM.",
      "Ideas de salas con media walls, chimeneas, built-ins, distribución, materiales premium, iluminación y trabajos completados relacionados.",
      "Idées de salon avec media walls, cheminées, intégrés, implantation, matières premium, lumière et projets réalisés liés.",
      "Идеи гостиной: media walls, камины, встроенные решения, планировка посадки, премиальные материалы, свет и связанные выполненные работы."
    ),
    directSummary: tx(
      "A premium living room should begin with the focal wall, circulation, storage and lighting strategy before furniture and decor are selected.",
      "Una sala fuerte empieza con la arquitectura focal: media wall, chimenea, built-ins o almacenamiento de exhibición; después se alinean asientos, circulación, luz y materiales.",
      "Un salon fort commence par son architecture focale : media wall, cheminée, intégrés ou rangement d'exposition, puis assises, circulation, lumière et matières s'alignent autour d'elle.",
      "Сильная гостиная начинается с фокусной архитектуры: media wall, камина, built-ins или витринного хранения. Затем вокруг этого выстраиваются посадка, движение, свет и материалы."
    ),
    materials: ["walnut", "oak", "stone", "plaster", "fluted panels", "bronze metal"],
    relatedProjects: [
      "cas-aurum-premium-wood-stone-tv-wall-unit-led-lighting.webp",
      "cas-aurum-premium-slatted-media-console-living-room.webp",
      "cas-aurum-premium-walnut-built-in-bookcase-library-wall.webp",
      "cas-aurum-premium-executive-office-lounge-wall-millwork.webp",
    ],
    relatedProjectsTitle: tx("Related completed projects", "Proyectos realizados relacionados", "Projets réalisés associés", "Похожие выполненные проекты"),
    relatedProjectsBody: tx(
      "Explore completed CAS AURUM living room and media wall work, including wood-and-stone TV walls, slatted consoles, walnut built-ins and warm architectural lighting.",
      "Explore proyectos realizados para salas y media walls: muros TV en madera y piedra, consolas ranuradas, built-ins en nogal e iluminación arquitectónica cálida.",
      "Découvrez des projets réalisés pour salons et murs média : bois et pierre, consoles à lattes, intégrés en noyer et lumière architecturale chaude.",
      "Посмотрите выполненные работы для гостиных и медиа-стен: дерево и камень, реечные консоли, встроенные решения из ореха и теплый архитектурный свет."
    ),
  },
  kitchen: {
    h1Title: tx("Luxury Kitchen Interiors & Custom Cabinetry", "Cocinas de lujo y cabinetry a medida", "Cuisines de luxe et cabinetry sur mesure", "Люксовые кухни и корпусная мебель на заказ"),
    metaTitleOverride: tx(
      "Luxury Kitchen Interiors | Custom Cabinetry & Millwork | CAS AURUM",
      "Cocinas de lujo | Cabinetry y millwork a medida | CAS AURUM",
      "Cuisines de luxe | Cabinetry et menuiserie sur mesure | CAS AURUM",
      "Люксовые кухни | Корпусная мебель и millwork | CAS AURUM"
    ),
    intro: tx(
      "CAS AURUM kitchens focus on cabinetry proportion, island presence, stone, lighting, storage, appliance integration and finish details that make the kitchen feel built into the architecture of the home.",
      "Las cocinas CAS AURUM se enfocan en cabinetry premium a medida, islas, paneles, almacenamiento, carpintería de acabado y coordinación material alrededor de la cocina como centro funcional.",
      "Les cuisines CAS AURUM se concentrent sur cabinetry premium, îlots, panneaux, rangement, menuiserie de finition et coordination matières autour d'une pièce centrale fonctionnelle.",
      "Кухни CAS AURUM фокусируются на премиальной корпусной мебели, островах, панелях, хранении, финишной столярке и согласовании материалов вокруг кухни как функционального центра дома."
    ),
    metaDescription: tx(
      "Kitchen interior ideas with custom cabinetry, islands, panels, storage, stone, wood, lighting coordination and related completed kitchen projects by CAS AURUM.",
      "Ideas de cocinas con cabinetry a medida, islas, paneles, almacenamiento, piedra, madera, coordinación de luz y proyectos completados relacionados.",
      "Idées de cuisine avec cabinetry, îlots, panneaux, rangement, pierre, bois, coordination lumière et projets réalisés liés.",
      "Идеи кухни: корпусная мебель на заказ, острова, панели, хранение, камень, дерево, согласование света и связанные выполненные кухни CAS AURUM."
    ),
    directSummary: tx(
      "A luxury kitchen should be planned around workflow, cabinetry lines, island scale, lighting and material transitions before finishes are selected.",
      "CAS AURUM puede apoyar cocinas con cabinetry premium, islas, paneles de acabado, almacenamiento y dirección material; el alcance constructivo completo y responsabilidades trade se confirman por proyecto.",
      "CAS AURUM peut accompagner les cuisines par cabinetry premium, îlots, panneaux, rangement et direction matières; la portée chantier et les responsabilités trade se confirment par projet.",
      "CAS AURUM может поддержать кухонный проект через премиальную корпусную мебель, острова, панели, хранение и материалы; полный строительный scope и trade-ответственность уточняются по каждому проекту."
    ),
    materials: ["walnut", "rift oak", "matte lacquer", "stone slabs", "integrated lighting", "metal accents"],
    relatedProjects: [
      "cas-aurum-premium-ivory-kitchen-cabinetry-brass-hardware.webp",
    ],
    relatedProjectsTitle: tx("Related completed projects", "Proyectos realizados relacionados", "Projets réalisés associés", "Похожие выполненные проекты"),
    relatedProjectsBody: tx(
      "Explore completed CAS AURUM kitchen cabinetry with ivory fronts, brass hardware, stone surfaces and warm under-cabinet lighting.",
      "Explore una cocina realizada por CAS AURUM con cabinetry color marfil, herrajes de latón, piedra e iluminación cálida bajo muebles.",
      "Découvrez une cuisine réalisée par CAS AURUM avec cabinetry ivoire, quincaillerie laiton, pierre et éclairage chaud sous meubles.",
      "Посмотрите выполненную кухню CAS AURUM: ivory-фасады, латунная фурнитура, камень и теплая подсветка."
    ),
  },
  "walk-in-closet": {
    h1Title: tx("Luxury Walk-In Closets & Dressing Rooms", "Vestidores de lujo y dressing rooms", "Dressings de luxe et pièces dressing", "Люксовые гардеробные и dressing rooms"),
    metaTitleOverride: tx(
      "Luxury Walk-In Closets | Custom Dressing Rooms | CAS AURUM",
      "Vestidores de lujo | Dressing rooms a medida | CAS AURUM",
      "Dressings de luxe | Pièces dressing sur mesure | CAS AURUM",
      "Люксовые гардеробные | Dressing rooms на заказ | CAS AURUM"
    ),
    intro: tx(
      "CAS AURUM walk-in closets are designed as private dressing rooms with custom cabinetry, illuminated storage, wardrobe planning, drawers, glass, hardware, seating and materials that feel closer to a boutique than a basic closet system.",
      "Los vestidores CAS AURUM se planifican como boutiques privadas: sistemas de wardrobe, iluminación, cajones, puertas de vidrio, accesorios, espejos, asiento, isla y ritual diario cuidado.",
      "Les dressings CAS AURUM sont pensés comme des boutiques privées : systèmes de rangement, lumière, tiroirs, portes vitrées, accessoires, miroirs, assise, îlot et rituel quotidien.",
      "Гардеробные CAS AURUM планируются как приватные бутики: системы хранения, свет, ящики, стеклянные двери, аксессуары, зеркала, посадка, остров и продуманный ежедневный ритуал."
    ),
    metaDescription: tx(
      "Walk-in closet ideas with custom wardrobe systems, lighting, drawers, glass doors, island storage, mirrors, hardware and related custom storage work by CAS AURUM.",
      "Ideas de vestidor con wardrobes a medida, iluminación, cajones, puertas de vidrio, isla, espejos, herrajes y trabajos de almacenamiento relacionados.",
      "Idées de dressing avec systèmes sur mesure, lumière, tiroirs, portes vitrées, îlot, miroirs, quincaillerie et travaux de rangement liés.",
      "Идеи гардеробной: системы хранения на заказ, свет, ящики, стеклянные двери, остров, зеркала, фурнитура и связанные работы по хранению."
    ),
    directSummary: tx(
      "A luxury walk-in closet should begin with wardrobe inventory, circulation, lighting and storage hierarchy before cabinet finishes are selected.",
      "Un vestidor de lujo debe planificarse primero según el inventario de ropa; después luz, exhibición, cajones, almacenamiento estacional, espejos y herrajes crean la atmósfera boutique.",
      "Un dressing luxe se planifie d'abord selon l'inventaire; ensuite lumière, exposition, tiroirs, rangement saisonnier, miroirs et quincaillerie créent l'ambiance boutique.",
      "Люксовая гардеробная сначала планируется вокруг состава гардероба; затем свет, витрины, ящики, сезонное хранение, зеркала и фурнитура создают boutique-атмосферу."
    ),
    materials: ["walnut", "oak", "smoked glass", "leather inserts", "bronze hardware", "LED lighting"],
    relatedProjects: [
      "cas-aurum-premium-walnut-built-in-bookcase-library-wall.webp",
      "cas-aurum-premium-walnut-glass-bar-cabinet.webp",
    ],
    relatedProjectsTitle: tx("Related completed projects", "Proyectos realizados relacionados", "Projets réalisés associés", "Похожие выполненные проекты"),
    relatedProjectsBody: tx(
      "Explore completed CAS AURUM storage and display work with illuminated walnut built-ins and glass-front cabinetry that can inform a dressing-room or private storage scope.",
      "Explore trabajos realizados de almacenamiento y display con built-ins iluminados en nogal y cabinetry con vidrio para orientar un vestidor o almacenamiento privado.",
      "Découvrez des réalisations de rangement et d'exposition avec intégrés en noyer éclairés et cabinetry vitré pour orienter un dressing ou rangement privé.",
      "Посмотрите выполненные решения хранения и витрин: подсвеченные built-ins из ореха и cabinetry со стеклом для гардеробной или приватного хранения."
    ),
  },
  "master-suite": {
    h1Title: tx("Luxury Master Suite Interiors", "Master suites de lujo", "Suites parentales de luxe", "Люксовые мастер-сьюты"),
    metaTitleOverride: tx(
      "Luxury Master Suite Interiors | Bedroom Closet & Bath Planning | CAS AURUM",
      "Master suites de lujo | Dormitorio, vestidor y baño | CAS AURUM",
      "Suites parentales de luxe | Chambre, dressing et bain | CAS AURUM",
      "Люксовые мастер-сьюты | Спальня, гардеробная и ванная | CAS AURUM"
    ),
    intro: tx(
      "CAS AURUM master suites connect bedroom, bathroom, closet, lighting, storage and material direction into one private residential experience rather than treating each room separately.",
      "Las master suites CAS AURUM conectan dormitorio, baño, vestidor, iluminación, almacenamiento y materiales en una experiencia privada en lugar de tratar cada espacio por separado.",
      "Les suites parentales CAS AURUM relient chambre, salle de bain, dressing, lumière, rangement et matières en une expérience privée cohérente.",
      "Мастер-сьюты CAS AURUM связывают спальню, ванную, гардеробную, свет, хранение и материалы в единый приватный сценарий, а не в набор отдельных комнат."
    ),
    metaDescription: tx(
      "Luxury master suite interiors by CAS AURUM with bedroom, dressing room, bathroom, wardrobe planning, vanities, lighting, storage and premium material coordination.",
      "Master suites de lujo CAS AURUM con dormitorio, vestidor, baño, wardrobes, vanities, iluminación, almacenamiento y coordinación de materiales premium.",
      "Suites parentales de luxe CAS AURUM avec chambre, dressing, salle de bain, rangement, vasques, lumière et coordination matières premium.",
      "Люксовые мастер-сьюты CAS AURUM: спальня, гардеробная, ванная, хранение, тумбы, свет и согласование премиальных материалов."
    ),
    directSummary: tx(
      "A premium master suite should be planned as a connected sequence: bedroom, dressing, bathing, storage, lighting and circulation.",
      "Una master suite premium debe planificarse como una secuencia conectada: dormitorio, vestidor, baño, almacenamiento, luz y circulación.",
      "Une suite parentale premium se planifie comme une séquence connectée : chambre, dressing, bain, rangement, lumière et circulation.",
      "Премиальный мастер-сьют планируется как связанная последовательность: спальня, dressing, ванная, хранение, свет и движение."
    ),
    materials: ["walnut", "oak", "soft stone", "linen textures", "smoked glass", "brushed metal"],
    relatedProjects: [
      "cas-aurum-premium-walnut-built-in-bookcase-library-wall.webp",
      "cas-aurum-premium-fluted-stone-bathroom-vanity.webp",
      "cas-aurum-premium-walnut-glass-bar-cabinet.webp",
    ],
    relatedProjectsTitle: tx("Related completed projects", "Proyectos realizados relacionados", "Projets réalisés associés", "Похожие выполненные проекты"),
    relatedProjectsBody: tx(
      "Explore completed CAS AURUM work related to master suites, including walnut storage, fluted stone vanity details and refined bar or lounge cabinetry.",
      "Explore trabajos realizados relacionados con master suites: almacenamiento en nogal, vanity acanalado de piedra y cabinetry refinada para bar o lounge.",
      "Découvrez des projets réalisés liés aux suites parentales : rangement en noyer, meuble vasque cannelé en pierre et cabinetry raffinée pour bar ou lounge.",
      "Посмотрите выполненные работы для master suite: хранение из ореха, рифленая каменная тумба и утонченная cabinetry для бара или lounge."
    ),
  },
};

export const rooms = [
  "living-room", "kitchen", "bathroom", "bedroom", "master-suite", "dining-room", "home-office", "walk-in-closet", "wine-cellar", "home-theater", "entryway", "outdoor-living", "terrace", "spa-room", "kids-room", "guest-room", "library", "wellness-room", "gym", "pool-area",
].map((slug) => {
  const profile = roomProfiles[slug] || {};
  return localizedEntity(slug, roomTitle(slug), {
  shortTitle: shortRoomTitle(slug),
  layoutIdeas: ["clear focal wall", "balanced circulation", "built-in storage where it improves proportion"],
  keyFeatures: ["custom furniture", "premium surfaces", "architectural lighting"],
  premiumMaterials: profile.materials || roomMaterials(slug),
  lightingNotes: ["combine daylight control with warm evening scenes", "avoid flat overhead-only lighting"],
  furnitureDirection: ["scaled pieces", "tailored storage", "quiet luxury upholstery"],
  commonMistakes: ["using too many finishes", "undersizing furniture", "ignoring lighting layers"],
  relatedRooms: relatedFrom(slug, ["living-room", "kitchen", "bedroom", "master-suite", "home-office", "walk-in-closet", "bathroom", "dining-room"], 3),
  ...profile,
});
});

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
  ["custom", true, ["custom scope", "measurements", "project direction"]],
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
  georgia: {
    intro: "Georgia premium interiors should connect Atlanta-market polish with practical durability for residences, hospitality spaces, offices and developer interiors. CAS AURUM treats design concepts as a low-risk way to clarify material direction, built-in scope and budget logic before fabrication or installation is reviewed.",
    direct: "Georgia is a priority CAS AURUM market for premium design concepts, luxury interiors, custom wall panels, built-ins, closets, kitchens and architectural millwork inquiries.",
    sections: [
      ["Georgia project fit", "The strongest Georgia inquiries usually come from Atlanta, Buckhead, Alpharetta, Sandy Springs, Marietta, Roswell, Milton, Brookhaven, Johns Creek and Savannah projects where custom work needs to feel premium without becoming fragile or overdecorated."],
      ["Design concept value", "A premium design concept gives the client and project team a clear visual and material direction before custom cabinetry, wall panels, furniture or millwork are priced in detail. It helps separate serious project intent from general inspiration browsing."],
      ["Useful project inputs", "A useful Georgia design concept request should include city or ZIP code, room photos, rough dimensions, ceiling height, target materials, inspiration images, desired scope and the level of realization needed after the concept."],
      ["High-intent Georgia scopes", "The strongest organic paths for Georgia should connect design concept searches to luxury kitchens, custom media walls, custom built-ins, luxury closets, wall panels, custom furniture and architectural millwork."],
    ],
  },
  atlanta: {
    intro: "Atlanta luxury interiors need to balance Southern warmth with disciplined architectural detailing: custom cabinetry that feels built into the home, wall panels that improve proportion, and material choices that hold up in busy family, hospitality and developer spaces.",
    direct: "Atlanta is CAS AURUM's priority Georgia market for custom cabinetry, wall panels, built-ins, closets, kitchens and architectural millwork inquiries.",
    sections: [
      ["Atlanta project fit", "The strongest Atlanta inquiries usually involve Buckhead residences, Sandy Springs and Alpharetta homes, developer interiors, boutique hospitality, restaurants, offices or high-end remodels where standard cabinetry would look too thin. CAS AURUM reviews drawings, room photos, measurements, material direction and budget range before recommending a practical custom path."],
      ["What matters locally", "Atlanta projects often need durable luxury: finishes that survive daily use, storage that feels architectural, and warm materials that do not turn a refined home into a cold showroom. Walnut, oak, natural stone, textured panels, concealed lighting and restrained champagne metal details tend to work well when the proportions are controlled."],
	      ["Useful project inputs for designers", "A valuable Atlanta design request should include the property area, room dimensions, ceiling height, appliance or AV requirements, desired storage, inspiration images, and whether the scope is cabinetry, a TV wall, wall panels, closets, vanities, a kitchen or a full millwork package."],
	      ["High-intent Atlanta scopes", "The strongest organic landing paths for Atlanta should connect luxury interior design searches to custom media walls, custom built-ins, luxury closets, wall panels and architectural millwork. These are the scopes most likely to turn style research into a project inquiry."],
	    ],
	  },
  miami: {
    intro: "Miami interiors reward clean drama: stone, glass, dark wood, integrated lighting and custom storage that can feel glamorous without becoming loud. The climate, daylight and entertainment lifestyle make material selection and lighting control especially important.",
    direct: "Miami inquiries are best suited to villas, condos, penthouses, dressing rooms, TV walls, kitchens and hospitality-inspired interiors where custom surfaces and built-ins create a polished technical scope.",
    sections: [
      ["Miami project fit", "A Miami project request should clarify whether the space is a waterfront residence, condo, villa, private lounge, dressing room, kitchen, media wall or hospitality interior. Humidity, daylight, reflection, maintenance and evening lighting scenes should be discussed before choosing high-gloss, stone, veneer or glass-heavy directions."],
      ["Design value", "The best Miami interiors usually avoid generic white-box luxury. A stronger direction uses custom wall composition, concealed storage, integrated LEDs, glass display zones, stone back panels and technical hardware decisions that make the room feel designed rather than simply decorated."],
	      ["What to send", "Send plan dimensions, wall photos, ceiling height, condo or building constraints, desired storage, lighting intent, stone or veneer references, and a target budget range. That lets CAS AURUM respond with a realistic project path instead of a vague moodboard."],
	      ["Best-fit Miami scopes", "Miami projects often make sense for custom media walls, dressing galleries, walk-in closets, hospitality wall panels and custom built-ins. Those scopes usually begin with a real room, a storage need, a lighting plan or a material decision rather than loose inspiration browsing."],
	    ],
	  },
  "new-york": {
    intro: "New York interiors depend on precision: small tolerances, vertical storage, quiet luxury materials and built-ins that make apartments, townhouses and penthouses feel composed rather than crowded.",
    direct: "New York is a strong concept and coordination market for custom built-ins, wall systems, closets, media walls and refined cabinetry where every inch needs a clear purpose.",
    sections: [
      ["New York project fit", "The most useful New York scopes are usually apartments, townhouses, penthouses, private offices, wardrobes, libraries and living rooms where storage, wall composition and lighting need to work inside tight architectural limits."],
      ["Planning priorities", "Before finishes are discussed, the technical review should settle wall length, elevator or access constraints, ceiling height, radiator or HVAC conflicts, AV locations, door swings and whether the goal is concealed storage, display, acoustic comfort or a stronger architectural focal wall."],
	      ["Material direction", "New York quiet luxury often works best with limestone, walnut, smoked oak, warm lacquer, fabric panels and very restrained metal lines. The value is not excess decoration; it is proportion, joinery logic, lighting discipline and fewer visible compromises."],
	      ["High-intent New York scopes", "New York demand should be connected to built-ins, wardrobes, media walls, libraries, storage walls and wall systems. These are practical high-value searches because space constraints make custom work easier to justify."],
	    ],
	  },
  chicago: {
    intro: "Chicago interiors can carry stronger architectural rhythm: panel grids, dining room symmetry, office millwork, built-in storage and subtle Art Deco references translated into a calmer contemporary language.",
    direct: "Chicago inquiries are a good fit for architectural wall panels, dining rooms, home offices, libraries, custom furniture and millwork packages that need structure, warmth and long-term durability.",
    sections: [
      ["Chicago project fit", "Chicago projects often benefit from custom wall panels, built-in libraries, dining storage, office millwork, media walls and residential cabinetry that respects older architectural bones while making the interior feel current."],
      ["What matters locally", "A good Chicago concept should consider winter light, layered evening lighting, durable finishes, strong proportions and whether the interior should lean modern, Art Deco, quiet luxury or warm contemporary. The result should feel substantial, not trendy."],
      ["Useful project inputs", "Send photos of the existing trim and openings, wall measurements, ceiling height, preferred wood tone, lighting goals, room function and any historic details that should be preserved or simplified. This helps avoid a design that fights the architecture."],
    ],
	  },
	  "beverly-hills": {
	    intro: "Beverly Hills luxury interiors need privacy, exact finish quality and a one-of-one feeling: dressing rooms, salon walls, custom vanities, bespoke furniture and private office millwork should feel tailored rather than catalog-selected.",
	    direct: "Beverly Hills is a strong CAS AURUM concept market for bespoke furniture, luxury custom closets, dressing rooms, salon wall panels, media walls and private residence millwork.",
	    sections: [
	      ["Beverly Hills project fit", "The strongest Beverly Hills inquiries usually involve estate homes, private dressing rooms, formal salons, luxury bedroom suites and private offices where finish quality, symmetry, concealed storage and visual restraint matter as much as the headline style."],
	      ["What matters locally", "A Beverly Hills concept should protect privacy, avoid overexposed luxury cliches and specify materials carefully. Limestone, champagne brass, walnut, leather, lacquer, glass and integrated lighting can work well when the palette stays edited and the detailing feels quiet."],
	      ["High-intent Beverly Hills scopes", "The best commercial SEO paths are luxury custom closets, bespoke furniture, custom media walls, salon wall panels, custom vanities and private office built-ins. These scopes match affluent residential search behavior better than generic interior inspiration alone."],
	      ["What to send", "Send room photos or plans, rough dimensions, property type, privacy requirements, desired materials, storage needs, target timeline and investment range. For designer-led projects, elevations and finish schedules are especially useful."],
	    ],
	  },
	  "palm-beach": {
	    intro: "Palm Beach luxury interiors need elegance without coastal cliche: bright rooms, restrained color, durable finishes, custom furniture, wall panels, closets and hospitality-grade millwork that survive sun, humidity and entertaining.",
	    direct: "Palm Beach is a strong CAS AURUM concept market for wall panels, custom furniture, closets, guest suites, media walls and boutique hospitality millwork.",
	    sections: [
	      ["Palm Beach project fit", "The strongest Palm Beach inquiries usually involve coastal estates, villas, formal living rooms, guest suites, boutique hospitality spaces and refined remodels where light, humidity, maintenance and entertaining shape the custom scope."],
	      ["What matters locally", "Palm Beach projects should balance brightness with material discipline. Light oak, limestone, woven textures, stone-look panels, brass details and soft lacquer can feel elevated when the palette avoids generic beach-house styling."],
	      ["High-intent Palm Beach scopes", "The best organic paths should point toward custom wall panels, luxury closets, custom furniture, guest suite built-ins, media walls and hospitality millwork. These terms carry stronger project intent than broad decor searches."],
	      ["What to send", "Send photos, dimensions, ceiling height, property type, sun exposure notes, material references, storage needs, hospitality or guest-suite requirements, timeline and budget range."],
	    ],
	  },
};

const cityProfiles = {
  georgia: {
    propertyMix: "Atlanta-area residences, Buckhead homes, Alpharetta family houses, Savannah properties, boutique hospitality, offices and developer interiors",
    designMood: "premium, warm, durable and architecturally resolved",
    constraints: "regional spread, remodel phasing, family use, hospitality durability and the need to clarify concept direction before custom fabrication",
    materials: ["walnut", "white oak", "natural stone", "textured wall panels", "champagne brass"],
    scopes: ["design concepts", "luxury kitchens", "media walls", "built-ins", "closets", "architectural millwork"],
  },
  atlanta: {
    propertyMix: "Buckhead residences, Sandy Springs remodels, Alpharetta family homes, boutique hospitality and developer interiors",
    designMood: "warm, substantial and quietly polished",
    constraints: "daily family use, mixed traditional and contemporary architecture, remodel phasing and the need for durable luxury",
    materials: ["walnut", "white oak", "natural stone", "textured panels", "champagne metal"],
    scopes: ["custom kitchens", "built-ins", "TV walls", "closets", "wall panels", "developer packages"],
  },
  miami: {
    propertyMix: "waterfront condos, villas, penthouses, dressing rooms, private lounges and hospitality interiors",
    designMood: "clean, glamorous and evening-ready without becoming loud",
    constraints: "humidity, strong daylight, reflective surfaces, condo access rules and entertainment-focused layouts",
    materials: ["stone slabs", "glass", "dark wood", "lacquer", "integrated LED lighting"],
    scopes: ["media walls", "dressing galleries", "kitchens", "hospitality panels", "custom storage"],
  },
  "new-york": {
    propertyMix: "apartments, townhouses, penthouses, private offices, libraries and compact luxury residences",
    designMood: "precise, edited and storage-smart",
    constraints: "tight dimensions, elevator access, radiator or HVAC conflicts, strict tolerances and the value of every inch",
    materials: ["limestone", "walnut", "smoked oak", "warm lacquer", "fabric panels"],
    scopes: ["built-ins", "wardrobes", "libraries", "media walls", "wall systems"],
  },
  chicago: {
    propertyMix: "historic homes, dining rooms, home offices, libraries, condos and premium commercial interiors",
    designMood: "architectural, structured and warm",
    constraints: "winter light, older architectural bones, stronger proportions and long-term durability",
    materials: ["oak", "walnut", "stone", "dark metal", "upholstered panels"],
    scopes: ["panel grids", "office millwork", "dining storage", "libraries", "media walls"],
  },
  charlotte: {
    propertyMix: "new-build residences, family homes, golf-community houses, offices and refined remodels",
    designMood: "fresh, livable and tailored",
    constraints: "balancing resale-friendly luxury with enough custom detail to avoid builder-grade sameness",
    materials: ["white oak", "walnut", "soft stone", "matte lacquer", "linen textures"],
    scopes: ["custom built-ins", "kitchens", "closets", "living room panels", "office storage"],
  },
  nashville: {
    propertyMix: "modern farmhouses, music-industry homes, entertaining spaces, restaurants and boutique hospitality",
    designMood: "warm, social and material-rich",
    constraints: "keeping hospitality energy refined rather than themed, with acoustic comfort and durable surfaces",
    materials: ["walnut", "oak", "leather", "textured acoustic panels", "dark metal"],
    scopes: ["restaurant panels", "home bars", "media rooms", "built-ins", "hospitality millwork"],
  },
  houston: {
    propertyMix: "large family homes, estate remodels, executive offices, luxury kitchens and developer interiors",
    designMood: "generous, practical and quietly expensive",
    constraints: "large room scale, heat, maintenance, storage expectations and broad open-plan layouts",
    materials: ["stone", "walnut", "oak veneer", "matte lacquer", "brass details"],
    scopes: ["kitchens", "wall panels", "closets", "office interiors", "built-in storage"],
  },
  dallas: {
    propertyMix: "luxury residences, formal dining rooms, executive offices, high-end remodels and commercial lobbies",
    designMood: "crisp, confident and polished",
    constraints: "avoiding over-decoration while giving large rooms enough architectural weight",
    materials: ["dark oak", "marble-look surfaces", "walnut", "matte black", "champagne brass"],
    scopes: ["custom furniture", "office millwork", "dining walls", "media walls", "premium cabinetry"],
  },
  "los-angeles": {
    propertyMix: "hillside homes, modern villas, entertainment residences, kitchens, closets and gallery-like living rooms",
    designMood: "soft, cinematic and indoor-outdoor aware",
    constraints: "daylight control, open plans, view corridors, seismic or remodel constraints and a high visual bar",
    materials: ["pale oak", "travertine", "limestone", "warm lacquer", "soft upholstery"],
    scopes: ["custom closets", "media walls", "kitchens", "bedroom suites", "built-ins"],
  },
  "beverly-hills": {
    propertyMix: "estate homes, private dressing rooms, formal salons, luxury bedroom suites and one-of-one residences",
    designMood: "refined, private and jewel-like",
    constraints: "high expectations for finish quality, privacy, symmetry, hidden storage and quiet material drama",
    materials: ["limestone", "champagne brass", "walnut", "leather", "high-end lacquer"],
    scopes: ["bespoke furniture", "dressing rooms", "salon walls", "custom vanities", "private office millwork"],
  },
  "palm-beach": {
    propertyMix: "coastal estates, villas, formal living rooms, guest suites and boutique hospitality spaces",
    designMood: "bright, elegant and coastal without cliche",
    constraints: "humidity, sunlight, entertaining, maintenance and the need for restrained color discipline",
    materials: ["limestone", "light oak", "woven textures", "brass", "stone-look panels"],
    scopes: ["wall panels", "custom furniture", "closets", "guest suites", "hospitality millwork"],
  },
  scottsdale: {
    propertyMix: "desert villas, golf homes, spa rooms, outdoor-connected living areas and luxury remodels",
    designMood: "mineral, warm and sculptural",
    constraints: "strong sun, dust, indoor-outdoor transitions, stone-heavy architecture and evening lighting scenes",
    materials: ["travertine", "warm oak", "matte plaster", "bronze metal", "textured panels"],
    scopes: ["spa rooms", "living room panels", "custom vanities", "closets", "entry walls"],
  },
  seattle: {
    propertyMix: "modern homes, lake houses, offices, libraries, kitchens and compact urban residences",
    designMood: "calm, functional and natural",
    constraints: "grey daylight, storage needs, moisture awareness and making modern rooms feel warm",
    materials: ["oak", "walnut", "matte stone", "acoustic panels", "soft black metal"],
    scopes: ["office built-ins", "kitchens", "libraries", "media walls", "wood panels"],
  },
  "san-francisco": {
    propertyMix: "city homes, condos, townhouses, tech executive residences and compact premium remodels",
    designMood: "edited, intelligent and material-conscious",
    constraints: "narrow footprints, strict access, storage efficiency, daylight shifts and avoiding visual clutter",
    materials: ["oak veneer", "limestone", "matte lacquer", "fabric panels", "brushed metal"],
    scopes: ["built-ins", "closets", "home offices", "kitchens", "wall systems"],
  },
  toronto: {
    propertyMix: "condos, townhomes, custom homes, executive lounges, kitchens and boutique commercial interiors",
    designMood: "cosmopolitan, warm and restrained",
    constraints: "winter light, condo logistics, mixed modern-traditional architecture and the need for durable finishes",
    materials: ["walnut", "stone", "taupe lacquer", "glass", "warm metal"],
    scopes: ["custom furniture", "wall panels", "kitchens", "closets", "executive lounges"],
  },
  vancouver: {
    propertyMix: "view condos, mountain homes, waterfront residences, home offices and calm luxury remodels",
    designMood: "natural, serene and quietly technical",
    constraints: "cloudy daylight, view preservation, moisture-aware materials and calm storage-heavy spaces",
    materials: ["oak", "stone", "soft lacquer", "linen texture", "warm integrated lighting"],
    scopes: ["home offices", "closets", "media walls", "kitchens", "bedroom suites"],
  },
  "mexico-city": {
    propertyMix: "historic residences, contemporary apartments, private lounges, dining rooms and hospitality interiors",
    designMood: "layered, artistic and warm",
    constraints: "balancing historic character with contemporary custom surfaces, lighting atmosphere and artisanal texture",
    materials: ["warm stone", "dark wood", "plaster", "brass", "textured upholstery"],
    scopes: ["salon walls", "dining rooms", "private lounges", "custom furniture", "hospitality millwork"],
  },
};

export const cities = [
  ["georgia", "Georgia", "United States"], ["atlanta", "Atlanta", "United States"], ["miami", "Miami", "United States"], ["new-york", "New York", "United States"], ["chicago", "Chicago", "United States"], ["charlotte", "Charlotte", "United States"], ["nashville", "Nashville", "United States"], ["houston", "Houston", "United States"], ["dallas", "Dallas", "United States"], ["los-angeles", "Los Angeles", "United States"], ["beverly-hills", "Beverly Hills", "United States"], ["palm-beach", "Palm Beach", "United States"], ["scottsdale", "Scottsdale", "United States"], ["seattle", "Seattle", "United States"], ["san-francisco", "San Francisco", "United States"], ["toronto", "Toronto", "Canada"], ["vancouver", "Vancouver", "Canada"], ["mexico-city", "Mexico City", "Mexico"],
].map(([slug, cityName, country]) => {
  const profile = cityProfiles[slug];
  return {
    slug, cityName, country, profile,
    title: tx(`${cityName} Interiors`, `Interiores en ${cityName}`, `Intérieurs à ${cityName}`, `Интерьеры ${cityName}`),
    luxuryContext: tx(cityMarketBriefs[slug]?.intro || `${cityName} projects often reward interiors that feel ${profile.designMood}, with custom details tailored to ${profile.propertyMix} rather than copied from a trend board.`, `Los proyectos en ${cityName} funcionan mejor con interiores precisos, materiales premium y soluciones adaptadas a la propiedad.`, `Les projets à ${cityName} gagnent avec des intérieurs précis, riches en matériaux et adaptés à la propriété.`, `Для ${cityName} особенно важны точность, материалы и решения под конкретную недвижимость.`),
    directSummary: cityMarketBriefs[slug]?.direct,
    marketSections: cityMarketBriefs[slug]?.sections,
    localDesignSignals: [profile.designMood, profile.constraints, profile.scopes.slice(0, 3).join(", ")],
    popularPropertyTypes: ["villa", "penthouse", "private-residence", "luxury-condo"],
    relatedCities: relatedFrom(slug, ["georgia", "atlanta", "miami", "new-york", "chicago", "charlotte", "nashville", "houston", "toronto"], 3),
  };
});

const designConceptMarkets = [
  { slug: "georgia", citySlug: "georgia", locationName: "Georgia", modifier: "premium", h1: "Premium Design Concepts in Georgia" },
  { slug: "georgia/luxury", citySlug: "georgia", locationName: "Georgia", modifier: "luxury", h1: "Luxury Interior Design Concepts in Georgia" },
  { slug: "georgia/premium", citySlug: "georgia", locationName: "Georgia", modifier: "premium", h1: "Premium Interior Design Concepts in Georgia" },
  { slug: "atlanta", citySlug: "atlanta", locationName: "Atlanta", modifier: "premium", h1: "Premium Design Concepts in Atlanta" },
  { slug: "atlanta/luxury", citySlug: "atlanta", locationName: "Atlanta", modifier: "luxury", h1: "Luxury Interior Design Concepts in Atlanta" },
  { slug: "atlanta/premium", citySlug: "atlanta", locationName: "Atlanta", modifier: "premium", h1: "Premium Interior Design Concepts in Atlanta" },
];

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
    projectsSeoLink(locale),
    seoLink(locale, "/collections", l(locale, "collections")),
    seoLink(locale, "/contact", l(locale, "contact")),
  ];
  if (params.citySlug || String(params.pageType || "").startsWith("city")) {
    links.push(...cityCommercialServiceLinks(locale, params.citySlug));
  }
  for (const slug of (params.relatedStyles || []).slice(0, 3)) links.push(seoLink(locale, `/styles/${slug}`, entityLabel(styles, slug, locale)));
  for (const slug of (params.relatedRooms || []).slice(0, 3)) links.push(seoLink(locale, `/rooms/${slug}`, entityLabel(rooms, slug, locale)));
  for (const slug of (params.relatedCollections || []).slice(0, 2)) links.push(seoLink(locale, `/collections/${slug}`, collectionName(slug)));
  return dedupeLinks(links);
}

function cityCommercialServiceLinks(locale, citySlug) {
  const profile = cityProfiles[citySlug] || {};
  const scopes = (profile.scopes || []).join(" ").toLowerCase();
  const keys = [];
  const add = (key) => { if (!keys.includes(key)) keys.push(key); };
  if (/media|tv/.test(scopes)) add("mediaWalls");
  if (/built|librar|office|storage|wall systems|wall system/.test(scopes)) add("builtIns");
  if (/closet|wardrobe|dressing/.test(scopes)) add("customClosets");
  if (/wall|panel|salon/.test(scopes)) add("wallPanels");
  if (/furniture|bespoke/.test(scopes)) add("customFurniture");
  if (/millwork|hospitality|developer|office/.test(scopes)) add("millwork");
  ["mediaWalls", "builtIns", "customClosets"].forEach(add);
  return keys.slice(0, 5).map((key) => coreServiceLink(locale, key));
}

function coreServiceLink(locale, key) {
  const paths = {
    en: { mediaWalls: "/custom-media-walls", builtIns: "/custom-built-ins", customClosets: "/luxury-custom-closets", wallPanels: "/luxury-wall-panels", customFurniture: "/custom-furniture", millwork: "/architectural-millwork" },
    es: { mediaWalls: "/es/muros-media-a-medida", builtIns: "/es/muebles-integrados-a-medida", customClosets: "/es/closets-de-lujo-a-medida", wallPanels: "/es/paneles-de-pared-de-lujo", customFurniture: "/es/muebles-a-medida", millwork: "/es/carpinteria-arquitectonica" },
    fr: { mediaWalls: "/fr/murs-media-sur-mesure", builtIns: "/fr/rangements-integres-sur-mesure", customClosets: "/fr/dressings-de-luxe-sur-mesure", wallPanels: "/fr/panneaux-muraux-de-luxe", customFurniture: "/fr/meubles-sur-mesure", millwork: "/fr/menuiserie-architecturale" },
    ru: { mediaWalls: "/ru/media-steny-na-zakaz", builtIns: "/ru/vstroennaya-mebel-na-zakaz", customClosets: "/ru/lyuksovye-garderobnye-na-zakaz", wallPanels: "/ru/premium-stenovye-paneli", customFurniture: "/ru/mebel-na-zakaz", millwork: "/ru/arhitekturnaya-stolyarka" },
  };
  const labels = {
    en: { mediaWalls: "Custom Media Walls", builtIns: "Custom Built-Ins", customClosets: "Luxury Custom Closets", wallPanels: "Luxury Wall Panels", customFurniture: "Custom Furniture", millwork: "Architectural Millwork" },
    es: { mediaWalls: "Muros media a medida", builtIns: "Muebles integrados", customClosets: "Closets de lujo", wallPanels: "Paneles de lujo", customFurniture: "Muebles a medida", millwork: "Carpinteria arquitectonica" },
    fr: { mediaWalls: "Murs media sur mesure", builtIns: "Rangements integres", customClosets: "Dressings de luxe", wallPanels: "Panneaux de luxe", customFurniture: "Meubles sur mesure", millwork: "Menuiserie architecturale" },
    ru: { mediaWalls: "Media стены на заказ", builtIns: "Встроенная мебель", customClosets: "Люксовые гардеробные", wallPanels: "Люксовые панели", customFurniture: "Мебель на заказ", millwork: "Архитектурная столярка" },
  };
  return { href: paths[locale]?.[key] || paths.en[key], label: labels[locale]?.[key] || labels.en[key] };
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
    base.push(...designConceptMarkets.map((market) => designConceptMarketPage(locale, market)));
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
  const cityStyleTargets = [...styles.slice(0, 6), bySlug(styles, "premium"), bySlug(styles, "luxury")].filter(Boolean);
  for (const city of cities) cityCombos.push({ type: "city-service", city });
  for (const city of cities) for (const style of cityStyleTargets) cityCombos.push({ type: "city-style", city, style });
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
  const h1 = local(room.h1Title, locale) || local(room.title, locale);
  return makePage({
    pageType: "room", locale, path: `/rooms/${room.slug}`, h1, eyebrow: l(locale, "rooms"),
    metaTitle: local(room.metaTitleOverride, locale) || `${h1} | Premium Room Ideas | ${BRAND}`, metaDescription: local(room.metaDescription, locale),
    intro: local(room.intro, locale), directSummary: local(room.directSummary, locale) || directFor(locale, local(room.title, locale), "room"),
    sections: roomSectionsFor(locale, room),
    faq: roomFaqFor(locale, room), breadcrumbs: crumb(locale, [[l(locale, "rooms"), "/rooms"], [h1, `/rooms/${room.slug}`]]),
    relatedRooms: room.relatedRooms, relatedStyles: ["modern", "quiet-luxury", "organic-modern"], relatedCollections: ["forma", "madera"],
    imagePath: roomImage(room.slug), relatedProjects: room.relatedProjects || [], relatedProjectsTitle: local(room.relatedProjectsTitle, locale), relatedProjectsBody: local(room.relatedProjectsBody, locale), allowlisted: true,
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
  const sections = customSections ? [...customSections, ...cityCommercialSections(locale, city)] : standardSections(locale, city.cityName, null, null, null, city);
  return makePage({
    pageType: "city", locale, path: `/cities/${city.slug}`, h1: local(city.title, locale), eyebrow: l(locale, "cities"),
    metaTitle: `${city.cityName} Interior Design Ideas | ${BRAND}`, metaDescription: local(city.luxuryContext, locale),
    intro, directSummary,
    sections,
    faq: faqFor(locale, city.cityName), breadcrumbs: crumb(locale, [[l(locale, "cities"), "/cities"], [city.cityName, `/cities/${city.slug}`]]),
    relatedCities: city.relatedCities, relatedStyles: ["modern", "luxury", "quiet-luxury"], relatedCollections: ["aurum", "signature"],
    imagePath: cityImage(city.slug), allowlisted: true, citySlug: city.slug,
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

function designConceptMarketPage(locale, market) {
  const profile = cityProfiles[market.citySlug] || cityProfiles.georgia;
  const locationName = market.locationName;
  const modifierLabel = market.modifier === "luxury" ? "luxury" : "premium";
  const h1 = locale === "en" ? market.h1 : designConceptMarketH1(locale, market);
  const materialList = profile.materials.join(", ");
  const scopeList = profile.scopes.join(", ");
  return makePage({
    pageType: "design-concept-market",
    locale,
    path: `/design-concepts/${market.slug}`,
    h1,
    eyebrow: "Design Concepts",
    metaTitle: `${h1} | CAS AURUM`,
    metaDescription: `${BRAND} creates ${modifierLabel} interior design concepts for ${locationName} projects: material direction, custom wall panels, built-ins, closets, kitchens, media walls and millwork planning before fabrication review.`,
    intro: `${h1} help turn inspiration into practical project direction before custom fabrication, cabinetry or installation is reviewed. CAS AURUM focuses the concept around room photos, rough dimensions, material direction, storage needs, lighting, budget logic and the next realistic step for ${locationName}.`,
    directSummary: `${locationName} ${modifierLabel} design concepts are useful when a client needs a clear visual and material direction for custom interiors before committing to detailed drawings, fabrication or installation.`,
    sections: designConceptMarketSections(locale, market, profile, materialList, scopeList),
    faq: designConceptMarketFaq(locale, market, profile),
    breadcrumbs: crumb(locale, [[l(locale, "interiors"), "/interiors"], ["Design Concepts", "/design-concepts"], [h1, `/design-concepts/${market.slug}`]]),
    relatedCities: [market.citySlug === "georgia" ? "atlanta" : "georgia", "miami", "new-york"],
    relatedStyles: ["premium", "luxury", "quiet-luxury", "bespoke"],
    relatedRooms: ["living-room", "kitchen", "walk-in-closet", "home-office"],
    relatedCollections: ["aurum", "signature", "forma"],
    imagePath: collectionImage(market.modifier === "luxury" ? "aurum" : "signature"),
    citySlug: market.citySlug,
    allowlisted: true,
    extraLinks: [
      { href: "/design-concept", label: "Fixed-Price Design Concept" },
      { href: market.citySlug === "georgia" ? "/georgia/premium-design-concepts" : "/georgia/atlanta/premium-design-concepts", label: `${locationName} premium design concept inquiry` },
      { href: `/en/cities/${market.citySlug}`, label: `${locationName} interiors` },
      { href: "/en/styles/luxury", label: "Luxury interiors" },
      { href: "/en/styles/premium", label: "Premium interiors" },
    ],
  });
}

function designConceptMarketH1(locale, market) {
  const base = market.modifier === "luxury" ? "Luxury Interior Design Concepts" : "Premium Interior Design Concepts";
  return {
    es: `${base} en ${market.locationName}`,
    fr: `${base} à ${market.locationName}`,
    ru: `${base} in ${market.locationName}`,
  }[locale] || market.h1;
}

function designConceptMarketSections(locale, market, profile, materialList, scopeList) {
  const locationName = market.locationName;
  if (locale !== "en") return standardSections(locale, designConceptMarketH1(locale, market), bySlug(styles, market.modifier), null, null, bySlug(cities, market.citySlug));
  return [
    {
      heading: `${locationName} concept fit`,
      body: `A ${locationName} design concept is strongest for ${profile.propertyMix}. The concept should feel ${profile.designMood}, then translate that feeling into wall composition, storage, furniture scale, material choices and lighting direction.`,
    },
    {
      heading: "Before fabrication or installation",
      body: "The purpose is not to replace final drawings. It is to clarify the visual direction, approximate scope, key materials and decision path before the client invests in detailed technical work, production review or site coordination.",
    },
    {
      heading: "Best-fit custom scopes",
      body: `Relevant CAS AURUM scopes include ${scopeList}. These searches carry stronger project intent than broad decor inspiration because they imply a room, a wall, a storage need or a custom package.`,
    },
    {
      heading: "Material direction",
      body: `Good starting materials include ${materialList}. A premium concept should keep the palette edited so the result feels custom and architectural rather than a generic luxury collage.`,
    },
    {
      heading: "What to send",
      body: `Send photos, rough dimensions, ceiling height, city or ZIP code, room function, target materials, inspiration images and whether the next step should be a basic concept, technical package or realization review.`,
    },
    {
      heading: "Practical answer value",
      body: `${locationName} project guidance should answer practical questions directly: what a premium concept includes, which scopes fit the market, what materials make sense and what CAS AURUM needs before recommending a next step.`,
    },
    {
      heading: "What to clarify early",
      body: `A useful ${locationName} concept should account for property type, light, maintenance, storage, budget range and whether the design is meant for a residence, hospitality space, office or developer interior.`,
    },
  ];
}

function designConceptMarketFaq(locale, market, profile) {
  const locationName = market.locationName;
  if (locale !== "en") return faqFor(locale, designConceptMarketH1(locale, market));
  return [
    { q: `What is included in a ${locationName} premium design concept?`, a: "A useful concept can include visual direction, material mood, wall or furniture composition, basic layout notes, storage priorities, lighting direction and a recommended next step." },
    { q: `Is a design concept the same as fabrication drawings?`, a: "No. A concept is the lower-risk planning step before detailed shop drawings, engineering, production pricing, field measurement or installation coordination." },
    { q: `Which projects fit ${locationName}?`, a: `Relevant scopes include ${profile.scopes.join(", ")} for ${profile.propertyMix}.` },
    { q: "What should I send before requesting a design concept?", a: "Send room photos, rough dimensions, ceiling height, city or ZIP code, target materials, inspiration images, timeline and whether you want concept-only or a path toward realization." },
    { q: "Does CAS AURUM claim a local office or completed project in every city?", a: "No. Market pages are planning guidance unless a page explicitly states a local office, showroom, license or completed project." },
  ];
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
  const profile = combo.city.profile;
  const focus = cityCombinationFocus(combo, locale);
  const materialList = cityMaterialsFor(combo).join(", ");
  return makePage({
    pageType: combo.type, locale, path, h1, eyebrow: l(locale, "cities"),
    metaTitle: `${h1} | ${BRAND}`, metaDescription: `${BRAND} explores ${h1.toLowerCase()} for ${profile.propertyMix}, with ${materialList}, custom furniture, wall panels and architectural planning notes.`,
    intro: `${h1} should respond to ${combo.city.cityName}'s real project context: ${profile.propertyMix}. The useful direction is not just a style label; it should connect ${focus.toLowerCase()}, materials, lighting, storage, access constraints and budget range.`,
    directSummary: `${h1} works best when the concept feels ${profile.designMood}, uses materials such as ${materialList}, and solves local constraints like ${profile.constraints}.`,
    sections: cityCombinationSections(locale, h1, combo),
    faq: cityCombinationFaq(locale, h1, combo), breadcrumbs: crumb(locale, [[l(locale, "cities"), "/cities"], [combo.city.cityName, `/cities/${combo.city.slug}`], [h1, path]]),
    relatedCities: combo.city.relatedCities, relatedStyles: combo.style ? combo.style.relatedStyles : ["modern", "luxury", "quiet-luxury"], relatedRooms: combo.room ? combo.room.relatedRooms : ["living-room", "kitchen"], relatedPropertyTypes: combo.property ? combo.property.relatedPropertyTypes : ["villa", "penthouse"], relatedCollections: ["aurum", "forma", "signature"],
    imagePath: cityImage(combo.city.slug), allowlisted: true, combination: true, citySlug: combo.city.slug,
  });
}

function cityCombinationFocus(combo, locale) {
  if (combo.style) return `${local(combo.style.shortTitle, locale)} detailing`;
  if (combo.room) return `${local(combo.room.shortTitle, locale)} function`;
  if (combo.property) return `${local(combo.property.shortTitle, locale)} expectations`;
  return "luxury interior design direction";
}

function cityMaterialsFor(combo) {
  const materials = [
    ...(combo.style?.materials || []),
    ...(combo.room?.premiumMaterials || []),
    ...(combo.city.profile?.materials || []),
    "integrated lighting",
  ];
  return [...new Set(materials)].slice(0, 7);
}

function cityCombinationSections(locale, subject, combo) {
  const profile = combo.city.profile;
  const focus = cityCombinationFocus(combo, locale);
  const materials = cityMaterialsFor(combo).join(", ");
  const scopes = profile.scopes.join(", ");
  const base = standardSections(locale, subject, combo.style, combo.room, combo.property, combo.city);
  if (locale !== "en") return base;
  return [
    {
      heading: `${combo.city.cityName} project fit`,
      body: `${subject} is strongest for ${profile.propertyMix}. A useful concept should feel ${profile.designMood}, then translate that mood into specific decisions about surfaces, storage, furniture scale and lighting scenes.`,
    },
    {
      heading: "Local planning constraints",
      body: `The planning notes should account for ${profile.constraints}. These details change the best panel thickness, finish durability, hardware choice, lighting placement and how much built-in storage belongs in the room.`,
    },
	    {
	      heading: "Best-fit custom scopes",
	      body: `The most relevant CAS AURUM scopes for this market include ${scopes}. The page is written as planning guidance, not as a claim of a local showroom, local office or completed project in every city.`,
	    },
	    {
	      heading: "Commercial project paths",
		      body: `${combo.city.cityName} visitors with real project intent should be routed toward concrete scopes such as custom media walls, custom built-ins, luxury closets, wall panels, custom furniture and architectural millwork. These pages help move broad design research into consultation notes with photos, dimensions, budget range and timeline.`,
	    },
	    {
	      heading: "Material strategy",
      body: `${subject} can use ${materials}, but the palette should be edited. The goal is a material story that fits ${combo.city.cityName}, supports ${focus.toLowerCase()} and avoids a generic luxury look that could belong anywhere.`,
    },
    {
      heading: "What to send before a concept",
      body: `Send room photos, wall dimensions, ceiling height, property type, city or ZIP code, inspiration images, target materials, budget range, timeline and whether the scope is furniture, panels, cabinetry, closets, kitchen work or a larger millwork package.`,
    },
    {
      heading: "What to clarify early",
      body: `A stronger ${combo.city.cityName} project starts with local context: property mix, light, logistics, maintenance, storage needs and the architectural role of custom elements.`,
    },
    ...base.slice(2, 5),
	  ];
	}

function cityCommercialSections(locale, city) {
  if (locale !== "en") return [];
  const scopes = city.profile?.scopes || [];
  const scopeText = scopes.join(", ");
  return [
    {
      heading: `${city.cityName} custom scope priorities`,
      body: `For organic traffic, ${city.cityName} should not only rank for broad luxury interior design terms. The page should guide qualified visitors toward concrete CAS AURUM scopes: ${scopeText}, custom media walls, custom built-ins, luxury closets, wall panels, custom furniture and architectural millwork.`,
    },
    {
	      heading: "From search query to consultation notes",
	      body: `A useful ${city.cityName} inquiry should include room photos, rough dimensions, ceiling height, property type, city or ZIP code, desired service, material references, budget range and timeline. This helps separate serious project leads from general inspiration browsing.`,
    },
  ];
}

function roomSectionsFor(locale, room) {
  if (room.sections?.[locale]) return withRoomSupplementSections(locale, room, room.sections[locale].map(([heading, body]) => ({ heading, body })));
  const subject = local(room.title, locale);
  const materials = dedupeMaterials(room.premiumMaterials || roomMaterials(room.slug)).join(", ");
  const content = {
    bathroom: {
      en: [
        ["The bathroom as a daily ritual space", "A refined bathroom should make daily routines feel calm: dry and wet zones, towel access, mirror use, storage and cleaning all need to be planned before finishes are selected."],
        ["Stone, tile, vanity and mirror composition", "Stone slabs, tile rhythm, vanity proportions and mirror scale should read as one composition rather than separate purchases."],
        ["Custom vanities and concealed storage", "A strong vanity solves drawers, outlets, grooming tools, towels and cleaning items without making the room feel visually heavy."],
        ["Lighting, moisture and durability", "Mirror lighting, ambient light, ventilation awareness, moisture-resistant substrates and durable surfaces matter as much as the visible stone."],
        ["Materials that hold up", `Useful directions include ${materials}. The right palette should balance mineral depth, warmth, grip, maintenance and water exposure.`],
        ["Common mistakes", "Avoid weak mirror lighting, fragile grout choices, no closed storage, ignoring ventilation, or choosing stone before the vanity and wet-zone details are understood."],
      ],
      es: [
        ["El baño como ritual diario", "Un baño refinado debe ordenar rutinas: zonas seca y húmeda, toallas, espejo, almacenamiento y limpieza se planifican antes de elegir acabados."],
        ["Composición de piedra, tile, vanity y espejo", "Losas, ritmo de tile, proporción del vanity y escala del espejo deben leerse como una sola composición."],
        ["Vanities a medida y almacenamiento oculto", "Un buen vanity resuelve cajones, tomas, herramientas de grooming, toallas y limpieza sin verse pesado."],
        ["Iluminación, humedad y durabilidad", "Luz en espejo, ambiente, ventilación, sustratos resistentes y superficies durables importan tanto como la piedra visible."],
        ["Materiales resistentes", `Direcciones útiles incluyen ${materials}. La paleta debe equilibrar profundidad mineral, calidez, agarre, mantenimiento y exposición al agua.`],
        ["Errores comunes", "Evite luz débil en espejo, grout frágil, falta de almacenamiento cerrado, ignorar ventilación o elegir piedra antes de resolver vanity y zona húmeda."],
      ],
      fr: [
        ["La salle de bain comme rituel quotidien", "Une salle de bain raffinée organise les routines : zones sèche et humide, serviettes, miroir, rangement et entretien avant les finitions."],
        ["Composition pierre, carrelage, vasque et miroir", "Dalles, rythme du carrelage, proportions du meuble vasque et échelle du miroir doivent former une seule composition."],
        ["Meubles vasques et rangement caché", "Un bon meuble résout tiroirs, prises, accessoires, serviettes et entretien sans alourdir la pièce."],
        ["Lumière, humidité et durabilité", "Lumière du miroir, ambiance, ventilation, supports résistants et surfaces durables comptent autant que la pierre visible."],
        ["Matières durables", `Les directions utiles incluent ${materials}. La palette doit équilibrer profondeur minérale, chaleur, adhérence, entretien et eau.`],
        ["Erreurs fréquentes", "Évitez une lumière miroir faible, des joints fragiles, aucun rangement fermé, la ventilation oubliée ou la pierre choisie avant la logique de vasque."],
      ],
      ru: [
        ["Ванная как ежедневный ритуал", "Хорошая ванная упорядочивает рутину: сухая и влажная зоны, полотенца, зеркало, хранение и уборка планируются до выбора отделок."],
        ["Композиция камня, плитки, тумбы и зеркала", "Слэбы, ритм плитки, пропорции тумбы и масштаб зеркала должны читаться как единая композиция."],
        ["Тумбы на заказ и скрытое хранение", "Сильная тумба решает ящики, розетки, grooming-предметы, полотенца и бытовую химию без визуальной тяжести."],
        ["Свет, влажность и долговечность", "Свет у зеркала, фоновый сценарий, вентиляция, влагостойкие основы и прочные поверхности важны не меньше видимого камня."],
        ["Материалы для ежедневной нагрузки", `Подходящие направления: ${materials}. Палитра должна учитывать глубину камня, тепло, сцепление, уход и контакт с водой.`],
        ["Частые ошибки", "Избегайте слабого света у зеркала, неудачной затирки, отсутствия закрытого хранения, игнорирования вентиляции и выбора камня до логики тумбы."],
      ],
    },
    "living-room": {
      en: [
        ["The living room as the main architectural statement", "The living room often carries the clearest public identity of the home, so the focal wall, seating and lighting should be planned as one room-wide composition."],
        ["Media walls, fireplaces and built-ins", "A TV wall or fireplace wall needs architecture around it: storage, reveals, panels, stone, display zones, cable planning and enough restraint."],
        ["Seating, circulation and focal points", "Sofas, lounge chairs and tables should support conversation, view lines and movement instead of being pushed flat against every wall."],
        ["Materials and lighting for daily life", `Materials such as ${materials} can create depth when paired with dimmable ambient light, accents and evening scenes.`],
        ["Display and acoustic balance", "Open shelves, closed cabinets, fabric, panels and rugs help balance display, storage and sound so the room does not feel hollow."],
        ["Common mistakes", "Avoid a TV wall without architecture, furniture pushed to the perimeter, too many finishes, no dimming, and storage that arrives after the room is furnished."],
      ],
      es: [
        ["La sala como declaración arquitectónica", "La sala suele expresar la identidad pública de la casa; muro focal, asientos y luz deben planificarse como una composición completa."],
        ["Media walls, chimeneas y built-ins", "Un muro de TV o chimenea necesita arquitectura: almacenamiento, juntas, paneles, piedra, zonas de exhibición, cables y contención."],
        ["Asientos, circulación y focos", "Sofás, butacas y mesas deben apoyar conversación, vistas y movimiento, no quedar pegados a todas las paredes."],
        ["Materiales y luz para uso diario", `Materiales como ${materials} dan profundidad con luz ambiental regulable, acentos y escenas nocturnas.`],
        ["Exhibición y acústica", "Estantes, puertas cerradas, textiles, paneles y alfombras equilibran display, almacenamiento y sonido."],
        ["Errores comunes", "Evite TV wall sin arquitectura, muebles en el perímetro, demasiados acabados, falta de dimming y almacenamiento planeado tarde."],
      ],
      fr: [
        ["Le salon comme déclaration architecturale", "Le salon porte souvent l'identité publique de la maison; mur focal, assises et lumière doivent former une composition d'ensemble."],
        ["Media walls, cheminées et intégrés", "Un mur TV ou cheminée demande une architecture : rangement, joints, panneaux, pierre, zones d'exposition, câbles et retenue."],
        ["Assises, circulation et focales", "Canapés, fauteuils et tables doivent soutenir conversation, vues et mouvement plutôt que longer tous les murs."],
        ["Matières et lumière du quotidien", `Des matières comme ${materials} créent de la profondeur avec lumière graduable, accents et scènes du soir.`],
        ["Exposition et acoustique", "Étagères, portes fermées, textiles, panneaux et tapis équilibrent exposition, rangement et son."],
        ["Erreurs fréquentes", "Évitez un mur TV sans architecture, mobilier repoussé aux murs, trop de finitions, aucune gradation et rangement pensé trop tard."],
      ],
      ru: [
        ["Гостиная как главный архитектурный акцент", "Гостиная часто задает публичное лицо дома, поэтому фокусная стена, посадка и свет должны планироваться как единая композиция."],
        ["Media walls, камины и встроенные решения", "TV-стене или каминной стене нужна архитектура: хранение, стыки, панели, камень, витрины, кабели и сдержанность."],
        ["Посадка, движение и фокусные точки", "Диваны, кресла и столы должны поддерживать разговор, виды и проходы, а не просто стоять вдоль стен."],
        ["Материалы и свет для жизни", `Материалы вроде ${materials} дают глубину вместе с диммируемым фоновым светом, акцентами и вечерними сценариями.`],
        ["Витрины, хранение и акустика", "Открытые полки, закрытые шкафы, ткани, панели и ковры помогают сбалансировать display, хранение и звук."],
        ["Частые ошибки", "Избегайте TV-стены без архитектуры, мебели по периметру, слишком многих отделок, отсутствия диммирования и позднего планирования хранения."],
      ],
    },
    kitchen: {
      en: [
        ["The kitchen as a functional architectural centerpiece", "A premium kitchen should coordinate cooking, storage, movement and visual weight before the finish palette is finalized."],
        ["Custom cabinetry, islands, panels and storage", "CAS AURUM is best suited to cabinetry, islands, panels, storage logic and finish carpentry that make the kitchen feel integrated."],
        ["Stone, wood, hardware and lighting coordination", `Materials such as ${materials} need to be selected together so counters, doors, panels, pulls and light temperature do not fight each other.`],
        ["How CAS AURUM supports kitchen environments", "Kitchen support may include custom cabinetry direction, finish panels, island detailing, storage planning and coordination with designers, builders or kitchen contractors."],
        ["Planning priorities", "Appliance clearances, drawer access, island size, pantry needs, outlets, task light and maintenance should be settled before decorative decisions."],
        ["Common mistakes", "Avoid choosing finishes separately, oversized islands, poor appliance planning, cold lighting and storage that ignores how the household actually cooks."],
      ],
      es: [
        ["La cocina como centro funcional", "Una cocina premium coordina cocina, almacenamiento, movimiento y peso visual antes de cerrar acabados."],
        ["Cabinetry, islas, paneles y almacenamiento", "CAS AURUM encaja mejor en cabinetry, islas, paneles, lógica de storage y carpintería de acabado integrada."],
        ["Piedra, madera, herrajes y luz", `Materiales como ${materials} se eligen juntos para que cubiertas, puertas, paneles, pulls y temperatura de luz no compitan.`],
        ["Cómo CAS AURUM apoya cocinas", "El soporte puede incluir dirección de cabinetry, paneles, detalle de isla, storage y coordinación con diseñadores, builders o contratistas de cocina."],
        ["Prioridades de planificación", "Electrodomésticos, cajones, tamaño de isla, pantry, tomas, task light y mantenimiento se definen antes de lo decorativo."],
        ["Errores comunes", "Evite elegir acabados separados, islas sobredimensionadas, mala planificación de appliances, luz fría y almacenamiento que ignora el uso real."],
      ],
      fr: [
        ["La cuisine comme centre fonctionnel", "Une cuisine premium coordonne cuisson, rangement, mouvement et poids visuel avant de figer les finitions."],
        ["Cabinetry, îlots, panneaux et rangement", "CAS AURUM convient surtout à la cabinetry, aux îlots, panneaux, logique de rangement et menuiserie de finition intégrée."],
        ["Pierre, bois, quincaillerie et lumière", `Des matières comme ${materials} se choisissent ensemble pour éviter les conflits entre plans, portes, panneaux, poignées et température de lumière.`],
        ["Comment CAS AURUM accompagne les cuisines", "L'accompagnement peut inclure cabinetry, panneaux, détail d'îlot, rangement et coordination avec designers, constructeurs ou cuisinistes."],
        ["Priorités de planification", "Électroménager, tiroirs, taille de l'îlot, pantry, prises, task light et entretien se règlent avant le décor."],
        ["Erreurs fréquentes", "Évitez les finitions choisies séparément, îlots trop grands, électroménager mal prévu, lumière froide et rangement déconnecté de l'usage."],
      ],
      ru: [
        ["Кухня как функциональный архитектурный центр", "Премиальная кухня согласует готовку, хранение, движение и визуальный вес до финального выбора отделок."],
        ["Корпусная мебель, острова, панели и хранение", "CAS AURUM лучше всего подходит для cabinetry, островов, панелей, логики хранения и финишной столярки, которые интегрируют кухню в дом."],
        ["Камень, дерево, фурнитура и свет", `Материалы вроде ${materials} выбираются вместе, чтобы столешницы, фасады, панели, ручки и температура света не спорили.`],
        ["Как CAS AURUM поддерживает кухни", "Поддержка может включать направление cabinetry, панели, деталировку острова, хранение и координацию с дизайнерами, строителями или кухонными подрядчиками."],
        ["Приоритеты планирования", "Техника, доступ к ящикам, размер острова, pantry, розетки, рабочий свет и уход решаются до декоративных решений."],
        ["Частые ошибки", "Избегайте раздельного выбора отделок, слишком больших островов, слабого планирования техники, холодного света и хранения без связи с реальной готовкой."],
      ],
    },
    "walk-in-closet": {
      en: [
        ["The walk-in closet as a private boutique", "A luxury closet should feel composed and easy to use, with display, closed storage and daily routines planned around the actual wardrobe."],
        ["Custom wardrobe systems and storage logic", "Inventory comes first: long hanging, short hanging, shoes, bags, jewelry, watches, seasonal storage, drawers and luggage all need a place."],
        ["Lighting, mirrors, glass and display zones", "LED lighting, mirror placement, glass doors, open display and task light help the closet feel like a boutique without losing function."],
        ["Materials and hardware", `Directions such as ${materials} work well when hardware, drawer interiors, glass tone and light temperature are coordinated.`],
        ["Island storage and seating", "Where space allows, an island or bench can organize accessories, folding, packing and the transition between dressing and bedroom."],
        ["Common mistakes", "Avoid planning shelves before inventory, weak lighting, no seasonal storage, poor drawer divisions and glass display that exposes clutter."],
      ],
      es: [
        ["El vestidor como boutique privada", "Un closet de lujo debe sentirse compuesto y fácil de usar, con display, almacenamiento cerrado y rutinas basadas en el guardarropa real."],
        ["Sistemas wardrobe y lógica de storage", "Primero va el inventario: colgado largo y corto, zapatos, bolsas, joyería, relojes, temporada, cajones y maletas."],
        ["Luz, espejos, vidrio y display", "LED, espejos, puertas de vidrio, display abierto y task light crean atmósfera boutique sin perder función."],
        ["Materiales y herrajes", `Direcciones como ${materials} funcionan cuando herrajes, interiores de cajón, tono de vidrio y temperatura de luz se coordinan.`],
        ["Isla y asiento", "Si hay espacio, una isla o banco organiza accesorios, doblado, empaque y transición entre vestidor y dormitorio."],
        ["Errores comunes", "Evite planear repisas antes del inventario, luz débil, sin storage de temporada, divisiones pobres y vidrio que muestra desorden."],
      ],
      fr: [
        ["Le dressing comme boutique privée", "Un dressing luxe doit être composé et facile à utiliser, avec exposition, rangement fermé et routines pensées selon la garde-robe réelle."],
        ["Systèmes de rangement et logique d'usage", "L'inventaire d'abord : penderie longue et courte, chaussures, sacs, bijoux, montres, saisonnier, tiroirs et bagages."],
        ["Lumière, miroirs, verre et exposition", "LED, miroirs, portes vitrées, exposition ouverte et lumière de tâche créent l'esprit boutique sans perdre la fonction."],
        ["Matières et quincaillerie", `Des directions comme ${materials} fonctionnent si quincaillerie, intérieurs de tiroirs, teinte du verre et lumière sont coordonnés.`],
        ["Îlot et assise", "Si l'espace le permet, un îlot ou banc organise accessoires, pliage, valises et transition avec la chambre."],
        ["Erreurs fréquentes", "Évitez les étagères avant l'inventaire, lumière faible, aucun rangement saisonnier, tiroirs mal divisés et verre qui expose le désordre."],
      ],
      ru: [
        ["Гардеробная как приватный бутик", "Люксовая гардеробная должна быть собранной и удобной: витрины, закрытое хранение и ежедневные сценарии строятся вокруг реального гардероба."],
        ["Системы хранения и логика инвентаря", "Сначала инвентарь: длинное и короткое хранение, обувь, сумки, украшения, часы, сезонные вещи, ящики и чемоданы."],
        ["Свет, зеркала, стекло и display-зоны", "LED-подсветка, зеркала, стеклянные двери, открытые зоны и рабочий свет создают boutique-ощущение без потери функции."],
        ["Материалы и фурнитура", `Направления вроде ${materials} работают, когда фурнитура, внутренности ящиков, тон стекла и температура света согласованы.`],
        ["Остров и посадка", "Если площадь позволяет, остров или банкетка помогают с аксессуарами, складыванием, упаковкой и переходом между гардеробной и спальней."],
        ["Частые ошибки", "Не планируйте полки до инвентаря, избегайте слабого света, отсутствия сезонного хранения, плохих разделителей и стекла, показывающего беспорядок."],
      ],
    },
    "master-suite": {
      en: [
        ["The master suite as a private sequence", "A strong master suite connects sleeping, dressing and bathing as one private rhythm, with each threshold, door swing and lighting scene planned deliberately."],
        ["Best project types", "The best inquiries include bedroom headboard walls, dressing rooms, custom wardrobes, bathroom vanities, linen storage, wall panels and connected material palettes."],
        ["Materials and finishes", `Materials such as ${materials} can connect the suite when the palette shifts subtly from bedroom softness to closet display and bathroom durability.`],
        ["Lighting strategy", "Suite lighting should support reading, nighttime movement, wardrobe selection, mirror use and bathing without making the private rooms feel like a showroom."],
        ["Storage, millwork and furniture", "Wardrobes, vanities, nightstands, benches and built-ins should share a logic of proportion, hardware and finish so the suite feels designed as one experience."],
        ["Planning notes", "Plan privacy, circulation, door swings, two-person routines, closet inventory, vanity use, blackout control and the transition between soft bedroom materials and wet-zone durability."],
        ["Investment signals", "Investment rises with the number of connected rooms, custom wardrobes, stone, vanities, lighting control, wall paneling, finish continuity and trade coordination."],
        ["Common mistakes", "Avoid designing the bedroom, closet and bathroom separately, using unrelated materials, underplanning storage, ignoring night movement or treating the suite as only a larger bedroom."],
      ],
      es: [
        ["La master suite como secuencia privada", "Una master suite fuerte conecta dormir, vestirse y bañarse con umbrales, puertas y escenas de luz planificados."],
        ["Mejores tipos de proyecto", "Encajan cabeceros, vestidores, wardrobes a medida, vanities, linen storage, paneles y paletas conectadas."],
        ["Materiales y acabados", `Materiales como ${materials} conectan la suite cuando la paleta cambia con sutileza entre dormitorio, vestidor y baño.`],
        ["Estrategia de iluminación", "La luz debe apoyar lectura, movimiento nocturno, wardrobe, espejo y baño sin convertir los espacios privados en showroom."],
        ["Storage, millwork y mobiliario", "Wardrobes, vanities, mesas, bancos y built-ins deben compartir proporción, herrajes y acabado."],
        ["Notas de planificación", "Planifique privacidad, circulación, puertas, rutinas de dos personas, inventario, vanity, blackout y transición a zonas húmedas."],
        ["Señales de inversión", "La inversión sube con habitaciones conectadas, wardrobes, piedra, vanities, control de luz, paneles, continuidad y coordinación trade."],
        ["Errores comunes", "Evite diseñar dormitorio, vestidor y baño por separado, usar materiales inconexos, poca storage o ignorar movimiento nocturno."],
      ],
      fr: [
        ["La suite parentale comme séquence privée", "Une suite forte relie dormir, s'habiller et se baigner avec seuils, portes et scénarios lumineux planifiés."],
        ["Meilleurs types de projet", "Têtes de lit, dressings, wardrobes, vasques, linge, panneaux et palettes connectées conviennent bien."],
        ["Matières et finitions", `Des matières comme ${materials} relient la suite lorsque la palette évolue subtilement de la chambre au dressing puis au bain.`],
        ["Stratégie lumière", "La lumière soutient lecture, circulation nocturne, wardrobe, miroir et bain sans transformer l'espace privé en showroom."],
        ["Rangement, menuiserie et mobilier", "Dressings, vasques, chevets, bancs et intégrés doivent partager proportions, quincaillerie et finition."],
        ["Notes de planification", "Planifiez intimité, circulation, portes, routines à deux, inventaire, vasque, blackout et transition vers zones humides."],
        ["Signaux d'investissement", "L'investissement augmente avec pièces connectées, dressings, pierre, vasques, contrôle lumière, panneaux, continuité et coordination."],
        ["Erreurs fréquentes", "Évitez de concevoir chambre, dressing et bain séparément, matériaux sans lien, rangement faible ou circulation nocturne oubliée."],
      ],
      ru: [
        ["Мастер-сьют как приватная последовательность", "Сильный master suite связывает сон, dressing и bathing через продуманные переходы, двери и световые сценарии."],
        ["Лучшие типы проектов", "Подходят изголовья, dressing rooms, wardrobes, тумбы для ванной, хранение белья, панели и связанная материальная палитра."],
        ["Материалы и отделки", `Материалы вроде ${materials} связывают suite, когда палитра тонко меняется от спальни к гардеробной и ванной.`],
        ["Стратегия света", "Свет поддерживает чтение, ночное движение, выбор одежды, зеркало и ванную, не превращая приватные комнаты в showroom."],
        ["Хранение, millwork и мебель", "Wardrobes, vanities, тумбы, банкетки и built-ins должны иметь общую логику пропорций, фурнитуры и отделки."],
        ["Заметки по планированию", "Планируйте приватность, движение, двери, сценарии двух людей, инвентарь, vanity, blackout и переход к влажным зонам."],
        ["Инвестиционные факторы", "Бюджет растет от количества связанных комнат, wardrobes, камня, vanities, управления светом, панелей, непрерывности отделок и координации."],
        ["Частые ошибки", "Не проектируйте спальню, гардеробную и ванную отдельно; избегайте несвязанных материалов, слабого хранения и игнорирования ночного движения."],
      ],
    },
  };
  const rows = content[room.slug]?.[locale];
  return rows ? withRoomSupplementSections(locale, room, rows.map(([heading, body]) => ({ heading, body }))) : withRoomSupplementSections(locale, room, standardSections(locale, subject, null, room));
}

function withRoomSupplementSections(locale, room, sections) {
  const headingText = sections.map((section) => section.heading).join(" ").toLowerCase();
  if (/best|mejor|meilleur|лучш/.test(headingText) && /planning|planific|планирован/.test(headingText) && /investment|inversi|investissement|инвестицион/.test(headingText)) return sections;
  const supplements = roomSupplementSections(locale, room);
  if (!supplements.length) return sections;
  const mistakeIndex = sections.findIndex((section) => /mistakes|errores|erreurs|ошиб/i.test(section.heading));
  if (mistakeIndex === -1) return [...sections, ...supplements];
  return [...sections.slice(0, mistakeIndex), ...supplements, ...sections.slice(mistakeIndex)];
}

function roomSupplementSections(locale, room) {
  const content = {
    en: {
      "living-room": [
        ["Best project types", "Living room inquiries are strongest when they involve a custom media wall, fireplace wall, floating console, display shelving, acoustic paneling, built-in storage or a full wall-panel composition."],
        ["Planning notes", "Before furniture is selected, settle TV size, fireplace clearances, speaker locations, wiring paths, seating orientation, children or family use, and whether the room is for formal entertaining, daily life or both."],
        ["Investment signals", "Living room investment rises with wall length, stone or veneer selection, hidden AV work, integrated lighting, cabinet interiors, finish complexity and installation coordination."],
      ],
      kitchen: [
        ["Best project types", "Kitchen inquiries fit CAS AURUM best when they involve custom cabinetry, island detailing, appliance panels, pantry integration, drawer organization, premium refacing or a coordinated millwork package."],
        ["Planning notes", "Workflow, appliance locations, island overhangs, drawer clearances, pantry access, ventilation, outlet placement and contractor responsibilities should be clarified before finish samples are chosen."],
        ["Investment signals", "Kitchen investment is shaped by cabinet volume, door style, stone slabs, appliance integration, hardware, lighting, finishing method, site access and whether CAS AURUM is coordinating selected scopes or a larger package."],
      ],
      bedroom: [
        ["Best project types", "Bedroom inquiries are strongest for custom headboard walls, upholstered or wood wall panels, floating nightstands, wardrobes, storage walls, vanity niches and bespoke bedroom furniture."],
        ["Planning notes", "Start with bed size, wall width, closet inventory, blackout needs, outlet locations, rug scale, reading habits and whether the room should feel like a quiet residence or a tailored hotel suite."],
        ["Investment signals", "Bedroom investment changes with panel area, upholstery, veneer selection, integrated lighting, wardrobe complexity, drawer interiors, hardware and the amount of site fitting required."],
      ],
      bathroom: [
        ["Best project types", "Bathroom inquiries are strongest for custom vanities, double vanity upgrades, stone or stone-look surfaces, mirror walls, linen storage, premium bath details and coordination with renovation contractors."],
        ["Planning notes", "Confirm plumbing locations, wet-zone dimensions, shower glass, mirror height, ventilation, towel access, storage needs, grout exposure and fixture finish logic before the decorative palette is finalized."],
        ["Investment signals", "Bathroom investment depends on vanity size, stone selection, slab or tile complexity, moisture-resistant construction, mirror lighting, hardware, installation coordination and site conditions."],
      ],
      "walk-in-closet": [
        ["Best project types", "Closet inquiries are strongest for full dressing rooms, illuminated wardrobe walls, shoe storage, accessory drawers, glass doors, closet islands, mirrors and boutique-style cabinetry."],
        ["Planning notes", "Inventory comes before design: count hanging lengths, shoes, bags, folded items, jewelry, watches, luggage and seasonal storage, then plan circulation and lighting around daily dressing."],
        ["Investment signals", "Closet investment rises with cabinet volume, glass, LED channels, drawer interiors, island storage, leather or fabric inserts, hardware quality and the precision of installation."],
      ],
      "master-suite": [
        ["Best project types", "Master suite inquiries fit best when bedroom, dressing room and bathroom scopes need one connected material story, shared storage logic and coordinated lighting scenes."],
        ["Planning notes", "Plan the sequence from sleeping to dressing to bathing: privacy, door swings, wardrobe access, vanity use, night lighting, blackout control and the way two people move through the suite."],
        ["Investment signals", "Suite-level investment reflects multiple rooms, matched materials, custom wardrobes, vanities, headboard walls, lighting control, finish continuity and coordination across trades."],
      ],
    },
    es: {
      "living-room": [["Mejores tipos de proyecto", "Los mejores alcances incluyen media wall, chimenea, consola flotante, display, paneles acústicos, built-ins o composición completa de pared."], ["Notas de planificación", "Defina TV, chimenea, speakers, cableado, orientación de asientos, uso familiar y si la sala será formal, diaria o ambas."], ["Señales de inversión", "La inversión crece con largo de muro, piedra o chapa, AV oculto, iluminación, interiores de gabinete, acabado e instalación."]],
      kitchen: [["Mejores tipos de proyecto", "Encajan cabinetry a medida, isla, paneles de electrodomésticos, pantry, organización de cajones, refacing premium o paquete de millwork."], ["Notas de planificación", "Flujo, appliances, isla, cajones, pantry, ventilación, tomas y responsabilidades del contratista se aclaran antes de acabados."], ["Señales de inversión", "Influyen volumen de cabinetry, puertas, piedra, integración de appliances, herrajes, iluminación, acabado, acceso y coordinación."]],
      bedroom: [["Mejores tipos de proyecto", "Funcionan cabeceros a medida, paneles tapizados o de madera, mesas flotantes, wardrobes, storage walls, nichos y muebles bespoke."], ["Notas de planificación", "Empiece por cama, ancho de muro, inventario, blackout, tomas, alfombra, lectura y si busca calma residencial o suite hotelera."], ["Señales de inversión", "Cambian por área de panel, tapicería, chapa, luz integrada, wardrobes, interiores, herrajes y ajuste en sitio."]],
      bathroom: [["Mejores tipos de proyecto", "Encajan vanities a medida, doble vanity, superficies de piedra, espejos, linen storage, detalles premium y coordinación con contratistas."], ["Notas de planificación", "Confirme plumbing, wet zone, vidrio, espejo, ventilación, toallas, storage, grout y lógica de fixtures antes de la paleta."], ["Señales de inversión", "Depende de vanity, piedra, slab o tile, construcción resistente, luz de espejo, herrajes, coordinación y condiciones del sitio."]],
      "walk-in-closet": [["Mejores tipos de proyecto", "Vestidores completos, wardrobes iluminados, zapatos, accesorios, puertas de vidrio, islas, espejos y cabinetry boutique."], ["Notas de planificación", "El inventario va primero: colgado, zapatos, bolsas, doblado, joyería, relojes, maletas y temporada; luego circulación y luz."], ["Señales de inversión", "Sube con volumen, vidrio, LEDs, interiores, isla, inserts, herrajes y precisión de instalación."]],
      "master-suite": [["Mejores tipos de proyecto", "Encaja cuando dormitorio, vestidor y baño necesitan una historia material, storage y escenas de luz conectadas."], ["Notas de planificación", "Planifique dormir, vestir y bañarse: privacidad, puertas, wardrobe, vanity, luz nocturna, blackout y circulación de dos personas."], ["Señales de inversión", "Refleja varias habitaciones, materiales coordinados, wardrobes, vanities, cabeceros, control de luz y coordinación trade."]],
    },
    fr: {
      "living-room": [["Meilleurs types de projet", "Les demandes fortes incluent media wall, cheminée, console flottante, exposition, panneaux acoustiques, intégrés ou mur complet."], ["Notes de planification", "Définissez TV, cheminée, speakers, câbles, assises, usage familial et caractère formel ou quotidien."], ["Signaux d'investissement", "L'investissement augmente avec longueur du mur, pierre ou placage, AV caché, lumière, intérieurs, finition et pose."]],
      kitchen: [["Meilleurs types de projet", "Cabinetry, îlot, panneaux d'électroménager, pantry, tiroirs, refacing premium ou package millwork conviennent bien."], ["Notes de planification", "Flux, électroménager, îlot, tiroirs, pantry, ventilation, prises et responsabilités se clarifient avant finitions."], ["Signaux d'investissement", "Volume, portes, pierre, intégration, quincaillerie, lumière, finition, accès et coordination influencent le budget."]],
      bedroom: [["Meilleurs types de projet", "Têtes de lit, panneaux tapissés ou bois, chevets flottants, dressings, murs de rangement, niches et mobilier bespoke."], ["Notes de planification", "Commencez par lit, mur, inventaire, blackout, prises, tapis, lecture et calme résidentiel ou suite hôtelière."], ["Signaux d'investissement", "Surface de panneaux, textile, placage, lumière intégrée, dressings, intérieurs, quincaillerie et ajustement site comptent."]],
      bathroom: [["Meilleurs types de projet", "Meubles vasques, double vasque, pierre, miroirs, rangement linge, détails premium et coordination chantier."], ["Notes de planification", "Confirmez plomberie, zone humide, verre, miroir, ventilation, serviettes, rangement, joints et logique des fixtures."], ["Signaux d'investissement", "Vasque, pierre, dalle ou carrelage, construction résistante, lumière miroir, quincaillerie, coordination et site comptent."]],
      "walk-in-closet": [["Meilleurs types de projet", "Dressings complets, wardrobes éclairés, chaussures, accessoires, portes vitrées, îlots, miroirs et cabinetry boutique."], ["Notes de planification", "Inventaire d'abord : penderie, chaussures, sacs, plié, bijoux, montres, bagages et saisonnier; puis circulation et lumière."], ["Signaux d'investissement", "Volume, verre, LED, intérieurs, îlot, inserts, quincaillerie et précision de pose augmentent l'investissement."]],
      "master-suite": [["Meilleurs types de projet", "Convient quand chambre, dressing et bain demandent une même histoire matière, rangement et lumière."], ["Notes de planification", "Planifiez dormir, s'habiller, se baigner : intimité, portes, wardrobe, vasque, nuit, blackout et circulation à deux."], ["Signaux d'investissement", "Plusieurs pièces, matières coordonnées, dressings, vasques, têtes de lit, contrôle lumière et coordination trade comptent."]],
    },
    ru: {
      "living-room": [["Лучшие типы проектов", "Сильные запросы: media wall, каминная стена, подвесная консоль, display, акустические панели, built-ins или полная композиция стены."], ["Заметки по планированию", "Сначала определите TV, камин, speakers, кабели, посадку, семейное использование и формат: формальный, ежедневный или оба."], ["Инвестиционные факторы", "Бюджет растет от длины стены, камня или шпона, скрытого AV, света, наполнения шкафов, отделки и монтажа."]],
      kitchen: [["Лучшие типы проектов", "Подходят cabinetry, остров, панели техники, pantry, организация ящиков, премиальный refacing или coordinated millwork package."], ["Заметки по планированию", "Workflow, техника, остров, ящики, pantry, вентиляция, розетки и ответственность подрядчиков уточняются до отделок."], ["Инвестиционные факторы", "Влияют объем cabinetry, фасады, камень, интеграция техники, фурнитура, свет, отделка, доступ и координация."]],
      bedroom: [["Лучшие типы проектов", "Подходят изголовья, мягкие или деревянные панели, парящие тумбы, wardrobes, стены хранения, ниши и bespoke мебель."], ["Заметки по планированию", "Начните с кровати, ширины стены, инвентаря, blackout, розеток, ковра, чтения и нужного ощущения: дом или hotel suite."], ["Инвестиционные факторы", "Влияют площадь панелей, текстиль, шпон, встроенный свет, wardrobes, наполнения, фурнитура и подгонка на объекте."]],
      bathroom: [["Лучшие типы проектов", "Подходят тумбы, double vanity, каменные поверхности, зеркала, хранение полотенец, premium детали и координация с подрядчиками."], ["Заметки по планированию", "Подтвердите plumbing, wet zone, стекло, зеркало, вентиляцию, полотенца, хранение, затирку и логику fixtures."], ["Инвестиционные факторы", "Зависят от тумбы, камня, slab или плитки, влагостойкой конструкции, света у зеркала, фурнитуры, координации и объекта."]],
      "walk-in-closet": [["Лучшие типы проектов", "Полные dressing rooms, подсвеченные wardrobes, обувь, аксессуары, стеклянные двери, острова, зеркала и boutique cabinetry."], ["Заметки по планированию", "Сначала инвентарь: подвес, обувь, сумки, сложенные вещи, украшения, часы, чемоданы и сезонное хранение; потом движение и свет."], ["Инвестиционные факторы", "Бюджет растет от объема, стекла, LED, наполнений, острова, inserts, фурнитуры и точности монтажа."]],
      "master-suite": [["Лучшие типы проектов", "Подходит, когда спальня, dressing и ванная требуют единой материальной истории, хранения и световых сценариев."], ["Заметки по планированию", "Планируйте сон, dressing и bathing: приватность, двери, wardrobe, vanity, ночной свет, blackout и движение двух людей."], ["Инвестиционные факторы", "Влияют несколько комнат, согласованные материалы, wardrobes, тумбы, изголовья, управление светом и trade-координация."]],
    },
  };
  return (content[locale]?.[room.slug] || []).map(([heading, body]) => ({ heading, body }));
}

function roomFaqFor(locale, room) {
  if (room.faq?.[locale]) return withRoomSupplementFaq(locale, room, room.faq[locale].map(([q, a]) => ({ q, a })));
  const content = {
    bathroom: {
      en: [["Can CAS AURUM build a custom bathroom vanity?", "Yes. Vanities can be planned around drawers, stone tops, double vanity proportions, mirror scale, outlets, towels and daily storage."], ["What materials work best for luxury bathroom vanities?", "Stone, porcelain slabs, moisture-resistant cabinet construction, wood accents, brushed metal and durable finishes can work when water exposure and cleaning are planned early."], ["Can lighting, mirrors and shower glass be coordinated?", "Yes. Mirror lighting, recessed lighting, shower glass, fixture finish logic and storage should be coordinated so the bathroom feels calm and practical."], ["Can you adapt a completed bathroom project to my home?", "Yes. Completed bathroom work can guide proportion, stone and vanity direction, then the scope is adjusted to your room dimensions and site conditions."], ["Do you work from photos, plans or designer drawings?", "Yes. Photos, plans, elevations, plumbing notes, fixture schedules and designer drawings help define the bathroom scope."]],
      es: [["¿CAS AURUM puede crear un vanity de baño a medida?", "Sí. Se planifica según cajones, cubierta, espejo, tomas, toallas y proporciones."], ["¿Trabajan con piedra, tile y acabados resistentes a humedad?", "Sí. La dirección puede incluir piedra, porcelánico, madera, metal y detalles adecuados para humedad."], ["¿Pueden coordinar iluminación, espejos y almacenamiento?", "Sí. Deben coordinarse juntos porque uso del espejo, storage y brillo definen el confort."], ["¿Pueden adaptar un baño completado a mi espacio?", "Sí. La obra completada guía proporción y materiales, y el alcance se ajusta a sus medidas y condiciones."]],
      fr: [["CAS AURUM peut-il créer un meuble vasque sur mesure ?", "Oui. Il se planifie selon tiroirs, plan, miroir, prises, serviettes et proportions."], ["Travaillez-vous avec pierre, carrelage et finitions résistantes à l'humidité ?", "Oui. La direction peut inclure pierre, grès, bois, métal et détails adaptés à l'humidité."], ["Pouvez-vous coordonner lumière, miroirs et rangement ?", "Oui. Ces éléments se coordonnent car miroir, rangement et éblouissement définissent le confort."], ["Pouvez-vous adapter une salle de bain réalisée à mon espace ?", "Oui. Le projet réalisé guide proportions et matières, puis le périmètre s'adapte à vos mesures."]],
      ru: [["Может ли CAS AURUM сделать тумбу для ванной на заказ?", "Да. Тумба планируется вокруг ящиков, столешницы, зеркала, розеток, полотенец и пропорций комнаты."], ["Вы работаете с камнем, плиткой и влагостойкими отделками?", "Да. Направление может включать камень, porcelain slabs, дерево, металл и детали, рассчитанные на влажность."], ["Можно согласовать свет, зеркала и хранение?", "Да. Эти элементы планируются вместе, потому что зеркало, хранение и блики определяют ежедневный комфорт."], ["Можно адаптировать выполненную ванную под мое пространство?", "Да. Выполненная работа может задать пропорции и материалы, а scope адаптируется под размеры и условия объекта."]],
    },
    "living-room": {
      en: [["Can CAS AURUM build a custom media wall for a living room?", "Yes. A media wall can include panels, floating consoles, concealed wiring, display shelving, storage, lighting and acoustic comfort planning."], ["Can a fireplace wall include storage and lighting?", "Yes. Fireplace walls can combine stone or paneling, built-ins, storage, display zones, lighting and heat-clearance review."], ["What materials work best for luxury living room wall panels?", "Walnut, oak, stone, plaster, fluted panels, textile panels and restrained metal details can work when the panel rhythm and seating orientation are planned together."], ["Can you adapt a completed living room project to my home?", "Yes. Completed living room work can guide the focal wall, materials and proportions, then adapt to your ceiling height, wall length and family or entertaining use."], ["Do you work from photos, plans or designer drawings?", "Yes. Photos, plans, elevations, AV notes and designer drawings all help define the wall, storage, lighting and installation scope."]],
      es: [["¿CAS AURUM puede crear un media wall o muro de chimenea?", "Sí. Puede incluir paneles, piedra, built-ins, storage, display, luz y cableado."], ["¿Los built-ins pueden adaptarse a TV o chimenea existente?", "Sí. Se revisan dimensiones, calor, AV y condiciones del muro."], ["¿Trabajan con diseñadores y builders?", "Sí. Planos, elevaciones, schedules y fotos ayudan al alcance trade."], ["¿Pueden crear una sala similar para mi casa?", "Sí. El trabajo completado se adapta a largo de muro, altura, materiales y seating."]],
      fr: [["CAS AURUM peut-il créer un media wall ou mur cheminée ?", "Oui. Il peut inclure panneaux, pierre, intégrés, rangement, exposition, lumière et câbles."], ["Les intégrés peuvent-ils entourer une TV ou cheminée existante ?", "Oui. Dimensions, dégagements, AV et conditions du mur sont vérifiés."], ["Travaillez-vous avec designers et constructeurs ?", "Oui. Plans, élévations, finitions et photos aident le périmètre."], ["Pouvez-vous créer un salon similaire chez moi ?", "Oui. Le réalisé s'adapte à votre mur, hauteur, matières et assises."]],
      ru: [["Может ли CAS AURUM сделать media wall или каминную стену?", "Да. Media wall может включать панели, камень, built-ins, хранение, display-зоны, свет и кабели."], ["Можно встроить решения вокруг существующего TV или камина?", "Да. Сначала проверяются размеры, зазоры по теплу, AV-оборудование и состояние стены."], ["Вы работаете с дизайнерами и строителями?", "Да. Чертежи, фасады, спецификации и фото объекта полезны для trade-led задач."], ["Можно создать похожую гостиную для моего дома?", "Да. Выполненная работа адаптируется под длину стены, высоту потолка, материалы и посадку."]],
    },
    kitchen: {
      en: [["Can CAS AURUM create custom kitchen cabinetry?", "Yes. Kitchen scopes can include custom cabinetry, appliance panels, pantry integration, drawer organization, island detailing and finish coordination."], ["Can a kitchen island be planned as a focal point?", "Yes. Island scale, stone slabs, seating, storage, lighting over the island and circulation should be planned together."], ["Do you coordinate with contractors or designers?", "Yes. CAS AURUM can review cabinetry details, appliance integration, finish logic and coordination needs with the project team."], ["What finishes work best for a luxury kitchen?", "Durable finishes, stone slabs, rift oak, walnut, matte lacquer, integrated lighting and refined hardware work best when workflow and material transitions are settled first."], ["Can you adapt a completed kitchen project to my home?", "Yes. Completed kitchen work can guide the request, then the details are adjusted to your layout, appliance package and site conditions."]],
      es: [["¿CAS AURUM hace cocinas completas o elementos seleccionados?", "CAS AURUM encaja mejor en cabinetry, islas, paneles, storage y finish carpentry; responsabilidades completas se confirman por proyecto."], ["¿Pueden crear cabinetry, paneles, islas o almacenamiento?", "Sí, cuando medidas, appliances, materiales y presupuesto están claros."], ["¿Pueden coordinar materiales con un contratista de cocina?", "Sí. Puede revisar acabados, detalles de cabinetry y coordinación."], ["¿Pueden adaptar una cocina a mi casa?", "Sí. Una cocina completada guía el pedido y se ajusta a su layout."]],
      fr: [["CAS AURUM réalise-t-il des cuisines complètes ou des éléments choisis ?", "CAS AURUM convient surtout à cabinetry, îlots, panneaux, rangement et finition; les responsabilités chantier se confirment par projet."], ["Pouvez-vous créer cabinetry, panneaux, îlots ou rangement ?", "Oui, si mesures, électroménager, matières et budget sont clairs."], ["Pouvez-vous coordonner avec un cuisiniste existant ?", "Oui. CAS AURUM peut revoir finitions, détails et coordination."], ["Pouvez-vous adapter une cuisine à ma maison ?", "Oui. Une cuisine réalisée peut guider la demande puis s'adapter à votre plan."]],
      ru: [["CAS AURUM делает кухни полностью или отдельные элементы?", "CAS AURUM лучше всего подходит для cabinetry, островов, панелей, хранения и финишной столярки; полный строительный scope подтверждается по проекту."], ["Можно сделать корпусную мебель, панели, остров или хранение?", "Да, если понятны размеры, техника, материалы и бюджетный диапазон."], ["Можно согласовать материалы с кухонным подрядчиком?", "Да. CAS AURUM может рассмотреть отделки, детали cabinetry и координацию."], ["Можно адаптировать кухню под мой дом?", "Да. Выполненная кухня может быть референсом, затем детали адаптируются под layout и условия объекта."]],
    },
    "walk-in-closet": {
      en: [["Can CAS AURUM create a full custom walk-in closet?", "Yes. A closet scope can include hanging zones, shoe walls, drawers, glass doors, island storage, mirrors, jewelry storage, seating and hardware."], ["Can lighting be integrated inside closet cabinetry?", "Yes. Interior cabinet lighting, display lighting, mirror lighting and ambient light should be planned around wardrobe visibility and daily usability."], ["How is a closet planned around my wardrobe?", "Start with wardrobe inventory: long hanging, short hanging, shoes, bags, accessories, jewelry, watches, seasonal items, luggage and folded storage."], ["Can a closet include an island, glass doors and seating?", "Yes. Those details can create a boutique atmosphere when circulation, drawer clearance and material durability are resolved."], ["Can you work from designer drawings?", "Yes. Elevations, plans, finish schedules, hardware notes and site dimensions are useful for closet work."]],
      es: [["¿CAS AURUM puede crear un walk-in closet completo?", "Sí. Puede incluir sistemas wardrobe, luz, cajones, vidrio, isla, espejos, asiento y herrajes."], ["¿Pueden incluir luz, cajones, vidrio e isla?", "Sí. Se planifican juntos según inventario, acceso y rutina."], ["¿Cómo se planifica según mi guardarropa?", "Con conteos y categorías: colgado largo/corto, zapatos, bolsas, accesorios, temporada, maletas y doblado."], ["¿Pueden trabajar con dibujos de diseñador?", "Sí. Elevaciones, planos, acabados, herrajes y medidas son útiles."]],
      fr: [["CAS AURUM peut-il créer un dressing complet ?", "Oui. Il peut inclure systèmes, lumière, tiroirs, portes vitrées, îlot, miroirs, assise et quincaillerie."], ["Pouvez-vous inclure lumière, tiroirs, verre et îlot ?", "Oui. Ces éléments se planifient selon inventaire, accès et routine."], ["Comment planifier selon ma garde-robe ?", "Avec catégories : penderie longue/courte, chaussures, sacs, accessoires, saisonnier, bagages et plié."], ["Pouvez-vous travailler depuis dessins designer ?", "Oui. Élévations, plans, finitions, quincaillerie et mesures sont utiles."]],
      ru: [["Может ли CAS AURUM сделать полную walk-in гардеробную?", "Да. Scope может включать системы хранения, свет, ящики, стеклянные двери, остров, зеркала, посадку и фурнитуру."], ["Можно включить свет, ящики, стекло и остров?", "Да. Эти элементы планируются вместе вокруг инвентаря, доступа и ежедневных сценариев."], ["Как гардеробная планируется под мой гардероб?", "Сначала считаются категории: длинное/короткое хранение, обувь, сумки, аксессуары, сезонные вещи, чемоданы и сложенная одежда."], ["Можно работать по чертежам дизайнера?", "Да. Фасады, планы, спецификации, фурнитура и размеры объекта очень полезны."]],
    },
  };
  const rows = content[room.slug]?.[locale];
  return rows ? withRoomSupplementFaq(locale, room, rows.map(([q, a]) => ({ q, a }))) : withRoomSupplementFaq(locale, room, faqFor(locale, local(room.title, locale)));
}

function withRoomSupplementFaq(locale, room, faqs) {
  if (faqs.length >= 5) return faqs;
  const supplement = {
    en: {
      "living-room": ["Do you work from photos, plans or designer drawings?", "Yes. Photos, plans, elevations, AV notes and designer drawings all help define the wall, storage, lighting and installation scope."],
      kitchen: ["Can you coordinate with my contractor or designer?", "Yes. CAS AURUM can coordinate selected cabinetry, millwork, materials and finish details with the professionals responsible for the broader kitchen work."],
      bedroom: ["Can a completed bedroom direction be adapted to my room?", "Yes. Completed work can guide proportions, materials and lighting, then the details are adapted to your dimensions and storage needs."],
      bathroom: ["Do you coordinate with installers or contractors?", "Yes. Bathroom work often requires contractor coordination for plumbing, waterproofing, electrical, stone, glass and installation responsibilities."],
      "walk-in-closet": ["Can you adapt a completed closet direction to my home?", "Yes. The storage logic, material palette and lighting approach can be adapted to your inventory, room size and site conditions."],
      "master-suite": ["Can CAS AURUM plan the bedroom, closet and bathroom together?", "Yes. A master suite inquiry can connect bedroom walls, wardrobes, vanities, lighting and materials into one coordinated private sequence."],
    },
    es: {
      "living-room": ["¿Trabajan desde fotos, planos o dibujos de diseñador?", "Sí. Fotos, planos, elevaciones y notas AV ayudan a definir muro, storage, luz e instalación."],
      kitchen: ["¿Pueden coordinar con mi contratista o diseñador?", "Sí. CAS AURUM puede coordinar cabinetry, millwork, materiales y detalles con los profesionales del proyecto."],
      bedroom: ["¿Puede adaptarse una dirección de dormitorio completada?", "Sí. Una obra completada guía proporciones, materiales y luz, y se adapta a sus medidas y storage."],
      bathroom: ["¿Coordinan con instaladores o contratistas?", "Sí. El baño suele requerir coordinación de plumbing, waterproofing, electricidad, piedra, vidrio e instalación."],
      "walk-in-closet": ["¿Pueden adaptar una dirección de closet completada?", "Sí. Storage, materiales y luz se adaptan a inventario, tamaño y condiciones del sitio."],
      "master-suite": ["¿CAS AURUM puede planificar dormitorio, vestidor y baño juntos?", "Sí. Una master suite puede conectar paredes, wardrobes, vanities, luz y materiales."],
    },
    fr: {
      "living-room": ["Travaillez-vous depuis photos, plans ou dessins designer ?", "Oui. Photos, plans, élévations et notes AV aident à définir mur, rangement, lumière et pose."],
      kitchen: ["Pouvez-vous coordonner avec mon entrepreneur ou designer ?", "Oui. CAS AURUM peut coordonner cabinetry, millwork, matières et détails avec les professionnels du projet."],
      bedroom: ["Une direction chambre réalisée peut-elle être adaptée ?", "Oui. Un réalisé guide proportions, matières et lumière, puis s'adapte à vos dimensions et rangements."],
      bathroom: ["Coordonnez-vous avec installateurs ou entrepreneurs ?", "Oui. Une salle de bain demande souvent coordination plomberie, étanchéité, électricité, pierre, verre et pose."],
      "walk-in-closet": ["Pouvez-vous adapter une direction dressing réalisée ?", "Oui. Rangement, matières et lumière s'adaptent à votre inventaire, dimensions et conditions du site."],
      "master-suite": ["CAS AURUM peut-il planifier chambre, dressing et bain ensemble ?", "Oui. Une suite parentale peut relier murs, dressings, vasques, lumière et matières."],
    },
    ru: {
      "living-room": ["Вы работаете по фото, планам или чертежам дизайнера?", "Да. Фото, планы, фасады и AV-заметки помогают определить стену, хранение, свет и монтажный scope."],
      kitchen: ["Можно координироваться с моим подрядчиком или дизайнером?", "Да. CAS AURUM может согласовать cabinetry, millwork, материалы и детали с профессионалами проекта."],
      bedroom: ["Можно адаптировать выполненное bedroom-направление?", "Да. Выполненная работа задает пропорции, материалы и свет, а детали адаптируются под размеры и хранение."],
      bathroom: ["Вы координируетесь с установщиками или подрядчиками?", "Да. Ванная часто требует координации plumbing, waterproofing, электрики, камня, стекла и установки."],
      "walk-in-closet": ["Можно адаптировать выполненное closet-направление?", "Да. Логика хранения, материалы и свет адаптируются под инвентарь, размер комнаты и условия объекта."],
      "master-suite": ["CAS AURUM может планировать спальню, гардеробную и ванную вместе?", "Да. Master suite может связать стены спальни, wardrobes, vanities, свет и материалы в один сценарий."],
    },
  };
  const row = supplement[locale]?.[room.slug];
  return row ? [...faqs, { q: row[0], a: row[1] }] : faqs;
}

function cityCombinationFaq(locale, subject, combo) {
  const profile = combo.city.profile;
  if (locale !== "en") return faqFor(locale, subject);
  return [
    { q: `What makes ${subject} useful for ${combo.city.cityName}?`, a: `It connects the design direction to ${combo.city.cityName}'s property mix, constraints, materials and best-fit custom scopes.` },
    { q: `Which materials work well for ${subject}?`, a: `Good starting points include ${cityMaterialsFor(combo).join(", ")}. The final palette should depend on measurements, maintenance needs, lighting and budget range.` },
    { q: `What project types fit ${combo.city.cityName}?`, a: `Relevant scopes include ${profile.scopes.join(", ")} for ${profile.propertyMix}.` },
    { q: "Does CAS AURUM claim a local office or completed project in every city?", a: "No. City pages are planning guidance unless a page explicitly states a local office, showroom, license or completed project." },
    { q: "What should I send before requesting a consultation?", a: "Send room photos, plans or rough measurements, city or ZIP code, desired scope, material references, budget range, timeline and decision-maker context." },
  ];
}

function makePage(input) {
  const slug = `/${input.locale}${input.path}`;
  const alternates = Object.fromEntries(CAS_LOCALES.map((locale) => [locale, `${BASE_URL}/${locale}${input.path}`]));
  return {
    pageId: `${input.pageType}:${input.locale}:${input.path}`,
    slug, canonicalUrl: `${BASE_URL}${slug}`, hreflangAlternates: { ...alternates, "x-default": alternates.en },
    openGraph: { title: input.metaTitle, description: input.metaDescription, image: input.imagePath || collectionImage("aurum") },
    cta: { primary: l(input.locale, "ctaPrimary"), secondary: l(input.locale, "ctaSecondary") },
    internalLinks: dedupeLinks([...getRelatedCasaurumLinks(input), ...(input.extraLinks || [])]),
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
  const materials = dedupeMaterials([...(style?.materials || []), ...(room?.premiumMaterials || []), "natural stone", "walnut", "oak"]).slice(0, 8).join(", ");
  const cityBody = city ? local(city.luxuryContext, locale) : null;
  const bodies = {
    en: [
      `${subject} is defined by proportion, material discipline and a clear hierarchy of surfaces. The strongest version avoids scattered decoration and lets architecture, furniture and lighting work as one composition.`,
      `Important elements include custom wall panels, built-in storage, furniture scaled to the room, refined hardware, controlled contrast and enough negative space for the materials to feel intentional.`,
      `Suitable materials may include ${materials}. The goal is a palette that feels durable, tactile and aligned with the property.`,
      `Lighting should combine daylight control, warm ambient layers, concealed linear light and focused accents. A premium room should be comfortable at noon and cinematic in the evening.`,
      `Furniture direction should support the room rather than compete with it: custom proportions, calm upholstery, thoughtful storage and materials that echo the walls, floors and millwork.`,
      cityBody || "Spatial planning should keep circulation clear, locate the primary focal point early and use built-ins where they make the architecture feel more resolved.",
      `Investment depends on scope, measurements, materials, fabrication complexity, logistics and installation coordination. CAS AURUM avoids false fixed promises and uses the inquiry to define the right custom project path.`,
      `Common mistakes include mixing too many finishes, using lighting as an afterthought, copying inspiration without adapting scale, and choosing furniture before the architectural surfaces are planned.`,
    ],
    es: [
      `${subject} se define por proporción, disciplina material y una jerarquía clara de superficies. La versión más fuerte evita decoración dispersa y hace que arquitectura, mobiliario e iluminación trabajen como una sola composición.`,
      `Los elementos importantes incluyen paneles a medida, almacenamiento integrado, mobiliario en escala correcta, herrajes refinados, contraste controlado y espacio visual suficiente para que los materiales respiren.`,
      `Los materiales adecuados pueden incluir ${materials}. El objetivo es una paleta durable, táctil y coherente con la propiedad.`,
      `La iluminación debe combinar control de luz natural, capas cálidas, luz lineal oculta y acentos precisos. Un espacio premium debe funcionar al mediodía y sentirse cinematográfico por la noche.`,
      `La dirección de mobiliario debe apoyar el espacio, no competir con él: proporciones a medida, tapicería sobria, almacenamiento pensado y materiales conectados con paredes, pisos y carpintería.`,
      cityBody || "La planificación espacial debe mantener circulación clara, definir pronto el punto focal y usar elementos integrados cuando ayudan a resolver la arquitectura.",
      `La inversión depende del alcance, medidas, materiales, complejidad de fabricación, logística y coordinación de instalación. CAS AURUM evita promesas fijas falsas y usa la consulta para definir el camino adecuado del proyecto a medida.`,
      `Errores comunes: demasiados acabados, iluminación como idea tardía, copiar inspiración sin adaptar escala y elegir muebles antes de planificar las superficies arquitectónicas.`,
    ],
    fr: [
      `${subject} se définit par la proportion, la discipline des matériaux et une hiérarchie claire des surfaces. La meilleure version évite la décoration dispersée et fait travailler architecture, mobilier et lumière comme une composition unique.`,
      `Les éléments importants incluent panneaux sur mesure, rangements intégrés, mobilier à la bonne échelle, quincaillerie raffinée, contraste maîtrisé et assez d'espace visuel pour laisser parler les matériaux.`,
      `Les matériaux adaptés peuvent inclure ${materials}. L'objectif est une palette durable, tactile et cohérente avec la propriété.`,
      `La lumière doit combiner contrôle du jour, couches chaleureuses, éclairage linéaire dissimulé et accents précis. Une pièce premium doit être confortable à midi et cinématographique le soir.`,
      `Le mobilier doit soutenir la pièce plutôt que rivaliser avec elle : proportions sur mesure, textiles calmes, rangement réfléchi et matériaux liés aux murs, sols et menuiseries.`,
      cityBody || "La planification spatiale doit garder une circulation claire, placer tôt le point focal principal et utiliser les intégrés quand ils rendent l'architecture plus aboutie.",
      `L'investissement dépend de la portée, des mesures, des matériaux, de la complexité de fabrication, de la logistique et de la coordination d'installation. CAS AURUM évite les promesses fixes trompeuses et définit le bon parcours de projet sur mesure.`,
      `Les erreurs fréquentes incluent trop de finis, la lumière pensée trop tard, la copie d'inspiration sans adaptation d'échelle et le choix du mobilier avant les surfaces architecturales.`,
    ],
    ru: [
      `${subject} определяется пропорциями, дисциплиной материалов и ясной иерархией поверхностей. Сильная версия избегает случайного декора и связывает архитектуру, мебель и свет в одну композицию.`,
      `Ключевые элементы: кастомные панели, встроенное хранение, мебель правильного масштаба, утонченная фурнитура, контролируемый контраст и достаточно воздуха, чтобы материалы выглядели намеренно.`,
      `Подходящие материалы могут включать ${materials}. Цель — долговечная, тактильная и согласованная с недвижимостью палитра.`,
      `Свет должен объединять контроль дневного света, теплые сценарии, скрытую линейную подсветку и акцентный свет. Премиальная комната должна быть удобной днем и атмосферной вечером.`,
      `Мебель должна поддерживать пространство, а не спорить с ним: кастомные пропорции, спокойная обивка, продуманное хранение и материалы, связанные со стенами, полом и millwork.`,
      cityBody || "Планировка должна сохранять чистую циркуляцию, рано определять главный фокус и использовать встроенные элементы там, где они делают архитектуру завершенной.",
      `Инвестиция зависит от объема, замеров, материалов, сложности изготовления, логистики и координации установки. CAS AURUM не дает ложных фиксированных обещаний и уточняет подходящий путь проекта на заказ.`,
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

function dedupeMaterials(items) {
  const seen = new Set();
  return (items || []).filter((item) => {
    const key = String(item || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
      [l(locale, "finalCta"), "A Casaurum concept can connect inspiration to practical scope notes: room, location, property type, material direction, budget range and timeline."],
    ],
    es: [
      [l(locale, "direct"), `${title} empieza con una pregunta directa de diseño: cómo debe sentirse el espacio, cómo debe funcionar y qué materiales pueden sostener esa sensación sin ruido visual.`],
      ["Marco de diseño", "Use estilo, espacio, tipo de propiedad e intención juntos. Una sala de villa, una cocina de penthouse y un lobby boutique pueden compartir estilo, pero necesitan distinta lógica de luz, almacenamiento y mobiliario."],
      ["Notas de materiales", "Los interiores premium suelen leerse mejor con menos materiales y mejor elegidos: nogal, roble, piedra, yeso, cuero, lana, acentos de latón y metal mate usados con contención."],
      ["Comparación", "El estilo moderno es más limpio y estructural; el contemporáneo es más actual y fluido; el lujo discreto es más sutil; el diseño a medida es el más específico para cada proyecto."],
      [l(locale, "finalCta"), "Un concepto Casaurum puede conectar inspiración con notas prácticas de alcance: espacio, ubicación, tipo de propiedad, dirección material, rango de presupuesto y tiempos."],
    ],
    fr: [
      [l(locale, "direct"), `${title} commence par une question de design directe : quelle sensation créer, comment la pièce doit fonctionner et quels matériaux peuvent porter cette intention sans bruit visuel ?`],
      ["Cadre de design", "Utilisez ensemble le style, la pièce, le type de propriété et l'intention. Un salon de villa, une cuisine de penthouse et un lobby boutique peuvent partager un style, mais demandent une logique différente de lumière, rangement et mobilier."],
      ["Notes matériaux", "Les intérieurs premium se lisent souvent mieux avec moins de matières, mais mieux choisies : noyer, chêne, pierre, plâtre, cuir, laine, accents laiton et métal mat avec retenue."],
      ["Comparaison", "Le style moderne est plus net et structurel; le contemporain est plus actuel et fluide; le luxe discret est plus subtil; le design sur mesure est le plus spécifique au projet."],
      [l(locale, "finalCta"), "Un concept Casaurum peut relier l'inspiration à des notes de périmètre pratiques : pièce, lieu, type de propriété, direction matière, budget indicatif et calendrier."],
    ],
    ru: [
      [l(locale, "direct"), `${title} начинается с прямого дизайн-вопроса: каким должно быть ощущение комнаты, как она должна работать и какие материалы могут передать это без визуального шума.`],
      ["Дизайн-рамка", "Рассматривайте стиль, комнату, тип недвижимости и намерение вместе. Гостиная виллы, кухня пентхауса и лобби бутик-отеля могут иметь общий стиль, но разную логику света, хранения и мебели."],
      ["Заметки по материалам", "Премиальные интерьеры часто читаются лучше через меньшее количество более сильных материалов: орех, дуб, камень, штукатурка, кожа, шерсть, латунные акценты и матовый металл сдержанно."],
      ["Сравнение", "Современный стиль чище и структурнее; контемпорари актуальнее и мягче; тихая роскошь тоньше; дизайн на заказ сильнее всего зависит от конкретного проекта."],
      [l(locale, "finalCta"), "Концепт Casaurum может связать вдохновение с практическими заметками по объему: комната, локация, тип объекта, направление материалов, бюджетный диапазон и сроки."],
    ],
  }[locale] || [];
  return content.map(([heading, body]) => ({ heading, body }));
}

function faqFor(locale, subject) {
  const content = {
    en: [
      [`What defines ${subject}?`, `${subject} is defined by proportion, materials, lighting, furniture scale and how well the design supports the room's function.`],
      [`Which materials work best for ${subject}?`, "Walnut, oak, natural stone, plaster, matte metal, textured fabric and restrained brass details are common premium directions."],
      [`Can CAS AURUM consult on ${subject}?`, "Yes. A useful inquiry includes location, project type, room photos or plans, desired style, budget range and timeline."],
      ["What should I send before requesting an estimate?", "Send room photos, rough dimensions, drawings if available, desired materials, project location, timeline and investment range."],
    ],
    es: [
      [`¿Qué define ${subject}?`, `${subject} se define por proporción, materiales, iluminación, escala del mobiliario y qué tan bien el diseño apoya la función del espacio.`],
      [`¿Qué materiales funcionan mejor para ${subject}?`, "Nogal, roble, piedra natural, yeso, metal mate, textiles con textura y detalles de latón contenido son direcciones premium habituales."],
      [`¿CAS AURUM puede asesorar sobre ${subject}?`, "Sí. Una consulta útil incluye ubicación, tipo de proyecto, fotos o planos, estilo deseado, rango de presupuesto y tiempos."],
      ["¿Qué debo enviar antes de solicitar un presupuesto?", "Envíe fotos, medidas aproximadas, planos si existen, materiales deseados, ubicación, plazo y rango de inversión."],
    ],
    fr: [
      [`Qu'est-ce qui définit ${subject} ?`, `${subject} se définit par les proportions, les matériaux, la lumière, l'échelle du mobilier et la manière dont le design soutient la fonction de la pièce.`],
      [`Quels matériaux conviennent le mieux à ${subject} ?`, "Le noyer, le chêne, la pierre naturelle, le plâtre, le métal mat, les textiles texturés et les détails laiton retenus sont des directions premium courantes."],
      [`CAS AURUM peut-il conseiller sur ${subject} ?`, "Oui. Une demande utile inclut le lieu, le type de projet, des photos ou plans, le style souhaité, une fourchette de budget et le calendrier."],
      ["Que faut-il envoyer avant de demander une estimation ?", "Envoyez photos, mesures approximatives, plans si disponibles, matériaux souhaités, lieu, calendrier et fourchette d'investissement."],
    ],
    ru: [
      [`Что определяет ${subject}?`, `${subject} определяется пропорциями, материалами, светом, масштабом мебели и тем, насколько дизайн поддерживает функцию комнаты.`],
      [`Какие материалы лучше подходят для ${subject}?`, "Орех, дуб, натуральный камень, штукатурка, матовый металл, фактурный текстиль и сдержанные латунные детали часто подходят для премиального направления."],
      [`Может ли CAS AURUM проконсультировать по ${subject}?`, "Да. Полезный запрос включает локацию, тип проекта, фото или планы, желаемый стиль, бюджетный диапазон и сроки."],
      ["Что отправить перед запросом расчета?", "Отправьте фото, примерные размеры, чертежи при наличии, желаемые материалы, локацию, сроки и инвестиционный диапазон."],
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
  if (page.pageType === "design-concept-market") {
    graph.push({
      "@type": "Service",
      "@id": `${page.canonicalUrl}#design-concept-service`,
      name: page.h1,
      provider: { "@type": "Organization", name: BRAND, url: BASE_URL },
      areaServed: page.citySlug === "atlanta" ? ["Atlanta", "Georgia", "United States"] : ["Georgia", "United States"],
      serviceType: ["premium interior design concept", "luxury interior design concept", "custom millwork concept", "wall panel concept", "custom furniture concept"],
      description: page.metaDescription,
    });
  }
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

function projectsSeoLink(locale) {
  const path = locale === "en" ? "/projects" : locale === "es" ? "/es/proyectos" : locale === "fr" ? "/fr/projets" : "/ru/proekty";
  return { href: path, label: completedProjectsLabel(locale) };
}

function completedProjectsLabel(locale) {
  return {
    en: "Completed Projects",
    es: "Proyectos realizados",
    fr: "Projets réalisés",
    ru: "Выполненные проекты",
  }[locale] || "Completed Projects";
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
    en: `${subject} should be planned as a connected custom project: style, room function, materials, lighting, furniture and storage need to support one another from the first project notes.`,
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
  if (pageType === "design-concept-market") return "0.78";
  if (["style", "room", "collection", "article"].includes(pageType)) return "0.75";
  if (pageType.startsWith("city")) return "0.68";
  return "0.62";
}
