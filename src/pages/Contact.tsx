import { BulletList, Paragraphs } from '../components/InfoPage';
import PageShell from '../components/PageShell';

const categories = [
  'Investor access',
  'Private beta inquiries',
  'Partnerships',
  'Careers',
  'Privacy requests',
  'Legal and compliance',
  'General questions',
];

export default function Contact() {
  return (
    <PageShell
      title="Contact AdultGen AI"
      description="Contact AdultGen AI for investor access, partnerships, private beta inquiries, careers, privacy, or legal matters."
      eyebrow="Contact"
    >
      <Paragraphs
        items={[
          'For investor access, partnerships, private beta inquiries, career interest, privacy requests, legal notices, or general questions, contact AdultGen AI at:',
          'info@adultgen.fun',
          'AdultGen is currently in private development. The public website is an investor-facing and early-access information site. Public adult-content generation is not available on this website.',
          'Contact categories:',
        ]}
      />

      <BulletList items={categories} />

      <a
        href="mailto:info@adultgen.fun"
        className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition-transform duration-300 hover:scale-[1.02]"
      >
        Email AdultGen AI
      </a>
    </PageShell>
  );
}
