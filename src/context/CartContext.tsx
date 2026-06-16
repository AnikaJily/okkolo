import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ShowroomProduct } from '@/data/products';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  cartUrl?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (product: ShowroomProduct) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = 'okkolo-cart-v1';

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as CartItem;
  return (
    typeof item.productId === 'string' &&
    typeof item.title === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.image === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    Number.isInteger(item.quantity)
  );
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded или private mode — игнорируем
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((product: ShowroomProduct) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
          cartUrl: product.cartUrl,
        },
      ];
    });
  }, []);

  const incrementItem = useCallback((productId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  // Уменьшает на 1; при quantity === 1 удаляет позицию (как removeItem).
  const decrementItem = useCallback((productId: string) => {
    setItems((current) =>
      current.flatMap((item) =>
        item.productId !== productId
          ? [item]
          : item.quantity <= 1
            ? []
            : [{ ...item, quantity: item.quantity - 1 }],
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalCount,
      totalPrice,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    }),
    [items, totalCount, totalPrice, addItem, incrementItem, decrementItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
