export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337';

export interface StrapiImageFormat {
  url: string;
  width?: number;
  height?: number;
}

export interface StrapiImage {
  id?: number;
  documentId?: string;
  url: string;
  width?: number;
  height?: number;
  alternativeText: string | null;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiDirectionItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  href: string | null;
  image: StrapiImage | null;
}

export interface StrapiEventType {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  order?: number | null;
}

export interface StrapiEventItem {
  id: number;
  documentId: string;
  title: string;
  slug?: string | null;
  date: string;
  description?: string | null;
  isPaid?: boolean | null;
  price?: number | null;
  spotsTotal?: number | null;
  spotsTaken?: number | null;
  /** Связь-справочник (manyToOne). null, если тип у мероприятия не выбран. */
  type?: StrapiEventType | null;
  photo: StrapiImage | null;
  gallery?: StrapiImage[] | null;
}

export type StrapiProductCategory = 'ceramics' | 'jewelry' | 'clothing' | 'textile';

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  order?: number | null;
}

export interface StrapiProductItem {
  id: number;
  documentId: string;
  title: string;
  price: number;
  /** Связь-справочник (manyToOne). null, если у товара категория не выбрана. */
  category: StrapiCategory | null;
  description?: string | null;
  cartUrl?: string | null;
  image: StrapiImage | null;
  gallery?: StrapiImage[] | null;
  isAvailable?: boolean | null;
}

export interface StrapiFile {
  id?: number;
  documentId?: string;
  url: string;
  name?: string;
  size?: number;
  ext?: string;
  mime?: string;
}

export interface StrapiCafeMenuPage {
  id: number;
  documentId: string;
  mainPosterImage: StrapiImage | null;
  mainPosterAlt: string | null;
  summerPosterImage: StrapiImage | null;
  summerPosterAlt: string | null;
  footnote: string | null;
}

export type StrapiMenuCategory =
  | 'coffee'
  | 'tea'
  | 'signature'
  | 'topping'
  | 'cold'
  | 'lemonade';

export type StrapiMenuSeason = 'main' | 'summer' | 'winter';

export interface StrapiMenuItem {
  id: number;
  documentId: string;
  name: string;
  volume?: string | null;
  price: string;
  note?: string | null;
  category: StrapiMenuCategory | string;
  season: StrapiMenuSeason | string;
  order?: number | null;
}

export type StrapiAnnualReportKind = 'content' | 'finance' | 'nko-activity' | 'spending';

export interface StrapiAnnualReport {
  id: number;
  documentId: string;
  year: number;
  kind: StrapiAnnualReportKind | string;
  pdf: StrapiFile | null;
  note?: string | null;
}

export type StrapiLegalDocumentCategory = 'requisites' | 'foundation' | 'privacy';

export interface StrapiLegalDocument {
  id: number;
  documentId: string;
  title: string;
  category: StrapiLegalDocumentCategory | string;
  pdf: StrapiFile | null;
  order?: number | null;
}

export interface StrapiShowroomSettings {
  id: number;
  documentId: string;
  hero: StrapiImage | null;
}

export interface StrapiShowroomEntry {
  id: number;
  documentId: string;
  heroImage: StrapiImage | null;
}

export interface StrapiWorkshopsPage {
  id: number;
  documentId: string;
  intro?: string | null;
  audienceText?: string | null;
  audienceNote?: string | null;
  afterIntro?: string | null;
  audiencePhoto: StrapiImage | null;
  audiencePhotoAlt?: string | null;
  afterLearningPhoto: StrapiImage | null;
  afterLearningPhotoAlt?: string | null;
}

export interface StrapiWorkshopProgram {
  id: number;
  documentId: string;
  title: string;
  description: string;
  image: StrapiImage | null;
  order?: number | null;
}

export interface StrapiAboutPage {
  id: number;
  documentId: string;
  eyebrow?: string | null;
  title?: string | null;
  lead?: string | null;
  tagline?: string | null;
  heroPhoto: StrapiImage | null;
  heroPhotoAlt?: string | null;
}

export interface StrapiAboutPhoto {
  id: number;
  documentId: string;
  image: StrapiImage;
  alt?: string | null; // фото пространства: описание для скринридера
  name?: string | null; // фото команды: имя
  role?: string | null; // фото команды: должность
  order?: number | null;
}

export interface StrapiAccessibilityPage {
  id: number;
  documentId: string;
  title?: string | null;
  lead?: string | null;
  heroPhoto: StrapiImage | null;
  heroPhotoAlt?: string | null;
}

export interface StrapiSingleResponse<T> {
  data: T | null;
}

export interface EventRegistrationInput {
  eventId: string;
  eventTitle: string;
  name: string;
  phone: string;
  email?: string;
  comment?: string;
}

export interface WorkshopApplicationInput {
  name: string;
  contactMethod: 'phone' | 'email';
  phone?: string;
  email?: string;
}

export interface OrderLineInput {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export type FulfillmentType = 'pickup' | 'delivery';
export type OrderStatus = 'pending';

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  email?: string;
  itemsSubtotal: number;
  deliveryPrice: number;
  totalPrice: number;
  items: OrderLineInput[];
  orderStatus: OrderStatus;
  fulfillmentType: FulfillmentType;
  address?: string;
  city?: string;
  deliveryComment?: string;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination: { total: number } };
}

export function getStrapiImageUrl(image: StrapiImage | null): string | null {
  if (!image) return null;
  const url = image.formats.large?.url ?? image.formats.medium?.url ?? image.url;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

export interface StrapiResponsiveImage {
  /** Fallback для <img src> — крупнейший готовый формат (не тяжёлый оригинал). */
  src: string;
  /** srcSet из форматов Strapi: "url 117w, url 375w, …" — браузер берёт размер под слот. */
  srcSet: string;
  /** Размеры оригинала для width/height на <img> (резервируют место — защита от CLS). */
  width?: number;
  height?: number;
}

/**
 * Строит responsive-картинку из форматов Strapi (thumbnail/small/medium/large + оригинал).
 * Раньше фронт через getStrapiImageUrl всегда брал `large` даже в маленькую карточку —
 * лишний трафик (Lighthouse: «Improve image delivery»). srcSet даёт браузеру выбор.
 */
export function getStrapiResponsiveImage(image: StrapiImage | null): StrapiResponsiveImage | null {
  if (!image) return null;
  const toAbs = (u: string) => (u.startsWith('http') ? u : `${STRAPI_URL}${u}`);

  const formats: { url: string; width: number }[] = [];
  const f = image.formats ?? {};
  (['thumbnail', 'small', 'medium', 'large'] as const).forEach((key) => {
    const fmt = f[key];
    if (fmt?.url && fmt.width) formats.push({ url: toAbs(fmt.url), width: fmt.width });
  });

  // Дедуп по ширине; оригинал добавляем лишь если он крупнее самого большого формата
  const byWidth = new Map<number, string>();
  formats.forEach((c) => byWidth.set(c.width, c.url));
  if (image.url && image.width && !byWidth.has(image.width)) {
    byWidth.set(image.width, toAbs(image.url));
  }

  const sorted = [...byWidth.entries()].sort((a, b) => a[0] - b[0]);
  if (sorted.length === 0) {
    const fallback = getStrapiImageUrl(image);
    return fallback
      ? { src: fallback, srcSet: '', width: image.width, height: image.height }
      : null;
  }

  const srcSet = sorted.map(([w, url]) => `${url} ${w}w`).join(', ');
  // src — крупнейший формат (а не оригинал-1920px), либо самый большой кандидат
  const src = formats.length ? formats[formats.length - 1].url : sorted[sorted.length - 1][1];

  return { src, srcSet, width: image.width, height: image.height };
}

/** Прямая ссылка на медиа-файл (PDF, doc и т.п.) с учётом базового адреса CMS. */
export function getStrapiFileUrl(file: StrapiFile | null): string | null {
  if (!file?.url) return null;
  return file.url.startsWith('http') ? file.url : `${STRAPI_URL}${file.url}`;
}

function getStrapiImageDedupKey(image: StrapiImage): string | null {
  if (image.documentId) return `doc:${image.documentId}`;
  if (image.id != null) return `id:${image.id}`;

  const rawUrl = image.url || image.formats?.large?.url || image.formats?.medium?.url;
  if (!rawUrl) return null;

  try {
    const pathname = new URL(rawUrl, STRAPI_URL).pathname;
    // Один файл в разных formats (large_, medium_…) — одна миниатюра
    return pathname.replace(/\/(thumbnail_|small_|medium_|large_)/g, '/');
  } catch {
    return rawUrl;
  }
}

export function collectStrapiImageUrls(
  primary: StrapiImage | null,
  gallery?: StrapiImage[] | null,
): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  const add = (image: StrapiImage | null) => {
    if (!image) return;
    const key = getStrapiImageDedupKey(image);
    if (!key || seen.has(key)) return;
    const url = getStrapiImageUrl(image);
    if (!url) return;
    seen.add(key);
    urls.push(url);
  };

  add(primary);
  gallery?.forEach((image) => add(image));
  return urls;
}

export async function fetchDirections(): Promise<StrapiDirectionItem[]> {
  const res = await fetch(`${STRAPI_URL}/api/directions?populate=image`);
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiDirectionItem> = await res.json();
  return json.data;
}

export async function fetchEvents(): Promise<StrapiEventItem[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/events?populate[photo]=true&populate[gallery]=true&populate[type]=true&sort=date:asc`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiEventItem> = await res.json();
  return json.data;
}

export async function fetchProducts(): Promise<StrapiProductItem[]> {
  /* isAvailable=null/undefined у старых записей до миграции — пропустим, если не false */
  const res = await fetch(
    `${STRAPI_URL}/api/products?populate[image]=true&populate[gallery]=true&populate[category]=true&sort=title:asc&filters[isAvailable][$ne]=false`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiProductItem> = await res.json();
  return json.data;
}

export async function fetchCategories(): Promise<StrapiCategory[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/categories?sort=order:asc&pagination[pageSize]=100`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiCategory> = await res.json();
  return json.data;
}

export async function fetchCafeMenuPage(): Promise<StrapiCafeMenuPage | null> {
  const res = await fetch(`${STRAPI_URL}/api/cafe-menu-page?populate=*`);
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiSingleResponse<StrapiCafeMenuPage> = await res.json();
  return json.data ?? null;
}

export async function fetchMenuItems(): Promise<StrapiMenuItem[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/menu-items?sort[0]=order:asc&sort[1]=name:asc&pagination[pageSize]=200`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiMenuItem> = await res.json();
  return json.data;
}

export async function fetchAnnualReports(): Promise<StrapiAnnualReport[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/annual-reports?populate=pdf&sort[0]=year:desc&pagination[pageSize]=200`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiAnnualReport> = await res.json();
  return json.data;
}

export async function fetchLegalDocuments(): Promise<StrapiLegalDocument[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/legal-documents?populate=pdf&sort=order:asc&pagination[pageSize]=200`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiLegalDocument> = await res.json();
  return json.data;
}

let showroomHeroCache: Promise<string | null> | null = null;

/** Hero шоурума: коллекция `showrooms` (поле `heroImage`) или Single Type `showroom` (поле `hero`). */
export function fetchShowroomHeroUrl(): Promise<string | null> {
  if (!showroomHeroCache) {
    showroomHeroCache = (async () => {
      try {
        const collectionRes = await fetch(`${STRAPI_URL}/api/showrooms?populate=heroImage`);
        if (collectionRes.ok) {
          const collectionJson: StrapiListResponse<StrapiShowroomEntry> =
            await collectionRes.json();
          const fromCollection = getStrapiImageUrl(collectionJson.data[0]?.heroImage ?? null);
          if (fromCollection) return fromCollection;
        }

        const singleRes = await fetch(`${STRAPI_URL}/api/showroom?populate=hero`);
        if (singleRes.ok) {
          const singleJson: StrapiSingleResponse<StrapiShowroomSettings> = await singleRes.json();
          return getStrapiImageUrl(singleJson.data?.hero ?? null);
        }
      } catch {
        return null;
      }
      return null;
    })();
  }
  return showroomHeroCache;
}

export async function fetchWorkshopsPage(): Promise<StrapiWorkshopsPage | null> {
  const res = await fetch(`${STRAPI_URL}/api/workshops-page?populate=*`);
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiSingleResponse<StrapiWorkshopsPage> = await res.json();
  return json.data ?? null;
}

export async function fetchWorkshopPrograms(): Promise<StrapiWorkshopProgram[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/workshop-programs?populate=image&sort[0]=order:asc&sort[1]=title:asc&pagination[pageSize]=50`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiWorkshopProgram> = await res.json();
  return json.data;
}

export async function fetchAboutPage(): Promise<StrapiAboutPage | null> {
  const res = await fetch(`${STRAPI_URL}/api/about-page?populate=heroPhoto`);
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiSingleResponse<StrapiAboutPage> = await res.json();
  return json.data ?? null;
}

export async function fetchAboutTeamPhotos(): Promise<StrapiAboutPhoto[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/about-team-photos?populate=image&sort[0]=order:asc&pagination[pageSize]=50`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiAboutPhoto> = await res.json();
  return json.data;
}

export async function fetchAboutWorkplacePhotos(): Promise<StrapiAboutPhoto[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/about-workplace-photos?populate=image&sort[0]=order:asc&pagination[pageSize]=50`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiAboutPhoto> = await res.json();
  return json.data;
}

export async function fetchAccessibilityPage(): Promise<StrapiAccessibilityPage | null> {
  const res = await fetch(`${STRAPI_URL}/api/accessibility-page?populate=heroPhoto`);
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiSingleResponse<StrapiAccessibilityPage> = await res.json();
  return json.data ?? null;
}

export async function createEventRegistration(input: EventRegistrationInput) {
  const res = await fetch(`${STRAPI_URL}/api/event-registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: input,
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`Strapi error: ${res.status} ${details}`);
  }
  return res.json();
}

export async function createWorkshopApplication(input: WorkshopApplicationInput) {
  const res = await fetch(`${STRAPI_URL}/api/workshop-applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: input,
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`Strapi error: ${res.status} ${details}`);
  }
  return res.json();
}

export interface CreateOrderResult {
  data?: { id?: number; documentId?: string };
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const res = await fetch(`${STRAPI_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: input,
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`Strapi error: ${res.status} ${details}`);
  }
  return res.json();
}
