import {
  products as fallbackProducts,
  type ProductCategory,
  type ShowroomProduct,
} from '@/data/products';
import {
  collectStrapiImageUrls,
  fetchProducts,
  fetchShowroomHeroUrl,
  getStrapiImageUrl,
  type StrapiProductItem,
} from '@/lib/strapi';

const PRODUCT_CATEGORIES = new Set<Exclude<ProductCategory, 'all'>>([
  'ceramics',
  'jewelry',
  'clothing',
  'textile',
]);

function isProductCategory(value: string): value is Exclude<ProductCategory, 'all'> {
  return PRODUCT_CATEGORIES.has(value as Exclude<ProductCategory, 'all'>);
}

export function toProduct(item: StrapiProductItem, index: number): ShowroomProduct | null {
  if (!isProductCategory(item.category)) return null;

  const fallback = fallbackProducts[index] ?? fallbackProducts[0];
  const coverUrl = getStrapiImageUrl(item.image) ?? fallback.image;
  const galleryUrls = collectStrapiImageUrls(null, item.gallery);
  // В попапе — только gallery; обложка image — для карточки в каталоге
  const images =
    galleryUrls.length > 0 ? galleryUrls : coverUrl ? [coverUrl] : fallback.images;

  return {
    id: item.documentId,
    title: item.title,
    price: item.price,
    category: item.category,
    image: coverUrl,
    images,
    description: item.description?.trim() || fallback.description,
    cartUrl: item.cartUrl ?? undefined,
  };
}

export interface LoadProductsResult {
  products: ShowroomProduct[];
  /** true — каталог из моков (CMS недоступна или пуста): реальный заказ оформлять нельзя */
  isFallback: boolean;
}

export async function loadProducts(): Promise<LoadProductsResult> {
  try {
    const items = await fetchProducts();
    const products = items
      .map((item, index) => toProduct(item, index))
      .filter((product): product is ShowroomProduct => product !== null);
    if (products.length > 0) return { products, isFallback: false };
  } catch (error) {
    console.error('loadProducts: fallback на статичные данные', error);
  }
  return { products: fallbackProducts, isFallback: true };
}

export async function loadShowroomHeroUrl(): Promise<string | null> {
  try {
    return await fetchShowroomHeroUrl();
  } catch {
    return null;
  }
}
