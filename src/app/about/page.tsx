import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us - GetShortzy | Our Story & Mission',
  description: 'Learn about GetShortzy\'s mission to democratize video content creation with AI-powered automation. Meet our team and discover our values.',
};

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Product at a leading social media platform. Passionate about empowering creators with AI technology.',
      image: '👩‍💼',
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'AI researcher with 10+ years of experience in machine learning and computer vision. PhD from Stanford.',
      image: '👨‍💻',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Product',
      bio: 'Product leader with a track record of building tools that creators love. Previously at Adobe and Canva.',
      image: '👩‍🎨',
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      bio: 'Infrastructure expert who scaled video processing systems at Netflix. Loves solving complex technical challenges.',
      image: '👨‍🔧',
    },
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Creator-First',
      description: 'Every decision we make starts with asking: "How does this help creators succeed?"',
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'We push the boundaries of what\'s possible with AI to give creators superpowers.',
    },
    {
      icon: '🤝',
      title: 'Transparency',
      description: 'We believe in honest communication, clear pricing, and no hidden surprises.',
    },
    {
      icon: '🌍',
      title: 'Accessibility',
      description: 'Professional video editing should be accessible to everyone, not just experts.',
    },
  ];

  const milestones = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'GetShortzy was founded with a mission to democratize video content creation.',
    },
    {
      year: '2024',
      title: 'Product Launch',
      description: 'Launched our AI-powered platform to the public. Reached 1,000 creators in the first month.',
    },
    {
      year: '2024',
      title: 'Rapid Growth',
      description: 'Processed over 1 million videos and helped creators generate 100M+ views.',
    },
    {
      year: '2025',
      title: 'Enterprise Expansion',
      description: 'Launched Enterprise plan and API. Now serving Fortune 500 companies and agencies.',
    },
  ];

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>✨ Our Story</span>
            <h1 className={styles.heroTitle}>
              Empowering Creators with <span className={styles.gradient}>AI Technology</span>
            </h1>
            <p className={styles.heroDescription}>
              We believe that every creator should have access to professional-grade video editing tools,
              regardless of their technical expertise or budget. That's why we built GetShortzy.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.mission}>
          <div className={styles.missionContent}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              GetShortzy was born from a simple observation: creating engaging short-form content is incredibly
              time-consuming. Creators spend hours editing videos, trying to identify the best moments, and
              optimizing for different platforms.
            </p>
            <p className={styles.missionText}>
              We knew there had to be a better way. By combining cutting-edge AI technology with an intuitive
              interface, we've created a platform that does the heavy lifting for you. Our AI analyzes your
              content, identifies viral-worthy moments, and creates platform-optimized shorts in minutes.
            </p>
            <p className={styles.missionText}>
              Today, GetShortzy helps thousands of creators save time, grow their audience, and focus on what
              they do best: creating amazing content.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.values}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <div key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>{value.icon}</div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.team}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <div className={styles.teamGrid}>
            {team.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.teamImage}>{member.image}</div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamBio}>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className={styles.timeline}>
          <h2 className={styles.sectionTitle}>Our Journey</h2>
          <div className={styles.timelineContainer}>
            {milestones.map((milestone, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{milestone.year}</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{milestone.title}</h3>
                  <p className={styles.timelineDescription}>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Active Creators</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1M+</div>
              <div className={styles.statLabel}>Videos Processed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>100M+</div>
              <div className={styles.statLabel}>Views Generated</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>4.9/5</div>
              <div className={styles.statLabel}>User Rating</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Join Thousands of Creators</h2>
          <p className={styles.ctaDescription}>
            Start creating viral shorts with AI-powered automation today.
          </p>
          <a href="/dashboard" className={styles.ctaButton}>
            Get Started Free
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}

