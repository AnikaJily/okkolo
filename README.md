# Окколо — фронт

Мобильный лендинг проекта «Окколо» (React 18 + TypeScript + Vite 5 + Tailwind 4). Бэкенд — отдельная Strapi-репа [`okkolo-cms`](https://github.com/AnikaJily/okkolo-cms).

- **Прод:** http://158.160.128.16/
- **Админка CMS:** http://158.160.128.16/admin
- **CI/CD:** push в ветку `production` → автодеплой через GitHub Actions (см. ниже).

## Команды

```bash
npm install
npm run dev      # vite dev-server, http://localhost:5180
npm run build    # tsc -b && vite build
npm run preview  # отдать собранный dist локально
npx tsc -b       # быстрый type-check без сборки
```

Тестов и линтера нет. `tsc -b` строгий (`strict`, `noUnusedLocals`, `noUnusedParameters`) — мёртвые импорты ломают билд. Это же гоняется на каждый push в `production` через Actions, перед деплоем.

`.env.local` для локалки:

```
VITE_STRAPI_URL=http://localhost:1337
```

В проде в GitHub Actions значение приходит из repo Variable `VITE_STRAPI_URL` (по умолчанию — `http://158.160.128.16`).

## Стек

- React 18, TypeScript 5, Vite 5.
- Tailwind 4 через `@tailwindcss/vite` (НЕ через PostCSS), CSS Modules — для именованных стилей компонента.
- `@radix-ui/react-dialog` — модалки и bottom-sheet корзины.
- `embla-carousel-react` — карусели секций.
- `clsx` + `tailwind-merge` — утилита `cn()` в `src/lib/utils.ts`.
- `vite-imagetools` + `sharp` — build-time генерация AVIF/WebP/JPEG (см. `src/components/ui/Picture`).

Алиас `@/*` → `src/*`. Подробности архитектуры — в [`CLAUDE.md`](./CLAUDE.md).

## Структура

```
src/
├── App.tsx                    # ручной роутер по window.location.pathname
├── main.tsx
├── assets/images/             # сырые исходники (НЕ оптимизированы — сжимай заранее)
├── components/
│   ├── ui/                    # Button, IconButton, ImageActionCard, Picture, Sheet
│   ├── layout/                # Header, Footer
│   ├── sections/              # HeroSection, AboutSection, DirectionsSection, EventsSection, ShowroomSection
│   ├── pages/                 # EventsPage, EventDetailPage, ShowroomPage, WorkshopsPage
│   └── cart/                  # CartSheet, FloatingCartButton
├── context/CartContext.tsx    # единственный context — корзина (persist в localStorage)
├── data/                      # моки: directions, events, products, site
├── lib/                       # strapi, events, products, workshops, directions, delivery, support, utils, domId
└── styles/                    # tokens.css → global.css → reset.css
```

## Роутинг

Маршруты — ladder в `App.tsx`, `useState(window.location.pathname)` + `popstate`:

| Путь | Экран |
|---|---|
| `/` | Главная: Hero → About → Directions → Events |
| `/events` | EventsPage |
| `/events/:id` | EventDetailPage |
| `/showroom` | ShowroomPage |
| `/workshops` | WorkshopsPage |

Переходы — обычные `<a href>` (full reload). SPA-fallback на сервере — nginx `try_files`, на Vercel — `vercel.json`. Никакого роутера не добавлять без явного запроса.

## Слой данных

Двухуровневый, силу через **silent fallback на моки**:

- `src/data/*` — статические мок-данные (типы + дефолтные значения).
- `src/lib/strapi.ts` — низкоуровневые fetcher'ы, типы, помощники для медиа.
- `src/lib/{events,products,workshops,directions}.ts` — адаптеры: вызывают Strapi, маппят в доменный тип, при ошибке **молча** возвращают моки.

Поведение by design: при недоступном CMS пользователь видит хоть что-то. **Минус — маскирует баги API.** При отладке смотри Network/`console.error`.

Эндпоинты, к которым ходит фронт:

- `GET /api/directions?populate=image`
- `GET /api/events?populate=photo&sort=date:asc`
- `GET /api/products?populate[image]=true&populate[gallery]=true&sort=title:asc`
- `GET /api/showrooms?populate=heroImage` (с фоллбэком на single type `/api/showroom?populate=hero`)
- `POST /api/event-registrations` (форма записи на ивент)
- `POST /api/orders` (оформление заказа из корзины)

## Корзина

Единственный context (`src/context/CartContext.tsx`). Хранится в `localStorage` под ключом `okkolo-cart-v1`, читается через тип-гард `isCartItem` — битые записи отбрасываются молча. Пустая корзина чистит ключ. Используется в `ShowroomSection`/`ProductCard` (добавить) и в `CartSheet` (форма заказа: pickup/delivery + расчёт доставки по `src/lib/delivery.ts`).

## Стили

Все константы — CSS custom properties в `src/styles/tokens.css`: цвета, типографика (Gilroy/Gotham, Inter fallback), spacing (4-pt), радиусы, тени, layout (`--container-max`, `--page-padding-x`). **Не хардкодь HEX'ы и px-радиусы в компонентах.**

Брейкпоинты (inline `@media`): 640 / 1024 / 1280 / 1440.

## CI/CD

### Архитектура

```
push в production
       │
       ▼
┌─────────────────────────────────┐
│  GitHub Actions (ubuntu-latest) │
│                                 │
│  1. checkout                    │
│  2. setup-node 20 + npm ci      │
│  3. npm run build               │
│  4. webfactory/ssh-agent        │
│  5. ssh-keyscan → known_hosts   │
│  6. rsync -az --delete dist/    │
└────────────┬────────────────────┘
             │ ssh (port 22)
             ▼
┌──────────────────────────────────┐
│  VPS 158.160.128.16              │
│  /home/nastyasep2004/apps/web/   │
│  ← nginx раздаёт статику         │
└──────────────────────────────────┘
```

### Workflow

`.github/workflows/deploy.yml`. Триггеры:

- `push` в ветку `production`.
- Ручной `workflow_dispatch` (вкладка Actions → Deploy frontend to VPS → Run workflow).

Concurrency-группа `deploy-okkolo-frontend` с `cancel-in-progress: false` — два одновременных пуша подождут друг друга, не отменят. Бережёт от полу-выгруженных дистов.

Длительность типичного билда — ~40–60 с.

### GitHub Secrets и Variables

В `Settings → Secrets and variables → Actions`:

**Secrets:**
| Имя | Значение |
|---|---|
| `SSH_PRIVATE_KEY` | Приватный ключ ed25519 `gha-deploy-okkolo` (целиком с BEGIN/END) |
| `SSH_HOST` | `158.160.128.16` |
| `SSH_USER` | `nastyasep2004` |

**Variables:**
| Имя | Значение |
|---|---|
| `VITE_STRAPI_URL` | `http://158.160.128.16` (опционально — есть fallback в workflow) |

Публичная часть ключа — в `~/.ssh/authorized_keys` на сервере у `nastyasep2004`.

### Как делать релиз

```bash
# 1. Влить фичу в production (через PR или локально)
git checkout production
git merge --ff-only vankrav   # или другая фича-ветка
git push origin production    # → запускает деплой

# 2. (опционально) посмотреть прогресс
gh run watch -R AnikaJily/okkolo
```

### Откат

```bash
git checkout production
git revert HEAD               # создаст revert-коммит
git push origin production    # автодеплой выкатит предыдущую версию
```

Альтернатива: ручной запуск более старого workflow run из вкладки Actions — НЕ работает (актуальный код тянется из ветки, а не из артефакта). Только через revert.

### Ротация SSH-ключа

```bash
# на твоей машине
ssh-keygen -t ed25519 -C "gha-deploy-okkolo" -f ~/.ssh/okkolo_gha_deploy_new -N ""

# положить новый pub на сервер
cat ~/.ssh/okkolo_gha_deploy_new.pub | \
  ssh nastyasep2004@158.160.128.16 'cat >> ~/.ssh/authorized_keys'

# обновить secret в GitHub
cat ~/.ssh/okkolo_gha_deploy_new | \
  gh secret set SSH_PRIVATE_KEY -R AnikaJily/okkolo

# (повторить для okkolo-cms)
cat ~/.ssh/okkolo_gha_deploy_new | \
  gh secret set SSH_PRIVATE_KEY -R AnikaJily/okkolo-cms

# проверить и удалить старый ключ из authorized_keys на сервере
```

### Защита ветки production

Сейчас не настроена. Рекомендуется (`Settings → Branches → Add rule`):

- Branch name pattern: `production`
- Require a pull request before merging.
- Require status checks to pass (когда добавим проверки).

Это уберёт риск случайного `git push production` мимо ревью.

## Деплой сервера (общая раскладка)

См. [`DEPLOY.md`](./DEPLOY.md) — подробный плейбук по VPS (SSH, nginx, pm2, Postgres, бэкапы). README — про то, что делает CI; DEPLOY.md — про то, что под капотом сервера.

## Ветки

- `main` — устаревшая, не используется (изначально создавалась автоматически).
- `vankrav` — рабочая ветка разработки.
- `production` — то, что сейчас в проде. Push сюда триггерит деплой.

## Что не делать без явного запроса

- Не добавлять react-router, redux/zustand, axios, react-query, form-либы — текущий минимализм осознанный.
- Не пушить напрямую в `production` сырые/непротестированные коммиты — это сразу выкатится.
- Не коммитить `.env.local`.
- Не трогать `dist/` руками — он генерится `npm run build`.

## Известные особенности

- **Картинки в `src/assets/images/` не оптимизированы** (`hero-team.jpg` 3.5 MB, `direction-cafe.png` 2.4 MB). При добавлении новых исходников — сжимай.
- **Strapi fallback маскирует 4xx/5xx** — при изменениях API сначала проверь Network, что fetch реально проходит.
- **State теряется при переходах между подстраницами** (full reload). Корзина переживает релоад через localStorage; всё остальное in-memory — нет.
- **Шрифты Gilroy/Gotham** в репе не лежат — подключаются извне.

Подробнее по архитектуре и инвариантам — [`CLAUDE.md`](./CLAUDE.md).
