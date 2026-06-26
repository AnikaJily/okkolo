import {
  PRODUCT_CATEGORIES as FALLBACK_CATEGORIES,
  products as fallbackProducts,
  type ShowroomProduct,
} from '@/data/products';
import {
  collectStrapiImageUrls,
  fetchCategories,
  fetchProducts,
  fetchShowroomHeroUrl,
  getStrapiImageUrl,
  getStrapiResponsiveImage,
  type StrapiProductItem,
} from '@/lib/strapi';

/** Пункт фильтра категорий: 'all' либо slug категории из CMS. */
export interface CategoryOption {
  id: string;
  label: string;
}

export function toProduct(item: StrapiProductItem, index: number): ShowroomProduct {
  const fallback = fallbackProducts[index] ?? fallbackProducts[0];
  const coverUrl = getStrapiImageUrl(item.image) ?? fallback.image;
  const responsive = getStrapiResponsiveImage(item.image);
  const galleryUrls = collectStrapiImageUrls(null, item.gallery);
  // В попапе — только gallery; обложка image — для карточки в каталоге
  const images =
    galleryUrls.length > 0 ? galleryUrls : coverUrl ? [coverUrl] : fallback.images;

  return {
    id: item.documentId,
    title: item.title,
    price: item.price,
    // категория теперь связь-справочник: slug — для фильтра, name — для ярлыка
    category: item.category?.slug ?? '',
    categoryLabel: item.category?.name ?? undefined,
    image: coverUrl,
    imageSrcSet: responsive?.srcSet || undefined,
    imageWidth: responsive?.width,
    imageHeight: responsive?.height,
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
    /* На случай, если CMS вернёт записи с isAvailable=false без серверной фильтрации */
    const visible = items.filter((item) => item.isAvailable !== false);
    const products = visible.map((item, index) => toProduct(item, index));
    if (products.length > 0) return { products, isFallback: false };
  } catch (error) {
    console.error('loadProducts: fallback на статичные данные', error);
  }
  return { products: fallbackProducts, isFallback: true };
}

/**
 * Список категорий для чипов-фильтров. Грузится из CMS (справочник Category);
 * при ошибке/пустоте — статичный fallback. Всегда с пунктом «Все товары» в начале.
 */
export async function loadCategories(): Promise<CategoryOption[]> {
  try {
    const cats = await fetchCategories();
    if (cats.length > 0) {
      const options = cats.map((c) => ({ id: c.slug, label: c.name }));
      return [{ id: 'all', label: 'Все товары' }, ...options];
    }
  } catch (error) {
    console.error('loadCategories: fallback на статичный список', error);
  }
  return FALLBACK_CATEGORIES.map((c) => ({ id: c.id, label: c.label }));
}

export async function loadShowroomHeroUrl(): Promise<string | null> {
  try {
    return await fetchShowroomHeroUrl();
  } catch {
    return null;
  }
}
