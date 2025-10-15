import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.grid}>
          {/* Company Info */}
          <div className={styles.column}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>✨</span>
              <span className={styles.logoText}>GetShortzy</span>
            </div>
            <p className={styles.description}>
              AI-powered platform that transforms long videos into viral short-form content for TikTok, YouTube Shorts, and Instagram Reels.
            </p>
            <div className={styles.social}>
              <a href="https://twitter.com/getshortzy" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
              </a>
              <a href="https://linkedin.com/company/getshortzy" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://youtube.com/@getshortzy" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 9.71a8.5 8.5 0 00-.91-4.13 2.92 2.92 0 00-1.72-1A78.36 78.36 0 0012 4.27a78.45 78.45 0 00-8.34.3 2.87 2.87 0 00-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 000 6.48 9.55 9.55 0 00.3 2.12 2.93 2.93 0 001.71 1.93A78.35 78.35 0 0012 19.73a78.45 78.45 0 008.34-.3 2.85 2.85 0 001.46-.74c.9-.83 1-2.25 1.1-3.45a48.29 48.29 0 000-6.48zM9.75 14.85V8.66l5.37 3.11z"></path></svg>
              </a>
              <a href="https://instagram.com/getshortzy" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Product</h3>
            <ul className={styles.linkList}>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/integrations">Integrations</Link></li>
              <li><Link href="/api">API</Link></li>
              <li><Link href="/changelog">Changelog</Link></li>
              <li><Link href="/roadmap">Roadmap</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Solutions</h3>
            <ul className={styles.linkList}>
              <li><Link href="/use-cases/content-creators">Content Creators</Link></li>
              <li><Link href="/use-cases/marketers">Marketers</Link></li>
              <li><Link href="/use-cases/agencies">Agencies</Link></li>
              <li><Link href="/use-cases/educators">Educators</Link></li>
              <li><Link href="/use-cases/enterprises">Enterprises</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Resources</h3>
            <ul className={styles.linkList}>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="/webinars">Webinars</Link></li>
              <li><Link href="/community">Community</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Company</h3>
            <ul className={styles.linkList}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/press">Press Kit</Link></li>
              <li><Link href="/partners">Partners</Link></li>
              <li><Link href="/affiliates">Affiliates</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Legal</h3>
            <ul className={styles.linkList}>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
              <li><Link href="/security">Security</Link></li>
              <li><Link href="/gdpr">GDPR</Link></li>
              <li><Link href="/dmca">DMCA</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <p>© 2025 GetShortzy. All rights reserved.</p>
            <div className={styles.badges}>
              <span className={styles.badge}>🔒 SOC 2 Certified</span>
              <span className={styles.badge}>🛡️ GDPR Compliant</span>
              <span className={styles.badge}>⚡ 99.9% Uptime</span>
            </div>
          </div>
          <div className={styles.bottomRight}>
            <select className={styles.languageSelector}>
              <option>🌍 English</option>
              <option>🇩🇪 Deutsch</option>
              <option>🇪🇸 Español</option>
              <option>🇫🇷 Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}

