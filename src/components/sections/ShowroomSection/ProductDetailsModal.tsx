import * as Dialog from '@radix-ui/react-dialog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import arrowSrc from '@/assets/images/arrow.svg';
import { DetailCard } from '@/components/ui/DetailCard';
import { Picture, type PictureSource } from '@/components/ui/Picture';
import {
  formatProductPrice,
  PRODUCT_CATEGORIES,
  type ShowroomProduct,
} from '@/data/products';
import styles from './ProductDetailsModal.module.css';

interface ProductDetailsModalProps {
  product: ShowroomProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (product: ShowroomProduct) => void;
}

export function ProductDetailsModal({
  product,
  open,
  onOpenChange,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = useMemo(() => {
    if (!product) return [];
    const raw = product.images.length > 0 ? product.images : [product.image];
    return [...new Set(raw)];
  }, [product]);

  const pictures: (PictureSource | undefined)[] = useMemo(() => {
    if (!product) return [];
    if (product.pictures && product.pictures.length === images.length) return product.pictures;
    return images.map(() => product.picture);
  }, [product, images]);

  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id, open]);

  const goToPrev = useCallback(() => {
    setActiveImageIndex((index) => (index === 0 ? imageCount - 1 : index - 1));
  }, [imageCount]);

  const goToNext = useCallback(() => {
    setActiveImageIndex((index) => (index === imageCount - 1 ? 0 : index + 1));
  }, [imageCount]);

  const categoryLabel = PRODUCT_CATEGORIES.find((item) => item.id === product?.category)?.label;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          {product ? (
            <DetailCard
              media={
                <div className={styles.gallery}>
                  {hasMultipleImages ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.arrow} ${styles.arrowLeft}`}
                        onClick={goToPrev}
                        aria-label="Предыдущее фото"
                      >
                        <img src={arrowSrc} alt="" aria-hidden="true" className={styles.arrowIcon} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.arrow} ${styles.arrowRight}`}
                        onClick={goToNext}
                        aria-label="Следующее фото"
                      >
                        <img
                          src={arrowSrc}
                          alt=""
                          aria-hidden="true"
                          className={`${styles.arrowIcon} ${styles.arrowIconFlipped}`}
                        />
                      </button>
                      <span className={styles.counter} aria-live="polite">
                        {activeImageIndex + 1} / {imageCount}
                      </span>
                    </>
                  ) : null}

                  {pictures[activeImageIndex] ? (
                    <Picture
                      picture={pictures[activeImageIndex]!}
                      alt={product.title}
                      className={styles.image}
                      sizes="(min-width: 1024px) 450px, 100vw"
                    />
                  ) : (
                    <img
                      src={images[activeImageIndex] ?? product.image}
                      alt={product.title}
                      className={styles.image}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              }
              tag={categoryLabel}
              title={<Dialog.Title>{product.title}</Dialog.Title>}
              bottomLabel={
                <Dialog.Description>
                  Цена: {formatProductPrice(product.price)}
                </Dialog.Description>
              }
              description={product.description}
              primaryActionLabel="В корзину"
              onPrimaryAction={() => {
                onAddToCart?.(product);
                onOpenChange(false);
              }}
              onClose={() => onOpenChange(false)}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
