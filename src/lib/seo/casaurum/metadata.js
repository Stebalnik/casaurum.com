export function metadataForPage(page) {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    canonical: page.canonicalUrl,
    openGraph: page.openGraph,
    robots: page.indexable ? "index,follow" : "noindex,follow",
  };
}
