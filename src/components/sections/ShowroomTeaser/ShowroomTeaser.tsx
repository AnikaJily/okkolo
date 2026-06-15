import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/sections/ShowroomSection/ProductCard';
import { ProductDetailsModal } from '@/components/sections/ShowroomSection/ProductDetailsModal';
import { useCart } from '@/context/CartContext';
import {
  products as fallbackProducts,
  type ShowroomProduct,
} from '@/data/products';
import { loadProducts } from '@/lib/products';
import styles from './ShowroomTeaser.module.css';

const TEASER_PRODUCT_LIMIT = 3;

function pickTeaserProducts(products: ShowroomProduct[]): ShowroomProduct[] {
  return products.slice(0, TEASER_PRODUCT_LIMIT);
}

function goToShowroom() {
  window.location.href = '/showroom';
}

export function ShowroomTeaser() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<ShowroomProduct[]>(() =>
    pickTeaserProducts(fallbackProducts),
  );
  const [detailsProduct, setDetailsProduct] = useState<ShowroomProduct | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadProducts().then((result) => {
      if (cancelled) return;
      setProducts(pickTeaserProducts(result.products));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddToCart = (product: ShowroomProduct) => {
    addItem(product);
    goToShowroom();
  };

  if (products.length === 0) return null;

  return (
    <>
      <section
        id="showroom-teaser"
        className={styles.root}
        aria-labelledby="showroom-teaser-heading"
      >
        <header className={styles.head}>
          <h2 id="showroom-teaser-heading" className={styles.heading}>
            Сделано в наших мастерских
          </h2>
          <p className={styles.lead}>
            Керамика, украшения, текстиль — ручная работа резидентов
            студии. Каждая покупка поддерживает мастеров проекта.
          </p>
        </header>

        <ul className={styles.list}>
          {products.map((product) => (
            <li key={product.id} className={styles.item}>
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onDetails={setDetailsProduct}
              />
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <Button variant="primary" size="md" href="/showroom">
            Все товары в шоуруме
          </Button>
        </div>
      </section>

      <ProductDetailsModal
        product={detailsProduct}
        open={detailsProduct !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
