import { locales, defaultLocale } from "./locales.js";

export function localizedSeoPath(locale, path = "/") {
  const safeLocale = locales.includes(locale) ? locale : defaultLocale;
  return `/${safeLocale}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/+/g, "/");
}

export function hreflangAlternates(path = "/") {
  return Object.fromEntries([...locales, "x-default"].map((locale) => [locale, localizedSeoPath(locale === "x-default" ? defaultLocale : locale, path)]));
}
