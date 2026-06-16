import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Checkbox.module.css';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode;
  error?: boolean;
  /** Текст ошибки: показывается под чекбоксом и связывается через aria-describedby. */
  errorMessage?: string;
  className?: string;
};

export function Checkbox({
  children,
  className,
  error = false,
  errorMessage,
  id,
  ...inputProps
}: CheckboxProps) {
  const errorId = error && errorMessage && id ? `${id}-error` : undefined;

  return (
    <div className={styles.wrapper}>
      <label className={cn(styles.root, className)} htmlFor={id}>
        <input
          {...inputProps}
          id={id}
          type="checkbox"
          className={styles.input}
          aria-invalid={error || undefined}
          aria-describedby={errorId}
        />
        <span className={cn(styles.box, error && styles.boxError)} aria-hidden="true" />
        <span className={styles.label}>{children}</span>
      </label>
      {errorId ? (
        <p id={errorId} className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
