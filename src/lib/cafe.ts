import type { PictureSource } from '@/components/ui/Picture';
import { cafeMenus as fallbackMenus } from '@/data/cafe';
import {
  fetchCafeMenuPage,
  fetchMenuItems,
  getStrapiImageUrl,
  type StrapiCafeMenuPage,
  type StrapiMenuCategory,
  type StrapiMenuItem,
  type StrapiMenuSeason,
} from '@/lib/strapi';

/**
 * Меню для рендера на странице кофейни. Картинка может быть либо набором
 * статичных форматов (avif/webp/jpg) из ассетов, либо одним URL из CMS.
 */
export interface CafeMenuItemView {
  name: string;
  volume?: string;
  price: string;
  note?: string;
}

export interface CafeMenuSectionView {
  title: string;
  items: CafeMenuItemView[];
}

export interface CafeMenuView {
  id: string;
  title: string;
  alt: string;
  picture?: PictureSource;
  imageUrl?: string;
  sections: CafeMenuSectionView[];
  footnote?: string;
}

const SEASON_ORDER: StrapiMenuSeason[] = ['main', 'summer', 'winter'];

const SEASON_META: Record<StrapiMenuSeason, { id: string; title: string }> = {
  main: { id: 'main', title: 'Основное меню' },
  summer: { id: 'summer', title: 'Летнее меню' },
  winter: { id: 'winter', title: 'Зимнее меню' },
};

const CATEGORY_ORDER: StrapiMenuCategory[] = [
  'coffee',
  'tea',
  'signature',
  'cold',
  'lemonade',
  'topping',
];

const CATEGORY_TITLES: Record<StrapiMenuCategory, string> = {
  coffee: 'Кофе',
  tea: 'Чай',
  signature: 'Авторские',
  topping: 'Топинги',
  cold: 'Холодные напитки',
  lemonade: 'Лимонады',
};

function isKnownSeason(value: string): value is StrapiMenuSeason {
  return value === 'main' || value === 'summer' || value === 'winter';
}

function isKnownCategory(value: string): value is StrapiMenuCategory {
  return CATEGORY_ORDER.includes(value as StrapiMenuCategory);
}

function toItemView(item: StrapiMenuItem): CafeMenuItemView {
  return {
    name: item.name,
    price: item.price,
    volume: item.volume?.trim() || undefined,
    note: item.note?.trim() || undefined,
  };
}

function buildSectionsForSeason(
  season: StrapiMenuSeason,
  items: StrapiMenuItem[],
): CafeMenuSectionView[] {
  const seasonItems = items.filter((item) => item.season === season);
  if (seasonItems.length === 0) return [];

  const grouped = new Map<StrapiMenuCategory, StrapiMenuItem[]>();
  for (const item of seasonItems) {
    if (!isKnownCategory(item.category)) continue;
    const bucket = grouped.get(item.category) ?? [];
    bucket.push(item);
    grouped.set(item.category, bucket);
  }

  const sections: CafeMenuSectionView[] = [];
  for (const category of CATEGORY_ORDER) {
    const bucket = grouped.get(category);
    if (!bucket || bucket.length === 0) continue;
    const sorted = [...bucket].sort((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name, 'ru');
    });
    sections.push({
      title: CATEGORY_TITLES[category],
      items: sorted.map(toItemView),
    });
  }
  return sections;
}

function pickPosterFor(
  season: StrapiMenuSeason,
  page: StrapiCafeMenuPage | null,
): { imageUrl?: string; alt?: string } {
  if (!page) return {};
  if (season === 'main') {
    return {
      imageUrl: getStrapiImageUrl(page.mainPosterImage) ?? undefined,
      alt: page.mainPosterAlt?.trim() || undefined,
    };
  }
  if (season === 'summer') {
    return {
      imageUrl: getStrapiImageUrl(page.summerPosterImage) ?? undefined,
      alt: page.summerPosterAlt?.trim() || undefined,
    };
  }
  return {};
}

function fallbackPosterFor(
  season: StrapiMenuSeason,
): { picture?: PictureSource; alt?: string; title?: string } {
  const fallback = fallbackMenus.find((menu) => menu.id === season);
  if (!fallback) return {};
  return {
    picture: fallback.picture,
    alt: fallback.alt,
    title: fallback.title,
  };
}

function buildMenuFromCms(
  page: StrapiCafeMenuPage | null,
  items: StrapiMenuItem[],
): CafeMenuView[] {
  const seasonsWithItems = new Set<StrapiMenuSeason>();
  for (const item of items) {
    if (isKnownSeason(item.season)) seasonsWithItems.add(item.season);
  }

  const menus: CafeMenuView[] = [];

  for (const season of SEASON_ORDER) {
    const sections = buildSectionsForSeason(season, items);
    if (sections.length === 0 && !seasonsWithItems.has(season)) continue;

    const meta = SEASON_META[season];
    const poster = pickPosterFor(season, page);
    const fallback = fallbackPosterFor(season);
    const imageUrl = poster.imageUrl;
    const picture = imageUrl ? undefined : fallback.picture;
    const alt = poster.alt || fallback.alt || meta.title;
    /* footnote из CMS общий для всех меню — кладём только в основное, чтобы не дублировать */
    const footnote =
      season === 'main' ? page?.footnote?.trim() || undefined : undefined;

    menus.push({
      id: meta.id,
      title: meta.title,
      alt,
      picture,
      imageUrl,
      sections,
      footnote,
    });
  }

  return menus;
}

export function cafeMenusFromFallback(): CafeMenuView[] {
  return fallbackMenus.map((menu) => ({
    id: menu.id,
    title: menu.title,
    alt: menu.alt,
    picture: menu.picture,
    sections: menu.sections.map((section) => ({
      title: section.title,
      items: section.items.map((item) => ({
        name: item.name,
        price: item.price,
        volume: item.volume,
        note: item.note,
      })),
    })),
    footnote: menu.footnote,
  }));
}

export interface LoadCafeMenusResult {
  menus: CafeMenuView[];
  /** true — данные взяты из локальных моков (CMS не отвечает или пуста). */
  isFallback: boolean;
}

export async function loadCafeMenus(): Promise<LoadCafeMenusResult> {
  try {
    const [page, items] = await Promise.all([
      fetchCafeMenuPage().catch(() => null),
      fetchMenuItems(),
    ]);
    const menus = buildMenuFromCms(page, items);
    if (menus.length > 0) return { menus, isFallback: false };
  } catch (error) {
    console.error('loadCafeMenus: fallback на статичные меню', error);
  }
  return { menus: cafeMenusFromFallback(), isFallback: true };
}
