import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { SUPPORT_HREF } from '@/data/site';
import {
  collectStrapiImageUrls,
  fetchEvents,
  getStrapiResponsiveImage,
  type StrapiEventItem,
} from '@/lib/strapi';

const eventDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

const eventPriceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatEventDate(date: string) {
  return eventDateFormatter.format(new Date(date));
}

function formatEventAdmission(isPaid: boolean, price?: number | null) {
  if (!isPaid) return 'Вход бесплатный';
  return price ? eventPriceFormatter.format(price) : 'Платное мероприятие';
}

export function toEvent(item: StrapiEventItem, index: number): OkkoloEvent {
  const isPaid = item.isPaid ?? false;
  /* slug — приоритетный идентификатор в URL; documentId — фоллбэк до миграции */
  const slug = item.slug?.trim() || item.documentId;
  const galleryUrls = collectStrapiImageUrls(item.photo, item.gallery);
  const cover = galleryUrls[0] ?? fallbackEvents[index]?.image ?? fallbackEvents[0].image;
  /* обложку для карточки берём из того же первого изображения (photo → первый кадр галереи) */
  const responsive = getStrapiResponsiveImage(item.photo ?? item.gallery?.[0] ?? null);

  return {
    id: slug,
    title: item.title,
    date: item.date,
    dateLabel: formatEventDate(item.date),
    admission: formatEventAdmission(isPaid, item.price),
    type: item.type?.trim() || undefined,
    description: item.description ?? undefined,
    href: `/events/${slug}`,
    signupHref: SUPPORT_HREF,
    isPaid,
    price: item.price ?? undefined,
    image: cover,
    imageSrcSet: responsive?.srcSet || undefined,
    imageWidth: responsive?.width,
    imageHeight: responsive?.height,
  };
}

export const HOME_UPCOMING_EVENTS_LIMIT = 3;

/**
 * Ближайшие предстоящие мероприятия (для блока на главной).
 * Если предстоящих нет — показываем последние прошедшие, чтобы секция
 * с карточками не оставалась пустой (как в макете всегда 3 карточки).
 */
export function selectUpcomingEvents(
  events: OkkoloEvent[],
  limit = HOME_UPCOMING_EVENTS_LIMIT,
): OkkoloEvent[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const valid = events.filter(
    (event) => !Number.isNaN(new Date(event.date).getTime()),
  );

  const upcoming = valid
    .filter((event) => new Date(event.date) >= todayStart)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);

  if (upcoming.length > 0) return upcoming;

  return valid
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function loadEvents() {
  const items = await fetchEvents();
  return items.map(toEvent);
}

export async function loadEventById(eventId: string) {
  const events = await loadEvents();
  /* eventId из URL может быть slug, documentId или legacy-ид мока */
  return events.find(
    (event) => event.id === eventId || event.href.endsWith(`/${eventId}`),
  );
}
