const SHOWROOM_PATH = '/showroom';
const EVENTS_PATH = '/events';
const WORKSHOPS_PATH = '/workshops';

function directionHaystack(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): string {
  return `${direction.id ?? ''} ${direction.documentId ?? ''} ${direction.title} ${direction.href ?? ''}`.toLowerCase();
}

export function isShowroomDirection(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): boolean {
  const haystack = directionHaystack(direction);
  return haystack.includes('шоурум') || haystack.includes('showroom');
}

export function isEventsDirection(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): boolean {
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

/** Агрегирующая карточка раздела «Мастерские» — ведёт на страницу списка. */
export function isWorkshopsHubDirection(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): boolean {
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

export function isCafeDirection(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): boolean {
  const haystack = directionHaystack(direction);
  return (
    haystack.includes('кофейн') ||
    haystack.includes('coffee') ||
    haystack.includes('кафе')
  );
}

type DirectionLike = {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
};

/** Направления, которые показываются на странице «Мастерские» (отдельные студии). */
export function isWorkshopsListingDirection(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): boolean {
  if (isShowroomDirection(direction) || isEventsDirection(direction)) return false;
  if (isCafeDirection(direction)) return false;
  if (isWorkshopsHubDirection(direction)) return false;
  return true;
}

/** Ссылка «Подробнее» для карточки направления. */
export function resolveDirectionHref(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): string {
  if (isShowroomDirection(direction)) {
    return SHOWROOM_PATH;
  }

  if (isEventsDirection(direction)) {
    return EVENTS_PATH;
  }

  if (isWorkshopsHubDirection(direction)) {
    return WORKSHOPS_PATH;
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
