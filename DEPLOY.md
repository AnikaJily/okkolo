# Деплой «Окколо»

Документация по продакшен-инсталляции фронта (`okkolo`) и CMS (`okkolo-cms`) на единый VPS.

## TL;DR

| | |
|---|---|
| IP сервера | `158.160.128.16` |
| Домен | `okkolo-project.ru` (HTTPS, Let's Encrypt / Certbot) |
| ОС | Ubuntu 24.04 LTS |
| Сайт | https://okkolo-project.ru (http и голый IP → 301 на HTTPS) |
| Админка Strapi | https://okkolo-project.ru/admin |
| API | https://okkolo-project.ru/api/... |
| Пользователь на сервере | `nastyasep2004` (sudo NOPASSWD) |
| SSH | `ssh nastyasep2004@158.160.128.16` |

## Архитектура

```
                ┌─────────────────────────────────────────────────────┐
                │                  158.160.128.16                     │
                │                                                     │
   :80  ───►    │   nginx ───►  /              → /home/nastyasep2004  │
                │             /assets/         → /apps/web (статика)  │
                │                                                     │
                │             /admin           ┐                      │
                │             /api             ├──► 127.0.0.1:1337    │
                │             /uploads         │    (Strapi, pm2)     │
                │             /content-manager │                      │
                │             /content-type-…  │                      │
                │             /upload          │                      │
                │             /i18n            │                      │
                │             /users-permis-…  │                      │
                │             /email /users    │                      │
                │             /auth /_health   ┘                      │
                │                                                     │
                │                            127.0.0.1:5432           │
                │                            PostgreSQL 16            │
                │                            (БД okkolo_cms)          │
                └─────────────────────────────────────────────────────┘
```

- **Фронт** — собирается **локально** (`npm run build`), готовый `dist/` синкается на сервер через `rsync`. Nginx раздаёт статику.
- **Strapi** — лежит в `~/apps/cms`, запущен через `pm2` под именем `okkolo-cms`, слушает `127.0.0.1:1337` (наружу не торчит — только через Nginx proxy).
- **PostgreSQL 16** — локальный, слушает только `127.0.0.1:5432`. БД `okkolo_cms`, юзер `okkolo`. Пароль — в `~/apps/cms/.env`.

## Раскладка на сервере

```
/home/nastyasep2004/
├── .ssh/authorized_keys           # SSH-ключи доступа
├── apps/
│   ├── cms/                       # Strapi
│   │   ├── .env                   # секреты + DB credentials (chmod 600)
│   │   ├── config/
│   │   ├── src/
│   │   ├── public/uploads/        # media (бэкапить)
│   │   ├── dist/                  # сборка после npm run build
│   │   └── node_modules/
│   └── web/                       # фронт (собранный dist/)
│       ├── index.html
│       └── assets/
└── .pm2/                          # pm2 logs и state

/etc/nginx/
├── sites-available/okkolo         # наш конфиг
└── sites-enabled/okkolo -> ../sites-available/okkolo

/etc/sudoers.d/nastyasep2004        # NOPASSWD sudo
/etc/systemd/system/pm2-nastyasep2004.service   # автозапуск pm2
```

Чтобы Nginx (юзер `www-data`) мог зайти в `/home/nastyasep2004`, на этой папке стоит `chmod o+x` (только execute, не read — листинг по-прежнему запрещён).

Swap: `/swapfile` 2 GB, прописан в `/etc/fstab`.

## Стек

| Компонент | Версия | Где установлен |
|---|---|---|
| Ubuntu | 24.04 LTS | системно |
| Node.js | 20.20.2 | NodeSource репозиторий |
| npm | 10.8.2 | вместе с Node |
| PostgreSQL | 16.14 | apt |
| Nginx | 1.24.0 | apt |
| pm2 | 7.0.1 | глобально через npm |
| fail2ban | apt | системно, защищает SSH |
| UFW | apt | открыто 22/tcp, 80/tcp |

## SSH и доступ

```bash
ssh nastyasep2004@158.160.128.16
```

Аутентификация — только по ключу. Sudo без пароля:

```bash
sudo cat /etc/sudoers.d/nastyasep2004
# nastyasep2004 ALL=(ALL) NOPASSWD:ALL
```

## Управление процессом Strapi

Strapi запущен под pm2. Имя процесса — `okkolo-cms`.

```bash
pm2 status                          # список процессов
pm2 logs okkolo-cms                 # хвост логов (Ctrl+C для выхода)
pm2 logs okkolo-cms --lines 50 --nostream   # последние 50 строк без follow
pm2 restart okkolo-cms              # перезапуск
pm2 restart okkolo-cms --update-env # перезапуск с подхватом изменений .env
pm2 stop okkolo-cms                 # остановить
pm2 start okkolo-cms                # запустить
```

После любых изменений в `.env` или `config/` нужен `pm2 restart okkolo-cms --update-env`.

Логи pm2 пишутся в `~/.pm2/logs/okkolo-cms-{out,error}.log`.

Автозапуск после перезагрузки сервера — через `systemd unit pm2-nastyasep2004.service`:

```bash
sudo systemctl status pm2-nastyasep2004
sudo systemctl is-enabled pm2-nastyasep2004    # должно быть "enabled"
```

Если изменил состав процессов или их параметры — после изменения обязательно зафиксируй текущий список:

```bash
pm2 save
```

## Конфиг Strapi

`~/apps/cms/.env`:

```
HOST=127.0.0.1
PORT=1337
NODE_ENV=production
PUBLIC_URL=http://158.160.128.16
IS_PROXIED=true

DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=okkolo_cms
DATABASE_USERNAME=okkolo
DATABASE_PASSWORD=<секретный пароль БД>
DATABASE_SSL=false

CORS_ORIGIN=http://158.160.128.16
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
ENCRYPTION_KEY=...
```

- `PUBLIC_URL` + `IS_PROXIED=true` — нужны, чтобы Strapi правильно генерировал ссылки за reverse-прокси (в `config/server.ts` они проброшены через env).
- При смене внешнего IP/добавлении домена нужно поменять `PUBLIC_URL` и `CORS_ORIGIN`.

`.env` — `chmod 600`, **не пушится в git** (он в `.gitignore`).

## PostgreSQL

```bash
# зайти под postgres
sudo -u postgres psql

# зайти в БД okkolo_cms напрямую (попросит пароль из .env)
PGPASSWORD='<пароль>' psql -h 127.0.0.1 -U okkolo -d okkolo_cms
```

База создана так:

```sql
CREATE USER okkolo WITH PASSWORD '<секрет>';
CREATE DATABASE okkolo_cms OWNER okkolo ENCODING 'UTF8' TEMPLATE template0;
GRANT ALL PRIVILEGES ON DATABASE okkolo_cms TO okkolo;
ALTER USER okkolo CREATEDB;
```

Бэкап БД:

```bash
PGPASSWORD='<пароль>' pg_dump -h 127.0.0.1 -U okkolo okkolo_cms \
  | gzip > ~/backup-okkolo-$(date +%F).sql.gz
```

Восстановление:

```bash
gunzip -c backup-okkolo-2026-XX-XX.sql.gz \
  | PGPASSWORD='<пароль>' psql -h 127.0.0.1 -U okkolo okkolo_cms
```

> Сейчас бэкап-скрипт не настроен — это пункт для следующей итерации (cron + хранилище).

## Nginx

Конфиг: `/etc/nginx/sites-enabled/okkolo`.

Что он делает:

- `listen 80` — единственный публичный вход.
- `client_max_body_size 50M` — лимит загружаемых через Strapi файлов (медиа в админке).
- `gzip on` для текстовых ресурсов.
- `location /assets/` — отдаёт хешированные ассеты Vite с `Cache-Control: public, immutable, 1y`.
- `location ~ ^/(admin|api|uploads|content-manager|content-type-builder|upload|i18n|users-permissions|email|users|auth|_health|documentation|review-workflows|webhooks|ai)(/|$)` — проксирует на `http://127.0.0.1:1337` с `X-Forwarded-*` заголовками.
- `location /` — SPA fallback (`try_files $uri $uri/ /index.html;`).

Перезагрузить конфиг после правок:

```bash
sudo nginx -t                       # проверка синтаксиса (обязательно перед reload)
sudo systemctl reload nginx
```

Логи Nginx:

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Файрвол и безопасность

- **UFW** открывает только 22/tcp (SSH) и 80/tcp (HTTP). 1337 и 5432 закрыты снаружи.
- **fail2ban** банит IP, которые брутят SSH.
- Strapi и Postgres биндятся только на `127.0.0.1`.

```bash
sudo ufw status verbose
sudo fail2ban-client status sshd
```

Если когда-нибудь понадобится HTTPS — открыть 443/tcp в UFW, а 80 оставить под HTTP→HTTPS redirect (см. ниже).

## Деплой / обновление

### Фронт

С локальной машины:

```bash
cd ~/Projects/okkolo
VITE_STRAPI_URL=https://okkolo-project.ru npm run build
rsync -az --delete -e ssh dist/ nastyasep2004@158.160.128.16:~/apps/web/
```

`--delete` чистит старые файлы. Nginx не нужно перезагружать — он раздаёт прямо из `~/apps/web/`.

> **Важно про `VITE_STRAPI_URL`:** сайт работает по HTTPS (`https://okkolo-project.ru`), API проксируется на том же origin. Поэтому собирать нужно **именно с `https://okkolo-project.ru`** — если собрать со старым `http://158.160.128.16`, браузер заблокирует запросы как mixed-content, и фронт молча свалится на моки. Можно оставить значение пустым (тогда фронт пойдёт на относительный `/api`, тот же origin) — это даже надёжнее при смене домена.

### CMS

> ⚠️ **ОСТОРОЖНО: прод-схема CMS опережает репозиторий (актуально на 2026-06-27).**
> Контент-типы на сервере правили напрямую через админку (Content-Type Builder переписал
> `schema.json` на сервере), и эти изменения **не вернули в git**. На проде сейчас:
> `event.type` и `product.category` — это **relation** (коллекции `event-types`, `categories`
> + link-таблицы `events_type_lnk`, `products_category_lnk`), а у `order` есть поля
> `itemsSubtotal`/`deliveryPrice`. В репозитории же `type`/`category` — старый `enumeration`.
> **Поэтому `rsync` репы поверх прода СЕЙЧАС НЕЛЬЗЯ** — Strapi на старте «домигрирует» схему вниз
> и удалит relation-связи/поля (потеря данных). Сначала нужно **синхронизировать репозиторий с
> продом**: стянуть актуальные `src/api/**/schema.json` и `types/generated/*` с сервера в git,
> и только потом деплоить. Перед любым деплоем CMS — `pg_dump` (см. раздел PostgreSQL).

С локальной машины (без переноса `.env` и `node_modules`):

```bash
cd ~/Projects/okkolo-cms
rsync -az \
  --exclude node_modules --exclude .tmp --exclude .strapi \
  --exclude dist --exclude .git --exclude .env \
  -e ssh ./ nastyasep2004@158.160.128.16:~/apps/cms/
```

На сервере:

```bash
ssh nastyasep2004@158.160.128.16
cd ~/apps/cms
npm ci                                         # если поменялись зависимости
NODE_OPTIONS="--max-old-space-size=2048" NODE_ENV=production npm run build
pm2 restart okkolo-cms --update-env
```

`--max-old-space-size=2048` нужен только если на сервере < 4 GB RAM — иначе можно опустить.

### Изменения схемы (content-types)

Если правил content-types локально через UI Strapi'а — файлы `src/api/**/content-types/**/schema.json` обновятся. Их нужно залить на сервер и пересобрать (см. выше). Миграции БД Strapi выполняет сам при старте.

## Что нужно сделать после первого деплоя

1. Открыть http://158.160.128.16/admin → создать первого администратора.
2. Создать content-types (Content-Type Builder в админке): `directions`, `events`, `products`, `showroom`, `event-registrations`, `orders`. Названия и поля должны совпадать с тем, как их ждёт `src/lib/strapi.ts`.
3. В **Settings → Users & Permissions → Roles → Public** разрешить нужные `find` / `findOne` (читаемые публикой). Это автоматизировано в `okkolo-cms/src/index.ts` (`ensurePublicPermissions`) — на каждом старте Strapi сам выставит read-доступ к `api::direction.direction`. Чтобы добавить ещё типы — допиши их в массив `PUBLIC_READ_UIDS`.
4. Залить контент (картинки и тексты).

Пока контент-типы не созданы, фронт молча фоллбэчит на моки из `src/data/` — это by design.

## Домен / HTTPS — НАСТРОЕНО

✅ **Уже сделано (июнь 2026):** домен `okkolo-project.ru` указывает на `158.160.128.16`,
HTTPS выпущен Certbot'ом (Let's Encrypt), nginx редиректит `:80` → HTTPS
(`return 301 https://$host$request_uri`), `root` отдаётся из `~/apps/web`.
В `~/apps/cms/.env` — `PUBLIC_URL=https://okkolo-project.ru` и `CORS_ORIGIN=https://okkolo-project.ru`.
Сертификат продлевается автоматически (cron от Certbot).

Шаги ниже оставлены как справка — на случай переноса на другой домен/сервер:

1. Указать A-запись домена на `158.160.128.16`.
2. Открыть 443/tcp:
   ```bash
   sudo ufw allow 443/tcp
   ```
3. Поставить certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d example.ru -d www.example.ru
   ```
   Certbot сам пропишет `listen 443 ssl;`, сертификаты и редирект с 80 на 443.
4. Обновить `~/apps/cms/.env`:
   ```
   PUBLIC_URL=https://example.ru
   CORS_ORIGIN=https://example.ru
   ```
   ```bash
   pm2 restart okkolo-cms --update-env
   ```
5. Пересобрать фронт с новым URL:
   ```bash
   VITE_STRAPI_URL=https://example.ru npm run build
   rsync -az --delete -e ssh dist/ nastyasep2004@158.160.128.16:~/apps/web/
   ```

Certbot ставит cron-задачу автообновления — отдельной заботы по продлению нет.

## Диагностика

| Симптом | Куда смотреть |
|---|---|
| Сайт не открывается | `sudo systemctl status nginx`, `sudo nginx -t`, `/var/log/nginx/error.log` |
| Админка падает / 502 | `pm2 status`, `pm2 logs okkolo-cms`, проверить что порт 1337 слушается: `ss -tlnp \| grep 1337` |
| 500 на статике с правами | `sudo tail /var/log/nginx/error.log` — обычно `Permission denied`. Решение: `sudo chmod o+x /home/nastyasep2004` |
| Strapi не подключается к БД | проверить, что postgres жив (`sudo systemctl status postgresql`), что пароль в `.env` совпадает с тем, что в `pg_hba.conf` ожидает БД, что юзер `okkolo` существует |
| Закончилось место | `df -h`. Большие файлы обычно — `~/.pm2/logs/*.log` (можно `pm2 flush`) и `~/apps/cms/.tmp/` |
| OOM при `npm run build` | поднять heap: `NODE_OPTIONS="--max-old-space-size=2048"` |
| SSL-сертификат не продлился | `sudo certbot renew --dry-run` |

## Контрольные команды (быстрый health-check)

```bash
# С локальной машины:
curl -s -o /dev/null -w "/ %{http_code}\n" https://okkolo-project.ru/
curl -s -o /dev/null -w "/admin %{http_code}\n" https://okkolo-project.ru/admin
curl -sg "https://okkolo-project.ru/api/events?populate[type]=true" | head -c 200
# ВАЖНО: для URL со скобками (?populate[type]=...) нужен флаг -g (--globoff),
# иначе curl трактует [ ] как glob-диапазон и молча возвращает пустой ответ.

# На сервере:
pm2 status
sudo systemctl is-active nginx postgresql pm2-nastyasep2004
free -h
df -h /
```

## История изменений в коде ради деплоя

- `okkolo-cms/config/server.ts` — добавлены `url: env('PUBLIC_URL', '')` и `proxy: env.bool('IS_PROXIED', false)`, чтобы Strapi корректно работал за Nginx-прокси. На dev'е дефолты пустые — поведение не меняется.
- `okkolo-cms/src/index.ts` — `bootstrap()` на каждом старте выдаёт public-роли read-доступ к перечисленным API. Расширять `PUBLIC_READ_UIDS` / `PUBLIC_CREATE_UIDS` по мере добавления content-types.
- `okkolo/.gitignore` — добавлены `.env`, `.env.local`, `.env.*.local`.
