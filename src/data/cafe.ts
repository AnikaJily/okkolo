import type { PictureSource } from '@/components/ui/Picture';
import menuMainPicture from '@/assets/images/menu_photo_1.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';
import menuSummerPicture from '@/assets/images/menu_photo_2.jpg?w=480;768;1200&format=avif;webp;jpg&as=picture';

export interface CafeMenuItem {
  name: string;
  /** Объем, например «0,3» или «0,2/0,3» */
  volume?: string;
  price: string;
  /** Состав или примечание */
  note?: string;
}

export interface CafeMenuSection {
  title: string;
  items: CafeMenuItem[];
}

export interface CafeMenu {
  id: string;
  title: string;
  /** Подробный alt для фото меню */
  alt: string;
  picture: PictureSource;
  sections: CafeMenuSection[];
  footnote?: string;
}

/**
 * Текстовая версия меню — расшифровка печатных постеров.
 * Нужна скринридерам, поиску и всем, кому неудобно читать с фото.
 * При обновлении фото меню обнови и текст.
 */
export const cafeMenus: CafeMenu[] = [
  {
    id: 'main',
    title: 'Основное меню',
    alt: 'Печатное меню кофейни «Окколо»: кофе, чай, авторские напитки и топинги. Текстовая версия — под фотографией.',
    picture: menuMainPicture,
    sections: [
      {
        title: 'Кофе',
        items: [
          { name: 'Эспрессо', price: '130 ₽' },
          { name: 'Американо', price: '130 ₽' },
          { name: 'Флэт уайт', volume: '0,2', price: '200 ₽' },
          { name: 'Капучино', volume: '0,2 / 0,3', price: '200 / 220 ₽' },
          { name: 'Латте', volume: '0,3', price: '200 ₽' },
          { name: 'Раф', volume: '0,2 / 0,3', price: '230 / 260 ₽' },
          { name: 'Какао', volume: '0,3', price: '220 ₽' },
        ],
      },
      {
        title: 'Чай',
        items: [
          { name: 'Черный чай', price: '140 ₽' },
          { name: 'Зеленый чай', price: '140 ₽' },
          { name: 'Черный чай с чабрецом', price: '150 ₽' },
          { name: 'Зеленый чай с жасмином', price: '150 ₽' },
          { name: 'Манговый улун', price: '150 ₽' },
          { name: 'Пряная груша', price: '280 ₽' },
        ],
      },
      {
        title: 'Авторские',
        items: [
          { name: 'Раф Баунти', volume: '0,2', price: '280 ₽' },
          { name: 'Латте Халва', volume: '0,3', price: '280 ₽' },
        ],
      },
      {
        title: 'Топинги',
        items: [
          { name: 'Маршмэллоу', price: '30 ₽' },
          { name: 'Сироп', price: '30 ₽' },
        ],
      },
    ],
    footnote: 'Дополнительно: альтернативное молоко +50/70 ₽.',
  },
  {
    id: 'summer',
    title: 'Летнее меню',
    alt: 'Печатное летнее меню кофейни «Окколо»: холодные кофейные напитки, матча и лимонады. Текстовая версия — под фотографией.',
    picture: menuSummerPicture,
    sections: [
      {
        title: 'Холодные напитки',
        items: [
          { name: 'Айс-латте', note: 'молоко, эспрессо, лед', price: '220 ₽' },
          { name: 'Айс-матча', note: 'молоко, матча, лед', price: '240 ₽' },
          {
            name: 'Айс-арахисовый капучино',
            note: 'молоко, эспрессо, арахисовая заготовка, лед',
            price: '280 ₽',
          },
          {
            name: 'Айс-латте «Банановое мороженое»',
            note: 'молоко, эспрессо, заготовка, лед',
            price: '280 ₽',
          },
          {
            name: 'Бамбл',
            note: 'сок, эспрессо, лед; по желанию — сироп карамель',
            price: '250 ₽',
          },
          {
            name: 'Бамбл-матча',
            note: 'сок, матча, лед; по желанию — сироп карамель',
            price: '250 ₽',
          },
        ],
      },
      {
        title: 'Лимонады',
        items: [
          { name: 'Киви — мята — виноград', price: '280 ₽' },
          { name: 'Арбуз — дыня', price: '280 ₽' },
          { name: 'Малина — имбирь', price: '280 ₽' },
        ],
      },
    ],
  },
];
