import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/Sheet';
import { useCart } from '@/context/CartContext';
import { formatProductPrice } from '@/data/products';
import { getDeliveryPrice, getDeliveryZoneLabel } from '@/lib/delivery';
import { createOrder, type FulfillmentType } from '@/lib/strapi';
import styles from './CartSheet.module.css';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Каталог на моках — оформление реального заказа запрещено */
  orderingDisabled?: boolean;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function CartSheet({ open, onOpenChange, orderingDisabled = false }: CartSheetProps) {
  const { items, totalPrice, removeItem, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryComment, setDeliveryComment] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const isDelivery = fulfillmentType === 'delivery';
  const deliveryPrice = useMemo(
    () => (isDelivery && city.trim() ? getDeliveryPrice(city) : 0),
    [isDelivery, city],
  );
  const orderTotal = totalPrice + deliveryPrice;
  const deliveryHint = isDelivery && city.trim() ? getDeliveryZoneLabel(city) : '';

  useEffect(() => {
    if (!open) {
      setCustomerName('');
      setPhone('');
      setEmail('');
      setFulfillmentType('pickup');
      setCity('');
      setAddress('');
      setDeliveryComment('');
      setSubmitStatus('idle');
    }
  }, [open]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (items.length === 0 || submitStatus === 'submitting' || orderingDisabled) return;

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined}>
        <div className="flex items-center justify-between gap-4">
          <SheetTitle className="font-display text-xl font-semibold">Корзина</SheetTitle>
          <SheetClose asChild>
            <IconButton label="Закрыть корзину">
              <span aria-hidden="true" className="text-3xl leading-none">
                ×
              </span>
            </IconButton>
          </SheetClose>
        </div>

        {submitStatus === 'success' ? (
          <div className={styles.success}>
            <p className={styles.successTitle}>Заказ оформлен</p>
            <p className={styles.successText}>
              {isDelivery
                ? 'Мы свяжемся с вами для уточнения доставки.'
                : 'Ждём вас в шоуруме — мы позвоним для подтверждения.'}
            </p>
            <Button variant="primary" size="md" fullWidth onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.productId} className={styles.item}>
                  <img src={item.image} alt="" className={styles.thumb} loading="lazy" />
                  <div className={styles.info}>
                    <p className={styles.title}>{item.title}</p>
                    <p className={styles.meta}>
                      {item.quantity} × {formatProductPrice(item.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`Удалить «${item.title}» из корзины`}
                    onClick={() => {
                      removeItem(item.productId);
                      // items.length, не totalCount: сумма штук ≠ число позиций
                      if (items.length <= 1) onOpenChange(false);
                    }}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>

            <form className={styles.checkout} onSubmit={handleSubmit}>
              <p className={styles.formHeading}>Контакты</p>
              <label className={styles.field}>
                <span className={styles.label}>Имя</span>
                <input
                  className={styles.input}
                  type="text"
                  name="customerName"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  required
                  autoComplete="name"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Телефон</span>
                <input
                  className={styles.input}
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  autoComplete="tel"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Email (необязательно)</span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </label>

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
                  <label className={styles.field}>
                    <span className={styles.label}>Город</span>
                    <input
                      className={styles.input}
                      type="text"
                      name="city"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      required
                      autoComplete="address-level2"
                    />
                  </label>
                  {deliveryHint ? (
                    <p className={styles.deliveryHint}>Доставка: {deliveryHint}</p>
                  ) : null}
                  <label className={styles.field}>
                    <span className={styles.label}>Адрес</span>
                    <input
                      className={styles.input}
                      type="text"
                      name="address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      required
                      autoComplete="street-address"
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>Комментарий к доставке</span>
                    <textarea
                      className={styles.textarea}
                      name="deliveryComment"
                      value={deliveryComment}
                      onChange={(event) => setDeliveryComment(event.target.value)}
                      rows={2}
                      placeholder="Подъезд, этаж, время"
                    />
                  </label>
                </>
              ) : (
                <p className={styles.pickupHint}>Самовывоз из шоурума «Окколо» после подтверждения заказа.</p>
              )}

              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <p className={styles.totalLabel}>Товары</p>
                  <p className={styles.totalValueSm}>{formatProductPrice(totalPrice)}</p>
                </div>
                {isDelivery && deliveryPrice > 0 ? (
                  <div className={styles.totalRow}>
                    <p className={styles.totalLabel}>Доставка</p>
                    <p className={styles.totalValueSm}>{formatProductPrice(deliveryPrice)}</p>
                  </div>
                ) : null}
                <div className={styles.totalRow}>
                  <p className={styles.totalLabel}>Итого</p>
                  <p className={styles.totalValue}>{formatProductPrice(orderTotal)}</p>
                </div>
                {submitStatus === 'error' ? (
                  <p className={styles.error} role="alert">
                    Не удалось отправить заказ. Попробуйте ещё раз.
                  </p>
                ) : null}
                {orderingDisabled ? (
                  <p className={styles.error} role="status">
                    Каталог временно недоступен, заказ оформить нельзя. Напишите
                    нам — поможем с покупкой.
                  </p>
                ) : null}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  type="submit"
                  disabled={
                    submitStatus === 'submitting' || items.length === 0 || orderingDisabled
                  }
                >
                  {submitStatus === 'submitting' ? 'Отправляем…' : 'Оформить заказ'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  type="button"
                  onClick={() => {
                    clearCart();
                    onOpenChange(false);
                  }}
                >
                  Очистить корзину
                </Button>
              </div>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
