"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✨</span>
          <span className={styles.logoText}>GetShortzy</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {/* Product Dropdown */}
          <div 
            className={styles.navItem}
            onMouseEnter={() => setActiveDropdown('product')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={styles.navLink}>
              Product <span className={styles.arrow}>▼</span>
            </button>
            {activeDropdown === 'product' && (
              <div className={styles.dropdown}>
                <Link href="/features" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>⚡</span>
                  <div>
                    <div className={styles.dropdownTitle}>Features</div>
                    <div className={styles.dropdownDesc}>AI-powered video tools</div>
                  </div>
                </Link>
                <Link href="/integrations" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🔗</span>
                  <div>
                    <div className={styles.dropdownTitle}>Integrations</div>
                    <div className={styles.dropdownDesc}>Connect your tools</div>
                  </div>
                </Link>
                <Link href="/api" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🔌</span>
                  <div>
                    <div className={styles.dropdownTitle}>API</div>
                    <div className={styles.dropdownDesc}>Build with GetShortzy</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div 
            className={styles.navItem}
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={styles.navLink}>
              Solutions <span className={styles.arrow}>▼</span>
            </button>
            {activeDropdown === 'solutions' && (
              <div className={styles.dropdown}>
                <Link href="/solutions/creators" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🎥</span>
                  <div>
                    <div className={styles.dropdownTitle}>Content Creators</div>
                    <div className={styles.dropdownDesc}>For YouTubers & Influencers</div>
                  </div>
                </Link>
                <Link href="/solutions/marketers" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>📊</span>
                  <div>
                    <div className={styles.dropdownTitle}>Marketers</div>
                    <div className={styles.dropdownDesc}>Scale your content</div>
                  </div>
                </Link>
                <Link href="/solutions/agencies" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🏢</span>
                  <div>
                    <div className={styles.dropdownTitle}>Agencies</div>
                    <div className={styles.dropdownDesc}>Serve more clients</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div 
            className={styles.navItem}
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={styles.navLink}>
              Resources <span className={styles.arrow}>▼</span>
            </button>
            {activeDropdown === 'resources' && (
              <div className={styles.dropdown}>
                <Link href="/blog" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>📝</span>
                  <div>
                    <div className={styles.dropdownTitle}>Blog</div>
                    <div className={styles.dropdownDesc}>Tips & insights</div>
                  </div>
                </Link>
                <Link href="/help-center" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>❓</span>
                  <div>
                    <div className={styles.dropdownTitle}>Help Center</div>
                    <div className={styles.dropdownDesc}>Get support</div>
                  </div>
                </Link>
                <Link href="/case-studies" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>📈</span>
                  <div>
                    <div className={styles.dropdownTitle}>Case Studies</div>
                    <div className={styles.dropdownDesc}>Success stories</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link href="/pricing" className={styles.navLink}>Pricing</Link>
          
          {/* Language Selector */}
          <div 
            className={styles.navItem}
            onMouseEnter={() => setActiveDropdown('language')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={styles.navLink}>
              🌐 EN <span className={styles.arrow}>▼</span>
            </button>
            {activeDropdown === 'language' && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🇺🇸</span>
                  <div>
                    <div className={styles.dropdownTitle}>English</div>
                  </div>
                </button>
                <button className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🇩🇪</span>
                  <div>
                    <div className={styles.dropdownTitle}>Deutsch</div>
                  </div>
                </button>
                <button className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🇪🇸</span>
                  <div>
                    <div className={styles.dropdownTitle}>Español</div>
                  </div>
                </button>
                <button className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🇫🇷</span>
                  <div>
                    <div className={styles.dropdownTitle}>Français</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <SignedOut>
            <SignInButton mode="modal">
              <button className={styles.signInBtn}>Sign In</button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className={styles.primaryBtn}>Start Free Trial</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className={styles.primaryBtn}>Dashboard</button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/features" className={styles.mobileLink}>Features</Link>
          <Link href="/pricing" className={styles.mobileLink}>Pricing</Link>
          <Link href="/solutions/creators" className={styles.mobileLink}>For Creators</Link>
          <Link href="/solutions/marketers" className={styles.mobileLink}>For Marketers</Link>
          <Link href="/blog" className={styles.mobileLink}>Blog</Link>
          <Link href="/help-center" className={styles.mobileLink}>Help Center</Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className={styles.mobileCta}>Start Free Trial</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className={styles.mobileCta}>Dashboard</button>
            </Link>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}

