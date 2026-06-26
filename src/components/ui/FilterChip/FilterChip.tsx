import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './FilterChip.module.css';

export interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Жёлтое «выбрано»-состояние (+ жирность как второй индикатор, SC 1.4.1). */
  active?: boolean;
}

/**
 * Единый чип-переключатель: категории шоурума, даты мероприятий, вкладки
 * отчётности, способ получения в корзине. Компонент отвечает только за вид
 * (жёлтый = выбрано, серый = наведение, одинаковое скругление во всех
 * состояниях). Семантику — `aria-pressed` / `role="tab"` + `aria-selected` /
 * `aria-current` — задаёт вызывающая сторона через проброс пропсов.
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  function FilterChip({ active = false, className, type = 'button', ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(styles.chip, active && styles.chipActive, className)}
        {...rest}
      />
    );
  },
);
