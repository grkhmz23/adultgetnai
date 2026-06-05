import { BulletList, InfoSection, Paragraphs } from '../components/InfoPage';
import PageShell from '../components/PageShell';

const focusAreas = [
  'AI video generation',
  'Proprietary model training and evaluation',
  'Trust and safety systems',
  'Prompt and output moderation',
  'Privacy-first product architecture',
  'GPU infrastructure and inference optimization',
  'Frontend engineering and premium product design',
  'Adult-tech compliance, age verification, and payment-risk operations',
  'Growth, affiliate marketing, and adult traffic acquisition',
];

const roles = [
  {
    title: 'AI / ML Engineer',
    description:
      'Work on in-house model development, evaluation, prompt-to-scene generation, safety testing, and future video-generation workflows.',
  },
  {
    title: 'Full-Stack Product Engineer',
    description:
      'Build the private demo, investor portal, authenticated product surfaces, account systems, credit logic, and internal admin tools.',
  },
  {
    title: 'Inference / Infrastructure Engineer',
    description:
      'Design GPU workflows, queue systems, model serving, storage, cost controls, monitoring, and private deployment infrastructure.',
  },
  {
    title: 'Trust & Safety / Policy Specialist',
    description:
      'Help define prohibited content taxonomies, red-team test sets, moderation workflows, audit logs, reporting flows, and compliance documentation.',
  },
  {
    title: 'Growth / Adult Traffic Specialist',
    description:
      'Support early distribution through adult ad networks, affiliate funnels, SEO, creator partnerships, and performance testing.',
  },
];

export default function Careers() {
  return (
    <PageShell
      title="Careers"
      description="Join AdultGen AI and help build private, compliance-first synthetic media infrastructure for verified adults."
      eyebrow="Company"
    >
      <p className="text-xl font-medium leading-8 text-[#121212]">
        Build the next generation of private synthetic media.
      </p>

      <Paragraphs
        items={[
          'AdultGen AI is building a chat-first adult AI platform for verified adults, with synthetic image and video on the roadmap. This is a technically difficult and highly regulated category. We are looking for people who can build with precision, discretion, and product discipline.',
          'We are especially interested in people with experience in:',
        ]}
      />

      <BulletList items={focusAreas} />

      <p>
        AdultGen is not looking for hype builders. We need people who can handle a sensitive category professionally and build systems that are secure, private, compliant, and commercially sharp.
      </p>

      <InfoSection title="Current priority roles">
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <article key={role.title} className="rounded-[8px] border border-black/8 bg-[#fbfbfb] p-5">
              <h3 className="mb-2 text-lg font-semibold text-[#121212]">{role.title}</h3>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
      </InfoSection>

      <p>
        To apply, email info@adultgen.fun with your background, relevant work, and the role you want to help build.
      </p>
    </PageShell>
  );
}

