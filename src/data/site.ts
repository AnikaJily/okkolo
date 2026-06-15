export const SUPPORT_HREF = 'mailto:hello@okkolo.ru';
export const CONTACT_EMAIL = 'hello@okkolo.ru';

/**
 * Телефон для записи в мастерские.
 * CONTACT_PHONE — формат E.164 для ссылки tel: (например '+79181234567').
 * Пока номер не подтвержден — показываем CONTACT_PHONE_PLACEHOLDER из макета.
 */
export const CONTACT_PHONE = '';
export const CONTACT_PHONE_DISPLAY = '';
export const CONTACT_PHONE_PLACEHOLDER = '+7 (000) 000-00-00';
export const CONTACT_PHONE_HOURS = ['Пн–Чт 11:00–18:00', 'Пт–Вс 12:00–20:00'] as const;

export const OKKOLO_ADDRESS = 'Краснодар, ул. Зиповская, 9К';
export const ACCESSIBILITY_HREF = '/accessibility';

/**
 * Координаты пространства для карты на главной (Яндекс Карты).
 * Сейчас — приближенные значения по Зиповской; уточнить с командой и подправить.
 */
export const OKKOLO_COORDINATES = { lat: 45.0589, lng: 38.9608 } as const;

const { lat: OKKOLO_LAT, lng: OKKOLO_LNG } = OKKOLO_COORDINATES;

export const OKKOLO_MAP_URL = `https://yandex.ru/maps/?ll=${OKKOLO_LNG}%2C${OKKOLO_LAT}&z=17&pt=${OKKOLO_LNG}%2C${OKKOLO_LAT}&text=${encodeURIComponent(OKKOLO_ADDRESS)}`;

export const OKKOLO_MAP_EMBED_URL = `https://yandex.ru/map-widget/v1/?ll=${OKKOLO_LNG}%2C${OKKOLO_LAT}&z=17&pt=${OKKOLO_LNG}%2C${OKKOLO_LAT}&lang=ru_RU`;

/**
 * Часы работы пространства (не путать с CONTACT_PHONE_HOURS — там часы для звонков).
 * Подтвердить с командой; пока копируем значения из CONTACT_PHONE_HOURS.
 */
export const OKKOLO_HOURS = [
  { days: 'Пн–Чт', time: '11:00–18:00' },
  { days: 'Пт–Вс', time: '12:00–20:00' },
] as const;

/* Порядок — по макету Figma */
export const NAV_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'О нас', href: '/about' },
  { label: 'Мероприятия', href: '/events' },
  { label: 'Шоурум', href: '/showroom' },
  { label: 'Мастерские', href: '/workshops' },
  { label: 'Кофейня', href: '/cafe' },
  { label: 'Доступность', href: '/accessibility' },
  { label: 'Отчеты', href: '/reports' },
] as const;

/**
 * Inline-навигация в шапке (порядок по макету Figma).
 * Приоритет управляет тем, на какой ширине пункт прячется в меню-бургер:
 *   - 'always' — всегда виден, когда вообще показывается inline-навигация;
 *   - 'wide'   — прячется на узких десктопах, чтобы освободить место остальным;
 *   - 'xwide'  — только на самых широких экранах.
 * Иконка меню видна на любых ширинах и открывает полный список из NAV_ITEMS.
 */
export type HeaderNavPriority = 'always' | 'wide' | 'xwide';

export const HEADER_NAV: ReadonlyArray<{
  label: string;
  href: string;
  priority: HeaderNavPriority;
}> = [
  { label: 'Главная', href: '/', priority: 'always' },
  { label: 'Мероприятия', href: '/events', priority: 'always' },
  { label: 'Шоурум', href: '/showroom', priority: 'wide' },
  { label: 'Мастерские', href: '/workshops', priority: 'always' },
  { label: 'Кофейня', href: '/cafe', priority: 'always' },
  { label: 'Доступность', href: '/accessibility', priority: 'always' },
  { label: 'О нас', href: '/about', priority: 'xwide' },
  { label: 'Отчеты', href: '/reports', priority: 'xwide' },
];
