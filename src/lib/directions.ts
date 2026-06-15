import { directions as fallbackDirections } from '@/data/directions';
import { fetchDirections, getStrapiImageUrl } from '@/lib/strapi';

type DirectionLike = {
  title: string;
  href?: string | null;
  id?: string | number;
  documentId?: string;
};

const SHOWROOM_PATH = '/showroom';
const EVENTS_PATH = '/events';
export const WORKSHOPS_PATH = '/workshops';
const CAFE_PATH = '/cafe';

function directionHaystack(direction: DirectionLike): string {
  return `${direction.id ?? ''} ${direction.documentId ?? ''} ${direction.title} ${direction.href ?? ''}`.toLowerCase();
}

export function isShowroomDirection(direction: DirectionLike): boolean {
  const haystack = directionHaystack(direction);
  return haystack.includes('шоурум') || haystack.includes('showroom');
}

export function isEventsDirection(direction: DirectionLike): boolean {
  const haystack = directionHaystack(direction);
  return (
    haystack.includes('мероприят') ||
    haystack.includes('событ') ||
    haystack.includes('events') ||
    haystack.includes('/events')
  );
}

/** Отдельная студия (не общая карточка раздела). */
function isNamedWorkshopStudio(direction: { title: string }): boolean {
  const title = direction.title.trim().toLowerCase();
  return title.includes('студия') || title.includes('лаборатор');
}

/** Агрегирующая карточка раздела «Мастерские» — ведет на страницу списка. */
export function isWorkshopsHubDirection(direction: DirectionLike): boolean {
  const title = direction.title.trim().toLowerCase();
  const href = (direction.href ?? '').trim().toLowerCase().replace(/\/$/, '');
  const slug = `${direction.id ?? ''}`.toLowerCase();
  const docId = `${direction.documentId ?? ''}`.toLowerCase();

  if (isNamedWorkshopStudio(direction)) return false;
  if (slug === 'workshop' || slug === 'workshops' || docId === 'workshop' || docId === 'workshops') {
    return true;
  }
  if (href === WORKSHOPS_PATH) return true;

  // Карточка раздела в Strapi: «Мастерская» / «Мастерские», не отдельные студии
  if (title === 'мастерская' || title === 'мастерские' || title === 'наши мастерские') {
    return true;
  }
  if (/^мастерск(ая|ие|ий)(\s|$)/.test(title) && title.length <= 40) return true;

  return false;
}

export function isCafeDirection(direction: DirectionLike): boolean {
  const haystack = directionHaystack(direction);
  return (
    haystack.includes('кофейн') ||
    haystack.includes('coffee') ||
    haystack.includes('кафе')
  );
}


/** Ссылка «Подробнее» для карточки направления. */
export function resolveDirectionHref(direction: DirectionLike): string {
  if (isShowroomDirection(direction)) {
    return SHOWROOM_PATH;
  }

  if (isEventsDirection(direction)) {
    return EVENTS_PATH;
  }

  if (isWorkshopsHubDirection(direction)) {
    return WORKSHOPS_PATH;
  }

  if (isCafeDirection(direction)) {
    return CAFE_PATH;
  }

  const href = direction.href?.trim();
  if (href) {
    return href;
  }

  if (direction.documentId) {
    return `/directions/${direction.documentId}`;
  }

  if (direction.id) {
    return `/directions/${direction.id}`;
  }

  return '#';
}

/** Картинка карточки «Мастерские» из статичного fallback (как на главной без CMS). */
export function getFallbackWorkshopsDirectionImage(): string {
  const workshops = fallbackDirections.find(
    (direction) =>
      direction.href === WORKSHOPS_PATH ||
      direction.id === 'workshops' ||
      isWorkshopsHubDirection(direction),
  );
  return workshops?.image ?? '';
}

/** То же фото, что у карточки «Мастерские» на главной: Strapi → fallback. */
export async function loadWorkshopsDirectionImage(): Promise<string> {
  try {
    const items = await fetchDirections();
    const workshops = items.find((item) => isWorkshopsHubDirection(item));
    const url = getStrapiImageUrl(workshops?.image ?? null);
    if (url) return url;
  } catch {
    // сеть или CMS недоступны — покажем fallback
  }

  return getFallbackWorkshopsDirectionImage();
}
