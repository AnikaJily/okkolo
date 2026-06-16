import type { PictureSource } from '@/components/ui/Picture';
import cafePicture from '@/assets/images/direction-cafe.jpg?w=320;640;1024&format=avif;webp;jpg&as=picture';
import showroomHeroPicture from '@/assets/images/showroom-hero.png?w=320;640;1024&format=avif;webp;jpg&as=picture';

const cafeImage = cafePicture.img.src;
const showroomHero = showroomHeroPicture.img.src;

export interface Direction {
  id: string;
  title: string;
  description: string;
  image: string;
  picture?: PictureSource;
  href: string;
}

/** Карточки блока «Наши направления» на главной (как в Strapi → Направления). */
export const directions: Direction[] = [
  {
    id: 'cafe',
    title: 'Кофейня',
    description: 'Вкусный кофе и сладости',
    image: cafeImage, picture: cafePicture,
    href: '/directions/cafe',
  },
  {
    id: 'workshops',
    title: 'Мастерские',
    description:
      'Живые студии и курсы',
    image: showroomHero, picture: showroomHeroPicture,
    href: '/workshops',
  },
  {
    id: 'events',
    title: 'События',
    description: 'Встречи, музыка и лекции',
    image: cafeImage, picture: cafePicture,
    href: '/events',
  },
  {
    id: 'showroom',
    title: 'Шоурум',
    description: 'Изделия мастерских и сувениры',
    image: cafeImage, picture: cafePicture,
    href: '/showroom',
  },
];

