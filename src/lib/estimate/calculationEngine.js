import { catalogById } from "./priceCatalog.js";

const catalog = catalogById();

export function calculateLineItem(lineItem, section = {}) {
  const item = { ...lineItem };
  const catalogItem = catalog[item.catalogId || item.materialCode] || {};
  const unit = item.unit || catalogItem.unit || "manual";
  const area = section.allowAreaOverride && Number(section.billableAreaSqFt) > 0
    ? Number(section.billableAreaSqFt)
    : Number(section.calculatedAreaSqFt || 0);
  const unitPrice = numberOr(item.unitPrice, catalogItem.defaultUnitPrice, 0);
  const unitPriceMin = numberOr(item.unitPriceMin, catalogItem.unitPriceMin, unitPrice);
  const unitPriceMax = numberOr(item.unitPriceMax, catalogItem.unitPriceMax, unitPriceMin);
  let qty = numberOr(item.qty, 0);
  let qtyMin = numberOr(item.qtyMin, qty);
  let qtyMax = numberOr(item.qtyMax, qtyMin);

  if (unit === "sq_ft" && !qty && !qtyMin && !qtyMax) {
    qty = area;
    qtyMin = numberOr(item.qtyMin, qty);
    qtyMax = numberOr(item.qtyMax, qtyMin);
  }
  if (unit === "fixed") {
    qty = qty || 1;
    qtyMin = numberOr(item.qtyMin, 1);
    qtyMax = numberOr(item.qtyMax, 1);
  }
  if (unit === "manual") {
    const totalMin = numberOr(item.totalMin, item.total, 0);
    const totalMax = numberOr(item.totalMax, item.total, totalMin);
    return { ...item, unit, qty, qtyMin, qtyMax, unitPrice, unitPriceMin, unitPriceMax, total: numberOr(item.total, totalMin), totalMin, totalMax, formulaText: item.formulaText || "manual amount" };
  }

  const totalMin = roundMoney(qtyMin * unitPriceMin);
  const totalMax = roundMoney(qtyMax * unitPriceMax);
  return {
    ...item,
    unit,
    qty: roundQty(qty || qtyMin),
    qtyMin: roundQty(qtyMin),
    qtyMax: roundQty(qtyMax),
    unitPrice,
    unitPriceMin,
    unitPriceMax,
    total: roundMoney((qty || qtyMin) * unitPrice),
    totalMin,
    totalMax,
    formulaText: item.formulaText || formulaFor(unit, qtyMin, qtyMax, unitPriceMin, unitPriceMax),
  };
}

export function calculateSection(section = {}) {
  const calculatedAreaSqFt = Number(section.calculatedAreaSqFt || (Number(section.widthFt || 0) * Number(section.heightFt || 0)));
  const base = { ...section, calculatedAreaSqFt };
  const lineItems = (section.lineItems || []).map((item) => calculateLineItem(item, base));
  const options = (section.options || []).map((option) => calculateOption(option, base));
  const selectedOptions = options.filter((option) => option.isSelected);
  const itemTotals = [...lineItems, ...selectedOptions];
  const subtotalMin = roundMoney(itemTotals.reduce((sum, item) => sum + Number(item.subtotalMin ?? item.totalMin ?? 0), 0));
  const subtotalMax = roundMoney(itemTotals.reduce((sum, item) => sum + Number(item.subtotalMax ?? item.totalMax ?? 0), 0));
  return { ...base, lineItems, options, subtotalMin, subtotalMax };
}

export function calculateOption(option = {}, section = {}) {
  const lineItems = (option.lineItems || []).map((item) => calculateLineItem(item, section));
  const subtotalMin = roundMoney(lineItems.reduce((sum, item) => sum + Number(item.totalMin || 0), 0));
  const subtotalMax = roundMoney(lineItems.reduce((sum, item) => sum + Number(item.totalMax || 0), 0));
  return { ...option, lineItems, subtotalMin, subtotalMax };
}

export function calculateZone(zone = {}) {
  const sections = (zone.sections || []).map(calculateSection);
  const subtotalMin = roundMoney(sections.reduce((sum, section) => sum + Number(section.subtotalMin || 0), 0));
  const subtotalMax = roundMoney(sections.reduce((sum, section) => sum + Number(section.subtotalMax || 0), 0));
  return { ...zone, sections, subtotalMin, subtotalMax };
}

export function calculateEstimate(estimate = {}) {
  const zones = (estimate.zones || []).map(calculateZone);
  const calculatedTotalMin = roundMoney(zones.reduce((sum, zone) => sum + Number(zone.subtotalMin || 0), 0));
  const calculatedTotalMax = roundMoney(zones.reduce((sum, zone) => sum + Number(zone.subtotalMax || 0), 0));
  const finalTotalMin = numberOr(estimate.finalTotalMin, calculatedTotalMin + Number(estimate.adjustmentAmountMin || 0));
  const finalTotalMax = numberOr(estimate.finalTotalMax, calculatedTotalMax + Number(estimate.adjustmentAmountMax || 0));
  return {
    ...estimate,
    zones,
    calculatedTotalMin,
    calculatedTotalMax,
    finalTotalMin: roundMoney(finalTotalMin),
    finalTotalMax: roundMoney(finalTotalMax),
    adjustmentAmountMin: roundMoney(finalTotalMin - calculatedTotalMin),
    adjustmentAmountMax: roundMoney(finalTotalMax - calculatedTotalMax),
  };
}

export function proposalDataFromEstimate(estimate = {}) {
  const calculated = calculateEstimate(estimate);
  return {
    clientName: calculated.clientName || "",
    address: calculated.address || "",
    date: calculated.createdAt || new Date().toISOString(),
    installationIncluded: calculated.installationIncluded ?? true,
    zones: calculated.zones.map((zone) => ({
      title: zone.displayName || zone.name,
      images: zone.images || [],
      items: zone.sections.flatMap((section) => section.lineItems.filter((item) => item.clientVisible !== false && !item.excluded).map((item) => item.name)),
      subtotalMin: zone.subtotalMin,
      subtotalMax: zone.subtotalMax,
    })),
    totalMin: calculated.finalTotalMin,
    totalMax: calculated.finalTotalMax,
    companyInfo: "CAS AURUM",
    notes: calculated.clientNote || "Final pricing may change after field measurements, material selection, engineering details and installation review.",
  };
}

function formulaFor(unit, qtyMin, qtyMax, priceMin, priceMax) {
  if (unit === "fixed") return `fixed allowance ${money(priceMin)}-${money(priceMax)}`;
  const qtyText = qtyMin === qtyMax ? qtyMin : `${qtyMin}-${qtyMax}`;
  const priceText = priceMin === priceMax ? money(priceMin) : `${money(priceMin)}-${money(priceMax)}`;
  return `${qtyText} ${unit} x ${priceText}`;
}

function numberOr(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return 0;
}

function roundMoney(value) {
  return Math.round(Number(value || 0));
}

function roundQty(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function money(value) {
  return `$${Math.round(Number(value || 0)).toLocaleString("en-US")}`;
}
