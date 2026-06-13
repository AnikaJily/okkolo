export const SUPPORT_HREF = 'mailto:hello@okkolo.ru';

/**
 * Телефон для записи в мастерские.
 * CONTACT_PHONE — формат E.164 для ссылки tel: (например '+79181234567').
 * Пока номер не подтверждён заказчицей — пустая строка: кнопка «Позвонить»
 * на странице мастерских не показывается, остаётся форма заявки.
 */
export const CONTACT_PHONE = '';
export const CONTACT_PHONE_DISPLAY = '';

export const OKKOLO_ADDRESS = 'Краснодар, ул. Зиповская, 9К';
export const OKKOLO_MAP_URL = 'https://2gis.ru/krasnodar/firm/70000001067242910';

/* Порядок — по макету Figma */
export const NAV_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'Мероприятия', href: '/events' },
  { label: 'Шоурум', href: '/showroom' },
  { label: 'Мастерские', href: '/workshops' },
  { label: 'Кофейня', href: '/cafe' },
  { label: 'Доступность', href: '/accessibility' },
] as const;
