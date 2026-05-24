export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337';

export interface StrapiImage {
  id?: number;
  documentId?: string;
  url: string;
  alternativeText: string | null;
  formats: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
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

export interface StrapiEventItem {
  id: number;
  documentId: string;
  title: string;
  date: string;
  description?: string | null;
  href?: string | null;
  signupHref?: string | null;
  isPaid?: boolean | null;
  price?: number | null;
  paymentUrl?: string | null;
  photo: StrapiImage | null;
}

export type StrapiProductCategory = 'ceramics' | 'jewelry' | 'clothing' | 'textile';

export interface StrapiProductItem {
  id: number;
  documentId: string;
  title: string;
  price: number;
  category: StrapiProductCategory | string;
  description?: string | null;
  cartUrl?: string | null;
  image: StrapiImage | null;
  gallery?: StrapiImage[] | null;
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
  paymentStatus?: 'pending' | 'not_required';
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
  const res = await fetch(`${STRAPI_URL}/api/events?populate=photo&sort=date:asc`);
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiEventItem> = await res.json();
  return json.data;
}

export async function fetchProducts(): Promise<StrapiProductItem[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/products?populate[image]=true&populate[gallery]=true&sort=title:asc`,
  );
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json: StrapiListResponse<StrapiProductItem> = await res.json();
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

export async function createOrder(input: CreateOrderInput) {
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
