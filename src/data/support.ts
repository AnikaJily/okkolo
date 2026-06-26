/**
 * Контент и параметры формы «Поддержать проект» (модалка SupportModal).
 * Это статический источник истины для UI — суммы и тексты правятся здесь,
 * без правок самого компонента.
 *
 * Не путать с src/lib/support.ts — там чистый хелпер действия кнопки
 * (getSupportAction), а здесь — данные пожертвования.
 */

export type SupportFrequencyValue = 'once' | 'monthly';

export interface SupportFrequency {
  value: SupportFrequencyValue;
  label: string;
}

/** Как часто списывать пожертвование. Первый элемент — значение по умолчанию. */
export const SUPPORT_FREQUENCIES: readonly SupportFrequency[] = [
  { value: 'once', label: 'Разово' },
  { value: 'monthly', label: 'Ежемесячно' },
];

/** Пресеты суммы пожертвования, ₽ (второй — предвыбранный по умолчанию). */
export const SUPPORT_AMOUNTS: readonly number[] = [300, 500, 1000, 3000];

/** Границы произвольной суммы, ₽. */
export const SUPPORT_AMOUNT_MIN = 50;
export const SUPPORT_AMOUNT_MAX = 500_000;

/** Вводный текст модалки: на что идут пожертвования. */
export const SUPPORT_INTRO =
  'Пожертвования помогают «Окколо» оплачивать аренду, материалы для мастерских и работу сотрудников с инвалидностью. Любая сумма важна.';

/**
 * Сообщение на шаге «до оплаты». Платёжная система ещё не подключена (MVP),
 * поэтому после заполнения формы показываем понятный статус-заглушку.
 */
export const SUPPORT_PAYMENT_PENDING =
  'Здесь откроется защищённая страница оплаты. Подключение платёжной системы — финальный шаг перед запуском.';
