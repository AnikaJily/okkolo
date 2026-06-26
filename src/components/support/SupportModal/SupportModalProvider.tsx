import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SupportModal } from './SupportModal';

interface SupportModalContextValue {
  isSupportOpen: boolean;
  openSupport: () => void;
  closeSupport: () => void;
}

const SupportModalContext = createContext<SupportModalContextValue | null>(null);

/** Доступ к единственной модалке «Поддержать проект» из любой кнопки CTA. */
export function useSupportModal() {
  const context = useContext(SupportModalContext);
  if (!context) {
    throw new Error('useSupportModal must be used within SupportModalProvider');
  }
  return context;
}

export function SupportModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSupport = useCallback(() => {
    // Открываем на следующем кадре: если поддержку нажали из шторки меню
    // (SheetClose), даём ей закрыться и вернуть фокус ДО того, как модалка
    // перехватит фокус, — иначе закрытие шторки утащит фокус из модалки.
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const closeSupport = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ isSupportOpen: open, openSupport, closeSupport }),
    [open, openSupport, closeSupport],
  );

  return (
    <SupportModalContext.Provider value={value}>
      {children}
      <SupportModal open={open} onOpenChange={setOpen} />
    </SupportModalContext.Provider>
  );
}
