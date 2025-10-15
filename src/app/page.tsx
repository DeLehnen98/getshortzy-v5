

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "GetShortzy - AI-Powered Video Automation for Viral Shorts",
  description: "Transform long videos into viral short-form content for TikTok, YouTube Shorts, and Instagram Reels. AI-powered platform with GPT-4, Claude, Gemini 2.0, and Veo 3 integration.",
};

export default function Home() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>



        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span>✨ Powered by the latest AI models</span>
            </div>
            <h1 className={styles.heroTitle}>
              Create Viral Shorts from Long Videos in One Click
            </h1>
            <p className={styles.heroSubtitle}>
              Our AI-powered platform automatically finds the best moments in your videos and turns them into engaging, shareable shorts for TikTok, YouTube, and Reels.
            </p>
            <div className={styles.heroCta}>
              <Link href="/dashboard" className={`${styles.primaryBtn} ${styles.ctaBtn}`}>
                Get Started for Free
              </Link>
              <Link href="#how-it-works" className={`${styles.secondaryBtn} ${styles.ctaBtn}`}>
                Learn More
              </Link>
            </div>
            <div className={styles.heroNote}>
              <p>No credit card required. Free forever plan available.</p>
            </div>
          </div>
          <div className={styles.heroImage}>
            {/* Placeholder for a video or animation */}
            <div className={styles.videoPlaceholder}>
              <img src="/hero-placeholder.png" alt="GetShortzy in action" />
            </div>
          </div>
        </section>



        {/* How It Works Section */}
        <section id="how-it-works" className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How It Works in 3 Simple Steps</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepIcon}>📤</div>
              <h3 className={styles.stepTitle}>Upload Your Video</h3>
              <p className={styles.stepDescription}>Upload any video from your computer or paste a YouTube link.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepIcon}>🤖</div>
              <h3 className={styles.stepTitle}>AI Does the Magic</h3>
              <p className={styles.stepDescription}>Our AI analyzes your video, finds the best moments, and creates viral shorts.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepIcon}>✅</div>
              <h3 className={styles.stepTitle}>Download & Share</h3>
              <p className={styles.stepDescription}>Download your shorts and share them on your favorite platforms.</p>
            </div>
          </div>
        </section>



        {/* Features Section */}
        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Everything You Need to Go Viral</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧠</div>
              <h3 className={styles.featureTitle}>AI-Powered Analysis</h3>
              <p className={styles.featureDescription}>Our AI, powered by GPT-4o, Claude, and Gemini, analyzes your videos to identify the most engaging moments, hooks, and viral-worthy content automatically.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✂️</div>
              <h3 className={styles.featureTitle}>Smart Auto-Editing</h3>
              <p className={styles.featureDescription}>Automatically cuts, crops, and optimizes your videos for each platform's specifications and best practices, saving you hours of manual work.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Lightning Fast Processing</h3>
              <p className={styles.featureDescription}>Process hours of content in minutes. Our advanced infrastructure handles videos of any length with blazing speed, so you can get your content out faster.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <h3 className={styles.featureTitle}>Analytics & Insights</h3>
              <p className={styles.featureDescription}>Track performance metrics and get AI-powered recommendations to improve your content strategy and maximize your reach.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔄</div>
              <h3 className={styles.featureTitle}>Multi-Platform Export</h3>
              <p className={styles.featureDescription}>Generate perfectly formatted clips for TikTok, YouTube Shorts, Instagram Reels, and more - all from a single upload.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📦</div>
              <h3 className={styles.featureTitle}>Batch Processing</h3>
              <p className={styles.featureDescription}>Upload multiple videos and let our AI process them all simultaneously. Perfect for content creators with large libraries.</p>
            </div>
          </div>
        </section>



        {/* Testimonials Section */}
        <section className={styles.testimonials}>
          <h2 className={styles.sectionTitle}>Loved by Creators Worldwide</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>"GetShortzy has been a game-changer for my content strategy. I can now create a week's worth of shorts in just a few minutes!"</p>
              <div className={styles.testimonialAuthor}>
                <img src="/avatars/creator1.png" alt="Creator 1" className={styles.authorAvatar} />
                <div>
                  <p className={styles.authorName}>John Doe</p>
                  <p className={styles.authorHandle}>@johndoecreates</p>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>"The AI is scarily good at finding the best moments in my videos. My engagement has skyrocketed since I started using GetShortzy."</p>
              <div className={styles.testimonialAuthor}>
                <img src="/avatars/creator2.png" alt="Creator 2" className={styles.authorAvatar} />
                <div>
                  <p className={styles.authorName}>Jane Smith</p>
                  <p className={styles.authorHandle}>@janesmithcreative</p>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <p className={styles.testimonialText}>"I was skeptical at first, but GetShortzy has saved me so much time and effort. It's an essential tool for any serious content creator."</p>
              <div className={styles.testimonialAuthor}>
                <img src="/avatars/creator3.png" alt="Creator 3" className={styles.authorAvatar} />
                <div>
                  <p className={styles.authorName}>Alex Johnson</p>
                  <p className={styles.authorHandle}>@alexjohnsontech</p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Pricing Section */}
        <section className={styles.pricing}>
          <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Free</h3>
              <p className={styles.pricingPrice}>$0</p>
              <p className={styles.pricingPeriod}>per month</p>
              <ul className={styles.pricingFeatures}>
                <li>3 videos per month</li>
                <li>Basic AI analysis</li>
                <li>Standard editing tools</li>
                <li>Watermarked videos</li>
              </ul>
              <Link href="/dashboard" className={`${styles.secondaryBtn} ${styles.pricingBtn}`}>
                Get Started
              </Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
              <p className={styles.popularBadge}>Most Popular</p>
              <h3 className={styles.pricingTitle}>Pro</h3>
              <p className={styles.pricingPrice}>$29</p>
              <p className={styles.pricingPeriod}>per month</p>
              <ul className={styles.pricingFeatures}>
                <li>50 videos per month</li>
                <li>Advanced AI analysis</li>
                <li>Full editing suite</li>
                <li>No watermarks</li>
                <li>4K export</li>
              </ul>
              <Link href="/dashboard" className={`${styles.primaryBtn} ${styles.pricingBtn}`}>
                Start Your Free Trial
              </Link>
            </div>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Enterprise</h3>
              <p className={styles.pricingPrice}>Custom</p>
              <p className={styles.pricingPeriod}>per month</p>
              <ul className={styles.pricingFeatures}>
                <li>Unlimited videos</li>
                <li>Dedicated AI models</li>
                <li>Team collaboration</li>
                <li>API access</li>
                <li>24/7 support</li>
              </ul>
              <Link href="/contact" className={`${styles.secondaryBtn} ${styles.pricingBtn}`}>
                Contact Sales
              </Link>
            </div>
          </div>
        </section>



        {/* FAQ Section */}
        <section className={styles.faq}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What is GetShortzy?</h3>
              <p className={styles.faqAnswer}>GetShortzy is an AI-powered platform that automatically creates viral short-form videos from your long-form content, saving you time and effort while boosting your online presence.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What AI models do you use?</h3>
              <p className={styles.faqAnswer}>We use a combination of the latest and most powerful AI models, including OpenAI's GPT-4o, Anthropic's Claude 3, and Google's Gemini 2.0 and Veo 3, to ensure the highest quality analysis and editing.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I try GetShortzy for free?</h3>
              <p className={styles.faqAnswer}>Yes! We offer a free forever plan that allows you to process up to 3 videos per month. No credit card is required to sign up.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What platforms can I export to?</h3>
              <p className={styles.faqAnswer}>You can export your shorts in the perfect format for TikTok, YouTube Shorts, Instagram Reels, and more. We handle all the technical specifications for you.</p>
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Go Viral?</h2>
          <p className={styles.ctaSubtitle}>Join thousands of creators who are already using GetShortzy to grow their audience.</p>
          <Link href="/dashboard" className={`${styles.primaryBtn} ${styles.ctaBtnLarge}`}>
            Start Creating Free
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

