import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/sections/ShowroomSection/ProductCard';
import { ProductDetailsModal } from '@/components/sections/ShowroomSection/ProductDetailsModal';
import {
  PRODUCT_CATEGORIES,
  products as fallbackProducts,
  type ProductCategory,
  type ShowroomProduct,
} from '@/data/products';
import { loadCategories, loadProducts, type CategoryOption } from '@/lib/products';
import { FilterChip } from '@/components/ui/FilterChip';
import { useCart } from '@/context/CartContext';
import { CartSheet } from '@/components/cart/CartSheet';
import { FloatingCartButton } from '@/components/cart/FloatingCartButton';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import styles from './ShowroomPage.module.css';

// максимум 3 ряда товаров на страницу; колонок 2 (mobile) или 3 (от 640px) — см. .products в module.css
const ROWS_PER_PAGE = 3;
const COLUMNS_MEDIA_QUERY = '(min-width: 640px)';

function useGridColumns() {
  const [columns, setColumns] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(COLUMNS_MEDIA_QUERY).matches ? 3 : 2,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(COLUMNS_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setColumns(event.matches ? 3 : 2);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return columns;
}

export function ShowroomPage() {
  useDocumentTitle('Шоурум');
  const { addItem, totalCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartAnnouncement, setCartAnnouncement] = useState('');
  const [products, setProducts] = useState<ShowroomProduct[]>(fallbackProducts);
  const [isFallback, setIsFallback] = useState(true);
  const [category, setCategory] = useState<ProductCategory>('all');
  // Чипы-фильтры: стартуют со статичного fallback, затем подменяются справочником из CMS
  const [categories, setCategories] = useState<CategoryOption[]>(PRODUCT_CATEGORIES);
  const [page, setPage] = useState(1);
  const [detailsProduct, setDetailsProduct] = useState<ShowroomProduct | null>(null);
  const pageSize = useGridColumns() * ROWS_PER_PAGE;

  useEffect(() => {
    loadProducts().then((result) => {
      setProducts(result.products);
      setIsFallback(result.isFallback);
    });
  }, []);

  useEffect(() => {
    loadCategories().then(setCategories);
  }, []);

  const filteredProducts = useMemo(() => {
    if (category === 'all') return products;
    return products.filter((product) => product.category === category);
  }, [category, products]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  // page может выйти за пределы при смене категории/ширины экрана — зажимаем без эффекта
  const currentPage = Math.min(page, pageCount);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleCategoryChange = (nextCategory: ProductCategory) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const handleAddToCart = (product: ShowroomProduct) => {
    addItem(product);
    // totalCount на этом рендере ещё старый — прибавляем +1 для корректного объявления
    setCartAnnouncement(`«${product.title}» добавлен в корзину. Всего товаров: ${totalCount + 1}`);
  };

  return (
    <>
    <main id="main" tabIndex={-1} className={styles.root}>
      <h1 className={styles.heading}>Наш шоурум</h1>

      {isFallback ? (
        <p className="systemNotice" role="status">
          Каталог временно недоступен — показываем примеры товаров. Оформление
          заказа отключено, напишите нам, если что-то приглянулось
        </p>
      ) : null}

      {/* Не ARIA-табы: переключатели-фильтры с aria-pressed, как даты в EventsPage */}
      <div className={styles.filters} role="group" aria-label="Категории товаров">
        {categories.map((item) => {
          const isActive = category === item.id;
          return (
            <FilterChip
              key={item.id}
              active={isActive}
              aria-pressed={isActive}
              onClick={() => handleCategoryChange(item.id)}
            >
              {item.label}
            </FilterChip>
          );
        })}
      </div>

      <section className={styles.products} aria-label="Товары шоурума">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onDetails={setDetailsProduct}
              />
            </div>
          ))
        ) : (
          <p className={styles.empty}>В этой категории пока нет товаров.</p>
        )}
      </section>

      {pageCount > 1 ? (
        <nav className={styles.pagination} aria-label="Страницы каталога">
          {Array.from({ length: pageCount }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                type="button"
                className={isActive ? styles.pageButtonActive : styles.pageButton}
                onClick={() => setPage(pageNumber)}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </nav>
      ) : null}
    </main>

    <ProductDetailsModal
      product={detailsProduct}
      open={detailsProduct !== null}
      onOpenChange={(open) => {
        if (!open) setDetailsProduct(null);
      }}
      onAddToCart={handleAddToCart}
    />

    {totalCount > 0 ? (
      <FloatingCartButton count={totalCount} onClick={() => setCartOpen(true)} />
    ) : null}
    {/* CartSheet монтируется всегда: иначе clearCart() при success размонтирует
        шторку до показа экрана «Заказ оформлен», а cartOpen зависает в true */}
    <CartSheet open={cartOpen} onOpenChange={setCartOpen} orderingDisabled={isFallback} />
    {/* Постоянно смонтированный live-region: озвучивает добавление товара (SC 4.1.3) */}
    <p role="status" aria-live="polite" className="visually-hidden">
      {cartAnnouncement}
    </p>
    </>
  );
}
