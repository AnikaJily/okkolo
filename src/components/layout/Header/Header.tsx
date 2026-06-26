import { useEffect, useState } from 'react';
import { CloseIcon } from '@/components/ui/CloseIcon/CloseIcon';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { HEADER_NAV, NAV_ITEMS } from '@/data/site';
import { useSupportModal } from '@/components/support/SupportModal';
import { getSupportAction } from '@/lib/support';
import { cn } from '@/lib/utils';
import { AccessibilityTriggerButton } from '@/components/accessibility/AccessibilityWidget';
import logoSrc from '@/assets/images/logo.svg';
import menuSrc from '@/assets/images/menu.svg';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/events') {
    return pathname === '/events' || pathname.startsWith('/events/');
  }
  return pathname === href;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { openSupport } = useSupportModal();
  const supportAction = getSupportAction(openSupport);
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', updatePathname);
    return () => window.removeEventListener('popstate', updatePathname);
  }, []);

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

        <nav className={styles.desktopNav} aria-label="Основная навигация">
          <ul className={styles.navList}>
            {HEADER_NAV.map((item) => (
              <li
                key={item.href}
                className={
                  item.priority === 'always'
                    ? undefined
                    : styles[
                        item.priority === 'wide' ? 'navItemWide' : 'navItemExtra'
                      ]
                }
              >
                <a
                  href={item.href}
                  className={cn(
                    styles.navLink,
                    isNavLinkActive(pathname, item.href) && styles.navLinkActive,
                  )}
                  aria-current={isNavLinkActive(pathname, item.href) ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.supportWrap}>
            <Button variant="primary" size="xs" {...supportAction}>
              Поддержать проект
            </Button>
          </div>

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
            <SheetContent
              className={cn(styles.sheetContent, 'gap-0 p-0 !w-[min(92vw,420px)]')}
              aria-describedby={undefined}
            >
              <div className={styles.sheetHeader}>
                <a href="/" className={styles.sheetLogoLink} aria-label="Окколо — на главную">
                  <img src={logoSrc} alt="" className={styles.sheetLogo} decoding="async" />
                </a>
                <SheetTitle className={styles.sheetTitleHidden}>Меню</SheetTitle>
                <SheetClose asChild>
                  <IconButton label="Закрыть меню" className={styles.sheetClose}>
                    <CloseIcon size="sheet" />
                  </IconButton>
                </SheetClose>
              </div>

              <nav className={styles.sheetNav} aria-label="Навигация в меню">
                <ul className={styles.sheetNavList}>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href} className={styles.sheetNavItem}>
                      <SheetClose asChild>
                        <a
                          href={item.href}
                          className={cn(
                            styles.sheetNavLink,
                            isNavLinkActive(pathname, item.href) && styles.sheetNavLinkActive,
                          )}
                          aria-current={
                            isNavLinkActive(pathname, item.href) ? 'page' : undefined
                          }
                        >
                          {item.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className={styles.sheetFooter}>
                <SheetClose asChild>
                  <AccessibilityTriggerButton fullWidth className={styles.sheetA11y} />
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    className={styles.sheetSupport}
                    {...supportAction}
                  >
                    Поддержать проект
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
