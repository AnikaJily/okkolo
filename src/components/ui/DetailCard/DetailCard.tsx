import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './DetailCard.module.css';

/**
 * Детальная карточка из макета (Figma 408:1961): фото слева, справа —
 * желтый тег, заголовок, описание, а внизу — крупная строка
 * («Цена: …» / «Вход свободный») и две кнопки.
 * Используется внутри Radix Dialog в ProductDetailsModal и EventDetailsModal.
 */
interface DetailCardProps {
  /** Содержимое фото-панели: Picture или галерея со стрелками */
  media: ReactNode;
  /** Желтая плашка: категория товара / дата мероприятия */
  tag?: string;
  /** Заголовок — передавай Dialog.Title для доступности */
  title: ReactNode;
  description?: string;
  /** Крупная строка над кнопками («Цена: …») — обычно Dialog.Description */
  bottomLabel?: ReactNode;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  onClose: () => void;
}

export function DetailCard({
  media,
  tag,
  title,
  description,
  bottomLabel,
  primaryActionLabel,
  onPrimaryAction,
  onClose,
}: DetailCardProps) {
  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Закрыть"
      >
        ×
      </button>

      <div className={styles.media}>{media}</div>

      <div className={styles.body}>
        <div className={styles.info}>
          <div className={styles.head}>
            {tag ? <span className={styles.tag}>{tag}</span> : null}
            <div className={styles.title}>{title}</div>
          </div>

          {description ? <p className={styles.description}>{description}</p> : null}
        </div>

        <div className={styles.footer}>
          {bottomLabel ? <div className={styles.bottomLabel}>{bottomLabel}</div> : null}
          <div className={styles.actions}>
            <Button variant="primary" size="md" fullWidth onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
            <Button variant="outline" size="md" fullWidth onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
