import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ImageActionCard } from '@/components/ui/ImageActionCard';
import {
  products as fallbackProducts,
  formatProductPrice,
  type ShowroomProduct,
} from '@/data/products';
import { loadProducts } from '@/lib/products';
import styles from './ShowroomTeaser.module.css';

const TEASER_PRODUCT_LIMIT = 3;

function pickTeaserProducts(products: ShowroomProduct[]): ShowroomProduct[] {
  return products.slice(0, TEASER_PRODUCT_LIMIT);
}

export function ShowroomTeaser() {
  const [products, setProducts] = useState<ShowroomProduct[]>(() =>
    pickTeaserProducts(fallbackProducts),
  );

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

  if (products.length === 0) return null;

  return (
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
            <ImageActionCard
              variant="preview"
              title={product.title}
              description={formatProductPrice(product.price)}
              image={product.image}
              picture={product.picture}
              imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
              imageAlt={product.title}
              href="/showroom"
              actionLabel="Смотреть в шоуруме"
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
  );
}
