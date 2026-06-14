import { CONTACT_EMAIL, OKKOLO_ADDRESS, OKKOLO_MAP_URL } from '@/data/site';

/**
 * Контент страницы «О нас» (/about).
 *
 * Источник истины — официальная презентация «Окколо» (дек «ОККОЛО ПРЕЗА-6»,
 * 8 слайдов). Все факты, цифры, формулировки и состав команды взяты оттуда —
 * не добавляй сюда неподтверждённых данных (цены, расписания, новые имена).
 * Фотографии пока не загружены: страница рендерит плейсхолдеры.
 */

/* ── Интро (слайд 1) ─────────────────────────────────────────────── */
export const ABOUT_INTRO = {
  eyebrow: 'О нас',
  title: '«Окколо» — это инклюзивный социальный проект',
  lead: 'Мы обучаем, создаём рабочие места и включаем в общественную жизнь людей с инвалидностью на базе кофейни, швейной и гончарной мастерских.',
  tagline: 'Строим мир равных возможностей. Вместе.',
} as const;

/* ── Миссия и проблема (слайд 2) ─────────────────────────────────── */
export interface AboutProblem {
  id: string;
  text: string;
}

export const ABOUT_MISSION = {
  context:
    'Краснодар — социально активный город, где актуальны вопросы развития инклюзии.',
  problemsTitle: 'С какими проблемами мы работаем',
  conclusion:
    'Наша задача — обеспечить не количество участников, а качество их интеграции в общественную и экономическую жизнь города.',
} as const;

export const ABOUT_PROBLEMS: readonly AboutProblem[] = [
  { id: 'isolation', text: 'Социальная изоляция людей с инвалидностью.' },
  { id: 'gap', text: 'Разрыв между творчеством и работой.' },
  {
    id: 'stereotypes',
    text: 'Стереотипы в обществе в отношении людей с инвалидностью.',
  },
  { id: 'spaces', text: 'Недостаток инклюзивных пространств.' },
];

/* ── «Окколо» сегодня — в цифрах (слайды 3–5) ────────────────────── */
export interface AboutStat {
  id: string;
  value: string;
  label: string;
}

export const ABOUT_STATS: readonly AboutStat[] = [
  { id: 'jobs', value: '12', label: 'человек трудоустроены на постоянной основе' },
  { id: 'community', value: '30+', label: 'участников регулярно вовлечены в жизнь проекта' },
  { id: 'trained', value: '20', label: 'человек прошли обучение на нашей площадке' },
  { id: 'since', value: '2022', label: 'год, с которого работает «Окколо»' },
];

/* ── Рабочие места: кто и где работает (слайд 3) ─────────────────── */
export interface AboutJob {
  id: string;
  title: string;
  text: string;
}

export const ABOUT_JOBS_INTRO =
  '12 человек трудоустроены на постоянной основе в кофейне и мастерских.';

export const ABOUT_JOBS: readonly AboutJob[] = [
  {
    id: 'cafe',
    title: 'Кофейня',
    text: 'Бариста с нарушением слуха — язык жестов стал частью сервиса.',
  },
  {
    id: 'ceramics',
    title: 'Гончарная мастерская',
    text: 'Керамист с ампутацией ног создаёт авторскую посуду и проводит обучающие мастер-классы.',
  },
  {
    id: 'sewing',
    title: 'Швейная мастерская',
    text: 'Мастера с ДЦП, ментальными особенностями и нарушением слуха шьют стильный мерч.',
  },
  {
    id: 'admin',
    title: 'Администратор событийной площадки',
    text: 'С протезом ноги встречает гостей и записывает их на мероприятия.',
  },
];

/* ── Чем мы живём: сообщество, события, обучение, инкубатор (слайды 4–5) ── */
export interface AboutFeature {
  id: string;
  title: string;
  text: string;
}

export const ABOUT_FEATURES: readonly AboutFeature[] = [
  {
    id: 'community',
    title: 'Инклюзивное сообщество',
    text: '30+ участников регулярно вовлечены в мероприятия, мастер-классы и продают свою продукцию через наш шоурум.',
  },
  {
    id: 'events',
    title: 'Событийная площадка',
    text: 'Киновечера, лекции и мастер-классы, совместные мероприятия с другими организациями города.',
  },
  {
    id: 'education',
    title: 'Обучение и развитие',
    text: '20 человек прошли обучение на нашей площадке с 2022 года.',
  },
  {
    id: 'incubator',
    title: 'Бизнес-инкубатор «Зерно»',
    text: 'Акселератор от бизнес-идеи до её реализации для будущих предпринимателей с инвалидностью.',
  },
];

/* ── Партнёры (слайд 6). Логотипы пока не загружены — выводим названия ── */
export interface AboutPartner {
  id: string;
  name: string;
}

export const ABOUT_PARTNERS: readonly AboutPartner[] = [
  { id: 'sber', name: 'Сбербанк' },
  { id: 'magnit', name: 'Магнит' },
  { id: 'ozk', name: 'Объединённая зерновая компания' },
  { id: 'damate', name: 'Damate' },
];

/* ── Команда (слайд 7) — порядок как в деке ──────────────────────── */
export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
}

export const ABOUT_TEAM: readonly AboutTeamMember[] = [
  { id: 'yamaletdinova', name: 'Яна Ямалетдинова', role: 'Руководитель' },
  { id: 'yavnik', name: 'Екатерина Явник', role: 'PR-менеджер' },
  { id: 'dorozhko', name: 'Анна Дорожко', role: 'Арт-менеджер' },
  { id: 'usanova', name: 'Виктория Усанова', role: 'Куратор кофейни' },
  { id: 'falej', name: 'Елизавета Фалей', role: 'Бариста' },
  { id: 'ivanchikova', name: 'Милана Иванчикова', role: 'Бариста' },
  { id: 'krivosheina', name: 'Елена Кривошеина', role: 'Куратор швейной мастерской' },
  { id: 'gadzhieva', name: 'Даннат Гаджиева', role: 'Швея' },
  { id: 'kovtanyuk', name: 'Андрей Ковтанюк', role: 'Портной' },
  { id: 'shibaeva', name: 'Вероника Шибаева', role: 'Швея' },
  { id: 'morozov', name: 'Александр Морозов', role: 'Портной' },
  { id: 'portnoj', name: 'Иван Портной', role: 'Администратор' },
  { id: 'linichuk', name: 'Илья Линичук', role: 'Мастер гончарной мастерской' },
  { id: 'shamygina', name: 'Елизавета Шамыгина', role: 'SMM-специалист' },
];

/* ── Контакты (слайд 8). Телефон и соцсети — из официального дека.
   Если заказчица попросит скрыть номер, очисти phone/phoneHref (как CONTACT_PHONE в site.ts). ── */
export const ABOUT_CONTACTS = {
  lead: 'Яна Ямалетдинова',
  leadRole: 'Руководитель проекта',
  phone: '+7 917 356 92 07',
  phoneHref: 'tel:+79173569207',
  telegramHref: 'https://t.me/+2Q4vey3jL1llZDEy',
  vkHref: 'https://vk.com/okkolokrd',
  email: CONTACT_EMAIL,
  emailHref: `mailto:${CONTACT_EMAIL}`,
  address: OKKOLO_ADDRESS,
  mapUrl: OKKOLO_MAP_URL,
} as const;
