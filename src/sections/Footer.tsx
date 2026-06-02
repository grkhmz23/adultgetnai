import BrandLogo from '../components/BrandLogo';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/' },
      { label: 'Private Demo', href: '/contact' },
      { label: 'Investor Deck', href: '/contact' },
      { label: 'Compliance', href: '/content-policy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Content Policy', href: '/content-policy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-[#fbfbfb] border-t border-black/8"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-5">
            <a href="/" className="inline-flex mb-4" aria-label="AdultGen AI home">
              <BrandLogo compact />
            </a>
            <p className="text-sm text-[#888888] max-w-[280px] leading-relaxed mb-6">
              Video-first synthetic media for verified adults. Private by design, synthetic by default, and built with compliance controls from day one.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title} className="md:col-span-2 md:col-start-auto">
              <h4 className="text-sm font-semibold text-[#121212] mb-4 uppercase tracking-wider">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#888888] hover:text-[#121212] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#aaaaaa]">
            &copy; 2026 AdultGen AI. All rights reserved.
          </p>
          <p className="text-xs text-[#aaaaaa]">
            AdultGen is in private development. Public generation is not available on this website.
          </p>
        </div>
      </div>
    </footer>
  );
}
