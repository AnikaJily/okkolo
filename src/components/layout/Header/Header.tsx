import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { HEADER_NAV_ITEMS, NAV_ITEMS } from '@/data/site';
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
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-purple-dark)] lg:h-12 lg:min-w-12"
          aria-label="Окколо — на главную"
        >
          <img
            src={logoSrc}
            alt="Окколо"
            className="h-[38px] w-10 object-contain lg:h-11 lg:w-[46px]"
          />
        </a>

        <nav className={styles.navCluster} aria-label="Основная навигация">
          <ul className={`${styles.navList} ${styles.navListDesktop}`}>
            {HEADER_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <Sheet>
            <SheetTrigger asChild>
              <IconButton
                label="Открыть меню"
                className={styles.menuButton}
                onClick={onMenuClick}
              >
                <img src={menuSrc} alt="" aria-hidden="true" className={styles.menuIcon} />
              </IconButton>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <div className={styles.sheetHeader}>
                <SheetTitle className={styles.sheetTitleHidden}>Меню</SheetTitle>
                <SheetClose asChild>
                  <IconButton label="Закрыть меню">
                    <span aria-hidden="true" className={styles.sheetCloseIcon}>
                      ×
                    </span>
                  </IconButton>
                </SheetClose>
              </div>

              <nav aria-label="Навигация в меню">
                <ul className={styles.sheetNavList}>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <a href={item.href} className={styles.sheetNavLink}>
                          {item.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>

              <SheetClose asChild>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className={styles.sheetSupport}
                  {...supportAction}
                >
                  Поддержать
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </nav>

        <div className={styles.supportWrap}>
          <Button variant="primary" size="md" {...supportAction}>
            Поддержать проект
          </Button>
        </div>
      </div>
    </header>
  );
}
