import type { PictureSource } from '@/components/ui/Picture';
import productPicture from '@/assets/images/showroom-product.png?w=320;640;960&format=avif;webp;jpg&as=picture';

const productImage = productPicture.img.src;

export type ProductCategory = 'all' | 'ceramics' | 'jewelry' | 'clothing' | 'textile';

export interface ShowroomProduct {
  id: string;
  title: string;
  price: number;
  category: Exclude<ProductCategory, 'all'>;
  image: string;
  picture?: PictureSource;
  images: string[];
  pictures?: PictureSource[];
  description: string;
  cartUrl?: string;
}

const FALLBACK_DESCRIPTION =
  'Изделие ручной работы студии «Окколо»: натуральные материалы, внимание к деталям, небольшой тираж.';

export const PRODUCT_CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'Все товары' },
  { id: 'ceramics', label: 'Керамика' },
  { id: 'jewelry', label: 'Бижутерия' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'textile', label: 'Текстиль' },
];

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatProductPrice(price: number) {
  return priceFormatter.format(price);
}

function demoProduct(
  product: Omit<ShowroomProduct, 'images' | 'description' | 'picture' | 'pictures'> & {
    description?: string;
    images?: string[];
  },
): ShowroomProduct {
  return {
    ...product,
    picture: productPicture,
    images: product.images ?? [product.image],
    pictures: [productPicture],
    description: product.description ?? FALLBACK_DESCRIPTION,
  };
}

export const products: ShowroomProduct[] = [
  demoProduct({
    id: 'beads-dalmatian-1',
    title: 'Бусы «Долматинец»',
    price: 2100,
    category: 'jewelry',
    image: productImage,
    description:
      'Бусы из натурального камня в спокойной серо-черной гамме. Универсальная длина, подходят для повседневных образов.',
  }),
  demoProduct({
    id: 'beads-dalmatian-2',
    title: 'Бусы «Долматинец»',
    price: 2100,
    category: 'jewelry',
    image: productImage,
  }),
  demoProduct({
    id: 'ceramic-vase',
    title: 'Ваза ручной работы',
    price: 3200,
    category: 'ceramics',
    image: productImage,
    description: 'Керамическая ваза с мягкой глазурью. Каждое изделие слегка отличается по оттенку — это часть ручной работы.',
  }),
  demoProduct({
    id: 'linen-napkin',
    title: 'Льняная салфетка',
    price: 890,
    category: 'textile',
    image: productImage,
  }),
  demoProduct({
    id: 'cotton-tote',
    title: 'Сумка из хлопка',
    price: 1500,
    category: 'clothing',
    image: productImage,
  }),
  demoProduct({
    id: 'ceramic-cup',
    title: 'Кружка «Окколо»',
    price: 1200,
    category: 'ceramics',
    image: productImage,
  }),
  demoProduct({
    id: 'beads-pearl',
    title: 'Браслет «Жемчуг»',
    price: 1800,
    category: 'jewelry',
    image: productImage,
  }),
  demoProduct({
    id: 'textile-runner',
    title: 'Дорожка на стол',
    price: 2400,
    category: 'textile',
    image: productImage,
  }),
  demoProduct({
    id: 'shirt-linen',
    title: 'Рубашка льняная',
    price: 4500,
    category: 'clothing',
    image: productImage,
  }),
  demoProduct({
    id: 'bowl-set',
    title: 'Набор мисок',
    price: 2800,
    category: 'ceramics',
    image: productImage,
  }),
  demoProduct({
    id: 'earrings-gold',
    title: 'Серьги «Солнце»',
    price: 1650,
    category: 'jewelry',
    image: productImage,
  }),
  demoProduct({
    id: 'scarf-wool',
    title: 'Шарф шерстяной',
    price: 2200,
    category: 'textile',
    image: productImage,
  }),
];
