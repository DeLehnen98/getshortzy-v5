import PageTemplate from '@/components/PageTemplate';

export const metadata = {
  title: 'For Content Creators | GetShortzy',
  description: 'Create viral shorts faster with AI-powered tools designed for content creators.',
};

export default function CreatorsPage() {
  return (
    <PageTemplate
      badge="✨ For Creators"
      title="Create Viral Content Faster"
      titleGradient="Viral Content"
      description="GetShortzy helps content creators turn long-form videos into engaging shorts in minutes, not hours. Focus on creating great content while our AI handles the editing."
    >
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '40px' }}>
            Built for Content Creators
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px' }}>
            Whether you're a YouTuber, podcaster, or social media influencer, GetShortzy helps you maximize your content's reach across all platforms.
          </p>
        </div>
      </section>
    </PageTemplate>
  );
}

