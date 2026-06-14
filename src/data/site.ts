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
export const OKKOLO_MAP_URL = 'https://2gis.ru/krasnodar/firm/70000001067242910';
export const ACCESSIBILITY_HREF = '/accessibility';

/**
 * Координаты пространства для embed-карты на главной (OpenStreetMap).
 * Сейчас — приближенные значения по Зиповской; уточнить с командой и подправить.
 */
export const OKKOLO_COORDINATES = { lat: 45.0589, lng: 38.9608 } as const;

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
