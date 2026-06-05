import { BulletList, InfoSection, Paragraphs } from '../components/InfoPage';
import PageShell from '../components/PageShell';

const prohibitedUse = [
  'minors or anyone under 18;',
  'youth-coded, school-coded, “teen,” “barely legal,” or age-ambiguous adult content;',
  'real private persons;',
  'celebrities, public figures, influencers, coworkers, acquaintances, former partners, or identifiable individuals;',
  'non-consensual scenarios;',
  'coercion, blackmail, intoxication, unconsciousness, trafficking, exploitation, or abuse;',
  'sexual content involving minors, real biological relatives, or non-fictional family members;',
  'bestiality;',
  'protected-class degradation, hateful sexualization, or slurs;',
  'illegal sexual content;',
  'attempts to bypass age verification, safety filters, access controls, or moderation systems;',
  'content that violates intellectual property, privacy, publicity, or personality rights.',
];

const unavailablePublicFeatures = [
  'live adult video generation;',
  'public adult image or video galleries;',
  'user image upload;',
  'public user-to-user sharing;',
  'payment processing;',
  'production age verification;',
  'production subscription access.',
];

export default function Terms() {
  return (
    <PageShell
      title="AdultGen AI Terms of Use"
      description="Terms governing access to AdultGen.com, investor materials, private demos, and early-access features."
      eyebrow="Legal"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8338ec]">
        Last updated: 2 June 2026
      </p>

      <Paragraphs
        items={[
          'These Terms of Use govern access to AdultGen.com, the AdultGen AI public website, investor materials, private demo areas, waitlist forms, and any early-access features made available by AdultGen AI.',
          'By accessing the website, requesting access, joining the waitlist, using a private demo, or communicating with AdultGen AI, you agree to these Terms.',
        ]}
      />

      <InfoSection title="1. Adult-only service">
        <Paragraphs
          items={[
            'AdultGen AI is intended only for adults who are at least 18 years old or the age of legal majority in their jurisdiction, whichever is higher.',
            'You may not access or use AdultGen AI if you are under 18, if you are not legally permitted to access adult-oriented services, or if your jurisdiction prohibits access to this type of service.',
            'The public website does not provide public adult-content generation. Any future production product will require stronger eligibility checks, including third-party age verification where required.',
          ]}
        />
      </InfoSection>

      <InfoSection title="2. Website purpose">
        <Paragraphs
          items={[
            'AdultGen.com is currently an investor-facing, private-beta, and product-information website. It may describe planned features, research directions, prototypes, business plans, and future product capabilities.',
            'Not all described features are live. Product availability, design, pricing, technical scope, and launch timelines may change.',
          ]}
        />
      </InfoSection>

      <InfoSection title="3. No public generation, upload, or payment service">
        <p>Unless explicitly announced by AdultGen AI, the public website does not provide:</p>
        <BulletList items={unavailablePublicFeatures} />
        <p>Any private demo access is limited, revocable, and provided for evaluation only.</p>
      </InfoSection>

      <InfoSection title="4. Private demo access">
        <Paragraphs
          items={[
            'AdultGen AI may provide selected users, investors, partners, or testers with private credentials. Credentials are personal and may not be shared, sold, transferred, published, or used by anyone else.',
            'AdultGen AI may suspend, revoke, or restrict access at any time for security, compliance, misuse, or operational reasons.',
          ]}
        />
      </InfoSection>

      <InfoSection title="5. Prohibited use">
        <p>
          You may not use AdultGen AI, its website, demo areas, forms, chat features, or future products to request, create, simulate, distribute, or facilitate content involving:
        </p>
        <BulletList items={prohibitedUse} />
        <p>AdultGen AI may block, refuse, log, review, or report attempted misuse.</p>
      </InfoSection>

      <InfoSection title="6. AI-generated and synthetic content">
        <Paragraphs
          items={[
            'AdultGen AI is being developed as a synthetic media platform. AI outputs may be inaccurate, inconsistent, incomplete, or unsuitable. AdultGen AI does not guarantee that any AI output will satisfy a user’s request.',
            'AdultGen AI may apply visible labels, machine-readable indicators, metadata, watermarking, safety checks, and moderation review to synthetic content.',
            'You may not remove, obscure, alter, or misrepresent AdultGen AI labels, marks, or disclosures.',
          ]}
        />
      </InfoSection>

      <InfoSection title="7. User input and responsibility">
        <Paragraphs
          items={[
            'You are responsible for the prompts, messages, information, and materials you submit.',
            'Do not submit personal data, sensitive data, images, names, likenesses, or identifying information about another person. Do not submit anything you do not have the right to use.',
            'For demo areas, AdultGen AI may restrict or disable logging where appropriate, but you should not submit highly sensitive information unless AdultGen AI has explicitly confirmed the relevant privacy controls.',
          ]}
        />
      </InfoSection>

      <InfoSection title="8. Intellectual property">
        <Paragraphs
          items={[
            'AdultGen AI, its logo, website, interface, text, deck, concepts, product designs, software, workflows, graphics, and materials are owned by AdultGen AI or its licensors.',
            'You may not copy, scrape, reproduce, modify, reverse engineer, redistribute, or commercially exploit AdultGen AI materials without written permission.',
          ]}
        />
      </InfoSection>

      <InfoSection title="9. Investor information">
        <Paragraphs
          items={[
            'Any investor materials, forecasts, market discussions, product roadmaps, financial projections, or fundraising statements are provided for informational discussion only. They are not an offer to sell securities or a solicitation to buy securities.',
            'Forward-looking statements involve risk and uncertainty. Actual results may differ materially from projections or plans.',
          ]}
        />
      </InfoSection>

      <InfoSection title="10. Third-party services">
        <p>
          AdultGen AI may use third-party providers for hosting, analytics, security, age verification, email, infrastructure, payments, moderation, or other functions. Use of those services may be subject to additional terms and privacy policies.
        </p>
      </InfoSection>

      <InfoSection title="11. Availability and changes">
        <Paragraphs
          items={[
            'AdultGen AI may modify, suspend, discontinue, or restrict any part of the website, demo, or product at any time.',
            'AdultGen AI does not guarantee uninterrupted availability, error-free operation, or permanent access.',
          ]}
        />
      </InfoSection>

      <InfoSection title="12. Disclaimers">
        <p>
          The website, demo, and materials are provided “as is” and “as available.” AdultGen AI disclaims warranties to the maximum extent permitted by law, including warranties of merchantability, fitness for a particular purpose, non-infringement, availability, accuracy, and security.
        </p>
      </InfoSection>

      <InfoSection title="13. Limitation of liability">
        <p>
          To the maximum extent permitted by law, AdultGen AI will not be liable for indirect, incidental, consequential, special, punitive, or exemplary damages, including lost profits, lost data, loss of business opportunity, reputational damage, or unauthorized use of your account.
        </p>
      </InfoSection>

      <InfoSection title="14. Termination">
        <p>
          AdultGen AI may suspend or terminate access if you violate these Terms, create legal or safety risk, attempt to bypass controls, misuse private credentials, or use the service in a prohibited way.
        </p>
      </InfoSection>

      <InfoSection title="15. Changes to these Terms">
        <p>
          AdultGen AI may update these Terms from time to time. The updated version will be posted on the website with a revised date. Continued use after changes means you accept the updated Terms.
        </p>
      </InfoSection>

      <InfoSection title="16. Contact">
        <p>For legal questions, contact info@adultgen.fun.</p>
      </InfoSection>
    </PageShell>
  );
}

