import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { NAV_ITEMS } from '@/data/site';
import { getSupportAction } from '@/lib/support';
import logoSrc from '@/assets/images/logo.svg';
import menuSrc from '@/assets/images/menu.svg';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
  onSupport?: () => void;
}

export function Header({ onMenuClick, onSupport }: HeaderProps) {
  const supportAction = getSupportAction(onSupport);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a
          href="/"
          className="inline-flex shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-purple-dark)]"
          aria-label="Окколо — на главную"
        >
          <img
            src={logoSrc}
            alt="Окколо"
            className="h-[38px] w-10 object-contain lg:h-11 lg:w-[46px]"
          />
        </a>

        <nav className="hidden flex-1 lg:block" aria-label="Основная навигация">
          <ul className="m-0 flex list-none items-center justify-center gap-8 p-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative rounded-sm px-1 py-2 font-display font-medium transition-colors duration-150 after:absolute after:inset-x-1 after:bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-sm after:bg-[var(--color-purple)] after:transition-transform after:duration-200 hover:text-[var(--color-purple-dark)] hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-purple-dark)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 lg:inline-flex">
          <Button variant="primary" size="md" {...supportAction}>
            Поддержать
          </Button>
        </div>

        <div className="inline-flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <IconButton label="Открыть меню" onClick={onMenuClick}>
                <img src={menuSrc} alt="" aria-hidden="true" className="size-[30px]" />
              </IconButton>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <div className="flex items-center justify-between gap-4">
                <SheetTitle className="font-display text-xl font-semibold">
                  Меню
                </SheetTitle>
                <SheetClose asChild>
                  <IconButton label="Закрыть меню">
                    <span aria-hidden="true" className="text-3xl leading-none">
                      ×
                    </span>
                  </IconButton>
                </SheetClose>
              </div>

              <nav aria-label="Мобильная навигация">
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <a
                          href={item.href}
                          className="block rounded-[var(--radius-md)] px-4 py-3 font-display text-lg font-medium transition-colors hover:bg-[var(--color-purple-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-purple-dark)]"
                        >
                          {item.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>

              <SheetClose asChild>
                <Button variant="primary" size="lg" fullWidth {...supportAction}>
                  Поддержать
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
