import { Button } from '@/components/ui/Button';
import { ACCESSIBILITY_CONTACTS } from '@/data/accessibility';
import { LEGAL_NAV } from '@/data/legal';
import { LOCATION_SECTION } from '@/data/location';
import { NAV_ITEMS, OKKOLO_ADDRESS, OKKOLO_HOURS, OKKOLO_MAP_URL, SUPPORT_HREF } from '@/data/site';
import { getSupportAction } from '@/lib/support';
import { cn } from '@/lib/utils';
import { AccessibilityTriggerButton } from '@/components/accessibility/AccessibilityWidget';
import telegramIcon from '@/assets/images/icon-telegram.svg';
import vkIcon from '@/assets/images/icon-vk.svg';
import logoSrc from '@/assets/images/logo.svg';
import styles from './Footer.module.css';

const CONTACT_EMAIL = SUPPORT_HREF.replace(/^mailto:/i, '');

const SOCIAL_LINKS = [
  {
    href: ACCESSIBILITY_CONTACTS.telegramHref,
    icon: telegramIcon,
    ariaLabel: 'Telegram «Окколо»',
  },
  {
    href: ACCESSIBILITY_CONTACTS.vkHref,
    icon: vkIcon,
    ariaLabel: 'ВКонтакте «Окколо»',
  },
] as const;

const NAV_SPLIT = Math.ceil(NAV_ITEMS.length / 2);

export function Footer() {
  const year = new Date().getFullYear();
  const supportAction = getSupportAction();
  const navPrimary = NAV_ITEMS.slice(0, NAV_SPLIT);
  const navSecondary = NAV_ITEMS.slice(NAV_SPLIT);

  return (
    <footer id="contacts" className={styles.footer}>
      <h2 className={styles.srOnly}>Подвал сайта</h2>

      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <a href="/" className={styles.logoLink} aria-label="Окколо — на главную">
              <img src={logoSrc} alt="" className={styles.logo} decoding="async" />
            </a>
            <p className={styles.tagline}>
              Инклюзивное пространство для работы, творчества и встреч в Краснодаре
            </p>
          </div>

          <nav className={styles.col} aria-label="Разделы сайта, часть 1">
            <p className={styles.colTitle}>Разделы</p>
            <ul className={styles.linkList}>
              {navPrimary.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Разделы сайта, часть 2">
            <p className={styles.colTitleVisuallyHidden}>Разделы</p>
            <ul className={styles.linkList}>
              {navSecondary.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <p className={styles.colTitle}>Контакты</p>
            <ul className={styles.linkList}>
              <li>
                <a href={`/#${LOCATION_SECTION.id}`} className={styles.link}>
                  {LOCATION_SECTION.heading}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={styles.linkAccent}>
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <div className={styles.meta}>
              <a
                href={OKKOLO_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.addressLink}
              >
                {OKKOLO_ADDRESS}
              </a>
              {OKKOLO_HOURS.map((slot) => (
                <p key={slot.days} className={styles.metaLine}>
                  <span className={styles.metaDays}>{slot.days}</span>
                  <span className={styles.metaTime}>{slot.time}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bar}>
          <div className={styles.barInfo}>
            <p className={styles.copy}>© {year} «Окколо». Все права защищены.</p>
            <nav className={styles.legal} aria-label="Правовая информация">
              {LEGAL_NAV.map((item) => (
                <a key={item.href} href={item.href} className={styles.legalLink}>
                  {item.navLabel}
                </a>
              ))}
            </nav>
          </div>
          <div className={styles.barActions}>
            <AccessibilityTriggerButton
              id="footer-a11y-trigger"
              className={cn(styles.footerBarBtn, styles.footerA11y)}
            />
            <Button
              variant="primary"
              size="sm"
              className={cn(styles.footerBarBtn, styles.footerSupport)}
              {...supportAction}
            >
              Поддержать проект
            </Button>
            <ul className={styles.social} aria-label="Соцсети">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socialLink}
                    aria-label={social.ariaLabel}
                  >
                    <img src={social.icon} alt="" className={styles.socialIcon} decoding="async" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
