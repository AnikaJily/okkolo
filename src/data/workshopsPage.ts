import cafePicture from '@/assets/images/direction-cafe.png?w=480;768;1200&format=avif;webp;jpg&as=picture';
import heroTeamPicture from '@/assets/images/hero-team.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import showroomHeroPicture from '@/assets/images/showroom-hero.png?w=480;768;1200&format=avif;webp;jpg&as=picture';
import type { PictureSource } from '@/components/ui/Picture';

export interface WorkshopProgram {
  id: string;
  title: string;
  description: string;
  image: string;
  picture?: PictureSource;
}

export interface WorkshopCallout {
  tag: string;
  text: string;
}

export const WORKSHOPS_INTRO =
  'Мы учим профессии: шить на производственных станках, работать бариста, делать звук и свет на мероприятиях. После обучения помогаем со стажировкой и трудоустройством. Мастерские открыты для молодых людей с инвалидностью.';

export const WORKSHOPS_AUDIENCE =
  'Мы ждем молодых людей с инвалидностью. Специальная подготовка не нужна, учим с нуля.';

export const WORKSHOPS_AUDIENCE_NOTE =
  'В мастерских мы пока не работаем с ментальными особенностями. Для такого обучения нужны профильные специалисты, а их в нашей команде пока нет. Но очень ждем вас на мероприятиях!';

export const WORKSHOPS_AFTER_INTRO =
  'Наша цель в том, чтобы вы получили профессию и работу. После обучения помогаем со стажировкой и трудоустройством.';

export const WORKSHOPS_AFTER_CALLOUTS: WorkshopCallout[] = [
  {
    tag: 'Интересно',
    text: 'Например, выпускники кофейного направления уже работают бариста в кофейне «Окколо»',
  },
  {
    tag: 'Интересно',
    text: 'Вещи, которые резиденты делают в мастерских, продаются в нашем шоуруме',
  },
];

export const workshopPrograms: WorkshopProgram[] = [
  {
    id: 'sewing',
    title: 'Швейная мастерская',
    description:
      'Вы научитесь шить на настоящих станках — от первых строчек до готовых вещей.',
    image: showroomHeroPicture.img.src,
    picture: showroomHeroPicture,
  },
  {
    id: 'coffee',
    title: 'Кофейное дело',
    description:
      'Вы научитесь работать бариста: готовить кофе, обращаться с кофемашиной, общаться с гостями.',
    image: cafePicture.img.src,
    picture: cafePicture,
  },
  {
    id: 'sound',
    title: 'Звукорежиссура',
    description:
      'Вы научитесь делать звук и свет на мероприятиях: настраивать оборудование, работать на концертах и событиях кластера.',
    image: heroTeamPicture.img.src,
    picture: heroTeamPicture,
  },
];
