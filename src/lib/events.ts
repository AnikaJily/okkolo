import { events as fallbackEvents } from '@/data/events';
import type { OkkoloEvent } from '@/data/events';
import { SUPPORT_HREF } from '@/data/site';
import {
  fetchEvents,
  getStrapiImageUrl,
  type StrapiEventItem,
} from '@/lib/strapi';

const eventDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const eventPriceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatEventDate(date: string) {
  return eventDateFormatter.format(new Date(date)).replace('.', '');
}

function formatEventAdmission(isPaid: boolean, price?: number | null) {
  if (!isPaid) return 'Вход бесплатный';
  return price ? eventPriceFormatter.format(price) : 'Платное мероприятие';
}

export function toEvent(item: StrapiEventItem, index: number): OkkoloEvent {
  const isPaid = item.isPaid ?? false;

  return {
    id: item.documentId,
    title: item.title,
    date: item.date,
    dateLabel: formatEventDate(item.date),
    admission: formatEventAdmission(isPaid, item.price),
    description: item.description ?? undefined,
    href: item.href ?? `/events/${item.documentId}`,
    signupHref: item.signupHref ?? SUPPORT_HREF,
    isPaid,
    price: item.price ?? undefined,
    paymentUrl: item.paymentUrl ?? undefined,
    image: getStrapiImageUrl(item.photo) ?? fallbackEvents[index]?.image ?? fallbackEvents[0].image,
  };
}

export async function loadEvents() {
  const items = await fetchEvents();
  return items.map(toEvent);
}

export async function loadEventById(eventId: string) {
  const events = await loadEvents();
  return events.find((event) => event.id === eventId || event.href.endsWith(`/${eventId}`));
}
