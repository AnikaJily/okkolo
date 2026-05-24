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

/** Агрегирующая карточка раздела «Мастерские» — ведёт на страницу списка. */
export function isWorkshopsHubDirection(direction: {
  title: string;
  href?: string | null;
  id?: string;
  documentId?: string;
}): boolean {
  const title = direction.title.trim().toLowerCase();
  const slug = `${direction.id ?? ''}`.toLowerCase();
  const docId = `${direction.documentId ?? ''}`.toLowerCase();

  // Только общая карточка раздела, не студии со ссылкой на /workshops в Strapi
  return title === 'мастерские' || slug === 'workshops' || docId === 'workshops';
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

/** Направления, которые показываются на странице «Мастерские» (отдельные студии и мастерские). */
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
