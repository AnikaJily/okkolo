import { ImageActionCard } from '@/components/ui/ImageActionCard/ImageActionCard';
import { formatProductPrice, type ShowroomProduct } from '@/data/products';

interface ProductCardProps {
  product: ShowroomProduct;
  // Обязательны: карточка товара без «в корзину» и «подробнее» не имеет смысла.
  // Гарантирует, что обе кнопки всегда получают обработчик (нет мёртвых кнопок).
  onAddToCart: (product: ShowroomProduct) => void;
  onDetails: (product: ShowroomProduct) => void;
}

export function ProductCard({ product, onAddToCart, onDetails }: ProductCardProps) {
  return (
    <ImageActionCard
      variant="preview"
      title={product.title}
      description={formatProductPrice(product.price)}
      image={product.image}
      picture={product.picture}
      imageSrcSet={product.imageSrcSet}
      imageWidth={product.imageWidth}
      imageHeight={product.imageHeight}
      imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
      imageAlt={product.title}
      actionLabel="В корзину"
      action={() => onAddToCart(product)}
      secondaryActionLabel="Подробнее"
      secondaryAction={() => onDetails(product)}
      actionsLayout="row"
      tallImage
    />
  );
}
