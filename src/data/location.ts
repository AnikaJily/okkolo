import { ACCESSIBILITY_HREF, OKKOLO_ADDRESS, OKKOLO_HOURS, OKKOLO_MAP_EMBED_URL, OKKOLO_MAP_URL } from '@/data/site';

/** Единый источник блока «Как нас найти» (главная, мастерские и др.). */
export const LOCATION_SECTION = {
  id: 'location',
  heading: 'Как нас найти',
  lead:
    'Заходите на чашку кофе или на мероприятие — мы на первом этаже, пандус есть у входа',
  addressLabel: 'Адрес',
  hoursLabel: 'Часы работы',
  mapButtonLabel: 'Открыть в Яндекс Картах',
  accessibilityButtonLabel: 'Подробнее о доступности',
  address: OKKOLO_ADDRESS,
  hours: OKKOLO_HOURS,
  mapUrl: OKKOLO_MAP_URL,
  mapEmbedUrl: OKKOLO_MAP_EMBED_URL,
  accessibilityHref: ACCESSIBILITY_HREF,
} as const;
