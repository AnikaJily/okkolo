import { cn } from '@/lib/utils';
import styles from './CloseIcon.module.css';

type CloseIconSize = 'sheet' | 'dialog';

interface CloseIconProps {
  size?: CloseIconSize;
  className?: string;
}

export function CloseIcon({ size = 'sheet', className }: CloseIconProps) {
  return (
    <svg
      className={cn(styles.root, styles[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-a11y-keep
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
