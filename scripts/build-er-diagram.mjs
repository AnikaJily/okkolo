// Генератор ER-диаграммы БД «Окколо» (Strapi 5 / PostgreSQL) для приложения к диплому.
// Детерминированная landscape-раскладка, печать-френдли (белый фон, тонкие чёрные рамки).
// Запуск: node scripts/build-er-diagram.mjs  → docs/er-diagram.svg
import { mkdirSync, writeFileSync } from 'node:fs';

const COL_W = 250;
const ROW_H = 17;
const HEAD_H = 26;
const GROUP_GAP_Y = 18;
const TITLE_FILL = '#e9e3f3'; // светло-сиреневый заголовок таблицы (бренд, печать-нейтральный)
const MEDIA_FILL = '#fff6cc'; // системная подсистема медиа — светло-жёлтый
const BORDER = '#1f1f1f';
const TEXT = '#1f1f1f';
const MUTED = '#555';

// key: 'PK' | 'FK' (media) | '' ; note: подпись справа (логическая связь)
const T = (name, ru, fields, fill = TITLE_FILL) => ({ name, ru, fields, fill });
const f = (n, t, key = '', note = '') => ({ n, t, key, note });

const groups = [
  {
    title: 'Каталог и контент',
    x: 36,
    tables: [
      T('directions', 'Направление', [
        f('id', 'int', 'PK'), f('title', 'string'), f('description', 'text'),
        f('href', 'string'), f('image', 'media', 'FK'),
      ]),
      T('events', 'Мероприятие', [
        f('id', 'int', 'PK'), f('title', 'string'), f('slug', 'uid'), f('date', 'datetime'),
        f('type', 'enum'), f('isPaid', 'bool'), f('price', 'int'), f('paymentUrl', 'string'),
        f('photo', 'media', 'FK'), f('gallery', 'media', 'FK'),
      ]),
      T('products', 'Товар', [
        f('id', 'int', 'PK'), f('title', 'string'), f('price', 'int'), f('category', 'enum'),
        f('isAvailable', 'bool'), f('image', 'media', 'FK'), f('gallery', 'media', 'FK'),
      ]),
      T('menu_items', 'Позиция меню', [
        f('id', 'int', 'PK'), f('name', 'string'), f('price', 'string'),
        f('category', 'enum'), f('season', 'enum'), f('order', 'int'),
      ]),
      T('workshop_programs', 'Программа мастерской', [
        f('id', 'int', 'PK'), f('title', 'string'), f('description', 'text'),
        f('order', 'int'), f('image', 'media', 'FK'),
      ]),
    ],
  },
  {
    title: 'Отчётность и документы',
    x: 322,
    tables: [
      T('monthly_reports', 'Ежемесячный отчёт', [
        f('id', 'int', 'PK'), f('month', 'int'), f('year', 'int'),
        f('summary', 'text'), f('pdf', 'media', 'FK'),
      ]),
      T('annual_reports', 'Годовой отчёт', [
        f('id', 'int', 'PK'), f('year', 'int'), f('kind', 'enum'),
        f('note', 'string'), f('pdf', 'media', 'FK'),
      ]),
      T('legal_documents', 'Юр. документ', [
        f('id', 'int', 'PK'), f('title', 'string'), f('category', 'enum'),
        f('order', 'int'), f('pdf', 'media', 'FK'),
      ]),
    ],
  },
  {
    title: 'Страницы и фото (single types)',
    x: 608,
    tables: [
      T('showroom', 'Шоурум', [f('id', 'int', 'PK'), f('heroImage', 'media', 'FK')]),
      T('cafe_menu_page', 'Меню кофейни', [
        f('id', 'int', 'PK'), f('mainPosterImage', 'media', 'FK'),
        f('summerPosterImage', 'media', 'FK'), f('footnote', 'string'),
      ]),
      T('workshops_page', 'Страница мастерских', [
        f('id', 'int', 'PK'), f('intro', 'text'), f('hero', 'media', 'FK'),
      ]),
      T('about_page', 'Страница «О нас»', [
        f('id', 'int', 'PK'), f('body', 'text'), f('hero', 'media', 'FK'),
      ]),
      T('accessibility_page', 'Страница доступности', [
        f('id', 'int', 'PK'), f('title', 'string'), f('lead', 'text'), f('hero', 'media', 'FK'),
      ]),
      T('about_team_photos', 'Фото команды', [
        f('id', 'int', 'PK'), f('alt', 'string'), f('caption', 'string'),
        f('order', 'int'), f('image', 'media', 'FK'),
      ]),
      T('about_workplace_photos', 'Фото пространства', [
        f('id', 'int', 'PK'), f('alt', 'string'), f('caption', 'string'),
        f('order', 'int'), f('image', 'media', 'FK'),
      ]),
    ],
  },
  {
    title: 'Заявки пользователей',
    x: 894,
    tables: [
      T('event_registrations', 'Заявка на мероприятие', [
        f('id', 'int', 'PK'), f('eventId', 'string', '', '→ events'), f('eventTitle', 'string'),
        f('name', 'string'), f('phone', 'string'), f('email', 'string'),
        f('comment', 'text'), f('paymentStatus', 'enum'),
      ]),
      T('orders', 'Заказ', [
        f('id', 'int', 'PK'), f('customerName', 'string'), f('phone', 'string'),
        f('email', 'string'), f('itemsSubtotal', 'int'), f('deliveryPrice', 'int'),
        f('totalPrice', 'int'), f('items', 'json', '', '→ products'), f('orderStatus', 'enum'),
        f('fulfillmentType', 'enum'), f('city', 'string'), f('address', 'string'),
        f('deliveryComment', 'text'),
      ]),
    ],
  },
];

// Системная подсистема медиа Strapi Upload — отдельный кластер справа
const mediaCluster = {
  title: 'Подсистема медиа (Strapi Upload)',
  x: 1180,
  tables: [
    T('files', 'Файл (медиа)', [
      f('id', 'int', 'PK'), f('name', 'string'), f('url', 'string'),
      f('mime', 'string'), f('formats', 'json'),
    ], MEDIA_FILL),
    T('files_related_morphs', 'Полиморфная связь', [
      f('id', 'int', 'PK'), f('file_id', 'int', 'FK'), f('related_id', 'int'),
      f('related_type', 'string'), f('field', 'string'),
    ], MEDIA_FILL),
  ],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let out = [];
const tableBox = {}; // name -> {x,y,w,h}
let maxBottom = 0;

function drawTable(t, x, y) {
  const h = HEAD_H + t.fields.length * ROW_H;
  tableBox[t.name] = { x, y, w: COL_W, h };
  if (y + h > maxBottom) maxBottom = y + h;
  out.push(`<g>`);
  // рамка
  out.push(`<rect x="${x}" y="${y}" width="${COL_W}" height="${h}" rx="3" fill="#ffffff" stroke="${BORDER}" stroke-width="1"/>`);
  // заголовок
  out.push(`<rect x="${x}" y="${y}" width="${COL_W}" height="${HEAD_H}" rx="3" fill="${t.fill}" stroke="${BORDER}" stroke-width="1"/>`);
  out.push(`<rect x="${x}" y="${y + HEAD_H - 3}" width="${COL_W}" height="3" fill="${t.fill}"/>`);
  out.push(`<text x="${x + 8}" y="${y + 12}" font-size="11" font-weight="700" fill="${TEXT}">${esc(t.name)}</text>`);
  out.push(`<text x="${x + 8}" y="${y + 22}" font-size="8.5" fill="${MUTED}">${esc(t.ru)}</text>`);
  // поля
  t.fields.forEach((fl, i) => {
    const fy = y + HEAD_H + i * ROW_H;
    if (i > 0) out.push(`<line x1="${x}" y1="${fy}" x2="${x + COL_W}" y2="${fy}" stroke="#e2e2e2" stroke-width="0.5"/>`);
    const keyTxt = fl.key === 'PK' ? 'PK' : fl.key === 'FK' ? '◆' : '';
    const keyColor = fl.key === 'PK' ? '#7a3fb0' : '#b58900';
    out.push(`<text x="${x + 8}" y="${fy + 12}" font-size="9.5" fill="${TEXT}">${esc(fl.n)}</text>`);
    out.push(`<text x="${x + COL_W - 8}" y="${fy + 12}" font-size="8.5" fill="${MUTED}" text-anchor="end">${esc(fl.t)}</text>`);
    if (keyTxt) out.push(`<text x="${x + COL_W - 34}" y="${fy + 12}" font-size="8.5" font-weight="700" fill="${keyColor}" text-anchor="end">${keyTxt}</text>`);
    if (fl.note) out.push(`<text x="${x + COL_W + 6}" y="${fy + 12}" font-size="8" font-style="italic" fill="#8a6d00">${esc(fl.note)} (логич., не FK)</text>`);
  });
  out.push(`</g>`);
  return h;
}

const TOP = 78;
// колонки сущностей
for (const g of groups) {
  out.push(`<text x="${g.x}" y="${TOP - 14}" font-size="11.5" font-weight="700" fill="#7a3fb0">${esc(g.title)}</text>`);
  let y = TOP;
  for (const t of g.tables) { y += drawTable(t, g.x, y) + GROUP_GAP_Y; }
}
// кластер медиа
out.push(`<text x="${mediaCluster.x}" y="${TOP - 14}" font-size="11.5" font-weight="700" fill="#8a6d00">${esc(mediaCluster.title)}</text>`);
let my = TOP;
for (const t of mediaCluster.tables) { my += drawTable(t, mediaCluster.x, my) + GROUP_GAP_Y; }

// ── связи ──
const files = tableBox['files'];
const morphs = tableBox['files_related_morphs'];
// реальная связь files 1—N files_related_morphs (вертикально, соседние)
out.push(`<line x1="${files.x + files.w / 2}" y1="${files.y + files.h}" x2="${morphs.x + morphs.w / 2}" y2="${morphs.y}" stroke="${BORDER}" stroke-width="1.4"/>`);
out.push(`<text x="${files.x + files.w / 2 + 6}" y="${files.y + files.h + 12}" font-size="8.5" fill="${TEXT}">1 — ∞</text>`);
// аккуратная подпись о полиморфной media-связи — в свободном месте под медиа-кластером
const noteY = morphs.y + morphs.h + 26;
out.push(`<rect x="${morphs.x}" y="${noteY}" width="${COL_W}" height="58" rx="4" fill="${MEDIA_FILL}" stroke="${BORDER}" stroke-width="1"/>`);
out.push(`<path d="M ${morphs.x - 22} ${noteY + 16} L ${morphs.x - 2} ${noteY + 16}" stroke="${BORDER}" stroke-width="1.4" marker-end="url(#arrow)"/>`);
out.push(`<text x="${morphs.x + 10}" y="${noteY + 17}" font-size="9" font-weight="700" fill="${TEXT}">◆ media-поля → files</text>`);
out.push(`<text x="${morphs.x + 10}" y="${noteY + 31}" font-size="8" fill="${MUTED}">любая сущность, помеченная ◆,</text>`);
out.push(`<text x="${morphs.x + 10}" y="${noteY + 43}" font-size="8" fill="${MUTED}">связана полиморфно (related_type</text>`);
out.push(`<text x="${morphs.x + 10}" y="${noteY + 53}" font-size="8" fill="${MUTED}">+ related_id), механизм Strapi Upload</text>`);
if (noteY + 58 > maxBottom) maxBottom = noteY + 58;

// ── легенда ──
const lx = 36, ly = Math.round(maxBottom + 28);
out.push(`<rect x="${lx}" y="${ly}" width="640" height="96" rx="4" fill="#fafafa" stroke="${BORDER}" stroke-width="1"/>`);
out.push(`<text x="${lx + 12}" y="${ly + 20}" font-size="11" font-weight="700" fill="${TEXT}">Условные обозначения</text>`);
const leg = [
  'PK — первичный ключ;  ◆ FK — медиа-поле (связь с files через files_related_morphs)',
  'Сплошная линия — реальная связь в БД (механизм Strapi Upload, полиморфная)',
  'Курсив «→ … (логич., не FK)» — связь не закреплена внешним ключом: фиксируется',
  'строкой/JSON на момент отправки (eventId у заявки, items у заказа)',
  'Все content-types: draftAndPublish — у каждой строки есть documentId и состояние черновик/публикация',
];
leg.forEach((s, i) => out.push(`<text x="${lx + 12}" y="${ly + 38 + i * 13}" font-size="9" fill="${TEXT}">${esc(s)}</text>`));

const W = 1700;
const H = ly + 96 + 24;
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Helvetica, Arial, 'PT Sans', sans-serif">
<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${BORDER}"/></marker></defs>
<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>
<text x="${W / 2}" y="34" font-size="17" font-weight="700" fill="${TEXT}" text-anchor="middle">ER-диаграмма базы данных веб-сервиса «Окколо» (Strapi 5 / PostgreSQL)</text>
<text x="${W / 2}" y="52" font-size="10" fill="${MUTED}" text-anchor="middle">17 таблиц content-types + системная подсистема медиа Strapi Upload</text>
${out.join('\n')}
</svg>`;

mkdirSync('docs', { recursive: true });
writeFileSync('docs/er-diagram.svg', svg);
console.log('written docs/er-diagram.svg', svg.length, 'bytes; tables:', Object.keys(tableBox).length);
