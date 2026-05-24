import { useEffect, useMemo, useState } from 'react';
import showroomHeroFallback from '@/assets/images/showroom-hero.png';
import { ProductCard } from '@/components/sections/ShowroomSection/ProductCard';
import { ProductDetailsModal } from '@/components/sections/ShowroomSection/ProductDetailsModal';
import {
  PRODUCT_CATEGORIES,
  products as fallbackProducts,
  type ProductCategory,
  type ShowroomProduct,
} from '@/data/products';
import { loadProducts, loadShowroomHeroUrl } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { CartSheet } from '@/components/cart/CartSheet';
import { FloatingCartButton } from '@/components/cart/FloatingCartButton';
import styles from './ShowroomPage.module.css';

const PAGE_SIZE = 6;

export function ShowroomPage() {
  const { addItem, totalCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<ShowroomProduct[]>(fallbackProducts);
  const [heroSrc, setHeroSrc] = useState(showroomHeroFallback);
  const [category, setCategory] = useState<ProductCategory>('all');
  const [page, setPage] = useState(1);
  const [detailsProduct, setDetailsProduct] = useState<ShowroomProduct | null>(null);

  useEffect(() => {
    loadProducts()
      .then((items) => {
        if (items.length > 0) setProducts(items);
      })
      .catch(() => {
        // fallback на статичные данные при ошибке сети
      });

    loadShowroomHeroUrl()
      .then((url) => {
        if (url) setHeroSrc(url);
      })
      .catch(() => {
        // fallback на локальное изображение
      });
  }, []);

  const filteredProducts = useMemo(() => {
    if (category === 'all') return products;
    return products.filter((product) => product.category === category);
  }, [category, products]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  const handleCategoryChange = (nextCategory: ProductCategory) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const handleAddToCart = (product: ShowroomProduct) => {
    addItem(product);
  };

  return (
    <>
    <main className={styles.root}>
      <h1 className={styles.heading}>Наш шоурум</h1>

      <img
        src={heroSrc}
        alt="Интерьер шоурума «Окколо»"
        className={styles.hero}
        decoding="async"
      />

      <div className={styles.filters} role="tablist" aria-label="Категории товаров">
        {PRODUCT_CATEGORIES.map((item) => {
          const isActive = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.filterButtonActive : styles.filterButton}
              onClick={() => handleCategoryChange(item.id)}
            >
              {item.label}
            </button>
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
            const isActive = pageNumber === page;
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
      <>
        <FloatingCartButton count={totalCount} onClick={() => setCartOpen(true)} />
        <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      </>
    ) : null}
    </>
  );
}
