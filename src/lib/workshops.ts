import type { Direction } from '@/data/directions';
import { directions as fallbackDirections } from '@/data/directions';
import {
  isWorkshopsListingDirection,
  resolveDirectionHref,
} from '@/lib/directions';
import { fetchDirections, getStrapiImageUrl, type StrapiDirectionItem } from '@/lib/strapi';

/** Локальные демо-студии: показываем вместе с записями из Strapi (пока в CMS не все мастерские). */
const DEMO_STUDIO_IDS = new Set([
  'studio-ceramics',
  'studio-textile',
  'studio-jewelry',
  'studio-print',
]);

function normalizeWorkshopTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

function mergeWorkshopsWithDemos(fromApi: Direction[]): Direction[] {
  const localDemos = fallbackDirections.filter((d) => DEMO_STUDIO_IDS.has(d.id));
  const apiRows = fromApi.filter((d) => d.title.trim().length > 0);
  const titles = new Set(apiRows.map((d) => normalizeWorkshopTitle(d.title)));
  const extraDemos = localDemos.filter((d) => !titles.has(normalizeWorkshopTitle(d.title)));
  return [...apiRows, ...extraDemos];
}

function directionPlainDescription(value: unknown): string {
  if (typeof value === 'string') return value;
  return '';
}

function strapiItemToDirection(item: StrapiDirectionItem): Direction {
  const id =
    (item.documentId && String(item.documentId).trim()) ||
    (item.id != null && `strapi-id-${item.id}`) ||
    `strapi-untitled-${normalizeWorkshopTitle(item.title)}`;

  return {
    id,
    title: item.title,
    description: directionPlainDescription(item.description as unknown),
    href: resolveDirectionHref({
      title: item.title,
      href: item.href,
      documentId: item.documentId,
    }),
    image: getStrapiImageUrl(item.image) ?? '',
  };
}

export function filterWorkshopsDirections(directions: Direction[]): Direction[] {
  return directions.filter((d) =>
    isWorkshopsListingDirection({
      title: d.title,
      href: d.href,
      id: d.id,
      documentId: d.id,
    }),
  );
}

function enrichDirections(list: Direction[], demos: Direction[]): Direction[] {
  return list.map((direction) => {
    if (direction.workshop) return direction;
    const demo = demos.find(
      (d) =>
        d.id === direction.id ||
        d.title.trim().toLowerCase() === direction.title.trim().toLowerCase(),
    );
    if (!demo?.workshop) return direction;
    return {
      ...direction,
      workshop: demo.workshop,
      description: direction.description.trim() ? direction.description : demo.description,
      image: direction.image || demo.image,
    };
  });
}

export async function loadWorkshopsDirections(): Promise<Direction[]> {
  const fallback = filterWorkshopsDirections(fallbackDirections);
  const demos = fallbackDirections.filter((d) => DEMO_STUDIO_IDS.has(d.id));
  try {
    const items = await fetchDirections();
    if (items.length === 0) return enrichDirections(fallback, demos);
    const fromApi = filterWorkshopsDirections(items.map(strapiItemToDirection));
    const merged = mergeWorkshopsWithDemos(fromApi);
    return enrichDirections(merged.length > 0 ? merged : fallback, demos);
  } catch {
    return enrichDirections(fallback, demos);
  }
}
