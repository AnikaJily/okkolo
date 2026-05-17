import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { IconButton } from '@/components/ui/IconButton';
import type { Direction } from '@/data/directions';
import arrowSrc from '@/assets/images/arrow.svg';
import { DirectionCard } from './DirectionCard';
import styles from './DirectionsCarousel.module.css';

interface DirectionsCarouselProps {
  items: Direction[];
}

export function DirectionsCarousel({ items }: DirectionsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    update();
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);

    return () => {
      emblaApi.off('select', update);
      emblaApi.off('reInit', update);
    };
  }, [emblaApi]);

  return (
    <div className={styles.carousel}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.track}>
          {items.map((item) => (
            <div key={item.id} className={styles.slide}>
              <DirectionCard direction={item} />
            </div>
          ))}
        </div>
      </div>

      <IconButton
        label="Предыдущее направление"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={scrollPrev}
        disabled={!canPrev}
      >
        <img src={arrowSrc} alt="" aria-hidden="true" className={styles.arrowIcon} />
      </IconButton>

      <IconButton
        label="Следующее направление"
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={scrollNext}
        disabled={!canNext}
      >
        <img
          src={arrowSrc}
          alt=""
          aria-hidden="true"
          className={`${styles.arrowIcon} ${styles.arrowIconFlipped}`}
        />
      </IconButton>
    </div>
  );
}
