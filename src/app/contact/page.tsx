'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>📧 Get in Touch</span>
            <h1 className={styles.heroTitle}>
              We'd <span className={styles.gradient}>Love to Hear</span> from You
            </h1>
            <p className={styles.heroDescription}>
              Have a question, feedback, or need help? Our team is here to assist you.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className={styles.contact}>
          <div className={styles.contactContainer}>
            {/* Contact Form */}
            <div className={styles.formSection}>
              <h2 className={styles.formTitle}>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="John Doe"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="john@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Your Company"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={styles.textarea}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={styles.submitButton}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <div className={styles.successMessage}>
                    ✓ Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                {status === 'error' && (
                  <div className={styles.errorMessage}>
                    ✗ Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className={styles.infoSection}>
              <h2 className={styles.infoTitle}>Other Ways to Reach Us</h2>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📧</div>
                <h3 className={styles.infoCardTitle}>Email</h3>
                <p className={styles.infoCardText}>support@getshortzy.com</p>
                <p className={styles.infoCardSubtext}>We typically respond within 24 hours</p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>💬</div>
                <h3 className={styles.infoCardTitle}>Live Chat</h3>
                <p className={styles.infoCardText}>Available 9 AM - 6 PM EST</p>
                <p className={styles.infoCardSubtext}>Click the chat icon in the bottom right</p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📚</div>
                <h3 className={styles.infoCardTitle}>Help Center</h3>
                <p className={styles.infoCardText}>Find answers instantly</p>
                <a href="/help" className={styles.infoCardLink}>
                  Visit Help Center →
                </a>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🏢</div>
                <h3 className={styles.infoCardTitle}>Office</h3>
                <p className={styles.infoCardText}>
                  123 Innovation Drive<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>

              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Follow Us</h3>
                <div className={styles.socialLinks}>
                  <a href="https://twitter.com/getshortzy" className={styles.socialLink}>
                    Twitter
                  </a>
                  <a href="https://linkedin.com/company/getshortzy" className={styles.socialLink}>
                    LinkedIn
                  </a>
                  <a href="https://youtube.com/@getshortzy" className={styles.socialLink}>
                    YouTube
                  </a>
                  <a href="https://instagram.com/getshortzy" className={styles.socialLink}>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What's your response time?</h3>
              <p className={styles.faqAnswer}>
                We typically respond to all inquiries within 24 hours during business days.
                Enterprise customers receive priority support with faster response times.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Do you offer phone support?</h3>
              <p className={styles.faqAnswer}>
                Phone support is available for Enterprise plan customers. All other users can reach
                us via email, live chat, or this contact form.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I schedule a demo?</h3>
              <p className={styles.faqAnswer}>
                Yes! Select "Sales & Pricing" as the subject and mention that you'd like to schedule
                a demo. Our sales team will reach out to arrange a time.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How do I report a bug?</h3>
              <p className={styles.faqAnswer}>
                Select "Technical Support" as the subject and provide as much detail as possible
                about the issue, including steps to reproduce it.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

