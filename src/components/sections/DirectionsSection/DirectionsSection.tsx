import { useEffect, useState } from 'react';
import { resolveDirectionHref } from '@/lib/directions';
import { fetchDirections, getStrapiImageUrl } from '@/lib/strapi';
import type { StrapiDirectionItem } from '@/lib/strapi';
import type { Direction } from '@/data/directions';
import { directions as fallbackDirections } from '@/data/directions';
import { DirectionCard } from './DirectionCard';
import { DirectionsCarousel } from './DirectionsCarousel';
import styles from './DirectionsSection.module.css';

function toDirection(item: StrapiDirectionItem): Direction {
  return {
    id: item.documentId,
    title: item.title,
    description: item.description,
    href: resolveDirectionHref({
      title: item.title,
      href: item.href,
      documentId: item.documentId,
    }),
    image: getStrapiImageUrl(item.image) ?? '',
  };
}

export function DirectionsSection() {
  const [directions, setDirections] = useState<Direction[]>(fallbackDirections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirections()
      .then((items) => {
        if (items.length > 0) {
          setDirections(items.map(toDirection));
        }
      })
      .catch(() => {
        // fallback на статичные данные при ошибке сети
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="directions"
      className={styles.root}
      aria-labelledby="directions-heading"
    >
      <h2 id="directions-heading" className={styles.heading}>
        Наши направления
      </h2>

      {loading ? null : (
        <>
          <div className={styles.carouselWrap}>
            <DirectionsCarousel items={directions} />
          </div>

          <div className={styles.grid}>
            {directions.map((item) => (
              <DirectionCard key={item.id} direction={item} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
