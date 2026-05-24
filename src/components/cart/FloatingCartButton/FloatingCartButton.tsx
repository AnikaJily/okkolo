import cartIcon from '@/assets/images/cart.svg';
import styles from './FloatingCartButton.module.css';

interface FloatingCartButtonProps {
  count: number;
  onClick: () => void;
}

export function FloatingCartButton({ count, onClick }: FloatingCartButtonProps) {
  const label =
    count === 1
      ? 'Корзина, 1 товар'
      : `Корзина, ${count} ${count < 5 ? 'товара' : 'товаров'}`;

  return (
    <button type="button" className={styles.root} onClick={onClick} aria-label={label}>
      <img src={cartIcon} alt="" className={styles.icon} aria-hidden="true" />
      <span className={styles.badge} aria-hidden="true">
        {count > 99 ? '99+' : count}
      </span>
    </button>
  );
}
