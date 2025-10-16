import PageTemplate from '@/components/PageTemplate';

export const metadata = {
  title: 'Blog | GetShortzy',
  description: 'Tips, tutorials, and insights on creating viral short-form video content.',
};

export default function BlogPage() {
  return (
    <PageTemplate
      badge="📝 Blog"
      title="Latest Insights & Tips"
      titleGradient="Insights"
      description="Learn how to create viral short-form content, grow your audience, and master video marketing."
    />
  );
}
