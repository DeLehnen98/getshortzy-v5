import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        {/* Hero Section - Modern & Bold */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.gradientOrb1}></div>
            <div className={styles.gradientOrb2}></div>
            <div className={styles.gradientOrb3}></div>
          </div>
          
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <span className={styles.badgeIcon}>✨</span>
              Powered by GPT-4, Claude & Gemini
            </span>
            
            <h1 className={styles.heroTitle}>
              Turn Long Videos Into
              <span className={styles.heroGradient}> Viral Shorts</span>
              <br />
              in Seconds
            </h1>
            
            <p className={styles.heroDescription}>
              AI-powered platform that automatically finds the best moments in your videos
              and creates engaging short-form content for TikTok, YouTube Shorts, and Instagram Reels.
            </p>
            
            <div className={styles.heroButtons}>
              <Link href="/dashboard" className={styles.btnPrimary}>
                <span>Start Creating Free</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="#demo" className={styles.btnSecondary}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6.66667 5L13.3333 10L6.66667 15V5Z" fill="currentColor"/>
                </svg>
                <span>Watch Demo</span>
              </Link>
            </div>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Creators</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>2M+</div>
                <div className={styles.statLabel}>Videos Created</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>500M+</div>
                <div className={styles.statLabel}>Views Generated</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Modern Grid */}
        <section className={styles.features}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Features</span>
            <h2 className={styles.sectionTitle}>
              Everything You Need to <span className={styles.gradient}>Go Viral</span>
            </h2>
            <p className={styles.sectionDescription}>
              Powerful AI tools designed to help you create engaging content faster than ever.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧠</div>
              <h3 className={styles.featureTitle}>AI-Powered Analysis</h3>
              <p className={styles.featureDescription}>
                Advanced AI identifies the most engaging moments, hooks, and viral-worthy content automatically.
              </p>
              <Link href="/features" className={styles.featureLink}>
                Learn more →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✂️</div>
              <h3 className={styles.featureTitle}>Smart Auto-Editing</h3>
              <p className={styles.featureDescription}>
                Automatically cuts, crops, and optimizes your videos for each platform's specifications.
              </p>
              <Link href="/features" className={styles.featureLink}>
                Learn more →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Lightning Fast</h3>
              <p className={styles.featureDescription}>
                Process hours of content in minutes with our advanced cloud infrastructure.
              </p>
              <Link href="/features" className={styles.featureLink}>
                Learn more →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Multi-Platform Export</h3>
              <p className={styles.featureDescription}>
                Perfect formatting for TikTok, YouTube Shorts, Instagram Reels, and more.
              </p>
              <Link href="/features" className={styles.featureLink}>
                Learn more →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Analytics & Insights</h3>
              <p className={styles.featureDescription}>
                Track performance and get AI-powered recommendations to improve your content.
              </p>
              <Link href="/features" className={styles.featureLink}>
                Learn more →
              </Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎨</div>
              <h3 className={styles.featureTitle}>Custom Branding</h3>
              <p className={styles.featureDescription}>
                Add your logo, colors, and fonts to maintain consistent branding across all content.
              </p>
              <Link href="/features" className={styles.featureLink}>
                Learn more →
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works - Visual Steps */}
        <section className={styles.howItWorks}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>How It Works</span>
            <h2 className={styles.sectionTitle}>
              Create Viral Shorts in <span className={styles.gradient}>3 Simple Steps</span>
            </h2>
          </div>

          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Upload Your Video</h3>
                <p className={styles.stepDescription}>
                  Upload any long-form video or paste a YouTube link. Supports all major formats.
                </p>
              </div>
            </div>

            <div className={styles.stepConnector}></div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>AI Does the Magic</h3>
                <p className={styles.stepDescription}>
                  Our AI analyzes your video, finds the best moments, and creates viral shorts automatically.
                </p>
              </div>
            </div>

            <div className={styles.stepConnector}></div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Download & Share</h3>
                <p className={styles.stepDescription}>
                  Download your shorts and share them directly to your favorite platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Testimonials */}
        <section className={styles.testimonials}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Testimonials</span>
            <h2 className={styles.sectionTitle}>
              Loved by <span className={styles.gradient}>Creators Worldwide</span>
            </h2>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>⭐⭐⭐⭐⭐</div>
              <p className={styles.testimonialText}>
                "GetShortzy has completely transformed my content strategy. I'm now creating 10x more shorts in half the time!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>JD</div>
                <div>
                  <div className={styles.authorName}>John Doe</div>
                  <div className={styles.authorTitle}>Content Creator</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>⭐⭐⭐⭐⭐</div>
              <p className={styles.testimonialText}>
                "The AI is incredibly accurate at finding the best moments. It's like having a professional editor on demand."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>JS</div>
                <div>
                  <div className={styles.authorName}>Jane Smith</div>
                  <div className={styles.authorTitle}>YouTube Creator</div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>⭐⭐⭐⭐⭐</div>
              <p className={styles.testimonialText}>
                "I was skeptical at first, but GetShortzy has saved me countless hours. The results are amazing!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>AJ</div>
                <div>
                  <div className={styles.authorName}>Alex Johnson</div>
                  <div className={styles.authorTitle}>TikTok Influencer</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className={styles.pricing}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Pricing</span>
            <h2 className={styles.sectionTitle}>
              Choose Your <span className={styles.gradient}>Perfect Plan</span>
            </h2>
            <p className={styles.sectionDescription}>
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Free</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.priceAmount}>$0</span>
                  <span className={styles.pricePeriod}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ 3 videos per month</li>
                <li>✓ Basic AI analysis</li>
                <li>✓ 720p export</li>
                <li>✓ Watermarked videos</li>
              </ul>
              <Link href="/dashboard" className={styles.pricingButton}>
                Get Started
              </Link>
            </div>

            <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Pro</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.priceAmount}>$29</span>
                  <span className={styles.pricePeriod}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ 50 videos per month</li>
                <li>✓ Advanced AI analysis</li>
                <li>✓ 4K export</li>
                <li>✓ No watermarks</li>
                <li>✓ Priority support</li>
              </ul>
              <Link href="/dashboard" className={styles.pricingButtonPrimary}>
                Start Free Trial
              </Link>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Enterprise</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.priceAmount}>Custom</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ Unlimited videos</li>
                <li>✓ Dedicated AI models</li>
                <li>✓ API access</li>
                <li>✓ 24/7 support</li>
                <li>✓ Custom integrations</li>
              </ul>
              <Link href="/contact" className={styles.pricingButton}>
                Contact Sales
              </Link>
            </div>
          </div>

          <div className={styles.pricingFooter}>
            <Link href="/pricing" className={styles.viewAllPricing}>
              View detailed pricing →
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Create <span className={styles.gradient}>Viral Content</span>?
            </h2>
            <p className={styles.ctaDescription}>
              Join 50,000+ creators who are already using GetShortzy to grow their audience.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/dashboard" className={styles.btnPrimary}>
                <span>Start Creating Free</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/contact" className={styles.btnSecondary}>
                <span>Talk to Sales</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

