import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './pricing.module.css';

export const metadata = {
  title: 'Pricing - GetShortzy | Choose Your Plan',
  description: 'Choose the perfect plan for your content creation needs. Start free, upgrade as you grow. No hidden fees, cancel anytime.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'per month',
      description: 'Perfect for trying out GetShortzy',
      features: [
        { name: '3 videos per month', included: true },
        { name: 'Basic AI analysis', included: true },
        { name: 'Standard editing tools', included: true },
        { name: 'Watermarked videos', included: true },
        { name: '720p export quality', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced AI analysis', included: false },
        { name: 'No watermarks', included: false },
        { name: '4K export', included: false },
        { name: 'Batch processing', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      ctaLink: '/dashboard',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For serious content creators',
      features: [
        { name: '50 videos per month', included: true },
        { name: 'Advanced AI analysis', included: true },
        { name: 'Full editing suite', included: true },
        { name: 'No watermarks', included: true },
        { name: '4K export quality', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Batch processing (up to 10)', included: true },
        { name: 'Custom templates', included: true },
        { name: 'Auto-captions', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'API access', included: false },
        { name: '24/7 support', included: false },
      ],
      cta: 'Start Free Trial',
      ctaLink: '/dashboard',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'For teams and agencies',
      features: [
        { name: 'Unlimited videos', included: true },
        { name: 'Dedicated AI models', included: true },
        { name: 'Team collaboration', included: true },
        { name: 'White-label options', included: true },
        { name: '8K export quality', included: true },
        { name: '24/7 priority support', included: true },
        { name: 'Unlimited batch processing', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'API access', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'Custom training', included: true },
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.',
    },
    {
      question: 'What happens if I exceed my video limit?',
      answer: 'If you exceed your monthly video limit, you can either upgrade to a higher plan or wait until the next billing cycle. We\'ll send you a notification when you\'re close to your limit.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.',
    },
    {
      question: 'Is there a discount for annual billing?',
      answer: 'Yes! Save 20% by choosing annual billing. For example, the Pro plan costs $278.40/year instead of $348/year.',
    },
  ];

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>💎 Simple, Transparent Pricing</span>
            <h1 className={styles.heroTitle}>
              Choose the <span className={styles.gradient}>Perfect Plan</span> for You
            </h1>
            <p className={styles.heroDescription}>
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className={styles.pricing}>
          <div className={styles.pricingGrid}>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}
              >
                {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.period}>{plan.period}</span>
                  </div>
                  <p className={styles.planDescription}>{plan.description}</p>
                </div>
                <ul className={styles.featuresList}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className={styles.feature}>
                      <span className={feature.included ? styles.checkmark : styles.crossmark}>
                        {feature.included ? '✓' : '✗'}
                      </span>
                      <span className={feature.included ? '' : styles.disabled}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <a href={plan.ctaLink} className={styles.planCta}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Still Have Questions?</h2>
          <p className={styles.ctaDescription}>
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <a href="/contact" className={styles.ctaButton}>
            Contact Sales
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}

