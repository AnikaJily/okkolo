import { directions } from '@/data/directions';
import { DirectionCard } from './DirectionCard';
import { DirectionsCarousel } from './DirectionsCarousel';
import styles from './DirectionsSection.module.css';

export function DirectionsSection() {
  return (
    <section
      id="directions"
      className={styles.root}
      aria-labelledby="directions-heading"
    >
      <h2 id="directions-heading" className={styles.heading}>
        Наши направления
      </h2>

      <div className={styles.carouselWrap}>
        <DirectionsCarousel items={directions} />
      </div>

      <div className={styles.grid}>
        {directions.map((item) => (
          <DirectionCard key={item.id} direction={item} />
        ))}
      </div>
    </section>
  );
}
