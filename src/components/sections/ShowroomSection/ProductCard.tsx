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
      picture={product.picture}
      imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
      imageAlt={product.title}
      href="#"
      actionLabel="В корзину"
      action={onAddToCart ? () => onAddToCart(product) : undefined}
      secondaryActionLabel="Подробнее"
      secondaryAction={onDetails ? () => onDetails(product) : undefined}
      actionsLayout="row"
    />
  );
}
