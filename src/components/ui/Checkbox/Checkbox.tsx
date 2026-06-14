import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode;
  error?: boolean;
  className?: string;
};

export function Checkbox({
  children,
  className,
  error = false,
  id,
  ...inputProps
}: CheckboxProps) {
  return (
    <label className={cn(styles.root, className)} htmlFor={id}>
      <input
        {...inputProps}
        id={id}
        type="checkbox"
        className={styles.input}
        aria-invalid={error || undefined}
      />
      <span className={cn(styles.box, error && styles.boxError)} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </label>
  );
}
