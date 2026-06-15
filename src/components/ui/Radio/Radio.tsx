import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Radio.module.css';

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode;
  className?: string;
};

export function Radio({
  children,
  className,
  id,
  ...inputProps
}: RadioProps) {
  return (
    <label className={cn(styles.root, className)} htmlFor={id}>
      <input {...inputProps} id={id} type="radio" className={styles.input} />
      <span className={styles.control} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </label>
  );
}
