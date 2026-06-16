import cafeTeachPicture from '@/assets/images/what_we_teach_cafe.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import potteryPicture from '@/assets/images/what_we_teach_pottery.png?w=480;768;1200&format=avif;webp;jpg&as=picture';
import sewingPicture from '@/assets/images/what_we_teach_sewing.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import heroTeamPicture from '@/assets/images/hero-team.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import type { PictureSource } from '@/components/ui/Picture';

export interface WorkshopProgram {
  id: string;
  title: string;
  description: string;
  image: string;
  picture?: PictureSource;
  imageAlt?: string;
}

export interface WorkshopCallout {
  tag: string;
  text: string;
}

export const WORKSHOPS_INTRO =
  'Мы учим профессии: шить на производственных станках, работать бариста, делать звук и свет на мероприятиях. После обучения помогаем со стажировкой и трудоустройством. Мастерские открыты для молодых людей с инвалидностью.';

export const WORKSHOPS_AFTER_INTRO =
  'Наша цель в том, чтобы вы получили профессию и работу. После обучения помогаем со стажировкой и трудоустройством.';

export const WORKSHOPS_AFTER_CALLOUT: WorkshopCallout = {
  tag: 'Важно',
  text: 'Резиденты работают в кофейне, швейной и гончарной мастерских, на событийной площадке и на мероприятиях кластера',
};

export const workshopPrograms: WorkshopProgram[] = [
  {
    id: 'sewing',
    title: 'Швейная мастерская',
    description:
      ' Мастера с ДЦП, ментальными особенностями и нарушением слуха шьют стильный мерч',
    image: sewingPicture.img.src,
    picture: sewingPicture,
    imageAlt: 'Швейная мастерская «Окколо»',
  },
  {
    id: 'coffee',
    title: 'Кофейное дело',
    description:
      'Бариста с нарушением слуха — язык жестов стал частью сервиса',
    image: cafeTeachPicture.img.src,
    picture: cafeTeachPicture,
    imageAlt: 'Обучение бариста в кофейне «Окколо»',
  },
  {
    id: 'ceramics',
    title: 'Гончарная мастерская',
    description:
      'Керамист с ампутацией ног создаёт авторскую посуду и проводит обучающие мастер-классы',
    image: potteryPicture.img.src,
    picture: potteryPicture,
    imageAlt: 'Гончарная мастерская «Окколо»',
  },
  {
    id: 'admin',
    title: 'Администрирование',
    description:
      'Администратор с протезом ноги встречает гостей и записывает их на мероприятия',
    image: heroTeamPicture.img.src,
    picture: heroTeamPicture,
    imageAlt: 'Администрирование в «Окколо»',
  },
  {
    id: 'sound',
    title: 'Звукорежиссура',
    description:
      'Вы научитесь делать звук и свет на мероприятия',
    image: heroTeamPicture.img.src,
    picture: heroTeamPicture,
    imageAlt: 'Звукорежиссура в «Окколо»',
  },
];
