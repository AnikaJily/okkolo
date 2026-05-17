import cafeImage from '@/assets/images/direction-cafe.png';

export interface Direction {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export const directions: Direction[] = [
  {
    id: 'cafe',
    title: 'Кофейня',
    description: 'Вкусный кофе и сладости',
    image: cafeImage,
    href: '/directions/cafe',
  },
  {
    id: 'workshops',
    title: 'Мастерские',
    description: 'Творчество и ремесло',
    image: cafeImage,
    href: '/directions/workshops',
  },
  {
    id: 'events',
    title: 'События',
    description: 'Встречи, музыка и лекции',
    image: cafeImage,
    href: '/directions/events',
  },
  {
    id: 'education',
    title: 'Обучение',
    description: 'Навыки для жизни и работы',
    image: cafeImage,
    href: '/directions/education',
  },
];
