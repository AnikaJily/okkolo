/**
 * Фиксированные тарифы (ориентиры на 2025):
 * — Краснодар: курьер по городу, посылка до ~1–5 кг ≈ 280–400 ₽
 * — РФ: СДЭК/Почта из Краснодара, ближние города ≈ 225–350 ₽, Москва/ЦФО ≈ 265–400 ₽,
 *   дальние регионы ≈ 600–900 ₽ → для «остальной России» взят усредненный тариф.
 */
export const DELIVERY_PRICE_KRASNODAR = 350;
export const DELIVERY_PRICE_RUSSIA = 600;

const KRASNODAR_ALIASES = new Set([
  'краснодар',
  'krasnodar',
  'г краснодар',
  'город краснодар',
]);

function normalizeCity(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^г\.?\s*/u, '')
    .replace(/^город\s+/u, '');
}

export function isKrasnodarCity(city: string) {
  return KRASNODAR_ALIASES.has(normalizeCity(city));
}

export function getDeliveryPrice(city: string): number {
  const normalized = normalizeCity(city);
  if (!normalized) return 0;
  return isKrasnodarCity(normalized) ? DELIVERY_PRICE_KRASNODAR : DELIVERY_PRICE_RUSSIA;
}

export function getDeliveryZoneLabel(city: string): string {
  const normalized = normalizeCity(city);
  if (!normalized) return '';
  return isKrasnodarCity(normalized)
    ? `Краснодар — ${DELIVERY_PRICE_KRASNODAR} ₽`
    : `По России — ${DELIVERY_PRICE_RUSSIA} ₽`;
}
