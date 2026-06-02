import { InfoSection, Paragraphs } from '../components/InfoPage';
import PageShell from '../components/PageShell';

export default function About() {
  return (
    <PageShell
      title="About AdultGen AI"
      description="AdultGen AI is building video-first synthetic media for verified adults with privacy, compliance, and safety controls."
      eyebrow="Company"
    >
      <Paragraphs
        items={[
          'AdultGen AI is building a video-first synthetic media platform for verified adults.',
          'Adult entertainment has always been driven by specificity. Users search across tube sites, creator platforms, and niche communities trying to find content that matches a private idea, mood, or fantasy. AdultGen is built around a different model: instead of searching endlessly, verified adults will be able to create personalized synthetic video experiences through a safe, private, and compliance-first interface.',
          'AdultGen is not an unmoderated generator. The product is being designed around age verification, fictional-adult-only content, real-person misuse prevention, AI labeling, prompt and output safety checks, auditability, and privacy-preserving user controls.',
          'Our first product direction combines three layers: a private conversational companion for intent capture, a scene-director engine that turns natural language into structured video prompts, and a video-generation pipeline designed for short-form synthetic adult media.',
          'The long-term vision is to build the trusted creation layer for adult entertainment: private by default, synthetic by design, and serious about safety from day one.',
        ]}
      />

      <InfoSection title="Core principles">
        <Paragraphs
          items={[
            'AdultGen is designed for verified adults only.',
            'AdultGen does not support minors, youth-coded content, real-person impersonation, celebrities, non-consensual scenarios, coercion, exploitation, or illegal content.',
            'AdultGen is built as a private synthetic media product, not a public adult-content marketplace.',
            'AdultGen treats compliance, consent, and safety as product infrastructure, not legal afterthoughts.',
          ]}
        />
      </InfoSection>
    </PageShell>
  );
}

