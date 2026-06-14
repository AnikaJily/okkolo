import { Button } from '@/components/ui/Button';
import { NAV_ITEMS, SUPPORT_HREF } from '@/data/site';
import { getSupportAction } from '@/lib/support';
import logoSrc from '@/assets/images/logo.svg';
import styles from './Footer.module.css';

const CONTACT_EMAIL = SUPPORT_HREF.replace(/^mailto:/i, '');

export function Footer() {
  const year = new Date().getFullYear();
  const supportAction = getSupportAction();

  return (
    <footer id="contacts" className={styles.footer}>
      <h2 className={styles.srOnly}>Подвал сайта</h2>

      <div className={styles.inner}>
        <div className={styles.brand}>
          <a href="/" className={styles.logoLink} aria-label="Окколо — на главную">
            <img src={logoSrc} alt="" className={styles.logo} decoding="async" />
          </a>
          <p className={styles.tagline}>
            Инклюзивное пространство для работы, творчества и встреч в Краснодаре
          </p>
        </div>

        <div className={styles.columns}>
          <nav className={styles.nav} aria-label="Навигация в подвале">
            <p className={styles.columnTitle}>Разделы</p>
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.contacts}>
            <p className={styles.columnTitle}>Контакты</p>
            <p className={styles.contactText}>Краснодар</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactLink}>
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className={styles.support}>
            <p className={styles.columnTitle}>Поддержка</p>
            <Button variant="primary" size="md" {...supportAction}>
              Поддержать проект
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>© {year} «Окколо». Все права защищены.</p>
      </div>
    </footer>
  );
}
