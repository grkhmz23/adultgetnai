import { BulletList, InfoSection, Paragraphs } from '../components/InfoPage';
import PageShell from '../components/PageShell';

const strictlyProhibited = [
  'minors or anyone under 18;',
  'youth-coded, school-coded, “teen,” “barely legal,” or age-ambiguous adult content;',
  'real private persons;',
  'celebrities, public figures, influencers, coworkers, acquaintances, former partners, or identifiable individuals;',
  'non-consensual sexual scenarios;',
  'coercion, blackmail, intoxication, unconsciousness, drugging, trafficking, exploitation, or abuse;',
  'incest, family-role sexual content, or step-family sexual content;',
  'bestiality;',
  'protected-class degradation, hateful sexualization, or slurs;',
  'illegal sexual content;',
  'attempts to bypass age verification, safety filters, access controls, or moderation systems;',
  'content that violates intellectual property, privacy, publicity, or personality rights.',
];

const realPersonMisuse = [
  'a celebrity;',
  'a public figure;',
  'a social media influencer;',
  'a coworker;',
  'a neighbor;',
  'an ex-partner;',
  'a friend;',
  'a private individual;',
  'a person shown in an uploaded image;',
  'a person identified by name, likeness, voice, social profile, or personal details.',
];

const minorContent = [
  'children;',
  'minors;',
  'teenagers;',
  'school settings;',
  'school uniforms;',
  '“barely legal” framing;',
  'ambiguous age;',
  'youth-coded body or behavior descriptions;',
  'fictional or animated minors;',
  'age-regression scenarios;',
  'any attempt to sexualize someone who may be under 18.',
];

const consentContent = [
  'non-consent;',
  'rape;',
  'sexual assault;',
  'coercion;',
  'blackmail;',
  'threats;',
  'intoxication;',
  'unconsciousness;',
  'drugging;',
  'trafficking;',
  'exploitation;',
  'captivity;',
  'abuse of authority;',
  'inability to consent.',
];

export default function ContentPolicy() {
  return (
    <PageShell
      title="AdultGen AI Content Policy"
      description="AdultGen AI rules for verified-adult access, fictional-adult content, real-person misuse prevention, and prohibited content."
      eyebrow="Policy"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8338ec]">
        Last updated: 2 June 2026
      </p>

      <Paragraphs
        items={[
          'AdultGen AI is being built as a private, compliance-first synthetic media platform for verified adults. This Content Policy explains what AdultGen does not allow on the website, in private demos, in chat interactions, in prompt-to-scene workflows, and in future generation products.',
          'AdultGen is not an unmoderated adult generator. The platform is designed around verified-adult access, fictional-adult content, real-person misuse prevention, consent controls, AI labeling, safety filtering, and auditability.',
        ]}
      />

      <InfoSection title="1. Verified adults only">
        <Paragraphs
          items={[
            'AdultGen AI is intended only for adults who are at least 18 years old or the age of legal majority in their jurisdiction, whichever is higher.',
            'Public adult-content generation is not available on this website. Any future production access to adult-generation features will require stronger eligibility checks, including third-party age verification where required.',
          ]}
        />
      </InfoSection>

      <InfoSection title="2. Fictional-adult-only standard">
        <Paragraphs
          items={[
            'AdultGen is designed for fictional adult content only.',
            'All generated characters, chat scenarios, roleplay interactions, and future synthetic media outputs must involve fictional adults only.',
            'AdultGen does not support requests involving minors, real people, celebrities, public figures, private persons, acquaintances, coworkers, former partners, or any identifiable individual.',
          ]}
        />
      </InfoSection>

      <InfoSection title="3. Strictly prohibited content">
        <p>
          AdultGen does not allow users to request, create, simulate, facilitate, upload, share, or distribute content involving:
        </p>
        <BulletList items={strictlyProhibited} />
      </InfoSection>

      <InfoSection title="4. Real-person misuse prevention">
        <Paragraphs
          items={[
            'AdultGen does not allow real-person sexualization or impersonation.',
            'Users may not request content involving:',
          ]}
        />
        <BulletList items={realPersonMisuse} />
        <p>
          Future self-profile or likeness features, if offered, will require strict consent controls, liveness checks, account binding, deletion rights, and additional safeguards.
        </p>
      </InfoSection>

      <InfoSection title="5. Minor and youth-coded content">
        <Paragraphs
          items={[
            'AdultGen has a zero-tolerance policy for minors and youth-coded sexual content.',
            'The platform does not allow requests involving:',
          ]}
        />
        <BulletList items={minorContent} />
        <p>If there is age ambiguity, AdultGen should refuse the request.</p>
      </InfoSection>

      <InfoSection title="6. Consent and coercion">
        <Paragraphs
          items={[
            'AdultGen only supports fictional adult scenarios that are consensual.',
            'The platform does not allow requests involving:',
          ]}
        />
        <BulletList items={consentContent} />
      </InfoSection>

      <InfoSection title="7. AI labeling and synthetic media">
        <Paragraphs
          items={[
            'AdultGen is being designed as a synthetic media platform.',
            'Future AI-generated outputs may include visible labels, machine-readable indicators, metadata, watermarking, or provenance signals to indicate that the content is AI-generated.',
            'Users may not remove, obscure, alter, misrepresent, or misuse AdultGen labels, marks, disclosures, or provenance indicators.',
          ]}
        />
      </InfoSection>

      <InfoSection title="8. Prompt and output safety">
        <Paragraphs
          items={[
            'AdultGen may use safety checks before and after generation, including prompt filtering, output moderation, refusal logic, audit logs, abuse detection, and human review where appropriate.',
            'AdultGen may block prompts, refuse outputs, restrict accounts, revoke access, or preserve safety logs where needed to enforce this policy.',
          ]}
        />
      </InfoSection>

      <InfoSection title="9. Private demos">
        <Paragraphs
          items={[
            'Private demo access is limited, controlled, and revocable.',
            'Demo users may not test the system with prohibited prompts, attempt to bypass safety controls, share credentials, publish private demo content, or represent demo outputs as production capabilities.',
            'AdultGen may revoke demo access for misuse or safety risk.',
          ]}
        />
      </InfoSection>

      <InfoSection title="10. Reporting concerns">
        <Paragraphs
          items={[
            'If you believe AdultGen has received, displayed, generated, or been used to request prohibited content, contact:',
            'info@adultgen.fun',
            'Include enough context for AdultGen to review the issue. Do not send illegal material unless legally necessary and safe to do so; describe the concern instead.',
          ]}
        />
      </InfoSection>

      <InfoSection title="11. Policy changes">
        <p>
          AdultGen may update this Content Policy as the product, law, technical safeguards, and compliance obligations evolve.
        </p>
      </InfoSection>
    </PageShell>
  );
}

