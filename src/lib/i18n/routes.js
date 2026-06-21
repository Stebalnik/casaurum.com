import { locales, defaultLocale, localePrefixes, hreflangCodes } from "./locales.js";

export function localizedSeoPath(locale, path = "/") {
  const safeLocale = locales.includes(locale) ? locale : defaultLocale;
  const prefix = localePrefixes[safeLocale] || "";
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/+/g, "/") || "/";
}

export function hreflangAlternates(path = "/") {
  return Object.fromEntries([...locales, "x-default"].map((locale) => [locale === "x-default" ? "x-default" : hreflangCodes[locale], localizedSeoPath(locale === "x-default" ? defaultLocale : locale, path)]));
}
