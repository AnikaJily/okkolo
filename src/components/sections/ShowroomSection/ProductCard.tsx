import { ImageActionCard } from '@/components/ui/ImageActionCard/ImageActionCard';
import { formatProductPrice, type ShowroomProduct } from '@/data/products';

interface ProductCardProps {
  product: ShowroomProduct;
  onAddToCart?: (product: ShowroomProduct) => void;
  onDetails?: (product: ShowroomProduct) => void;
}

export function ProductCard({ product, onAddToCart, onDetails }: ProductCardProps) {
  return (
    <ImageActionCard
      variant="preview"
      title={product.title}
      description={formatProductPrice(product.price)}
      image={product.image}
      imageAlt={product.title}
      href="#"
      actionLabel="В корзину"
      action={onAddToCart ? () => onAddToCart(product) : undefined}
      descriptionClassName="text-[length:var(--text-card-title)] leading-[var(--leading-tight)]"
      secondaryActionLabel="Подробнее"
      secondaryAction={onDetails ? () => onDetails(product) : undefined}
    />
  );
}
