import PageTemplate from '@/components/PageTemplate';

export const metadata = {
  title: 'Help Center | GetShortzy',
  description: 'Get help with GetShortzy - guides, tutorials, and FAQs.',
};

export default function HelpCenterPage() {
  return (
    <PageTemplate
      badge="❓ Help Center"
      title="How Can We Help You?"
      titleGradient="Help You"
      description="Find answers to common questions, browse our guides, or contact our support team."
    />
  );
}
