import Link from 'next/link';
import styles from './PageTemplate.module.css';

interface PageTemplateProps {
  badge: string;
  title: string;
  titleGradient?: string;
  description: string;
  children?: React.ReactNode;
}

export default function PageTemplate({ badge, title, titleGradient, description, children }: PageTemplateProps) {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>{badge}</div>
          <h1 className={styles.title}>
            {titleGradient ? (
              <>
                {title.split(titleGradient)[0]}
                <span className={styles.gradient}>{titleGradient}</span>
                {title.split(titleGradient)[1]}
              </>
            ) : (
              title
            )}
          </h1>
          <p className={styles.description}>{description}</p>
        </div>
      </section>
      {children}
    </main>
  );
}
