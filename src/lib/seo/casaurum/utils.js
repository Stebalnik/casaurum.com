export function titleCase(slug) {
  return String(slug).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
