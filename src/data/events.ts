import cafeImage from '@/assets/images/direction-cafe.png';

export interface OkkoloEvent {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  tag: string;
  admission: string;
  href: string;
  image: string;
}

export const events: OkkoloEvent[] = [
  {
    id: 'jazz-evening',
    day: '24',
    month: 'мая',
    title: 'Вечер живого джаза',
    time: '19:00',
    location: 'Кофейня',
    tag: 'Музыка',
    admission: 'Вход свободный',
    href: '/events/jazz-evening',
    image: cafeImage,
  },
  {
    id: 'ceramics',
    day: '28',
    month: 'мая',
    title: 'Мастер-класс по керамике',
    time: '14:00',
    location: 'Мастерские',
    tag: 'Воркшоп',
    admission: 'Вход свободный',
    href: '/events/ceramics',
    image: cafeImage,
  },
  {
    id: 'book-club',
    day: '01',
    month: 'июн',
    title: 'Книжный клуб: «Маленький принц»',
    time: '18:30',
    location: 'Кофейня',
    tag: 'Обсуждение',
    admission: 'Вход свободный',
    href: '/events/book-club',
    image: cafeImage,
  },
];
