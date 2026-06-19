import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { CloseIcon } from '@/components/ui/CloseIcon/CloseIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';
import { Checkbox } from '@/components/ui/Checkbox';
import { RequiredMark } from '@/components/ui/RequiredMark';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/Sheet';
import { useCart } from '@/context/CartContext';
import { formatProductPrice } from '@/data/products';
import {
  DELIVERY_PRICE_KRASNODAR,
  DELIVERY_PRICE_RUSSIA,
  getDeliveryPrice,
  getDeliveryZoneLabel,
} from '@/lib/delivery';
import { createOrder, type FulfillmentType } from '@/lib/strapi';
import { cn } from '@/lib/utils';
import styles from './CartSheet.module.css';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Каталог на моках — оформление реального заказа запрещено */
  orderingDisabled?: boolean;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}

export function CartSheet({ open, onOpenChange, orderingDisabled = false }: CartSheetProps) {
  const fieldIdPrefix = useId();
  const { items, totalPrice, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryComment, setDeliveryComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const listRef = useRef<HTMLUListElement>(null);

  const handleRemoveLine = (productId: string, index: number) => {
    const wasLast = items.length <= 1;
    removeItem(productId);
    if (wasLast) {
      onOpenChange(false);
      return;
    }
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[data-cart-remove]');
      if (!buttons || buttons.length === 0) return;
      buttons[Math.min(index, buttons.length - 1)]?.focus();
    });
  };

  const isDelivery = fulfillmentType === 'delivery';
  const deliveryPrice = useMemo(
    () => (isDelivery && city.trim() ? getDeliveryPrice(city) : 0),
    [isDelivery, city],
  );
  const orderTotal = totalPrice + deliveryPrice;
  const deliveryHint = isDelivery && city.trim() ? getDeliveryZoneLabel(city) : '';
  const isSubmitting = submitStatus === 'submitting';

  useEffect(() => {
    if (!open) {
      setCustomerName('');
      setPhone('');
      setEmail('');
      setFulfillmentType('pickup');
      setCity('');
      setAddress('');
      setDeliveryComment('');
      setConsent(false);
      setConsentError(false);
      setErrors({});
      setSubmitStatus('idle');
    }
  }, [open]);

  const focusById = (suffix: string) => {
    document.getElementById(`${fieldIdPrefix}-${suffix}`)?.focus();
  };

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (items.length === 0 || isSubmitting || orderingDisabled) return;

    // Собираем все ошибки сразу; фокус — на первую в порядке DOM.
    const nextErrors: FormErrors = {};
    if (!customerName.trim()) nextErrors.name = 'Напишите, как вас зовут';
    if (!phone.trim()) nextErrors.phone = 'Введите номер телефона';
    else if (!isValidPhone(phone))
      nextErrors.phone = 'Введите номер телефона, например +7 918 123-45-67';
    if (email.trim() && !email.includes('@'))
      nextErrors.email = 'Введите корректный email или оставьте поле пустым';
    if (isDelivery) {
      if (!city.trim()) nextErrors.city = 'Укажите город доставки';
      if (!address.trim()) nextErrors.address = 'Укажите адрес доставки';
    }
    setErrors(nextErrors);
    const consentMissing = !consent;
    setConsentError(consentMissing);

    if (nextErrors.name) return focusById('name');
    if (nextErrors.phone) return focusById('phone');
    if (nextErrors.email) return focusById('email');
    if (nextErrors.city) return focusById('city');
    if (nextErrors.address) return focusById('address');
    if (consentMissing) return focusById('consent');

    setSubmitStatus('submitting');

    try {
      await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        itemsSubtotal: totalPrice,
        deliveryPrice,
        totalPrice: orderTotal,
        items: items.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        orderStatus: 'pending',
        fulfillmentType,
        city: isDelivery ? city.trim() : undefined,
        address: isDelivery ? address.trim() : undefined,
        deliveryComment: isDelivery ? deliveryComment.trim() || undefined : undefined,
      });
      setSubmitStatus('success');
      clearCart();
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  const isSuccess = submitStatus === 'success';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        variant="center"
        className={cn(isSuccess && styles.successSheet, isSuccess && 'gap-4')}
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          // Триггера-Radix нет (открывается из FloatingCartButton, который может
          // размонтироваться при пустой корзине) — возвращаем фокус в контент.
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        <div className={styles.header}>
          <SheetTitle className={styles.headerTitle}>
            {isSuccess ? 'Готово' : 'Корзина'}
          </SheetTitle>
          <SheetClose asChild>
            <IconButton label="Закрыть корзину">
              <CloseIcon size="sheet" />
            </IconButton>
          </SheetClose>
        </div>

        {isSuccess ? (
          <div className={styles.success} role="status">
            <p className={styles.successLead}>Спасибо за заказ</p>
            <p className={styles.successText}>
              {isDelivery
                ? 'Свяжемся с вами, чтобы уточнить доставку'
                : 'Ждём вас в шоуруме «Окколо»'}
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth
              className={styles.successButton}
              onClick={() => onOpenChange(false)}
            >
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <ul ref={listRef} className={styles.list}>
              {items.map((item, index) => (
                <li key={item.productId} className={styles.item}>
                  <img src={item.image} alt="" className={styles.thumb} loading="lazy" />
                  <div className={styles.info}>
                    <p className={styles.title}>{item.title}</p>
                    <p className={styles.meta}>{formatProductPrice(item.price)} за шт.</p>
                    <div className={styles.stepper}>
                      <button
                        type="button"
                        className={styles.stepperButton}
                        aria-label={`Уменьшить количество «${item.title}»`}
                        aria-disabled={item.quantity <= 1 || undefined}
                        onClick={() => {
                          if (item.quantity > 1) decrementItem(item.productId);
                        }}
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <span className={styles.stepperValue} aria-live="polite">
                        {item.quantity}{' '}
                        <span className="visually-hidden">
                          штук «{item.title}» в корзине
                        </span>
                      </span>
                      <button
                        type="button"
                        className={styles.stepperButton}
                        aria-label={`Увеличить количество «${item.title}»`}
                        onClick={() => incrementItem(item.productId)}
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                  </div>
                  <div className={styles.lineEnd}>
                    <p className={styles.lineTotal} aria-live="polite">
                      <span className="visually-hidden">
                        Сумма за «{item.title}»:{' '}
                      </span>
                      {formatProductPrice(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      className={styles.removeButton}
                      data-cart-remove
                      aria-label={`Удалить «${item.title}» из корзины`}
                      onClick={() => handleRemoveLine(item.productId, index)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <form className={styles.checkout} onSubmit={handleSubmit} noValidate>
              <p className={styles.formHeading}>Контакты</p>
              <div className={styles.field}>
                <label htmlFor={`${fieldIdPrefix}-name`} className={styles.label}>
                  Имя
                  <RequiredMark />
                </label>
                <input
                  id={`${fieldIdPrefix}-name`}
                  className={styles.input}
                  type="text"
                  name="customerName"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  required
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? `${fieldIdPrefix}-name-error` : undefined}
                />
                {errors.name ? (
                  <p id={`${fieldIdPrefix}-name-error`} className={styles.fieldError} role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className={styles.field}>
                <label htmlFor={`${fieldIdPrefix}-phone`} className={styles.label}>
                  Телефон
                  <RequiredMark />
                </label>
                <input
                  id={`${fieldIdPrefix}-phone`}
                  className={styles.input}
                  type="tel"
                  inputMode="tel"
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  autoComplete="tel"
                  placeholder="+7 918 123-45-67"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? `${fieldIdPrefix}-phone-error` : undefined}
                />
                {errors.phone ? (
                  <p id={`${fieldIdPrefix}-phone-error`} className={styles.fieldError} role="alert">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
              <div className={styles.field}>
                <label htmlFor={`${fieldIdPrefix}-email`} className={styles.label}>
                  Email
                </label>
                <input
                  id={`${fieldIdPrefix}-email`}
                  className={styles.input}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? `${fieldIdPrefix}-email-error` : undefined}
                />
                {errors.email ? (
                  <p id={`${fieldIdPrefix}-email-error`} className={styles.fieldError} role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <p className={styles.formHeading}>Способ получения</p>
              {/* Не полу-ARIA radio: кнопки-переключатели с aria-pressed (паттерн дат EventsPage) */}
              <div className={styles.fulfillmentToggle} role="group" aria-label="Способ получения">
                <button
                  type="button"
                  aria-pressed={fulfillmentType === 'pickup'}
                  className={
                    fulfillmentType === 'pickup'
                      ? styles.fulfillmentOptionActive
                      : styles.fulfillmentOption
                  }
                  onClick={() => setFulfillmentType('pickup')}
                >
                  Самовывоз
                </button>
                <button
                  type="button"
                  aria-pressed={fulfillmentType === 'delivery'}
                  className={
                    fulfillmentType === 'delivery'
                      ? styles.fulfillmentOptionActive
                      : styles.fulfillmentOption
                  }
                  onClick={() => setFulfillmentType('delivery')}
                >
                  Доставка
                </button>
              </div>

              {isDelivery ? (
                <>
                  <div className={styles.field}>
                    <label htmlFor={`${fieldIdPrefix}-city`} className={styles.label}>
                      Город
                      <RequiredMark />
                    </label>
                    <input
                      id={`${fieldIdPrefix}-city`}
                      className={styles.input}
                      type="text"
                      name="city"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      required
                      autoComplete="address-level2"
                      aria-invalid={errors.city ? true : undefined}
                      aria-describedby={errors.city ? `${fieldIdPrefix}-city-error` : undefined}
                    />
                    {errors.city ? (
                      <p id={`${fieldIdPrefix}-city-error`} className={styles.fieldError} role="alert">
                        {errors.city}
                      </p>
                    ) : null}
                  </div>
                  {deliveryHint ? (
                    <p className={styles.deliveryHint}>Доставка: {deliveryHint}</p>
                  ) : (
                    <p className={styles.deliveryHint}>
                      Доставка по Краснодару — {DELIVERY_PRICE_KRASNODAR} ₽, по России —{' '}
                      {DELIVERY_PRICE_RUSSIA} ₽. Точная сумма — после ввода города.
                    </p>
                  )}
                  <div className={styles.field}>
                    <label htmlFor={`${fieldIdPrefix}-address`} className={styles.label}>
                      Адрес
                      <RequiredMark />
                    </label>
                    <input
                      id={`${fieldIdPrefix}-address`}
                      className={styles.input}
                      type="text"
                      name="address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      required
                      autoComplete="street-address"
                      aria-invalid={errors.address ? true : undefined}
                      aria-describedby={errors.address ? `${fieldIdPrefix}-address-error` : undefined}
                    />
                    {errors.address ? (
                      <p id={`${fieldIdPrefix}-address-error`} className={styles.fieldError} role="alert">
                        {errors.address}
                      </p>
                    ) : null}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor={`${fieldIdPrefix}-deliveryComment`} className={styles.label}>
                      Комментарий к доставке
                    </label>
                    <textarea
                      id={`${fieldIdPrefix}-deliveryComment`}
                      className={styles.textarea}
                      name="deliveryComment"
                      value={deliveryComment}
                      onChange={(event) => setDeliveryComment(event.target.value)}
                      rows={2}
                      placeholder="Подъезд, этаж, время"
                    />
                  </div>
                </>
              ) : (
                <p className={styles.pickupHint}>Самовывоз из шоурума «Окколо» после подтверждения заказа.</p>
              )}

              <Checkbox
                id={`${fieldIdPrefix}-consent`}
                checked={consent}
                error={consentError}
                errorMessage="Подтвердите согласие на обработку персональных данных"
                onChange={(event) => {
                  setConsent(event.target.checked);
                  if (event.target.checked) {
                    setConsentError(false);
                  }
                }}
                required
              >
                Согласие на обработку{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="consentLink"
                  onClick={(event) => event.stopPropagation()}
                >
                  персональных данных
                </a>
              </Checkbox>

              <p className={styles.legalNote}>
                Оформляя заказ, вы принимаете{' '}
                <a href="/terms" target="_blank" rel="noreferrer">
                  условия покупки и возврата
                </a>
                .
              </p>

              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <p className={styles.totalLabel}>Товары</p>
                  <p className={styles.totalValueSm}>{formatProductPrice(totalPrice)}</p>
                </div>
                {isDelivery ? (
                  <div className={styles.totalRow}>
                    <p className={styles.totalLabel}>Доставка</p>
                    <p className={styles.totalValueSm}>
                      {deliveryPrice > 0
                        ? formatProductPrice(deliveryPrice)
                        : 'после ввода города'}
                    </p>
                  </div>
                ) : null}
                <div className={styles.totalRow}>
                  <p className={styles.totalLabel}>Итого</p>
                  <p className={styles.totalValue}>{formatProductPrice(orderTotal)}</p>
                </div>
                {/* Live-region статуса отправки: смонтирована заранее (SC 4.1.3) */}
                <p className={styles.status} role="status" aria-live="polite">
                  {isSubmitting ? 'Отправляем заказ…' : ''}
                </p>
                {submitStatus === 'error' ? (
                  <p className={styles.error} role="alert">
                    Не удалось отправить заказ. Попробуйте еще раз
                  </p>
                ) : null}
                {orderingDisabled ? (
                  <p className="systemNotice" role="status">
                    Каталог временно недоступен, заказ оформить нельзя. Напишите
                    нам — поможем с покупкой
                  </p>
                ) : null}
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  className={styles.submitButton}
                  aria-disabled={
                    isSubmitting || items.length === 0 || orderingDisabled || undefined
                  }
                  aria-busy={isSubmitting || undefined}
                >
                  {isSubmitting ? 'Отправляем…' : 'Оформить заказ'}
                </Button>
              </div>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
