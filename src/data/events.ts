import type { PictureSource } from '@/components/ui/Picture';
import cafePicture from '@/assets/images/direction-cafe.jpg?w=320;640;1024&format=avif;webp;jpg&as=picture';

const cafeImage = cafePicture.img.src;

export interface OkkoloEvent {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  admission: string;
  /* категория мероприятия из CMS (enum type): музыка | мастер-класс | лекция | стенд-ап */
  type?: string;
  description?: string;
  href: string;
  signupHref: string;
  isPaid?: boolean;
  price?: number;
  image: string;
  picture?: PictureSource;
}

export const events: OkkoloEvent[] = [
  {
    id: 'jazz-evening',
    title: 'Вечер живого джаза',
    date: '2026-06-20T19:00:00.000Z',
    dateLabel: '20 июня, 19:00',
    admission: 'Вход бесплатный',
    type: 'музыка',
    description: 'Вечер живой музыки в пространстве «Окколо». Приходите слушать джаз, знакомиться и проводить время вместе',
    href: '/events/jazz-evening',
    signupHref: 'mailto:hello@okkolo.ru',
    image: cafeImage, picture: cafePicture,
  },
  {
    id: 'ceramics',
    title: 'Мастер-класс по керамике',
    date: '2026-06-27T14:00:00.000Z',
    dateLabel: '27 июня, 14:00',
    admission: 'Вход бесплатный',
    type: 'мастер-класс',
    description: 'Практический мастер-класс по керамике для гостей проекта. Подходит для начинающих и не требует специальной подготовки',
    href: '/events/ceramics',
    signupHref: 'mailto:hello@okkolo.ru',
    image: cafeImage, picture: cafePicture,
  },
  {
    id: 'book-club',
    title: 'Книжный клуб: «Маленький принц»',
    date: '2026-07-04T18:30:00.000Z',
    dateLabel: '4 июля, 18:30',
    admission: 'Вход бесплатный',
    type: 'лекция',
    description: 'Встреча книжного клуба с обсуждением, чаем и спокойной атмосферой для разговора о любимых текстах',
    href: '/events/book-club',
    signupHref: 'mailto:hello@okkolo.ru',
    image: cafeImage, picture: cafePicture,
  },
];
