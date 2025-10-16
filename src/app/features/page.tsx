import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './features.module.css';

export const metadata = {
  title: 'Features - GetShortzy | AI-Powered Video Automation',
  description: 'Explore GetShortzy\'s powerful features: AI-powered analysis, smart auto-editing, lightning-fast processing, multi-platform export, analytics, and batch processing.',
};

export default function FeaturesPage() {
  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered Analysis',
      description: 'Our AI, powered by GPT-4o, Claude, and Gemini, analyzes your videos to identify the most engaging moments, hooks, and viral-worthy content automatically.',
      benefits: [
        'Identifies emotional peaks and engagement moments',
        'Detects trending topics and hashtags',
        'Analyzes audience retention patterns',
        'Suggests optimal clip lengths'
      ]
    },
    {
      icon: '✂️',
      title: 'Smart Auto-Editing',
      description: 'Automatically cuts, crops, and optimizes your videos for each platform\'s specifications and best practices, saving you hours of manual work.',
      benefits: [
        'Platform-specific aspect ratios (9:16, 1:1, 16:9)',
        'Auto-framing for vertical video',
        'Dynamic text overlays and captions',
        'Smooth transitions and effects'
      ]
    },
    {
      icon: '⚡',
      title: 'Lightning Fast Processing',
      description: 'Process hours of content in minutes. Our advanced infrastructure handles videos of any length with blazing speed, so you can get your content out faster.',
      benefits: [
        'Process up to 4K resolution',
        'Parallel processing for multiple videos',
        'Cloud-based rendering',
        'Real-time progress tracking'
      ]
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Track performance metrics and get AI-powered recommendations to improve your content strategy and maximize your reach.',
      benefits: [
        'Engagement rate tracking',
        'Viral potential scoring',
        'Content performance comparison',
        'Trend analysis and predictions'
      ]
    },
    {
      icon: '📤',
      title: 'Multi-Platform Export',
      description: 'Generate perfectly formatted clips for TikTok, YouTube Shorts, Instagram Reels, and more - all from a single upload.',
      benefits: [
        'One-click export to multiple platforms',
        'Platform-optimized metadata',
        'Automated thumbnail generation',
        'Direct publishing integration'
      ]
    },
    {
      icon: '📦',
      title: 'Batch Processing',
      description: 'Upload multiple videos and let our AI process them all simultaneously. Perfect for content creators with large libraries.',
      benefits: [
        'Process up to 50 videos at once',
        'Bulk editing templates',
        'Scheduled processing',
        'Priority queue for urgent content'
      ]
    },
    {
      icon: '🎨',
      title: 'Customizable Templates',
      description: 'Create and save your own editing templates with custom styles, fonts, colors, and effects for consistent branding.',
      benefits: [
        'Brand kit integration',
        'Custom intro/outro templates',
        'Reusable text styles',
        'Color palette management'
      ]
    },
    {
      icon: '🔊',
      title: 'Audio Enhancement',
      description: 'Automatically enhance audio quality, remove background noise, and add trending music to make your shorts more engaging.',
      benefits: [
        'Noise reduction and audio cleanup',
        'Auto-leveling and normalization',
        'Royalty-free music library',
        'Voice enhancement for clarity'
      ]
    },
    {
      icon: '📝',
      title: 'Auto-Captions & Subtitles',
      description: 'Generate accurate captions and subtitles automatically in multiple languages to increase accessibility and engagement.',
      benefits: [
        '95%+ transcription accuracy',
        'Support for 50+ languages',
        'Customizable caption styles',
        'Keyword highlighting'
      ]
    },
    {
      icon: '🔄',
      title: 'Version Control',
      description: 'Keep track of all your edits with automatic version history. Easily revert to previous versions or compare different cuts.',
      benefits: [
        'Unlimited version history',
        'Side-by-side comparison',
        'Restore previous versions',
        'Export multiple versions'
      ]
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time. Share projects, leave comments, and manage permissions effortlessly.',
      benefits: [
        'Real-time collaboration',
        'Role-based access control',
        'Comment and feedback system',
        'Shared asset libraries'
      ]
    },
    {
      icon: '🔌',
      title: 'API Access',
      description: 'Integrate GetShortzy into your existing workflow with our powerful API. Automate your entire content pipeline.',
      benefits: [
        'RESTful API with webhooks',
        'Comprehensive documentation',
        'SDKs for popular languages',
        'Dedicated support'
      ]
    }
  ];

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>✨ Powered by AI</span>
            <h1 className={styles.heroTitle}>
              Everything You Need to <span className={styles.gradient}>Go Viral</span>
            </h1>
            <p className={styles.heroDescription}>
              GetShortzy combines cutting-edge AI technology with powerful editing tools
              to help you create viral short-form content in minutes, not hours.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className={styles.features}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <ul className={styles.benefitsList}>
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className={styles.benefit}>
                      <span className={styles.checkmark}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Content?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of creators who are already using GetShortzy to grow their audience.
          </p>
          <a href="/dashboard" className={styles.ctaButton}>
            Start Creating Free
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}

