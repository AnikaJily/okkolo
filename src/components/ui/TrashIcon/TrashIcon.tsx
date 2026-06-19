import { cn } from '@/lib/utils';
import styles from './TrashIcon.module.css';

interface TrashIconProps {
  className?: string;
}

/** Иконка «удалить» — корзина. Декоративная: подпись несёт aria-label кнопки. */
export function TrashIcon({ className }: TrashIconProps) {
  return (
    <svg
      className={cn(styles.root, className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-a11y-keep
    >
      <path
        d="M4 7h16M10 4h4a1 1 0 0 1 1 1v2H9V5a1 1 0 0 1 1-1ZM7 7l.8 12.1a1 1 0 0 0 1 .9h6.4a1 1 0 0 0 1-.9L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v5M14 11v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
