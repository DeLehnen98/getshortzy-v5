import PageTemplate from '@/components/PageTemplate';

export const metadata = {
  title: 'For Marketers | GetShortzy',
  description: 'Scale your video marketing with AI-powered short-form content creation.',
};

export default function MarketersPage() {
  return (
    <PageTemplate
      badge="📊 For Marketers"
      title="Scale Your Video Marketing"
      titleGradient="Video Marketing"
      description="Create dozens of engaging social media clips from your long-form content. Perfect for marketing teams looking to maximize ROI on video content."
    />
  );
}
