import { BulletList, InfoSection, Paragraphs } from '../components/InfoPage';
import PageShell from '../components/PageShell';

const collectedInfo = [
  'name;',
  'email address;',
  'company or firm name;',
  'investor type;',
  'career application information;',
  'contact messages;',
  'private beta interest;',
  'demo access requests;',
  'communications with AdultGen AI.',
];

const automaticInfo = [
  'IP address;',
  'browser type;',
  'device type;',
  'operating system;',
  'referring page;',
  'pages visited;',
  'timestamps;',
  'security logs;',
  'form submission metadata;',
  'cookie or session identifiers.',
];

const uses = [
  'respond to inquiries;',
  'manage investor access requests;',
  'manage private beta interest;',
  'review career applications;',
  'operate and secure the website;',
  'provide private demo access;',
  'prevent abuse and unauthorized access;',
  'improve the product and user experience;',
  'prepare compliance, safety, and operational documentation;',
  'communicate updates where permitted;',
  'comply with legal obligations.',
];

const legalBases = [
  'your consent;',
  'steps taken before entering into a possible agreement;',
  'performance of an agreement;',
  'legitimate interests, including security, product development, investor communication, fraud prevention, and business operations;',
  'legal obligations.',
];

const rights = [
  'access your personal data;',
  'correct inaccurate data;',
  'delete data;',
  'restrict processing;',
  'object to processing;',
  'withdraw consent;',
  'request data portability;',
  'lodge a complaint with a data protection authority.',
];

export default function Privacy() {
  return (
    <PageShell
      title="AdultGen AI Privacy Policy"
      description="How AdultGen AI handles information collected through AdultGen.com, private demo access, and related communications."
      eyebrow="Legal"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8338ec]">
        Last updated: 2 June 2026
      </p>

      <Paragraphs
        items={[
          'This Privacy Policy explains how AdultGen AI handles information collected through AdultGen.com, investor access forms, private beta forms, demo areas, and related communications.',
          'AdultGen AI is currently in private development. The public website is an information and early-access site. Public adult-content generation, public user uploads, and public payment processing are not available on the website unless explicitly announced.',
        ]}
      />

      <InfoSection title="1. Information we collect">
        <p>AdultGen AI may collect information you provide directly, including:</p>
        <BulletList items={collectedInfo} />
        <p>
          If you receive private demo access, AdultGen AI may process account information, authentication events, demo usage activity, prompts, chat messages, scene-planning requests, safety events, and technical logs.
        </p>
      </InfoSection>

      <InfoSection title="2. Sensitive information">
        <Paragraphs
          items={[
            'AdultGen AI operates in an adult-oriented category. Prompts, messages, demo interactions, or product feedback may reveal sensitive preferences or private information.',
            'Do not submit personal data about other people. Do not submit names, likenesses, private facts, images, or identifying information about another person.',
            'AdultGen AI does not intend to use private demo chats or sensitive user inputs for model training by default. Any future training use of private user data will require a separate, explicit opt-in process.',
          ]}
        />
      </InfoSection>

      <InfoSection title="3. Information collected automatically">
        <p>AdultGen AI may collect technical information such as:</p>
        <BulletList items={automaticInfo} />
        <p>This information is used for security, abuse prevention, analytics, debugging, and site improvement.</p>
      </InfoSection>

      <InfoSection title="4. How we use information">
        <p>AdultGen AI may use information to:</p>
        <BulletList items={uses} />
      </InfoSection>

      <InfoSection title="5. Legal bases">
        <p>Where applicable, AdultGen AI may process personal data based on:</p>
        <BulletList items={legalBases} />
        <p>For sensitive data, AdultGen AI will rely on explicit consent or another legally valid basis where required.</p>
      </InfoSection>

      <InfoSection title="6. Age verification">
        <Paragraphs
          items={[
            'AdultGen AI is designed for verified adults only. The public website does not provide public adult-content generation.',
            'For future production access, AdultGen AI expects to use third-party age-verification providers. AdultGen AI intends to minimize direct collection of identity documents and use privacy-preserving age-verification methods where possible.',
          ]}
        />
      </InfoSection>

      <InfoSection title="7. AI training and demo data">
        <Paragraphs
          items={[
            'AdultGen AI does not intend to use private demo conversations, investor demo messages, or private user inputs for model training by default.',
            'AdultGen AI may use synthetic, licensed, commissioned, public-domain-reviewed, or otherwise rights-cleared datasets for model development.',
            'If AdultGen AI later offers users the option to contribute data for training, that process will require clear notice, explicit opt-in, and deletion controls.',
          ]}
        />
      </InfoSection>

      <InfoSection title="8. Sharing information">
        <Paragraphs
          items={[
            'AdultGen AI may share information with service providers that help operate the website and product, including hosting, email, analytics, security, authentication, storage, moderation, legal, compliance, and infrastructure providers.',
            'AdultGen AI may also disclose information if required to comply with law, protect rights or safety, investigate abuse, enforce Terms, prevent fraud, or respond to valid legal requests.',
            'AdultGen AI does not sell personal information to advertisers.',
          ]}
        />
      </InfoSection>

      <InfoSection title="9. Retention">
        <Paragraphs
          items={[
            'AdultGen AI keeps personal data only as long as needed for the purposes described in this Policy, including communication, security, legal, compliance, business operations, and dispute prevention.',
            'Investor and contact requests may be retained for business records. Security logs may be retained for abuse prevention. Demo data may be retained for a limited period unless deletion is requested or retention is required for security or legal reasons.',
          ]}
        />
      </InfoSection>

      <InfoSection title="10. Security">
        <Paragraphs
          items={[
            'AdultGen AI uses reasonable technical and organizational measures to protect information, including access controls, restricted admin access, authentication protections, logging, and secure infrastructure practices.',
            'No system is completely secure. You should not submit information that you do not want processed by an early-stage private demo environment.',
          ]}
        />
      </InfoSection>

      <InfoSection title="11. International processing">
        <p>
          AdultGen AI may process information through service providers located in different countries. Where required, AdultGen AI will use appropriate safeguards for international transfers.
        </p>
      </InfoSection>

      <InfoSection title="12. Cookies and analytics">
        <Paragraphs
          items={[
            'AdultGen AI may use cookies or similar technologies for site functionality, security, analytics, and performance measurement.',
            'If non-essential cookies or tracking tools are used, AdultGen AI will provide appropriate notice and consent controls where required.',
          ]}
        />
      </InfoSection>

      <InfoSection title="13. Your rights">
        <p>Depending on your jurisdiction, you may have rights to:</p>
        <BulletList items={rights} />
        <p>To make a privacy request, contact info@adultgen.fun.</p>
      </InfoSection>

      <InfoSection title="14. Minors">
        <Paragraphs
          items={[
            'AdultGen AI is not intended for minors. AdultGen AI does not knowingly collect information from anyone under 18.',
            'If you believe a minor has submitted information to AdultGen AI, contact info@adultgen.fun.',
          ]}
        />
      </InfoSection>

      <InfoSection title="15. Changes to this Policy">
        <p>
          AdultGen AI may update this Privacy Policy from time to time. The updated version will be posted on the website with a revised date.
        </p>
      </InfoSection>

      <InfoSection title="16. Contact">
        <p>For privacy questions or rights requests, contact info@adultgen.fun.</p>
      </InfoSection>
    </PageShell>
  );
}

