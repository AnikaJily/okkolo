import * as Dialog from '@radix-ui/react-dialog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import arrowSrc from '@/assets/images/arrow.svg';
import { Button } from '@/components/ui/Button';
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
            <article className={styles.card}>
              <div className={styles.galleryPane}>
                <div className={styles.mainImageWrap}>
                  <button
                    type="button"
                    className={styles.close}
                    onClick={() => onOpenChange(false)}
                    aria-label="Закрыть"
                  >
                    ×
                  </button>

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
                      className={styles.mainImage}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  ) : (
                    <img
                      src={images[activeImageIndex] ?? product.image}
                      alt={product.title}
                      className={styles.mainImage}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>

              <div className={styles.detailsPane}>
                <div className={styles.summary}>
                  {categoryLabel ? <p className={styles.category}>{categoryLabel}</p> : null}
                  <Dialog.Title className={styles.heading}>{product.title}</Dialog.Title>
                  <Dialog.Description className={styles.price}>
                    {formatProductPrice(product.price)}
                  </Dialog.Description>
                </div>

                {product.description ? (
                  <p className={styles.description}>{product.description}</p>
                ) : null}

                <div className={styles.actions}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onAddToCart?.(product);
                      onOpenChange(false);
                    }}
                  >
                    В корзину
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </article>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
