import { InfoSection, Paragraphs } from '../components/InfoPage';
import PageShell from '../components/PageShell';

export default function About() {
  return (
    <PageShell
      title="About AdultGen AI"
      description="AdultGen AI ships uncensored adult chat for verified adults and is building synthetic image and video with privacy, compliance, and safety controls."
      eyebrow="Company"
    >
      <Paragraphs
        items={[
          'AdultGen AI is building a chat-first, compliance-first platform for verified adults.',
          'Private beta chat is live today: fictional personas, uncensored sexting, and companion models we built for immersive adult roleplay. Users no longer need to hunt across tube sites for a tone that matches their fantasy — they can talk to a character that stays in scene.',
          'Synthetic image and short-form adult video are the next product layers. We are actively seeking investors to fund labeled, fictional-adult-only generation with prompt safety, consent controls, and no real-person likeness.',
          'AdultGen is not an unmoderated generator. The product is designed around age verification, fictional-adult-only content, real-person misuse prevention, AI labeling on future media, prompt and output safety, auditability, and privacy-preserving controls.',
          'The long-term vision is the trusted creation layer for adult entertainment: private by default, synthetic by design, chat live now, and serious about safety from day one.',
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

