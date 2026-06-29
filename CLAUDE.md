# CLAUDE.md

Гид для Claude Code по фронту проекта «Окколо». CMS лежит отдельно — `/Users/vankrav/Projects/okkolo-cms` (там свой `CLAUDE.md`). Полный плейбук по серверу — `DEPLOY.md` в этой же репе.

## Команды

```bash
npm install
npm run dev      # vite dev-server, http://localhost:5180
npm run build    # tsc -b && vite build (type-check — часть билда)
npm run preview  # отдать собранный dist локально
npx tsc -b       # быстрый type-check без сборки
```

Тестов и линтера нет. Корректность типов гарантирует `tsc -b` со `strict: true`, `noUnusedLocals`, `noUnusedParameters` — мёртвые импорты/переменные ломают билд. Любой PR должен проходить `npm run build` локально перед мержем.

## Стек

- React 18 + TypeScript 5 + Vite 5.
- Tailwind 4 через `@tailwindcss/vite` (НЕ через PostCSS); в `src/styles/global.css` — `@import 'tailwindcss';` и `@theme {…}` блок, который тянет CSS-переменные из `tokens.css`.
- `@radix-ui/react-dialog` — для модалок (`EventSignupModal`, `EventDetailsModal`, `ProductDetailsModal`) и для bottom-sheet'а корзины (`Sheet` обёртка над Dialog).
- `embla-carousel-react` — карусели (`DirectionsCarousel`, см. `sections/DirectionsSection`).
- `clsx` + `tailwind-merge` — `cn()` в `src/lib/utils.ts`.
- `vite-imagetools` (build-time) + `sharp` — responsive AVIF/WebP/JPEG пайплайн (см. ниже).
- Алиас `@/*` → `src/*` (см. `tsconfig.json` paths и `vite.config.ts` resolve.alias).

Зависимостей сознательно мало: **не добавляй react-router, формы-библиотеки, state-менеджеры, axios и т.п. без явного запроса** — каждый кандидат на установку обсуждается, ручные альтернативы предпочтительнее.

## Архитектура

### Роутинг — ручной, без библиотек

`src/App.tsx` хранит `pathname` в `useState(() => window.location.pathname)` и слушает только `popstate`. Маршрутизация — простой ladder из `?:` в JSX:

| Путь | Что рендерится |
|---|---|
| `/` | Главная: `HeroSection` → `AboutSection` → `DirectionsSection` → `EventsSection` |
| `/events` | `EventsPage` |
| `/events/:id` | `EventDetailPage` (`:id` парсится regex `^/events/([^/]+)$`) |
| `/showroom` | `ShowroomPage` |
| `/workshops` | `WorkshopsPage` — контент из `src/data/workshops.ts` (3 реальные мастерские), запись: tel-кнопка + форма имя/телефон |
| `/cafe` | `CafePage` (фото меню + текстовая версия из `src/data/cafe.ts`) |
| `/accessibility` | `AccessibilityPage` — доступность здания и сайта, контент из `src/data/accessibility.ts` (ресёрч — `ДОСТУПНОСТЬ-RESEARCH.md`) |

`Header` и `Footer` рендерятся всегда. Между страницами переходим обычными `<a href>` (full page reload) — это сознательный выбор, чтобы не тащить роутер ради 4 экранов и не возиться с `pushState`. На стороне Vercel/nginx настроен SPA fallback (`vercel.json` → rewrite всего на `index.html`, у nginx — `try_files`).

**Следствие:** in-memory state теряется при переходе. Единственное, что переживает релоад, — корзина (см. ниже про `localStorage`).

### Слой данных — мок + Strapi с фоллбэком

Двухуровневая схема, исходя из того, что MVP параллельно подключают к боевому Strapi:

- `src/data/{directions,events,products,site}.ts` — статические мок-данные (типы + дефолтные значения). Это **источник истины для UI**, если CMS недоступен или вернул пустоту.
- `src/lib/strapi.ts` — низкоуровневые fetcher'ы (`fetchDirections`, `fetchEvents`, `fetchProducts`, `fetchShowroomHeroUrl`, `createEventRegistration`, `createOrder`) + типы `StrapiDirectionItem/StrapiEventItem/StrapiProductItem` + хелперы для медиа (`getStrapiImageUrl`, `collectStrapiImageUrls` — дедуп по `documentId`/`id`/нормализованному pathname).
- `src/lib/{events,products,workshops,directions}.ts` — высокоуровневые «адаптеры»: вызывают `fetchX`, маппят `StrapiXItem` → доменный тип из `src/data`, при ошибке/пустом ответе **молча** возвращают моки. Это by design — UI всегда что-то рисует.
- `src/lib/{delivery,support,domId,utils}.ts` — мелкие чистые хелперы (тарифы доставки Краснодар/РФ, support-action, безопасный DOM-id, `cn()`).

Базовый URL Strapi берётся из `VITE_STRAPI_URL` (по умолчанию `http://localhost:1337`). Файла `.env.local` в репе нет — он локальный, в `.gitignore`.

Ключевые контракты в `src/lib/strapi.ts`:
- `EventRegistrationInput`: `{ eventId, eventTitle, name, phone, email?, comment?, paymentStatus?: 'pending' | 'not_required' }` — `POST /api/event-registrations` в обёртке `{ data: ... }`.
- `CreateOrderInput`: `{ customerName, phone, email?, itemsSubtotal, deliveryPrice, totalPrice, items[], orderStatus: 'pending', fulfillmentType: 'pickup'|'delivery', city?, address?, deliveryComment? }` — `POST /api/orders`.
- `fetchShowroomHeroUrl()` пробует сначала коллекцию `/api/showrooms?populate=heroImage`, потом single type `/api/showroom?populate=hero` — кеширует Promise в модульной переменной `showroomHeroCache`.

### Глобальное состояние — только корзина

Единственный context — `src/context/CartContext.tsx`:
- Хранится в `localStorage` под ключом `okkolo-cart-v1`.
- При чтении валидируется через `isCartItem` (тип-гард: `productId/title/image: string`, `price: finite number`, `quantity: positive integer`) — битые записи отфильтровываются, не падает.
- `addItem` инкрементит `quantity`, если товар уже в корзине, иначе пушит. `removeItem` удаляет позицию целиком (количество в UI не редактируется покнопочно — упрощённо).
- `useCart()` бросает, если вызван вне `CartProvider`.
- Запись в storage — через `useEffect` на изменение `items`; пустая корзина чистит ключ (а не пишет `[]`).

Корзина используется в `ShowroomSection` → `ProductCard` → `addItem`, и в `CartSheet` (форма оформления заказа: pickup/delivery + Краснодар/РФ зоны через `src/lib/delivery.ts`).

### Image pipeline — vite-imagetools

В `vite.config.ts` подключён `imagetools()`. Импорт картинки с query-string генерирует на сборке responsive-набор:

```ts
import heroPicture from '@/assets/images/hero-team.jpg?w=480;768;1200;1600&format=avif;webp;jpg&as=picture';
```

Возвращается объект `{ sources: { 'image/avif': srcSet, 'image/webp': srcSet, 'image/jpeg': srcSet }, img: { src, w, h } }` (типы — в `src/vite-env.d.ts`, объявления `*&as=picture` и `*&as=srcset`).

Рендерится через `src/components/ui/Picture/Picture.tsx` — оборачивает `<picture>` с `<source>` на каждый MIME и финальным `<img>` (fallback). По умолчанию `loading="lazy"`, `decoding="async"`; для LCP-изображений ставь `loading="eager"` и `fetchpriority="high"` (`@ts-expect-error` пока типы React отстают).

Сейчас используют (см. `grep -rn "?w="`):
- `HeroSection`: `hero-team.jpg?w=480;768;1200;1600` (LCP, `fetchpriority="high"`).
- `ShowroomPage`: `showroom-hero.png?w=480;768;1200`.
- `data/directions.ts`, `data/events.ts`, `data/products.ts`: `?w=320;640;1024` (карточки) или `?w=320;640;960` (товары).

Поле `picture?: PictureSource` хранится в типах `Direction`, `OkkoloEvent`, `ShowroomProduct` — рядом с обычным `image: string`. Компоненты, которые умеют, рендерят через `<Picture picture={...} sizes="..." />`; legacy-места — через обычный `<img src={image}>`.

**Тяжёлые исходники пережаты (2026-06-16):** `hero-team.jpg` 3.5 MB→417 KB, `what_we_teach_pottery.jpg` 1.7 MB→164 KB, `direction-cafe.png`→`direction-cafe.jpg` 2.4 MB→174 KB, `showroom-product.png`→`showroom-product.jpg` 1.5 MB→223 KB (sips, JPEG q72–75, ширина ≤1024–1600). Рантайм не изменился (imagetools всё равно ресайзит из исходника). При добавлении нового исходника заранее сожми его (sips/sharp/squoosh), иначе раздувается репа и медленнее идёт первый build.

## Структура компонентов

Конвенция: **один компонент = одна папка** с `<Name>.tsx`, `<Name>.module.css` и `index.ts` (баррель). Под-компоненты — рядом, без своей папки (например, `EventCard.tsx` внутри `EventsSection/`).

```
src/components/
├── ui/                       # переиспользуемые примитивы
│   ├── Button/               # кнопка с вариантами (primary/outline)
│   ├── DetailCard/           # детальная карточка для модалок «Подробнее» (Figma 400-1389)
│   ├── IconButton/           # квадратная иконочная кнопка
│   ├── ImageActionCard/      # карточка-плитка «картинка + заголовок + кнопка»
│   ├── Picture/              # <picture> для vite-imagetools (см. выше)
│   └── Sheet/                # bottom-sheet поверх Radix Dialog
├── layout/                   # глобальная оболочка
│   ├── Header/               # шапка + меню + плавающий бургер
│   └── Footer/               # подвал
├── sections/                 # секции главной (НЕ лезут друг к другу)
│   ├── HeroSection/          # большое hero-фото команды
│   ├── AboutSection/         # текст о проекте
│   ├── DirectionsSection/    # карусель направлений (Embla) + DirectionCard
│   ├── EventsSection/        # карточки ближайших ивентов
│   │   ├── EventCard.tsx
│   │   ├── EventDetailsModal.tsx   # «подробнее» — Radix Dialog
│   │   └── EventSignupModal.tsx    # форма записи → createEventRegistration
│   └── ShowroomSection/      # карточки товаров + ProductDetailsModal
│       ├── ProductCard.tsx
│       └── ProductDetailsModal.tsx
├── pages/                    # экраны подстраниц
│   ├── EventsPage/           # полный список ивентов с фильтрами
│   ├── EventDetailPage/      # /events/:id, отдельный экран ивента
│   ├── ShowroomPage/         # /showroom: hero + сетка товаров + категории
│   ├── WorkshopsPage/        # /workshops: 3 мастерские + a11y-форма «перезвоним» (см. гочи)
│   ├── CafePage/             # /cafe: интро + фото меню с текстовым дублем + галерея-заглушки
│   └── AccessibilityPage/    # /accessibility: факты о здании + контакты + accessibility statement
└── cart/
    ├── FloatingCartButton/   # фикс-кнопка с количеством товаров
    └── CartSheet/            # форма оформления заказа → createOrder
```

Секции и страницы владеют своим внутренним layout'ом и не пытаются позиционировать соседей.

## Стили

**Единственный источник стилевых констант — `src/styles/tokens.css`** (CSS custom properties): цвета (`--color-purple`, `--color-yellow`, `--color-bg`…), типографика (`--text-body`, `--text-section-title`…), spacing (4-pt шкала `--space-1…--space-10`), радиусы (`--radius-sm/md/lg/xl/pill`), тени (`--shadow-card`, `--shadow-card-hover`), gradient overlay, layout-переменные (`--container-max`, `--page-padding-x`, `--header-offset`).

**Не хардкодь HEX'ы и px-радиусы в компонентах** — добавь токен в `tokens.css` или используй существующий. Шрифт: `Onest` (Google Fonts, подключён в `index.html`, веса 500/600), `Inter` — fallback.

## Дизайн-макет (Figma)

Файл: `Av6c3mhsjGquWu1Hwbv71q` (Okkolo). Ключевые ноды:
- `357-1830` — главная Desktop (hero, направления, мероприятия; **футера в макете нет** — он сделан «по аналогии»);
- `176-805` — компонент кнопок (Default = заливка, Variant2 = обводка 3px);
- `351-1217` — компонент карточки «Product» (фото 245px → жёлтый тег → заголовок → описание → кнопки);
- `408-1961` — детальная карточка (модалка «Подробнее», актуальная ревизия): фото слева 450px; справа тег →20→ заголовок (header-2) →30→ описание (body, серый); внизу крупная строка «Цена: …» / «Вход свободный» (header-2) →30→ кнопки «…»/«Закрыть». Реализована как `src/components/ui/DetailCard` — общий для `ProductDetailsModal` и `EventDetailsModal` (модалки оставляют себе только Dialog-оболочку и галерею).

Типографика — 5 стилей Onest (значения — десктоп; в `tokens.css` замаплены на роли с mobile-first шкалой):

| Стиль | Параметры | Токен |
|---|---|---|
| header-1 | SemiBold 40 / 1.3 | `--text-section-title` (алиас `--text-header-1`) |
| header-2 | SemiBold 32 / 1.3 (подтверждён: заголовок детальной карточки `400-1389`) | `--text-header-2` |
| header-3 | SemiBold 25 / 1.3 | `--text-card-title` (алиас `--text-header-3`) |
| body | Medium 21 / normal | `--text-body`, `--text-button` |
| tag | Medium 18 / normal | `--text-caption` (алиас `--text-tag`) |

Палитра и форма:
- Заливка кнопок `#d5a7f6` → `--color-purple-light`; обводка и hover `#c594e8` → `--color-purple`; фон страницы `#f9f9f9` → `--color-bg`; жёлтый тег `#fedd5b` → `--color-yellow` (скругление `--radius-tag` = 2px, padding 8×12; декоративные теги-чипы — `.previewMeta`, `DetailCard .tag`, `EventSignupModal .tag`, `.calloutTag`); вторичный текст `#666666` (единый серый по просьбе заказчицы, вместо макетного `rgba(0,0,0,.5)`) → `--color-text-secondary` (= `--color-text-subtle`, `--color-text-muted`, `--color-muted`); навигация `#292929` → `--color-text-nav`.
- Радиусы: отдельные кнопки 40 (`--radius-pill`), кнопки в карточках 30 (`--radius-pill-card`), карточки 25 (`--radius-xl`), фото 20 (`--radius-lg`).
- Тени без смещения: карточка `0 0 4px` (`--shadow-card`), hover `0 0 10.9px 1px`, hero-фото `0 0 6px` (`--shadow-hero`), хедер/футер `0 0 2px` (`--shadow-header`).
- У `Button` рамка 3px у всех вариантов (у primary — в цвет заливки), поэтому CSS-padding = Figma-значение минус 3 (Figma 22/30 → `lg` на 1024+ = 19/27).
- «Доступность» в навигации ведёт на `/accessibility` (как в макете). Неподтверждённые заказчицей телефоны на странице скрыты — см. комментарий в `src/data/accessibility.ts` (та же конвенция, что `CONTACT_PHONE` в `site.ts`).
- Фоновые «пятна» главной (Figma 357:1978/357:1979) — чистый CSS в `App.module.css` (`.main::before` — фиолетовый эллипс rotate 30.47°, `.main::after` — жёлтый круг; blur = stdDeviation из Figma: 153/142 на десктопе). Никаких картинок для них не нужно.
- Карточки (`ImageActionCard` preview): в ряду все **одной высоты по самой высокой** (grid `align-items: stretch` + `height: 100%`), лишняя высота уходит строго между описанием и кнопками (`margin-top: auto` у `.previewActions`) — так попросила заказчица. Внутренний ритм: фото →20→ тег →20→ заголовок →15→ описание →24→ кнопки →16→ низ. Все тексты карточек и DetailCard используют `text-box: trim-both cap alphabetic` (точно как text-box-trim в Figma): гэпы меряются от cap-высоты/базовой линии, хвосты «р/у/д» висят за боксом. **Поэтому на таких текстах нельзя `overflow: hidden` / line-clamp** — обрежет хвосты (заголовкам карточек clamp убран сознательно).
- «Ближайшие мероприятия»: `selectUpcomingEvents` показывает будущие, а если их нет — последние прошедшие (секция не должна пустеть, в макете всегда 3 карточки). Не добавляй повторный фильтр по дате в `EventsSection` — выборка целиком в `src/lib/events.ts`.

Брейкпоинты — inline в `@media (min-width: ...)`:
- `640px` — small tablet (увеличиваем text-size'ы, `--page-padding-x: 40px`)
- `1024px` — desktop (`--page-padding-x: 48px`, `--container-max: 1320px`)
- `1280px` — wide (`--page-padding-x: 72px`)
- `1440px` — extra-wide (`--page-padding-x: 96px`, `--container-max: 1520px`)

Подключение: `global.css` → `@import 'tailwindcss'; @import './tokens.css'; @import './reset.css';`. Блок `@theme { … }` маппит токены в Tailwind 4 цветовую/радиусную систему (`bg-background`, `text-foreground`, `rounded-card`).

**CSS Modules** (`*.module.css`) — для именованных стилей компонента. **Tailwind утилиты** — для одноразовых композиций (gap, flex-direction, отступы по месту). Внутри module'ов можно использовать `var(--color-...)` напрямую.

Дополнительно в `global.css`: `scroll-behavior: smooth`, `scroll-padding-top: 88px` (под фикс-хедер), `prefers-reduced-motion` — резко режет анимации.

## Интеграция с CMS

Backend — Strapi 5 (`okkolo-cms`). Content-types и эндпоинты — см. `okkolo-cms/CLAUDE.md`. Тут — что важно фронту:

- **API URL** из `VITE_STRAPI_URL`. Локально — `http://localhost:1337` (Strapi на SQLite, см. `okkolo-cms/.env`). Прод — **`https://okkolo-project.ru`** (HTTPS, тот же origin, nginx проксирует `/api` на `127.0.0.1:1337`; БД на проде — PostgreSQL).
- **Публичные эндпоинты сейчас** (выставлены вручную в админке или через `okkolo-cms/src/index.ts`): GET `/api/directions`, GET `/api/events`, GET `/api/products`, GET `/api/showrooms`. POST `/api/event-registrations` и POST `/api/orders` могут вернуть 403 на свежем инстансе — нужно включить `create` для роли Public в админке.
- **Любая ошибка fetch — silent fallback на `src/data/*`.** Это удобно для разработки, но прячет реальные баги: при отладке смотри Network и `console.error` (адаптеры в `src/lib/` логируют).
- **Схема CMS ↔ фронт** (актуализировано на 2026-06-16 по аудиту):
  - Ранее задокументированные баги ИСПРАВЛЕНЫ: `event.price` (строчная), `event-registration.paymentStatus` без ведущего пробела, `Direction.href` присутствует в схеме. Старые предупреждения сняты.
  - `order` теперь хранит `itemsSubtotal` и `deliveryPrice` — `createOrder` слал их и раньше, но они не сохранялись. После пулла CMS перезапустить Strapi, чтобы применилась миграция БД.
  - `event.href`/`event.signupHref` убраны из контракта `StrapiEventItem` — этих полей в CMS нет, фронт формирует `href` из slug, `signupHref` = `SUPPORT_HREF`.
  - ⚠️ **Прод опережает репозиторий `okkolo-cms` (2026-06-27).** На проде `event.type` и `product.category` — это **relation** (отдельные коллекции `event-types`/`categories` + link-таблицы); фронт правильно читает `item.type?.name` с `populate[type]=true` (см. `src/lib/strapi.ts` → `StrapiEventType`, `events.ts` → `toEvent`). В репе `okkolo-cms` (ветка `vankrav`) эти поля всё ещё `enumeration`, а полей `order.itemsSubtotal/deliveryPrice` нет. **Источник истины по схеме — прод-API, а не `schema.json` в репе.** Не трогай маппинг `type`/`category` «под локальную схему» — сломаешь прод (история: воронка-фильтр типов на `/events` появляется только при `populate[type]` + чтении `.name`).

## Деплой

Полный плейбук — `DEPLOY.md` в корне репы. Кратко:

- **Прод сервер:** Ubuntu 24.04, `158.160.128.16`, пользователь `nastyasep2004`. Домен **`https://okkolo-project.ru`** (HTTPS через Certbot, `:80` и голый IP редиректят 301 на HTTPS). Nginx раздаёт статику `~/apps/web` и проксирует API на `127.0.0.1:1337` (Strapi под pm2). БД на проде — **PostgreSQL** (не SQLite).
- **Сборка фронта — локально:** `VITE_STRAPI_URL=https://okkolo-project.ru npm run build` → артефакты в `dist/` → rsync на сервер в `~/apps/web/`. Собирать со старым `http://158.160.128.16` НЕЛЬЗЯ — на HTTPS-странице запрос заблокируется как mixed-content и фронт свалится на моки.
- ⚠️ **Прод-схема CMS опережает репозиторий `okkolo-cms`:** на проде `event.type`/`product.category` — это relation (коллекции `event-types`/`categories`), а в репе — старый `enumeration`. Правки делали в админке и не вернули в git. **Не деплой CMS из репы поверх прода** без синхронизации схемы — снесёт relation-данные. Подробности и порядок действий — в `DEPLOY.md` (раздел «CMS»).
- **Vercel** как альтернатива тоже поддержан: `vercel.json` делает SPA fallback (`/(.*) → /index.html`). На vercel-деплое `VITE_STRAPI_URL` нужно прописать через env.
- Все full-reload-переходы внутри SPA опираются на этот SPA fallback (nginx `try_files $uri $uri/ /index.html;` или vercel rewrite) — иначе `/events`, `/showroom`, `/workshops` отдадут 404.

## Подводные камни

- **Тяжёлые исходники пережаты (2026-06-16)** — hero/pottery/cafe/product теперь 164–417 KB вместо 1.5–3.5 MB. При добавлении нового исходника — сжимай заранее (sips/sharp/squoosh).
- **`tsc -b` строгий**: неиспользуемая локальная переменная/параметр ломает билд. Если IDE подсветила «возможно неиспользовано» — почисти.
- **Roуутинг ручной**: не зови `history.pushState` руками без `dispatchEvent(new PopStateEvent('popstate'))`, иначе `App.tsx` не пересоберёт state. Проще делать `<a href>` (full reload).
- **State теряется при переходе**, корзина — нет (она в `localStorage`). Если положил данные в `useState` и хочешь их пережить — либо localStorage, либо вытаскивай в URL.
- **Strapi fallback маскирует 4xx/5xx**: при изменениях API сначала проверь, что fetch реально проходит (Network → 200), а не молча получает пустой массив и показывает моки.
- **CartContext.removeItem удаляет всю позицию**, инкремент/декремент по 1 шт не реализованы — если бизнес попросит, нужно расширять контекст.
- **Шрифт Onest** грузится с Google Fonts (`index.html`), весов только 500 и 600 — если в макете появится другой вес, добавь его в `<link>`, иначе браузер синтезирует фейковый.
- **Меню кофейни двухслойное**: фото (`menu_photo_1/2.jpg`) + текстовая расшифровка в `src/data/cafe.ts` (доступность для скринридеров). При замене фото меню ОБЯЗАТЕЛЬНО обнови текстовую версию — иначе цены разъедутся.
- **Страница «Мастерские» переделана по CJM/a11y-аудиту (2026-06)**: контент — только подтверждённые факты в `src/data/workshops.ts` (швейная, кофейное дело, звукорежиссура); НЕ добавляй цены/расписания/имена без подтверждения заказчицы. Форма «перезвоним» шлёт заявку через `createEventRegistration` (eventId `workshops-callback`) — отдельного content-type в CMS пока нет. Кнопка «Позвонить» появляется, когда заполнен `CONTACT_PHONE` в `src/data/site.ts` (E.164 + display-вариант). A11y-паттерны формы (не ломать): видимые label со словом «(обязательно)», `autocomplete`/`inputMode`, ошибки через `aria-describedby`+`aria-invalid`+фокус на поле, контейнеры `role="status"`/`role="alert"` смонтированы заранее, submit с `aria-disabled` (не `disabled`), рамки инпутов `--color-border-strong` `#8a8a8a` (контраст к белому 3.45:1, к фону `#f9f9f9` 3.28:1 — SC 1.4.11).
- **MVP в работе**: вёрстка готова, интеграции (Strapi, платежи) дозаливаются. Фоллбэк на моки — фича, не баг.

## Что не делать без явного запроса

- Не добавлять react-router/redux/zustand/axios/react-query/любые формы-либы — текущий ручной подход осознанный.
- Не переводить CSS Modules на CSS-in-JS и наоборот.
- Не ломать SSR-совместимость в `CartContext` (`typeof window === 'undefined'` проверка нужна, даже если сейчас рендер CSR-only).
- Не трогать `types/generated/*` в CMS-репе и не править Strapi-схемы из этой репы — только из админки или прямой правкой `okkolo-cms/src/api/.../schema.json`.
- Не коммитить `.env.local`.
